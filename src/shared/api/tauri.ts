import { invoke } from "@tauri-apps/api/core";

export interface Settings {
  ocr_language: string;
  auto_copy: boolean;
}

export async function captureScreen(
  autoCopy?: boolean,
): Promise<{ text: string; confidence: number }> {
  const result = await invoke<{ text: string; confidence: number }>("capture_screen", {
    language: null,
    autoCopy: autoCopy ?? null,
  });
  return result;
}

export async function getSettings(): Promise<Settings> {
  return await invoke<Settings>("get_settings");
}
