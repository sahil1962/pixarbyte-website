"use client";

import { useState } from "react";
import { useSite } from "@/components/layout/SiteProvider";
import { toast } from "@/lib/toast";

/** On/off switch for one automation in the no-code card. */
export function AutomationSwitch({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const { messages } = useSite();
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      className="switch"
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => {
        const next = !on;
        setOn(next);
        toast({ title: (next ? messages.automationOn : messages.automationPaused).title, body: label });
      }}
    />
  );
}
