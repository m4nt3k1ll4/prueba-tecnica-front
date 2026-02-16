import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { bebasNeue } from "@/app/ui/fonts";
import {
  FiMail,
  FiPhone,
  FiGithub,
  FiLinkedin,
  FiDownload,
  FiExternalLink,
  FiBook,
  FiAward,
  FiBriefcase,
  FiBox,
  FiCode,
  FiCpu,
  FiDatabase,
  FiPlay,
  FiServer,
  FiGlobe,
  FiLock,
  FiInfo,
  FiLayers,
  FiMessageSquare,
} from "react-icons/fi";

/* ──────────────────────────── DATA ──────────────────────────── */

/* ─── Infraestructura ─── */

const infraestructura = [
  {
    icon: FiGlobe,
    servicio: "Vercel",
    rol: "Frontend (Next.js 16)",
    descripcion:
      "Hosting del frontend con despliegue automático desde GitHub. Implementa Server Components, Server Actions, streaming SSR, ISR (Incremental Static Regeneration) con revalidación inteligente cada 30-60 segundos, y edge functions para máximo rendimiento global.",
  },
  {
    icon: FiServer,
    servicio: "Railway",
    rol: "Backend API (Laravel 12)",
    descripcion:
      "Hosting del backend PHP/Laravel con base de datos MySQL integrada. Gestiona toda la lógica de negocio: productos, inventario, ventas, usuarios, roles y autenticación de la API REST con Sanctum. Incluye middleware de autorización por rol y generación IA con Google Gemini.",
  },
  {
    icon: FiDatabase,
    servicio: "Supabase",
    rol: "Base de datos Frontend (PostgreSQL)",
    descripcion:
      "Base de datos PostgreSQL gestionada para el frontend con Prisma ORM. Almacena sesiones de NextAuth.js, cuentas OAuth (Google), tokens JWT, historial de compras del usuario y carrito de compras. Integración nativa con NextAuth.js para autenticación multi-proveedor.",
  },
];

/* ─── Decisiones Arquitectónicas ─── */

const decisiones = [
  {
    pregunta: "¿Por qué arquitectura dual-database?",
    respuesta:
      "El backend Laravel (Railway + MySQL) gestiona el core del negocio: productos, stock, ventas, roles y autenticación de la API REST. El frontend Next.js mantiene su propia base de datos en Supabase (PostgreSQL) para NextAuth.js: sesiones, cuentas OAuth de Google, tokens JWT y datos específicos del frontend como el historial de compras y carrito. Esta separación permite evolución independiente, escalabilidad horizontal y desacoplamiento total entre capas.",
  },
  {
    pregunta: "¿Por qué Next.js + Laravel desacoplados?",
    respuesta:
      "La arquitectura desacoplada maximiza las ventajas de ambos frameworks: Next.js 16 usa Server Components, Server Actions, streaming SSR e ISR para rendimiento óptimo; Laravel 12 se enfoca exclusivamente en la API REST, validación de negocio, protección con Sanctum y generación IA con Gemini. Simula un entorno de producción real con equipos frontend/backend independientes y permite deploy separado.",
  },
  {
    pregunta: "¿Por qué NextAuth.js + Sanctum?",
    respuesta:
      "NextAuth.js 4.0 gestiona la autenticación del frontend: Google OAuth para usuarios finales, credenciales para admin/entrevistador, sesiones JWT y refresh automático de tokens. Sanctum protege la API Laravel con tokens de corta duración (5 minutos) y middleware de autorización por rol. Esta combinación permite multi-proveedor robusto sin acoplar el frontend al backend de autenticación.",
  },
  {
    pregunta: "¿Por qué Prisma y Eloquent?",
    respuesta:
      "Cada ORM es idóneo para su ecosistema: Prisma en Node.js/TypeScript ofrece tipado end-to-end completo, migraciones declarativas, queries type-safe y generación automática de tipos para Server Components. Eloquent en Laravel proporciona un ORM maduro, fluido y eficiente para la API REST con relaciones, scopes y mutators. Usar el mejor ORM de cada stack maximiza la productividad y la calidad del código.",
  },
  {
    pregunta: "¿Cómo funciona la sincronización entre bases de datos?",
    respuesta:
      "No hay sincronización directa - cada base de datos tiene responsabilidades claras. El frontend consulta la API Laravel para productos, stock y ventas (datos de negocio). El backend no conoce las sesiones de NextAuth ni el carrito del usuario. El ID de usuario se envía en cada request autenticado para vincular compras. Esta arquitectura evita estados duplicados y mantiene una única fuente de verdad para cada dominio.",
  },
];

