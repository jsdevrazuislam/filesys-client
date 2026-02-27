import { Metadata } from "next";

import ForgotPasswordClient from "./forgot-password-client";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Recover your FileSys account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
