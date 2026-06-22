import { describe, expect, it } from "vitest";
import { slugify } from "@/hooks/useContent";

describe("slugify", () => {
  it("crea rutas estables con texto en español", () => {
    expect(slugify("  Tecnología e Ingeniería II  ")).toBe("tecnologia-e-ingenieria-ii");
  });

  it("elimina separadores repetidos", () => {
    expect(slugify("1º ESO / Robótica")).toBe("1-eso-robotica");
  });
});
