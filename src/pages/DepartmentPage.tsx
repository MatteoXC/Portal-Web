import Layout from "@/components/Layout";
import { Users, Award, Lightbulb } from "lucide-react";

const DepartmentPage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Departamento de Tecnología</h1>
        <p className="mb-10 text-muted-foreground">
          Conoce al equipo y la misión del Departamento de Tecnología del IES Martín Rivero.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { icon: Users, title: "Equipo docente", desc: "Profesorado cualificado y en constante formación." },
            { icon: Award, title: "Excelencia", desc: "Comprometidos con la calidad educativa y la innovación." },
            { icon: Lightbulb, title: "Innovación", desc: "Robótica, programación, impresión 3D y más." },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 text-center card-shadow">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default DepartmentPage;
