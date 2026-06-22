export interface Curso {
  id: string;
  nombre: string;
  orden: number;
}

export interface Asignatura {
  id: string;
  nombre: string;
  cursoId: string;
}

export interface Tema {
  id: string;
  titulo: string;
  descripcion: string;
  asignaturaId: string;
  numero: number;
  contenidoHTML: string;
  videoUrl?: string;
}

export const cursos: Curso[] = [
  { id: "1eso", nombre: "1º ESO", orden: 1 },
  { id: "2eso", nombre: "2º ESO", orden: 2 },
  { id: "3eso", nombre: "3º ESO", orden: 3 },
  { id: "4eso", nombre: "4º ESO", orden: 4 },
  { id: "1bach", nombre: "1º Bachillerato", orden: 5 },
  { id: "2bach", nombre: "2º Bachillerato", orden: 6 },
];

export const asignaturas: Asignatura[] = [
  // 1º ESO
  { id: "1eso-cyr1", nombre: "Computación y Robótica I", cursoId: "1eso" },
  // 2º ESO
  { id: "2eso-tyd1", nombre: "Tecnología y Digitalización I", cursoId: "2eso" },
  { id: "2eso-cyr2", nombre: "Computación y Robótica II", cursoId: "2eso" },
  // 3º ESO
  { id: "3eso-tyd2", nombre: "Tecnología y Digitalización II", cursoId: "3eso" },
  { id: "3eso-cyr3", nombre: "Computación y Robótica III", cursoId: "3eso" },
  // 4º ESO
  { id: "4eso-tech", nombre: "Tecnología", cursoId: "4eso" },
  { id: "4eso-digi", nombre: "Digitalización", cursoId: "4eso" },
  { id: "4eso-ap", nombre: "Ámbito Práctico", cursoId: "4eso" },
  // 1º Bach
  { id: "1bach-tei", nombre: "Tecnología e Ingeniería I", cursoId: "1bach" },
  { id: "1bach-tic1", nombre: "T.I.C I", cursoId: "1bach" },
  // 2º Bach
  { id: "2bach-teii", nombre: "Tecnología e Ingeniería II", cursoId: "2bach" },
  { id: "2bach-tic2", nombre: "T.I.C II", cursoId: "2bach" },
  { id: "2bach-pyc", nombre: "Programación y Computación", cursoId: "2bach" },
];

