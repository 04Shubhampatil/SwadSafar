const LemonSlice = () => (
  <svg width="44" height="44" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle cx="24" cy="24" r="20" fill="#fde047" />
    <circle cx="24" cy="24" r="20" stroke="#f59e0b" strokeWidth="2" />
    <g stroke="#facc15" strokeWidth="2">
      <line x1="24" y1="4" x2="24" y2="44" />
      <line x1="4" y1="24" x2="44" y2="24" />
      <line x1="10" y1="10" x2="38" y2="38" />
      <line x1="38" y1="10" x2="10" y2="38" />
    </g>
  </svg>
);

const ChiliPepper = () => (
  <svg width="30" height="42" viewBox="0 0 32 44" fill="none" aria-hidden="true">
    <path
      d="M16 6C11 6 8 10 8 15C8 23 12 30 16 36C20 30 24 23 24 15C24 10 21 6 16 6Z"
      fill="#ef4444"
    />
    <path
      d="M12 12C14 10 18 10 20 12"
      stroke="#dc2626"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 4C16 2 15 1 13 1M16 4C16 2 17 1 19 1"
      stroke="#16a34a"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Soft cream wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FFF9F3] to-[#fff2e4]" />

      {/* Blurred orange lights */}
      <div className="auth-blob absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-[#fdba74]/40 blur-3xl" />
      <div
        className="auth-blob absolute -right-32 top-[22%] h-[460px] w-[460px] rounded-full bg-[#f97316]/20 blur-3xl"
        style={{ animationDelay: "2.4s" }}
      />
      <div
        className="auth-blob absolute -bottom-44 left-[28%] h-[420px] w-[420px] rounded-full bg-[#fde68a]/45 blur-3xl"
        style={{ animationDelay: "4.8s" }}
      />

      {/* Floating circles */}
      <div className="auth-drift absolute left-[7%] top-[20%] h-14 w-14 rounded-full border border-[#fec9a3]/70 bg-white/50 shadow-[0_8px_24px_rgba(249,115,22,0.08)] backdrop-blur-sm" />
      <div
        className="auth-drift absolute right-[9%] top-[14%] h-9 w-9 rounded-full bg-[#f97316]/15"
        style={{ animationDelay: "1.6s" }}
      />
      <div
        className="auth-drift absolute bottom-[18%] right-[7%] h-12 w-12 rounded-full border-2 border-dashed border-[#fec9a3]/70 bg-white/40"
        style={{ animationDelay: "3.2s" }}
      />
      <div
        className="auth-drift absolute bottom-[26%] left-[12%] h-6 w-6 rounded-full bg-[#fde68a]/70"
        style={{ animationDelay: "2s" }}
      />

      {/* Elegant geometric shapes */}
      <div className="absolute left-[5%] top-[7%] h-16 w-16 rotate-12 rounded-2xl border border-[#fec9a3]/60 bg-white/40 shadow-[0_8px_24px_rgba(249,115,22,0.06)] backdrop-blur-sm" />
      <div className="absolute bottom-[9%] right-[4%] h-24 w-24 rounded-full border border-white/80 bg-gradient-to-br from-[#fb923c]/20 to-transparent" />
      <div className="absolute right-[22%] top-[8%] h-10 w-10 rotate-45 rounded-lg border border-[#fec9a3]/50 bg-white/30" />

      {/* Minimal dotted patterns */}
      <div className="auth-dots absolute -left-8 bottom-[26%] h-52 w-52 opacity-60" />
      <div className="auth-dots-dark absolute right-[-4%] top-[30%] h-44 w-44 opacity-50" />

      {/* Abstract food illustrations */}
      <div className="auth-drift absolute bottom-[13%] left-[13%] opacity-80" style={{ animationDelay: "2.2s" }}>
        <LemonSlice />
      </div>
      <div className="auth-drift absolute bottom-[34%] right-[18%] opacity-70" style={{ animationDelay: "1s" }}>
        <ChiliPepper />
      </div>
    </div>
  );
}

export default AuthBackground;
