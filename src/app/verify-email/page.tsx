import { Suspense } from "react";

import VerifyEmailClient from "@/app/verify-email/verify-email-client";

export const metadata = {
  title: "Verify Email | FileSystem",
  description: "Verify your email address to activate your account.",
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading verify...</div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}
