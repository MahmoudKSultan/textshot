use crate::domain::models::OCRResult;
use crate::shared::errors::AppError;

pub trait OCRProvider {
    fn recognize(&self, image_bytes: &[u8]) -> Result<OCRResult, AppError>;
    fn is_available(&self) -> bool;
}
