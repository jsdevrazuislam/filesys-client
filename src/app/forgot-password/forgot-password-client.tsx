"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ForgotPasswordFormValues, forgotPasswordSchema } from "@/features/auth/auth-schemas";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { useForgotPassword } from "@/hooks/api/use-auth";

export default function ForgotPasswordClient() {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword(data.email, {
      onSuccess: () => setSubmitted(true),
    });
  };

  if (submitted) {
    return (
      <AuthLayout
        title="Check your email"
        description="We've sent a password reset link to your email address."
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="h-10 w-10 text-primary" />
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Back to login</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot password?"
      description="Enter your email and we'll send you a link to reset your password."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/"
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to login
        </Link>
      </p>
    </AuthLayout>
  );
}
