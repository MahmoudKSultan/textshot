import { useEffect, useRef, useState } from "react";
import type { Shortcut, Action } from "../hooks/useShortcuts";
import { formatShortcut } from "../hooks/useShortcuts";

const LANGUAGES = [
  { code: "eng", label: "English" },
  { code: "ara", label: "Arabic" },
  { code: "fra", label: "French" },
  { code: "deu", label: "German" },
  { code: "spa", label: "Spanish" },
  { code: "ita", label: "Italian" },
  { code: "por", label: "Portuguese" },
  { code: "rus", label: "Russian" },
  { code: "jpn", label: "Japanese" },
  { code: "chi_sim", label: "Chinese (Simplified)" },
];

interface SettingsData {
  ocr_language: string;
  auto_copy: boolean;
  show_confidence: boolean;
  save_screenshot: boolean;
}

interface SettingsPanelProps {
  open: boolean;
  onToggle: () => void;
  settings: SettingsData;
  shortcuts: Record<Action, Shortcut>;
  onUpdateShortcut: (action: Action, s: Shortcut) => void;
  onLanguageChange: (lang: string) => void;
  onAutoCopyChange: (enabled: boolean) => void;
  onShowConfidenceChange: (enabled: boolean) => void;
  onSaveScreenshotChange: (enabled: boolean) => void;
}

type Tab = "general" | "shortcuts";

function Toggle({ id, checked, onChange, label }: {
  id: string; checked: boolean; onChange: (v: boolean) => void; label: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-[13px] text-stone-700">{label}</label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-stone-500
          ${checked ? "bg-stone-900" : "bg-stone-300"}
        `}
      >
        <span className={`
          pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm ring-0
          transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}
        `} />
      </button>
    </div>
  );
}

const MODIFIER_KEYS = new Set(["Control", "Shift", "Alt", "Meta"]);

const ACTION_LABELS: Record<Action, string> = {
  capture: "Capture Screen",
  settings: "Toggle Settings",
};

function ShortcutRecorder({
  action, shortcut, onSave,
}: {
  action: Action; shortcut: Shortcut; onSave: (s: Shortcut) => void;
}) {
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;
    const handler = (e: KeyboardEvent) => {
      e.preventDefault(); e.stopPropagation();
      if (MODIFIER_KEYS.has(e.key)) return;
      onSave({ key: e.key, ctrl: e.ctrlKey, shift: e.shiftKey, alt: e.altKey, meta: e.metaKey });
      setRecording(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [recording, onSave]);

  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-stone-700">{ACTION_LABELS[action]}</span>
      <button
        onClick={() => setRecording(true)}
        className={`
          text-[12px] px-2.5 py-1 rounded-md border transition-colors font-mono
          focus-visible:outline-2 focus-visible:outline-stone-500
          ${recording
            ? "bg-amber-50 border-amber-400 text-amber-700 animate-pulse"
            : "bg-white border-stone-300 text-stone-600 hover:border-stone-400"
          }
        `}
      >
        {recording ? "press shortcut..." : formatShortcut(shortcut)}
      </button>
    </div>
  );
}

export function SettingsPanel({
  open, onToggle, settings, shortcuts, onUpdateShortcut,
  onLanguageChange, onAutoCopyChange, onShowConfidenceChange, onSaveScreenshotChange,
}: SettingsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<Tab>("general");

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onToggle();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onToggle();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onToggle]);

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={onToggle}
        aria-label="Open settings"
        aria-expanded={open}
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors focus-visible:outline-2 focus-visible:outline-stone-500"
      >
        <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Settings"
          className="absolute top-full right-0 mt-1 w-80 bg-white border border-stone-200 rounded-lg shadow-lg z-50"
        >
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setTab("general")}
              className={`flex-1 text-[12px] font-medium py-2.5 transition-colors
                ${tab === "general"
                  ? "text-stone-900 border-b-2 border-stone-900"
                  : "text-stone-400 hover:text-stone-600"
                }`}
            >
              General
            </button>
            <button
              onClick={() => setTab("shortcuts")}
              className={`flex-1 text-[12px] font-medium py-2.5 transition-colors
                ${tab === "shortcuts"
                  ? "text-stone-900 border-b-2 border-stone-900"
                  : "text-stone-400 hover:text-stone-600"
                }`}
            >
              Shortcuts
            </button>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {tab === "general" && (
              <div className="flex flex-col gap-4">
                <div>
                  <label htmlFor="ocr-lang" className="block text-[12px] font-medium text-stone-500 mb-1.5 uppercase tracking-wider">
                    OCR Language
                  </label>
                  <select
                    id="ocr-lang"
                    value={settings.ocr_language}
                    onChange={(e) => onLanguageChange(e.target.value)}
                    className="w-full text-[13px] border border-stone-300 rounded-md px-3 py-2 bg-white focus-visible:outline-2 focus-visible:outline-stone-500"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-stone-500 mb-2 uppercase tracking-wider">
                    Behavior
                  </label>
                  <div className="flex flex-col gap-3">
                    <Toggle id="auto-copy" label="Auto-copy to clipboard" checked={settings.auto_copy} onChange={onAutoCopyChange} />
                    <Toggle id="show-confidence" label="Show confidence score" checked={settings.show_confidence} onChange={onShowConfidenceChange} />
                    <Toggle id="save-screenshot" label="Save screenshot to Pictures" checked={settings.save_screenshot} onChange={onSaveScreenshotChange} />
                  </div>
                </div>
              </div>
            )}

            {tab === "shortcuts" && (
              <div>
                <label className="block text-[12px] font-medium text-stone-500 mb-2 uppercase tracking-wider">
                  Key Bindings
                </label>
                <p className="text-[12px] text-stone-400 mb-3">
                  Click a shortcut then press the new key combination.
                </p>
                <div className="divide-y divide-stone-100">
                  {(Object.keys(shortcuts) as Action[]).map((action) => (
                    <ShortcutRecorder
                      key={action}
                      action={action}
                      shortcut={shortcuts[action]}
                      onSave={(s) => onUpdateShortcut(action, s)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
