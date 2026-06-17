use std::sync::OnceLock;

use crate::application::interfaces::capture_provider::CaptureProvider;
use crate::shared::errors::AppError;

pub struct ScreenshotsCaptureProvider;

fn runtime() -> &'static tokio::runtime::Runtime {
    static RUNTIME: OnceLock<tokio::runtime::Runtime> = OnceLock::new();
    RUNTIME.get_or_init(|| {
        tracing::info!("Creating dedicated tokio runtime for ashpd portal");
        tokio::runtime::Runtime::new().expect("Failed to create tokio runtime")
    })
}

impl ScreenshotsCaptureProvider {
    pub fn new() -> Self {
        tracing::info!("Initializing ScreenshotsCaptureProvider (portal)");
        Self
    }
}

impl CaptureProvider for ScreenshotsCaptureProvider {
    fn capture_full_screen(&self) -> Result<Vec<u8>, AppError> {
        let bytes = runtime().block_on(Self::capture_inner())?;
        tracing::debug!("Captured full screen ({} bytes)", bytes.len());
        Ok(bytes)
    }

    fn capture_region(
        &self,
        _x: i32,
        _y: i32,
        _width: u32,
        _height: u32,
    ) -> Result<Vec<u8>, AppError> {
        Err(AppError::ScreenCaptureFailed)
    }
}

impl ScreenshotsCaptureProvider {
    pub fn capture_interactive(&self) -> Result<Vec<u8>, AppError> {
        let bytes = runtime().block_on(Self::capture_interactive_inner())?;
        tracing::info!("Interactive capture ({} bytes)", bytes.len());
        Ok(bytes)
    }

    async fn capture_interactive_inner() -> Result<Vec<u8>, AppError> {
        use ashpd::desktop::screenshot::Screenshot;

        let request = Screenshot::request().interactive(true).send().await.map_err(|e| {
            tracing::error!("Portal interactive screenshot send failed: {:?}", e);
            AppError::ScreenCaptureFailed
        })?;

        let response = request.response().map_err(|e| {
            tracing::error!("Portal interactive screenshot response failed: {:?}", e);
            AppError::ScreenCaptureFailed
        })?;

        let path = response
            .uri()
            .to_file_path()
            .map_err(|_| {
                tracing::error!("Portal returned non-file URI: {}", response.uri());
                AppError::ScreenCaptureFailed
            })?;

        let bytes = std::fs::read(&path).map_err(|e| {
            tracing::error!("Failed to read screenshot file {:?}: {}", path, e);
            AppError::ScreenCaptureFailed
        })?;

        if let Err(e) = std::fs::remove_file(&path) {
            tracing::warn!("Failed to remove screenshot file {:?}: {}", path, e);
        }

        Ok(bytes)
    }

    async fn capture_inner() -> Result<Vec<u8>, AppError> {
        use ashpd::desktop::screenshot::Screenshot;

        let request = Screenshot::request().interactive(false).send().await.map_err(|e| {
            tracing::error!("Portal screenshot send failed: {:?}", e);
            AppError::ScreenCaptureFailed
        })?;

        let response = request.response().map_err(|e| {
            tracing::error!("Portal screenshot response failed: {:?}", e);
            AppError::ScreenCaptureFailed
        })?;

        let path = response
            .uri()
            .to_file_path()
            .map_err(|_| {
                tracing::error!("Portal returned non-file URI: {}", response.uri());
                AppError::ScreenCaptureFailed
            })?;

        let bytes = std::fs::read(&path).map_err(|e| {
            tracing::error!("Failed to read screenshot file {:?}: {}", path, e);
            AppError::ScreenCaptureFailed
        })?;

        if let Err(e) = std::fs::remove_file(&path) {
            tracing::warn!("Failed to remove screenshot file {:?}: {}", path, e);
        }

        Ok(bytes)
    }
}
