"use client";

import { useSyncExternalStore } from "react";
import type { ToastMessage } from "@/types/content";

export interface ToastItem extends ToastMessage {
  id: number;
  leaving: boolean;
}

const VISIBLE_MS = 3200;
const LEAVE_MS = 220;

let toasts: ToastItem[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function emit(next: ToastItem[]) {
  toasts = next;
  listeners.forEach((l) => l());
}

/** Show a toast. Callable from any client component or event handler. */
export function toast(message: ToastMessage) {
  const id = nextId++;
  emit([...toasts, { ...message, id, leaving: false }]);
  setTimeout(() => {
    emit(toasts.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => emit(toasts.filter((t) => t.id !== id)), LEAVE_MS);
  }, VISIBLE_MS);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const EMPTY: ToastItem[] = [];

export function useToasts() {
  return useSyncExternalStore(
    subscribe,
    () => toasts,
    () => EMPTY,
  );
}
