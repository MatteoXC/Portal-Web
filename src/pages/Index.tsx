import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import CourseCard from "@/components/CourseCard";
import { useContent } from "@/hooks/useContent";
import { BookOpen, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { courses } = useContent();
  const orderedCourses = [...courses].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <Layout>
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="mb-2 inline-flex items-center gap-2 text-primary">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Oferta educativa</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Nuestros cursos</h2>
            <p className="mt-2 text-muted-foreground">Explora las asignaturas del Departamento de Tecnología</p>
          </div>
          <Button asChild size="lg" className="gap-2">
            <Link to="/admin/login"><KeyRound className="h-5 w-5" /> Acceso profesores</Link>
          </Button>
        </div>

        {orderedCourses.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">Todavía no hay cursos publicados.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {orderedCourses.map((course) => <CourseCard key={course.id} course={course} />)}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Index;
