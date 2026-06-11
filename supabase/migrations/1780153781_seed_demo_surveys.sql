/*
  # Seed demo surveys for beta

  Inserts 3 sample surveys for macroeconomic data collection:
  1. Ingreso y Gasto Familiar (income/expenditure)
  2. Empleo y Actividad Económica (employment)
  3. Acceso a Servicios Básicos (basic services)

  Each survey has a questions array with question objects containing:
  - id: unique question identifier
  - text: the question text
  - type: select | number | text | scale
  - options: array of options (for select/scale types)
  - required: boolean
*/

INSERT INTO surveys (id, title, description, category, questions, is_active, estimated_minutes) VALUES
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Ingreso y Gasto Familiar',
  'Encuesta sobre ingresos, fuentes de ingreso y patrones de gasto del hogar. Datos utilizados para indicadores macroeconómicos de consumo.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Cuál es el ingreso mensual aproximado de su hogar?", "type": "select", "options": ["Menos de $5,000 MXN", "$5,000 - $10,000 MXN", "$10,000 - $20,000 MXN", "$20,000 - $40,000 MXN", "Más de $40,000 MXN"], "required": true},
    {"id": "q2", "text": "¿Cuántas personas aportan ingresos al hogar?", "type": "number", "required": true},
    {"id": "q3", "text": "¿Cuál es la principal fuente de ingreso?", "type": "select", "options": ["Empleo formal", "Empleo informal", "Negocio propio", "Remesas", "Pensión/jubilación", "Programas sociales", "Otro"], "required": true},
    {"id": "q4", "text": "¿Qué porcentaje del ingreso se destina a alimentación?", "type": "select", "options": ["Menos del 20%", "20% - 40%", "40% - 60%", "Más del 60%"], "required": true},
    {"id": "q5", "text": "¿El hogar tiene algún tipo de ahorro?", "type": "select", "options": ["Sí, formal (banco)", "Sí, informal (tanda, caja)", "No tiene ahorro"], "required": true},
    {"id": "q6", "text": "¿El hogar tiene deudas activas?", "type": "select", "options": ["No", "Sí, menos de 1 mes de ingreso", "Sí, entre 1-6 meses de ingreso", "Sí, más de 6 meses de ingreso"], "required": true}
  ]'::jsonb,
  true,
  8
),
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Empleo y Actividad Económica',
  'Encuesta sobre situación laboral, tipo de empleo, prestaciones y percepciones del mercado laboral local.',
  'empleo',
  '[
    {"id": "q1", "text": "¿Cuál es su situación laboral actual?", "type": "select", "options": ["Empleado tiempo completo", "Empleado medio tiempo", "Trabajador independiente", "Desempleado buscando empleo", "Desempleado sin buscar", "Estudiante", "Jubilado/Pensionado", "Labores del hogar"], "required": true},
    {"id": "q2", "text": "¿Su empleo actual cuenta con contrato formal?", "type": "select", "options": ["Sí", "No", "No aplica"], "required": true},
    {"id": "q3", "text": "¿Tiene acceso a seguro médico por su empleo?", "type": "select", "options": ["IMSS", "ISSSTE", "Seguro privado", "Sin seguro médico", "No aplica"], "required": true},
    {"id": "q4", "text": "¿Cuántas horas trabaja a la semana en promedio?", "type": "number", "required": true},
    {"id": "q5", "text": "¿Cómo percibe la situación económica de su municipio comparada con hace un año?", "type": "scale", "options": ["Mucho peor", "Peor", "Igual", "Mejor", "Mucho mejor"], "required": true},
    {"id": "q6", "text": "¿Ha considerado migrar por motivos laborales en los últimos 12 meses?", "type": "select", "options": ["No", "Sí, dentro del estado", "Sí, a otro estado", "Sí, fuera del país"], "required": true}
  ]'::jsonb,
  true,
  10
),
(
  'c3d4e5f6-a7b8-9012-cdef-123456789012',
  'Acceso a Servicios Básicos',
  'Encuesta sobre acceso a agua, electricidad, internet, salud y educación en la vivienda y comunidad.',
  'servicios',
  '[
    {"id": "q1", "text": "¿Su vivienda cuenta con agua entubada?", "type": "select", "options": ["Sí, dentro de la vivienda", "Sí, fuera pero dentro del terreno", "No, se abastece de otra forma"], "required": true},
    {"id": "q2", "text": "¿Cuántas horas al día tiene servicio de agua?", "type": "select", "options": ["24 horas", "12-23 horas", "6-11 horas", "Menos de 6 horas", "No tiene servicio regular"], "required": true},
    {"id": "q3", "text": "¿Su vivienda cuenta con servicio de electricidad?", "type": "select", "options": ["Sí, sin interrupciones frecuentes", "Sí, con interrupciones frecuentes", "No"], "required": true},
    {"id": "q4", "text": "¿Tiene acceso a internet en su vivienda?", "type": "select", "options": ["Sí, fibra óptica/cable", "Sí, datos móviles solamente", "Sí, satelital", "No tiene acceso"], "required": true},
    {"id": "q5", "text": "¿A qué distancia está el centro de salud más cercano?", "type": "select", "options": ["Menos de 15 minutos", "15-30 minutos", "30-60 minutos", "Más de 1 hora"], "required": true},
    {"id": "q6", "text": "¿Cuántas escuelas de educación básica hay en su comunidad?", "type": "number", "required": true},
    {"id": "q7", "text": "¿Cómo califica la calidad de los servicios públicos en su municipio?", "type": "scale", "options": ["Muy mala", "Mala", "Regular", "Buena", "Muy buena"], "required": true}
  ]'::jsonb,
  true,
  12
)
ON CONFLICT (id) DO NOTHING;