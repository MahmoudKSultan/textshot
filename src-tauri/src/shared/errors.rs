use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error, Serialize)]
pub enum AppError {
    #[error("OCR processing failed")]
    OCRFailed,

    #[error("Screen capture failed")]
    ScreenCaptureFailed,

    #[error("Clipboard operation failed")]
    ClipboardFailed,

    #[error("Permission denied")]
    PermissionDenied,

    #[error("Monitoring is already active")]
    MonitoringAlreadyActive,

    #[error("Monitoring is not active")]
    MonitoringNotActive,

    #[error("No text detected")]
    NoTextDetected,
}