export const temas: Tema[] = [
  // 1º ESO - Computación y Robótica I
  {
    id: "t1",
    titulo: "Introducción a la programación",
    descripcion: "Primeros pasos con programación visual por bloques.",
    asignaturaId: "1eso-cyr1",
    numero: 1,
    contenidoHTML: `<h2>Introducción a la programación</h2>
<p>La programación por bloques permite crear programas arrastrando y conectando bloques visuales, sin necesidad de escribir código.</p>
<h3>Herramientas</h3>
<ul>
<li><strong>Scratch:</strong> Plataforma de programación visual del MIT.</li>
<li><strong>mBlock:</strong> Basado en Scratch, con soporte para Arduino.</li>
<li><strong>MakeCode:</strong> Para micro:bit y otros dispositivos.</li>
</ul>`,
  },
  {
    id: "t2",
    titulo: "Robótica básica",
    descripcion: "Componentes de un robot y primeros montajes.",
    asignaturaId: "1eso-cyr1",
    numero: 2,
    contenidoHTML: `<h2>Robótica básica</h2>
<p>Un robot es una máquina programable capaz de realizar tareas de forma autónoma o semiautónoma.</p>
<h3>Componentes de un robot</h3>
<ul>
<li><strong>Sensores:</strong> Permiten al robot percibir el entorno.</li>
<li><strong>Actuadores:</strong> Motores y servomotores que permiten el movimiento.</li>
<li><strong>Controlador:</strong> El "cerebro" del robot (Arduino, micro:bit...).</li>
</ul>`,
  },
  // 2º ESO - Tecnología y Digitalización I
  {
    id: "t3",
    titulo: "Estructuras",
    descripcion: "Tipos de estructuras y esfuerzos.",
    asignaturaId: "2eso-tyd1",
    numero: 1,
    contenidoHTML: `<h2>Estructuras</h2>
<p>Una estructura es un conjunto de elementos unidos entre sí cuya función es soportar cargas sin deformarse ni romperse.</p>
<h3>Tipos de esfuerzos</h3>
<ul>
<li><strong>Tracción:</strong> Fuerzas que estiran el material.</li>
<li><strong>Compresión:</strong> Fuerzas que comprimen el material.</li>
<li><strong>Flexión:</strong> Combinación de tracción y compresión.</li>
<li><strong>Torsión:</strong> Fuerzas de giro.</li>
</ul>`,
  },
  {
    id: "t4",
    titulo: "Mecanismos",
    descripcion: "Máquinas simples y mecanismos de transmisión.",
    asignaturaId: "2eso-tyd1",
    numero: 2,
    contenidoHTML: `<h2>Mecanismos</h2>
<p>Los mecanismos son elementos que transforman o transmiten el movimiento dentro de una máquina.</p>
<h3>Tipos de mecanismos</h3>
<ul>
<li><strong>Palancas:</strong> Barra rígida que gira sobre un punto de apoyo.</li>
<li><strong>Poleas:</strong> Ruedas acanaladas por las que pasa una cuerda.</li>
<li><strong>Engranajes:</strong> Ruedas dentadas que transmiten movimiento circular.</li>
</ul>`,
  },
  // 2º ESO - Computación y Robótica II
  {
    id: "t5",
    titulo: "Programación con Scratch avanzado",
    descripcion: "Proyectos interactivos y juegos con Scratch.",
    asignaturaId: "2eso-cyr2",
    numero: 1,
    contenidoHTML: `<h2>Programación con Scratch avanzado</h2>
<p>En este nivel trabajaremos con variables, listas y eventos para crear proyectos más complejos como juegos interactivos.</p>`,
  },
  {
    id: "t6",
    titulo: "Robótica con Arduino",
    descripcion: "Introducción a Arduino y sensores básicos.",
    asignaturaId: "2eso-cyr2",
    numero: 2,
    contenidoHTML: `<h2>Robótica con Arduino</h2>
<p>Arduino es una plataforma de hardware libre que permite crear proyectos interactivos de electrónica y robótica.</p>`,
  },
  // 3º ESO - Tecnología y Digitalización II
  {
    id: "t7",
    titulo: "Electricidad y circuitos",
    descripcion: "Fundamentos de electricidad y circuitos eléctricos.",
    asignaturaId: "3eso-tyd2",
    numero: 1,
    contenidoHTML: `<h2>Electricidad y circuitos</h2>
<p>La electricidad es una forma de energía producida por el movimiento de electrones a través de un conductor.</p>
<h3>Ley de Ohm</h3>
<p><strong>V = I × R</strong></p>`,
  },
  {
    id: "t8",
    titulo: "Electrónica analógica",
    descripcion: "Componentes electrónicos básicos.",
    asignaturaId: "3eso-tyd2",
    numero: 2,
    contenidoHTML: `<h2>Electrónica analógica</h2>
<p>La electrónica analógica trabaja con señales continuas. Los componentes básicos incluyen resistencias, condensadores, diodos y transistores.</p>`,
  },
  // 3º ESO - Computación y Robótica III
  {
    id: "t9",
    titulo: "Programación textual",
    descripcion: "Introducción a Python y programación con texto.",
    asignaturaId: "3eso-cyr3",
    numero: 1,
    contenidoHTML: `<h2>Programación textual</h2>
<p>Python es un lenguaje de programación versátil y fácil de aprender, ideal para dar el salto desde la programación por bloques.</p>`,
  },
  {
    id: "t10",
    titulo: "Proyectos de robótica avanzada",
    descripcion: "Diseño y programación de robots autónomos.",
    asignaturaId: "3eso-cyr3",
    numero: 2,
    contenidoHTML: `<h2>Proyectos de robótica avanzada</h2>
<p>Diseño, construcción y programación de robots capaces de seguir líneas, evitar obstáculos y resolver laberintos.</p>`,
  },
  // 4º ESO - Tecnología
  {
    id: "t11",
    titulo: "Electrónica digital",
    descripcion: "Puertas lógicas y circuitos digitales.",
    asignaturaId: "4eso-tech",
    numero: 1,
    contenidoHTML: `<h2>Electrónica digital</h2>
<p>La electrónica digital trabaja con señales discretas (0 y 1). Las puertas lógicas son los elementos básicos de los circuitos digitales.</p>`,
  },
  {
    id: "t12",
    titulo: "Control y automatización",
    descripcion: "Programación de Arduino y automatización.",
    asignaturaId: "4eso-tech",
    numero: 2,
    contenidoHTML: `<h2>Control y automatización</h2>
<p>Arduino permite crear sistemas de control automático para domótica, robótica y procesos industriales.</p>`,
  },
  // 4º ESO - Digitalización
  {
    id: "t13",
    titulo: "Seguridad informática",
    descripcion: "Protección de datos y navegación segura.",
    asignaturaId: "4eso-digi",
    numero: 1,
    contenidoHTML: `<h2>Seguridad informática</h2>
<p>La seguridad informática protege la información y los sistemas contra accesos no autorizados, daños o robos.</p>`,
  },
  {
    id: "t14",
    titulo: "Publicación web",
    descripcion: "HTML, CSS y creación de páginas web.",
    asignaturaId: "4eso-digi",
    numero: 2,
    contenidoHTML: `<h2>Publicación web</h2>
<p>HTML y CSS son los lenguajes fundamentales para la creación de páginas web.</p>`,
  },
  // 4º ESO - Ámbito Práctico
  {
    id: "t15",
    titulo: "El proceso tecnológico",
    descripcion: "Metodología de proyectos tecnológicos.",
    asignaturaId: "4eso-ap",
    numero: 1,
    contenidoHTML: `<h2>El proceso tecnológico</h2>
<p>Aplicación del método de proyectos para resolver problemas tecnológicos de forma práctica e integrada.</p>`,
  },
  {
    id: "t16",
    titulo: "Materiales y fabricación",
    descripcion: "Técnicas de mecanizado y materiales.",
    asignaturaId: "4eso-ap",
    numero: 2,
    contenidoHTML: `<h2>Materiales y fabricación</h2>
<p>Estudio de materiales de uso técnico y técnicas de fabricación en el taller de tecnología.</p>`,
  },
  // 1º Bach - Tecnología e Ingeniería I
  {
    id: "t17",
    titulo: "Energías",
    descripcion: "Fuentes de energía y sostenibilidad.",
    asignaturaId: "1bach-tei",
    numero: 1,
    contenidoHTML: `<h2>Energías</h2>
<p>Las fuentes de energía se clasifican en renovables (solar, eólica, hidráulica) y no renovables (petróleo, gas natural, carbón).</p>`,
  },
  {
    id: "t18",
    titulo: "Sistemas mecánicos avanzados",
    descripcion: "Cinemática y dinámica de mecanismos.",
    asignaturaId: "1bach-tei",
    numero: 2,
    contenidoHTML: `<h2>Sistemas mecánicos avanzados</h2>
<p>Estudio de la cinemática y dinámica aplicada a mecanismos complejos: trenes de engranajes, levas y sistemas articulados.</p>`,
  },
  // 1º Bach - T.I.C I
  {
    id: "t19",
    titulo: "Sistemas informáticos",
    descripcion: "Hardware, software y redes de comunicación.",
    asignaturaId: "1bach-tic1",
    numero: 1,
    contenidoHTML: `<h2>Sistemas informáticos</h2>
<p>Un sistema informático está compuesto por hardware (componentes físicos) y software (programas y datos).</p>`,
  },
  {
    id: "t20",
    titulo: "Ofimática y productividad",
    descripcion: "Herramientas ofimáticas y trabajo colaborativo.",
    asignaturaId: "1bach-tic1",
    numero: 2,
    contenidoHTML: `<h2>Ofimática y productividad</h2>
<p>Uso avanzado de herramientas de procesador de textos, hojas de cálculo, presentaciones y trabajo en la nube.</p>`,
  },
  // 2º Bach - Tecnología e Ingeniería II
  {
    id: "t21",
    titulo: "Sistemas automáticos",
    descripcion: "Control automático y sistemas realimentados.",
    asignaturaId: "2bach-teii",
    numero: 1,
    contenidoHTML: `<h2>Sistemas automáticos</h2>
<p>Un sistema automático es aquel que es capaz de funcionar sin intervención humana, regulando su comportamiento mediante realimentación.</p>`,
  },
  {
    id: "t22",
    titulo: "Circuitos neumáticos e hidráulicos",
    descripcion: "Fundamentos de neumática e hidráulica.",
    asignaturaId: "2bach-teii",
    numero: 2,
    contenidoHTML: `<h2>Circuitos neumáticos e hidráulicos</h2>
<p>Los sistemas neumáticos utilizan aire comprimido y los hidráulicos utilizan fluidos a presión para transmitir fuerzas y movimientos.</p>`,
  },
  // 2º Bach - T.I.C II
  {
    id: "t23",
    titulo: "Programación web",
    descripcion: "Desarrollo web con HTML, CSS y JavaScript.",
    asignaturaId: "2bach-tic2",
    numero: 1,
    contenidoHTML: `<h2>Programación web</h2>
<p>Desarrollo de aplicaciones web completas usando HTML5, CSS3 y JavaScript moderno.</p>`,
  },
  {
    id: "t24",
    titulo: "Bases de datos",
    descripcion: "Diseño y consultas SQL.",
    asignaturaId: "2bach-tic2",
    numero: 2,
    contenidoHTML: `<h2>Bases de datos</h2>
<p>Diseño de bases de datos relacionales, modelo entidad-relación y lenguaje SQL para consultas.</p>`,
  },
  // 2º Bach - Programación y Computación
  {
    id: "t25",
    titulo: "Algoritmos y estructuras de datos",
    descripcion: "Fundamentos de algoritmia y eficiencia.",
    asignaturaId: "2bach-pyc",
    numero: 1,
    contenidoHTML: `<h2>Algoritmos y estructuras de datos</h2>
<p>Estudio de algoritmos de ordenación, búsqueda y estructuras de datos como pilas, colas y árboles.</p>`,
  },
  {
    id: "t26",
    titulo: "Desarrollo de aplicaciones",
    descripcion: "Proyectos de programación con Python y Java.",
    asignaturaId: "2bach-pyc",
    numero: 2,
    contenidoHTML: `<h2>Desarrollo de aplicaciones</h2>
<p>Creación de aplicaciones completas aplicando patrones de diseño y buenas prácticas de programación.</p>`,
  },
];

// Helper functions
export function getCursoById(id: string) {
  return cursos.find((c) => c.id === id);
}

export function getAsignaturasByCurso(cursoId: string) {
  return asignaturas.filter((a) => a.cursoId === cursoId);
}

export function getAsignaturaById(id: string) {
  return asignaturas.find((a) => a.id === id);
}

export function getTemasByAsignatura(asignaturaId: string) {
  return temas.filter((t) => t.asignaturaId === asignaturaId).sort((a, b) => a.numero - b.numero);
}

export function getTemaById(id: string) {
  return temas.find((t) => t.id === id);
}
