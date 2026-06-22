import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Cpu } from "lucide-react";
import heroImage from "@/assets/hero-tech.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Aula de tecnología" className="h-full w-full object-cover" />
        <div className="absolute inset-0 hero-gradient opacity-85" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <a
            href="https://iesmartinrivero.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          >
            <Cpu className="h-3.5 w-3.5" />
            IES Martín Rivero
          </a>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            Martín Rivero{" "}
            <span className="text-primary-foreground/90">Tecnología</span>
          </h1>
          <p className="mb-8 max-w-lg text-lg leading-relaxed text-primary-foreground/80">
            Recursos, apuntes y contenidos para el alumnado de ESO y Bachillerato.
            Aprende tecnología, robótica, programación y mucho más.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/cursos/1eso"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-5 py-2.5 text-sm font-semibold text-primary shadow-lg transition-transform hover:scale-105"
            >
              <BookOpen className="h-4 w-4" />
              Ver cursos
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Contacto
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
