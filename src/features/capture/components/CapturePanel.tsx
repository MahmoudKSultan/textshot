import { useCallback, useEffect, useState } from "react";
import { captureScreen } from "@/shared/api/tauri";
import { CaptureButton } from "./CaptureButton";
import { TextPreview } from "./TextPreview";
import { SettingsPanel } from "./SettingsPanel";
import { useShortcuts } from "../hooks/useShortcuts";

interface Settings {
  ocr_language: string;
  auto_copy: boolean;
  show_confidence: boolean;
  save_screenshot: boolean;
}

const defaultSettings: Settings = {
  ocr_language: "eng",
  auto_copy: true,
  show_confidence: true,
  save_screenshot: false,
};

export function CapturePanel() {
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { shortcuts, updateShortcut } = useShortcuts();

  const handleCapture = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await captureScreen(settings.ocr_language, settings.auto_copy);
      setText(result.text);
      setConfidence(result.confidence);
    } catch {
      setError("Capture failed or was cancelled");
    }

    setLoading(false);
  }, [settings.ocr_language, settings.auto_copy]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleCapture();
      }
    };
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [handleCapture]);

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-xs font-medium text-stone-500 uppercase tracking-wider">Output</h2>
        <SettingsPanel
          open={settingsOpen}
          onToggle={() => setSettingsOpen((prev) => !prev)}
          settings={settings}
          shortcuts={shortcuts}
          onUpdateShortcut={updateShortcut}
          onLanguageChange={(lang) =>
            setSettings((prev) => ({ ...prev, ocr_language: lang }))
          }
          onAutoCopyChange={(enabled) =>
            setSettings((prev) => ({ ...prev, auto_copy: enabled }))
          }
          onShowConfidenceChange={(enabled) =>
            setSettings((prev) => ({ ...prev, show_confidence: enabled }))
          }
          onSaveScreenshotChange={(enabled) =>
            setSettings((prev) => ({ ...prev, save_screenshot: enabled }))
          }
        />
      </div>
      <TextPreview
        text={text}
        confidence={settings.show_confidence ? confidence : null}
        error={error}
      />
      <CaptureButton
        onCapture={handleCapture}
        disabled={loading}
      />
    </div>
  );
}
