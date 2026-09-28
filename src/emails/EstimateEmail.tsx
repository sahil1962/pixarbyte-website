import { Link, Section, Text } from "@react-email/components";
import { EmailLayout, colors, styles } from "./EmailLayout";

export interface EstimateEmailProps {
  typeLabel: string;
  sizeLabel: string;
  features: { label: string; price: string }[];
  range: string;
  timeline: string;
  quoteUrl: string;
  bookingUrl?: string;
  footer: { name: string; email: string; phone: string; url: string; location: string };
}

/** The quick estimate breakdown, sent to the visitor who asked for it. */
export function EstimateEmail(props: EstimateEmailProps) {
  return (
    <EmailLayout preview={`Your ${props.typeLabel.toLowerCase()} estimate: ${props.range}`} footer={props.footer}>
      <Text style={styles.h1}>Your quick estimate</Text>
      <Text style={styles.p}>
        Thanks for trying our estimator. Here&apos;s the breakdown you asked for. All prices are in GBP and exclude VAT.
      </Text>
      <Section style={{ ...styles.box, backgroundColor: colors.soft }}>
        <Text style={styles.label}>Project</Text>
        <Text style={styles.value}>
          {props.typeLabel}, {props.sizeLabel.toLowerCase()}
        </Text>
        <Text style={styles.label}>Extras</Text>
        <Text style={styles.value}>
          {props.features.length ? props.features.map((f) => `${f.label} (+${f.price})`).join(", ") : "None"}
        </Text>
        <Text style={styles.label}>Estimated range</Text>
        <Text style={{ ...styles.value, fontSize: "20px", fontWeight: 600 }}>{props.range}</Text>
        <Text style={styles.label}>Timeline</Text>
        <Text style={{ ...styles.value, marginBottom: 0 }}>{props.timeline}</Text>
      </Section>
      <Text style={styles.p}>
        This is a rough guide. Your fixed quote depends on the detail, so the quickest way to a real number is to{" "}
        <Link href={props.quoteUrl} style={styles.link}>
          tell us about your project
        </Link>
        {props.bookingUrl ? (
          <>
            {" "}
            or{" "}
            <Link href={props.bookingUrl} style={styles.link}>
              book a free 30-minute call
            </Link>
          </>
        ) : null}
        . We reply within one working day.
      </Text>
      <Text style={styles.p}>
        Best wishes,
        <br />
        The {props.footer.name} team
      </Text>
    </EmailLayout>
  );
}
