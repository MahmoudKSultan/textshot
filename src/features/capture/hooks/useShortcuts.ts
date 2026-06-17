import { useState, useCallback, useRef } from "react";

export interface Shortcut {
  key: string;
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
}

export type Action = "capture" | "settings";

const STORAGE_KEY = "textshot-shortcuts";

const DEFAULTS: Record<Action, Shortcut> = {
  capture: { key: "Enter", ctrl: true, shift: false, alt: false, meta: false },
  settings: { key: ",", ctrl: true, shift: false, alt: false, meta: false },
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Record<Action, Shortcut>;
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

export function formatShortcut(s: Shortcut): string {
  const parts: string[] = [];
  if (s.ctrl) parts.push("Ctrl");
  if (s.shift) parts.push("Shift");
  if (s.alt) parts.push("Alt");
  if (s.meta) parts.push("Meta");
  parts.push(s.key.length === 1 ? s.key.toUpperCase() : s.key);
  return parts.join("+");
}

function matchEvent(e: KeyboardEvent, s: Shortcut): boolean {
  return (
    e.key === s.key &&
    e.ctrlKey === s.ctrl &&
    e.shiftKey === s.shift &&
    e.altKey === s.alt &&
    e.metaKey === s.meta
  );
}

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Record<Action, Shortcut>>(load);
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;

  const updateShortcut = useCallback((action: Action, s: Shortcut) => {
    const next = { ...shortcutsRef.current, [action]: s };
    shortcutsRef.current = next;
    setShortcuts(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  }, []);

  const register = useCallback(
    (handlers: Partial<Record<Action, () => void>>) => {
      const cb = (e: KeyboardEvent) => {
        for (const [action, handler] of Object.entries(handlers)) {
          if (handler && matchEvent(e, shortcutsRef.current[action as Action])) {
            e.preventDefault();
            e.stopPropagation();
            handler();
            return;
          }
        }
      };
      document.addEventListener("keydown", cb, true);
      return () => document.removeEventListener("keydown", cb, true);
    },
    [],
  );

  return { shortcuts, updateShortcut, register };
}
