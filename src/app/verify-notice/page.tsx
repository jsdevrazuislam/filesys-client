"use client";

import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

function VerifyNoticeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const handleResend = () => {
    toast.success("Verification email resent! Please check your inbox.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center animate-fade-in">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">{email || "your email"}</span>. Please
            click the link in the email to continue.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button
            size="lg"
            onClick={() => router.push("/")}
            className="w-full shadow-md hover:shadow-lg transition-all"
          >
            Go to Login
          </Button>

          <Button variant="outline" size="lg" onClick={handleResend} className="w-full">
            Resend Verification Email
          </Button>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Check your spam folder if you don&apos;t see it.
        </p>
      </div>
    </div>
  );
}

export default function VerifyNoticePage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}
    >
      <VerifyNoticeContent />
    </Suspense>
  );
}
