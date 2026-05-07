import { Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { ContactForm } from "../ContactForm";

export function Layout() {
  const location = useLocation();
  const isApplyPage = location.pathname === '/apply';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      <Navbar />
      <main className={cn(
        "flex-grow",
        isApplyPage ? "pt-[74px] pb-0" : "pt-[74px] pb-24"
      )}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
