interface TextPreviewProps {
  text: string;
  confidence: number | null;
  error: string | null;
}

export function TextPreview({ text, confidence, error }: TextPreviewProps) {
  return (
    <div
      role="region"
      aria-label="OCR result"
      aria-live="polite"
      className="flex-1 bg-white border border-stone-200 rounded-lg p-4 overflow-auto min-h-[200px] shadow-sm text-[13px]"
    >
      {error ? (
        <div className="flex items-center justify-center h-full text-center">
          <p role="alert" className="text-sm text-red-400">{error}</p>
        </div>
      ) : text ? (
        <div className="flex flex-col gap-2">
          {confidence !== null && (
            <div
              className="flex items-center gap-2 text-[11px] text-stone-400"
              aria-label={`OCR confidence ${confidence.toFixed(0)} percent`}
            >
              <span>Confidence</span>
              <span className="font-mono tabular-nums">{confidence.toFixed(0)}%</span>
            </div>
          )}
          <pre className="text-[13px] text-stone-800 font-mono leading-relaxed whitespace-pre-wrap">
            {text}
          </pre>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-sm text-stone-400">
            Captured text will appear here
          </p>
        </div>
      )}
    </div>
  );
}
