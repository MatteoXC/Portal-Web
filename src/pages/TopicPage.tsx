import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useContent } from "@/hooks/useContent";
import { ChevronRight, ArrowLeft, FileText, Play, ExternalLink, Download, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { sanitizeHtml } from "@/lib/sanitize";

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const ResourceIcon = ({ type, url }: { type: string; url: string }) => {
  if (type === "video" || url.includes("youtube") || url.includes("youtu.be")) return <Play className="h-5 w-5 text-accent" />;
  if (type === "pdf" || url.endsWith(".pdf")) return <FileText className="h-5 w-5 text-destructive" />;
  if (type === "document" || url.match(/\.(docx?|xlsx?|pptx?|odt)$/i)) return <Download className="h-5 w-5 text-primary" />;
  return <Link2 className="h-5 w-5 text-primary" />;
};

const TopicPage = () => {
  const { temaId = "" } = useParams();
  const { courses, subjects, topics, resources: allResources } = useContent();
  const topic = topics.find((item) => item.id === temaId);
  const subject = topic ? subjects.find((item) => item.id === topic.subject_id) : undefined;
  const course = subject ? courses.find((item) => item.id === subject.course_id) : undefined;
  const resources = topic
    ? allResources.filter((item) => item.topic_id === topic.id).sort((a, b) => a.sort_order - b.sort_order)
    : [];

  if (!topic) {
    return <Layout><div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Tema no encontrado.</p></div></Layout>;
  }

  const embedUrl = topic.video_url ? getYoutubeEmbedUrl(topic.video_url) : "";

  return (
    <Layout>
      <div className="hero-gradient">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-1.5 text-sm text-primary-foreground/70">
            <Link to="/" className="hover:text-primary-foreground">Inicio</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {course && (<><Link to={`/cursos/${course.slug}`} className="hover:text-primary-foreground">{course.name}</Link><ChevronRight className="h-3.5 w-3.5" /></>)}
            {subject && (<><Link to={`/asignaturas/${subject.id}`} className="hover:text-primary-foreground">{subject.name}</Link><ChevronRight className="h-3.5 w-3.5" /></>)}
            <span className="text-primary-foreground">Tema {topic.topic_number}</span>
          </div>
          <p className="text-sm font-medium text-primary-foreground/70">Tema {topic.topic_number} – {subject?.name} – {course?.name}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-primary-foreground sm:text-4xl">{topic.title}</h1>
          {topic.description && <p className="mt-2 text-primary-foreground/80">{topic.description}</p>}
          {topic.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {topic.tags.map((tag, i) => (
                <Badge key={i} className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {subject && <Link to={`/asignaturas/${subject.id}`} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Volver a {subject.name}</Link>}

        {topic.content && (
          <div className="prose prose-slate dark:prose-invert max-w-none rounded-xl border border-border bg-card p-6 sm:p-8 card-shadow [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(topic.content) }} />
        )}

        {embedUrl && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><Play className="h-5 w-5 text-accent" /> Vídeo explicativo</h3>
            <div className="relative w-full overflow-hidden rounded-xl border border-border" style={{ paddingBottom: "56.25%" }}>
              <iframe src={embedUrl} title={topic.title} className="absolute inset-0 h-full w-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
            </div>
          </div>
        )}

        {resources.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground"><Link2 className="h-5 w-5 text-primary" /> Recursos</h3>
            <ul className="space-y-2">
              {resources.map(r => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-muted hover:border-primary/30 card-shadow">
                    <ResourceIcon type={r.resource_type} url={r.url} />
                    <span className="font-medium text-foreground">{r.name}</span>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TopicPage;
