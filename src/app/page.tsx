import { Metadata } from "next";

import LoginClient from "./login-client";

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your FileSys account.",
};

export default function LoginPage() {
  return <LoginClient />;
}