/* ─── Indicaciones para el entrevistador ─── */

const indicaciones = [
  {
    titulo: "Rol de Entrevistador",
    detalle:
      "Se le ha asignado el rol 'interviewer' a sus credenciales. Este rol otorga acceso completo tanto a la vista de usuario (catálogo, carrito, historial de compras) como a la vista de administración (dashboard, productos, inventario, usuarios, ventas). Puede navegar libremente por todas las secciones de la aplicación.",
  },
  {
    titulo: "Navegación",
    detalle:
      "En el menú lateral encontrará acceso directo a esta Presentación y al Catálogo. Además, puede modificar la URL manualmente para acceder a cualquier ruta del dashboard (/dashboard, /dashboard/products, /dashboard/admin/stock, etc.) y verá el contenido completo.",
  },
  {
    titulo: "Flujo de Compra",
    detalle:
      "Puede probar el flujo completo de compra: navegar el catálogo, añadir productos al carrito, ver el modal de detalle con stock disponible y realizar una compra. Su historial se almacena en 'Mis Compras'.",
  },
  {
    titulo: "Generación IA",
    detalle:
      "Desde la vista de productos (admin), puede generar descripciones con IA usando Google Gemini. El backend Laravel envía el prompt al modelo y devuelve la descripción generada.",
  },
];

/* ─── Integraciones técnicas ─── */

const integraciones = [
  {
    icon: FiCpu,
    nombre: "Google Gemini AI",
    descripcion: "Generación automática de descripciones de productos con IA generativa. El backend Laravel envía prompts optimizados a Gemini y procesa las respuestas para crear descripciones de marketing atractivas y precisas.",
  },
  {
    icon: FiDatabase,
    nombre: "Dual Database",
    descripcion:
      "Prisma ORM + Supabase PostgreSQL para frontend (NextAuth, sesiones, carrito). Eloquent ORM + Railway MySQL para backend (productos, stock, ventas, usuarios). Comunicación vía API REST autenticada.",
  },
  {
    icon: FiCode,
    nombre: "NextAuth.js 4.0 + Sanctum",
    descripcion:
      "Autenticación híbrida: NextAuth 4.0 para Google OAuth y credenciales en el frontend, Sanctum para proteger la API Laravel. Tokens JWT con refresh automático cada 5 minutos. Middleware de autorización por rol en ambas capas.",
  },
  {
    icon: FiLock,
    nombre: "Sistema de Roles",
    descripcion:
      "3 roles con permisos granulares: admin (acceso total), client (catálogo y compras), interviewer (visualización completa). Middleware en Laravel valida roles en API. NextAuth maneja permisos en rutas protegidas del frontend.",
  },
];

const proyectoHighlights = [
  "CRUD completo de productos con generación IA de descripciones (Google Gemini)",
  "Gestión de inventario/stock con KPIs en tiempo real y alertas de bajo stock",
  "Catálogo público con buscador, paginación, carrito de compras y modal de detalle",
  "Panel de administración: usuarios (pending/active), ventas, stock, productos",
  "Scraper de Amazon integrado para importación rápida de productos",
  "Rol de entrevistador con zona exclusiva de presentación técnica",
  "Arquitectura dual-database desacoplada (PostgreSQL + MySQL)",
  "Caching optimizado con Next.js ISR (revalidate 30-60s) y Server Components",
  "Autenticación multi-proveedor (Google OAuth + credenciales) con JWT",
  "Refresh automático de tokens cada 5 minutos con componente TokenRefresher",
  "Asignación dinámica de roles desde el panel de admin (client/interviewer)",
  "Aprobación manual de usuarios registrados antes de acceder (pending users)",
  "Historial de compras personalizado por usuario con detalle de productos",
  "Despliegue en producción: Vercel (frontend) + Railway (backend) + Supabase (DB)",
  "Diseño responsive con Tailwind CSS y modo oscuro nativo",
  "Middleware de protección de rutas en Next.js y Laravel",
];

