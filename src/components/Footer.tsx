import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg hero-gradient">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-base font-bold text-foreground">Martín Rivero Tecnología</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Departamento de Tecnología del IES Martín Rivero. Formando a los profesionales del futuro.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Navegación</h4>
            <div className="space-y-2">
              {[
                { to: "/", label: "Inicio" },
                { to: "/departamento", label: "Departamento" },
                { to: "/recursos", label: "Recursos" },
                { to: "/contacto", label: "Contacto" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Contacto</h4>
            <div className="space-y-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>tecnologia@iesmartinrivero.es</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>952 XX XX XX</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Ronda, Málaga, España</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          Departamento de Tecnología – IES Martín Rivero – Ronda (Málaga) · © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
