import type { Comparison, SectionCopy, Stat } from "@/types/content";

export const whySection: SectionCopy = {
  title: "Senior quality, without the London agency markup.",
  intro: "What changes when you work with PixarByte instead of the usual options.",
};

export const stats: Stat[] = [
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 4.9, decimals: 1, label: "Average client rating" },
  { value: 98, suffix: "%", label: "Delivered on the agreed date" },
  { value: 2, suffix: " hr", label: "Average reply time" },
];

export const comparison: Comparison = {
  caption: "How PixarByte compares with a large agency and a freelancer",
  featureLabel: "What you get",
  columns: ["PixarByte", "Large agency", "Freelancer"],
  rows: [
    {
      label: "Senior developers on every project",
      cells: [
        { kind: "yes", text: "Always" },
        { kind: "meh", text: "Varies" },
        { kind: "yes", text: "Usually" },
      ],
    },
    {
      label: "Fixed price agreed upfront",
      cells: [
        { kind: "yes", text: "Yes" },
        { kind: "meh", text: "Sometimes" },
        { kind: "no", text: "Rarely" },
      ],
    },
    {
      label: "Weekly demos",
      cells: [
        { kind: "yes", text: "Every Friday" },
        { kind: "meh", text: "Monthly" },
        { kind: "meh", text: "Varies" },
      ],
    },
    {
      label: "You own all code and IP",
      cells: [
        { kind: "yes", text: "From day one" },
        { kind: "yes", text: "On final payment" },
        { kind: "meh", text: "Check the contract" },
      ],
    },
    {
      label: "Support after launch",
      cells: [
        { kind: "yes", text: "30 days included" },
        { kind: "meh", text: "Paid extra" },
        { kind: "no", text: "Rarely" },
      ],
    },
    {
      label: "Can start within",
      cells: [
        { kind: "strong", text: "2 weeks" },
        { kind: "meh", text: "6 to 8 weeks" },
        { kind: "meh", text: "Varies" },
      ],
    },
  ],
};
