"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** True on Apple platforms. The server renders the Mac hint (⌘K) like the design's static HTML. */
export function useIsMac() {
  return useSyncExternalStore(
    noop,
    () => /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent),
    () => true,
  );
}
