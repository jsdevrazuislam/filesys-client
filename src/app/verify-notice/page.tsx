"use client";

import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGetCurrentUser, useLogout } from "@/hooks/api/use-auth";
import { useAuthStore } from "@/store/auth-store";

export default function VerifyNoticePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { refetch, isFetching } = useGetCurrentUser();
  const { mutate: logout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user?.isVerified) {
      router.replace("/user");
    }
  }, [isAuthenticated, user, router]);

  const handleCheckStatus = async () => {
    const result = await refetch();
    if (result.data?.isVerified) {
      toast.success("Email verified! Redirecting...");
      router.push("/user");
    } else {
      toast.error("Email not verified yet. Please check your inbox.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-10 w-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            <span className="font-medium text-foreground">{user?.email || "your email"}</span>.
            Please click the link in the email to continue.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <Button size="lg" onClick={handleCheckStatus} disabled={isFetching} className="w-full">
            {isFetching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
              </>
            ) : (
              "I&apos;ve verified my email"
            )}
          </Button>

          <Button variant="outline" size="lg" onClick={() => logout()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Didn&apos;t receive the email? Check your spam folder or{" "}
          <button className="font-medium text-primary hover:underline">resend verification</button>
        </p>
      </div>
    </div>
  );
}
