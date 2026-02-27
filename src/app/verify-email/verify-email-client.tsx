"use client";

import { ArrowRight, CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import AuthLayout from "@/features/auth/components/AuthLayout";
import { useVerifyEmail } from "@/hooks/api/use-auth";

export default function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [verified, setVerified] = useState(false);
  const { mutate: verifyEmail, isPending, isError } = useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail(token, {
        onSuccess: () => setVerified(true),
      });
    }
  }, [token, verifyEmail]);

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" description="The verification link is missing or invalid.">
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Back to login</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (isPending) {
    return (
      <AuthLayout
        title="Verifying your email"
        description="Please wait while we verify your account."
      >
        <div className="flex justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  if (isError) {
    return (
      <AuthLayout
        title="Verification failed"
        description="The verification link might be expired or invalid."
      >
        <div className="flex flex-col items-center space-y-4">
          <XCircle className="h-12 w-12 text-destructive" />
          <Button variant="outline" className="w-full" asChild>
            <Link href="/">Back to login</Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  if (verified) {
    return (
      <AuthLayout
        title="Email verified!"
        description="Your account has been successfully verified. You can now access all features."
      >
        <div className="flex flex-col items-center space-y-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <Button className="w-full" asChild>
            <Link href="/">
              Sign in to continue <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return null;
}
