import type { FAQ, FaqSectionContent } from "@/types/content";

export const faqSection: FaqSectionContent = {
  title: "Questions, answered.",
  intro: "Can't find what you need? We reply within two working hours.",
  phonePrefix: "or call",
};

export const faqs: FAQ[] = [
  {
    question: "Do you only work with London businesses?",
    answer:
      "Most of our clients are in London and the South East, but we work with businesses across the UK. Projects run remotely with weekly video calls, and we're happy to meet in person in London by appointment.",
  },
  {
    question: "Who owns the code and designs?",
    answer:
      "You do, from day one. Our contract assigns all intellectual property to you, and the code lives in your own GitHub and cloud accounts, not ours.",
  },
  {
    question: "How do payments work?",
    answer:
      "We invoice in GBP in milestones, usually 30% to start, 40% midway and 30% on launch. Retainers are billed monthly in advance. Prices exclude VAT.",
  },
  {
    question: "How do you handle UK GDPR?",
    answer:
      "We sign a data processing agreement with every client, host personal data in UK or EU regions by default, and build privacy features like consent, data export and deletion into the product.",
  },
  {
    question: "How quickly can you start?",
    answer: "Usually within two weeks of agreeing scope. For urgent fixes to an existing product, often the same week.",
  },
  {
    question: "What happens after launch?",
    answer:
      "The first 30 days of support are included. After that, most clients choose a monthly maintenance plan covering updates, monitoring, security patches and small improvements.",
  },
  {
    question: "Can you take over an existing project?",
    answer:
      "Yes. We start with a fixed-price code and infrastructure audit so you know exactly what you have, what needs fixing and what it will cost.",
  },
];
