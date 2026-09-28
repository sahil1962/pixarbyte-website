import type { ServiceVisual as Visual } from "@/types/content";
import { LayoutVisual } from "./LayoutVisual";
import { RequestLogVisual } from "./RequestLogVisual";
import { AutomationsVisual, RegionsVisual, StackVisual } from "./StaticVisuals";
import { SwipeVisual } from "./SwipeVisual";

/** The live illustration for a service (the same one on the home bento, overview and detail pages). */
export function ServiceVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "stack":
      return <StackVisual {...visual} />;
    case "swipe":
      return <SwipeVisual {...visual} />;
    case "layout":
      return <LayoutVisual labels={visual.labels} />;
    case "requests":
      return <RequestLogVisual requests={visual.requests} />;
    case "automations":
      return <AutomationsVisual {...visual} />;
    case "regions":
      return <RegionsVisual {...visual} />;
  }
}
