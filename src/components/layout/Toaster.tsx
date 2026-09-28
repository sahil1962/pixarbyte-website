"use client";

import { Icon } from "@/components/shared/Icon";
import { useToasts } from "@/lib/toast";

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="toaster" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={t.leaving ? "toast leaving" : "toast"}>
          <Icon name="check" className="ti" />
          <div>
            <strong>{t.title}</strong>
            <span>{t.body ?? ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
