"use client";

import { Eye, EyeOff, TriangleAlert } from "lucide-react";

function AuthInput({
  id,
  label,
  type = "text",
  icon,
  register,
  error,
  autoComplete,
  isPassword = false,
  isPasswordVisible = false,
  onToggleVisibility,
  className = "",
}) {
  const inputType = isPassword ? (isPasswordVisible ? "text" : "password") : type;

  return (
    <div className={className}>
      <div className="group relative">
        <div className="auth-field flex h-[60px] w-full items-center rounded-2xl border border-[#e7e0d4] bg-white/70 shadow-[0_2px_10px_rgba(111,80,50,0.06)] backdrop-blur-sm transition-all duration-300 group-focus-within:border-[#f97316]/70 group-focus-within:bg-white group-focus-within:shadow-[0_0_0_4px_rgba(249,115,22,0.12),0_10px_24px_rgba(249,115,22,0.1)]">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8] transition-colors duration-300 group-focus-within:text-[#ea580c]">
            {icon}
          </span>

          <input
            id={id}
            type={inputType}
            placeholder=" "
            autoComplete={autoComplete}
            aria-invalid={error ? "true" : undefined}
            {...register(id)}
            className="auth-field-input h-full w-full rounded-2xl bg-transparent pl-[46px] pr-[46px] pt-[22px] text-[15px] font-semibold text-[#111827] outline-none"
          />

          <label htmlFor={id} className="auth-field-label">
            {label}
          </label>

          {isPassword && (
            <button
              type="button"
              onClick={onToggleVisibility}
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl text-[#94a3b8] transition-all duration-200 hover:bg-[#fff1e4] hover:text-[#ea580c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f97316]"
            >
              <span
                className={`transition-transform duration-300 ${isPasswordVisible ? "rotate-180 scale-110" : ""}`}
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </button>
          )}
        </div>

        {error && (
          <p
            className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#e11d48]"
            role="alert"
          >
            <TriangleAlert size={13} strokeWidth={2.4} />
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthInput;
