import React, { useState, useEffect } from "react";
import { parsePhotos } from "../components/PhotographyCarousel";
import { useCms } from "../context/CmsContext";
import { CaseStudy, CaseStudySection } from "../data/caseStudies";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut, 
  LogIn, 
  Save, 
  X, 
  ArrowLeft, 
  Database,
  ArrowRight,
  Eye,
  Settings,
  Grid,
  Upload,
  Image as ImageIcon,
  FileUp,
  Link as LinkIcon,
  Tag,
  Sparkles,
  Layers,
  FolderOpen,
  Video,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { Link } from "react-router-dom";

function cleanAndExtractMediaUrl(url: string): string {
  if (!url) return "";
  let target = url.trim();
  
  // Extract iframe src if they pasted an iframe embed code or similar HTML
  if (target.includes("<iframe") || target.includes("<blockquote") || target.includes("<div") || target.includes("<a ")) {
    const srcMatch = target.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      target = srcMatch[1].replace(/&amp;/g, "&");
    } else {
      const hrefMatch = target.match(/href=["']([^"']+)["']/i);
      if (hrefMatch && hrefMatch[1]) {
        target = hrefMatch[1].replace(/&amp;/g, "&");
      }
    }
  }
  
  return target.trim();
}

export function AdminPortfolio() {
  const { 
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
  } = useCms();

  // Active Workspace Navigation Tab
  const [activeTab, setActiveTab] = useState<"upload" | "clients" | "all-deliverables">("upload");
  
  // Status Messages
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ==================== TAB 1: UPLOAD DELIVERABLE STATE ====================
  const [selectedClientSlug, setSelectedClientSlug] = useState<string>("");
  
  // Inline New Client Registration fields
  const [newClientName, setNewClientName] = useState("");
  const [newClientSlug, setNewClientSlug] = useState("");
  const [newClientIndustry, setNewClientIndustry] = useState("");
  const [newClientDescription, setNewClientDescription] = useState("");
  const [newClientThumbnail, setNewClientThumbnail] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800");

  // Deliverable fields
  const [delivTitle, setDelivTitle] = useState("");
  const [delivService, setDelivService] = useState("");
  const [delivType, setDelivType] = useState<"video" | "logo" | "website" | "menu" | "social" | "branding" | "photography" | "graphics">("video");
  const [delivAspectRatio, setDelivAspectRatio] = useState<"16:9" | "9:16" | "1:1" | "4:5">("16:9");
  const [delivMediaUrl, setDelivMediaUrl] = useState("");
  const [delivDescription, setDelivDescription] = useState("");
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [editPhotoUrlInput, setEditPhotoUrlInput] = useState("");

  // ==================== TAB 2: CLIENT REGISTRY STATE ====================
  const [editingClient, setEditingClient] = useState<CaseStudy | null>(null);
  const [editingAsset, setEditingAsset] = useState<{
    studySlug: string;
    studyName: string;
    sectionIndex: number;
    title: string;
    serviceName: string;
    description: string;
    type: "video" | "logo" | "website" | "menu" | "social" | "branding" | "photography" | "graphics";
    aspectRatio: "16:9" | "9:16" | "1:1" | "4:5";
    mediaUrl: string;
  } | null>(null);

  // Direct CRM client creation states
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [crmClientName, setCrmClientName] = useState("");
  const [crmClientSlug, setCrmClientSlug] = useState("");
  const [crmClientIndustry, setCrmClientIndustry] = useState("");
  const [crmClientDescription, setCrmClientDescription] = useState("");
  const [crmClientThumbnail, setCrmClientThumbnail] = useState("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800");

  const handleCrmClientNameChange = (val: string) => {
    setCrmClientName(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setCrmClientSlug(generated);
  };

  const handleCreateClientProfileDirect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const brandKey = crmClientSlug.trim();
    if (!brandKey) {
      setErrorMsg("Brand URL Slug is strictly required to register a brand.");
      return;
    }
    if (!crmClientName.trim() || !crmClientIndustry.trim() || !crmClientDescription.trim()) {
      setErrorMsg("Name, Industry, and Partnership Narrative are required.");
      return;
    }

    const isSlugTaken = caseStudies.find(study => study.slug === brandKey);
    if (isSlugTaken) {
      setErrorMsg(`The slug ID "${brandKey}" is already taken by "${isSlugTaken.name}". Please choose a distinct URL key.`);
      return;
    }

    const newStudy: CaseStudy = {
      slug: brandKey,
      name: crmClientName.trim(),
      industry: crmClientIndustry.trim(),
      description: crmClientDescription.trim(),
      thumbnail: crmClientThumbnail || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
      sections: [],
      order: caseStudies.length
    };

    try {
      await createStudy(newStudy);
      setSuccessMsg(`Brand profile "${newStudy.name}" successfully registered under slug "${brandKey}". You can now upload deliverables for this client.`);
      setIsCreatingClient(false);
      
      // Reset form fields
      setCrmClientName("");
      setCrmClientSlug("");
      setCrmClientIndustry("");
      setCrmClientDescription("");
      setCrmClientThumbnail("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800");
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  // Set default client selection once data has loaded
  useEffect(() => {
    if (caseStudies) {
      if (caseStudies.length > 0) {
        if (!selectedClientSlug || (selectedClientSlug !== "__NEW__" && !caseStudies.some(s => s.slug === selectedClientSlug))) {
          setSelectedClientSlug(caseStudies[0].slug);
        }
      } else {
        setSelectedClientSlug("__NEW__");
      }
    }
  }, [caseStudies, selectedClientSlug]);

  // Helper for automatic slug generation
  const handleNewClientNameChange = (val: string) => {
    setNewClientName(val);
    const generated = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    setNewClientSlug(generated);
  };

  // Base64 File Encoding Helper with Intelligent Image Compression to fit Firestore limits
  const handleBase64Upload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onCompleted: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg("");
    setSuccessMsg("");

    // Check if the file is an image that we can compress
    const isImage = file.type.startsWith("image/");

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (!resultStr) return;

      if (isImage) {
        // Create an Image object to load and compress
        const img = new Image();
        img.src = resultStr;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Target maximum size for web-optimized case studies
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width > height) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            
            // Output as JPEG with 0.75 compression quality to drastically reduce file size while keeping high visual clarity
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
            
            // Validate the compressed size
            const estimatedBytes = Math.round((compressedBase64.length * 3) / 4);
            if (estimatedBytes > 1024 * 1024 * 0.95) {
              setErrorMsg(`Compressed image is still too large (${(estimatedBytes / (1024 * 1024)).toFixed(2)} MB). Please upload a smaller resolution file, or paste an external hosting link.`);
            } else {
              setSuccessMsg(`Image optimized & compressed successfully! Reduced from ${(file.size / (1024 * 1024)).toFixed(2)} MB to ${(estimatedBytes / 1024).toFixed(0)} KB for instant database loading.`);
            }
            
            onCompleted(compressedBase64);
          } else {
            // Fallback to original
            onCompleted(resultStr);
          }
        };
        img.onerror = () => {
          onCompleted(resultStr);
        };
      } else {
        // Not a compressible image format (or a video/other), check standard size
        if (file.size > 1024 * 1024 * 0.95) {
          setErrorMsg("File size exceeds 950KB and cannot be written directly to Firestore document database. Recommend hosting films/graphics externally and pasting their links.");
        }
        onCompleted(resultStr);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Failed to parse and decode the uploaded file asset.");
    };
    reader.readAsDataURL(file);
  };

  // ==================== SUBMIT DELIVERABLE CAPTURE ====================
  const handlePublishDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!delivTitle.trim()) {
      setErrorMsg("Deliverable asset title represents the work identity and is strictly required.");
      return;
    }

    const compiledServiceLabel = delivService.trim() || delivType.charAt(0).toUpperCase() + delivType.slice(1);
    
    const cleanMediaUrl = cleanAndExtractMediaUrl(delivMediaUrl.trim()) || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800";
    
    const newSection: CaseStudySection = {
      num: "01", // overwritten below depending on placement
      title: delivTitle.trim(),
      serviceName: compiledServiceLabel,
      description: delivDescription.trim() || "Asset deliverable created as part of professional client solution.",
      type: delivType,
      aspectRatio: delivAspectRatio,
      mediaUrl: cleanMediaUrl
    };

    const activeClientSlug = selectedClientSlug || (caseStudies && caseStudies.length > 0 ? caseStudies[0].slug : "");

    try {
      if (activeClientSlug === "__NEW__" || !activeClientSlug) {
        // Registering a brand brand new Client Profile inline
        const brandKey = newClientSlug.trim();
        if (!brandKey) {
          setErrorMsg("Brand URL Slug is strictly required for registering a new client profile.");
          return;
        }
        if (!newClientName.trim() || !newClientIndustry.trim() || !newClientDescription.trim()) {
          setErrorMsg("All client profile overview schemas (Name, Industry, Overview) are strictly required to register a brand new profile.");
          return;
        }

        const isSlugTaken = caseStudies.find(study => study.slug === brandKey);
        if (isSlugTaken) {
          setErrorMsg(`The slug ID "${brandKey}" is already taken by "${isSlugTaken.name}". Please choose a distinct URL key.`);
          return;
        }

        const newStudy: CaseStudy = {
          slug: brandKey,
          name: newClientName.trim(),
          industry: newClientIndustry.trim(),
          description: newClientDescription.trim(),
          thumbnail: newClientThumbnail || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
          sections: [newSection],
          order: caseStudies.length
        };

        await createStudy(newStudy);
        setSuccessMsg(`"${newStudy.name}" client profile registered, and the deliverable "${newSection.title}" has been successfully appended.`);
        
        // Reset client registrations state & return to first client index
        setNewClientName("");
        setNewClientSlug("");
        setNewClientIndustry("");
        setNewClientDescription("");
        setNewClientThumbnail("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800");
        setSelectedClientSlug(brandKey);
      } else {
        // Appending to an existing Client Profile
        const targetStudy = caseStudies.find(study => study.slug === activeClientSlug);
        if (!targetStudy) {
          setErrorMsg("The selected client profile was not found in the database.");
          return;
        }

        const currentSections = targetStudy.sections || [];
        const nextNum = String(currentSections.length + 1).padStart(2, "0");
        const updatedSection = { ...newSection, num: nextNum };

        const updatedStudy: CaseStudy = {
          ...targetStudy,
          sections: [...currentSections, updatedSection]
        };

        await updateStudy(activeClientSlug, updatedStudy);
        setSuccessMsg(`Deliverable "${newSection.title}" successfully uploaded and tagged under "${targetStudy.name}".`);
      }

      // Reset deliverable specifications
      setDelivTitle("");
      setDelivService("");
      setDelivMediaUrl("");
      setDelivDescription("");
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  // ==================== DELIVERABLES REGISTRY HANDLERS ====================
  const handleRemoveSingleAsset = async (clientSlug: string, sectionIndex: number, sectionTitle: string) => {
    if (!window.confirm(`Are you absolutely sure you want to permanently remove deliverable asset "${sectionTitle}"?`)) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const study = caseStudies.find(s => s.slug === clientSlug);
      if (!study) {
        setErrorMsg("Selected client not found in CMS database.");
        return;
      }
      
      const updatedSections = study.sections
        .filter((_, idx) => idx !== sectionIndex)
        .map((sec, idx) => ({
          ...sec,
          num: String(idx + 1).padStart(2, "0")
        }));
      
      const updatedStudy = { ...study, sections: updatedSections };
      await updateStudy(clientSlug, updatedStudy);
      setSuccessMsg(`Asset "${sectionTitle}" was successfully removed from ${study.name}'s profile.`);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleSaveAssetPayloadChanges = async () => {
    if (!editingAsset) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const study = caseStudies.find(s => s.slug === editingAsset.studySlug);
      if (!study) {
        setErrorMsg("Selected client not found in CMS database.");
        return;
      }
      
      const updatedSects = [...(study.sections || [])];
      if (editingAsset.sectionIndex < 0 || editingAsset.sectionIndex >= updatedSects.length) {
        setErrorMsg("Target section index out of bounds.");
        return;
      }
      
      const cleanMediaUrlVal = cleanAndExtractMediaUrl(editingAsset.mediaUrl.trim());
      
      updatedSects[editingAsset.sectionIndex] = {
        num: updatedSects[editingAsset.sectionIndex].num || String(editingAsset.sectionIndex + 1).padStart(2, "0"),
        title: editingAsset.title.trim(),
        serviceName: editingAsset.serviceName.trim() || editingAsset.type.charAt(0).toUpperCase() + editingAsset.type.slice(1),
        description: editingAsset.description.trim(),
        type: editingAsset.type,
        aspectRatio: editingAsset.aspectRatio,
        mediaUrl: cleanMediaUrlVal || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
      };
      
      const updatedStudy = { ...study, sections: updatedSects };
      await updateStudy(editingAsset.studySlug, updatedStudy);
      setSuccessMsg(`Deliverable section "${editingAsset.title}" successfully updated for profile "${study.name}".`);
      setEditingAsset(null);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  // ==================== EDIT DYNAMIC CLIENT PROFILE IN TAB 2 ====================
  const handleSaveClientProfileChanges = async () => {
    if (!editingClient) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await updateStudy(editingClient.slug, editingClient);
      setSuccessMsg(`Client Profile metadata for "${editingClient.name}" successfully updated.`);
      setEditingClient(null);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDeleteClientCompletely = async (slug: string, name: string) => {
    if (!window.confirm(`Are you sure you want to completely erase Client Profile "${name}"? This deletes all associated sections and media deliverables permanently.`)) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await deleteStudy(slug);
      setSuccessMsg(`Client profile "${name}" successfully deleted.`);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleReorderClient = async (currentIndex: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= caseStudies.length) return;

    setErrorMsg("");
    setSuccessMsg("");

    const currentClient = caseStudies[currentIndex];
    const targetClient = caseStudies[targetIndex];

    try {
      // Get orders, falling back to index positions if not set
      const currentOrder = typeof currentClient.order === "number" ? currentClient.order : currentIndex;
      const targetOrder = typeof targetClient.order === "number" ? targetClient.order : targetIndex;

      // Fallback swap: if they have duplicates or no order yet, make sure they have a proper offset
      let nextCurrentOrder = targetOrder;
      let nextTargetOrder = currentOrder;
      if (nextCurrentOrder === nextTargetOrder) {
        nextCurrentOrder = targetIndex;
        nextTargetOrder = currentIndex;
      }

      await updateStudy(currentClient.slug, {
        ...currentClient,
        order: nextCurrentOrder
      });

      await updateStudy(targetClient.slug, {
        ...targetClient,
        order: nextTargetOrder
      });

      setSuccessMsg(`Order of "${currentClient.name}" has been successfully shifted ${direction}!`);
    } catch (err: any) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  // Automatic media aspects defaults depending on category selection
  const handleTypeChange = (type: "video" | "logo" | "website" | "menu" | "social" | "branding" | "photography" | "graphics") => {
    setDelivType(type);
    if (type === "video") {
      setDelivAspectRatio("9:16"); // Reels, vertical
    } else if (type === "graphics") {
      setDelivAspectRatio("4:5"); // Graphics portrait aspect
    } else if (type === "branding" || type === "logo" || type === "social") {
      setDelivAspectRatio("1:1"); // Squares
    } else {
      setDelivAspectRatio("16:9"); // Wide screens
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal text-offwhite flex items-center justify-center font-mono">
        <div className="text-center">
          <Database className="animate-spin text-accent mx-auto mb-4" size={40} />
          <p className="text-sm tracking-widest text-offwhite/60">LOADING CMS WORKSPACE...</p>
        </div>
      </div>
    );
  }

  // Authentication Boundary Gate
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-charcoal text-offwhite flex items-center justify-center px-6 py-24">
        <div className="max-w-md w-full bg-divider/5 border border-divider/10 rounded-3xl p-8 md:p-12 text-center shadow-xl">
          <span className="text-accent text-xs uppercase tracking-[0.4em] block mb-4">Secure Gateway</span>
          <h1 className="text-4xl font-bebas uppercase leading-none tracking-wide mb-3">Portfolio CMS</h1>
          <p className="text-sm text-offwhite/60 leading-relaxed mb-8">
            This workspace provides dynamic database integration to update your portfolio case studies. Please sign in with an authorized account.
          </p>

          {quotaExceeded && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs rounded-xl font-mono text-left space-y-2 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
                <Sparkles size={14} />
                <span>Firestore Quota Limits Reached</span>
              </div>
              <p>
                Your database projects are **completely safe** in Firestore, but Google's free-tier Spark plan daily read quota has been temporarily reached.
              </p>
              <p>
                The site has automatically activated offline local fallback data to keep everything functional. Dynamic updates will resume as soon as Google resets the quota tomorrow.
              </p>
              <a
                href="https://console.firebase.google.com/project/gen-lang-client-0727970567/firestore/databases/ai-studio-0effce24-db4a-453b-a18c-b007a7f36c03/data?openUpgradeDialog=true"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-accent hover:underline font-bold uppercase tracking-wider text-[10px]"
              >
                <span>View Live Database Console</span>
                <ArrowRight size={10} />
              </a>
            </div>
          )}

          {!user ? (
            <button
              onClick={signIn}
              className="w-full bg-accent text-charcoal py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors flex items-center justify-center gap-3"
            >
              <LogIn size={18} />
              <span>Login with Google</span>
            </button>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-green-500/15 border border-green-500/30 text-green-400 text-xs rounded-xl leading-relaxed font-mono">
                Successfully authorized as developer admin with WRITE authority <strong className="text-white">({user.email})</strong>.
              </div>
              <button
                onClick={logOut}
                className="w-full border border-divider/20 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors flex items-center justify-center gap-3"
              >
                <LogOut size={16} />
                <span>Disconnect session</span>
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-divider/10">
            <Link to="/" className="inline-flex items-center gap-2 text-offwhite/40 text-xs hover:text-accent transition-colors">
              <ArrowLeft size={14} />
              <span>Return to Public Site</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Derived Flattened Catalog of deliverables
  const flatDeliverablesList = caseStudies.flatMap(study => 
    (study.sections || []).map((sec, index) => ({
      studyName: study.name,
      studySlug: study.slug,
      studyThumbnail: study.thumbnail,
      sectionIndex: index,
      ...sec
    }))
  );

  return (
    <div className="min-h-screen bg-charcoal text-offwhite py-32 px-6 lg:px-[48px] selection:bg-accent selection:text-charcoal">
      <div className="max-w-7xl mx-auto">
        
        {/* Core Control Board Header Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-divider/25">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-accent text-xs uppercase tracking-[0.3em] font-bold">CMS CONTROLLER</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bebas uppercase leading-none tracking-normal">WORK CONTROL BOARD</h1>
            <p className="text-xs font-mono text-offwhite/40">ADMIN IDENT: {user.email}</p>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={logOut}
              className="border border-divider/20 hover:bg-white/5 text-offwhite px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Exit CMS</span>
            </button>
          </div>
        </div>

        {quotaExceeded && (
          <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm rounded-2xl animate-fade font-mono flex flex-col gap-3">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-400">
              <Sparkles size={16} className="animate-pulse" />
              <span>Google Firestore Daily Read Quota Limit Exceeded</span>
            </div>
            <p className="text-xs leading-relaxed text-offwhite/80">
              Your customized projects and deliverables are <strong>completely safe and untouched</strong> in the database! However, because this Firebase instance runs on Google's free Spark plan, it has temporarily reached its daily API read limit (restored daily by Google).
            </p>
            <p className="text-xs leading-relaxed text-offwhite/80">
              The application has automatically activated our high-fidelity offline fallback drafts to ensure the website remains online, beautifully presented, and fully functional for visitors. CMS controls and database saving operations will resume as soon as Google resets the quota tomorrow.
            </p>
            <div>
              <a
                href="https://console.firebase.google.com/project/gen-lang-client-0727970567/firestore/databases/ai-studio-0effce24-db4a-453b-a18c-b007a7f36c03/data?openUpgradeDialog=true"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline uppercase tracking-widest font-bold"
              >
                <span>View Live Database on Firebase Console</span>
                <ArrowRight size={12} className="mt-0.5" />
              </a>
            </div>
          </div>
        )}

        {/* Dynamic Success Alert */}
        {successMsg && (
          <div className="mb-8 p-5 bg-green-500/10 border border-green-500/25 text-green-400 text-sm rounded-xl flex justify-between items-start animate-fade">
            <span className="font-mono">{successMsg}</span>
            <button onClick={() => setSuccessMsg("")} className="text-red-500 hover:text-red-400 font-extrabold p-1 transition-all"><X size={16} /></button>
          </div>
        )}

        {/* Dynamic Error Alert */}
        {errorMsg && (
          <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl flex justify-between items-start font-mono animate-fade">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg("")} className="text-red-500 hover:text-red-400 font-extrabold p-1 transition-all"><X size={16} /></button>
          </div>
        )}

        {/* MODE CONTROLLER DIAL (TABS) */}
        {!editingClient && !editingAsset && (
          <div className="flex flex-wrap gap-2 mb-10 border-b border-divider/10 pb-4">
            <button
              onClick={() => { setActiveTab("upload"); setSuccessMsg(""); setErrorMsg(""); }}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "upload" 
                  ? "bg-accent text-charcoal shadow-lg shadow-accent/10" 
                  : "border border-divider/10 hover:border-accent/40 text-offwhite/70"
              }`}
            >
              <FileUp size={14} />
              <span>Upload Project Deliverable</span>
            </button>

            <button
              onClick={() => { setActiveTab("clients"); setSuccessMsg(""); setErrorMsg(""); }}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "clients" 
                  ? "bg-accent text-charcoal shadow-lg shadow-accent/10" 
                  : "border border-divider/10 hover:border-accent/40 text-offwhite/70"
              }`}
            >
              <Layers size={14} />
              <span>Manage Client Profiles ({caseStudies.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab("all-deliverables"); setSuccessMsg(""); setErrorMsg(""); }}
              className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "all-deliverables" 
                  ? "bg-accent text-charcoal shadow-lg shadow-accent/10" 
                  : "border border-divider/10 hover:border-accent/40 text-offwhite/70"
              }`}
            >
              <FolderOpen size={14} />
              <span>Deliverables Catalogue ({flatDeliverablesList.length})</span>
            </button>
          </div>
        )}

        {/* WORKSPACE AREA */}
        {editingAsset ? (
          /* ======================== EDIT DEDICATED DELIVERABLE FLOW ======================== */
          <div className="bg-divider/5 border border-divider/10 rounded-3xl p-8 md:p-12 animate-fade text-left">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-divider/10">
              <div>
                <span className="text-accent text-xs font-mono uppercase tracking-widest block mb-1">DELIVERABLE WORKSPACE</span>
                <h2 className="text-4xl font-bebas uppercase tracking-wide">Editing Deliverable</h2>
                <p className="text-xs text-offwhite/50 font-mono">Assigned under <span className="text-accent">{editingAsset.studyName}</span></p>
              </div>
              
              <button
                onClick={() => setEditingAsset(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-red-500 hover:text-red-400 font-bold transition-colors"
              >
                <X size={16} />
                <span>Discard Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Asset variables */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                      Deliverable Name / Title
                    </label>
                    <input
                      type="text"
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3.5 text-sm text-offwhite focus:border-accent outline-none"
                      placeholder="e.g. Otoro Identity Guideline"
                      value={editingAsset.title}
                      onChange={e => setEditingAsset({ ...editingAsset, title: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                      Service / Discipline Label
                    </label>
                    <input
                      type="text"
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3.5 text-sm text-offwhite focus:border-accent outline-none"
                      placeholder="e.g. Brand Architecture"
                      value={editingAsset.serviceName}
                      onChange={e => setEditingAsset({ ...editingAsset, serviceName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                      Asset format / type
                    </label>
                    <select
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3.5 text-sm text-offwhite focus:border-accent outline-none font-mono"
                      value={editingAsset.type}
                      onChange={e => {
                        const nextType = e.target.value as any;
                        let nextAspect = editingAsset.aspectRatio;
                        if (nextType === "video") {
                          nextAspect = "9:16";
                        } else if (nextType === "graphics") {
                          nextAspect = "4:5";
                        } else if (nextType === "branding" || nextType === "logo" || nextType === "social") {
                          nextAspect = "1:1";
                        } else {
                          nextAspect = "16:9";
                        }
                        setEditingAsset({ ...editingAsset, type: nextType, aspectRatio: nextAspect });
                      }}
                    >
                      <option value="video">Video</option>
                      <option value="branding">Brand Identity</option>
                      <option value="website">Websites</option>
                      <option value="photography">Photography</option>
                      <option value="graphics">Graphics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                      Creative Aspect Ratio Framing
                    </label>
                    <select
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3.5 text-sm text-offwhite focus:border-accent outline-none font-mono"
                      value={editingAsset.aspectRatio}
                      onChange={e => setEditingAsset({ ...editingAsset, aspectRatio: e.target.value as any })}
                    >
                      <option value="16:9">Widescreen Theater (16:9)</option>
                      <option value="9:16">Portrait Focus (9:16)</option>
                      <option value="1:1">Classic Square (1:1)</option>
                      <option value="4:5">Portrait Standard (4:5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                    Creative Backing Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-charcoal border border-divider/25 rounded-xl p-4 text-xs text-offwhite focus:border-accent outline-none resize-none leading-relaxed"
                    placeholder="Provide a meticulous description for this precise creative asset deliverable..."
                    value={editingAsset.description}
                    onChange={e => setEditingAsset({ ...editingAsset, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Column B: Media file link & upload */}
              <div className="lg:col-span-4 space-y-6">
                {editingAsset.type === "photography" || editingAsset.type === "graphics" ? (
                  <div className="p-4 bg-charcoal/60 border border-divider/20 rounded-xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-divider/10">
                      <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                        {editingAsset.type === "graphics" ? "Graphics Gallery" : "Photography Album"} ({parsePhotos(editingAsset.mediaUrl).length} Items)
                      </span>
                    </div>

                    {parsePhotos(editingAsset.mediaUrl).length > 0 ? (
                      (() => {
                        const photos = parsePhotos(editingAsset.mediaUrl);
                        return (
                          <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                            {photos.map((photo, pIdx) => (
                              <div key={pIdx} className="relative aspect-video rounded border border-divider/15 bg-black/40 group overflow-hidden">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-10">
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      title="Remove Photo"
                                      onClick={() => {
                                        const updated = photos.filter((_, idx) => idx !== pIdx);
                                        setEditingAsset({ ...editingAsset, mediaUrl: JSON.stringify(updated) });
                                      }}
                                      className="p-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center justify-between w-full gap-1">
                                    <button
                                      type="button"
                                      title="Move Back"
                                      disabled={pIdx === 0}
                                      onClick={() => {
                                        if (pIdx === 0) return;
                                        const updated = [...photos];
                                        const temp = updated[pIdx];
                                        updated[pIdx] = updated[pIdx - 1];
                                        updated[pIdx - 1] = temp;
                                        setEditingAsset({ ...editingAsset, mediaUrl: JSON.stringify(updated) });
                                      }}
                                      className="p-1 rounded bg-charcoal hover:bg-accent hover:text-charcoal text-offwhite disabled:opacity-30 disabled:hover:bg-charcoal disabled:hover:text-offwhite transition-colors flex-1 flex items-center justify-center border border-divider/10"
                                    >
                                      <ArrowLeft size={11} />
                                    </button>
                                    
                                    <span className="text-[9px] font-mono font-bold text-center flex-1 bg-black/60 rounded py-0.5 text-offwhite/80 select-none">
                                      {pIdx + 1}
                                    </span>
                                    
                                    <button
                                      type="button"
                                      title="Move Forward"
                                      disabled={pIdx === photos.length - 1}
                                      onClick={() => {
                                        if (pIdx === photos.length - 1) return;
                                        const updated = [...photos];
                                        const temp = updated[pIdx];
                                        updated[pIdx] = updated[pIdx + 1];
                                        updated[pIdx + 1] = temp;
                                        setEditingAsset({ ...editingAsset, mediaUrl: JSON.stringify(updated) });
                                      }}
                                      className="p-1 rounded bg-charcoal hover:bg-accent hover:text-charcoal text-offwhite disabled:opacity-30 disabled:hover:bg-charcoal disabled:hover:text-offwhite transition-colors flex-1 flex items-center justify-center border border-divider/10"
                                    >
                                      <ArrowRight size={11} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="py-8 border border-dashed border-divider/10 rounded-lg text-center font-mono text-[9px] text-offwhite/30 uppercase tracking-widest">
                        No photos added yet. Upload or link below.
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Link photo URL (e.g. Unsplash)"
                          className="flex-1 bg-charcoal border border-divider/30 rounded-lg px-3 py-2 text-xs text-offwhite font-mono focus:border-accent outline-none"
                          value={editPhotoUrlInput}
                          onChange={e => setEditPhotoUrlInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!editPhotoUrlInput.trim()) return;
                            const photos = parsePhotos(editingAsset.mediaUrl);
                            const updated = [...photos, editPhotoUrlInput.trim()];
                            setEditingAsset({ ...editingAsset, mediaUrl: JSON.stringify(updated) });
                            setEditPhotoUrlInput("");
                          }}
                          className="bg-accent/15 hover:bg-accent text-accent hover:text-charcoal border border-accent/20 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-colors"
                        >
                          Add URL
                        </button>
                      </div>

                      <div className="relative bg-accent/10 border border-dashed border-accent/25 hover:bg-accent/15 transition-colors h-[32px] rounded-lg flex items-center justify-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={e => {
                            if (e.target.files) {
                              Array.from(e.target.files).forEach(file => {
                                const tempEvent = {
                                  target: {
                                    files: [file]
                                  }
                                } as any;
                                handleBase64Upload(tempEvent, (base64) => {
                                  setEditingAsset(curr => {
                                    if (!curr) return null;
                                    const photos = parsePhotos(curr.mediaUrl);
                                    return {
                                      ...curr,
                                      mediaUrl: JSON.stringify([...photos, base64])
                                    };
                                  });
                                });
                              });
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-accent text-[9px] font-mono uppercase tracking-widest font-extrabold">
                          <Upload size={12} />
                          <span>{editingAsset.type === "graphics" ? "Upload Multi-Graphics" : "Upload Multi-Photos"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                        Cloud Media URL or Pasted HTML Embed Code
                      </label>
                      <textarea
                        rows={3}
                        className="w-full bg-charcoal border border-divider/25 rounded-xl p-4 text-xs text-offwhite focus:border-accent outline-none font-mono resize-none leading-normal mb-3"
                        placeholder="Enter Unsplash, Vimeo, YouTube link or paste <iframe...> embed code"
                        value={editingAsset.mediaUrl}
                        onChange={e => setEditingAsset({ ...editingAsset, mediaUrl: e.target.value })}
                      />

                      {/* Base64 Direct Upload Alternative */}
                      <div className="mt-2 text-center">
                        <label className="cursor-pointer inline-flex items-center gap-1 bg-[#111] hover:bg-[#1b1b1b] border border-divider/20 hover:border-accent/40 rounded-xl px-4 py-3 text-xs font-mono text-offwhite transition-all w-full justify-center">
                          <Upload size={13} className="text-accent" />
                          <span>Upload direct offline file (Base64)</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={e => handleBase64Upload(e, (base64) => setEditingAsset({ ...editingAsset, mediaUrl: base64 }))}
                          />
                        </label>
                        <p className="text-[9px] font-mono text-offwhite/30 mt-2">Maximum file allocation: 4MB offline direct cache.</p>
                      </div>
                    </div>

                    {/* Media preview area */}
                    {editingAsset.mediaUrl && (() => {
                      const cleanDraftUrl = cleanAndExtractMediaUrl(editingAsset.mediaUrl);
                      return (
                        <div className="space-y-2">
                          <span className="block text-[9px] font-mono text-offwhite/40 uppercase tracking-widest">Active Media Preview</span>
                          <div className="rounded-xl border border-divider/15 bg-black/40 overflow-hidden relative aspect-video flex items-center justify-center">
                            {cleanDraftUrl.startsWith("data:video/") || /\.(mp4|webm|mov)(\?|$)/i.test(cleanDraftUrl) ? (
                              <video src={cleanDraftUrl} controls className="w-full h-full object-cover" />
                            ) : cleanDraftUrl.includes("youtube") || cleanDraftUrl.includes("youtu.be") || cleanDraftUrl.includes("vimeo") ? (
                              <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                                <Video size={16} className="text-accent" />
                                <span className="text-[10px] font-mono text-offwhite/80">Streaming Embed Recognized</span>
                                <span className="text-[8px] font-mono text-accent/60 truncate max-w-[200px]">{cleanDraftUrl}</span>
                              </div>
                            ) : (
                              <img src={cleanDraftUrl} alt="Asset Prevue" className="w-full h-full object-cover" />
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            </div>

            {/* Editing triggers */}
            <div className="border-t border-divider/10 pt-8 mt-12 flex justify-end gap-3">
              <button
                onClick={() => setEditingAsset(null)}
                className="border border-divider/20 hover:bg-white/5 px-6 py-3 rounded-xl text-xs uppercase font-bold tracking-wider"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveAssetPayloadChanges}
                className="bg-accent text-charcoal px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors inline-flex items-center gap-2"
              >
                <Save size={14} />
                <span>Save Asset Changes</span>
              </button>
            </div>
          </div>
        ) : editingClient ? (
          /* ======================== EDIT DEDICATED CLIENT FLOW ======================== */
          <div className="bg-divider/5 border border-divider/10 rounded-3xl p-8 md:p-12 animate-fade text-left">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8 pb-4 border-b border-divider/10">
              <div>
                <span className="text-accent text-xs font-mono uppercase tracking-widest block mb-1">CLIENT PROFILE WORKSPACE</span>
                <h2 className="text-4xl font-bebas uppercase tracking-wide">Editing {editingClient.name}</h2>
              </div>
              
              <button
                onClick={() => setEditingClient(null)}
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase text-red-500 hover:text-red-400 font-bold transition-colors"
              >
                <X size={16} />
                <span>Discard Changes</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
              {/* Profile variables */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Company / Client Name</label>
                    <input
                      type="text"
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none"
                      value={editingClient.name}
                      onChange={e => setEditingClient({ ...editingClient, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Industry Vertical Tag</label>
                    <input
                      type="text"
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none"
                      value={editingClient.industry}
                      onChange={e => setEditingClient({ ...editingClient, industry: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Partnership Narrative Overview</label>
                  <textarea
                    rows={6}
                    className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none resize-none leading-relaxed"
                    value={editingClient.description}
                    onChange={e => setEditingClient({ ...editingClient, description: e.target.value })}
                  />
                </div>
              </div>

              {/* Master image thumbnail setup */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Master Profile Image</label>
                  <input
                    type="text"
                    className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-xs text-offwhite font-mono focus:border-accent outline-none mb-3"
                    value={editingClient.thumbnail}
                    onChange={e => setEditingClient({ ...editingClient, thumbnail: e.target.value })}
                  />
                  
                  <div className="relative bg-accent/5 border border-dashed border-accent/25 hover:bg-accent/10 h-[42px] rounded-xl flex items-center justify-center cursor-pointer mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleBase64Upload(e, (base64) => setEditingClient({ ...editingClient, thumbnail: base64 }))}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center gap-2 text-accent text-xs font-mono font-bold uppercase tracking-widest">
                      <Upload size={14} />
                      <span>Choose New Logo</span>
                    </div>
                  </div>

                  {editingClient.thumbnail && (
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-divider/10 bg-black/40">
                      <img src={editingClient.thumbnail} alt="Profile Master View" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Nested block re-alignment inside client */}
            <div className="border-t border-divider/15 pt-8 mt-8">
              <h3 className="text-xl font-bebas uppercase tracking-wider mb-6">Chronological deliverable segments on profile</h3>
              
              {(!editingClient.sections || editingClient.sections.length === 0) ? (
                <div className="p-8 border border-dashed border-divider/20 text-center rounded-xl text-xs font-mono uppercase tracking-widest text-offwhite/30">
                  No deliverables attached to this client yet. Use the project asset upload page to add one.
                </div>
              ) : (
                <div className="space-y-6">
                  {editingClient.sections.map((sect, sectIdx) => (
                    <div key={sectIdx} className="bg-charcoal/40 border border-divider/10 rounded-xl p-5 flex flex-col md:flex-row gap-5 items-center justify-between">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        <span className="w-8 h-8 rounded-full bg-accent/15 text-accent border border-accent/20 font-mono text-xs flex items-center justify-center shrink-0">
                          {sect.num}
                        </span>
                        
                        <div className="text-left">
                          <h4 className="text-sm font-mono font-bold uppercase text-offwhite">{sect.title}</h4>
                          <span className="text-[10px] font-mono text-offwhite/40 block mt-0.5">{sect.serviceName} • {sect.type.toUpperCase()} • {sect.aspectRatio}</span>
                        </div>
                      </div>

                      <div className="flex gap-4 items-center w-full md:w-auto justify-end shrink-0">
                        <input
                          type="text"
                          placeholder="Change Title"
                          className="bg-charcoal border border-divider/20 rounded-md px-3 py-1.5 text-xs text-offwhite focus:border-accent outline-none"
                          value={sect.title}
                          onChange={e => {
                            const newSects = [...editingClient.sections];
                            newSects[sectIdx].title = e.target.value;
                            setEditingClient({ ...editingClient, sections: newSects });
                          }}
                        />

                        <button
                          onClick={() => {
                            const filtered = editingClient.sections.filter((_, subIdx) => subIdx !== sectIdx)
                              .map((item, subIdx) => ({ ...item, num: String(subIdx + 1).padStart(2, "0") }));
                            setEditingClient({ ...editingClient, sections: filtered });
                          }}
                          className="text-red-400 hover:text-red-300 p-2 border border-divider/10 rounded hover:border-red-500/20"
                          title="Erase segment from profile"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Editing triggers */}
            <div className="border-t border-divider/10 pt-8 mt-12 flex justify-end gap-3">
              <button
                onClick={() => setEditingClient(null)}
                className="border border-divider/20 hover:bg-white/5 px-6 py-3 rounded-xl text-xs uppercase font-bold tracking-wider"
              >
                Cancel
              </button>
              
              <button
                onClick={handleSaveClientProfileChanges}
                className="bg-accent text-charcoal px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors inline-flex items-center gap-2"
              >
                <Save size={14} />
                <span>Secure Client Changes</span>
              </button>
            </div>
          </div>
        ) : activeTab === "upload" ? (
          /* ======================== TAB 1: UPLOAD DELIVERABLE HANDLER ======================== */
          <form onSubmit={handlePublishDeliverable} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fade">
            
            {/* Column A: Client profiling setup */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-divider/5 border border-divider/10 rounded-2xl p-6 md:p-8 space-y-6 h-full flex flex-col">
                <div className="flex items-center gap-2 pb-3 border-b border-divider/10">
                  <Tag className="text-accent" size={16} />
                  <h3 className="text-sm font-mono uppercase tracking-widest text-offwhite font-bold">1. Target Client Profile</h3>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2.5">
                    Which brand profile owns this deliverable?
                  </label>
                  <select
                    className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3.5 text-sm text-offwhite focus:border-accent outline-none font-mono"
                    value={selectedClientSlug}
                    onChange={e => setSelectedClientSlug(e.target.value)}
                  >
                    {!selectedClientSlug && <option value="" disabled>-- Select target client brand --</option>}
                    {caseStudies.map(s => (
                      <option key={s.slug} value={s.slug}>{s.name} ({s.industry})</option>
                    ))}
                    <option value="__NEW__">[+] Register a Brand New Client Profile...</option>
                  </select>
                </div>

                {/* Conditional Register new Client Details inline form */}
                {selectedClientSlug === "__NEW__" && (
                  <div className="border border-accent/25 bg-accent/[0.02] p-5 rounded-2xl space-y-5 animate-fade max-w-full">
                    <div className="flex items-center gap-2 text-accent">
                      <Sparkles size={14} />
                      <span className="text-[10px] font-mono tracking-widest uppercase font-extrabold">NEW PROFILE DETAILS</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono text-offwhite/50 uppercase tracking-widest mb-1.5">Brand / Client Name *</label>
                        <input
                          type="text"
                          placeholder="e.g. Yuzu Hospitality"
                          className="w-full bg-charcoal border border-divider/30 rounded-xl px-3 py-2 text-xs text-offwhite outline-none focus:border-accent"
                          value={newClientName}
                          onChange={e => handleNewClientNameChange(e.target.value)}
                          required={selectedClientSlug === "__NEW__"}
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-mono text-offwhite/50 uppercase tracking-widest mb-1.5">Brand Slug ID *</label>
                        <input
                          type="text"
                          placeholder="lowercase format with hyphens"
                          className="w-full bg-charcoal border border-divider/30 rounded-xl px-3 py-2 text-xs text-offwhite outline-none focus:border-accent font-mono"
                          value={newClientSlug}
                          onChange={e => setNewClientSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                          required={selectedClientSlug === "__NEW__"}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-offwhite/50 uppercase tracking-widest mb-1.5">Industry Categorization *</label>
                      <input
                        type="text"
                        placeholder="e.g. Fine Sushi & Asian Mixology"
                        className="w-full bg-charcoal border border-divider/30 rounded-xl px-3 py-2 text-xs text-offwhite outline-none focus:border-accent"
                        value={newClientIndustry}
                        onChange={e => setNewClientIndustry(e.target.value)}
                        required={selectedClientSlug === "__NEW__"}
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-mono text-offwhite/50 uppercase tracking-widest mb-1.5">Partnership Overview Narrative *</label>
                      <textarea
                        rows={3}
                        placeholder="Explain the brand challenge, aesthetic direction, and core delivery achievements..."
                        className="w-full bg-charcoal border border-divider/30 rounded-xl px-3 py-2 text-xs text-offwhite outline-none focus:border-accent resize-none leading-relaxed"
                        value={newClientDescription}
                        onChange={e => setNewClientDescription(e.target.value)}
                        required={selectedClientSlug === "__NEW__"}
                      />
                    </div>

                    {/* Master logo file for profile thumbnail */}
                    <div>
                      <label className="block text-[9px] font-mono text-offwhite/50 uppercase tracking-widest mb-1.5">Client Card Logo Asset</label>
                      <input
                        type="text"
                        className="w-full bg-charcoal border border-divider/30 rounded-xl px-3 py-1.5 text-[10px] text-offwhite font-mono focus:border-accent outline-none mb-2"
                        value={newClientThumbnail}
                        onChange={e => setNewClientThumbnail(e.target.value)}
                      />
                      
                      <div className="relative bg-accent/10 border border-dashed border-accent/20 hover:bg-accent/15 transition-colors h-[32px] rounded-lg flex items-center justify-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleBase64Upload(e, (base64) => setNewClientThumbnail(base64))}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <span className="text-accent text-[9px] font-mono font-bold uppercase tracking-wider">Upload Main Card Image</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-[11px] font-mono text-offwhite/30 leading-normal bg-charcoal/10 rounded-xl p-4 border border-divider/5 mt-auto">
                  💡 <strong>Dynamic Client Profile Connection</strong>: Individual project uploads like social graphics, websites, and logos are grouped under Client Profiles. The Client profile overview details will carry through dynamically to each selected deliverable automatically!
                </div>
              </div>
            </div>

            {/* Column B: Deliverable details setup */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-divider/5 border border-divider/10 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-divider/10">
                  <Sparkles className="text-accent" size={16} />
                  <h3 className="text-sm font-mono uppercase tracking-widest text-offwhite font-bold">2. Deliverable (Project Asset) Details</h3>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Deliverable Title / Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Chiefs Brand Mark Redesign"
                    className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none"
                    value={delivTitle}
                    onChange={e => setDelivTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Service Tag line (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Logo & Visual Identity"
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none"
                      value={delivService}
                      onChange={e => setDelivService(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Category Media Type</label>
                    <select
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none font-mono"
                      value={delivType}
                      onChange={e => handleTypeChange(e.target.value as any)}
                    >
                      <option value="video">Video</option>
                      <option value="branding">Brand Identity</option>
                      <option value="website">Websites</option>
                      <option value="photography">Photography</option>
                      <option value="graphics">Graphics</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Aspect Ratio Display Scale</label>
                    <select
                      className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none font-mono"
                      value={delivAspectRatio}
                      onChange={e => setDelivAspectRatio(e.target.value as any)}
                    >
                      <option value="16:9">16:9 Cinema Landscape</option>
                      <option value="9:16">9:16 Tiktok / Vertical Story</option>
                      <option value="1:1">1:1 Square block</option>
                      <option value="4:5">4:5 Portrait Feed Standard</option>
                    </select>
                  </div>

                  {/* Dummy height aspect preview info */}
                  <div className="bg-charcoal/40 border border-divider/10 rounded-xl p-3 flex flex-col justify-center text-center">
                    <span className="text-[9px] font-mono text-offwhite/30 uppercase tracking-widest block mb-1">PROPORTIONAL PREVIEW BOX</span>
                    <div className="mx-auto border border-accent/20 rounded bg-accent/5 flex items-center justify-center text-[10px] font-mono text-accent" style={{
                      width: delivAspectRatio === "16:9" ? "64px" : delivAspectRatio === "9:16" ? "36px" : delivAspectRatio === "4:5" ? "38px" : "48px",
                      height: delivAspectRatio === "16:9" ? "36px" : delivAspectRatio === "9:16" ? "64px" : delivAspectRatio === "4:5" ? "48px" : "48px",
                    }}>
                      {delivAspectRatio}
                    </div>
                  </div>
                </div>

                {/* Media assets setup: Direct URL paste combined with File Pick Base64 encoding */}
                {delivType === "photography" || delivType === "graphics" ? (
                  <div className="p-4 bg-charcoal/60 border border-divider/20 rounded-xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-divider/10">
                      <span className="text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                        {delivType === "graphics" ? "Graphics Gallery" : "Photography Album"} ({parsePhotos(delivMediaUrl).length} Items)
                      </span>
                    </div>

                    {parsePhotos(delivMediaUrl).length > 0 ? (
                      (() => {
                        const photos = parsePhotos(delivMediaUrl);
                        return (
                          <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                            {photos.map((photo, pIdx) => (
                              <div key={pIdx} className="relative aspect-video rounded border border-divider/15 bg-black/40 group overflow-hidden">
                                <img src={photo} alt="" className="w-full h-full object-cover" />
                                
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5 z-10">
                                  <div className="flex justify-end">
                                    <button
                                      type="button"
                                      title="Remove Photo"
                                      onClick={() => {
                                        const updated = photos.filter((_, idx) => idx !== pIdx);
                                        setDelivMediaUrl(JSON.stringify(updated));
                                      }}
                                      className="p-1 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  </div>
                                  
                                  <div className="flex items-center justify-between w-full gap-1">
                                    <button
                                      type="button"
                                      title="Move Back"
                                      disabled={pIdx === 0}
                                      onClick={() => {
                                        if (pIdx === 0) return;
                                        const updated = [...photos];
                                        const temp = updated[pIdx];
                                        updated[pIdx] = updated[pIdx - 1];
                                        updated[pIdx - 1] = temp;
                                        setDelivMediaUrl(JSON.stringify(updated));
                                      }}
                                      className="p-1 rounded bg-charcoal hover:bg-accent hover:text-charcoal text-offwhite disabled:opacity-30 disabled:hover:bg-charcoal disabled:hover:text-offwhite transition-colors flex-1 flex items-center justify-center border border-divider/10"
                                    >
                                      <ArrowLeft size={11} />
                                    </button>
                                    
                                    <span className="text-[9px] font-mono font-bold text-center flex-1 bg-black/60 rounded py-0.5 text-offwhite/80 select-none">
                                      {pIdx + 1}
                                    </span>
                                    
                                    <button
                                      type="button"
                                      title="Move Forward"
                                      disabled={pIdx === photos.length - 1}
                                      onClick={() => {
                                        if (pIdx === photos.length - 1) return;
                                        const updated = [...photos];
                                        const temp = updated[pIdx];
                                        updated[pIdx] = updated[pIdx + 1];
                                        updated[pIdx + 1] = temp;
                                        setDelivMediaUrl(JSON.stringify(updated));
                                      }}
                                      className="p-1 rounded bg-charcoal hover:bg-accent hover:text-charcoal text-offwhite disabled:opacity-30 disabled:hover:bg-charcoal disabled:hover:text-offwhite transition-colors flex-1 flex items-center justify-center border border-divider/10"
                                    >
                                      <ArrowRight size={11} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()
                    ) : (
                      <div className="py-6 border border-dashed border-divider/10 rounded-lg text-center font-mono text-[9px] text-offwhite/30 uppercase tracking-widest">
                        No photos added yet. Upload or link below.
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Link photo URL (e.g. Unsplash)"
                          className="flex-1 bg-charcoal border border-divider/30 rounded-lg px-3 py-2 text-xs text-offwhite font-mono focus:border-accent outline-none"
                          value={photoUrlInput}
                          onChange={e => setPhotoUrlInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!photoUrlInput.trim()) return;
                            const photos = parsePhotos(delivMediaUrl);
                            const updated = [...photos, photoUrlInput.trim()];
                            setDelivMediaUrl(JSON.stringify(updated));
                            setPhotoUrlInput("");
                          }}
                          className="bg-accent/15 hover:bg-accent text-accent hover:text-charcoal border border-accent/20 px-3 rounded-lg text-xs font-mono font-bold uppercase transition-colors"
                        >
                          Add URL
                        </button>
                      </div>

                      <div className="relative bg-accent/10 border border-dashed border-accent/25 hover:bg-accent/15 transition-colors h-[32px] rounded-lg flex items-center justify-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={e => {
                            if (e.target.files) {
                              Array.from(e.target.files).forEach(file => {
                                const tempEvent = {
                                  target: {
                                    files: [file]
                                  }
                                } as any;
                                handleBase64Upload(tempEvent, (base64) => {
                                  setDelivMediaUrl(curr => {
                                    const photos = parsePhotos(curr);
                                    return JSON.stringify([...photos, base64]);
                                  });
                                });
                              });
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-accent text-[9px] font-mono uppercase tracking-widest font-extrabold">
                          <Upload size={12} />
                          <span>{delivType === "graphics" ? "Upload Multi-Graphics" : "Upload Multi-Photos"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-charcoal/60 border border-divider/20 rounded-xl space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-1.5">Asset source media url</label>
                      <input
                        type="text"
                        placeholder="Paste direct .mp4, Youtube, Vimeo, Instagram embed or image link"
                        className="w-full bg-charcoal border border-divider/30 rounded-lg px-3 py-2 text-xs text-offwhite font-mono focus:border-accent outline-none"
                        value={delivMediaUrl}
                        onChange={e => setDelivMediaUrl(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-offwhite/30 uppercase tracking-wider font-bold shrink-0">OR ENCODE DIRECT FILE:</span>
                      <div className="relative flex-1 bg-accent/10 border border-dashed border-accent/25 hover:bg-accent/15 transition-colors h-[32px] rounded-lg flex items-center justify-center cursor-pointer">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={e => handleBase64Upload(e, (base64) => setDelivMediaUrl(base64))}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex items-center gap-1.5 text-accent text-[9px] font-mono uppercase tracking-widest font-extrabold">
                          <Upload size={12} />
                          <span>Upload File</span>
                        </div>
                      </div>
                    </div>

                    {delivMediaUrl && (() => {
                      const cleanDraftUrl = cleanAndExtractMediaUrl(delivMediaUrl);
                      return (
                        <div className="p-2.5 bg-black/40 border border-divider/10 rounded-lg flex items-center gap-3">
                          <div className="w-12 h-12 bg-divider/10 rounded overflow-hidden flex items-center justify-center shrink-0 border border-divider/15">
                            {cleanDraftUrl.startsWith("data:video/") || /\.(mp4|webm|mov)(\?|$)/i.test(cleanDraftUrl) ? (
                              <div className="text-[8px] font-mono text-accent">VIDEO</div>
                            ) : cleanDraftUrl.includes("youtube") || cleanDraftUrl.includes("youtu.be") || cleanDraftUrl.includes("vimeo") ? (
                              <div className="text-[8px] font-mono text-accent">PLAYER</div>
                            ) : (
                              <img src={cleanDraftUrl} alt="Deliverable draft" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-[9px] font-mono text-offwhite/40 truncate flex-1 leading-none">
                            {cleanDraftUrl.startsWith("data:") ? "Local Direct Client Asset Embedded (Base64)" : cleanDraftUrl}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Deliverable Story/Context (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Explain the visual solution style, the production approach, or client outcome..."
                    className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none resize-none leading-relaxed"
                    value={delivDescription}
                    onChange={e => setDelivDescription(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-accent text-charcoal px-8 py-4 rounded-xl text-xs font-extrabold uppercase tracking-widest hover:bg-white transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <Tag size={14} />
                    <span>Publish Deliverable Asset</span>
                  </button>
                </div>
              </div>
            </div>

          </form>
        ) : activeTab === "clients" ? (
          /* ======================== TAB 2: MANAGE CLIENT INSTANCES ======================== */
          <div className="space-y-6 animate-fade text-left">
            
            {/* Header Controls for Direct Client Profile Creation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-divider/10 bg-charcoal/50 p-6 rounded-2xl">
              <div>
                <h3 className="text-2xl font-bebas uppercase tracking-wider text-offwhite">Client Profiles Registry</h3>
                <p className="text-xs font-mono text-offwhite/40">Construct direct branding client profiles, manage portfolios, or map new projects.</p>
              </div>
              {!isCreatingClient && (
                <button
                  type="button"
                  onClick={() => { setIsCreatingClient(true); setSuccessMsg(""); setErrorMsg(""); }}
                  className="bg-accent hover:bg-white text-charcoal px-5 py-3 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-colors flex items-center gap-2 self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>Register Client Profile</span>
                </button>
              )}
            </div>

            {/* Direct CRM Client Registration Accordion Form */}
            {isCreatingClient && (
              <form 
                onSubmit={handleCreateClientProfileDirect}
                className="bg-accent/[0.02] border border-accent/25 rounded-2xl p-6 md:p-8 space-y-6 text-left animate-fade relative max-w-4xl"
              >
                <div className="flex items-center justify-between pb-3 border-b border-divider/10">
                  <div className="flex items-center gap-2 text-accent">
                    <Sparkles size={16} />
                    <h3 className="text-sm font-mono uppercase tracking-widest font-extrabold">Creative Brand Profiling Setup</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreatingClient(false)}
                    className="text-red-500 hover:text-red-400 transition-colors p-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Brand / Client Name *</label>
                      <input
                        type="text"
                        placeholder="e.g. Yuzu Hospitality"
                        className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none font-mono"
                        value={crmClientName}
                        onChange={e => handleCrmClientNameChange(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Brand URL Slug ID *</label>
                      <input
                        type="text"
                        placeholder="lowercase-format"
                        className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none font-mono"
                        value={crmClientSlug}
                        onChange={e => setCrmClientSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Industry Categorization *</label>
                      <input
                        type="text"
                        placeholder="e.g. Fine Sushi & Asian Mixology"
                        className="w-full bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none font-mono"
                        value={crmClientIndustry}
                        onChange={e => setCrmClientIndustry(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Partnership Overview Narrative *</label>
                      <textarea
                        rows={4}
                        placeholder="Explain the brand challenge, aesthetic direction, and core delivery achievements..."
                        className="w-full bg-charcoal border border-divider/25 rounded-xl p-4 text-sm text-offwhite focus:border-accent outline-none font-mono resize-none leading-relaxed"
                        value={crmClientDescription}
                        onChange={e => setCrmClientDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-offwhite/40 uppercase tracking-widest mb-2">Client Card Logo Asset / Image Cover URL</label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          placeholder="https://..."
                          className="flex-1 bg-charcoal border border-divider/25 rounded-xl px-4 py-3 text-sm text-offwhite focus:border-accent outline-none font-mono"
                          value={crmClientThumbnail}
                          onChange={e => setCrmClientThumbnail(e.target.value)}
                        />
                        <label className="bg-divider/10 hover:bg-divider/20 text-offwhite px-4 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-colors inline-flex items-center justify-center cursor-pointer font-mono select-none">
                          <FileUp size={14} className="mr-1.5" />
                          <span>LOGO</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleBase64Upload(e, setCrmClientThumbnail)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-divider/10">
                  <button
                    type="button"
                    onClick={() => setIsCreatingClient(false)}
                    className="border border-divider/25 hover:border-offwhite/45 text-offwhite px-6 py-2.5 rounded-xl text-xs uppercase font-bold tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent text-charcoal px-6 py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider hover:bg-white transition-colors"
                  >
                    Create Client Profile
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
              {/* Creator Card inside Grid */}
              {!isCreatingClient && (
                <button
                  type="button"
                  onClick={() => { setIsCreatingClient(true); setSuccessMsg(""); setErrorMsg(""); }}
                  className="bg-divider/5 hover:bg-accent/[0.03] border-2 border-dashed border-divider/20 hover:border-accent/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 transition-all duration-300 group min-h-[350px]"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus size={28} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bebas uppercase tracking-wider text-accent">Register New Brand</h4>
                    <p className="text-xs text-offwhite/50 max-w-[200px] mt-2 font-light">Create a client identity profile directly, then map cinematic project deliverables.</p>
                  </div>
                </button>
              )}

              {caseStudies.map((s, idx) => (
                <div 
                  key={s.slug} 
                  className="bg-divider/5 border border-divider/10 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[16/10] w-full bg-divider/10 relative overflow-hidden">
                      <img 
                        src={s.thumbnail} 
                        alt={s.name} 
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" 
                      />
                      <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-md border border-divider/10 px-3 py-1 rounded-full text-[9px] font-mono uppercase tracking-widest font-bold text-accent">
                        {s.industry}
                      </div>

                      <div className="absolute top-4 right-4 flex gap-1 bg-charcoal/85 backdrop-blur-md border border-divider/10 p-1 rounded-lg z-20">
                        <button
                          onClick={() => handleReorderClient(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 hover:bg-white/10 text-offwhite hover:text-accent rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move project up"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleReorderClient(idx, "down")}
                          disabled={idx === caseStudies.length - 1}
                          className="p-1 hover:bg-white/10 text-offwhite hover:text-accent rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                          title="Move project down"
                        >
                          <ArrowDown size={12} />
                        </button>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 bg-charcoal/90 px-2.5 py-1 rounded border border-divider/10 text-[9px] font-mono uppercase tracking-wider text-offwhite/65">
                        {s.sections?.length || 0} Assets Loaded
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-2xl font-bebas uppercase tracking-normal mb-1">{s.name}</h4>
                      <p className="text-[10px] font-mono text-accent uppercase tracking-widest mb-3">/work/{s.slug}</p>
                      <p className="text-xs text-offwhite/50 leading-relaxed font-light line-clamp-3">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-0 flex gap-2 border-t border-divider/5 bg-charcoal/30">
                    <button
                      onClick={() => setEditingClient(s)}
                      className="flex-1 border border-divider/20 hover:border-accent hover:text-accent py-2.5 rounded-xl text-xs uppercase font-extrabold tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit3 size={12} />
                      <span>Configure Portfolio</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClientCompletely(s.slug, s.name)}
                      className="border border-red-500/10 hover:border-red-500/30 text-red-400 hover:bg-red-400/5 px-3 py-2.5 rounded-xl text-xs uppercase font-bold transition-colors"
                      title="Erase client completely"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ======================== TAB 3: FLAT ASSET REGISTRY ======================== */
          <div className="bg-divider/5 border border-divider/10 rounded-2xl p-6 lg:p-8 animate-fade text-left">
            <div className="mb-6">
              <h3 className="text-2xl font-bebas uppercase tracking-wider">Indexed deliverables catalogue</h3>
              <p className="text-xs font-mono text-offwhite/40">Inspect and adjust any single project deliverable uploaded to the platform in a flat catalogue grid.</p>
            </div>

            {flatDeliverablesList.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-divider/15 rounded-xl">
                <span className="text-xs font-mono text-offwhite/30 uppercase tracking-widest">No deliverables are registered in the cloud database.</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-divider/20 text-offwhite/40 uppercase tracking-widest">
                      <th className="py-4 px-4 font-normal">Asset Preview</th>
                      <th className="py-4 px-4 font-normal">Deliverable Name</th>
                      <th className="py-4 px-4 font-normal">Format/Type</th>
                      <th className="py-4 px-4 font-normal">Target Client</th>
                      <th className="py-4 px-4 font-normal text-right">Catalogue Operations</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flatDeliverablesList.map((asset, idx) => (
                      <tr key={idx} className="border-b border-divider/10 hover:bg-white/[0.01] transition-colors">
                        {/* Thumbnail graphic helper */}
                        <td className="py-3 px-4">
                          {(() => {
                            const cleanAssetUrl = cleanAndExtractMediaUrl(asset.mediaUrl || "");
                            return (
                              <div className="w-12 h-9 rounded bg-[#111] border border-divider/15 overflow-hidden flex items-center justify-center">
                                {cleanAssetUrl.startsWith("data:video/") || /\.(mp4|webm|mov)(\?|$)/i.test(cleanAssetUrl) ? (
                                  <div className="text-[8px] font-mono text-accent">VIDEO</div>
                                ) : cleanAssetUrl.includes("youtube") || cleanAssetUrl.includes("vimeo") || cleanAssetUrl.includes("youtu.be") ? (
                                  <div className="text-[8px] font-mono text-accent">PLAYER</div>
                                ) : (
                                  <img src={cleanAssetUrl || asset.studyThumbnail} alt={asset.title} className="w-full h-full object-cover" />
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* Deliverable names */}
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-offwhite uppercase text-[13px]">{asset.title}</span>
                            <span className="block mt-0.5 text-[10px] text-offwhite/40">{asset.serviceName}</span>
                          </div>
                        </td>

                        {/* Categories format */}
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-[9px] uppercase tracking-wider">
                            {asset.type}
                          </span>
                        </td>

                        {/* Client links */}
                        <td className="py-3 px-4 text-offwhite/60">
                          <span className="font-bold uppercase text-accent">{asset.studyName}</span>
                        </td>

                        {/* Simple operations trigger */}
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingAsset({
                              studySlug: asset.studySlug,
                              studyName: asset.studyName,
                              sectionIndex: asset.sectionIndex,
                              title: asset.title,
                              serviceName: asset.serviceName,
                              description: asset.description || "",
                              type: asset.type,
                              aspectRatio: asset.aspectRatio,
                              mediaUrl: asset.mediaUrl
                            })}
                            className="text-accent hover:text-white hover:bg-accent/10 p-2 rounded transition-colors inline-flex"
                            title="Edit deliverable content, ratio, and media"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveSingleAsset(asset.studySlug, asset.sectionIndex, asset.title)}
                            className="text-red-400 hover:text-red-100 hover:bg-red-400/10 p-2 rounded transition-colors inline-flex"
                            title="Erase deliverable from client profile"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Tips Panel */}
        <div className="mt-12 bg-divider/3 border border-divider/10 rounded-2xl p-6 text-xs text-offwhite/40 leading-relaxed text-left">
          <div className="flex items-center gap-2 text-accent uppercase font-mono font-bold tracking-widest mb-2">
            <Settings size={14} />
            <span>Meticulous Portfolio CMS Rules</span>
          </div>
          <p>
            - <strong>Tucked Profile Architecture</strong>: When uploading a logo today, a commercial video tomorrow, or a custom menu card, they are saved as discrete deliverable assets indexed inside their host Client Profiles in Firestore automatically.
            <br />
            - <strong>Inline On-The-Fly Registration</strong>: If the client does not yet exist, you can select "[+] Register a Brand New Client Profile..." on the fly inside the Upload form.
            <br />
            - <strong>High-Contrast Visual Media Preview</strong>: Media links support direct video, YouTube URLs, Vimeo URLs, and Instagram post links.
          </p>
        </div>

      </div>
    </div>
  );
}
