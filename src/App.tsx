import { useEffect, useRef, useState } from "react";

// ─── Particle network background ─────────────────────────────────────────────
function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const PARTICLE_COLOR = "184, 255, 87"; // --primary rgb
    const COUNT = 55;
    const MAX_DIST = 160;
    const SPEED = 0.28;

    type P = { x: number; y: number; vx: number; vy: number };
    let particles: P[] = [];

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1;

        // dot
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${PARTICLE_COLOR}, 0.35)`;
        ctx!.fill();

        // connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(q.x, q.y);
            ctx!.strokeStyle = `rgba(${PARTICLE_COLOR}, ${alpha})`;
            ctx!.lineWidth = 0.8;
            ctx!.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener("resize", init);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.7,
      }}
    />
  );
}

// ─── GitHub icon ──────────────────────────────────────────────────────────────
function GitHubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  problem: string;
  solution: string;
  stack: string[];
  metrics: { label: string; value: string }[];
  accent: string;
  category: "flagship" | "lab";
  siteUrl?: string;
  repoUrl?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: "anizen",
    index: "01",
    name: "AniZen",
    tagline: "PWA · IA · Multi-servidor · Anime streaming",
    problem:
      "Ver anime online implicaba saltar entre sitios lentos, llenos de publicidad agresiva y redirecciones molestas. Sin búsqueda inteligente, sin historial y sin una interfaz pensada para el usuario, encontrar y seguir un anime era más frustrante que disfrutable.",
    solution:
      "PWA construida en JavaScript vanilla, HTML y CSS con 3 servidores de reproducción que operan de forma simultánea y mutuamente para garantizar disponibilidad continua: si uno falla, los otros dos sostienen la experiencia. Noticias de anime actualizadas en todo momento integradas en la app. Firebase Auth para login fácil, Firestore para guardar animes, continuar episodios y gestionar listas personales. IA integrada con Gemini API para recomendaciones y búsqueda inteligente. Instalable como app nativa en cualquier dispositivo.",
    stack: ["JavaScript Vanilla", "HTML", "CSS", "Firebase Auth", "Firebase Firestore", "Firebase Hosting", "Gemini API", "PWA", "3 Servidores"],
    metrics: [
      { label: "Servidores activos", value: "×3" },
      { label: "Score Lighthouse", value: "96" },
      { label: "Carga inicial", value: "<1.4s" },
    ],
    accent: "#b8ff57",
    category: "flagship",
    siteUrl: "https://anizenlite.netlify.app/",
    repoUrl: "https://github.com/SantiagoCN69/Anime-FLV-LITE",
  },
  {
    id: "smaguiett",
    index: "02",
    name: "SmaguieTT",
    tagline: "E-commerce · Firestore · Funnel WhatsApp",
    problem:
      "Negocio local con ventas 100% presenciales y catálogo disperso en imágenes de WhatsApp. El 70% de leads se perdía por fricción en el proceso de compra y ausencia de canal digital estructurado.",
    solution:
      "E-commerce con catálogo dinámico en Firestore con actualizaciones en tiempo real, carrito persistente y checkout optimizado con deeplink directo a WhatsApp Business con mensaje preformateado. Panel de administración sin código para gestión autónoma del negocio.",
    stack: ["React", "Firebase Firestore", "Firebase Hosting", "WhatsApp Business API", "Tailwind CSS"],
    metrics: [
      { label: "Conversión", value: "+3.2×" },
      { label: "Tiempo al carrito", value: "28s" },
      { label: "Productos activos", value: "120+" },
    ],
    accent: "#57b8ff",
    category: "flagship",
    siteUrl: "https://smaguiett.netlify.app/",
    repoUrl: "https://github.com/SantiagoCN69/SmaguieTT",
  },
  {
    id: "nouri",
    index: "03",
    name: "Nouri",
    tagline: "Proyecto de clase · Marca · Anti-desperdicio alimentario",
    problem:
      "En Colombia se desperdicia el 34% de los alimentos producidos. El problema empieza en casa: nadie lleva registro de lo que tiene en su despensa ni sabe cuándo vence. Cuando se dan cuenta, ya es tarde.",
    solution:
      "Página de marca para Nouri, una app que permite registrar alimentos con su fecha de vencimiento y recibe alertas antes de que se pierdan. La landing comunica la propuesta con una narrativa emocional clara: cada alimento guardado es dinero y planeta salvado. Construida con TypeScript para garantizar la integridad del contenido dinámico y diseñada en Figma con identidad visual propia.",
    stack: ["TypeScript", "HTML", "CSS", "Figma", "Diseño de marca", "UX Writing"],
    metrics: [
      { label: "Alimentos salvados", value: "∞" },
      { label: "Alertas a tiempo", value: "72h antes" },
      { label: "Mobile score", value: "98" },
    ],
    accent: "#ff57b8",
    category: "flagship",
    siteUrl: "https://nourioficial.netlify.app/",
    repoUrl: "https://github.com/SantiagoCN69/NouriApp",
  },
  {
    id: "wa-black",
    index: "04",
    name: "WhatsApp Web Black Pure",
    tagline: "Rediseño visual · CSS · Tema oscuro puro",
    problem:
      "WhatsApp Web tiene un modo oscuro oficial con grises apagados y colores inconsistentes que no satisfacen a quienes quieren una experiencia visual realmente limpia y oscura.",
    solution:
      "Extensión que inyecta CSS personalizado sobre WhatsApp Web para cambiar completamente la paleta de colores: negro puro de fondo, textos de alto contraste y acentos rediseñados. Mejora visual inmediata sin tocar ningún dato ni funcionalidad de la app.",
    stack: ["CSS", "JavaScript", "Chrome Extension API"],
    metrics: [
      { label: "Colores rediseñados", value: "100%" },
      { label: "Funcionalidad", value: "Intacta" },
      { label: "Compatibilidad", value: "Chrome/Edge" },
    ],
    accent: "#25d366",
    category: "lab",
    repoUrl: "https://github.com/SantiagoCN69/Extencion-WP-WEB-Black-pure",
  },
  {
    id: "academusoft",
    index: "05",
    name: "Extensión Academusoft",
    tagline: "Rediseño UI · CSS · Plataforma universitaria",
    problem:
      "La plataforma académica de la Universidad del Tolima tiene una interfaz visual anticuada, poco intuitiva y visualmente pesada que dificulta el uso diario de los estudiantes.",
    solution:
      "Extensión que inyecta CSS sobre Academusoft para transformar su apariencia en una versión moderna, limpia y más usable. Mismo sistema, mismos datos, diferente experiencia visual. Sin modificar el backend ni la funcionalidad original.",
    stack: ["CSS", "JavaScript", "Chrome Extension API"],
    metrics: [
      { label: "Interfaz", value: "Modernizada" },
      { label: "Backend", value: "Sin tocar" },
      { label: "Instalación", value: "1 clic" },
    ],
    accent: "#ffa657",
    category: "lab",
    repoUrl: "https://github.com/SantiagoCN69/Extencion-Academusoft",
  },
  {
    id: "nexverse",
    index: "06",
    name: "NexVerse",
    tagline: "Sitio web · Descubrimiento · Diversión",
    problem:
      "Internet está lleno de sitios web curiosos, raros y divertidos que nadie conoce porque los algoritmos solo muestran lo popular. Descubrirlos no tenía un lugar dedicado.",
    solution:
      "Sitio web sencillo para descubrir páginas web divertidas, diferentes e inesperadas. Cada visita lleva a un lugar nuevo. Sin algoritmos, sin historial, solo exploración aleatoria y curiosidad.",
    stack: ["JavaScript", "HTML", "CSS"],
    metrics: [
      { label: "Sitios curados", value: "100+" },
      { label: "Dependencias", value: "Cero" },
      { label: "Sorpresa", value: "100%" },
    ],
    accent: "#a78bfa",
    category: "lab",
    siteUrl: "https://nexverse.netlify.app/",
  },
];

const SKILLS = {
  Frontend: ["React", "TypeScript", "JavaScript", "Vite", "Tailwind CSS"],
  Backend: ["Node.js", "Express", "REST API", "Firebase"],
  "Cloud / DB": ["Firestore", "Firebase Hosting", "FCM", "PostgreSQL"],
  Diseño: ["Figma", "UX/UI", "Design Systems", "Accesibilidad WCAG"],
  "DOM & Scripts": ["MutationObserver", "Chrome Extensions", "CSS Injection", "PWA"],
};


// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Proyectos", href: "#projects" },
    { label: "Laboratorio", href: "#lab" },
    { label: "Stack", href: "#stack" },
    { label: "Contacto", href: "#contact" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        background: scrolled ? "rgba(8,8,8,0.94)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a
          href="#hero"
          className="font-mono-display text-sm font-bold tracking-tight"
          style={{ color: "var(--primary)" }}
        >
          SCN<span style={{ color: "var(--muted-foreground)" }}>.dev</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-hover font-mono-display text-xs tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-mono-display text-xs tracking-widest uppercase px-4 py-2 transition-all duration-200"
            style={{ border: "1px solid var(--primary)", color: "var(--primary)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--primary)";
              (e.currentTarget as HTMLElement).style.color = "var(--primary-foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--primary)";
            }}
          >
            Hablemos
          </a>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-px transition-all duration-200"
              style={{
                background: "var(--foreground)",
                transform:
                  menuOpen && i === 0
                    ? "translateY(6px) rotate(45deg)"
                    : menuOpen && i === 2
                    ? "translateY(-6px) rotate(-45deg)"
                    : menuOpen && i === 1
                    ? "scaleX(0)"
                    : "none",
              }}
            />
          ))}
        </button>
      </nav>

      {menuOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-5"
          style={{ background: "var(--background)", borderTop: "1px solid var(--border)" }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="font-mono-display text-xs tracking-widest uppercase"
              style={{ color: "var(--muted-foreground)" }}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Typing effect ─────────────────────────────────────────────────────────────
function TypedText({ texts }: { texts: string[] }) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 55);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 2400);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 28);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % texts.length);
    }

    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts]);

  return (
    <span>
      {displayed}
      <span className="cursor-blink" style={{ color: "var(--primary)" }}>
        _
      </span>
    </span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen grid-bg flex flex-col justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #080808 100%)",
        }}
      />
      <div
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "var(--primary)", opacity: 0.035, filter: "blur(100px)" }}
      />
      <div
        className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "#57b8ff", opacity: 0.03, filter: "blur(80px)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
        {/* Status / location badge */}
        <div
          className="inline-flex items-center gap-2 mb-10 px-3 py-1.5 animate-fade-in"
          style={{ border: "1px solid var(--border)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--primary)", boxShadow: "0 0 8px var(--primary)" }}
          />
          <span
            className="font-mono-display text-xs tracking-widest uppercase"
            style={{ color: "var(--muted-foreground)" }}
          >
            Ibagué, Colombia · Disponible remoto
          </span>
        </div>

        {/* Main headline — establishes hybrid identity in <3s */}
        <h1
          className="font-mono-display font-extrabold leading-none mb-4 animate-slide-up"
          style={{
            fontSize: "clamp(2.8rem, 9vw, 7.5rem)",
            letterSpacing: "-0.03em",
            animationDelay: "0.05s",
          }}
        >
          <span style={{ color: "var(--foreground)" }}>Santiago</span>
          <br />
          <span style={{ color: "var(--primary)" }}>Cardona</span>
          <span style={{ color: "var(--foreground)" }}> Nossa.</span>
        </h1>

        {/* Subhead — pitch profesional */}
        <p
          className="font-mono-display text-base md:text-xl mb-3 animate-slide-up leading-snug"
          style={{
            color: "var(--muted-foreground)",
            maxWidth: "52ch",
            animationDelay: "0.15s",
          }}
        >
          Diseño Interactivo + Full Stack.{" "}
          <span style={{ color: "var(--foreground)" }}>
            Construyo interfaces que las personas entienden y código que los sistemas escalan.
          </span>
        </p>

        {/* Typed roles */}
        <p
          className="font-mono-display text-sm md:text-base mb-10 animate-slide-up"
          style={{ color: "var(--muted-foreground)", animationDelay: "0.22s", minHeight: "1.6rem" }}
        >
          <TypedText
            texts={[
              "Estudiante · Diseño Interactivo, Univ. del Tolima",
              "Técnico en Sistemas · SENA",
              "Developer → React · Node.js · Firebase",
              "UX/UI · Figma · Design Systems",
              "Builder de productos que resuelven problemas reales",
            ]}
          />
        </p>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-4 animate-slide-up"
          style={{ animationDelay: "0.35s" }}
        >
          <a
            href="#projects"
            className="font-mono-display text-xs tracking-widest uppercase px-6 py-3 font-bold transition-opacity duration-200"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.82")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Ver proyectos →
          </a>
          <a
            href="#contact"
            className="font-mono-display text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200"
            style={{ border: "1px solid var(--border)", color: "var(--foreground)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "var(--foreground)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
            }
          >
            Contactar
          </a>
        </div>

      </div>
    </section>
  );
}

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Section({
  id,
  children,
  className = "",
  style = {},
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const nodes = el.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const delay = Number((e.target as HTMLElement).dataset.delay ?? 0);
            setTimeout(() => e.target.classList.add("visible"), delay);
          }
        }),
      { threshold: 0.08 }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={`max-w-6xl mx-auto px-6 py-24 ${className}`} style={style}>
      {children}
    </section>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div className="reveal flex items-center gap-4 mb-10">
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.7rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--primary)",
        }}
      >
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="project-card reveal"
      style={{ background: "var(--card)" } as React.CSSProperties}
      data-delay={delay}
    >
      <button
        className="w-full text-left p-8 md:p-10"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span
              className="font-mono-display text-xs tracking-widest block mb-2"
              style={{ color: "var(--muted-foreground)" }}
            >
              {project.index}
            </span>
            <h3
              className="font-mono-display font-bold text-2xl md:text-3xl leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              {project.name}
            </h3>
            <p
              className="font-mono-display text-xs mt-1.5 tracking-wide"
              style={{ color: project.accent }}
            >
              {project.tagline}
            </p>
          </div>
          <span
            className="font-mono-display text-xl flex-shrink-0 mt-1 transition-transform duration-300"
            style={{
              color: project.accent,
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            +
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <div
                className="font-mono-display font-bold text-xl md:text-2xl"
                style={{ color: project.accent }}
              >
                {m.value}
              </div>
              <div
                className="font-mono-display text-xs tracking-wide mt-0.5 leading-tight"
                style={{ color: "var(--muted-foreground)" }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="skill-tag" style={{ color: "var(--muted-foreground)" }}>
              {s}
            </span>
          ))}
        </div>
      </button>

      {/* Expanded detail */}
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: expanded ? "600px" : "0" }}
      >
        <div
          className="px-8 md:px-10 pb-10 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p
                className="font-mono-display text-xs uppercase tracking-widest mb-3"
                style={{ color: project.accent }}
              >
                // Problema
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--secondary-foreground)" }}>
                {project.problem}
              </p>
            </div>
            <div>
              <p
                className="font-mono-display text-xs uppercase tracking-widest mb-3"
                style={{ color: project.accent }}
              >
                // Solución
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--secondary-foreground)" }}>
                {project.solution}
              </p>
            </div>
          </div>
          {/* Action buttons */}
          {(project.siteUrl || project.repoUrl) && (
            <div className="flex flex-wrap gap-3">
              {project.siteUrl && (
                <a
                  href={project.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono-display text-xs tracking-widest uppercase px-5 py-2.5 font-bold transition-opacity duration-200"
                  style={{ background: project.accent, color: "#080808" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.82")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                  onClick={(e) => e.stopPropagation()}
                >
                  Probar ahora →
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono-display text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-200"
                  style={{ border: "1px solid var(--border)", color: "var(--muted-foreground)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--foreground)";
                    (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GitHubIcon size={13} />
                  Ver código
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Flagship Projects ────────────────────────────────────────────────────────
function Projects() {
  const flagship = PROJECTS.filter((p) => p.category === "flagship");

  return (
    <Section id="projects">
      <SectionLabel text="// Casos de estudio" />
      <h2
        className="reveal font-mono-display font-extrabold mb-4"
        style={{ fontSize: "clamp(2rem, 5vw, 3.8rem)", letterSpacing: "-0.03em" }}
        data-delay={80}
      >
        Proyectos que resuelven
        <br />
        <span style={{ color: "var(--primary)" }}>problemas reales.</span>
      </h2>
      <p
        className="reveal text-sm mb-12 leading-relaxed"
        style={{ color: "var(--muted-foreground)", maxWidth: "50ch" }}
        data-delay={140}
      >
        Casos con métricas de impacto medibles. Haz clic en cada tarjeta para ver el análisis completo Problema → Solución → Stack.
      </p>
      <div className="flex flex-col gap-4">
        {flagship.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={i * 90} />
        ))}
      </div>
    </Section>
  );
}

// ─── UI Lab ───────────────────────────────────────────────────────────────────
function Lab() {
  const lab = PROJECTS.filter((p) => p.category === "lab");

  return (
    <section id="lab" style={{ background: "var(--muted)", borderTop: "1px solid var(--border)" }}>
      <Section id="lab-inner" className="!pt-24 !pb-24">
        <SectionLabel text="// Laboratorio UI & Micro-herramientas" />
        <div className="reveal mb-12" data-delay={60}>
          <h2
            className="font-mono-display font-extrabold mb-4"
            style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", letterSpacing: "-0.02em" }}
          >
            DOM Manipulation &{" "}
            <span style={{ color: "var(--primary)" }}>Soluciones de Usabilidad.</span>
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)", maxWidth: "55ch" }}
          >
            Extensiones e inyecciones CSS/JS que demuestran comprensión profunda del DOM, las APIs del navegador y el diseño de UX como intervención quirúrgica —sin tocar el servidor.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {lab.map((p, i) => (
            <LabCard key={p.id} project={p} delay={i * 100} />
          ))}
        </div>
      </Section>
    </section>
  );
}

function LabCard({ project, delay }: { project: Project; delay: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="reveal p-7 transition-all duration-300"
      data-delay={delay}
      style={{
        border: `1px solid ${hovered ? project.accent : "var(--border)"}`,
        background: "var(--card)",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="font-mono-display text-xs tracking-widest"
          style={{ color: "var(--muted-foreground)" }}
        >
          {project.index}
        </span>
        <span
          className="font-mono-display text-xs px-2 py-0.5"
          style={{
            border: `1px solid ${project.accent}`,
            color: project.accent,
            fontSize: "0.6rem",
            letterSpacing: "0.1em",
          }}
        >
          LAB
        </span>
      </div>

      <h3
        className="font-mono-display font-bold text-lg mb-1 leading-tight"
        style={{ letterSpacing: "-0.01em" }}
      >
        {project.name}
      </h3>
      <p
        className="font-mono-display text-xs mb-4 tracking-wide"
        style={{ color: project.accent }}
      >
        {project.tagline}
      </p>

      {/* Metrics mini */}
      <div className="flex flex-col gap-2 mb-5">
        {project.metrics.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-4">
            <span
              className="font-mono-display"
              style={{ fontSize: "0.65rem", color: "var(--muted-foreground)", letterSpacing: "0.05em" }}
            >
              {m.label}
            </span>
            <span
              className="font-mono-display font-bold text-sm flex-shrink-0"
              style={{ color: project.accent }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>

      <p
        className="text-xs leading-relaxed mb-5"
        style={{ color: "var(--secondary-foreground)" }}
      >
        {project.solution.slice(0, 160)}…
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {project.stack.slice(0, 3).map((s) => (
          <span
            key={s}
            className="font-mono-display"
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.05em",
              border: "1px solid var(--border)",
              padding: "2px 8px",
              color: "var(--muted-foreground)",
            }}
          >
            {s}
          </span>
        ))}
      </div>

      {(project.siteUrl || project.repoUrl) && (
        <div className="flex gap-2 flex-wrap">
          {project.siteUrl && (
            <a
              href={project.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-display text-xs px-4 py-2 font-bold transition-opacity duration-200"
              style={{
                background: project.accent,
                color: "#080808",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.82")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              Probar →
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-mono-display text-xs px-4 py-2 transition-all duration-200"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted-foreground)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = project.accent;
                (e.currentTarget as HTMLElement).style.color = project.accent;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLElement).style.color = "var(--muted-foreground)";
              }}
            >
              <GitHubIcon size={12} />
              Código
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Stack & Animation Recommendations ────────────────────────────────────────
function Stack() {
  return (
    <Section id="stack">
      <SectionLabel text="// Stack técnico" />
      <div className="grid md:grid-cols-2 gap-16 items-start mb-20">
        <div>
          <h2
            className="reveal font-mono-display font-extrabold mb-5"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Herramientas que uso
            <br />
            <span style={{ color: "var(--primary)" }}>a diario.</span>
          </h2>
          <p
            className="reveal text-sm leading-relaxed"
            style={{ color: "var(--muted-foreground)", maxWidth: "38ch" }}
            data-delay={80}
          >
            Combino criterio de diseño (Figma, sistemas de diseño, accesibilidad WCAG) con ingeniería de software para construir productos que rinden bajo presión de usuarios reales.
          </p>
        </div>
        <div className="space-y-6">
          {Object.entries(SKILLS).map(([category, items], i) => (
            <div key={category} className="reveal" data-delay={i * 70}>
              <p
                className="font-mono-display text-xs tracking-widest uppercase mb-2.5"
                style={{ color: "var(--muted-foreground)" }}
              >
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {items.map((s) => (
                  <span key={s} className="skill-tag" style={{ color: "var(--foreground)" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </Section>
  );
}

// ─── About strip ──────────────────────────────────────────────────────────────
function About() {
  const facts = [
    { label: "Formación", value: "Diseño Interactivo · Univ. del Tolima" },
    { label: "Certificación", value: "Técnico en Sistemas · SENA" },
    { label: "Ubicación", value: "Ibagué, Colombia" },
    { label: "Modalidad", value: "Remoto · Freelance · Colaboraciones" },
  ];

  return (
    <section style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p
              className="font-mono-display text-xs tracking-widest uppercase mb-4"
              style={{ color: "var(--primary)" }}
            >
              // Sobre mí
            </p>
            <p
              className="font-mono-display font-bold leading-tight"
              style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", letterSpacing: "-0.02em" }}
            >
              No soy solo un developer.
              <br />
              No soy solo un diseñador.
              <br />
              <span style={{ color: "var(--primary)" }}>Soy el puente entre los dos.</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {facts.map((f) => (
              <div key={f.label} className="p-4" style={{ border: "1px solid var(--border)" }}>
                <p
                  className="font-mono-display text-xs uppercase tracking-widest mb-1"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {f.label}
                </p>
                <p className="font-mono-display text-xs font-bold leading-snug">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Contact form ─────────────────────────────────────────────────────────────
type FormStatus = "idle" | "submitting" | "success" | "error";

function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [focused, setFocused] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    background: "var(--background)",
    border: `1px solid ${focused === name ? "var(--primary)" : "var(--border)"}`,
    color: "var(--foreground)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.8rem",
    padding: "12px 14px",
    outline: "none",
    transition: "border-color 0.2s",
    resize: "none",
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "0.65rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--muted-foreground)",
    marginBottom: "6px",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch("https://formspree.io/f/xjyvvqdy", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setErrorMsg(json?.errors?.[0]?.message ?? "Algo salió mal. Inténtalo de nuevo.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("No se pudo enviar. Revisa tu conexión.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-start gap-3 p-8"
        style={{ border: "1px solid var(--primary)", background: "var(--card)" }}
      >
        <span
          className="font-mono-display text-xs tracking-widest uppercase"
          style={{ color: "var(--primary)" }}
        >
          // Mensaje enviado
        </span>
        <p className="font-mono-display font-bold text-xl" style={{ letterSpacing: "-0.01em" }}>
          Gracias por escribir.
          <br />
          <span style={{ color: "var(--primary)" }}>Te respondo pronto.</span>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="name" style={labelStyle}>Nombre</label>
        <input
          id="name" type="text" name="name" required placeholder="Tu nombre"
          style={fieldStyle("name")}
          onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
        />
      </div>

      <div>
        <label htmlFor="email" style={labelStyle}>Email</label>
        <input
          id="email" type="email" name="email" required placeholder="tu@email.com"
          style={fieldStyle("email")}
          onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
        />
      </div>

      <div>
        <label htmlFor="subject" style={labelStyle}>Asunto</label>
        <input
          id="subject" type="text" name="subject" placeholder="¿En qué puedo ayudarte?"
          style={fieldStyle("subject")}
          onFocus={() => setFocused("subject")} onBlur={() => setFocused(null)}
        />
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Mensaje</label>
        <textarea
          id="message" name="message" required rows={5}
          placeholder="Cuéntame sobre tu proyecto..."
          style={fieldStyle("message")}
          onFocus={() => setFocused("message")} onBlur={() => setFocused(null)}
        />
      </div>

      {status === "error" && (
        <p className="font-mono-display text-xs" style={{ color: "#ff5757" }}>
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="font-mono-display text-xs tracking-widest uppercase px-6 py-3 font-bold transition-opacity duration-200 self-start"
        style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          opacity: status === "submitting" ? 0.6 : 1,
          cursor: status === "submitting" ? "not-allowed" : "pointer",
          border: "none",
        }}
      >
        {status === "submitting" ? "Enviando..." : "Enviar mensaje →"}
      </button>
    </form>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const links = [
    { label: "GitHub", handle: "@SantiagoCN69", href: "https://github.com/SantiagoCN69" },
    { label: "LinkedIn", handle: "Santiago Cardona Nossa", href: "https://www.linkedin.com/in/santiago-cardona-nossa/" },
    { label: "Email", handle: "santiagocn08@email.com", href: "mailto:santiagocn08@email.com" },
  ];

  return (
    <section
      id="contact"
      style={{ borderTop: "1px solid var(--border)", background: "var(--muted)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-24">
        <SectionLabel text="// Contacto" />
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left — headline + links */}
          <div>
            <h2
              className="font-mono-display font-extrabold mb-4 leading-none"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              Construyamos
              <br />
              <span style={{ color: "var(--primary)" }}>algo juntos.</span>
            </h2>
            <p
              className="text-sm leading-relaxed mb-10"
              style={{ color: "var(--muted-foreground)", maxWidth: "38ch" }}
            >
              Disponible para proyectos freelance, colaboraciones y prácticas.{" "}
              <span style={{ color: "var(--foreground)" }}>Respuesta en menos de 24 horas.</span>
            </p>
            <div className="space-y-3">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 group transition-all duration-200"
                  style={{ border: "1px solid var(--border)" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")
                  }
                >
                  <div>
                    <p
                      className="font-mono-display text-xs tracking-widest uppercase mb-0.5"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {l.label}
                    </p>
                    <p className="font-mono-display text-sm font-bold">{l.handle}</p>
                  </div>
                  <span
                    className="font-mono-display text-lg transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: "var(--primary)" }}
                  >
                    →
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            <p
              className="font-mono-display text-xs tracking-widest uppercase mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              // O escríbeme directamente
            </p>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <span
        className="font-mono-display text-xs"
        style={{ color: "var(--muted-foreground)" }}
      >
        Santiago Cardona Nossa · Ibagué, Colombia · {new Date().getFullYear()}
      </span>
      <span
        className="font-mono-display text-xs"
        style={{ color: "var(--muted-foreground)" }}
      >
        React · Vite · Tailwind CSS v4
      </span>
    </footer>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div className="noise">
      <ParticleBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects />
        <Lab />
        <Stack />
        <Contact />
      </main>
      <Footer />
      </div>
    </div>
  );
}
