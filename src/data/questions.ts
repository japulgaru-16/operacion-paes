/**
 * Banco de preguntas estilo PAES — Matemática M1 y M2
 * Estructura según Tabla de Especificaciones DEMRE (PAES 2026).
 *
 * M1 (Módulo Común): OA de 7° básico a 2° medio.
 * M2 (Módulo Científico): M1 + OA de 3° y 4° medio (Actualización Curricular).
 *
 * Ejes: números, algebra, geometria, probabilidad, funciones.
 * Todas con 5 alternativas (A–E), como la prueba oficial.
 */

export type Eje = "numeros" | "algebra" | "geometria" | "probabilidad" | "funciones";
export type ModuleId = "M1" | "M2";

export interface SeedQuestion {
  module: ModuleId;
  eje: Eje;
  enunciado: string;
  alternativas: string[];
  respuesta: number;
  explicacion: string;
}

export const EJES: Eje[] = ["numeros", "algebra", "geometria", "probabilidad", "funciones"];

export const QUESTIONS: SeedQuestion[] = [
  // ============================================================
  // MÓDULO 1 — NÚMEROS
  // ============================================================
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "Un celular cuyo precio de lista es $280.000 está en oferta con un 25% de descuento. ¿Cuál es el precio final del celular?",
    alternativas: ["$196.000", "$210.000", "$220.000", "$232.000", "$245.000"],
    respuesta: 1,
    explicacion:
      "Descuento: 25% de $280.000 = $70.000. Precio final: $280.000 − $70.000 = $210.000. Equivale a pagar el 75% del precio: 0,75 × 280.000 = 210.000.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "Se depositan $500.000 en una cuenta que paga un interés simple de 4% anual. ¿Cuánto interés se genera al cabo de 3 años?",
    alternativas: ["$20.000", "$40.000", "$60.000", "$62.000", "$560.000"],
    respuesta: 2,
    explicacion:
      "Interés simple: I = C · r · t = 500.000 × 0,04 × 3 = $60.000. En interés simple el cálculo siempre es sobre el capital inicial.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "Si 5 pintores tardan 8 días en pintar una muralla, todos con la misma eficiencia, ¿cuántos días tardarán 10 pintores en pintar la misma muralla?",
    alternativas: ["2 días", "3 días", "4 días", "5 días", "10 días"],
    respuesta: 2,
    explicacion:
      "Es proporcionalidad inversa: al doble de pintores, la mitad de días. 5 × 8 = 10 · x → x = 40/10 = 4 días.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado: "¿Cuál de los siguientes números es irracional?",
    alternativas: ["0,75", "3/8", "√49", "√50", "22/7"],
    respuesta: 3,
    explicacion:
      "√50 = 5√2 no puede expresarse como cociente de enteros, por lo tanto es irracional. En cambio 0,75 = 3/4, 3/8, √49 = 7 y 22/7 son racionales.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "La distancia media entre la Tierra y el Sol es de aproximadamente 149.600.000 km. ¿Cuál es su escritura en notación científica?",
    alternativas: [
      "1,496 · 10⁶ km",
      "1,496 · 10⁷ km",
      "1,496 · 10⁸ km",
      "1,496 · 10⁹ km",
      "14,96 · 10⁷ km",
    ],
    respuesta: 2,
    explicacion:
      "La notación científica exige un factor mayor o igual a 1 y menor que 10: 149.600.000 = 1,496 × 10⁸ (se recorre la coma 8 lugares). 14,96 · 10⁷ no es notación científica correcta.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "El precio de una entrada de concierto subió de $12.000 a $15.000. ¿Cuál fue el porcentaje de aumento?",
    alternativas: ["20%", "25%", "30%", "80%", "125%"],
    respuesta: 1,
    explicacion:
      "Aumento: $3.000. Porcentaje: (3.000/12.000) × 100 = 25%. El porcentaje siempre se calcula respecto del precio inicial.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado: "Si 3 kilogramos de café cuestan $21.000, ¿cuánto cuestan 7 kilogramos del mismo café?",
    alternativas: ["$35.000", "$42.000", "$45.000", "$49.000", "$56.000"],
    respuesta: 3,
    explicacion:
      "Proporcionalidad directa: 1 kg cuesta $21.000/3 = $7.000, entonces 7 kg cuestan 7 × $7.000 = $49.000.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado: "¿Cuál de los siguientes números es el mayor?",
    alternativas: ["−2", "−0,5", "−1/3", "−3/4", "−1,2"],
    respuesta: 2,
    explicacion:
      "Entre números negativos, es mayor el que está más cerca de cero: −1/3 ≈ −0,33 > −0,5 > −0,75 > −1,2 > −2.",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "En un colegio de 800 estudiantes, el 45% son mujeres. ¿Cuántos hombres hay en el colegio?",
    alternativas: ["360", "440", "450", "460", "555"],
    respuesta: 1,
    explicacion:
      "Mujeres: 45% de 800 = 360. Hombres: 800 − 360 = 440 (equivalente al 55% de 800).",
  },
  {
    module: "M1",
    eje: "numeros",
    enunciado:
      "El sueldo de Camila es $800.000. Se le aumenta un 5% y, al mes siguiente, se le aumenta un 10% sobre el nuevo sueldo. ¿Cuál es su sueldo final?",
    alternativas: ["$920.000", "$924.000", "$936.000", "$940.000", "$1.012.000"],
    respuesta: 1,
    explicacion:
      "Aumentos encadenados: 800.000 × 1,05 = 840.000 y luego 840.000 × 1,10 = $924.000. Los porcentajes se aplican en cadena, no se suman (1,05 × 1,10 = 1,155).",
  },

  // ============================================================
  // MÓDULO 1 — ÁLGEBRA
  // ============================================================
  {
    module: "M1",
    eje: "algebra",
    enunciado:
      "Si P(x) = 3x² − 5x + 2 y Q(x) = x² + 4x − 7, entonces P(x) + Q(x) es igual a",
    alternativas: [
      "4x² − x − 5",
      "4x² − 9x + 9",
      "2x² − 9x + 9",
      "2x² − x − 5",
      "4x² + x − 5",
    ],
    respuesta: 0,
    explicacion:
      "Se suman términos semejantes: (3+1)x² + (−5+4)x + (2−7) = 4x² − x − 5.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado:
      "El área de un rectángulo se representa por x² − 9 y uno de sus lados mide x + 3. ¿Cuánto mide el otro lado?",
    alternativas: ["x − 3", "x + 3", "x − 9", "x + 9", "x² − 3"],
    respuesta: 0,
    explicacion:
      "El área es largo × ancho, así que hay que factorizar: x² − 9 = (x + 3)(x − 3). Por lo tanto, el otro lado mide x − 3.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado: "El desarrollo de (x + 4)² es igual a",
    alternativas: [
      "x² + 16",
      "x² + 4x + 16",
      "x² + 8x + 16",
      "x² + 8x + 8",
      "x² + 4x + 4",
    ],
    respuesta: 2,
    explicacion:
      "Cuadrado de binomio: (a + b)² = a² + 2ab + b². Con a = x y b = 4: x² + 8x + 16.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado: "Si 3(x − 2) + 5 = 2x + 7, entonces x es igual a",
    alternativas: ["−8", "−6", "2", "6", "8"],
    respuesta: 4,
    explicacion:
      "Se distribuye: 3x − 6 + 5 = 2x + 7 → 3x − 1 = 2x + 7 → 3x − 2x = 7 + 1 → x = 8.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado:
      "En el sistema formado por x + y = 10 y x − y = 4, el valor de xy es",
    alternativas: ["12", "18", "21", "24", "30"],
    respuesta: 2,
    explicacion:
      "Sumando ambas ecuaciones: 2x = 14 → x = 7, y entonces y = 3. Por lo tanto xy = 21.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado: "Las soluciones de la ecuación x² − 7x + 12 = 0 son",
    alternativas: ["−3 y −4", "−3 y 4", "3 y −4", "3 y 4", "2 y 6"],
    respuesta: 3,
    explicacion:
      "Se factoriza buscando dos números que multiplicados den 12 y sumados den −7: (x − 3)(x − 4) = 0, entonces x = 3 o x = 4.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado: "Si −2x + 3 > 9, entonces",
    alternativas: ["x > −3", "x < −3", "x > 3", "x < 3", "x > 6"],
    respuesta: 1,
    explicacion:
      "−2x > 6. Al dividir por −2 (número negativo), la desigualdad se invierte: x < −3. ¡Ojo! es el error clásico de la PAES.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado:
      "La edad de Andrés es el triple de la edad de su hija. Si la suma de sus edades es 48 años, ¿qué edad tiene la hija de Andrés?",
    alternativas: ["10 años", "12 años", "14 años", "16 años", "36 años"],
    respuesta: 1,
    explicacion:
      "Sea x la edad de la hija: x + 3x = 48 → 4x = 48 → x = 12. La hija tiene 12 años y Andrés 36.",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado: "Si a ≠ b, entonces (a + b)(a − b) + b² es igual a",
    alternativas: ["a² + b²", "a² − 2b²", "a²", "a² − b²", "2a²"],
    respuesta: 2,
    explicacion:
      "(a + b)(a − b) = a² − b². Luego a² − b² + b² = a².",
  },
  {
    module: "M1",
    eje: "algebra",
    enunciado: "Si x = −2, entonces el valor de 2x² − 3x + 1 es",
    alternativas: ["3", "7", "11", "15", "−3"],
    respuesta: 3,
    explicacion:
      "Se reemplaza x = −2: 2(4) − 3(−2) + 1 = 8 + 6 + 1 = 15. Cuidado con el signo de −3x: −3 · (−2) = +6.",
  },

  // ============================================================
  // MÓDULO 1 — GEOMETRÍA
  // ============================================================
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "En un triángulo rectángulo, los catetos miden 6 cm y 8 cm. ¿Cuánto mide la hipotenusa?",
    alternativas: ["9 cm", "10 cm", "12 cm", "14 cm", "100 cm"],
    respuesta: 1,
    explicacion:
      "Teorema de Pitágoras: h² = 6² + 8² = 36 + 64 = 100, entonces h = 10 cm. Es la clásica terna pitagórica (6, 8, 10).",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "Dos rectas paralelas son cortadas por una transversal. Si un ángulo alterno interno mide (3x + 10)° y su ángulo alterno interno correspondiente en la otra recta mide (5x − 20)°, entonces dichos ángulos miden",
    alternativas: ["40°", "50°", "55°", "60°", "65°"],
    respuesta: 2,
    explicacion:
      "Los ángulos alternos internos entre paralelas son iguales: 3x + 10 = 5x − 20 → 2x = 30 → x = 15. Cada ángulo mide 3(15) + 10 = 55°.",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "Un árbol de 4 m de altura proyecta una sombra de 6 m. En el mismo instante, un edificio proyecta una sombra de 30 m. ¿Qué altura tiene el edificio?",
    alternativas: ["18 m", "20 m", "22 m", "24 m", "40 m"],
    respuesta: 1,
    explicacion:
      "Por semejanza de triángulos: altura/sombra es constante → 4/6 = h/30 → h = 30 · (2/3) = 20 m.",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado: "El área de un círculo de radio 5 cm es",
    alternativas: ["10π cm²", "20π cm²", "25π cm²", "50π cm²", "5π cm²"],
    respuesta: 2,
    explicacion:
      "Área del círculo: A = πr² = π(5)² = 25π cm². No confundir con el perímetro (2πr = 10π).",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "En una circunferencia, un ángulo del centro mide 80°. El ángulo inscrito que subtiende el mismo arco mide",
    alternativas: ["20°", "40°", "80°", "100°", "160°"],
    respuesta: 1,
    explicacion:
      "El ángulo inscrito mide la mitad del ángulo del centro que subtiende el mismo arco: 80°/2 = 40°.",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "El volumen de un cilindro recto de radio 3 cm y altura 10 cm es",
    alternativas: ["30π cm³", "60π cm³", "90π cm³", "900π cm³", "9π cm³"],
    respuesta: 2,
    explicacion:
      "Volumen del cilindro: V = πr²h = π(3)²(10) = 90π cm³.",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado: "El área total de un cubo de arista 4 cm es",
    alternativas: ["64 cm²", "80 cm²", "96 cm²", "120 cm²", "128 cm²"],
    respuesta: 2,
    explicacion:
      "Un cubo tiene 6 caras cuadradas iguales: A = 6 · (4)² = 6 · 16 = 96 cm². (64 cm² corresponde al volumen, no al área).",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "Dos ángulos interiores de un triángulo miden 47° y 68°. ¿Cuánto mide el tercer ángulo interior?",
    alternativas: ["55°", "65°", "68°", "72°", "115°"],
    respuesta: 1,
    explicacion:
      "Los ángulos interiores de un triángulo suman 180°: 180° − (47° + 68°) = 180° − 115° = 65°.",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado:
      "Un trapecio tiene bases de 12 cm y 8 cm, y su altura mide 5 cm. Su área es",
    alternativas: ["40 cm²", "45 cm²", "50 cm²", "55 cm²", "100 cm²"],
    respuesta: 2,
    explicacion:
      "Área del trapecio: A = (B + b) · h / 2 = (12 + 8) · 5 / 2 = 20 · 5 / 2 = 50 cm².",
  },
  {
    module: "M1",
    eje: "geometria",
    enunciado: "El complemento del suplemento del ángulo de 120° es",
    alternativas: ["30°", "45°", "60°", "75°", "90°"],
    respuesta: 0,
    explicacion:
      "Primero el suplemento: 180° − 120° = 60°. Luego el complemento de 60°: 90° − 60° = 30°.",
  },

  // ============================================================
  // MÓDULO 1 — PROBABILIDAD Y ESTADÍSTICA
  // ============================================================
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "Las notas de Felipe fueron: 5,2 – 6,0 – 4,8 – 7,0 – 2,0. Su promedio (media aritmética) es",
    alternativas: ["4,8", "5,0", "5,2", "5,5", "6,0"],
    respuesta: 1,
    explicacion:
      "Suma de notas: 5,2 + 6,0 + 4,8 + 7,0 + 2,0 = 25,0. Promedio: 25,0/5 = 5,0.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado: "El conjunto de datos 2, 4, 7, 9, 15 tiene por mediana",
    alternativas: ["4", "5,5", "7", "7,4", "9"],
    respuesta: 2,
    explicacion:
      "Con los datos ya ordenados, la mediana es el valor central (tercer dato de cinco): 7. La media sería 7,4, pero la mediana es 7.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "En una caja hay 3 bolitas rojas y 5 bolitas azules. Si se extrae una bolita al azar, ¿cuál es la probabilidad de que sea roja?",
    alternativas: ["3/5", "1/3", "5/8", "3/8", "1/8"],
    respuesta: 3,
    explicacion:
      "Probabilidad clásica: casos favorables / casos posibles = 3/(3 + 5) = 3/8.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "Al lanzar un dado cúbico normal, ¿cuál es la probabilidad de obtener un número primo?",
    alternativas: ["1/6", "1/3", "1/2", "2/3", "5/6"],
    respuesta: 2,
    explicacion:
      "Los resultados primos del dado son 2, 3 y 5: son 3 casos favorables de 6 posibles → 3/6 = 1/2. (El 1 no es primo).",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "Al lanzar dos monedas simultáneamente, ¿cuál es la probabilidad de obtener al menos una cara?",
    alternativas: ["1/4", "1/2", "3/4", "1/3", "1"],
    respuesta: 2,
    explicacion:
      "Espacio muestral: (C,C), (C,s), (s,C), (s,s). Solo un caso no tiene cara → P(al menos una cara) = 3/4. También: 1 − P(sin caras) = 1 − 1/4.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "En un grupo hay 5 personas de 20 años, 3 de 21 años y 2 de 25 años. ¿Cuál es la edad promedio del grupo?",
    alternativas: ["21,0 años", "21,3 años", "21,5 años", "22,0 años", "22,3 años"],
    respuesta: 1,
    explicacion:
      "(5·20 + 3·21 + 2·25)/10 = (100 + 63 + 50)/10 = 213/10 = 21,3 años. Es un promedio ponderado por las frecuencias.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado: "¿Cuál es la moda del conjunto de datos: 3, 5, 7, 3, 8, 3, 5, 9?",
    alternativas: ["3", "5", "5,4", "3 y 5", "8"],
    respuesta: 0,
    explicacion:
      "La moda es el dato con mayor frecuencia: el 3 aparece 3 veces (el 5 solo 2 veces). El promedio 5,4 no es la moda.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado: "El rango (recorrido) del conjunto de datos 12, 7, 15, 9, 20, 4 es",
    alternativas: ["12", "15", "16", "20", "24"],
    respuesta: 2,
    explicacion:
      "Rango = valor máximo − valor mínimo = 20 − 4 = 16.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "Se lanzan dos dados cúbicos normales. ¿Cuál es la probabilidad de que la suma de los resultados sea 7?",
    alternativas: ["1/12", "1/9", "1/6", "5/36", "7/36"],
    respuesta: 2,
    explicacion:
      "Los casos con suma 7 son (1,6), (2,5), (3,4), (4,3), (5,2), (6,1): 6 de 36 → 6/36 = 1/6.",
  },
  {
    module: "M1",
    eje: "probabilidad",
    enunciado:
      "En un curso de 40 estudiantes, 25 juegan fútbol, 18 juegan vóleibol y 10 practican ambos deportes. ¿Cuántos estudiantes no juegan ninguno de estos dos deportes?",
    alternativas: ["5", "7", "10", "15", "33"],
    respuesta: 1,
    explicacion:
      "Principio de inclusión-exclusión: al menos un deporte = 25 + 18 − 10 = 33. Ninguno: 40 − 33 = 7 estudiantes.",
  },

  // ============================================================
  // MÓDULO 1 — FUNCIONES
  // ============================================================
  {
    module: "M1",
    eje: "funciones",
    enunciado: "Si f(x) = 2x − 3, entonces f(5) es igual a",
    alternativas: ["5", "7", "10", "13", "−7"],
    respuesta: 1,
    explicacion: "Se reemplaza x por 5: f(5) = 2(5) − 3 = 10 − 3 = 7.",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "La función f(x) = −2x + 7 es",
    alternativas: ["creciente", "decreciente", "constante", "cuadrática", "exponencial"],
    respuesta: 1,
    explicacion:
      "Es una función afín con pendiente m = −2 < 0, por lo tanto es estrictamente decreciente: a mayor x, menor f(x).",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "El dominio de la función f(x) = (x + 1)/(x − 3) es",
    alternativas: [
      "todo ℝ excepto x = −1",
      "todo ℝ excepto x = 3",
      "todo ℝ excepto x = 1",
      "todo ℝ excepto x = −3",
      "todo ℝ",
    ],
    respuesta: 1,
    explicacion:
      "La única restricción es que el denominador no sea cero: x − 3 ≠ 0 → x ≠ 3. El numerador no restringe nada.",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "El vértice de la parábola f(x) = x² − 4x + 3 está en el punto",
    alternativas: ["(2, −1)", "(−2, 1)", "(4, 3)", "(2, 1)", "(−4, 3)"],
    respuesta: 0,
    explicacion:
      "La coordenada x del vértice es x = −b/(2a) = 4/2 = 2. Luego f(2) = 4 − 8 + 3 = −1. Vértice: (2, −1).",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado:
      "La gráfica de f(x) = x² − 9 interseca al eje X en los puntos",
    alternativas: [
      "(3, 0) y (−3, 0)",
      "(9, 0) y (−9, 0)",
      "solo en (3, 0)",
      "(0, 9) y (0, −9)",
      "(3, 0), (−3, 0) y (0, −9)",
    ],
    respuesta: 0,
    explicacion:
      "Se iguala a cero: x² − 9 = 0 → x² = 9 → x = ±3. Los puntos de corte con el eje X son (3, 0) y (−3, 0).",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado:
      "Si f es una función lineal tal que f(2) = 5 y f(4) = 11, entonces f(x) es igual a",
    alternativas: ["3x − 1", "3x + 1", "2x + 1", "5x − 5", "x + 3"],
    respuesta: 0,
    explicacion:
      "Pendiente: m = (11 − 5)/(4 − 2) = 3. Con f(x) = 3x + n y f(2) = 5: 6 + n = 5 → n = −1. Entonces f(x) = 3x − 1.",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "Si f(x) = x + 2 y g(x) = x², entonces f(g(3)) es igual a",
    alternativas: ["9", "10", "11", "12", "25"],
    respuesta: 2,
    explicacion:
      "Primero g(3) = 3² = 9 y luego f(9) = 9 + 2 = 11. En la composición se resuelve de adentro hacia afuera.",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "La gráfica de f(x) = 3x − 6 interseca al eje X en el punto",
    alternativas: ["(0, −6)", "(2, 0)", "(−2, 0)", "(0, 2)", "(6, 0)"],
    respuesta: 1,
    explicacion:
      "Corte con el eje X: f(x) = 0 → 3x − 6 = 0 → x = 2. El punto es (2, 0). El punto (0, −6) es el corte con el eje Y.",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "Si el dominio de f(x) = x² es todo ℝ, entonces su recorrido (rango) es",
    alternativas: ["ℝ", "[0, +∞[", "]0, +∞[", "]−∞, 0]", "]−∞, +∞["],
    respuesta: 1,
    explicacion:
      "Como x² ≥ 0 para todo x real, los valores alcanzados son todos los reales no negativos: [0, +∞[. El 0 sí se alcanza (con x = 0), por eso el intervalo es cerrado en 0.",
  },
  {
    module: "M1",
    eje: "funciones",
    enunciado: "Si el punto (a, 6) pertenece a la gráfica de f(x) = 2x + 2, entonces a es igual a",
    alternativas: ["1", "2", "3", "4", "14"],
    respuesta: 1,
    explicacion:
      "Pertenece a la gráfica significa que f(a) = 6: 2a + 2 = 6 → 2a = 4 → a = 2.",
  },

  // ============================================================
  // MÓDULO 2 — NÚMEROS
  // ============================================================
  {
    module: "M2",
    eje: "numeros",
    enunciado:
      "Con una regla se mide un segmento de 25,3 cm con un error absoluto máximo de 0,05 cm. ¿Cuál es, aproximadamente, el error relativo porcentual de la medición?",
    alternativas: ["0,02%", "0,2%", "2%", "5%", "0,5%"],
    respuesta: 1,
    explicacion:
      "Error relativo = error absoluto / valor medido = 0,05/25,3 ≈ 0,00198 → multiplicado por 100 ≈ 0,2%.",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado:
      "Un capital de $200.000 se invierte al 8% anual con capitalización anual. Redondeando al peso, ¿cuánto hay en la cuenta después de 3 años?",
    alternativas: ["$248.000", "$251.942", "$244.000", "$259.200", "$250.000"],
    respuesta: 1,
    explicacion:
      "Interés compuesto: 200.000 × (1,08)³ = 200.000 × 1,259712 ≈ $251.942. Si fuera interés simple serían $248.000.",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado:
      "El precio de un producto aumenta en 20% y el nuevo precio luego disminuye en 20%. Respecto del precio original, el precio final",
    alternativas: [
      "no varía",
      "aumenta en 4%",
      "disminuye en 4%",
      "disminuye en 2%",
      "disminuye en 20%",
    ],
    respuesta: 2,
    explicacion:
      "Variaciones multiplicativas: 1,20 × 0,80 = 0,96. El precio final es el 96% del original: disminuye en 4%.",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado: "¿Entre qué par de enteros consecutivos se encuentra √50?",
    alternativas: ["5 y 6", "6 y 7", "7 y 8", "8 y 9", "25 y 26"],
    respuesta: 2,
    explicacion:
      "49 < 50 < 64, entonces √49 < √50 < √64, es decir, 7 < √50 < 8 (√50 ≈ 7,07).",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado: "El mínimo común múltiplo (m.c.m.) entre 12 y 18 es",
    alternativas: ["6", "12", "24", "36", "72"],
    respuesta: 3,
    explicacion:
      "12 = 2²·3 y 18 = 2·3². El m.c.m. toma los factores con mayor exponente: 2²·3² = 36. (El 6 es el MCD).",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado:
      "Si 6 obreros, trabajando 8 horas diarias, construyen una muralla en 12 días, ¿cuántos días tardarán 8 obreros trabajando 6 horas diarias, con el mismo rendimiento?",
    alternativas: ["9 días", "10 días", "12 días", "14 días", "16 días"],
    respuesta: 2,
    explicacion:
      "Trabajo total: 6 × 8 × 12 = 576 horas-obrero. Con 8 obreros × 6 h = 48 horas-obrero por día: 576/48 = 12 días.",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado:
      "La suma de tres números enteros pares consecutivos es 48. ¿Cuál es el menor de ellos?",
    alternativas: ["10", "12", "14", "16", "18"],
    respuesta: 2,
    explicacion:
      "Sean x, x + 2, x + 4 los pares consecutivos: 3x + 6 = 48 → x = 14. Los números son 14, 16 y 18; el menor es 14.",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado: "¿Cuál de los siguientes números está entre 7/9 y 5/6?",
    alternativas: ["3/4", "4/5", "6/7", "2/3", "9/10"],
    respuesta: 1,
    explicacion:
      "7/9 ≈ 0,777… y 5/6 ≈ 0,833. El único valor entre ambos es 4/5 = 0,8. (3/4 = 0,75 es menor y 6/7 ≈ 0,857 es mayor).",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado:
      "Un producto de precio p recibe un descuento del 15% y sobre el precio descontado se aplica un impuesto del 19%. El precio final es igual a",
    alternativas: ["1,0115p", "1,04p", "0,96p", "1,19p", "1,35p"],
    respuesta: 0,
    explicacion:
      "Precio con descuento: 0,85p. Con impuesto: 0,85p × 1,19 = 1,0115p. Se multiplica por los factores, no se suman los porcentajes.",
  },
  {
    module: "M2",
    eje: "numeros",
    enunciado: "La escritura en notación científica del número 0,00027 es",
    alternativas: [
      "2,7 · 10⁻⁴",
      "27 · 10⁻⁵",
      "2,7 · 10⁻³",
      "2,7 · 10⁴",
      "0,27 · 10⁻³",
    ],
    respuesta: 0,
    explicacion:
      "Se recorre la coma 4 lugares a la derecha para obtener 2,7: 0,00027 = 2,7 × 10⁻⁴. El factor debe estar entre 1 y 10.",
  },

  // ============================================================
  // MÓDULO 2 — ÁLGEBRA
  // ============================================================
  {
    module: "M2",
    eje: "algebra",
    enunciado: "La factorización completa de x² + 5x + 6 es",
    alternativas: [
      "(x + 1)(x + 6)",
      "(x + 2)(x + 3)",
      "(x − 2)(x − 3)",
      "(x + 5)(x + 1)",
      "(x + 2)(x + 4)",
    ],
    respuesta: 1,
    explicacion:
      "Se buscan dos números que multiplicados den 6 y sumados den 5: 2 y 3. Entonces x² + 5x + 6 = (x + 2)(x + 3).",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado:
      "La ecuación x² + 2x + k = 0 tiene exactamente una solución (doble) cuando k es igual a",
    alternativas: ["0", "1", "−1", "2", "4"],
    respuesta: 1,
    explicacion:
      "Solución única ⇔ discriminante nulo: Δ = b² − 4ac = 4 − 4k = 0 → k = 1. En ese caso x = −1 es solución doble.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado: "Las soluciones de la ecuación |x − 3| = 5 son",
    alternativas: ["solo 8", "8 y −2", "2 y 8", "−8 y 2", "solo −2"],
    respuesta: 1,
    explicacion:
      "Por definición de valor absoluto: x − 3 = 5 → x = 8, o bien x − 3 = −5 → x = −2. Ambas verifican: |8−3| = 5 y |−2−3| = 5.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado: "El conjunto solución de la inecuación x² − 4 < 0 es",
    alternativas: [
      "x < 2",
      "−2 < x < 2",
      "x < −2 o x > 2",
      "x > 2",
      "x ≠ ±2",
    ],
    respuesta: 1,
    explicacion:
      "x² < 4 equivale a |x| < 2, es decir, −2 < x < 2. La parábola y = x² − 4 está bajo el eje X solo entre sus raíces −2 y 2.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado:
      "Si x = √2 es solución de la ecuación x² − k = 0, entonces k es igual a",
    alternativas: ["2", "4", "√2", "−2", "1/2"],
    respuesta: 0,
    explicacion:
      "Se reemplaza: (√2)² − k = 0 → 2 − k = 0 → k = 2.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado:
      "Un rectángulo tiene perímetro 28 cm y su largo mide 2 cm más que su ancho. ¿Cuál es el área del rectángulo?",
    alternativas: ["40 cm²", "45 cm²", "48 cm²", "52 cm²", "96 cm²"],
    respuesta: 2,
    explicacion:
      "Sea a el ancho: 2(a + a + 2) = 28 → 2a + 2 = 14 → a = 6. Largo: 8. Área: 6 × 8 = 48 cm².",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado: "Si a + b = 7 y a · b = 10, entonces a² + b² es igual a",
    alternativas: ["29", "39", "49", "59", "69"],
    respuesta: 0,
    explicacion:
      "Identidad notable: (a + b)² = a² + 2ab + b². Entonces a² + b² = (a + b)² − 2ab = 49 − 20 = 29.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado: "El término independiente del polinomio P(x) = (x + 1)² − 2x es",
    alternativas: ["−1", "0", "1", "2", "3"],
    respuesta: 2,
    explicacion:
      "Se desarrolla: (x + 1)² − 2x = x² + 2x + 1 − 2x = x² + 1. El término independiente (sin x) es 1.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado:
      "El costo de producir n artículos, en pesos, es C(n) = 5.000 + 800n. Si el costo total de una producción fue $37.000, ¿cuántos artículos se produjeron?",
    alternativas: ["32", "36", "40", "44", "46"],
    respuesta: 2,
    explicacion:
      "5.000 + 800n = 37.000 → 800n = 32.000 → n = 40 artículos.",
  },
  {
    module: "M2",
    eje: "algebra",
    enunciado:
      "La expresión algebraica (x² − 16)/(x + 4) no está definida cuando x es igual a",
    alternativas: ["4", "−4", "4 y −4", "0", "16"],
    respuesta: 1,
    explicacion:
      "Una fracción algebraica no está definida cuando su denominador es cero: x + 4 = 0 → x = −4. (En x = 4 sí está definida y vale 0).",
  },

  // ============================================================
  // MÓDULO 2 — GEOMETRÍA
  // ============================================================
  {
    module: "M2",
    eje: "geometria",
    enunciado: "El volumen de una esfera de radio 3 cm es",
    alternativas: ["12π cm³", "24π cm³", "27π cm³", "36π cm³", "108π cm³"],
    respuesta: 3,
    explicacion:
      "Volumen de la esfera: V = (4/3)πr³ = (4/3)π(27) = 36π cm³.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "En un triángulo rectángulo, las proyecciones de los catetos sobre la hipotenusa miden 4 cm y 9 cm. La altura relativa a la hipotenusa mide",
    alternativas: ["5 cm", "6 cm", "6,5 cm", "13 cm", "36 cm"],
    respuesta: 1,
    explicacion:
      "Teorema de la altura (Euclides): h² = m · n = 4 · 9 = 36, entonces h = 6 cm.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "Una caja rectangular tiene dimensiones 3 cm × 4 cm × 12 cm. La longitud de su diagonal interior es",
    alternativas: ["12 cm", "13 cm", "14 cm", "15 cm", "19 cm"],
    respuesta: 1,
    explicacion:
      "Diagonal del prisma: d = √(3² + 4² + 12²) = √(9 + 16 + 144) = √169 = 13 cm. Es Pitágoras aplicado dos veces.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "Se recorta un sector circular de 60° desde un círculo de radio 6 cm. El área del sector es",
    alternativas: ["6π cm²", "12π cm²", "18π cm²", "36π cm²", "3π cm²"],
    respuesta: 0,
    explicacion:
      "Área del sector: A = (α/360°) · πr² = (60/360) · 36π = 36π/6 = 6π cm².",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "En un cuadrilátero inscrito en una circunferencia, dos ángulos interiores opuestos miden 110° y (2x + 40)°. El valor de x es",
    alternativas: ["10", "15", "25", "30", "35"],
    respuesta: 1,
    explicacion:
      "En un cuadrilátero inscrito, los ángulos opuestos son suplementarios: 110° + (2x + 40)° = 180° → 2x = 30 → x = 15.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado: "Un cono circular recto tiene radio 6 cm y altura 8 cm. Su volumen es",
    alternativas: ["48π cm³", "96π cm³", "288π cm³", "144π cm³", "32π cm³"],
    respuesta: 1,
    explicacion:
      "Volumen del cono: V = (1/3)πr²h = (1/3)π(36)(8) = 96π cm³.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "A un segmento de 3 cm se le aplica una homotecia de razón k = −2. El segmento imagen mide",
    alternativas: ["1,5 cm", "3 cm", "5 cm", "6 cm", "9 cm"],
    respuesta: 3,
    explicacion:
      "En una homotecia de razón k, las longitudes se multiplican por |k| = 2 (la razón negativa invierte la posición respecto del centro, pero no acorta): 3 × 2 = 6 cm.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "Dos esferas tienen radios 3 cm y 6 cm. La razón entre sus volúmenes es",
    alternativas: ["1 : 2", "1 : 4", "1 : 8", "2 : 3", "1 : 3"],
    respuesta: 2,
    explicacion:
      "El volumen es proporcional a r³: (3³)/(6³) = 27/216 = 1/8. La razón entre los volúmenes es 1 : 8 (si fuera área, sería 1 : 4).",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "Un prisma recto de altura 10 cm tiene por base un trapecio de bases 5 cm y 7 cm y altura 4 cm. El volumen del prisma es",
    alternativas: ["120 cm³", "220 cm³", "240 cm³", "300 cm³", "480 cm³"],
    respuesta: 2,
    explicacion:
      "Área de la base: (5 + 7)·4/2 = 24 cm². Volumen: 24 × 10 = 240 cm³.",
  },
  {
    module: "M2",
    eje: "geometria",
    enunciado:
      "Un triángulo isósceles tiene lados de 10 cm, 10 cm y 12 cm. La altura relativa a la base de 12 cm mide",
    alternativas: ["6 cm", "7 cm", "8 cm", "9 cm", "10 cm"],
    respuesta: 2,
    explicacion:
      "La altura del isósceles divide la base en dos segmentos de 6 cm. Pitágoras sobre el medio triángulo: h = √(10² − 6²) = √64 = 8 cm.",
  },

  // ============================================================
  // MÓDULO 2 — PROBABILIDAD Y ESTADÍSTICA
  // ============================================================
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "En un curso, el 60% de los estudiantes juega ajedrez, el 30% juega Go y el 20% juega ambos juegos. Si se elige al azar un estudiante que juega Go, ¿cuál es la probabilidad de que también juegue ajedrez?",
    alternativas: ["1/3", "2/3", "1/2", "3/5", "2/5"],
    respuesta: 1,
    explicacion:
      "Probabilidad condicional: P(A|G) = P(A ∩ G)/P(G) = 0,2/0,3 = 2/3.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "Se lanzan 3 monedas simultáneamente. ¿Cuál es la probabilidad de obtener exactamente dos caras?",
    alternativas: ["1/8", "1/4", "3/8", "1/2", "1/3"],
    respuesta: 2,
    explicacion:
      "El espacio muestral tiene 8 casos (2³). Los favorables son (C,C,s), (C,s,C) y (s,C,C): 3 casos → P = 3/8.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "En un juego se lanza un dado: si sale 6, se gana $10.000; si sale cualquier otro resultado, se pierden $2.000. El valor esperado de este juego es",
    alternativas: ["−$2.000", "$0", "$1.000", "$2.000", "$8.000"],
    respuesta: 1,
    explicacion:
      "E = (1/6)(10.000) + (5/6)(−2.000) = 1.666,67 − 1.666,67 = $0. Es un juego justo.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado: "Dos eventos A y B son independientes si y solo si",
    alternativas: [
      "P(A ∩ B) = P(A) · P(B)",
      "P(A ∩ B) = P(A) + P(B)",
      "P(A|B) = P(B|A)",
      "P(A ∪ B) = P(A) · P(B)",
      "P(A) = P(B)",
    ],
    respuesta: 0,
    explicacion:
      "La definición de independencia es P(A ∩ B) = P(A)·P(B), lo que equivale a que P(A|B) = P(A).",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "¿De cuántas maneras diferentes se puede formar un comité de 2 estudiantes elegidos de un grupo de 5, si el orden no importa?",
    alternativas: ["5", "10", "15", "20", "25"],
    respuesta: 1,
    explicacion:
      "Combinaciones: C(5,2) = 5!/(2!·3!) = (5·4)/2 = 10 maneras.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "Una variable aleatoria discreta X toma los valores 1, 2 y 3 con probabilidades 0,5, 0,3 y 0,2, respectivamente. El valor esperado E(X) es",
    alternativas: ["1,5", "1,7", "2,0", "2,1", "1,6"],
    respuesta: 1,
    explicacion:
      "E(X) = 1(0,5) + 2(0,3) + 3(0,2) = 0,5 + 0,6 + 0,6 = 1,7.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "De un mazo de 40 cartas (con 4 ases) se extraen 2 cartas sin reposición. ¿Cuál es la probabilidad de que ambas cartas sean ases?",
    alternativas: ["1/130", "1/100", "1/169", "1/120", "3/40"],
    respuesta: 0,
    explicacion:
      "P(primera as) = 4/40 y P(segunda as, sin reposición) = 3/39. Producto: (4·3)/(40·39) = 12/1.560 = 1/130.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "Para el conjunto de datos 4, 8, 6, 5, 2, ¿cuál es la suma de las desviaciones de los datos respecto de su media aritmética?",
    alternativas: ["−2", "0", "2", "5", "10"],
    respuesta: 1,
    explicacion:
      "La media es (4+8+6+5+2)/5 = 5. Las desviaciones son −1, 3, 1, 0, −3, que suman 0. La suma de desviaciones respecto de la media siempre es 0.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado:
      "En una urna hay 4 bolitas rojas y 6 verdes. Se extraen dos bolitas, una tras otra, sin reposición. ¿Cuál es la probabilidad de que la primera sea roja y la segunda verde?",
    alternativas: ["4/15", "1/3", "6/25", "2/5", "6/100"],
    respuesta: 0,
    explicacion:
      "P(R y V) = P(R) · P(V|R) = (4/10) · (6/9) = 24/90 = 4/15. Como no hay reposición, en la segunda extracción quedan 9 bolitas.",
  },
  {
    module: "M2",
    eje: "probabilidad",
    enunciado: "El primer cuartil Q₁ del conjunto ordenado 2, 4, 6, 8, 10, 12, 14 es",
    alternativas: ["2", "3", "4", "5", "6"],
    respuesta: 2,
    explicacion:
      "Con 7 datos, Q₁ es el valor que deja el 25% de los datos bajo él: posición (n+1)/4 = 2, es decir, el segundo dato: Q₁ = 4.",
  },

  // ============================================================
  // MÓDULO 2 — FUNCIONES
  // ============================================================
  {
    module: "M2",
    eje: "funciones",
    enunciado: "Si f(x) = 2ˣ, entonces f(5) − f(3) es igual a",
    alternativas: ["4", "8", "24", "25", "32"],
    respuesta: 2,
    explicacion: "f(5) − f(3) = 2⁵ − 2³ = 32 − 8 = 24.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "La solución de la ecuación exponencial 2ˣ = 64 es",
    alternativas: ["4", "5", "6", "8", "32"],
    respuesta: 2,
    explicacion:
      "Como 64 = 2⁶, la ecuación queda 2ˣ = 2⁶ y, por igualdad de bases, x = 6.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "El valor de log₂(64) es",
    alternativas: ["5", "6", "8", "32", "64"],
    respuesta: 1,
    explicacion:
      "log₂(64) pregunta: ¿a qué exponente se eleva 2 para obtener 64? Como 2⁶ = 64, entonces log₂(64) = 6.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado:
      "Si log(a) + log(b) = 3 (logaritmos en base 10, con a y b positivos), entonces el producto a · b es",
    alternativas: ["100", "1.000", "30", "10.000", "no se puede determinar"],
    respuesta: 1,
    explicacion:
      "Propiedad: log(a) + log(b) = log(a·b). Entonces log(a·b) = 3 → a·b = 10³ = 1.000.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "El dominio de la función f(x) = log(x − 2) es",
    alternativas: [
      "x > 2",
      "x ≥ 2",
      "x > −2",
      "x ≠ 2",
      "x > 0",
    ],
    respuesta: 0,
    explicacion:
      "El logaritmo requiere un argumento estrictamente positivo: x − 2 > 0 → x > 2. Con x = 2 el argumento sería 0 y log(0) no está definido.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado:
      "Una población de 1.000 bacterias se duplica cada 3 horas, según el modelo P(t) = 1.000 · 2^(t/3). ¿Cuántas bacterias habrá después de 12 horas?",
    alternativas: ["4.000", "8.000", "12.000", "16.000", "24.000"],
    respuesta: 3,
    explicacion:
      "En 12 horas hay 12/3 = 4 duplicaciones: P = 1.000 · 2⁴ = 1.000 · 16 = 16.000 bacterias.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "La función f(x) = (1/2)ˣ es",
    alternativas: ["creciente", "decreciente", "constante", "lineal", "cuadrática"],
    respuesta: 1,
    explicacion:
      "Es una función exponencial con base 1/2, que está entre 0 y 1: toda función exponencial con base en ]0, 1[ es decreciente.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "La solución de la ecuación log₃(x) = 2 es",
    alternativas: ["6", "8", "9", "27", "5"],
    respuesta: 2,
    explicacion:
      "log₃(x) = 2 equivale a x = 3² = 9.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "Si f(x) = 3ˣ y g(x) = x + 1, entonces f(g(2)) es igual a",
    alternativas: ["9", "27", "12", "81", "18"],
    respuesta: 1,
    explicacion:
      "g(2) = 3, luego f(g(2)) = f(3) = 3³ = 27. La composición se evalúa de adentro hacia afuera.",
  },
  {
    module: "M2",
    eje: "funciones",
    enunciado: "La función inversa de f(x) = 2ˣ es",
    alternativas: [
      "log₂(x)",
      "2/x",
      "x²",
      "logₓ(2)",
      "−2ˣ",
    ],
    respuesta: 0,
    explicacion:
      "La exponencial y el logaritmo con la misma base son funciones inversas: si y = 2ˣ, entonces x = log₂(y). Sus gráficas son simétricas respecto de la recta y = x.",
  },
];
