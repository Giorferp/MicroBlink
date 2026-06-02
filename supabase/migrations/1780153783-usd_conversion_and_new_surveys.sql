-- Migración para limpiar, convertir todas las encuestas a USD y agregar nuevas encuestas (Total: 15)
-- Esto reemplaza los datos existentes para garantizar consistencia con la moneda USD de EE.UU.

TRUNCATE TABLE surveys CASCADE;

INSERT INTO surveys (id, title, description, category, questions, is_active, estimated_minutes) VALUES
-- 1. Ingreso y Gasto Familiar (USD)
(
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Ingreso y Gasto Familiar',
  'Encuesta sobre ingresos, fuentes de ingreso y patrones de gasto del hogar en USD. Datos utilizados para indicadores macroeconómicos de consumo.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Cuál es el ingreso mensual aproximado de su hogar?", "type": "select", "options": ["Menos de $1,500 USD", "$1,500 - $3,000 USD", "$3,000 - $5,000 USD", "$5,000 - $10,000 USD", "Más de $10,000 USD"], "required": true},
    {"id": "q2", "text": "¿Cuántas personas aportan ingresos al hogar?", "type": "number", "required": true},
    {"id": "q3", "text": "¿Cuál es la principal fuente de ingreso?", "type": "select", "options": ["Empleo formal", "Empleo informal", "Negocio propio", "Remesas", "Pensión/jubilación", "Programas sociales", "Otro"], "required": true},
    {"id": "q4", "text": "¿Qué porcentaje del ingreso se destina a alimentación?", "type": "select", "options": ["Menos del 20%", "20% - 40%", "40% - 60%", "Más del 60%"], "required": true},
    {"id": "q5", "text": "¿El hogar tiene algún tipo de ahorro?", "type": "select", "options": ["Sí, formal (banco)", "Sí, informal (caja de ahorro/efectivo)", "No tiene ahorro"], "required": true},
    {"id": "q6", "text": "¿El hogar tiene deudas activas?", "type": "select", "options": ["No", "Sí, menos de 1 mes de ingreso", "Sí, entre 1-6 meses de ingreso", "Sí, más de 6 meses de ingreso"], "required": true}
  ]'::jsonb,
  true,
  8
),

-- 2. Empleo y Actividad Económica
(
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'Empleo y Actividad Económica',
  'Encuesta sobre situación laboral, tipo de empleo, prestaciones y percepciones del mercado laboral local.',
  'empleo',
  '[
    {"id": "q1", "text": "¿Cuál es su situación laboral actual?", "type": "select", "options": ["Empleado tiempo completo", "Empleado medio tiempo", "Trabajador independiente", "Desempleado buscando empleo", "Desempleado sin buscar", "Estudiante", "Jubilado/Pensionado", "Labores del hogar"], "required": true},
    {"id": "q2", "text": "¿Su empleo actual cuenta con contrato formal?", "type": "select", "options": ["Sí", "No", "No aplica"], "required": true},
    {"id": "q3", "text": "¿Tiene acceso a seguro médico por su empleo?", "type": "select", "options": ["Medicare / Medicaid", "Seguro patrocinado por empleador", "Seguro privado", "Sin seguro médico", "No aplica"], "required": true},
    {"id": "q4", "text": "¿Cuántas horas trabaja a la semana en promedio?", "type": "number", "required": true},
    {"id": "q5", "text": "¿Cómo percibe la situación económica de su comunidad comparada con hace un año?", "type": "scale", "options": ["Mucho peor", "Peor", "Igual", "Mejor", "Mucho mejor"], "required": true},
    {"id": "q6", "text": "¿Ha considerado migrar por motivos laborales en los últimos 12 meses?", "type": "select", "options": ["No", "Sí, a otro estado", "Sí, fuera del país"], "required": true}
  ]'::jsonb,
  true,
  10
),

-- 3. Acceso a Servicios Básicos
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
    {"id": "q7", "text": "¿Cómo califica la calidad de los servicios públicos en su localidad?", "type": "scale", "options": ["Muy mala", "Mala", "Regular", "Buena", "Muy buena"], "required": true}
  ]'::jsonb,
  true,
  12
),

