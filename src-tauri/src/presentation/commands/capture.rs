use tauri::{Emitter, Manager};
use crate::infrastructure::capture::screenshots_provider::ScreenshotsCaptureProvider;
use crate::infrastructure::ocr::tesseract_provider::TesseractOCRProvider;
use crate::application::interfaces::ocr_provider::OCRProvider;
use crate::application::use_cases::ocr_processing;
use crate::shared::errors::AppError;
use crate::AppState;

fn user_facing_error(e: &AppError) -> &'static str {
    match e {
        AppError::ScreenCaptureFailed => "Capture was cancelled or failed. Try again.",
        AppError::OCRFailed => "OCR processing failed. Make sure Tesseract is installed and the language pack is available.",
        AppError::NoTextDetected => "No text detected in the selected region. Try selecting a region with more text or changing the OCR language.",
        AppError::ClipboardFailed => "Failed to copy text to clipboard.",
        AppError::PermissionDenied => "Permission denied. Check your portal permissions.",
        _ => "An unexpected error occurred.",
    }
}

fn run_capture_inner(
    app: &tauri::AppHandle,
    lang: &str,
    copy_enabled: bool,
) -> Result<serde_json::Value, String> {
    let capture = ScreenshotsCaptureProvider::new();
    let ocr = TesseractOCRProvider::new(lang);

    let img_bytes = capture
        .capture_interactive()
        .map_err(|e| format!("{}##{}", user_facing_error(&e), e))?;

    let result = ocr
        .recognize(&img_bytes)
        .map_err(|e| format!("{}##{}", user_facing_error(&e), e))?;

    let text = ocr_processing::normalize_text(&result.text);

    if text.is_empty() {
        return Err(format!("{}##NoText", user_facing_error(&AppError::NoTextDetected)));
    }

    if copy_enabled {
        use tauri_plugin_clipboard_manager::ClipboardExt;
        app.clipboard()
            .write_text(&text)
            .map_err(|e| format!("{}##{}", user_facing_error(&AppError::ClipboardFailed), e))?;
    }

    tracing::info!("Captured and OCR'd ({} chars, lang={})", text.len(), lang);

    app.emit("ocr-result", serde_json::json!({
        "text": text,
        "confidence": result.confidence,
        "timestamp": crate::shared::utils::format_timestamp(),
    })).ok();

    Ok(serde_json::json!({
        "text": text,
        "confidence": result.confidence,
    }))
}

#[tauri::command]
pub fn capture_screen(
    app: tauri::AppHandle,
    language: Option<String>,
    auto_copy: Option<bool>,
) -> Result<serde_json::Value, String> {
    let state = app.state::<AppState>();
    let config = state.config.lock().unwrap();
    let lang = language
        .filter(|l| !l.is_empty())
        .unwrap_or_else(|| config.ocr_language.clone());
    let copy_enabled = auto_copy.unwrap_or(config.auto_copy);
    drop(config);

    run_capture_inner(&app, &lang, copy_enabled)
}

pub fn run_capture(app: &tauri::AppHandle) {
    let state = app.state::<AppState>();
    let config = state.config.lock().unwrap();
    let lang = config.ocr_language.clone();
    let copy_enabled = config.auto_copy;
    drop(config);

    if let Err(e) = run_capture_inner(app, &lang, copy_enabled) {
        app.emit("error", serde_json::json!({ "message": e })).ok();
    }
}

#[tauri::command]
pub fn get_settings(state: tauri::State<'_, AppState>) -> Result<serde_json::Value, String> {
    let config = state.config.lock().unwrap();
    Ok(serde_json::json!({
        "ocr_language": config.ocr_language,
        "auto_copy": config.auto_copy,
    }))
}
