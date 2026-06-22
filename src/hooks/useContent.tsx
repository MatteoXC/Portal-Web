import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { asignaturas, cursos, temas } from "@/data/mockData";
import { isContentData } from "../../shared/content";
import type { ContentData, Course, Resource, Subject, Topic } from "../../shared/content";

export type { ContentData, Course, Resource, Subject, Topic } from "../../shared/content";

interface ContentContextValue extends ContentData {
  loading: boolean;
  syncStatus: "idle" | "saving" | "saved" | "error";
  syncError: string | null;
  retrySync: () => void;
  waitForSync: () => Promise<boolean>;
  saveCourse: (course: Partial<Course>) => Course;
  deleteCourse: (id: string) => void;
  saveSubject: (subject: Partial<Subject>) => Subject;
  deleteSubject: (id: string) => void;
  saveTopic: (topic: Partial<Topic>) => Topic;
  deleteTopic: (id: string) => void;
  saveResource: (resource: Partial<Resource>) => Resource;
  deleteResource: (id: string) => void;
  resetContent: () => void;
}

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;

const defaultContent: ContentData = {
  courses: cursos.map((course) => ({
    id: course.id,
    name: course.nombre,
    slug: course.id,
    sort_order: course.orden,
  })),
  subjects: asignaturas.map((subject, index) => ({
    id: subject.id,
    course_id: subject.cursoId,
    name: subject.nombre,
    slug: subject.id,
    description: "",
    sort_order: index + 1,
  })),
  topics: temas.map((topic) => ({
    id: topic.id,
    subject_id: topic.asignaturaId,
    title: topic.titulo,
    topic_number: topic.numero,
    description: topic.descripcion,
    content: topic.contenidoHTML,
    video_url: topic.videoUrl ?? "",
    sort_order: topic.numero,
    tags: [],
  })),
  resources: [],
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export const ContentProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ContentData>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<ContentContextValue["syncStatus"]>("idle");
  const [syncError, setSyncError] = useState<string | null>(null);
  const contentRef = useRef(content);
  const publishQueueRef = useRef<Promise<boolean>>(Promise.resolve(true));

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/content", { signal: controller.signal, credentials: "same-origin" })
      .then(async (response) => {
        if (!response.ok) throw new Error("No se ha podido cargar el contenido compartido");
        return response.json() as Promise<{ content?: unknown }>;
      })
      .then((body) => {
        if (!isContentData(body.content)) return;
        contentRef.current = body.content;
        setContent(body.content);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.warn("Se usarán los contenidos iniciales:", error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const queuePublish = useCallback((nextContent: ContentData) => {
    setSyncStatus("saving");
    setSyncError(null);

    const task = publishQueueRef.current
      .catch(() => false)
      .then(async () => {
        try {
          const response = await fetch("/api/content", {
            method: "PUT",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: nextContent }),
          });

          if (!response.ok) {
            let message = "No se ha podido publicar el contenido";
            try {
              const body = await response.json() as { error?: unknown };
              if (typeof body.error === "string") message = body.error;
            } catch {
              // Keep the generic message when the server does not return JSON.
            }
            throw new Error(message);
          }
          return true;
        } catch (error) {
          setSyncError(error instanceof Error ? error.message : "No se ha podido publicar el contenido");
          return false;
        }
      });

    publishQueueRef.current = task;
    void task.then((saved) => {
      if (publishQueueRef.current === task) setSyncStatus(saved ? "saved" : "error");
    });
    return task;
  }, []);

  const updateContent = useCallback((updater: (current: ContentData) => ContentData) => {
    const nextContent = updater(contentRef.current);
    contentRef.current = nextContent;
    setContent(nextContent);
    void queuePublish(nextContent);
    return nextContent;
  }, [queuePublish]);

  const value = useMemo<ContentContextValue>(() => ({
    ...content,
    loading,
    syncStatus,
    syncError,
    retrySync: () => { void queuePublish(contentRef.current); },
    waitForSync: () => publishQueueRef.current,
    saveCourse: (course) => {
      const saved: Course = {
        id: course.id ?? createId(),
        name: course.name?.trim() ?? "",
        slug: course.slug?.trim() || slugify(course.name ?? ""),
        sort_order: course.sort_order ?? 0,
      };
      updateContent((current) => ({
        ...current,
        courses: course.id
          ? current.courses.map((item) => item.id === course.id ? saved : item)
          : [...current.courses, saved],
      }));
      return saved;
    },
    deleteCourse: (id) => updateContent((current) => {
      const subjectIds = new Set(current.subjects.filter((item) => item.course_id === id).map((item) => item.id));
      const topicIds = new Set(current.topics.filter((item) => subjectIds.has(item.subject_id)).map((item) => item.id));
      return {
        courses: current.courses.filter((item) => item.id !== id),
        subjects: current.subjects.filter((item) => !subjectIds.has(item.id)),
        topics: current.topics.filter((item) => !topicIds.has(item.id)),
        resources: current.resources.filter((item) => !topicIds.has(item.topic_id)),
      };
    }),
    saveSubject: (subject) => {
      const saved: Subject = {
        id: subject.id ?? createId(),
        course_id: subject.course_id ?? "",
        name: subject.name?.trim() ?? "",
        slug: subject.slug?.trim() || slugify(subject.name ?? ""),
        description: subject.description ?? "",
        sort_order: subject.sort_order ?? 0,
      };
      updateContent((current) => ({
        ...current,
        subjects: subject.id
          ? current.subjects.map((item) => item.id === subject.id ? saved : item)
          : [...current.subjects, saved],
      }));
      return saved;
    },
    deleteSubject: (id) => updateContent((current) => {
      const topicIds = new Set(current.topics.filter((item) => item.subject_id === id).map((item) => item.id));
      return {
        ...current,
        subjects: current.subjects.filter((item) => item.id !== id),
        topics: current.topics.filter((item) => !topicIds.has(item.id)),
        resources: current.resources.filter((item) => !topicIds.has(item.topic_id)),
      };
    }),
    saveTopic: (topic) => {
      const saved: Topic = {
        id: topic.id ?? createId(),
        subject_id: topic.subject_id ?? "",
        title: topic.title?.trim() ?? "",
        topic_number: topic.topic_number ?? 1,
        description: topic.description ?? "",
        content: topic.content ?? "",
        video_url: topic.video_url ?? "",
        sort_order: topic.sort_order ?? 0,
        tags: topic.tags ?? [],
      };
      updateContent((current) => ({
        ...current,
        topics: topic.id
          ? current.topics.map((item) => item.id === topic.id ? saved : item)
          : [...current.topics, saved],
      }));
      return saved;
    },
    deleteTopic: (id) => updateContent((current) => ({
      ...current,
      topics: current.topics.filter((item) => item.id !== id),
      resources: current.resources.filter((item) => item.topic_id !== id),
    })),
    saveResource: (resource) => {
      const saved: Resource = {
        id: resource.id ?? createId(),
        topic_id: resource.topic_id ?? "",
        name: resource.name?.trim() ?? "",
        url: resource.url?.trim() ?? "",
        resource_type: resource.resource_type ?? "link",
        sort_order: resource.sort_order ?? 0,
      };
      updateContent((current) => ({
        ...current,
        resources: resource.id
          ? current.resources.map((item) => item.id === resource.id ? saved : item)
          : [...current.resources, saved],
      }));
      return saved;
    },
    deleteResource: (id) => updateContent((current) => ({
      ...current,
      resources: current.resources.filter((item) => item.id !== id),
    })),
    resetContent: () => updateContent(() => defaultContent),
  }), [content, loading, queuePublish, syncError, syncStatus, updateContent]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used within ContentProvider");
  return context;
};
