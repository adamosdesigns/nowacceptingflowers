import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Portfolio } from "./pages/Portfolio";
import { Contact } from "./pages/Contact";
import { CaseStudy } from "./pages/CaseStudy";
import { AdminPortfolio } from "./pages/AdminPortfolio";
import { Cursor } from "./components/Cursor";
import { AccessibilityMenu } from "./components/AccessibilityMenu";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import { CmsProvider } from "./context/CmsContext";

export default function App() {
  return (
    <AccessibilityProvider>
      <CmsProvider>
        <BrowserRouter>
          <Cursor />
          <AccessibilityMenu />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="apply" element={<Contact />} />
              <Route path="work/:slug" element={<CaseStudy />} />
              <Route path="admin" element={<AdminPortfolio />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CmsProvider>
    </AccessibilityProvider>
  );
}
