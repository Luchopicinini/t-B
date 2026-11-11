T&B Global Logística Internacional

Sitio web de una empresa de logística e importación desde China, Brasil, India, EE.UU. y Europa. Incluye páginas de servicios, proceso, simulación de costos, contacto y un generador de piezas para redes sociales.

 Tecnologías

- Next.js 16 (App Router)
- React y TypeScript
- Tailwind CSS v4
- Python con Pillow (generación de piezas gráficas)
- Deploy en Vercel con integración a GitHub

 Estructura

app/                  páginas (inicio, servicios, cómo funciona, simulación, quiénes somos, contacto)
components/           componentes reutilizables (Header, Footer, WhatsAppFloat, asistentes y formularios)
lib/site.ts           datos centralizados: WhatsApp, correo, dirección, tarifa de referencia y textos
public/               imágenes y medios (logo, video de fondo)


Requisitos

- Node.js 20 o superior
- npm

 Instalación y desarrollo

bash
npm install
npm run dev

Abrí [http://localhost:3000](http://localhost:3000) en el navegador.

 Datos del negocio

Los datos de contacto, la tarifa de referencia por kilo y la dirección se editan en un solo lugar: `lib/site.ts`.

Los horarios de atención están en `components/Contacto.tsx` (constante `HOURS`) y todavía son un marcador (`00:00 – 00:00`) que hay que completar.



## Build y producción


npm run build
npm run start


El proyecto se despliega automáticamente en Vercel al hacer push a la rama `main`.

