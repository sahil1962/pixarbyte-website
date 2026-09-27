import type { BuilderContent, ClientLogo, HeroContent } from "@/types/content";
import { Stars } from "@/components/shared/Stars";
import { ActivityChip } from "./hero/ActivityChip";
import { Builder } from "./hero/Builder";
import { HeroCopy } from "./hero/HeroCopy";
import { HeroStage } from "./hero/HeroStage";
import { ProofAvatars } from "./hero/ProofAvatars";

function Logos({ logos, clone }: { logos: ClientLogo[]; clone?: boolean }) {
  return logos.map((l) => (
    <span
      key={l.name}
      className={l.style}
      aria-hidden={clone ? "true" : undefined}
      data-marquee-clone={clone ? "" : undefined}
    >
      {l.name}
    </span>
  ));
}

/** Hero: audience-aware copy and social proof on the left, the interactive builder on the right. */
export function Hero({ content, builder }: { content: HeroContent; builder: BuilderContent }) {
  return (
    <HeroStage>
      <div className="hero-inner">
        <div>
          <HeroCopy content={content} />

          <ProofAvatars proof={content.proof}>
            <p className="proof-text">
              <Stars /> <strong>{content.proof.rating}</strong>
              <br />
              {content.proof.detail}
            </p>
          </ProofAvatars>

          <div className="logos">
            <p>{content.clients.label}</p>
            <div className="marquee">
              <div className="logo-row track" id="logo-track">
                <Logos logos={content.clients.logos} />
                <Logos logos={content.clients.logos} clone />
              </div>
            </div>
          </div>
        </div>

        <div className="builder-wrap" id="builder-wrap">
          <div className="aurora" aria-hidden="true" />
          <div className="fchip fchip-reply" aria-hidden="true">
            <span className="dot ping" />
            <div>
              <strong>{content.replyChip.title}</strong>
              <small>{content.replyChip.detail}</small>
            </div>
          </div>
          <ActivityChip items={content.activity} />
          <Builder content={builder} />
        </div>
      </div>
    </HeroStage>
  );
}
