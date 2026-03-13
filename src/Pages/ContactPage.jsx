import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
// ─── Utility: cn ────────────────────────────────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ─── Animated Blob Background ────────────────────────────────────────────────
const BlobBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute rounded-full opacity-20 blur-3xl animate-blob"
      style={{
        width: "600px",
        height: "600px",
        background: "radial-gradient(circle, #3B82F6, #8B5CF6)",
        top: "-100px",
        left: "-100px",
        animation: "blob1 12s ease-in-out infinite",
      }}
    />
    <div
      className="absolute rounded-full opacity-15 blur-3xl"
      style={{
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, #8B5CF6, #EC4899)",
        bottom: "0px",
        right: "0px",
        animation: "blob2 14s ease-in-out infinite",
      }}
    />
    <div
      className="absolute rounded-full opacity-10 blur-3xl"
      style={{
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, #06B6D4, #3B82F6)",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: "blob3 10s ease-in-out infinite",
      }}
    />
    <style>{`
      @keyframes blob1 {
        0%, 100% { transform: translate(0,0) scale(1); }
        33% { transform: translate(60px, 40px) scale(1.08); }
        66% { transform: translate(-30px, 60px) scale(0.95); }
      }
      @keyframes blob2 {
        0%, 100% { transform: translate(0,0) scale(1); }
        33% { transform: translate(-50px, -40px) scale(1.05); }
        66% { transform: translate(40px, -60px) scale(0.92); }
      }
      @keyframes blob3 {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
      }
    `}</style>
  </div>
);

// ─── Noise Texture Overlay ────────────────────────────────────────────────────
const NoiseOverlay = () => (
  <div
    className="fixed inset-0 pointer-events-none opacity-[0.035]"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      backgroundRepeat: "repeat",
    }}
  />
);

// ─── Glass Card ───────────────────────────────────────────────────────────────
const GlassCard = ({ children, className = "" }) => (
  <div
    className={cn(
      "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl",
      className
    )}
  >
    {children}
  </div>
);

