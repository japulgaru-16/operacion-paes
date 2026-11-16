import type { Eje, ModuleId } from "@/data/questions";

/**
 * Configuración de las bombas: una por eje temático PAES,
 * con temática, color, tiempos y manual de campo propio.
 */

export interface AccentStyle {
  /** Color hexadecimal para SVG / LEDs */
  hex: string;
  hexSoft: string;
  text: string;
  bg: string;
  bgSoft: string;
  border: string;
  badge: string;
  gradient: string;
  shadow: string;
}

export interface ManualSection {
  title: string;
  formulas: string[];
}

export interface BombTopics {
  M1: string[];
  M2: string[];
}

export interface BombConfig {
  eje: Eje;
  /** Nombre clave de la bomba */
  name: string;
  /** Código del artefacto */
  codename: string;
  /** Nombre del eje PAES */
  ejeLabel: string;
  description: string;
  image: string;
  /** Segundos de cuenta regresiva por módulo */
  time: { M1: number; M2: number };
  /** Penalización en segundos por respuesta incorrecta */
  penalty: { M1: number; M2: number };
  topics: BombTopics;
  accent: AccentStyle;
  /** Colores de los 5 cables (distintos del acento) */
  wires: string[];
  manual: Record<ModuleId, ManualSection[]>;
}

const ACCENTS: Record<Eje, AccentStyle> = {
  numeros: {
    hex: "#34d399",
    hexSoft: "#a7f3d0",
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    bgSoft: "bg-emerald-500/10",
    border: "border-emerald-500/40",
    badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/40",
    gradient: "from-emerald-500/20",
    shadow: "shadow-emerald-500/30",
  },
  algebra: {
    hex: "#f87171",
    hexSoft: "#fecaca",
    text: "text-red-400",
    bg: "bg-red-500",
    bgSoft: "bg-red-500/10",
    border: "border-red-500/40",
    badge: "bg-red-500/10 text-red-300 border-red-500/40",
    gradient: "from-red-500/20",
    shadow: "shadow-red-500/30",
  },
  geometria: {
    hex: "#fbbf24",
    hexSoft: "#fde68a",
    text: "text-amber-400",
    bg: "bg-amber-500",
    bgSoft: "bg-amber-500/10",
    border: "border-amber-500/40",
    badge: "bg-amber-500/10 text-amber-300 border-amber-500/40",
    gradient: "from-amber-500/20",
    shadow: "shadow-amber-500/30",
  },
  probabilidad: {
    hex: "#e879f9",
    hexSoft: "#f5d0fe",
    text: "text-fuchsia-400",
    bg: "bg-fuchsia-500",
    bgSoft: "bg-fuchsia-500/10",
    border: "border-fuchsia-500/40",
    badge: "bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/40",
    gradient: "from-fuchsia-500/20",
    shadow: "shadow-fuchsia-500/30",
  },
  funciones: {
    hex: "#fb923c",
    hexSoft: "#fed7aa",
    text: "text-orange-400",
    bg: "bg-orange-500",
    bgSoft: "bg-orange-500/10",
    border: "border-orange-500/40",
    badge: "bg-orange-500/10 text-orange-300 border-orange-500/40",
    gradient: "from-orange-500/20",
    shadow: "shadow-orange-500/30",
  },
};

