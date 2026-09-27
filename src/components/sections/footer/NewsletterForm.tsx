"use client";

import { useRef, useState, type FormEvent } from "react";
import type { FooterContent } from "@/types/content";
import { useSite } from "@/components/layout/SiteProvider";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Newsletter sign-up. Validation and toasts only; no mailing-list provider is connected yet. */
export function NewsletterForm({ content }: { content: FooterContent["newsletter"] }) {
  const { notify } = useSite();
  const [value, setValue] = useState("");
  const [invalid, setInvalid] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL.test(value.trim())) {
      setInvalid(true);
      notify("newsletterInvalid");
      input.current?.focus();
      return;
    }
    setInvalid(false);
    setValue("");
    notify("newsletterSubscribed");
  }

  return (
    <form className="news-form" id="news-form" noValidate onSubmit={onSubmit}>
      <label htmlFor="news-email" className="sr-only">
        {content.label}
      </label>
      <input
        ref={input}
        className="input"
        id="news-email"
        type="email"
        placeholder={content.placeholder}
        autoComplete="email"
        aria-invalid={invalid ? "true" : undefined}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="btn btn-primary btn-sm" type="submit" style={{ height: 38 }}>
        {content.button}
      </button>
    </form>
  );
}
