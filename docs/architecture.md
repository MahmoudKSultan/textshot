# Screen Text Capture Tool
## Architecture & Engineering Guidelines

---

# 1. Project Vision

Build a desktop application that continuously:

1. Captures the user's screen
2. Runs OCR
3. Extracts text in reading order
4. Displays text inside the application
5. Copies text automatically to clipboard
6. Avoids duplicate clipboard writes
7. Remains lightweight and responsive

The application must be:

- Fast
- Reliable
- Maintainable
- Extensible
- Testable

---

# 2. Tech Stack

Frontend

- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand

Desktop

- Tauri v2

Backend

- Rust

OCR

- leptess (Tesseract)
OR
- tesseract-rs

Screen Capture

- screenshots crate

Clipboard

- tauri-plugin-clipboard-manager

Validation

- zod

Logging

- tracing
- tracing-subscriber

---

# 3. Architecture Principles

## Clean Architecture

Business logic MUST NOT depend on:

- React
- Tauri
- OCR implementation
- Clipboard implementation
- OS APIs

Dependencies always point inward.

```text
UI
 ↓
Application
 ↓
Domain
 ↑
Infrastructure
```

Infrastructure depends on Application.

Application depends on Domain.

Domain depends on nothing.

Reference:
Clean Architecture and Dependency Rule. :contentReference[oaicite:1]{index=1}

---

# 4. SOLID Principles

## Single Responsibility

Bad

ScreenService:
- Capture screen
- OCR
- Clipboard
- UI state

Good

ScreenCaptureService
OCRService
ClipboardService
MonitoringService

Each service has one responsibility.

---

## Open / Closed

Allow new OCR engines without changing existing code.

Example:

interface OCRProvider

TesseractProvider
EasyOCRProvider
CloudOCRProvider

---

## Liskov Substitution

Any OCR provider should be swappable.

---

## Interface Segregation

Prefer:

IOCRProvider

instead of:

ISuperService

---

## Dependency Inversion

Depend on interfaces.

Never on implementations.

---

# 5. Desktop UX Principles

Desktop users value efficiency over decoration.

Design should prioritize:

- Speed
- Visibility
- Low friction
- Discoverability
- Keyboard support

Reference desktop UX guidance. :contentReference[oaicite:2]{index=2}

---

# 6. UX Rules

## Rule 1

One primary action.

Primary button:

Start Monitoring

---

## Rule 2

Show status at all times.

Example:

Monitoring: Active
OCR: Ready
Clipboard: Synced

---

## Rule 3

Avoid hidden functionality.

User should always know:

- Is OCR running?
- Was text detected?
- Was clipboard updated?

---

## Rule 4

Immediate feedback.

Every action updates UI.

---

## Rule 5

No modal dialogs unless critical.

---

## Rule 6

Support keyboard shortcuts.

Future:

Ctrl+Shift+S

Start / Stop OCR

---

# 7. UI Layout

```text
┌─────────────────────────────┐
│ Screen Text Capture         │
├─────────────────────────────┤
│                             │
│ Detected Text               │
│                             │
│ Lorem ipsum...              │
│                             │
│                             │
├─────────────────────────────┤
│ Monitoring: ON             │
│ OCR: Ready                 │
│ Clipboard: Synced          │
│ Last Scan: 10:42:30        │
├─────────────────────────────┤
│ Start      Stop            │
└─────────────────────────────┘
```

---

# 8. Design System

## Colors

Success

Green

Warning

Amber

Error

Red

Background

Neutral

---

## Typography

Font

Inter

Scale

12
14
16
20
24

---

## Spacing

4
8
12
16
24
32

---

# 9. Application Layers

## Domain Layer

Contains pure business rules.

No React.

No Tauri.

No Rust OS APIs.

Examples:

TextSnapshot
OCRResult
ClipboardPayload

---

## Application Layer

Contains use cases.

Examples:

StartMonitoringUseCase

StopMonitoringUseCase

ProcessOCRResultUseCase

CopyToClipboardUseCase