export const BOMBS: BombConfig[] = [
  {
    eje: "numeros",
    name: "LA CIFRA LETAL",
    codename: "CN-100",
    ejeLabel: "Números",
    description:
      "Artefacto de conteo armado con porcentajes, proporcionalidad e intereses. Domina los conjuntos numéricos o vuela en pedazos.",
    image: "/bombs/numeros.png",
    time: { M1: 360, M2: 420 },
    penalty: { M1: 15, M2: 20 },
    topics: {
      M1: [
        "Conjuntos numéricos N, Z, Q y R",
        "Proporcionalidad directa e inversa",
        "Porcentajes, descuentos y aumentos",
        "Interés simple",
        "Notación científica",
      ],
      M2: [
        "Error absoluto, relativo y porcentual",
        "Interés compuesto",
        "Variaciones porcentuales encadenadas",
        "Proporcionalidad compuesta",
        "Estimaciones y órdenes de magnitud",
      ],
    },
    accent: ACCENTS.numeros,
    wires: ["#34d399", "#f97316", "#fbbf24", "#a3e635", "#f87171"],
    manual: {
      M1: [
        {
          title: "Porcentajes",
          formulas: [
            "p % de A = A · p/100",
            "Variación % = (valor nuevo − valor inicial) / valor inicial · 100",
            "Aumento del x % → multiplicar por (1 + x/100)",
          ],
        },
        {
          title: "Proporcionalidad",
          formulas: [
            "Directa: a/b = c/d",
            "Inversa: a · b = c · d",
            "Regla de tres simple",
          ],
        },
        {
          title: "Interés simple",
          formulas: ["I = C · r · t", "Monto final = C + I"],
        },
        {
          title: "Conjuntos y notación",
          formulas: [
            "Racional: puede escribirse como a/b, b ≠ 0",
            "Irracional: √n cuando n no es cuadrado perfecto",
            "Científica: a · 10ⁿ con 1 ≤ a < 10",
          ],
        },
      ],
      M2: [
        {
          title: "Interés compuesto",
          formulas: ["M = C · (1 + r)ᵗ", "Capitaliza sobre el monto anterior"],
        },
        {
          title: "Error de medición",
          formulas: [
            "Error absoluto E = |valor medido − valor real|",
            "Error relativo % = E / valor medido · 100",
          ],
        },
        {
          title: "Variaciones encadenadas",
          formulas: ["Factor total = (1 ± x₁)(1 ± x₂) …", "+20% y luego −20% → 1,2 · 0,8 = 0,96"],
        },
        {
          title: "Múltiplos y divisores",
          formulas: ["m.c.m.(a, b): factores con mayor exponente", "MCD(a, b): factores comunes con menor exponente"],
        },
      ],
    },
  },
  {
    eje: "algebra",
    name: "LA X-PLOSIVA",
    codename: "AX-999",
    ejeLabel: "Álgebra",
    description:
      "Su placa lógica está cifrada con polinomios, productos notables y ecuaciones. Reduce, factoriza y desarma el circuito.",
    image: "/bombs/algebra.png",
    time: { M1: 360, M2: 420 },
    penalty: { M1: 15, M2: 20 },
    topics: {
      M1: [
        "Expresiones algebraicas y reducción",
        "Productos notables y factorización",
        "Ecuaciones de primer grado y sistemas",
        "Ecuación cuadrática",
        "Inecuaciones lineales",
      ],
      M2: [
        "Factorización avanzada",
        "Discriminante y naturaleza de raíces",
        "Inecuaciones cuadráticas",
        "Ecuaciones con valor absoluto",
        "Planteamiento y modelamiento",
      ],
    },
    accent: ACCENTS.algebra,
    wires: ["#f87171", "#fbbf24", "#e879f9", "#34d399", "#f97316"],
    manual: {
      M1: [
        {
          title: "Productos notables",
          formulas: [
            "(a + b)² = a² + 2ab + b²",
            "(a − b)² = a² − 2ab + b²",
            "(a + b)(a − b) = a² − b²",
          ],
        },
        {
          title: "Ecuación cuadrática",
          formulas: ["x = (−b ± √(b² − 4ac)) / 2a", "Suma de raíces = −b/a"],
        },
        {
          title: "Inecuaciones",
          formulas: ["Al dividir o multiplicar por un negativo, el signo se invierte"],
        },
        {
          title: "Sistemas 2×2",
          formulas: ["Sumar/restar ecuaciones para eliminar una variable"],
        },
      ],
      M2: [
        {
          title: "Discriminante",
          formulas: ["Δ = b² − 4ac", "Δ > 0: dos soluciones · Δ = 0: una doble · Δ < 0: sin soluciones reales"],
        },
        {
          title: "Valor absoluto",
          formulas: ["|x − a| = b (b ≥ 0) → x = a + b o x = a − b"],
        },
        {
          title: "Inecuación cuadrática",
          formulas: ["x² < k ⇔ −√k < x < √k", "x² > k ⇔ x > √k o x < −√k"],
        },
        {
          title: "Identidades útiles",
          formulas: ["(a + b)² = a² + b² + 2ab → a² + b² = (a + b)² − 2ab"],
        },
      ],
    },
  },
  {
    eje: "geometria",
    name: "EL POLÍGONO MORTAL",
    codename: "GM-360",
    ejeLabel: "Geometría",
    description:
      "Un casco blindado de sólidos, ángulos y circunferencias. Domina Pitágoras, Euclides y las áreas o el casco estalla.",
    image: "/bombs/geometria.png",
    time: { M1: 390, M2: 450 },
    penalty: { M1: 15, M2: 20 },
    topics: {
      M1: [
        "Ángulos entre paralelas y en el triángulo",
        "Teorema de Pitágoras",
        "Semejanza de triángulos",
        "Circunferencia: ángulos del centro e inscritos",
        "Áreas, perímetros y volúmenes",
      ],
      M2: [
        "Teoremas de Euclides (altura y cateto)",
        "Sólidos: esfera, cono y compuestos",
        "Geometría del espacio: diagonal del prisma",
        "Homotecia y razones geométricas",
        "Cuadrilátero inscrito",
      ],
    },
    accent: ACCENTS.geometria,
    wires: ["#fbbf24", "#34d399", "#f87171", "#f97316", "#e879f9"],
    manual: {
      M1: [
        {
          title: "Triángulos",
          formulas: [
            "Ángulos interiores suman 180°",
            "Pitágoras: h² = a² + b²",
            "Semejanza: lados proporcionales",
          ],
        },
        {
          title: "Circunferencia",
          formulas: ["Longitud: 2πr · Área: πr²", "Ángulo inscrito = ½ ángulo del centro"],
        },
        {
          title: "Áreas y volúmenes",
          formulas: [
            "Trapecio: (B + b) · h/2",
            "Cilindro: πr²h",
            "Cubo: A = 6a² · V = a³",
          ],
        },
        {
          title: "Ángulos",
          formulas: ["Complementarios suman 90° · Suplementarios suman 180°"],
        },
      ],
      M2: [
        {
          title: "Euclides (triángulo rectángulo)",
          formulas: ["Altura: h² = m · n", "Cateto: b² = a · m (proyecciones)"],
        },
        {
          title: "Sólidos",
          formulas: ["Esfera: V = (4/3)πr³", "Cono: V = (1/3)πr²h", "Diagonal prisma: √(a² + b² + c²)"],
        },
        {
          title: "Círculo",
          formulas: ["Sector: (α/360°) · πr²", "Cuadrilátero inscrito: ángulos opuestos suman 180°"],
        },
        {
          title: "Homotecia",
          formulas: ["Razón k → longitudes × |k|", "k < 0 invierte la posición respecto del centro"],
        },
      ],
    },
  },
  {
    eje: "probabilidad",
    name: "LA RULETA DEL AZAR",
    codename: "AZ-505",
    ejeLabel: "Probabilidad y Estadística",
    description:
      "Un núcleo estocástico: dados, cartas y datos. Calcula la jugada correcta antes de que la ruleta se detenga.",
    image: "/bombs/probabilidad.png",
    time: { M1: 330, M2: 390 },
    penalty: { M1: 15, M2: 20 },
    topics: {
      M1: [
        "Medidas de tendencia central",
        "Rango y tablas de frecuencia",
        "Probabilidad clásica (Laplace)",
        "Espacio muestral con dados y monedas",
        "Diagramas y conteo con conjuntos",
      ],
      M2: [
        "Probabilidad condicional",
        "Independencia de eventos",
        "Variable aleatoria y valor esperado",
        "Técnicas de conteo y combinatoria",
        "Extracciones sin reposición",
      ],
    },
    accent: ACCENTS.probabilidad,
    wires: ["#e879f9", "#34d399", "#fbbf24", "#f87171", "#f97316"],
    manual: {
      M1: [
        {
          title: "Medidas de centro",
          formulas: [
            "Media = (x₁ + … + xₙ)/n",
            "Mediana: dato central (datos ordenados)",
            "Moda: dato más frecuente",
          ],
        },
        {
          title: "Probabilidad clásica",
          formulas: ["P(A) = casos favorables / casos posibles", "0 ≤ P(A) ≤ 1"],
        },
        {
          title: "Conteo",
          formulas: ["2 dados: 36 casos · 2 monedas: 4 casos", "Al menos uno = 1 − P(ninguno)"],
        },
        {
          title: "Conjuntos",
          formulas: ["|A ∪ B| = |A| + |B| − |A ∩ B|"],
        },
      ],
      M2: [
        {
          title: "Condicional",
          formulas: ["P(A|B) = P(A ∩ B) / P(B)"],
        },
        {
          title: "Independencia",
          formulas: ["A y B independientes ⇔ P(A ∩ B) = P(A) · P(B)"],
        },
        {
          title: "Valor esperado",
          formulas: ["E(X) = Σ xᵢ · P(xᵢ)"],
        },
        {
          title: "Combinatoria",
          formulas: ["C(n, k) = n! / (k!(n − k)!)", "Sin reposición: multiplicar probabilidades que se agotan"],
        },
      ],
    },
  },
  {
    eje: "funciones",
    name: "LA CURVA CRÍTICA",
    codename: "CR-2ˣ",
    ejeLabel: "Funciones",
    description:
      "El detonador sigue una señal: rectas, parábolas o exponenciales. Interpreta la curva correcta y corta la señal a tiempo.",
    image: "/bombs/funciones.png",
    time: { M1: 390, M2: 450 },
    penalty: { M1: 15, M2: 20 },
    topics: {
      M1: [
        "Concepto de función, dominio y recorrido",
        "Función lineal y afín",
        "Función cuadrática y su vértice",
        "Intersecciones con los ejes",
        "Composición de funciones",
      ],
      M2: [
        "Función exponencial",
        "Función logarítmica",
        "Ecuaciones exponenciales y logarítmicas",
        "Modelos de crecimiento y decrecimiento",
        "Función inversa",
      ],
    },
    accent: ACCENTS.funciones,
    wires: ["#fb923c", "#34d399", "#f87171", "#e879f9", "#fbbf24"],
    manual: {
      M1: [
        {
          title: "Lineal y afín",
          formulas: ["f(x) = mx + n", "m > 0 creciente · m < 0 decreciente", "m = (f(x₂) − f(x₁))/(x₂ − x₁)"],
        },
        {
          title: "Cuadrática",
          formulas: ["f(x) = ax² + bx + c", "Vértice: x = −b/2a", "Corte eje X: f(x) = 0"],
        },
        {
          title: "Dominio",
          formulas: ["Fracciones: denominador ≠ 0", "Raíces: radicando ≥ 0"],
        },
        {
          title: "Composición",
          formulas: ["(f ∘ g)(x) = f(g(x))", "Evaluar de adentro hacia afuera"],
        },
      ],
      M2: [
        {
          title: "Exponencial",
          formulas: ["f(x) = aˣ, a > 0, a ≠ 1", "a > 1 creciente · 0 < a < 1 decreciente", "Duplicación: P · 2^(t/T)"],
        },
        {
          title: "Logaritmo",
          formulas: ["logₐ(x) = n ⇔ aⁿ = x", "Dominio de log(x): x > 0"],
        },
        {
          title: "Propiedades",
          formulas: [
            "log(mn) = log m + log n",
            "log(m/n) = log m − log n",
            "log(xᵏ) = k · log x",
          ],
        },
        {
          title: "Inversa",
          formulas: ["f(x) = 2ˣ → f⁻¹(x) = log₂(x)", "Simetría respecto de y = x"],
        },
      ],
    },
  },
];

export const MODULE_INFO: Record<
  ModuleId,
  { label: string; short: string; description: string; detail: string }
> = {
  M1: {
    label: "Módulo 1 · Competencia Matemática 1",
    short: "M1",
    description:
      "El Módulo Común de la PAES: contenidos de 7° básico a 2° medio. Requerido para todas las carreras.",
    detail:
      "Números · Álgebra · Geometría · Probabilidad y Estadística · Funciones (lineal, afín y cuadrática)",
  },
  M2: {
    label: "Módulo 2 · Competencia Matemática 2",
    short: "M2",
    description:
      "El Módulo Científico: suma los OA de 3° y 4° medio. Requerido para carreras científico-técnicas.",
    detail:
      "M1 + error de medición · inecuaciones cuadráticas · geometría del espacio · probabilidad condicional · exponencial y logaritmos",
  },
};

export const MAX_STRIKES = 3;
export const MODULES_PER_BOMB = 5;

export function getBomb(eje: Eje): BombConfig {
  return BOMBS.find((b) => b.eje === eje) ?? BOMBS[0];
}
