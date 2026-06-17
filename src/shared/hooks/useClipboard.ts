import { writeText } from "@tauri-apps/plugin-clipboard-manager";

export function useClipboard() {
  async function copy(text: string): Promise<void> {
    await writeText(text);
  }

  return { copy };
}