---

## Infrastructure Layer

Actual implementations.

Examples:

TesseractOCRProvider

WindowsCaptureProvider

ClipboardProvider

---

## Presentation Layer

React components.

No OCR logic.

No screen capture logic.

---

# 10. OCR Pipeline

```text
Capture Screen
        ↓
Preprocess Image
        ↓
OCR Engine
        ↓
Normalize Text
        ↓
Compare Previous Text
        ↓
Update State
        ↓
Update Clipboard
        ↓
Update UI
```

---

# 11. Reading Order Rules

OCR output must preserve:

Top → Bottom

Then

Left → Right

Text ordering should be deterministic.

---

# 12. Duplicate Detection

Before updating:

normalize(text)

Compare hash.

Example:

SHA256

If hash unchanged:

Skip clipboard update.

Skip UI refresh.

---

# 13. State Management

Global state only.

Use Zustand.

Store:

```ts
interface MonitoringState {
  isRunning: boolean;
  detectedText: string;
  lastUpdated: string | null;
  clipboardSynced: boolean;
  error: string | null;
}
```

---

# 14. Rust Folder Structure

src-tauri/
│
├── src/
│
├── domain/
│   ├── models/
│   └── entities/
│
├── application/
│   ├── use_cases/
│   ├── dto/
│   └── interfaces/
│
├── infrastructure/
│   ├── ocr/
│   ├── capture/
│   ├── clipboard/
│   └── persistence/
│
├── presentation/
│   ├── commands/
│   └── events/
│
├── shared/
│   ├── errors/
│   ├── utils/
│   └── config/
│
├── lib.rs
└── main.rs

---

# 15. React Folder Structure

src/
│
├── app/
│
├── pages/
│
├── widgets/
│
├── features/
│
│   ├── monitoring/
│   │
│   ├── clipboard/
│   │
│   └── ocr/
│
├── entities/
│
├── shared/
│   ├── ui/
│   ├── hooks/
│   ├── lib/
│   ├── api/
│   ├── types/
│   └── constants/
│
└── main.tsx

---

# 16. Feature Structure

Example

features/monitoring

```text
monitoring/
│
├── components/
├── hooks/
├── services/
├── types/
└── store/
```

---

# 17. Naming Conventions

Components

PascalCase

TextViewer.tsx

---

Hooks

useMonitoring.ts

---

Services

OCRService.ts

ClipboardService.ts

---

Rust

snake_case

ocr_service.rs

clipboard_provider.rs

---

# 18. Error Handling

Never panic.

Never crash UI.

Convert all failures to:

AppError

```rust
pub enum AppError {
    OCRFailed,
    ScreenCaptureFailed,
    ClipboardFailed,
    PermissionDenied,
}
```

---

# 19. Logging

Every major event:

OCR started

OCR completed

Clipboard updated

Monitoring stopped

Error occurred

Use tracing.

---

# 20. Performance Rules

OCR runs in background thread.

UI never blocks.

Avoid:

setInterval(100)

Prefer:

500ms–1000ms

scan interval

---

# 21. Future Extensions

Architecture must support:

- Region OCR
- Multi-monitor OCR
- OCR language selection
- Translation
- History
- Export
- AI summarization
- Auto start
- Global shortcuts

without major refactoring.

---

# 22. Testing Strategy

Unit Tests

- OCR normalization
- Hash comparison
- Clipboard update logic

Integration Tests

- OCR pipeline

UI Tests

- Monitoring workflow

---

# 23. Code Quality Rules

Maximum file size:

300 lines

Maximum function size:

40 lines

No God Objects

No business logic in React components

No OCR logic in UI

No direct infrastructure calls from components

All communication goes through use cases

---

# 24. Definition of Done

Feature is complete only if:

✓ Typed

✓ Tested

✓ Logged

✓ Error handled

✓ Documented

✓ Uses architecture correctly

✓ No duplicated code

✓ No lint errors

✓ No warnings

✓ Responsive UI

✓ Works on Windows, Linux, and macOS