-- 4. Canasta Básica e Inflación Percibida (USD)
(
  'd4e5f6a7-b8c9-0123-def0-123456789021',
  'Canasta Básica e Inflación Percibida',
  'Mide el impacto del aumento de precios en productos de consumo básico y cómo los hogares ajustan sus presupuestos en USD.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Ha percibido un aumento significativo en los precios de alimentos esenciales en los últimos 3 meses?", "type": "select", "options": ["Sí, muy alto", "Sí, moderado", "No, se mantienen estables", "No sé"], "required": true},
    {"id": "q2", "text": "¿Qué grupo de productos ha tenido la mayor subida de precios según su experiencia?", "type": "select", "options": ["Frutas y verduras", "Carnes, huevo y lácteos", "Granos (arroz, frijol)", "Productos de higiene", "Ninguno / Todos por igual"], "required": true},
    {"id": "q3", "text": "¿Qué medida ha tomado su hogar para compensar la inflación?", "type": "select", "options": ["Comprar marcas más baratas", "Reducir la cantidad de comida comprada", "Eliminar gastos no esenciales", "Trabajar horas extra o conseguir segundo empleo", "Ninguna"], "required": true},
    {"id": "q4", "text": "¿Cuál es su gasto promedio semanal exclusivamente en despensa/comida?", "type": "select", "options": ["Menos de $100 USD", "$100 - $200 USD", "$200 - $350 USD", "Más de $350 USD"], "required": true},
    {"id": "q5", "text": "Califique su nivel de preocupación por el costo de la vida actual:", "type": "scale", "options": ["Muy bajo", "Bajo", "Moderado", "Alto", "Muy alto"], "required": true}
  ]'::jsonb,
  true,
  7
),

-- 5. Retorno de Inversión en Educación y Empleo
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

-- 6. Inclusión Financiera y Remesas (USD)
(
  'f6a7b8c9-d0e1-2345-fff2-123456789023',
  'Inclusión Financiera y Remesas',
  'Encuesta sobre acceso a servicios bancarios, métodos de ahorro y flujo de transferencias desde el extranjero en USD.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Cuenta con alguna tarjeta de débito o cuenta bancaria a su nombre?", "type": "select", "options": ["Sí, cuenta nómina/ahorros", "Sí, cuenta digital (Fintech)", "No, utilizo solo efectivo"], "required": true},
    {"id": "q2", "text": "¿Cuál es su método preferido para pagar sus compras del día a día?", "type": "select", "options": ["Dinero en efectivo", "Tarjeta física de débito/crédito", "Transferencias electrónicas (ACH, Wire, SEPA, FedNow)", "Pagos móviles (NFC/QR/Apple Pay)"], "required": true},
    {"id": "q3", "text": "¿Su hogar recibe transferencias o dinero del extranjero (remesas)?", "type": "select", "options": ["Sí, mensualmente", "Sí, ocasionalmente", "No recibe"], "required": true},
    {"id": "q4", "text": "Si recibe remesas, ¿en qué se gasta principalmente ese capital?", "type": "select", "options": ["Alimentación y vestimenta", "Salud y educación", "Pago de deudas", "Construcción o mejora de vivienda", "Inversión en negocio / Ahorro", "No aplica"], "required": true},
    {"id": "q5", "text": "¿Qué tan seguro se siente guardando dinero en instituciones financieras formales?", "type": "scale", "options": ["Muy inseguro", "Inseguro", "Neutral", "Seguro", "Muy seguro"], "required": true}
  ]'::jsonb,
  true,
  7
),

-- 7. Condición de la Vivienda y Equipamiento
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

-- 8. Salud Familiar y Gasto de Bolsillo (USD)
(
  'b8c9d0e1-f2a3-4567-bbb4-123456789025',
  'Salud Familiar y Gasto de Bolsillo',
  'Analiza la cobertura médica de los encuestados y el gasto monetario en salud privada debido a deficiencias del sistema público en USD.',
  'servicios',
  '[
    {"id": "q1", "text": "¿A qué institución de salud tiene derecho o afiliación?", "type": "select", "options": ["Medicare / Medicaid", "Seguro patrocinado por empleador", "Seguro privado individual", "Sin cobertura (salud abierta)"], "required": true},
    {"id": "q2", "text": "Cuando enferma algún integrante de su hogar, ¿a dónde acuden habitualmente?", "type": "select", "options": ["Hospital o clínica pública", "Consultorio de urgencia / Farmacia privada (bajo costo)", "Consultorio médico privado especializado", "Automedicación"], "required": true},
    {"id": "q3", "text": "¿Cuánto dinero al mes destina su hogar a la compra de medicamentos?", "type": "select", "options": ["Menos de $30 USD", "$30 - $100 USD", "$100 - $250 USD", "Más de $250 USD"], "required": true},
    {"id": "q4", "text": "¿Ha tenido que recurrir a préstamos para pagar alguna emergencia de salud en el último año?", "type": "select", "options": ["Sí, préstamos familiares", "Sí, crédito formal o de prestamistas", "No, utilicé mis ahorros", "No, no tuve emergencias"], "required": true},
    {"id": "q5", "text": "Califique el nivel de abastecimiento de medicamentos del sector público en su zona:", "type": "scale", "options": ["Nulo", "Muy bajo", "Regular", "Aceptable", "Completo"], "required": true}
  ]'::jsonb,
  true,
  8
),

