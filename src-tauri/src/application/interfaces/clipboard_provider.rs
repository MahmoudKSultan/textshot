use crate::shared::errors::AppError;

pub trait ClipboardProvider {
    fn write_text(&self, text: &str) -> Result<(), AppError>;
    fn read_text(&self) -> Result<String, AppError>;
}
