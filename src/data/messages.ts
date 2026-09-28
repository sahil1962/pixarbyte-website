import type { ToastMessage } from "@/types/content";

/** Toast notifications shown across the site. */
export const messages = {
  darkModeOn: { title: "Dark mode on" },
  lightModeOn: { title: "Light mode on" },
  demoLink: { title: "Demo link", body: "This page isn't part of the hero preview." },
  flowPassed: { title: "Test run passed", body: "Lead added to Airtable and posted to Slack." },
  outageHandled: { title: "Outage handled automatically", body: "Traffic was rerouted with zero downtime." },
  automationOn: { title: "Automation on" },
  automationPaused: { title: "Automation paused" },
  estimateSent: { title: "Estimate sent", body: "Check your inbox." },
  newsletterInvalid: { title: "Check your email address", body: "It should look like you@company.co.uk" },
  newsletterSubscribed: { title: "You're subscribed", body: "One short email a month. Unsubscribe any time." },
} satisfies Record<string, ToastMessage>;

export type Messages = typeof messages;
