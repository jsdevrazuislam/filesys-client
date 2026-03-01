"use client";

import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUserStats } from "@/hooks/api/use-user";

export function PlanLimitBanner() {
  const { data: stats } = useUserStats();

  if (!stats || !stats.isLimitExceeded) return null;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 lg:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-100 p-1.5 dark:bg-amber-900/40">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
              Plan Limits Exceeded
            </h3>
            <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-300/60 leading-relaxed">
              You have exceeded your <span className="font-bold uppercase">{stats.planName}</span>{" "}
              plan limits for:{" "}
              <span className="font-medium text-amber-900 dark:text-amber-200">
                {stats.exceededLimits.join(", ")}
              </span>
              . Please upgrade your plan to continue managing your files seamlessly.
            </p>
          </div>
        </div>

        <Button
          asChild
          variant="default"
          size="sm"
          className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm shadow-amber-200 dark:shadow-none"
        >
          <Link href="/user/subscription">
            Upgrade Now <ArrowRight className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
