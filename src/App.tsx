import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ContentProvider } from "@/hooks/useContent";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import SubjectPage from "./pages/SubjectPage";
import TopicPage from "./pages/TopicPage";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import DepartmentPage from "./pages/DepartmentPage";
import ContactPage from "./pages/ContactPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <ContentProvider>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cursos/:cursoId" element={<CoursePage />} />
            <Route path="/asignaturas/:asignaturaId" element={<SubjectPage />} />
            <Route path="/temas/:temaId" element={<TopicPage />} />
            <Route path="/departamento" element={<DepartmentPage />} />
            <Route path="/recursos" element={<ResourcesPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </ContentProvider>
);

export default App;