/* ─── Datos personales ─── */

const contacto = {
  email: "juanlorenzo.suarez@gmail.com",
  phone: "+57 310 886 0830",
  whatsapp: "https://wa.me/573108860830",
  github: "https://github.com/m4nt3k1ll4",
  linkedin: "https://www.linkedin.com/in/m4nt3k1ll4",
  cvUrl: "/CV_FULLSTACK_JUAN_SUAREZ_ES (3).pdf",
};

const sobreMi = {
  nombre: "Juan Lorenzo Suárez Jiménez",
  titulo: "Desarrollador Full-Stack",
  resumen:
    "Desarrollador Full Stack con 2 años de experiencia en el desarrollo y mantenimiento de aplicaciones web en producción, utilizando arquitecturas modernas incluyendo serverless. Experiencia práctica con Angular, React y Next.js para el frontend, Laravel y Cloudflare Workers para el backend. Implementación e integración de APIs REST, manejo de bases de datos y desarrollo de automatizaciones backend. Enfoque en calidad de código, escalabilidad y mejora continua.",
};

const experiencia = [
  {
    puesto: "Full-Stack Developer",
    empresa: "DAITECH SAS",
    periodo: "Feb 2025 — Actualidad",
    descripcion:
      "Desarrollo de aplicaciones web con React y Next.js. Implementación de funciones backend bajo arquitectura serverless utilizando Cloudflare Workers. Integración de Supabase para autenticación y persistencia de datos. Automatización de procesos backend mediante n8n.",
  },
  {
    puesto: "Desarrollador Full-Stack Freelance",
    empresa: "Freelance",
    periodo: "2024 — 2025",
    descripcion:
      "Desarrollo de un SaaS de gestión de tareas con Laravel (API RESTful) y Angular. Diseño de endpoints, lógica de negocio y persistencia de datos en MySQL. Consumo de APIs REST y manejo de estado en frontend con TypeScript.",
  },
  {
    puesto: "Analista de Marketing",
    empresa: "Crosstraining Piedecuesta",
    periodo: "Mar 2024 — Feb 2025",
    descripcion:
      "Análisis de métricas digitales y rendimiento de campañas. Comunicación con equipos multidisciplinarios. Gestión de prioridades y cumplimiento de objetivos. Enfoque en experiencia de usuario y optimización de procesos.",
  },
  {
    puesto: "Auxiliar / Líder de Rampa",
    empresa: "Menzies Aviation Colombia",
    periodo: "Mar 2022 — Jul 2023",
    descripcion:
      "Liderazgo operativo durante operaciones en plataforma. Coordinación de equipos en entornos de alta presión y tiempos críticos. Supervisión del cumplimiento de protocolos de seguridad.",
  },
];

const formacion = [
  {
    titulo: "Técnico en Programación de Software",
    centro: "Servicio Nacional de Aprendizaje (SENA)",
    periodo: "",
  },
  {
    titulo: "PCAP – Programming Essentials in Python",
    centro: "Cisco Networking Academy",
    periodo: "",
  },
];

