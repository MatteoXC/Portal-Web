export interface Course {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface Subject {
  id: string;
  course_id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
}

export interface Topic {
  id: string;
  subject_id: string;
  title: string;
  topic_number: number;
  description: string;
  content: string;
  video_url: string;
  sort_order: number;
  tags: string[];
}

export interface Resource {
  id: string;
  topic_id: string;
  name: string;
  url: string;
  resource_type: string;
  sort_order: number;
}

export interface ContentData {
  courses: Course[];
  subjects: Subject[];
  topics: Topic[];
  resources: Resource[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const hasStrings = (record: Record<string, unknown>, keys: string[]) =>
  keys.every((key) => typeof record[key] === "string");

const hasFiniteNumbers = (record: Record<string, unknown>, keys: string[]) =>
  keys.every((key) => typeof record[key] === "number" && Number.isFinite(record[key]));

const isCourse = (value: unknown): value is Course =>
  isRecord(value)
  && hasStrings(value, ["id", "name", "slug"])
  && hasFiniteNumbers(value, ["sort_order"]);

const isSubject = (value: unknown): value is Subject =>
  isRecord(value)
  && hasStrings(value, ["id", "course_id", "name", "slug", "description"])
  && hasFiniteNumbers(value, ["sort_order"]);

const isTopic = (value: unknown): value is Topic =>
  isRecord(value)
  && hasStrings(value, ["id", "subject_id", "title", "description", "content", "video_url"])
  && hasFiniteNumbers(value, ["topic_number", "sort_order"])
  && Array.isArray(value.tags)
  && value.tags.every((tag) => typeof tag === "string");

const isResource = (value: unknown): value is Resource =>
  isRecord(value)
  && hasStrings(value, ["id", "topic_id", "name", "url", "resource_type"])
  && hasFiniteNumbers(value, ["sort_order"]);

export const isContentData = (value: unknown): value is ContentData => {
  if (!isRecord(value)) return false;
  if (!Array.isArray(value.courses) || !value.courses.every(isCourse)) return false;
  if (!Array.isArray(value.subjects) || !value.subjects.every(isSubject)) return false;
  if (!Array.isArray(value.topics) || !value.topics.every(isTopic)) return false;
  return Array.isArray(value.resources) && value.resources.every(isResource);
};
