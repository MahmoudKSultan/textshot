use crate::shared::errors::AppError;

pub struct FilePersistence;

impl FilePersistence {
    pub fn new() -> Self {
        tracing::info!("Initializing FilePersistence");
        Self
    }

    pub fn save_text(&self, _text: &str, _path: &str) -> Result<(), AppError> {
        tracing::info!("Text persistence requested");
        Ok(())
    }

    pub fn load_text(&self, _path: &str) -> Result<String, AppError> {
        tracing::info!("Text load requested");
        Ok(String::new())
    }
}
