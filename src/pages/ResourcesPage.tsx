import Layout from "@/components/Layout";
import { ExternalLink } from "lucide-react";

const resources = [
  { name: "TinkerCAD", url: "https://www.tinkercad.com/", desc: "Diseño 3D y simulación de circuitos." },
  { name: "Scratch", url: "https://scratch.mit.edu/", desc: "Programación visual por bloques." },
  { name: "Arduino", url: "https://www.arduino.cc/", desc: "Plataforma de hardware libre." },
  { name: "Code.org", url: "https://code.org/", desc: "Aprende a programar paso a paso." },
];

const ResourcesPage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Recursos</h1>
        <p className="mb-8 text-muted-foreground">Herramientas y enlaces útiles para el alumnado.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {resources.map((r) => (
            <a
              key={r.name}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 card-shadow transition-all hover:card-shadow-hover hover:-translate-y-0.5"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {r.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{r.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
            </a>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ResourcesPage;
