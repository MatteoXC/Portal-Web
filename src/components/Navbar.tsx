import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, GraduationCap, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { useDarkMode } from "@/hooks/useDarkMode";
import SearchDialog from "./SearchDialog";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { courses, subjects } = useContent();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const location = useLocation();

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCoursesOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Inicio" },
    { to: "/departamento", label: "Departamento" },
    { to: "/recursos", label: "Recursos" },
    { to: "/contacto", label: "Contacto" },
  ];
  const orderedCourses = [...courses].sort((a, b) => a.sort_order - b.sort_order);
  const linkClass = (path: string) => `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    location.pathname === path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`;

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg hero-gradient">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Martín Rivero <span className="text-gradient">Tecnología</span></span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navLinks.slice(0, 2).map((link) => <Link key={link.to} to={link.to} className={linkClass(link.to)}>{link.label}</Link>)}
            <div className="relative" onMouseEnter={() => setCoursesOpen(true)} onMouseLeave={() => setCoursesOpen(false)}>
              <button className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${location.pathname.startsWith("/cursos") || location.pathname.startsWith("/asignaturas") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}>
                Cursos <ChevronDown className={`h-3.5 w-3.5 transition-transform ${coursesOpen ? "rotate-180" : ""}`} />
              </button>
              {coursesOpen && (
                <div className="absolute left-0 top-full w-72 pt-1">
                  <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-card p-2 shadow-lg">
                    {orderedCourses.map((course) => (
                      <div key={course.id} className="mb-1 last:mb-0">
                        <Link to={`/cursos/${course.slug}`} className="block rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">{course.name}</Link>
                        {subjects.filter((subject) => subject.course_id === course.id).sort((a, b) => a.sort_order - b.sort_order).map((subject) => (
                          <Link key={subject.id} to={`/asignaturas/${subject.id}`} className="block rounded-lg px-5 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground">{subject.name}</Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {navLinks.slice(2).map((link) => <Link key={link.to} to={link.to} className={linkClass(link.to)}>{link.label}</Link>)}
            <button onClick={() => setSearchOpen(true)} className="ml-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Buscar">
              <Search className="h-3.5 w-3.5" /><span className="hidden lg:inline">Buscar...</span><kbd className="hidden rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px] lg:inline">Ctrl K</kbd>
            </button>
            <button onClick={toggleDark} className="ml-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Alternar modo oscuro">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button onClick={() => setSearchOpen(true)} className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Buscar"><Search className="h-5 w-5" /></button>
            <button onClick={toggleDark} className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Alternar modo oscuro">{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
            <button onClick={() => setMobileOpen((open) => !open)} className="rounded-md p-2 text-muted-foreground hover:bg-muted" aria-label="Abrir menú">{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          </div>
        </div>

        {mobileOpen && (
          <div className="max-h-[75vh] overflow-y-auto border-t border-border bg-card px-4 py-3 md:hidden">
            {navLinks.slice(0, 2).map((link) => <Link key={link.to} to={link.to} className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">{link.label}</Link>)}
            <button onClick={() => setCoursesOpen((open) => !open)} className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">Cursos <ChevronDown className={`h-4 w-4 transition-transform ${coursesOpen ? "rotate-180" : ""}`} /></button>
            {coursesOpen && (
              <div className="ml-3 border-l-2 border-primary/20 pl-3">
                {orderedCourses.map((course) => <Link key={course.id} to={`/cursos/${course.slug}`} className="block rounded px-2 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">{course.name}</Link>)}
              </div>
            )}
            {navLinks.slice(2).map((link) => <Link key={link.to} to={link.to} className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted">{link.label}</Link>)}
          </div>
        )}
      </nav>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default Navbar;
