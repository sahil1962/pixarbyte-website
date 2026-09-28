"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { submitQuote } from "@/app/contact/actions";
import type { ContactPageContent } from "@/data/contact";
import type { quoteOptions as QuoteOptionsData } from "@/data/contact";
import { Turnstile } from "@/components/shared/Turnstile";
import { fill } from "@/lib/format";
import { prefillFromParams, type PrefillContext } from "@/lib/quote-prefill";
import type { StorageMode } from "@/lib/storage";
import {
  budgetOptions,
  clientTypes,
  phoneCountries,
  projectTypes,
  quoteSchema,
  serviceOptions,
  sourceOptions,
  timelineOptions,
  type QuoteFormValues,
  type QuoteInput,
} from "@/lib/validation/quote";
import { AttachmentUploader } from "./AttachmentUploader";

type Copy = ContactPageContent["form"];
type Options = typeof QuoteOptionsData;

const defaults: QuoteFormValues = {
  name: "",
  email: "",
  phoneCountry: "+44",
  phone: "",
  company: "",
  clientType: undefined as unknown as QuoteFormValues["clientType"],
  services: [],
  projectType: "",
  budget: "" as unknown as QuoteFormValues["budget"],
  timeline: "",
  description: "",
  attachments: [],
  source: "",
  wantsNda: false,
  consent: false as unknown as true,
  turnstileToken: "",
  website: "",
};

/** Label, control, optional hint and the error line, wired together for screen readers. */
function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="field-label" htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="ctrl-note mt-1.5 mb-0">
          {hint}
        </p>
      )}
      <div className="err-msg" id={`${id}-error`}>
        {error}
      </div>
    </div>
  );
}

/** aria props for a control with an optional hint and error line. */
function described(id: string, error?: string, hint?: boolean) {
  return {
    id,
    "aria-invalid": error ? ("true" as const) : undefined,
    "aria-describedby": [hint && `${id}-hint`, `${id}-error`].filter(Boolean).join(" "),
  };
}

/** Applies ?service=, ?type=, ?package=, ?model= and ?estimate= once the page has loaded. */
function PrefillFromUrl({
  form,
  ctx,
}: {
  form: UseFormReturn<QuoteFormValues, unknown, QuoteInput>;
  ctx: PrefillContext;
}) {
  const params = useSearchParams();
  const applied = useRef<string | null>(null);
  useEffect(() => {
    const key = params.toString();
    if (applied.current === key) return;
    applied.current = key;
    const prefill = prefillFromParams(new URLSearchParams(key), ctx);
    if (Object.keys(prefill).length) form.reset({ ...form.getValues(), ...prefill });
  }, [params, form, ctx]);
  return null;
}

