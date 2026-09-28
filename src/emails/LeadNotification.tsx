import { Link, Section, Text } from "@react-email/components";
import { EmailLayout, colors, styles } from "./EmailLayout";

export interface LeadRow {
  label: string;
  value: string;
  href?: string;
}

export interface LeadAttachment {
  name: string;
  size: string;
  href?: string;
  /** "Stored temporarily (…)" for files kept outside Vercel Blob. */
  note?: string;
}

export interface LeadNotificationProps {
  leadId: string;
  heading: string;
  /** Budget, services and similar: shown first, for quick triage. */
  highlights: LeadRow[];
  rows: LeadRow[];
  description?: string;
  attachments?: LeadAttachment[];
  wantsNda?: boolean;
  receivedAt: string;
  footer: { name: string; email: string; phone: string; url: string; location: string };
}

function Row({ row }: { row: LeadRow }) {
  return (
    <>
      <Text style={styles.label}>{row.label}</Text>
      <Text style={styles.value}>
        {row.href ? (
          <Link href={row.href} style={styles.link}>
            {row.value}
          </Link>
        ) : (
          row.value
        )}
      </Text>
    </>
  );
}

/** Internal email to the team for each new lead. Reply goes straight to the client. */
export function LeadNotification(props: LeadNotificationProps) {
  return (
    <EmailLayout preview={props.heading} footer={props.footer}>
      <Text style={styles.h1}>{props.heading}</Text>
      {props.wantsNda && (
        <Text
          style={{
            ...styles.p,
            backgroundColor: "#fef3c7",
            border: "1px solid #f59e0b",
            borderRadius: "8px",
            padding: "8px 12px",
          }}
        >
          <strong>NDA requested.</strong> Send our mutual NDA before asking for details.
        </Text>
      )}
      <Section style={{ ...styles.box, backgroundColor: colors.soft }}>
        {props.highlights.map((r) => (
          <Row key={r.label} row={r} />
        ))}
      </Section>
      <Section style={styles.box}>
        {props.rows.map((r) => (
          <Row key={r.label} row={r} />
        ))}
      </Section>
      {props.description && (
        <Section style={styles.box}>
          <Text style={styles.label}>Project description</Text>
          <Text style={{ ...styles.value, whiteSpace: "pre-wrap" }}>{props.description}</Text>
        </Section>
      )}
      {props.attachments && props.attachments.length > 0 && (
        <Section style={styles.box}>
          <Text style={styles.label}>Attachments</Text>
          {props.attachments.map((a) => (
            <Text key={a.name + a.size} style={styles.value}>
              {a.href ? (
                <Link href={a.href} style={styles.link}>
                  {a.name}
                </Link>
              ) : (
                a.name
              )}{" "}
              ({a.size}){a.note ? `: ${a.note}` : ""}
            </Text>
          ))}
        </Section>
      )}
      <Text style={styles.small}>
        Lead {props.leadId} · received {props.receivedAt}
      </Text>
    </EmailLayout>
  );
}
