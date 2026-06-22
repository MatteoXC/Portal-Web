import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Link2, X } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  type: "topic" | "resource";
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
}

const SearchDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { topics, resources } = useContent();

  const search = useCallback((q: string) => {
    if (q.length < 2) { setResults([]); return; }
    setLoading(true);
    const normalized = q.toLocaleLowerCase("es");
    const topicResults: SearchResult[] = topics
      .filter((topic) => [topic.title, topic.description, ...topic.tags].some((value) => value.toLocaleLowerCase("es").includes(normalized)))
      .slice(0, 10)
      .map<SearchResult>((topic) => ({ type: "topic", id: topic.id, title: topic.title, subtitle: topic.description, tags: topic.tags }));
    const resourceResults: SearchResult[] = resources
      .filter((resource) => resource.name.toLocaleLowerCase("es").includes(normalized))
      .slice(0, 5)
      .map<SearchResult>((resource) => ({ type: "resource", id: resource.topic_id, title: resource.name, subtitle: resource.url }));
    const items = [...topicResults, ...resourceResults];
    setResults(items);
    setLoading(false);
  }, [resources, topics]);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) { setQuery(""); setResults([]); }
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const goTo = (r: SearchResult) => {
    navigate(`/temas/${r.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-background/80 backdrop-blur-sm pt-[15vh]" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar temas, etiquetas, recursos..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {loading && <p className="py-6 text-center text-sm text-muted-foreground">Buscando...</p>}
          {!loading && query.length >= 2 && results.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Sin resultados para "{query}"</p>
          )}
          {!loading && results.map((r, i) => (
            <button key={i} onClick={() => goTo(r)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted">
              {r.type === "topic" ? <FileText className="h-4 w-4 shrink-0 text-primary" /> : <Link2 className="h-4 w-4 shrink-0 text-accent" />}
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">{r.title}</span>
                {r.subtitle && <p className="truncate text-xs text-muted-foreground">{r.subtitle}</p>}
                {r.tags && r.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {r.tags.slice(0, 3).map((tag, j) => (
                      <Badge key={j} variant="secondary" className="text-[10px] px-1 py-0">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </button>
          ))}
          {!loading && query.length < 2 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Escribe al menos 2 caracteres para buscar</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
