import { useParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useContent } from "@/hooks/useContent";
import { ChevronRight, ArrowLeft, FileText, Play, BookOpen, ExternalLink, Download, Link2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { sanitizeHtml } from "@/lib/sanitize";

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};

const ResourceIcon = ({ type, url }: { type: string; url: string }) => {
  if (type === "video" || url.includes("youtube") || url.includes("youtu.be")) return <Play className="h-4 w-4 text-accent" />;
  if (type === "pdf" || url.endsWith(".pdf")) return <FileText className="h-4 w-4 text-destructive" />;
  if (type === "document" || url.match(/\.(docx?|xlsx?|pptx?|odt)$/i)) return <Download className="h-4 w-4 text-primary" />;
  return <Link2 className="h-4 w-4 text-primary" />;
};

const SubjectPage = () => {
  const { asignaturaId = "" } = useParams();
  const { courses, subjects, topics: allTopics, resources } = useContent();
  const subject = subjects.find((item) => item.id === asignaturaId || item.slug === asignaturaId);
  const course = subject ? courses.find((item) => item.id === subject.course_id) : undefined;
  const topics = subject
    ? allTopics.filter((item) => item.subject_id === subject.id).sort((a, b) => a.topic_number - b.topic_number)
    : [];

  if (!subject) {
    return <Layout><div className="flex min-h-[50vh] items-center justify-center"><p className="text-muted-foreground">Asignatura no encontrada.</p></div></Layout>;
  }

  const getTopicResources = (topicId: string) => resources.filter(r => r.topic_id === topicId);

  return (
    <Layout>
      <div className="hero-gradient">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-1.5 text-sm text-primary-foreground/70">
            <Link to="/" className="hover:text-primary-foreground">Inicio</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {course && (<><Link to={`/cursos/${course.slug}`} className="hover:text-primary-foreground">{course.name}</Link><ChevronRight className="h-3.5 w-3.5" /></>)}
            <span className="text-primary-foreground">{subject.name}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">{subject.name}</h1>
          <p className="mt-1 text-primary-foreground/80">{course?.name} — {topics.length} tema{topics.length !== 1 ? "s" : ""}</p>
        </div>
      </div>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link to={course ? `/cursos/${course.slug}` : "/"} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"><ArrowLeft className="h-3.5 w-3.5" /> Volver a {course?.name || "Inicio"}</Link>
        {topics.length === 0 ? (
          <EmptyState />
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {topics.map((topic) => {
              const topicResources = getTopicResources(topic.id);
              const embedUrl = topic.video_url ? getYoutubeEmbedUrl(topic.video_url) : "";
              return (
                <AccordionItem key={topic.id} value={topic.id} className="rounded-xl border border-border bg-card px-5 card-shadow">
                  <AccordionTrigger className="gap-3 py-4 hover:no-underline">
                    <div className="flex flex-1 items-center justify-between gap-3 text-left">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">{topic.topic_number}</span>
                        <div>
                          <span className="font-semibold text-foreground">{topic.title}</span>
                          {topic.description && <p className="text-xs text-muted-foreground">{topic.description}</p>}
                        </div>
                      </div>
                      {topic.tags && topic.tags.length > 0 && (
                        <div className="hidden sm:flex flex-wrap gap-1 mr-2">
                          {topic.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pb-3 pt-1">
                      {topic.tags && topic.tags.length > 0 && (
                        <div className="flex sm:hidden flex-wrap gap-1">
                          {topic.tags.map((tag, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {topic.content && (
                        <div className="prose prose-sm dark:prose-invert max-w-none rounded-lg border border-border bg-muted/30 p-4 [&_h2]:text-foreground [&_h3]:text-foreground [&_p]:text-muted-foreground [&_li]:text-muted-foreground [&_strong]:text-foreground" dangerouslySetInnerHTML={{ __html: sanitizeHtml(topic.content) }} />
                      )}

                      {embedUrl && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"><Play className="h-4 w-4 text-accent" /> Vídeo explicativo</h4>
                          <div className="relative w-full overflow-hidden rounded-xl border border-border" style={{ paddingBottom: "56.25%" }}>
                            <iframe src={embedUrl} title={topic.title} className="absolute inset-0 h-full w-full" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                          </div>
                        </div>
                      )}

                      {topicResources.length > 0 && (
                        <div>
                          <h4 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground"><Link2 className="h-4 w-4 text-primary" /> Recursos</h4>
                          <ul className="space-y-1.5">
                            {topicResources.map(r => (
                              <li key={r.id}>
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors hover:bg-muted hover:border-primary/30">
                                  <ResourceIcon type={r.resource_type} url={r.url} />
                                  <span className="font-medium text-foreground">{r.name}</span>
                                  <ExternalLink className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Link to={`/temas/${topic.id}`} className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">
                        <BookOpen className="h-4 w-4" /> Ver tema completo
                      </Link>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </Layout>
  );
};

const EmptyState = () => (
  <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-12 text-center card-shadow">
    <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
    <h3 className="text-lg font-semibold text-foreground">Próximamente materiales disponibles</h3>
    <p className="mt-1 text-sm text-muted-foreground">Estamos preparando los contenidos. ¡Vuelve pronto!</p>
  </div>
);

export default SubjectPage;
