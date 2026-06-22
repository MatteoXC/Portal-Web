import Layout from "@/components/Layout";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactPage = () => {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Contacto</h1>
        <p className="mb-10 text-muted-foreground">
          Ponte en contacto con el Departamento de Tecnología.
        </p>

        <div className="grid gap-5 sm:grid-cols-3">
          {[
            { icon: Mail, title: "Email", value: "tecnologia@iesmartinrivero.es" },
            { icon: Phone, title: "Teléfono", value: "952 XX XX XX" },
            { icon: MapPin, title: "Dirección", value: "IES Martín Rivero, Mijas, Málaga" },
          ].map((item, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6 text-center card-shadow">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-foreground">{item.title}</h4>
              <p className="text-sm text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
