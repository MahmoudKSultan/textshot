use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonitoringSession {
    pub is_running: bool,
    pub detected_text: String,
    pub last_hash: String,
    pub last_updated: Option<String>,
    pub clipboard_synced: bool,
    pub error: Option<String>,
}

impl MonitoringSession {
    pub fn new() -> Self {
        Self {
            is_running: false,
            detected_text: String::new(),
            last_hash: String::new(),
            last_updated: None,
            clipboard_synced: false,
            error: None,
        }
    }
}

impl Default for MonitoringSession {
    fn default() -> Self {
        Self::new()
    }
}
