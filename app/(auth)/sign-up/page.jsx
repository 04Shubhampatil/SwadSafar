"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema } from "@/lib/validations/auth";
import { CircleUserRound, Lock, Mail, UserPlus } from "lucide-react";
import Hero from "../_components/Hero";
import FoodIllustration from "../_components/FoodIllustration";
import AuthCard from "../_components/AuthCard";
import AuthInput from "../_components/AuthInput";
import AuthBackground from "../_components/AuthBackground";
import biryani from "@/public/biryani.webp";

const SignUpPage = () => {
  const router = useRouter();
  const supabase = createClient();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    const loadingToast = toast.loading("Creating your account…");

    if (!supabase) {
      toast.dismiss(loadingToast);
      toast.error("Authentication is unavailable right now.");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { username: data.username },
      },
    });

    if (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message);
      return;
    }

    toast.dismiss(loadingToast);
    toast.success("Check your inbox to confirm your email!");
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    if (!supabase) {
      toast.error("Authentication is unavailable right now.");
      setIsGoogleLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
          <Hero title="Test." subtitle="Create." highlight="Discover." />
        </div>

        {/* Food illustration (mobile: in-flow, desktop: absolute between columns) */}
        <FoodIllustration image={biryani} recipeName="Chicken Biryani" />

        {/* Right — Sign up card */}
        <div className="order-3 z-30 flex justify-center lg:col-span-6 lg:col-start-7 lg:justify-start xl:col-span-5 xl:col-start-8">
          <div className="w-full max-w-[460px]">
            <AuthCard
              badge={<UserPlus size={22} strokeWidth={2.2} />}
              title="Create an account"
              subtitle="Register to get started"
              register={register}
              onSubmit={handleSubmit(onSubmit)}
              isSubmitting={isSubmitting}
              submitLabel="Create Account"
              submittingLabel="Creating account…"
              isGoogleLoading={isGoogleLoading}
              handleGoogleSignIn={handleGoogleSignIn}
              showRemember={false}
              footerText="Already have an account?"
              footerLinkText="Sign In"
              footerHref="/sign-in"
            >
              <AuthInput
                id="username"
                label="Username"
                type="text"
                autoComplete="username"
                icon={<CircleUserRound size={19} />}
                register={register}
                error={errors.username}
              />
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
                autoComplete="new-password"
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
};

export default SignUpPage;
