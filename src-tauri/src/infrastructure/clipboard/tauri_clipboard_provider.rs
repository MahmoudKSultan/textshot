use crate::application::interfaces::clipboard_provider::ClipboardProvider;
use crate::shared::errors::AppError;

pub struct TauriClipboardProvider;

impl TauriClipboardProvider {
    pub fn new() -> Self {
        tracing::info!("Initializing TauriClipboardProvider");
        Self
    }
}

impl ClipboardProvider for TauriClipboardProvider {
    fn write_text(&self, _text: &str) -> Result<(), AppError> {
        tracing::info!("Clipboard write requested");
        Err(AppError::ClipboardFailed)
    }

    fn read_text(&self) -> Result<String, AppError> {
        tracing::info!("Clipboard read requested");
        Err(AppError::ClipboardFailed)
    }
}