-- 9. Gasto en Consumo Digital y Suscripciones (USD)
(
  'c9d0e1f2-a3b4-5678-ccc5-123456789026',
  'Gasto en Consumo Digital y Suscripciones',
  'Analiza el gasto de los hogares en servicios de streaming, software y compras digitales en USD.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Cuánto gasta al mes en suscripciones de streaming, software o entretenimiento digital?", "type": "select", "options": ["Menos de $20 USD", "$20 - $50 USD", "$50 - $100 USD", "Más de $100 USD"], "required": true},
    {"id": "q2", "text": "¿Cuántas plataformas de streaming o servicios de suscripción paga activamente?", "type": "number", "required": true},
    {"id": "q3", "text": "¿Cuál es su principal canal de compras en línea?", "type": "select", "options": ["Amazon", "eBay", "Sitios directos de marcas", "Mercados digitales (App Store, etc.)", "No realizo compras en línea"], "required": true},
    {"id": "q4", "text": "¿Cómo prefiere pagar las suscripciones digitales?", "type": "select", "options": ["Tarjeta de crédito", "PayPal / Apple Pay / Google Pay", "Criptomonedas", "Tarjeta de débito"], "required": true},
    {"id": "q5", "text": "Califique la importancia de los servicios digitales en su presupuesto mensual:", "type": "scale", "options": ["Irrelevante", "Baja importancia", "Moderada", "Alta importancia", "Crítico / Indispensable"], "required": true}
  ]'::jsonb,
  true,
  5
),

-- 10. Costo de Vivienda y Alquiler (USD)
(
  'd0e1f2a3-b4c5-6789-ddd6-123456789027',
  'Costo de Vivienda y Alquiler',
  'Mide el costo del alquiler o hipoteca de los hogares y su peso relativo en el presupuesto mensual en USD.',
  'servicios',
  '[
    {"id": "q1", "text": "¿Cuál es su situación habitacional actual?", "type": "select", "options": ["Propietario con hipoteca pagada", "Propietario pagando hipoteca", "Inquilino (renta)", "Vivo con familiares sin pagar renta", "Otro"], "required": true},
    {"id": "q2", "text": "¿Cuánto paga mensualmente por concepto de renta o hipoteca?", "type": "select", "options": ["Menos de $500 USD", "$500 - $1,000 USD", "$1,000 - $2,000 USD", "$2,000 - $3,500 USD", "Más de $3,500 USD"], "required": true},
    {"id": "q3", "text": "¿Qué porcentaje de su ingreso mensual destina al pago de vivienda?", "type": "select", "options": ["Menos del 25%", "25% - 40%", "40% - 55%", "Más del 55%"], "required": true},
    {"id": "q4", "text": "¿Cuántas personas comparten el gasto del alquiler/hipoteca en su hogar?", "type": "number", "required": true},
    {"id": "q5", "text": "Califique la asequibilidad de la vivienda en su área o localidad:", "type": "scale", "options": ["Extremadamente barata", "Barata", "Regular", "Cara", "Impagable"], "required": true}
  ]'::jsonb,
  true,
  6
),