// ─── Input Field ─────────────────────────────────────────────────────────────
const InputField = ({ label, type = "text", name, value, onChange, error, placeholder, rows }) => {
  const baseClass =
    "w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-white/30 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/60 focus:bg-white/8 hover:border-white/25";
  const borderClass = error ? "border-red-500/60" : "border-white/10";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold tracking-widest uppercase text-white/50">
        {label}
      </label>
      {rows ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={cn(baseClass, borderClass, "resize-none")}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(baseClass, borderClass)}
        />
      )}
      {error && (
        <p className="text-red-400 text-xs mt-0.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

// ─── Social Link ──────────────────────────────────────────────────────────────
const SocialLink = ({ href, icon: Icon, label, color }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group relative flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/10 hover:scale-105 hover:-translate-y-0.5"
    style={{ "--hover-color": color }}
  >
    <span
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-300 group-hover:scale-110"
      style={{ background: `${color}22`, color }}
    >
      <Icon />
    </span>
    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300">
      {label}
    </span>
    <span className="ml-auto text-white/20 group-hover:text-white/50 transition-colors duration-300 text-xs">↗</span>
  </a>
);

// ─── Contact Info Item ────────────────────────────────────────────────────────
const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-0.5">{label}</p>
      <p className="text-sm text-white/80">{value}</p>
    </div>
  </div>
);

// ─── Main Contact Page ────────────────────────────────────────────────────────
export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message cannot be empty";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
  };

  const handleReset = () => {
    setForm({ name: "", email: "", subject: "", message: "" });
    setErrors({});
    setStatus("idle");
  };

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{
        background: "#0A0F1E",
        fontFamily: "'Sora', 'DM Sans', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }
        .grid-bg { background-image: linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px); background-size: 60px 60px; }
        .shimmer { background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 2.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .glow-btn { box-shadow: 0 0 0 0 rgba(99,102,241,0); transition: box-shadow 0.3s ease, transform 0.2s ease, background 0.3s ease; }
        .glow-btn:hover { box-shadow: 0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(139,92,246,0.2); transform: translateY(-1px); }
        .glow-btn:active { transform: translateY(0); }
      `}</style>

      <BlobBackground />
      <NoiseOverlay />

      {/* Grid bg layer */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      {/* ── NAV ────────────────────────────────────────────── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 backdrop-blur-md bg-black/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">N</div>
          <span className="font-semibold text-white tracking-tight">Nexus<span className="text-blue-400">Studio</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
          {["Work", "Services", "About", "Contact"].map((item) => (
            <a key={item} href="#" className={cn("transition-colors hover:text-white", item === "Contact" && "text-blue-400 font-medium")}>{item}</a>
          ))}
        </div>
        <button className="hidden md:block text-xs font-semibold tracking-wider px-5 py-2 rounded-full border border-white/15 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200">
          Let's Talk →
        </button>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section className="relative z-10 pt-24 pb-20 px-6 md:px-12 text-center">
        <div className={cn("fade-up", mounted && "visible")}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Available for New Projects
          </div>
        </div>

        <h1
          className={cn("fade-up delay-1 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none mb-6", mounted && "visible")}
          style={{ background: "linear-gradient(135deg, #fff 0%, #fff 40%, #8B5CF6 70%, #3B82F6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          Get In Touch
        </h1>

        <p className={cn("fade-up delay-2 text-lg md:text-xl text-white/45 max-w-xl mx-auto leading-relaxed", mounted && "visible")}>
          Have a project in mind? We'd love to hear about it. Let's create something extraordinary together.
        </p>

        {/* Stats row */}
        <div className={cn("fade-up delay-3 flex flex-wrap justify-center gap-8 mt-14", mounted && "visible")}>
          {[["150+", "Projects"], ["12+", "Years Exp."], ["98%", "Satisfaction"], ["40+", "Countries"]].map(([num, lab]) => (
            <div key={lab} className="text-center">
              <div className="text-2xl font-bold text-white">{num}</div>
              <div className="text-xs text-white/35 mt-0.5 tracking-wide">{lab}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MAIN CONTENT ───────────────────────────────────── */}
      <section className="relative z-10 px-6 md:px-12 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* Left: Info + Social */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact info card */}
            <GlassCard className={cn("p-7 fade-up delay-2", mounted && "visible")}>
              <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-6">Contact Details</h3>
              <div className="flex flex-col gap-5">
                <InfoItem icon="📍" label="Address" value="123 Innovation Drive, San Francisco, CA 94105" />
                <InfoItem icon="📞" label="Phone" value="+1 (415) 555-0192" />
                <InfoItem icon="✉️" label="Email" value="hello@nexusstudio.co" />
                <InfoItem icon="⏰" label="Hours" value="Mon–Fri, 9am – 6pm PST" />
              </div>
            </GlassCard>

            {/* Social card */}
            <GlassCard className={cn("p-7 fade-up delay-3", mounted && "visible")}>
              <h3 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-5">Find Us Online</h3>
              <div className="flex flex-col gap-3">
                <SocialLink href="https://linkedin.com" icon={LinkedInIcon} label="LinkedIn" color="#0A66C2" />
                <SocialLink href="https://github.com" icon={GitHubIcon} label="GitHub" color="#E6EDF3" />
                <SocialLink href="https://twitter.com" icon={TwitterIcon} label="Twitter / X" color="#1D9BF0" />
                <SocialLink href="https://facebook.com" icon={FacebookIcon} label="Facebook" color="#1877F2" />
              </div>
            </GlassCard>

          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <GlassCard className={cn("p-8 md:p-10 fade-up delay-1", mounted && "visible")}>
              {status === "success" ? (
                <div className="flex flex-col items-center justify-center text-center py-12 gap-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-4xl animate-bounce">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                    <p className="text-white/50 text-sm max-w-xs">Thanks for reaching out. Our team will get back to you within 24 hours.</p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Send a Message</h2>
                    <p className="text-sm text-white/40">We reply to every message, usually within one business day.</p>
                  </div>

                  <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField
                        label="Full Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        error={errors.name}
                        placeholder="Jane Doe"
                      />
                      <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="jane@example.com"
                      />
                    </div>
                    <InputField
                      label="Subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      error={errors.subject}
                      placeholder="Project inquiry, partnership, etc."
                    />
                    <InputField
                      label="Message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      error={errors.message}
                      placeholder="Tell us about your project, goals, and timeline..."
                      rows={5}
                    />

                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className={cn(
                        "glow-btn mt-2 w-full py-4 rounded-xl font-semibold text-sm tracking-wide text-white transition-all duration-300",
                        status === "loading"
                          ? "bg-white/10 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 cursor-pointer"
                      )}
                    >
                      {status === "loading" ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                          </svg>
                          Sending Message…
                        </span>
                      ) : (
                        "Send Message →"
                      )}
                    </button>
                  </form>
                </>
              )}
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ── MAP SECTION ────────────────────────────────────── */}
      

   <div className="max-w-7xl mx-auto h-[500px] m-7">
  <MapContainer
    center={[37.7878, -122.3990]}
    zoom={13}
    className="h-full w-full rounded-2xl"
  >
    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <Marker position={[37.7878, -122.3990]}>
      <Popup>Nexus Studio Office</Popup>
    </Marker>
  </MapContainer>
</div>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/5 px-6 md:px-12 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs">N</div>
            <span className="text-sm text-white/40">NexusStudio © {new Date().getFullYear()}</span>
          </div>
          <p className="text-xs text-white/25 text-center">Crafted with precision · Built for impact</p>
        </div>
      </footer>
    </div>
  );
}