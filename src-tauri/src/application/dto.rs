use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MonitoringStatusDTO {
    pub is_running: bool,
    pub detected_text: String,
    pub last_updated: Option<String>,
    pub clipboard_synced: bool,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StartMonitoringDTO {}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StopMonitoringDTO {}
