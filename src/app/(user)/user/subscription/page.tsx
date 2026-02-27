import { Metadata } from "next";

import SubscriptionClient from "./subscription-client";

export const metadata: Metadata = {
  title: "Subscription",
  description: "Manage your FileSys subscription and billing details.",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
