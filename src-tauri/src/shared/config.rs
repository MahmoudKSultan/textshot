use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    pub ocr_language: String,
    pub auto_copy: bool,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            ocr_language: "eng+ara+fra+spa".to_string(),
            auto_copy: true,
        }
    }
}
