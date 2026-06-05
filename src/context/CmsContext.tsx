import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  writeBatch 
} from "firebase/firestore";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { db, defaultDb, auth, handleFirestoreError, OperationType } from "../lib/firebase";
import { caseStudies as staticCaseStudies, CaseStudy } from "../data/caseStudies";

interface CmsContextType {
  caseStudies: CaseStudy[];
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  createStudy: (study: CaseStudy) => Promise<void>;
  updateStudy: (slug: string, study: CaseStudy) => Promise<void>;
  deleteStudy: (slug: string) => Promise<void>;
  seedDynamicDatabase: () => Promise<void>;
  quotaExceeded: boolean;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Any Google user logged in gets developer administrative authority
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Case Studies from Firestore with client-side caching to preserve quota
  const fetchCaseStudies = async (forceRefetch = false) => {
    const cacheKey = "naf_casestudies_cache";
    const cacheTimeKey = "naf_casestudies_cache_time";
    const cacheDuration = 5 * 60 * 1000; // 5 minutes in milliseconds

    // Bypass client-side caching if forced, or if user is an administrator, or visiting /admin
    const isAdminPath = typeof window !== "undefined" && window.location.pathname.includes("/admin");
    const shouldBypassCache = forceRefetch || isAdmin || !!user || isAdminPath;

    if (!shouldBypassCache) {
      try {
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTime = localStorage.getItem(cacheTimeKey);
        if (cachedData && cachedTime) {
          const age = Date.now() - parseInt(cachedTime, 10);
          if (age < cacheDuration) {
            console.log("Loading case studies from local client cache (saves Firestore reads)...");
            setCaseStudies(JSON.parse(cachedData));
            setLoading(false);
            setQuotaExceeded(false);
            return;
          }
        }
      } catch (cacheErr) {
        console.warn("Client cache read error:", cacheErr);
      }
    }

    setLoading(true);
    const path = "caseStudies";
    try {
      const q = query(collection(db, path), orderBy("order", "asc"));
      
      // Enforce a strict 2.5s timeout on Firestore reads. If cellular signal is weak,
      // if quota is depleted, or if an ad-blocker stalls the sockets, we fail fast to fallback static data.
      const getDocsPromise = getDocs(q);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error("Firestore fetch timed out (2.5s limit reached)")), 2500)
      );
      
      const snapshot = await Promise.race([getDocsPromise, timeoutPromise]);
      
      if (snapshot.empty) {
        // Checking the default database instance fallback to see if we can recover the user's projects
        console.log("Designated Firestore database is empty. Checking default database instance fallback...");
        let defaultDocs: CaseStudy[] = [];
        try {
          // Check caseStudies in defaultDb with a 1.5s timeout
          const defaultQ = query(collection(defaultDb, "caseStudies"), orderBy("order", "asc"));
          const defaultDocsPromise = getDocs(defaultQ);
          const defaultTimeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Default DB fetch timed out (1.5s limit)")), 1500)
          );
          const defaultSnapshot = await Promise.race([defaultDocsPromise, defaultTimeoutPromise]);
          
          if (!defaultSnapshot.empty) {
            defaultDocs = defaultSnapshot.docs.map(doc => doc.data() as CaseStudy);
            console.log(`Found ${defaultDocs.length} projects in 'caseStudies' collection on the default database.`);
          } else {
            // Also fall back to "projects" collection in defaultDb, just in case
            const projectsQ = query(collection(defaultDb, "projects"), orderBy("order", "asc"));
            const projectsDocsPromise = getDocs(projectsQ);
            const projectsTimeoutPromise = new Promise<never>((_, reject) => 
              setTimeout(() => reject(new Error("Projects collection fetch timed out (1.5s limit)")), 1500)
            );
            const projectsSnapshot = await Promise.race([projectsDocsPromise, projectsTimeoutPromise]);
            
            if (!projectsSnapshot.empty) {
              defaultDocs = projectsSnapshot.docs.map(doc => doc.data() as CaseStudy);
              console.log(`Found ${defaultDocs.length} projects in 'projects' collection on the default database.`);
            }
          }
        } catch (defaultDbErr) {
          console.warn("Could not query default database for fallback:", defaultDbErr);
        }

        if (defaultDocs.length > 0) {
          console.log(`Successfully recovered ${defaultDocs.length} projects from the default database! Automatically copying/migrating them to the newly designated database...`);
          await seedDatabase(defaultDocs);
          setCaseStudies(defaultDocs);
          
          // Save to cache
          try {
            localStorage.setItem(cacheKey, JSON.stringify(defaultDocs));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
          } catch (e) {}
        } else {
          // No case studies in default database either! Let's auto-seed the static ones
          console.log("No previous database records found. Bootstrapping designated database with default static data...");
          await seedDatabase(staticCaseStudies);
          // Refetch after seeding with a 2-second timeout
          const resyncedPromise = getDocs(q);
          const resyncedTimeout = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error("Resynced database fetch timed out (2.0s limit)")), 2000)
          );
          const resyncedSnapshot = await Promise.race([resyncedPromise, resyncedTimeout]);
          const docs = resyncedSnapshot.docs.map(doc => doc.data() as CaseStudy);
          setCaseStudies(docs);

          // Save to cache
          try {
            localStorage.setItem(cacheKey, JSON.stringify(docs));
            localStorage.setItem(cacheTimeKey, Date.now().toString());
          } catch (e) {}
        }
      } else {
        const docs = snapshot.docs.map(doc => doc.data() as CaseStudy);
        
        // Background auto-migration to fix Yuzu's video URL if it still has the older ID
        let modified = false;
        const migratedDocs = docs.map(study => {
          if (study.slug === "yuzu" && study.sections) {
            const nextSections = study.sections.map(sec => {
              if (sec.mediaUrl && sec.mediaUrl.includes("1189896982")) {
                modified = true;
                return { ...sec, mediaUrl: "https://player.vimeo.com/video/1197534423" };
              }
              return sec;
            });
            if (modified) {
              const updatedStudy = { ...study, sections: nextSections };
              // background execution
              setDoc(doc(db, "caseStudies", "yuzu"), {
                ...updatedStudy,
                updatedAt: new Date().toISOString()
              }).catch(err => console.error("Failed to auto-migrate legacy Yuzu video:", err));
              return updatedStudy;
            }
          }
          return study;
        });
        
        setCaseStudies(migratedDocs);
        setQuotaExceeded(false);

        // Save to cache
        try {
          localStorage.setItem(cacheKey, JSON.stringify(migratedDocs));
          localStorage.setItem(cacheTimeKey, Date.now().toString());
        } catch (e) {}
      }
    } catch (error: any) {
      console.warn("Firestore fetch failed, falling back to local static case studies:", error);
      const errMsg = error?.message || String(error);
      if (
        errMsg.toLowerCase().includes("quota") ||
        errMsg.toLowerCase().includes("exhausted") ||
        error?.code === "resource-exhausted"
      ) {
        setQuotaExceeded(true);
      }
      
      // Try to recover from local fallback cache even if expired since we are offline
      try {
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          console.log("Serving expired client cache as emergency offline fallback...");
          setCaseStudies(JSON.parse(cachedData));
          setLoading(false);
          return;
        }
      } catch (cacheErr) {}

      // Fallback gracefully to static local files so the site never breaks
      setCaseStudies(staticCaseStudies);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  // Seed Helper function
  const seedDatabase = async (studiesToSeed: CaseStudy[]) => {
    const path = "caseStudies";
    try {
      const batch = writeBatch(db);
      studiesToSeed.forEach((study, idx) => {
        // Use slug as the document ID because it is unique and URL-friendly
        const docRef = doc(db, path, study.slug);
        const orderedStudy = {
          ...study,
          order: study.order ?? idx,
          updatedAt: new Date().toISOString()
        };
        batch.set(docRef, orderedStudy);
      });
      await batch.commit();
      console.log("Successfully seeded Firestore with default case studies.");
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
  };

  const seedDynamicDatabase = async () => {
    await seedDatabase(staticCaseStudies);
    await fetchCaseStudies(true);
  };

  // Google Login popup
  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Auth sign-in failed:", error);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Auth sign-out failed:", error);
    }
  };

  // Helper to compress a base64 image string to fits Firestore document limits
  const compressImageBase64 = (base64Str: string, maxDim = 1200, quality = 0.70, force = false): Promise<string> => {
    return new Promise((resolve) => {
      // Only compress if it looks like a base64 image and is reasonably large (e.g., > 100kb character length) or forced
      const lengthThreshold = force ? 1000 : 100000;
      if (!base64Str || !base64Str.startsWith("data:image/") || base64Str.length < lengthThreshold) {
        resolve(base64Str);
        return;
      }

      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Force output to JPEG with specified quality level
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  const compressCaseStudy = async (study: CaseStudy): Promise<CaseStudy> => {
    const compressedThumbnail = study.thumbnail ? await compressImageBase64(study.thumbnail) : study.thumbnail;
    
    const compressedSections = study.sections ? await Promise.all(
      study.sections.map(async (sec) => {
        if (!sec.mediaUrl) return sec;
        
        const trimmedMedia = sec.mediaUrl.trim();
        if (trimmedMedia.startsWith("data:image/")) {
          const compressedMediaUrl = await compressImageBase64(sec.mediaUrl);
          return { ...sec, mediaUrl: compressedMediaUrl };
        }
        
        // Handle photography album arrays containing multiple base64 strings
        if (trimmedMedia.startsWith("[")) {
          try {
            const parsed = JSON.parse(trimmedMedia);
            if (Array.isArray(parsed)) {
              const compressedList = await Promise.all(
                parsed.map(async (photoStr) => {
                  if (typeof photoStr === "string" && photoStr.startsWith("data:image/")) {
                    // Compress more aggressively for multi-photo albums to ensure overall payload fits easily within 1MB
                    return await compressImageBase64(photoStr, 800, 0.50, true);
                  }
                  return photoStr;
                })
              );
              return { ...sec, mediaUrl: JSON.stringify(compressedList) };
            }
          } catch (e) {
            console.error("Failed to parse and compress multi-photo album section:", e);
          }
        }
        return sec;
      })
    ) : study.sections;

    return {
      ...study,
      thumbnail: compressedThumbnail,
      sections: compressedSections,
    };
  };

  // CREATE Case Study
  const createStudy = async (study: CaseStudy) => {
    const path = "caseStudies";
    try {
      const compressedStudy = await compressCaseStudy(study);
      const docRef = doc(db, path, compressedStudy.slug);
      const payload = {
        ...compressedStudy,
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload);
      await fetchCaseStudies(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `${path}/${study.slug}`);
    }
  };

  // UPDATE Case Study
  const updateStudy = async (slug: string, study: CaseStudy) => {
    const path = "caseStudies";
    try {
      const compressedStudy = await compressCaseStudy(study);
      const docRef = doc(db, path, slug);
      const payload = {
        ...compressedStudy,
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, payload);
      await fetchCaseStudies(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${path}/${slug}`);
    }
  };

  // DELETE Case Study
  const deleteStudy = async (slug: string) => {
    const path = "caseStudies";
    try {
      const docRef = doc(db, path, slug);
      await deleteDoc(docRef);
      await fetchCaseStudies(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${path}/${slug}`);
    }
  };

  return (
    <CmsContext.Provider value={{
      caseStudies,
      loading,
      user,
      isAdmin,
      signIn,
      logOut,
      createStudy,
      updateStudy,
      deleteStudy,
      seedDynamicDatabase,
      quotaExceeded
    }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const context = useContext(CmsContext);
  if (context === undefined) {
    throw new Error("useCms must be used within a CmsProvider");
  }
  return context;
}