export function QuoteForm({
  copy,
  options,
  prefill,
  uploadMode,
}: {
  copy: Copy;
  options: Options;
  prefill: PrefillContext;
  uploadMode: StorageMode;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [turnstileReset, setTurnstileReset] = useState(0);
  const status = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  const form = useForm<QuoteFormValues, unknown, QuoteInput>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
    defaultValues: defaults,
  });
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitted },
  } = form;
  const err = (k: keyof QuoteFormValues) => errors[k]?.message as string | undefined;

  const description = useWatch({ control, name: "description" }) ?? "";
  const attachments = useWatch({ control, name: "attachments" }) ?? [];

  function onFirstFocus() {
    if (started.current) return;
    started.current = true;
    if (process.env.NEXT_PUBLIC_GA_ID) sendGAEvent("event", "quote_form_start");
  }

  function onSubmit(values: QuoteInput) {
    setServerError(null);
    startTransition(async () => {
      let res: Awaited<ReturnType<typeof submitQuote>>;
      try {
        res = await submitQuote(values);
      } catch {
        res = { ok: false, error: copy.genericError };
      }
      if (res.ok) {
        if (process.env.NEXT_PUBLIC_GA_ID)
          sendGAEvent("event", "quote_form_submit", { services: values.services.join(","), budget: values.budget });
        const first = values.name.trim().split(/\s+/)[0] ?? "";
        router.push(`/thank-you?name=${encodeURIComponent(first)}`);
        return;
      }
      setServerError(res.error);
      for (const [k, message] of Object.entries(res.fieldErrors ?? {})) {
        if (k in defaults) setError(k as keyof QuoteFormValues, { message });
      }
      // Turnstile tokens are single-use: get a fresh one for the next try.
      setValue("turnstileToken", "");
      setTurnstileReset((n) => n + 1);
      status.current?.focus();
    });
  }

  const hasErrors = isSubmitted && Object.keys(errors).length > 0;

  return (
    <form
      className="aud-card gap-8"
      noValidate
      onSubmit={(e) => void handleSubmit(onSubmit)(e)}
      onFocus={onFirstFocus}
      aria-labelledby="quote-title"
    >
      <Suspense fallback={null}>
        <PrefillFromUrl form={form} ctx={prefill} />
      </Suspense>

      <div>
        <h2 id="quote-title" className="m-0 text-[26px] leading-tight font-semibold tracking-[-0.03em]">
          {copy.title}
        </h2>
        <p className="mt-2 mb-0 text-muted-foreground">{copy.intro}</p>
      </div>

      {/* About you */}
      <fieldset className="m-0 grid min-w-0 gap-4 border-0 p-0">
        <legend className="meta-label mb-4">{copy.groups.you}</legend>
        <div className="grid gap-4 md:grid-cols-2">
          <Field id="q-name" label={copy.name.label} required error={err("name")}>
            <input
              className="input w-full"
              autoComplete="name"
              placeholder={copy.name.placeholder}
              aria-required="true"
              {...described("q-name", err("name"))}
              {...register("name")}
            />
          </Field>
          <Field id="q-email" label={copy.email.label} required error={err("email")}>
            <input
              className="input w-full"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={copy.email.placeholder}
              aria-required="true"
              {...described("q-email", err("email"))}
              {...register("email")}
            />
          </Field>
          <Field id="q-phone" label={copy.phone.label} hint={copy.phone.hint} error={err("phone")}>
            <div className="flex gap-2">
              <select
                className="input w-[104px] flex-none"
                aria-label={copy.phone.countryLabel}
                autoComplete="tel-country-code"
                {...register("phoneCountry")}
              >
                {phoneCountries.map((c) => (
                  <option key={c} value={c}>
                    {options.phoneCountries[c]}
                  </option>
                ))}
              </select>
              <input
                className="input w-full"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                placeholder={copy.phone.placeholder}
                {...described("q-phone", err("phone"), true)}
                {...register("phone")}
              />
            </div>
          </Field>
          <Field id="q-company" label={copy.company.label} error={err("company")}>
            <input
              className="input w-full"
              autoComplete="organization"
              placeholder={copy.company.placeholder}
              {...described("q-company", err("company"))}
              {...register("company")}
            />
          </Field>
        </div>

        <fieldset
          className="m-0 min-w-0 border-0 p-0"
          aria-describedby="q-clientType-error"
          aria-invalid={err("clientType") ? "true" : undefined}
        >
          <legend className="field-label">
            {copy.clientType.label}
            <span aria-hidden="true"> *</span>
          </legend>
          <div className="checks">
            {clientTypes.map((t) => (
              <label className="check" key={t}>
                <input type="radio" value={t} {...register("clientType")} />
                <span>{options.clientTypes[t].label}</span>
                <small className="max-md:hidden">{options.clientTypes[t].hint}</small>
              </label>
            ))}
          </div>
          <div className="err-msg" id="q-clientType-error">
            {err("clientType")}
          </div>
        </fieldset>
      </fieldset>

      {/* Your project */}
      <fieldset className="m-0 grid min-w-0 gap-4 border-0 p-0">
        <legend className="meta-label mb-4">{copy.groups.project}</legend>
        <fieldset
          className="m-0 min-w-0 border-0 p-0"
          aria-describedby="q-services-hint q-services-error"
          aria-invalid={err("services") ? "true" : undefined}
        >
          <legend className="field-label">
            {copy.services.label}
            <span aria-hidden="true"> *</span>
          </legend>
          <div className="checks">
            {serviceOptions.map((s) => (
              <label className="check" key={s}>
                <input type="checkbox" value={s} {...register("services")} />
                <span>{options.services[s]}</span>
              </label>
            ))}
          </div>
          <p id="q-services-hint" className="ctrl-note mt-1.5 mb-0">
            {copy.services.hint}
          </p>
          <div className="err-msg" id="q-services-error">
            {err("services")}
          </div>
        </fieldset>

        <div className="grid gap-4 md:grid-cols-3">
          <Field id="q-budget" label={copy.budget.label} required hint={copy.budget.hint} error={err("budget")}>
            <select
              className="input w-full"
              aria-required="true"
              {...described("q-budget", err("budget"), true)}
              {...register("budget")}
            >
              <option value="" disabled>
                {copy.budget.placeholder}
              </option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>
                  {options.budgets[b]}
                </option>
              ))}
            </select>
          </Field>
          <Field id="q-timeline" label={copy.timeline.label} error={err("timeline")}>
            <select className="input w-full" {...described("q-timeline", err("timeline"))} {...register("timeline")}>
              <option value="">{copy.timeline.placeholder}</option>
              {timelineOptions.map((t) => (
                <option key={t} value={t}>
                  {options.timelines[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field id="q-projectType" label={copy.projectType.label} error={err("projectType")}>
            <select
              className="input w-full"
              {...described("q-projectType", err("projectType"))}
              {...register("projectType")}
            >
              <option value="">{copy.projectType.placeholder}</option>
              {projectTypes.map((t) => (
                <option key={t} value={t}>
                  {options.projectTypes[t]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          id="q-description"
          label={copy.description.label}
          required
          hint={fill(copy.description.counter, { count: description.length.toLocaleString("en-GB") })}
          error={err("description")}
        >
          <textarea
            className="input w-full"
            rows={6}
            maxLength={5000}
            placeholder={copy.description.placeholder}
            aria-required="true"
            {...described("q-description", err("description"), true)}
            {...register("description")}
          />
        </Field>

        <div className="min-w-0">
          <label className="field-label" htmlFor="q-attachments">
            {copy.attachments.label}
          </label>
          <AttachmentUploader
            id="q-attachments"
            value={attachments}
            onChange={(next) => setValue("attachments", next, { shouldValidate: isSubmitted })}
            mode={uploadMode}
            copy={copy.attachments}
            describedBy="q-attachments-hint"
          />
          <p id="q-attachments-hint" className="ctrl-note mt-1.5 mb-0">
            {copy.attachments.hint}
          </p>
        </div>
      </fieldset>

      {/* Details */}
      <fieldset className="m-0 grid min-w-0 gap-4 border-0 p-0">
        <legend className="meta-label mb-4">{copy.groups.details}</legend>
        <Field id="q-source" label={copy.source.label} error={err("source")}>
          <select className="input w-full md:w-1/2" {...described("q-source", err("source"))} {...register("source")}>
            <option value="">{copy.source.placeholder}</option>
            {sourceOptions.map((s) => (
              <option key={s} value={s}>
                {options.sources[s]}
              </option>
            ))}
          </select>
        </Field>

        <label className="check">
          <input type="checkbox" {...register("wantsNda")} />
          <span>{copy.wantsNda.label}</span>
        </label>

        <div>
          <label className="check">
            <input
              type="checkbox"
              aria-required="true"
              {...described("q-consent", err("consent"))}
              {...register("consent")}
            />
            <span>
              {copy.consent.label}
              <span aria-hidden="true"> *</span>
            </span>
          </label>
          <div className="err-msg" id="q-consent-error">
            {err("consent")}
          </div>
        </div>

        {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="q-website">{copy.honeypot}</label>
          <input id="q-website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
        </div>

        <div>
          <Turnstile
            resetKey={turnstileReset}
            onToken={(t) => setValue("turnstileToken", t, { shouldValidate: !!t && isSubmitted })}
          />
          <input type="hidden" {...register("turnstileToken")} />
          <div className="err-msg" id="q-turnstile-error" role="status">
            {err("turnstileToken")}
          </div>
        </div>
      </fieldset>

      <div className="grid gap-3">
        <div ref={status} tabIndex={-1} role="alert" className="err-msg m-0 outline-none">
          {serverError ?? (hasErrors ? copy.errorSummary : "")}
        </div>
        <button className="btn btn-primary btn-lg justify-self-start" type="submit" disabled={pending}>
          {pending ? copy.sending : copy.submit}
        </button>
      </div>
    </form>
  );
}
