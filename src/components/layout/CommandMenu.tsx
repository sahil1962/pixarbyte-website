"use client";

import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Command, CommandMenuContent } from "@/types/content";
import { Icon } from "@/components/shared/Icon";
import { useSite } from "@/components/layout/SiteProvider";
import { prefersReducedMotion, useModalDialog } from "@/lib/hooks";
import { useIsMac } from "@/lib/platform";

/** ⌘K / Ctrl K / "/" command menu, plus the ⌘J / Ctrl J theme shortcut. */
export function CommandMenu({ content }: { content: CommandMenuContent }) {
  const site = useSite();
  const { commandOpen, openCommand, closeCommand, toggleTheme } = site;
  const dialog = useModalDialog(commandOpen);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const isMac = useIsMac();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [wasOpen, setWasOpen] = useState(commandOpen);
  if (commandOpen !== wasOpen) {
    setWasOpen(commandOpen);
    if (commandOpen) {
      setQuery("");
      setActive(0);
    }
  }

  const term = query.trim().toLowerCase();
  const filtered = content.commands.filter(
    (c) => !term || c.label.toLowerCase().includes(term) || c.group.toLowerCase().includes(term),
  );
  const current = Math.min(active, filtered.length - 1);

  useEffect(() => {
    if (commandOpen) input.current?.focus();
  }, [commandOpen]);

  useEffect(() => {
    list.current?.querySelector(`#cmd-${current}`)?.scrollIntoView({ block: "nearest" });
  }, [current]);

  // Global shortcuts. Read the latest state through a ref so the listener is attached once.
  const latest = useRef({ commandOpen, openCommand, closeCommand, toggleTheme });
  useEffect(() => {
    latest.current = { commandOpen, openCommand, closeCommand, toggleTheme };
  });
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      const s = latest.current;
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === "k") {
        e.preventDefault();
        if (s.commandOpen) s.closeCommand();
        else s.openCommand();
      }
      if (mod && key === "j") {
        e.preventDefault();
        s.toggleTheme();
      }
      const el = document.activeElement as HTMLElement | null;
      const typing = !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
      if (e.key === "/" && !mod && !typing && !document.querySelector("dialog[open]")) {
        e.preventDefault();
        s.openCommand();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  function run(command: Command | undefined) {
    if (!command) return;
    closeCommand();
    const a = command.action;
    setTimeout(() => {
      switch (a.type) {
        case "preview":
          site.builder.current?.preview(a.project);
          break;
        case "estimate":
          site.openEstimate();
          break;
        case "book":
          site.book();
          break;
        case "theme":
          toggleTheme();
          break;
        case "jump":
          document.getElementById(a.target)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
          break;
      }
    }, 60);
  }

  function onInputKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (filtered.length) setActive((current + 1) % filtered.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length) setActive((current - 1 + filtered.length) % filtered.length);
    }
    if (e.key === "Enter") {
      e.preventDefault();
      run(filtered[current]);
    }
  }

  const modifier = isMac ? content.modifier.mac : content.modifier.other;

  return (
    <dialog
      id="cmdk"
      aria-label={content.ariaLabel}
      ref={dialog}
      onClose={closeCommand}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCommand();
      }}
    >
      <div className="cmd-input">
        <Icon name="search" />
        <input
          ref={input}
          id="cmd-q"
          placeholder={content.placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded="true"
          aria-controls="cmd-list"
          aria-autocomplete="list"
          aria-activedescendant={filtered.length ? `cmd-${current}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
        />
      </div>
      <div className="cmd-list" id="cmd-list" role="listbox" ref={list}>
        {filtered.length === 0 ? (
          <div className="cmd-empty">{content.empty}</div>
        ) : (
          filtered.map((c, i) => (
            <Fragment key={c.label}>
              {(i === 0 || filtered[i - 1].group !== c.group) && <div className="cmd-group">{c.group}</div>}
              <div
                className="cmd-item"
                role="option"
                id={`cmd-${i}`}
                aria-selected={i === current}
                onMouseMove={() => {
                  if (current !== i) setActive(i);
                }}
                onClick={() => run(c)}
              >
                <Icon name={c.icon} />
                <span>{c.label}</span>
                {c.shortcut && <span className="kbd">{modifier + c.shortcut}</span>}
              </div>
            </Fragment>
          ))
        )}
      </div>
      <div className="cmd-foot">
        <span>
          <span className="kbd">{content.keys.up}</span>
          <span className="kbd">{content.keys.down}</span>
          {` ${content.hints.navigate}`}
        </span>
        <span>
          <span className="kbd">{content.keys.enter}</span>
          {` ${content.hints.select}`}
        </span>
        <span>
          <span className="kbd">{content.keys.escape}</span>
          {` ${content.hints.close}`}
        </span>
      </div>
    </dialog>
  );
}
