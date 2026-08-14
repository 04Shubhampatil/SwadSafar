"use client";

import React, { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signInSchema } from "@/lib/validations/auth";
import { Lock, LogIn, Mail } from "lucide-react";
import Hero from "../_components/Hero";
import FoodIllustration from "../_components/FoodIllustration";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthBackground from "../_components/AuthBackground";
import pasta from "@/public/pasta.webp";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Where to go after a successful login (defaults to home)
  const redirectTo = searchParams.get("redirectTo") || "/";
  const supabase = createClient();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Signing in…");

    if (!supabase) {
      toast.dismiss(loadingToast);
      toast.error("Authentication is unavailable right now.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
      return;
    }

    toast.dismiss(loadingToast);
    toast.success("Welcome back!");
    // Redirect to the originally requested page, or home
    router.push(redirectTo);
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    if (!supabase) {
      toast.error("Authentication is unavailable right now.");
      setIsGoogleLoading(false);
      return;
    }

    const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
    // Pass redirectTo through to the OAuth callback so it can forward the user
    if (redirectTo && redirectTo !== "/") {
      callbackUrl.searchParams.set("next", redirectTo);
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl.toString(),
      },
    });

    if (error) {
      toast.error(error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[#FFF9F3]"
    >
      <AuthBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] min-h-[90vh] grid-cols-1 items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-10 xl:gap-10 xl:px-14">
        {/* Left — Hero */}
        <div className="order-1 z-10 flex flex-col justify-center lg:col-span-6">
          <Hero />
        </div>

        {/* Food illustration (mobile: in-flow, desktop: absolute between columns) */}
        <FoodIllustration image={pasta} recipeName="Tomato Penne" />

        {/* Right — Login card */}
        <div className="order-3 z-30 flex justify-center lg:col-span-6 lg:col-start-7 lg:justify-start xl:col-span-5 xl:col-start-8">
          <div className="w-full max-w-[460px]">
            <AuthCard
              badge={<LogIn size={22} strokeWidth={2.2} />}
              title="Welcome back"
              subtitle="Log in to continue your cooking journey"
              register={register}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
              submitLabel="Sign In"
              submittingLabel="Signing in…"
              isGoogleLoading={isGoogleLoading}
              handleGoogleSignIn={handleGoogleSignIn}
              footerText="Don't have an account?"
              footerLinkText="Sign Up"
              footerHref="/sign-up"
            >
              <AuthInput
                id="email"
                label="Email address"
                type="email"
                autoComplete="email"
                icon={<Mail size={19} />}
                register={register}
                error={errors.email}
              />
              <AuthInput
                id="password"
                label="Password"
                autoComplete="current-password"
                icon={<Lock size={19} />}
                register={register}
                error={errors.password}
                isPassword
                isPasswordVisible={isPasswordVisible}
                onToggleVisibility={() => setIsPasswordVisible((v) => !v)}
              />
            </AuthCard>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

// useSearchParams requires a Suspense boundary in Next.js app router
const SignInPage = () => (
  <Suspense>
    <SignInForm />
  </Suspense>
);

export default SignInPage;
