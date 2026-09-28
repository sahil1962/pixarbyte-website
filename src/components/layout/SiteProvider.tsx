"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { Messages } from "@/data/messages";
import type { Audience, ProjectType } from "@/types/content";
import { toast } from "@/lib/toast";

/** What the hero builder exposes to the rest of the page (command menu, estimate dialog). */
export interface BuilderHandle {
  currentKey(): ProjectType;
  stopAutoplay(): void;
  /** Switch to a project tab and scroll the builder into view. */
  preview(key: ProjectType): void;
}

interface SiteContextValue {
  messages: Messages;
  notify(key: keyof Messages): void;

  audience: Audience;
  setAudience(a: Audience): void;

  builder: RefObject<BuilderHandle | null>;
  registerBuilder(handle: BuilderHandle | null): void;

  estimate: { open: boolean; type: ProjectType; session: number };
  openEstimate(type?: ProjectType | null): void;
  closeEstimate(): void;

  commandOpen: boolean;
  openCommand(): void;
  closeCommand(): void;

  menuOpen: boolean;
  openMenu(): void;
  closeMenu(): void;

  toggleTheme(): void;
  book(): void;
  demo(): void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

function isDark() {
  const root = document.documentElement;
  return root.dataset.theme ? root.dataset.theme === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function SiteProvider({
  messages,
  defaultAudience,
  children,
}: {
  messages: Messages;
  defaultAudience: Audience;
  children: ReactNode;
}) {
  const builder = useRef<BuilderHandle | null>(null);
  const [audience, setAudience] = useState<Audience>(defaultAudience);
  const [estimate, setEstimate] = useState<SiteContextValue["estimate"]>({ open: false, type: "website", session: 0 });
  const [commandOpen, setCommandOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const notify = useCallback((key: keyof Messages) => toast(messages[key]), [messages]);

  // Any estimate button closes the mobile menu, hands the builder to the visitor and,
  // when no type is given, prices whatever the builder is showing.
  const openEstimate = useCallback((type?: ProjectType | null) => {
    setMenuOpen(false);
    builder.current?.stopAutoplay();
    const t = type ?? builder.current?.currentKey() ?? "website";
    setEstimate((e) => ({ open: true, type: t, session: e.session + 1 }));
  }, []);

  const toggleTheme = useCallback(() => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    notify(next === "dark" ? "darkModeOn" : "lightModeOn");
  }, [notify]);

  const book = useCallback(() => {
    setMenuOpen(false);
    notify("booking");
  }, [notify]);

  const value = useMemo<SiteContextValue>(
    () => ({
      messages,
      notify,
      audience,
      setAudience,
      builder,
      registerBuilder: (handle) => {
        builder.current = handle;
      },
      estimate,
      openEstimate,
      closeEstimate: () => setEstimate((e) => ({ ...e, open: false })),
      commandOpen,
      openCommand: () => {
        setEstimate((e) => ({ ...e, open: false }));
        setCommandOpen(true);
      },
      closeCommand: () => setCommandOpen(false),
      menuOpen,
      openMenu: () => setMenuOpen(true),
      closeMenu: () => setMenuOpen(false),
      toggleTheme,
      book,
      demo: () => notify("demoLink"),
    }),
    [messages, notify, audience, estimate, openEstimate, commandOpen, menuOpen, toggleTheme, book],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
