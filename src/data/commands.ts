import type { CommandMenuContent } from "@/types/content";

export const commandMenu: CommandMenuContent = {
  ariaLabel: "Command menu",
  placeholder: "Type a command or search",
  empty: 'No results. Try "estimate" or "mobile".',
  hints: { navigate: "navigate", select: "select", close: "close" },
  keys: { up: "↑", down: "↓", enter: "↵", escape: "esc" },
  modifier: { mac: "⌘", other: "Ctrl " },
  commands: [
    { group: "Preview", label: "Preview a website", icon: "web", action: { type: "preview", project: "website" } },
    { group: "Preview", label: "Preview a mobile app", icon: "phone", action: { type: "preview", project: "mobile" } },
    { group: "Preview", label: "Preview a web app", icon: "grid", action: { type: "preview", project: "webapp" } },
    {
      group: "Preview",
      label: "Preview a no-code automation",
      icon: "flow",
      action: { type: "preview", project: "nocode" },
    },
    {
      group: "Preview",
      label: "Preview a cloud deployment",
      icon: "cloud",
      action: { type: "preview", project: "cloud" },
    },
    { group: "Actions", label: "Get a quick estimate", icon: "calc", action: { type: "estimate" } },
    { group: "Actions", label: "Book a 30-minute call", icon: "cal", action: { type: "book" } },
    { group: "Actions", label: "Request a quote", icon: "mail", action: { type: "go", href: "/contact" } },
    { group: "Actions", label: "Toggle dark mode", icon: "moon", action: { type: "theme" }, shortcut: "J" },
    { group: "Jump to", label: "Services", icon: "file", action: { type: "jump", target: "services" } },
    { group: "Jump to", label: "Case studies", icon: "file", action: { type: "jump", target: "work" } },
    { group: "Jump to", label: "Process", icon: "file", action: { type: "jump", target: "process" } },
    { group: "Jump to", label: "Pricing", icon: "file", action: { type: "jump", target: "pricing" } },
    { group: "Jump to", label: "FAQ", icon: "file", action: { type: "jump", target: "faq" } },
    { group: "Jump to", label: "Contact", icon: "mail", action: { type: "go", href: "/contact" } },
  ],
};