-- 11. Inversiones y Activos Financieros (USD)
(
  'e1f2a3b4-c5d6-7890-eee7-123456789028',
  'Inversiones y Activos Financieros',
  'Mide el nivel de ahorro de los participantes en diferentes clases de activos y su tolerancia al riesgo financiero en USD.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿En qué tipo de activos mantiene invertido su capital actualmente?", "type": "select", "options": ["Criptomonedas (Solana, Bitcoin, etc.)", "Acciones / ETFs", "Bienes Raíces", "Cuentas de ahorro de alto rendimiento", "No tengo inversiones activas"], "required": true},
    {"id": "q2", "text": "¿Qué porcentaje de sus ingresos mensuales destina a inversión o ahorro de largo plazo?", "type": "select", "options": ["0%", "1% - 10%", "10% - 25%", "Más del 25%"], "required": true},
    {"id": "q3", "text": "¿Con qué frecuencia realiza operaciones de inversión?", "type": "select", "options": ["Diariamente", "Semanalmente", "Mensualmente", "Ocasionalmente", "Nunca"], "required": true},
    {"id": "q4", "text": "¿Cuál es el principal objetivo de sus inversiones?", "type": "select", "options": ["Retiro / Jubilación", "Comprar una propiedad / casa", "Protección contra la inflación", "Ganancia especulativa a corto plazo", "No aplica"], "required": true},
    {"id": "q5", "text": "Califique su nivel de tolerancia al riesgo financiero:", "type": "scale", "options": ["Muy bajo", "Bajo", "Moderado", "Alto", "Muy alto"], "required": true}
  ]'::jsonb,
  true,
  6
),

-- 12. Adopción Cripto y Preferencias de Consumo (USD)
(
  'f2a3b4c5-d6e7-8901-fff8-123456789029',
  'Adopción Cripto y Preferencias de Consumo',
  'Mide el nivel de adopción de criptomonedas y tecnología descentralizada como medio de pago en el consumo diario en USD.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Ha utilizado criptomonedas para realizar compras de bienes o servicios en el último año?", "type": "select", "options": ["Sí, de forma habitual", "Sí, ocasionalmente", "No, pero poseo criptomonedas", "No, nunca las he usado"], "required": true},
    {"id": "q2", "text": "¿Cuál es la principal blockchain o red que prefiere usar debido a sus bajas comisiones?", "type": "select", "options": ["Solana", "Ethereum (L2/Rollups)", "Bitcoin (Lightning Network)", "BSC (BNB Chain)", "No aplica"], "required": true},
    {"id": "q3", "text": "¿Qué porcentaje de su patrimonio neto aproximado mantiene en criptoactivos?", "type": "select", "options": ["0%", "1% - 5%", "5% - 20%", "Más del 20%"], "required": true},
    {"id": "q4", "text": "¿Cuánto gastaría en promedio al mes utilizando stablecoins (ej. USDC, USDT) si su comercio local las aceptara?", "type": "select", "options": ["Menos de $100 USD", "$100 - $500 USD", "$500 - $1,500 USD", "Más de $1,500 USD"], "required": true},
    {"id": "q5", "text": "Califique su nivel de confianza en el ecosistema descentralizado frente a la banca tradicional:", "type": "scale", "options": ["Muy bajo", "Bajo", "Neutral", "Alto", "Muy alto"], "required": true}
  ]'::jsonb,
  true,
  6
),

-- 13. Expectativas del Mercado de Automóviles y Transporte (USD)
(
  'a3b4c5d6-e7f8-9012-aaa9-123456789030',
  'Mercado de Automóviles y Transporte',
  'Estudio sobre costos de transporte mensual, adquisición de vehículos eléctricos/combustión y preferencias de movilidad en USD.',
  'servicios',
  '[
    {"id": "q1", "text": "¿Cuál es su principal medio de transporte diario?", "type": "select", "options": ["Vehículo propio (gasolina/diésel)", "Vehículo propio (híbrido/eléctrico)", "Transporte público", "Servicios de plataforma (Uber/Lyft)", "Bicicleta / Micromovilidad / Caminar"], "required": true},
    {"id": "q2", "text": "¿Cuánto gasta al mes en promedio en transporte (combustible, tarifas, peajes, plataformas)?", "type": "select", "options": ["Menos de $100 USD", "$100 - $250 USD", "$250 - $500 USD", "Más de $500 USD"], "required": true},
    {"id": "q3", "text": "¿Tiene planes de adquirir o renovar su vehículo en los próximos 12 meses?", "type": "select", "options": ["Sí, planeo comprar un eléctrico/híbrido", "Sí, planeo comprar uno a combustión", "No tengo planes de compra", "No aplica"], "required": true},
    {"id": "q4", "text": "Si va a financiar un vehículo, ¿cuál es el pago mensual máximo que se ajusta a su presupuesto?", "type": "select", "options": ["Menos de $300 USD", "$300 - $500 USD", "$500 - $800 USD", "Más de $800 USD"], "required": true},
    {"id": "q5", "text": "Califique la calidad de la infraestructura vial y transporte público en su localidad:", "type": "scale", "options": ["Pésima", "Mala", "Regular", "Buena", "Excelente"], "required": true}
  ]'::jsonb,
  true,
  7
),

