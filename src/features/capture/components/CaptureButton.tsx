interface CaptureButtonProps {
  onCapture: () => void;
  disabled: boolean;
}

export function CaptureButton({ onCapture, disabled }: CaptureButtonProps) {
  return (
    <button
      onClick={onCapture}
      disabled={disabled}
      aria-label="Capture screen region and run OCR"
      aria-busy={disabled}
      className={`
        w-full py-3.5 text-sm font-semibold rounded-lg shadow-sm
        transition-all duration-150 active:scale-[0.98]
        focus-visible:outline-2 focus-visible:outline-stone-500 focus-visible:outline-offset-2
        ${disabled
          ? "bg-stone-200 text-stone-400 cursor-not-allowed"
          : "bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-700 cursor-pointer"
        }
      `}
    >
      {disabled ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-3.5 h-3.5 border-2 border-stone-400 border-t-transparent rounded-full animate-spin" />
          <span>Processing OCR...</span>
        </span>
      ) : (
        "Capture Screen & OCR"
      )}
    </button>
  );
}
