import { useEffect, useRef } from "react";

interface HelpPanelProps {
  open: boolean;
  onToggle: () => void;
}

export function HelpPanel({ open, onToggle }: HelpPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

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
        aria-label="Open help"
        aria-expanded={open}
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors focus-visible:outline-2 focus-visible:outline-stone-500"
      >
        <svg className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.01" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Help"
          className="absolute top-full right-0 mt-1 w-80 bg-white border border-stone-200 rounded-lg shadow-lg z-50"
        >
          <div className="p-4 max-h-[70vh] overflow-y-auto space-y-4">
            <section>
              <h3 className="text-[12px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
                How It Works
              </h3>
              <p className="text-[13px] text-stone-600 leading-relaxed">
                TextShot captures a selected region of your screen, runs it through
                Tesseract OCR to recognize text, and copies the result to your clipboard.
              </p>
              <ol className="text-[13px] text-stone-600 mt-2 space-y-1 list-decimal list-inside">
                <li>Click <span className="font-medium text-stone-700">Capture Screen & OCR</span> or press <kbd className="px-1 py-0.5 bg-stone-100 rounded text-[11px] font-mono">Ctrl+Enter</kbd></li>
                <li>Select a region on screen using the crosshair cursor</li>
                <li>TextShot extracts text via OCR and copies it automatically</li>
              </ol>
            </section>

            <hr className="border-stone-100" />

            <section>
              <h3 className="text-[12px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
                Confidence Score
              </h3>
              <p className="text-[13px] text-stone-600 leading-relaxed">
                The confidence score (0–100%) reflects how certain Tesseract OCR is
                about the recognized text. It is calculated as the <span className="font-medium text-stone-700">mean of all
                individual word confidence values</span> returned by Tesseract's layout
                analysis.
              </p>
              <ul className="text-[13px] text-stone-600 mt-2 space-y-1">
                <li><span className="font-medium text-green-600">90–100%</span> — High confidence, text is likely accurate</li>
                <li><span className="font-medium text-amber-600">70–89%</span> — Good confidence, minor errors possible</li>
                <li><span className="font-medium text-orange-600">50–69%</span> — Moderate confidence, review suggested</li>
                <li><span className="font-medium text-red-600">Below 50%</span> — Low confidence, text may be unreliable</li>
              </ul>
              <p className="text-[12px] text-stone-400 mt-2">
                Each word gets a confidence value from Tesseract based on character
                matching, font consistency, and layout analysis. The displayed value
                is the arithmetic mean of all word-level scores.
              </p>
            </section>

            <hr className="border-stone-100" />

            <section>
              <h3 className="text-[12px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
                Tips for Better Results
              </h3>
              <ul className="text-[13px] text-stone-600 space-y-1.5">
                <li><span className="font-medium text-stone-700">Choose the right language</span> — Set the OCR language in Settings to match the text you're capturing.</li>
                <li><span className="font-medium text-stone-700">Clean text</span> — Clear, high-contrast text gives the best results. Avoid blurry or heavily stylized fonts.</li>
                <li><span className="font-medium text-stone-700">Avoid clutter</span> — Select a region with mostly text and minimal background noise or images.</li>
                <li><span className="font-medium text-stone-700">Sufficient resolution</span> — Text should be large enough to read. Very small text (below 10px) may not be recognized accurately.</li>
              </ul>
            </section>

            <hr className="border-stone-100" />

            <section>
              <h3 className="text-[12px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
                Keyboard Shortcuts
              </h3>
              <div className="text-[13px] text-stone-600 space-y-1">
                <div className="flex justify-between">
                  <span>Capture screen</span>
                  <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-[11px] font-mono">Ctrl+Enter</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Close settings / help</span>
                  <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-[11px] font-mono">Esc</kbd>
                </div>
              </div>
              <p className="text-[12px] text-stone-400 mt-1">
                Customize capture shortcut in Settings {"→"} Shortcuts.
              </p>
            </section>

            <hr className="border-stone-100" />

            <section>
              <h3 className="text-[12px] font-semibold text-stone-900 uppercase tracking-wider mb-1.5">
                Troubleshooting
              </h3>
              <div className="text-[13px] text-stone-600 space-y-2">
                <div>
                  <p className="font-medium text-stone-700">"Tesseract not found"</p>
                  <p className="text-[12px] text-stone-400">Install Tesseract: <code className="text-[11px] bg-stone-100 px-1 rounded">sudo apt install tesseract-ocr tesseract-ocr-eng</code></p>
                </div>
                <div>
                  <p className="font-medium text-stone-700">"No text detected"</p>
                  <p className="text-[12px] text-stone-400">Try changing the OCR language in Settings, or select a region with clearer, larger text.</p>
                </div>
                <div>
                  <p className="font-medium text-stone-700">"Capture was cancelled"</p>
                  <p className="text-[12px] text-stone-400">The portal dialog was dismissed. Just click the button and try again.</p>
                </div>
              </div>
            </section>

            <section className="text-center pt-1">
              <p className="text-[11px] text-stone-300">
                TextShot v0.1.1 — Built with Tauri + React + Rust
              </p>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
