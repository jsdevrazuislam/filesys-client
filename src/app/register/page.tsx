import { Metadata } from "next";

import RegisterClient from "./register-client";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Join FileSys to start organizing your files securely.",
};

export default function RegisterPage() {
  return <RegisterClient />;
}
