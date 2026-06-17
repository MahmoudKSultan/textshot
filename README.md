# TextShot

A desktop OCR application for Linux that captures a screen region, runs OCR (Tesseract), and copies the recognized text to your clipboard.

<img src="src-tauri/icons/128x128.png" width="128" height="128" alt="TextShot Icon">

Built with [Tauri v2](https://v2.tauri.app), React, TypeScript, and Rust.

## Features

- **Screen capture** — Select a region on screen using GNOME's interactive area selection (portal API)
- **OCR** — Recognizes text via Tesseract (supports multiple languages)
- **Auto-copy** — Copies recognized text to clipboard automatically
- **Settings** — Customizable OCR language, keyboard shortcuts, auto-copy toggle, confidence display
- **System tray** — Quick access to capture, show window, and quit (GNOME AppIndicator extension required for tray icon visibility)

## Requirements

- **Linux** (tested on Ubuntu 24.04 / GNOME Wayland)
- **Tesseract OCR** — Install with language data:
  ```bash
  sudo apt install tesseract-ocr tesseract-ocr-eng
  ```
  For additional languages: `sudo apt install tesseract-ocr-<lang-code>`
- **libayatana-appindicator3-dev** (for system tray bundling):
  ```bash
  sudo apt install libayatana-appindicator3-dev
  ```

## Building from source

### Prerequisites

- Node.js 18+
- Rust toolchain (https://rustup.rs)
- Tauri system dependencies: https://v2.tauri.app/start/prerequisites/

### Build

```bash
git clone <repo-url>
cd textshot
npm install
npx tauri build
```

The bundled application will be at:
- `src-tauri/target/release/bundle/deb/textshot_0.1.0_amd64.deb`
- `src-tauri/target/release/bundle/appimage/textshot_0.1.0_amd64.AppImage`

### Development

```bash
npm install
npm run tauri dev
```

This starts the Vite dev server and launches the app in development mode with hot-reload.

## Usage

1. Launch TextShot
2. Click **Capture Screen & OCR** (or press **Ctrl+Enter**)
3. Select a region on screen using the crosshair
4. The recognized text appears in the app and is copied to your clipboard

### System Tray

When running, TextShot adds a tray icon (requires AppIndicator extension on GNOME). Right-click the tray icon for:
- **Take Screenshot** — Capture without focusing the app window
- **Show Window** — Bring the app to front
- **Quit** — Exit the application

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+Enter | Capture screen & run OCR |
| Escape | Close settings panel |

Shortcuts can be customized in the Settings panel.

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop framework | [Tauri v2](https://v2.tauri.app) |
| Frontend | React, TypeScript, TailwindCSS, Vite |
| OCR engine | Tesseract (via [leptess](https://crates.io/crates/leptess)) |
| Screen capture | [ashpd](https://crates.io/crates/ashpd) (xdg-desktop-portal) |
| Clipboard | [tauri-plugin-clipboard-manager](https://github.com/tauri-apps/tauri-plugin-clipboard-manager) |
| System tray | Tauri tray-icon (libappindicator/libayatana) |

## License

MIT