-- 14. Trabajo Remoto y Economía Gig (USD)
(
  'b4c5d6e7-f8a9-0123-bbba-123456789031',
  'Trabajo Remoto y Economía Gig',
  'Monitorea la transición al trabajo a distancia, la prevalencia del empleo por cuenta propia o ''gig'' y sus retribuciones financieras en USD.',
  'empleo',
  '[
    {"id": "q1", "text": "¿Cuál es su modalidad de trabajo actual?", "type": "select", "options": ["100% presencial", "Híbrido", "100% remoto", "No aplica / Desempleado"], "required": true},
    {"id": "q2", "text": "¿Ha realizado trabajos independientes en plataformas Gig (como Upwork, Fiverr, Uber, DoorDash) en el último mes?", "type": "select", "options": ["Sí, es mi principal fuente de ingresos", "Sí, para complementar mis ingresos", "No, no participo en la economía gig"], "required": true},
    {"id": "q3", "text": "¿Cuánto dinero extra en promedio percibe al mes por trabajos secundarios o independientes?", "type": "select", "options": ["$0 USD", "Menos de $200 USD", "$200 - $500 USD", "$500 - $1,500 USD", "Más de $1,500 USD"], "required": true},
    {"id": "q4", "text": "¿Cuánto ha invertido en equipamiento para su oficina en casa o herramientas de trabajo autónomo en el último año?", "type": "select", "options": ["$0 USD", "Menos de $300 USD", "$300 - $1,000 USD", "Más de $1,000 USD"], "required": true},
    {"id": "q5", "text": "Califique el impacto del trabajo remoto o independiente en su equilibrio de vida/trabajo:", "type": "scale", "options": ["Muy negativo", "Negativo", "Neutral", "Positivo", "Muy positivo"], "required": true}
  ]'::jsonb,
  true,
  6
),

-- 15. Preferencias de Viaje y Gasto en Turismo (USD)
(
  'c5d6e7f8-a9b0-1234-cccb-123456789032',
  'Viaje y Gasto en Turismo',
  'Encuesta sobre patrones de viaje, presupuestos de vacaciones anuales y preferencias de reserva turística en USD.',
  'ingreso',
  '[
    {"id": "q1", "text": "¿Cuántas veces viaja fuera de su ciudad de residencia por motivos de ocio al año?", "type": "select", "options": ["Ninguna", "1 vez al año", "2 - 3 veces al año", "Más de 3 veces al año"], "required": true},
    {"id": "q2", "text": "¿Cuál es el presupuesto promedio de viaje por persona en su hogar para sus vacaciones principales?", "type": "select", "options": ["Menos de $500 USD", "$500 - $1,500 USD", "$1,500 - $3,000 USD", "Más de $3,000 USD"], "required": true},
    {"id": "q3", "text": "¿Qué método utiliza habitualmente para reservar transporte y hospedaje?", "type": "select", "options": ["Agencias tradicionales", "Plataformas web (Booking, Expedia)", "Directamente con aerolínea/hotel", "Plataformas compartidas (Airbnb, VRBO)", "Otros"], "required": true},
    {"id": "q4", "text": "¿Ha utilizado esquemas de pago a plazos (Buy Now Pay Later / BNPL) para financiar algún viaje?", "type": "select", "options": ["Sí, habitualmente", "Sí, en ocasiones especiales", "No, pago de contado / tarjeta en una exhibición"], "required": true},
    {"id": "q5", "text": "Califique la influencia del costo de los vuelos y hospedajes en su decisión de viajar:", "type": "scale", "options": ["Irrelevante", "Bajo", "Moderado", "Alto", "Crítico (cancela viajes)"], "required": true}
  ]'::jsonb,
  true,
  6
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  questions = EXCLUDED.questions,
  is_active = EXCLUDED.is_active,
  estimated_minutes = EXCLUDED.estimated_minutes;
