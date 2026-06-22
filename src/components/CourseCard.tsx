import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Course, useContent } from "@/hooks/useContent";

const CourseCard = ({ course }: { course: Course }) => {
  const { subjects } = useContent();
  const courseSubjects = subjects
    .filter((subject) => subject.course_id === course.id)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="group rounded-xl border border-border bg-card p-5 card-shadow transition-all duration-200 hover:card-shadow-hover hover:-translate-y-0.5">
      <Link to={`/cursos/${course.slug}`} className="hover:text-primary">
        <h3 className="mb-1 text-lg font-bold text-foreground">{course.name}</h3>
      </Link>
      <p className="mb-3 text-xs text-muted-foreground">
        {courseSubjects.length} asignatura{courseSubjects.length !== 1 ? "s" : ""}
      </p>
      <ul className="space-y-1.5">
        {courseSubjects.map((subject) => (
          <li key={subject.id}>
            <Link to={`/asignaturas/${subject.id}`} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
              <ChevronRight className="h-3.5 w-3.5 text-primary" />
              {subject.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseCard;
