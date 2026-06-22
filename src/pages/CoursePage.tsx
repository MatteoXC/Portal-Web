import { Link, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { useContent } from "@/hooks/useContent";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";

const CoursePage = () => {
  const { cursoId = "" } = useParams();
  const { courses, subjects } = useContent();
  const course = courses.find((item) => item.slug === cursoId || item.id === cursoId);
  const courseSubjects = course
    ? subjects.filter((item) => item.course_id === course.id).sort((a, b) => a.sort_order - b.sort_order)
    : [];

  if (!course) {
    return <Layout><div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Curso no encontrado.</p></div></Layout>;
  }

  return (
    <Layout>
      <div className="hero-gradient">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-1.5 text-sm text-primary-foreground/70">
            <Link to="/" className="hover:text-primary-foreground">Inicio</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-primary-foreground">{course.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">{course.name}</h1>
          <p className="mt-1 text-primary-foreground/80">{courseSubjects.length} asignatura{courseSubjects.length !== 1 ? "s" : ""} disponibles</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Volver al inicio</Link>
        {courseSubjects.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">Este curso todavía no tiene asignaturas.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courseSubjects.map((subject) => (
              <Link key={subject.id} to={`/asignaturas/${subject.id}`} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-6 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-0.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><BookOpen className="h-5 w-5 text-primary" /></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">{subject.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">Ver temas y recursos</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CoursePage;
