"use client";

import { useRef, type ReactNode } from "react";
import { trackEvent } from "@/components/analytics";

/**
 * Fires GA4 `calculator_use { calculator }` the first time a visitor changes
 * any input inside the calculator — once per page view.
 *
 * Why: the calculators are the site's best on-site converters (BACKLOG
 * 2026-06-19: pipeline 6.7%, ROI 4.8% of sessions reaching a key event), yet
 * no event said a visitor actually *used* one — a page view of a calculator
 * and a worked calculation looked identical. The calculators recompute on
 * every keystroke and have no submit step, so "first edited an input" is the
 * honest definition of use. Listening at the wrapper keeps the five
 * calculator components untouched: React change events bubble.
 */
export function CalculatorUseTracker({
  calculator,
  children,
}: {
  calculator: string;
  children: ReactNode;
}) {
  const fired = useRef(false);
  return (
    <div
      onChange={() => {
        if (fired.current) return;
        fired.current = true;
        trackEvent("calculator_use", { calculator });
      }}
    >
      {children}
    </div>
  );
}
