import { Link, Text } from "@react-email/components";
import { EmailLayout, styles } from "./EmailLayout";

export interface ClientAutoReplyProps {
  firstName: string;
  /** The Calendly page, when booking is set up. */
  bookingUrl?: string;
  portfolioUrl: string;
  summary: string;
  footer: { name: string; email: string; phone: string; url: string; location: string };
}

/** Sent to the client straight after they submit the quote form. */
export function ClientAutoReply({ firstName, bookingUrl, portfolioUrl, summary, footer }: ClientAutoReplyProps) {
  return (
    <EmailLayout preview="We've received your project request and will reply within one working day." footer={footer}>
      <Text style={styles.h1}>Thanks, {firstName}. We&apos;ve got your request.</Text>
      <Text style={styles.p}>
        A senior developer will read your brief and reply within one working day, usually much sooner, with questions,
        ideas and a first estimate.
      </Text>
      <Text style={styles.p}>For your records, you asked about: {summary}.</Text>
      {bookingUrl ? (
        <Text style={styles.p}>
          If you&apos;d rather talk it through now,{" "}
          <Link href={bookingUrl} style={styles.link}>
            book a free 30-minute call
          </Link>{" "}
          at a time that suits you.
        </Text>
      ) : (
        <Text style={styles.p}>
          If you&apos;d rather talk it through now, reply to this email or call us on {footer.phone}.
        </Text>
      )}
      <Text style={styles.p}>
        In the meantime, you can{" "}
        <Link href={portfolioUrl} style={styles.link}>
          see projects we&apos;ve delivered
        </Link>
        .
      </Text>
      <Text style={styles.p}>
        Best wishes,
        <br />
        The {footer.name} team
      </Text>
    </EmailLayout>
  );
}
