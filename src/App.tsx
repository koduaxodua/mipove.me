import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BottomNav } from "@/components/BottomNav";
import { TopLeftBrand } from "@/components/TopLeftBrand";
import { TopRightLogo } from "@/components/TopRightLogo";
import { SwipeTutorialV2 } from "@/components/SwipeTutorialV2";
import { CookieConsent } from "@/components/CookieConsent";
import { LocaleProvider } from "@/contexts/Locale";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import AddDog from "./pages/AddDog";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import PrivacyKa from "./pages/PrivacyKa";
import NotFound from "./pages/NotFound";
import PetPage from "./pages/PetPage";
import { AboutPage, SafetyPage, HowItWorksPage, SeoGuard } from "./pages/ContentPages";
import { GeorgianLandingPage } from "./pages/GeorgianLandingPage";
import { GuideAdoptPage, GuideLostPage, GuideHelpPage } from "./pages/GuidePages";
import {
  HomePage as HomePageV2,
  AboutPage as AboutPageV2,
  SafetyPage as SafetyPageV2,
  HowItWorksPage as HowItWorksPageV2,
} from "./pages/ContentPagesV2";

const queryClient = new QueryClient();

const APP_CHROME_ROUTES = ['/', '/app', '/favorites', '/add', '/terms', '/ka/privacy'];

function AppChrome() {
  const { pathname } = useLocation();
  const showAppChrome = APP_CHROME_ROUTES.includes(pathname);

  return (
    <>
      {showAppChrome && (
        <>
          <BottomNav />
          <TopLeftBrand />
          <TopRightLogo />
          {['/', '/app'].includes(pathname) && <SwipeTutorialV2 />}
        </>
      )}
      <CookieConsent />
      <SeoGuard />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LocaleProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/2" element={<HomePageV2 />} />
            <Route path="/2/about" element={<AboutPageV2 />} />
            <Route path="/2/safety" element={<SafetyPageV2 />} />
            <Route path="/2/how-it-works" element={<HowItWorksPageV2 />} />
            <Route path="/ka" element={<GeorgianLandingPage />} />
            <Route path="/app" element={<Index />} />
            <Route path="/pet/:id" element={<PetPage />} />
            <Route path="/guide/dzaglis-ayvana" element={<GuideAdoptPage />} />
            <Route path="/guide/dakarguli-cxoveli" element={<GuideLostPage />} />
            <Route path="/guide/miusafari-cxovelis-daxmareba" element={<GuideHelpPage />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/add" element={<AddDog />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/ka/privacy" element={<PrivacyKa />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AppChrome />
      </BrowserRouter>
    </TooltipProvider>
    </LocaleProvider>
  </QueryClientProvider>
);

export default App;