const conocimientos = {
  frontend: ["React", "Next.js", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  backend: ["PHP", "Laravel", "Cloudflare Workers", "Supabase", "n8n"],
  databases: ["MySQL", "PostgreSQL"],
  tools: ["Git", "GitHub", "Linux", "Docker", "Insomnia"],
};

const proyectos = [
  {
    nombre: "CrossTaskManager",
    descripcion:
      "SaaS de gestión de tareas con backend en Laravel y frontend en Angular. Incluye gestión de usuarios, tareas y estados, con arquitectura RESTful y base de datos MySQL.",
  },
  {
    nombre: "Humbertoss (Producción)",
    descripcion:
      "Landing page orientada a conversión y contacto comercial.",
  },
  {
    nombre: "OfMedicalSAS (Producción)",
    descripcion:
      "Sitio web con catálogo y carrito de cotización integrado a WhatsApp para atención personalizada.",
  },
  {
    nombre: "QUIROGAABOGADOS (Producción)",
    descripcion:
      "Sitio web de presentación para la firma Quiroga Abogados Asociados con redirección a WhatsApp con mensaje precargado.",
  },
];

/** ✏️  Pon el ID de tu video de YouTube (la parte después de v=) */
const youtubeVideoId = ""; // Ej: "dQw4w9WgXcQ"

/* ──────────────────────────── PAGE ──────────────────────────── */

export default async function PresentacionPage() {
  const session = await auth();

  // Solo accesible para interviewers y admins
  if (!session?.user?.isInterviewer && !session?.user?.isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-10">
      {/* ─── Header ─── */}
      <div>
        <h1
          className={`${bebasNeue.className} text-3xl tracking-wider sm:text-4xl md:text-5xl`}
        >
          Presentación del Proyecto
        </h1>
        <p className="mt-2 text-zinc-400">
          Sistema de comercio electrónico full-stack con arquitectura dual-database. Frontend en Next.js con Server Components y autenticación multi-proveedor, backend en Laravel con API RESTful protegida con Sanctum, integración con IA generativa para descripciones de productos y sistema de roles avanzado.
        </p>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN 1: PROYECTO (lo más importante)
          ═══════════════════════════════════════════════════════════ */}

      {/* ─── Indicaciones para el Entrevistador ─── */}
      <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-amber-300">
          <FiInfo className="h-5 w-5" />
          Indicaciones para el Entrevistador
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {indicaciones.map((ind) => (
            <div
              key={ind.titulo}
              className="rounded-xl border border-amber-500/20 bg-black/20 p-5"
            >
              <h3 className="mb-1.5 text-sm font-semibold text-amber-200">{ind.titulo}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{ind.detalle}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Infraestructura / Despliegue ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiServer className="h-5 w-5 text-indigo-400" />
          Infraestructura y Despliegue
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {infraestructura.map((inf) => (
            <div
              key={inf.servicio}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition-all hover:border-zinc-700"
            >
              <inf.icon className="mb-3 h-6 w-6 text-indigo-400" />
              <h3 className="mb-0.5 text-sm font-semibold">{inf.servicio}</h3>
              <p className="mb-2 text-xs font-medium text-indigo-400">{inf.rol}</p>
              <p className="text-xs leading-relaxed text-zinc-400">{inf.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Decisiones Arquitectónicas ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiLayers className="h-5 w-5 text-indigo-400" />
          Decisiones Arquitectónicas
        </h2>
        <div className="space-y-5">
          {decisiones.map((d) => (
            <div
              key={d.pregunta}
              className="rounded-xl border border-zinc-800 bg-black/20 p-5"
            >
              <h3 className="mb-2 text-sm font-semibold text-indigo-300">{d.pregunta}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{d.respuesta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Integraciones técnicas ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiCode className="h-5 w-5 text-indigo-400" />
          Integraciones Técnicas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {integraciones.map((int) => (
            <div
              key={int.nombre}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition-all hover:border-zinc-700"
            >
              <int.icon className="mb-3 h-6 w-6 text-indigo-400" />
              <h3 className="mb-1 text-sm font-semibold">{int.nombre}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">
                {int.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Funcionalidades Destacadas ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiBook className="h-5 w-5 text-indigo-400" />
          Funcionalidades Destacadas
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {proyectoHighlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-sm text-zinc-300"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              {h}
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Video Presentación ─── */}
      {youtubeVideoId && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <FiPlay className="h-5 w-5 text-indigo-400" />
            Video Presentación
          </h2>
          <div className="aspect-video overflow-hidden rounded-xl">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="Video Presentación"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          SECCIÓN 2: SOBRE EL CANDIDATO
          ═══════════════════════════════════════════════════════════ */}

      {/* ─── Separador ─── */}
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-zinc-800" />
        <span className={`${bebasNeue.className} text-xl tracking-wider text-zinc-500`}>
          Sobre el Candidato
        </span>
        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      {/* ─── Contact Card ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold">{sobreMi.nombre}</h2>
            <p className="mt-1 text-sm font-medium text-indigo-400">
              {sobreMi.titulo}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              {sobreMi.resumen}
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:items-end">
            <a
              href={`mailto:${contacto.email}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              <FiMail className="h-4 w-4 text-indigo-400" />
              {contacto.email}
            </a>
            <a
              href={`tel:${contacto.phone}`}
              className="inline-flex items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-white"
            >
              <FiPhone className="h-4 w-4 text-indigo-400" />
              {contacto.phone}
            </a>
            <div className="mt-2 flex gap-2">
              <a
                href={contacto.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href={contacto.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiLinkedin className="h-4 w-4" />
              </a>
              <a
                href={contacto.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-700 p-2 text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
              >
                <FiMessageSquare className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* CV Download */}
        {contacto.cvUrl && (
          <a
            href={contacto.cvUrl}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            <FiDownload className="h-4 w-4" />
            Descargar CV (PDF)
          </a>
        )}
      </section>

      {/* ─── Experiencia ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiBriefcase className="h-5 w-5 text-indigo-400" />
          Experiencia Profesional
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {experiencia.map((exp) => (
            <div
              key={exp.puesto + exp.empresa}
              className="border-l-2 border-indigo-600/30 pl-4"
            >
              <h3 className="text-sm font-semibold">{exp.puesto}</h3>
              <p className="text-xs text-indigo-400">
                {exp.empresa} · {exp.periodo}
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                {exp.descripcion}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Conocimientos Técnicos & Formación ─── */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Conocimientos */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <FiCode className="h-5 w-5 text-indigo-400" />
            Conocimientos Técnicos
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Frontend</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.frontend.map((t) => (
                  <span key={t} className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-300">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Backend / Serverless</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.backend.map((t) => (
                  <span key={t} className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Bases de Datos</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.databases.map((t) => (
                  <span key={t} className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">{t}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Herramientas</h3>
              <div className="flex flex-wrap gap-1.5">
                {conocimientos.tools.map((t) => (
                  <span key={t} className="rounded-md bg-zinc-700/50 px-2.5 py-1 text-xs font-medium text-zinc-300">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Formación */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
            <FiAward className="h-5 w-5 text-indigo-400" />
            Formación Académica
          </h2>
          <div className="space-y-6">
            {formacion.map((f) => (
              <div
                key={f.titulo + f.centro}
                className="border-l-2 border-indigo-600/30 pl-4"
              >
                <h3 className="text-sm font-semibold">{f.titulo}</h3>
                <p className="text-xs text-indigo-400">
                  {f.centro}{f.periodo ? ` · ${f.periodo}` : ""}
                </p>
              </div>
            ))}
          </div>

          {/* Idiomas */}
          <div className="mt-8 border-t border-zinc-800 pt-6">
            <h3 className="mb-3 text-sm font-semibold">Idiomas</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Español</span>
                <span className="text-indigo-400">Nativo</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300">Inglés</span>
                <span className="text-zinc-400">Básico – Técnico (lectura de documentación)</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ─── Otros Proyectos ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold">
          <FiBox className="h-5 w-5 text-indigo-400" />
          Otros Proyectos
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {proyectos.map((p) => (
            <div
              key={p.nombre}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition-all hover:border-zinc-700"
            >
              <h3 className="mb-1.5 text-sm font-semibold">{p.nombre}</h3>
              <p className="text-xs leading-relaxed text-zinc-400">{p.descripcion}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Links útiles ─── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <FiExternalLink className="h-5 w-5 text-indigo-400" />
          Recursos
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/m4nt3k1ll4/app-fullstack-pt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <FiGithub className="h-4 w-4" />
            Repositorio del Proyecto
          </a>
          <a
            href={contacto.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
          >
            <FiLinkedin className="h-4 w-4" />
            Perfil LinkedIn
          </a>
          {contacto.cvUrl && (
            <a
              href={contacto.cvUrl}
              download
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              <FiDownload className="h-4 w-4" />
              Descargar CV
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
