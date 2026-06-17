use crate::shared::errors::AppError;

pub trait CaptureProvider {
    fn capture_full_screen(&self) -> Result<Vec<u8>, AppError>;
    fn capture_region(&self, x: i32, y: i32, width: u32, height: u32) -> Result<Vec<u8>, AppError>;
}
