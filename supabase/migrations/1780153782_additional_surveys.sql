-- Migración para añadir 5 encuestas microeconómicas y demográficas adicionales
-- Estas encuestas están enfocadas en la recolección de datos de alta pureza

INSERT INTO surveys (id, title, description, category, questions, is_active, estimated_minutes) VALUES
(
  'd4e5f6a7-b8c9-0123-def0-123456789021',
  'Canasta Básica e Inflación Percibida',
  'Mide el impacto del aumento de precios en productos de consumo básico y cómo los hogares ajustan sus presupuestos.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Ha percibido un aumento significativo en los precios de alimentos esenciales en los últimos 3 meses?", "type": "select", "options": ["Sí, muy alto", "Sí, moderado", "No, se mantienen estables", "No sé"], "required": true},
    {"id": "q2", "text": "¿Qué grupo de productos ha tenido la mayor subida de precios según su experiencia?", "type": "select", "options": ["Frutas y verduras", "Carnes, huevo y lácteos", "Granos (arroz, frijol, tortillas)", "Productos de higiene", "Ninguno / Todos por igual"], "required": true},
    {"id": "q3", "text": "¿Qué medida ha tomado su hogar para compensar la inflación?", "type": "select", "options": ["Comprar marcas más baratas", "Reducir la cantidad de comida comprada", "Eliminar gastos no esenciales", "Trabajar horas extra o conseguir segundo empleo", "Ninguna"], "required": true},
    {"id": "q4", "text": "¿Cuál es su gasto promedio semanal exclusivamente en despensa/comida?", "type": "select", "options": ["Menos de $1,000 MXN", "$1,000 - $2,000 MXN", "$2,000 - $3,500 MXN", "Más de $3,500 MXN"], "required": true},
    {"id": "q5", "text": "Califique su nivel de preocupación por el costo de la vida actual:", "type": "scale", "options": ["Muy bajo", "Bajo", "Moderado", "Alto", "Muy alto"], "required": true}
  ]'::jsonb,
  true,
  7
),
(
  'e5f6a7b8-c9d0-1234-efe1-123456789022',
  'Retorno de Inversión en Educación y Empleo',
  'Analiza la relación entre el nivel de estudios alcanzado, su costo y el ingreso percibido en el mercado laboral.',
  'empleo',
  '[
    {"id": "q1", "text": "¿Cuál es su último grado académico completo?", "type": "select", "options": ["Secundaria o menor", "Bachillerato / Técnico", "Licenciatura / Ingeniería", "Maestría / Doctorado"], "required": true},
    {"id": "q2", "text": "¿Su empleo actual está directamente relacionado con su área de estudios?", "type": "select", "options": ["Totalmente relacionado", "Parcialmente relacionado", "Nada relacionado", "No aplica / No tengo estudios especializados"], "required": true},
    {"id": "q3", "text": "¿Considera que sus ingresos económicos actuales corresponden a su nivel de educación?", "type": "select", "options": ["Sí, son justos", "No, debería ganar más", "No, gano más de lo esperado para mi área"], "required": true},
    {"id": "q4", "text": "¿Ha realizado cursos, diplomados o capacitaciones técnicas en los últimos 2 años?", "type": "select", "options": ["Sí, pagados por mí", "Sí, pagados por mi empleador", "No, pero me interesaría", "No"], "required": true},
    {"id": "q5", "text": "Califique qué tan difícil considera encontrar empleo formal en su profesión actual:", "type": "scale", "options": ["Muy fácil", "Fácil", "Regular", "Difícil", "Muy difícil"], "required": true}
  ]'::jsonb,
  true,
  6
),
(
  'f6a7b8c9-d0e1-2345-fff2-123456789023',
  'Inclusión Financiera y Remesas',
  'Encuesta sobre acceso a servicios bancarios, métodos de ahorro y flujo de transferencias desde el extranjero.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Cuenta con alguna tarjeta de débito o cuenta bancaria a su nombre?", "type": "select", "options": ["Sí, cuenta nómina/ahorros", "Sí, cuenta digital (Fintech)", "No, utilizo solo efectivo"], "required": true},
    {"id": "q2", "text": "¿Cuál es su método preferido para pagar sus compras del día a día?", "type": "select", "options": ["Dinero en efectivo", "Tarjeta física de débito/crédito", "Transferencias electrónicas (SPEI, CoDi)", "Pagos móviles (NFC/QR)"], "required": true},
    {"id": "q3", "text": "¿Su hogar recibe transferencias o dinero del extranjero (remesas)?", "type": "select", "options": ["Sí, mensualmente", "Sí, ocasionalmente", "No recibe"], "required": true},
    {"id": "q4", "text": "Si recibe remesas, ¿en qué se gasta principalmente ese capital?", "type": "select", "options": ["Alimentación y vestimenta", "Salud y educación", "Pago de deudas", "Construcción o mejora de vivienda", "Inversión en negocio / Ahorro", "No aplica"], "required": true},
    {"id": "q5", "text": "¿Qué tan seguro se siente guardando dinero en instituciones financieras formales?", "type": "scale", "options": ["Muy inseguro", "Inseguro", "Neutral", "Seguro", "Muy seguro"], "required": true}
  ]'::jsonb,
  true,
  7
),
(
  'a7b8c9d0-e1f2-3456-aaa3-123456789024',
  'Condición de la Vivienda y Equipamiento',
  'Evalúa la calidad demográfica de las viviendas a través de sus materiales de construcción y posesión de tecnologías.',
  'servicios',
  '[
    {"id": "q1", "text": "¿Cuál es el material principal en los pisos de su vivienda?", "type": "select", "options": ["Tierra / Adobe", "Cemento / Concreto simple", "Mosaico, madera u otro recubrimiento fino"], "required": true},
    {"id": "q2", "text": "¿Cuántos dormitorios tiene su vivienda exclusivamente para dormir?", "type": "number", "required": true},
    {"id": "q3", "text": "¿Cuál es el principal combustible utilizado para cocinar?", "type": "select", "options": ["Gas licuado (tanque o cilindro)", "Electricidad", "Leña o carbón", "Otro"], "required": true},
    {"id": "q4", "text": "¿Con qué dispositivos tecnológicos cuenta su hogar en funcionamiento?", "type": "select", "options": ["Solo celular inteligente", "Computadora de escritorio o laptop", "Televisor con internet (Smart TV)", "Ninguno de los anteriores"], "required": true},
    {"id": "q5", "text": "Califique el nivel de hacinamiento o espacio disponible de su hogar:", "type": "scale", "options": ["Crítico", "Insuficiente", "Regular", "Suficiente", "Excelente"], "required": true}
  ]'::jsonb,
  true,
  6
),
(
  'b8c9d0e1-f2a3-4567-bbb4-123456789025',
  'Salud Familiar y Gasto de Bolsillo',
  'Analiza la cobertura médica de los encuestados y el gasto monetario en salud privada debido a deficiencias del sistema público.',
  'servicios',
  '[
    {"id": "q1", "text": "¿A qué institución de salud pública tiene derecho o afiliación?", "type": "select", "options": ["Ninguno (salud abierta)", "IMSS / ISSSTE", "Seguro popular / IMSS Bienestar", "Seguro médico privado / De trabajo"], "required": true},
    {"id": "q2", "text": "Cuando enferma algún integrante de su hogar, ¿a dónde acuden habitualmente?", "type": "select", "options": ["Hospital o clínica pública", "Consultorio de farmacia privada (bajo costo)", "Consultorio médico privado especializado", "Automedicación / Medicina tradicional"], "required": true},
    {"id": "q3", "text": "¿Cuánto dinero al mes destina su hogar a la compra de medicamentos?", "type": "select", "options": ["Menos de $300 MXN", "$300 - $1,000 MXN", "$1,000 - $2,500 MXN", "Más de $2,500 MXN"], "required": true},
    {"id": "q4", "text": "¿Ha tenido que recurrir a préstamos para pagar alguna emergencia de salud en el último año?", "type": "select", "options": ["Sí, préstamos familiares", "Sí, crédito formal o de prestamistas", "No, utilicé mis ahorros", "No, no tuve emergencias"], "required": true},
    {"id": "q5", "text": "Califique el nivel de abastecimiento de medicamentos del sector público en su zona:", "type": "scale", "options": ["Nulo", "Muy bajo", "Regular", "Aceptable", "Completo"], "required": true}
  ]'::jsonb,
  true,
  8
);
