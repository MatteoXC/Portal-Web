import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Course, Resource, Subject, Topic, useContent } from "@/hooks/useContent";
import { LogOut, BookOpen, FileText, FolderOpen, Link2, Plus, Pencil, Trash2, Save, X, Tag } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const isSafePublicUrl = (value: string) => {
  try {
    const url = new URL(value, window.location.origin);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

type EditingItem = Partial<Course & Subject & Topic & Resource>;
type TopicDraft = Omit<Partial<Topic>, "tags"> & { tags: string[] };
type NewResourceDraft = Pick<Resource, "name" | "url" | "resource_type">;

const AdminPanel = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading, signOut } = useAuth();
  const {
    courses, subjects, topics, resources,
    loading: contentLoading, syncStatus, syncError, retrySync, waitForSync,
    saveCourse: persistCourse, deleteCourse: removeCourse,
    saveSubject: persistSubject, deleteSubject: removeSubject,
    saveTopic: persistTopic, deleteTopic: removeTopic,
    saveResource: persistResource, deleteResource: removeResource,
  } = useContent();

  // Selection state
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  // Form state
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [editType, setEditType] = useState<"course" | "subject" | "topic" | "resource" | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate("/admin/login", { replace: true });
    }
  }, [authLoading, isAdmin, navigate]);

  const handleLogout = async () => {
    const saved = await waitForSync();
    if (!saved) {
      toast.error("Hay cambios sin publicar. Reintenta el guardado antes de salir.");
      return;
    }
    await signOut();
    navigate("/");
  };

  // CRUD helpers
  const saveCourse = (data: Partial<Course>) => {
    if (!data.name?.trim()) { toast.error("El nombre es obligatorio"); return; }
    persistCourse(data);
    toast.success(data.id ? "Curso actualizado" : "Curso creado");
    setEditingItem(null); setEditType(null);
  };

  const deleteCourse = (id: string) => {
    removeCourse(id);
    toast.success("Curso eliminado");
    if (selectedCourseId === id) setSelectedCourseId("");
  };

  const saveSubject = (data: Partial<Subject>) => {
    if (!data.name?.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (!data.course_id) { toast.error("Selecciona un curso"); return; }
    persistSubject(data);
    toast.success(data.id ? "Asignatura actualizada" : "Asignatura creada");
    setEditingItem(null); setEditType(null);
  };

  const deleteSubject = (id: string) => {
    removeSubject(id);
    toast.success("Asignatura eliminada");
    if (selectedSubjectId === id) setSelectedSubjectId("");
  };

  const saveTopic = (data: Partial<Topic> & { _newResources?: Partial<Resource>[] }) => {
    if (!data.title?.trim()) { toast.error("El título es obligatorio"); return; }
    if (!data.subject_id) { toast.error("Selecciona una asignatura"); return; }
    if (data.video_url && !isSafePublicUrl(data.video_url)) { toast.error("La URL del vídeo no es válida"); return; }
    if (data._newResources?.some((resource) => resource.url && !isSafePublicUrl(resource.url))) {
      toast.error("Hay una URL de recurso no válida");
      return;
    }
    const savedTopic = persistTopic({
      id: data.id,
      title: data.title, topic_number: data.topic_number || 1, description: data.description || "",
      content: sanitizeHtml(data.content || ""), video_url: data.video_url || "", subject_id: data.subject_id,
      sort_order: data.sort_order || 0, tags: data.tags || [],
    });
    data._newResources?.forEach((resource) => {
      if (resource.name?.trim() && resource.url?.trim()) {
        persistResource({ ...resource, topic_id: savedTopic.id });
      }
    });
    toast.success(data.id ? "Tema actualizado" : "Tema creado");
    setEditingItem(null); setEditType(null);
  };

  const deleteTopic = (id: string) => {
    removeTopic(id);
    toast.success("Tema eliminado");
    if (selectedTopicId === id) setSelectedTopicId("");
  };

  const saveResource = (data: Partial<Resource>) => {
    if (!data.name?.trim() || !data.url?.trim()) { toast.error("Nombre y URL son obligatorios"); return; }
    if (!data.topic_id) { toast.error("Selecciona un tema"); return; }
    if (!isSafePublicUrl(data.url)) { toast.error("La URL no es válida"); return; }
    persistResource(data);
    toast.success(data.id ? "Recurso actualizado" : "Recurso creado");
    setEditingItem(null); setEditType(null);
  };

  const deleteResource = (id: string) => {
    removeResource(id);
    toast.success("Recurso eliminado");
  };

  if (authLoading || contentLoading || !isAdmin) return null;

  const filteredSubjects = selectedCourseId ? subjects.filter(s => s.course_id === selectedCourseId) : subjects;
  const filteredTopics = selectedSubjectId ? topics.filter(t => t.subject_id === selectedSubjectId) : topics;
  const filteredResources = selectedTopicId ? resources.filter(r => r.topic_id === selectedTopicId) : resources;

  const getCourseName = (id: string) => courses.find(c => c.id === id)?.name || "—";
  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || "—";
  const getTopicTitle = (id: string) => topics.find(t => t.id === id)?.title || "—";
  const getResourceCount = (topicId: string) => resources.filter(r => r.topic_id === topicId).length;

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Panel de Administración</h1>
            <p className={`text-sm ${syncStatus === "error" ? "text-destructive" : "text-muted-foreground"}`}>
              {syncStatus === "saving" && "Publicando cambios en GitHub..."}
              {syncStatus === "saved" && "Todos los cambios están publicados."}
              {syncStatus === "idle" && "Contenido compartido cargado."}
              {syncStatus === "error" && (syncError || "No se han podido publicar los cambios.")}
            </p>
            {syncStatus === "error" && (
              <button onClick={retrySync} className="mt-1 text-sm font-medium text-primary hover:underline">
                Reintentar publicación
              </button>
            )}
          </div>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </button>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses" className="gap-1.5"><BookOpen className="h-3.5 w-3.5" /> Cursos</TabsTrigger>
            <TabsTrigger value="subjects" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Asignaturas</TabsTrigger>
            <TabsTrigger value="topics" className="gap-1.5"><FolderOpen className="h-3.5 w-3.5" /> Temas</TabsTrigger>
            <TabsTrigger value="resources" className="gap-1.5"><Link2 className="h-3.5 w-3.5" /> Recursos</TabsTrigger>
          </TabsList>

          {/* COURSES TAB */}
          <TabsContent value="courses" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Gestión de Cursos</h2>
              <button onClick={() => { setEditType("course"); setEditingItem({ name: "", slug: "", sort_order: courses.length }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Nuevo Curso
              </button>
            </div>
            {editType === "course" && editingItem && <CourseForm item={editingItem} onSave={saveCourse} onCancel={() => { setEditType(null); setEditingItem(null); }} />}
            <div className="rounded-xl border border-border bg-card">
              <Table>
                <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Slug</TableHead><TableHead className="w-20">Orden</TableHead><TableHead className="w-28">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {courses.map(c => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                      <TableCell>{c.sort_order}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditType("course"); setEditingItem(c); }} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                          <DeleteButton onConfirm={() => deleteCourse(c.id)} label={c.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* SUBJECTS TAB */}
          <TabsContent value="subjects" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Asignaturas</h2>
                <select value={selectedCourseId} onChange={e => { setSelectedCourseId(e.target.value); setSelectedSubjectId(""); }} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option value="">Todos los cursos</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <button onClick={() => { setEditType("subject"); setEditingItem({ name: "", slug: "", description: "", course_id: selectedCourseId || "", sort_order: 0 }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Nueva Asignatura
              </button>
            </div>
            {editType === "subject" && editingItem && <SubjectForm item={editingItem} courses={courses} onSave={saveSubject} onCancel={() => { setEditType(null); setEditingItem(null); }} />}
            <div className="rounded-xl border border-border bg-card">
              <Table>
                <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Curso</TableHead><TableHead>Slug</TableHead><TableHead className="w-28">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredSubjects.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{getCourseName(s.course_id)}</TableCell>
                      <TableCell className="text-muted-foreground">{s.slug}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditType("subject"); setEditingItem(s); }} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                          <DeleteButton onConfirm={() => deleteSubject(s.id)} label={s.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredSubjects.length === 0 && <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">Sin asignaturas</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TOPICS TAB */}
          <TabsContent value="topics" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Temas</h2>
                <select value={selectedCourseId} onChange={e => { setSelectedCourseId(e.target.value); setSelectedSubjectId(""); }} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option value="">Curso...</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select value={selectedSubjectId} onChange={e => setSelectedSubjectId(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option value="">Asignatura...</option>
                  {(selectedCourseId ? subjects.filter(s => s.course_id === selectedCourseId) : subjects).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <button onClick={() => { setEditType("topic"); setEditingItem({ title: "", topic_number: 1, description: "", content: "", video_url: "", subject_id: selectedSubjectId || "", sort_order: 0, tags: [] }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Nuevo Tema
              </button>
            </div>
            {editType === "topic" && editingItem && (
              <TopicForm
                item={editingItem}
                subjects={subjects}
                courses={courses}
                existingResources={editingItem?.id ? resources.filter(r => r.topic_id === editingItem.id) : []}
                onSave={saveTopic}
                onDeleteResource={deleteResource}
                onCancel={() => { setEditType(null); setEditingItem(null); }}
              />
            )}
            <div className="rounded-xl border border-border bg-card">
              <Table>
                <TableHeader><TableRow><TableHead className="w-12">Nº</TableHead><TableHead>Título</TableHead><TableHead>Asignatura</TableHead><TableHead className="w-24">Recursos</TableHead><TableHead className="w-28">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredTopics.map(t => (
                    <TableRow key={t.id}>
                      <TableCell><span className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">{t.topic_number}</span></TableCell>
                      <TableCell>
                        <span className="font-medium">{t.title}</span>
                        {t.tags && t.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {t.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0 bg-accent/10 text-accent border-accent/20">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{getSubjectName(t.subject_id)}</TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">{getResourceCount(t.id)} recurso{getResourceCount(t.id) !== 1 ? "s" : ""}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditType("topic"); setEditingItem({ ...t, tags: t.tags || [] }); }} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                          <DeleteButton onConfirm={() => deleteTopic(t.id)} label={t.title} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredTopics.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Sin temas</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* RESOURCES TAB */}
          <TabsContent value="resources" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg font-semibold text-foreground">Recursos</h2>
                <select value={selectedSubjectId} onChange={e => { setSelectedSubjectId(e.target.value); setSelectedTopicId(""); }} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option value="">Asignatura...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <select value={selectedTopicId} onChange={e => setSelectedTopicId(e.target.value)} className="rounded-lg border border-input bg-background px-3 py-1.5 text-sm">
                  <option value="">Tema...</option>
                  {(selectedSubjectId ? topics.filter(t => t.subject_id === selectedSubjectId) : topics).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
              <button onClick={() => { setEditType("resource"); setEditingItem({ name: "", url: "", resource_type: "link", topic_id: selectedTopicId || "", sort_order: 0 }); }} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Nuevo Recurso
              </button>
            </div>
            {editType === "resource" && editingItem && <ResourceForm item={editingItem} topics={topics} subjects={subjects} onSave={saveResource} onCancel={() => { setEditType(null); setEditingItem(null); }} />}
            <div className="rounded-xl border border-border bg-card">
              <Table>
                <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>URL</TableHead><TableHead>Tipo</TableHead><TableHead>Tema</TableHead><TableHead className="w-28">Acciones</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredResources.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell><a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px] block">{r.url}</a></TableCell>
                      <TableCell className="text-muted-foreground">{r.resource_type}</TableCell>
                      <TableCell className="text-muted-foreground">{getTopicTitle(r.topic_id)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditType("resource"); setEditingItem(r); }} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                          <DeleteButton onConfirm={() => deleteResource(r.id)} label={r.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredResources.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">Sin recursos</TableCell></TableRow>}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

// --- FORM COMPONENTS ---

const CourseForm = ({ item, onSave, onCancel }: { item: Partial<Course>; onSave: (data: Partial<Course>) => void; onCancel: () => void }) => {
  const [data, setData] = useState<Partial<Course>>(item);
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h3 className="font-semibold text-foreground">{data.id ? "Editar" : "Nuevo"} Curso</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <input placeholder="Nombre *" value={data.name ?? ""} onChange={e => setData({ ...data, name: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input placeholder="Slug" value={data.slug ?? ""} onChange={e => setData({ ...data, slug: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input type="number" placeholder="Orden" value={data.sort_order ?? 0} onChange={e => setData({ ...data, sort_order: parseInt(e.target.value) || 0 })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(data)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Save className="h-3.5 w-3.5" /> Guardar</button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><X className="h-3.5 w-3.5" /> Cancelar</button>
      </div>
    </div>
  );
};

const SubjectForm = ({ item, courses, onSave, onCancel }: { item: Partial<Subject>; courses: Course[]; onSave: (data: Partial<Subject>) => void; onCancel: () => void }) => {
  const [data, setData] = useState<Partial<Subject>>(item);
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h3 className="font-semibold text-foreground">{data.id ? "Editar" : "Nueva"} Asignatura</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input placeholder="Nombre *" value={data.name ?? ""} onChange={e => setData({ ...data, name: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <select value={data.course_id ?? ""} onChange={e => setData({ ...data, course_id: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">Selecciona curso *</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="Slug" value={data.slug ?? ""} onChange={e => setData({ ...data, slug: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input placeholder="Descripción" value={data.description ?? ""} onChange={e => setData({ ...data, description: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(data)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Save className="h-3.5 w-3.5" /> Guardar</button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><X className="h-3.5 w-3.5" /> Cancelar</button>
      </div>
    </div>
  );
};

const TopicForm = ({ item, subjects, courses, existingResources, onSave, onDeleteResource, onCancel }: {
  item: Partial<Topic>; subjects: Subject[]; courses: Course[]; existingResources: Resource[];
  onSave: (data: Partial<Topic> & { _newResources?: Partial<Resource>[] }) => void; onDeleteResource: (id: string) => void; onCancel: () => void;
}) => {
  const [data, setData] = useState<TopicDraft>({ ...item, tags: item.tags || [] });
  const [tagInput, setTagInput] = useState("");
  const [newResources, setNewResources] = useState<NewResourceDraft[]>([]);

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !data.tags.includes(tag)) {
      setData({ ...data, tags: [...data.tags, tag] });
    }
    setTagInput("");
  };

  const removeTag = (index: number) => {
    setData({ ...data, tags: data.tags.filter((_: string, i: number) => i !== index) });
  };

  const addResourceRow = () => {
    setNewResources([...newResources, { name: "", url: "", resource_type: "link" }]);
  };

  const updateNewResource = (index: number, field: keyof NewResourceDraft, value: string) => {
    setNewResources((current) => current.map((resource, resourceIndex) =>
      resourceIndex === index ? { ...resource, [field]: value } : resource,
    ));
  };

  const removeNewResource = (index: number) => {
    setNewResources(newResources.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ ...data, _newResources: newResources });
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h3 className="font-semibold text-foreground">{data.id ? "Editar" : "Nuevo"} Tema</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input placeholder="Título *" value={data.title ?? ""} onChange={e => setData({ ...data, title: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <select value={data.subject_id ?? ""} onChange={e => setData({ ...data, subject_id: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">Selecciona asignatura *</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({courses.find(c => c.id === s.course_id)?.name})</option>)}
        </select>
        <input type="number" placeholder="Nº tema" value={data.topic_number ?? 1} onChange={e => setData({ ...data, topic_number: parseInt(e.target.value) || 1 })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input placeholder="Descripción breve" value={data.description ?? ""} onChange={e => setData({ ...data, description: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input placeholder="URL vídeo YouTube (opcional)" value={data.video_url ?? ""} onChange={e => setData({ ...data, video_url: e.target.value })} className="col-span-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <label className="flex items-center gap-1.5 text-sm font-medium text-foreground"><Tag className="h-3.5 w-3.5 text-accent" /> Etiquetas</label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {data.tags.map((tag: string, i: number) => (
            <Badge key={i} variant="secondary" className="gap-1 bg-accent/10 text-accent border-accent/20">
              {tag}
              <button onClick={() => removeTag(i)} className="ml-0.5 hover:text-destructive"><X className="h-3 w-3" /></button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            placeholder="Añadir etiqueta..."
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <button type="button" onClick={addTag} className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <textarea placeholder="Contenido HTML o Markdown..." value={data.content ?? ""} onChange={e => setData({ ...data, content: e.target.value })} rows={8} className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />

      {/* Existing Resources (only for edit) */}
      {data.id && existingResources.length > 0 && (
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground"><Link2 className="h-3.5 w-3.5 text-primary" /> Recursos existentes</label>
          <div className="space-y-1.5">
            {existingResources.map(r => (
              <div key={r.id} className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm">
                <span className="flex-1 font-medium">{r.name}</span>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-[200px]">{r.url}</a>
                <Badge variant="outline" className="text-[10px]">{r.resource_type}</Badge>
                <button onClick={() => onDeleteResource(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Resources */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-medium text-foreground"><Link2 className="h-3.5 w-3.5 text-accent" /> Añadir recursos</label>
          <button type="button" onClick={addResourceRow} className="inline-flex items-center gap-1 rounded-lg bg-accent/10 px-2.5 py-1.5 text-xs font-medium text-accent hover:bg-accent/20">
            <Plus className="h-3 w-3" /> Recurso
          </button>
        </div>
        {newResources.map((r, i) => (
          <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto] items-center">
            <input placeholder="Nombre recurso" value={r.name} onChange={e => updateNewResource(i, "name", e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <input placeholder="URL" value={r.url} onChange={e => updateNewResource(i, "url", e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            <select value={r.resource_type} onChange={e => updateNewResource(i, "resource_type", e.target.value)} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
              <option value="link">Enlace</option>
              <option value="pdf">PDF</option>
              <option value="video">Vídeo</option>
              <option value="document">Documento</option>
            </select>
            <button onClick={() => removeNewResource(i)} className="rounded p-1.5 text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Save className="h-3.5 w-3.5" /> Guardar</button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><X className="h-3.5 w-3.5" /> Cancelar</button>
      </div>
    </div>
  );
};

const ResourceForm = ({ item, topics, subjects, onSave, onCancel }: { item: Partial<Resource>; topics: Topic[]; subjects: Subject[]; onSave: (data: Partial<Resource>) => void; onCancel: () => void }) => {
  const [data, setData] = useState<Partial<Resource>>(item);
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <h3 className="font-semibold text-foreground">{data.id ? "Editar" : "Nuevo"} Recurso</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <input placeholder="Nombre *" value={data.name ?? ""} onChange={e => setData({ ...data, name: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <input placeholder="URL *" value={data.url ?? ""} onChange={e => setData({ ...data, url: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
        <select value={data.resource_type ?? "link"} onChange={e => setData({ ...data, resource_type: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="link">Enlace</option>
          <option value="pdf">PDF</option>
          <option value="video">Vídeo</option>
          <option value="document">Documento</option>
          <option value="other">Otro</option>
        </select>
        <select value={data.topic_id ?? ""} onChange={e => setData({ ...data, topic_id: e.target.value })} className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
          <option value="">Selecciona tema *</option>
          {topics.map(t => <option key={t.id} value={t.id}>{t.title} ({subjects.find(s => s.id === t.subject_id)?.name})</option>)}
        </select>
      </div>
      <div className="flex gap-2">
        <button onClick={() => onSave(data)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"><Save className="h-3.5 w-3.5" /> Guardar</button>
        <button onClick={onCancel} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-muted"><X className="h-3.5 w-3.5" /> Cancelar</button>
      </div>
    </div>
  );
};

const DeleteButton = ({ onConfirm, label }: { onConfirm: () => void; label: string }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <button className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>¿Eliminar "{label}"?</AlertDialogTitle>
        <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará junto con todos los elementos asociados.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Eliminar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default AdminPanel;
