import { Metadata } from "next";
import { Suspense } from "react";

import LoginClient from "./login-client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your FileSys account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
