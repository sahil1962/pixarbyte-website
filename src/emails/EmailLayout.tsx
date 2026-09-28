import type { ReactNode } from "react";
import { Body, Container, Head, Hr, Html, Link, Preview, Section, Text } from "@react-email/components";

/**
 * Shared shell for every email: plain, light and mostly text, so it reads well in any
 * client and doesn't look like marketing to spam filters.
 */

export const colors = {
  text: "#09090b",
  muted: "#52525b",
  border: "#e4e4e7",
  soft: "#f4f4f5",
  accent: "#2563eb",
};

export const styles = {
  h1: { fontSize: "20px", lineHeight: "28px", fontWeight: 600, margin: "0 0 12px", color: colors.text },
  p: { fontSize: "15px", lineHeight: "24px", margin: "0 0 14px", color: colors.text },
  small: { fontSize: "13px", lineHeight: "20px", margin: "0", color: colors.muted },
  link: { color: colors.accent, textDecoration: "underline" },
  label: {
    fontSize: "12px",
    lineHeight: "18px",
    margin: "0",
    color: colors.muted,
    textTransform: "uppercase" as const,
  },
  value: { fontSize: "15px", lineHeight: "22px", margin: "0 0 12px", color: colors.text },
  box: { border: `1px solid ${colors.border}`, borderRadius: "10px", padding: "16px 18px", margin: "0 0 18px" },
};

export function EmailLayout({
  preview,
  children,
  footer,
}: {
  preview: string;
  children: ReactNode;
  footer: { name: string; email: string; phone: string; url: string; location: string };
}) {
  return (
    <Html lang="en-GB">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          margin: 0,
          padding: "24px 0",
        }}
      >
        <Container style={{ maxWidth: "560px", padding: "0 20px" }}>
          <Text style={{ ...styles.p, fontWeight: 600, fontSize: "16px" }}>{footer.name}</Text>
          {children}
          <Hr style={{ borderColor: colors.border, margin: "28px 0 16px" }} />
          <Section>
            <Text style={styles.small}>
              {footer.name} · {footer.location}
            </Text>
            <Text style={styles.small}>
              <Link href={`mailto:${footer.email}`} style={styles.link}>
                {footer.email}
              </Link>
              {" · "}
              {footer.phone}
              {" · "}
              <Link href={footer.url} style={styles.link}>
                {footer.url.replace(/^https?:\/\//, "")}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
