import { CapturePanel } from "@/features/capture/components/CapturePanel";

export function MainPage() {
  return (
    <div className="flex flex-col h-dvh p-4 max-w-lg mx-auto overflow-hidden">
      <header className="shrink-0 mb-3">
        <h1 className="text-base font-semibold text-stone-900 tracking-tight">
          TextShot
        </h1>
        <p className="text-[11px] text-stone-500 mt-0.5">
          Capture screen region & extract text with OCR
        </p>
      </header>
      <CapturePanel />
    </div>
  );
}
