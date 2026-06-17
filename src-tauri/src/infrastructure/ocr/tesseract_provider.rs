use crate::application::interfaces::ocr_provider::OCRProvider;
use crate::domain::models::OCRResult;
use crate::shared::errors::AppError;

pub struct TesseractOCRProvider {
    language: String,
}

impl TesseractOCRProvider {
    pub fn new(language: &str) -> Self {
        tracing::info!("Initializing TesseractOCRProvider (lang={})", language);
        Self {
            language: language.to_string(),
        }
    }
}

impl OCRProvider for TesseractOCRProvider {
    fn recognize(&self, image_bytes: &[u8]) -> Result<OCRResult, AppError> {
        let mut lt = leptess::LepTess::new(None, &self.language).map_err(|e| {
            tracing::error!("Failed to init Tesseract (lang={}): {:?}", self.language, e);
            AppError::OCRFailed
        })?;

        lt.set_image_from_mem(image_bytes).map_err(|e| {
            tracing::error!("Failed to set image for OCR: {:?}", e);
            AppError::OCRFailed
        })?;

        let text = lt.get_utf8_text().map_err(|e| {
            tracing::error!("OCR text extraction failed: {:?}", e);
            AppError::OCRFailed
        })?;

        tracing::debug!("OCR recognized {} characters", text.len());
        Ok(OCRResult {
            text,
            confidence: 0.0,
            language: self.language.clone(),
        })
    }

    fn is_available(&self) -> bool {
        leptess::LepTess::new(None, &self.language).is_ok()
    }
}
