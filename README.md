# TextShot

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Tauri v2](https://img.shields.io/badge/Tauri-v2.11-purple)](https://v2.tauri.app)
[![Platform: Linux](https://img.shields.io/badge/platform-Linux-orange)](https://github.com/MahmoudKSultan/textshot)
[![OCR: Tesseract](https://img.shields.io/badge/OCR-Tesseract-green)](https://github.com/tesseract-ocr/tesseract)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](https://github.com/MahmoudKSultan/textshot/pulls)

> Capture any screen region → extract text via OCR → copy to clipboard instantly.

TextShot is a desktop OCR application for Linux that lets you select any area on your screen, run OCR (Tesseract), and copy the recognized text to your clipboard — all with a single click or keyboard shortcut.

<img src="src-tauri/icons/128x128.png" width="128" height="128" alt="TextShot Icon">

<!-- TODO: Add screenshot of the app in action
<img src="screenshot.png" width="640" alt="TextShot Screenshot">
-->

Built with [Tauri v2](https://v2.tauri.app), React, TypeScript, and Rust.

## Features

- **Screen capture** — Select any region on screen using GNOME's interactive area selection (portal API)
- **OCR** — Extract text via Tesseract (supports multiple languages like English, Arabic, French, etc.)
- **Auto-copy** — Copies recognized text to clipboard automatically
- **Customizable** — OCR language, keyboard shortcuts, auto-copy toggle, confidence display
- **System tray** — Quick access to capture without focusing the app (requires AppIndicator extension)
- **Keyboard shortcuts** — Configurable in-app shortcuts for faster workflow

## Requirements

- **Linux** (tested on Ubuntu 24.04 / GNOME Wayland; also works on other distros with xdg-desktop-portal)
- **Tesseract OCR** with language packs — installed automatically with the `.deb` package below. For AppImage or manual install:
  ```bash
  sudo apt install tesseract-ocr tesseract-ocr-eng tesseract-ocr-ara tesseract-ocr-fra tesseract-ocr-spa
  ```
- **GNOME AppIndicator extension** (for system tray icon on GNOME) — usually pre-installed on Ubuntu

## Install

### Option 1: Download the latest release

Download the `.deb` or `.AppImage` from the [Releases page](https://github.com/MahmoudKSultan/textshot/releases).

**Debian / Ubuntu / Linux Mint:**
```bash
sudo apt install ./textshot_0.1.2_amd64.deb
```

**Any Linux (AppImage — no install needed):**
```bash
chmod +x textshot_0.1.2_amd64.AppImage
./textshot_0.1.2_amd64.AppImage
```

> **Note:** Using `apt install` (not `dpkg -i`) automatically pulls in Tesseract and all required language packs.

### Option 2: Build from source

#### Prerequisites

- Node.js 18+
- [Rust toolchain](https://rustup.rs)
- [Tauri system dependencies](https://v2.tauri.app/start/prerequisites/)
- `libayatana-appindicator3-dev` (for system tray bundling):
  ```bash
  sudo apt install libayatana-appindicator3-dev
  ```

#### Build

```bash
git clone https://github.com/MahmoudKSultan/textshot.git
cd textshot
npm install
npx tauri build
```

Output:
- `src-tauri/target/release/bundle/deb/textshot_0.1.0_amd64.deb`
- `src-tauri/target/release/bundle/appimage/textshot_0.1.0_amd64.AppImage`

#### Development

```bash
npm install
npm run tauri dev
```

Starts Vite dev server with hot-reload.

## Usage

1. Launch **TextShot**
2. Click **Capture Screen & OCR** (or press **Ctrl+Enter**)
3. Select a region on screen using the crosshair
4. The recognized text appears in the app and is copied to your clipboard

### System Tray

When running, TextShot adds a tray icon in the top bar (requires the [AppIndicator extension](https://extensions.gnome.org/extension/615/appindicator-support/) on GNOME). Right-click for:

| Menu option | Action |
|---|---|
| **Take Screenshot** | Capture without focusing the app |
| **Show Window** | Bring TextShot to front |
| **Quit** | Exit the application |

### Settings

Click the gear icon ⚙ in the top-right corner to customize:

| Setting | Description |
|---|---|
| **OCR Language** | Tesseract language code (e.g. `eng`, `ara`, `fra`) |
| **Auto-copy** | Automatically copy OCR result to clipboard |
| **Show Confidence** | Display OCR confidence score |
| **Save Screenshot** | Save screenshot image to disk |

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| Ctrl+Enter | Capture screen & run OCR |
| Escape | Close settings panel |

Shortcuts are customizable in the Settings panel.

## Desktop Compatibility

TextShot uses **xdg-desktop-portal** for screen capture, which integrates with your desktop's screenshot UI.

| Desktop | Status |
|---|---|
| **GNOME** (Ubuntu, Fedora) | ✅ Full support — interactive area selection via portal |
| **KDE Plasma** | ✅ Should work — uses KDE's portal screenshot |
| **Linux Mint (Cinnamon/MATE)** | ✅ Works — falls back to `gnome-screenshot --area` or `mate-screenshot --area` if the portal doesn't support interactive selection. |
| **XFCE** | ✅ Works — falls back to `xfce4-screenshooter --region` if the portal doesn't support interactive selection. |
| **Other desktops** | ⚠️ Requires `gnome-screenshot`, `mate-screenshot`, or `xfce4-screenshooter` for interactive selection. Falls back to non-interactive portal capture if none are available. |

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop framework | [Tauri v2](https://v2.tauri.app) |
| Frontend | React, TypeScript, TailwindCSS, Vite |
| OCR engine | Tesseract (via [leptess](https://crates.io/crates/leptess)) |
| Screen capture | [ashpd](https://crates.io/crates/ashpd) (xdg-desktop-portal) |
| Clipboard | [tauri-plugin-clipboard-manager](https://github.com/tauri-apps/tauri-plugin-clipboard-manager) |
| System tray | Tauri tray-icon (libappindicator / libayatana) |

## Roadmap

- [ ] App screenshot in README
- [ ] Flatpak / Snap package
- [ ] Auto-start on login
- [ ] OCR history
- [ ] Multi-monitor support
- [ ] Windows / macOS support

## Contributing

Contributions are welcome! Feel free to open issues, submit PRs, or suggest features.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT — see [LICENSE](LICENSE) for details.
