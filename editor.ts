import type { Editor } from "obsidian";

/** Selection if present, otherwise the word under the cursor. */
export function getSeedWord(editor: Editor): string {
	const selection = editor.getSelection().trim();
	if (selection) return selection;

	const cursor = editor.getCursor();
	const line = editor.getLine(cursor.line);
	const before = line.slice(0, cursor.ch).match(/[\p{L}\p{N}'’_-]+$/u);
	const after = line.slice(cursor.ch).match(/^[\p{L}\p{N}'’_-]+/u);
	return `${before?.[0] ?? ""}${after?.[0] ?? ""}`.trim();
}

/** Insert `text` on a new line immediately below the cursor/selection end. */
export function insertLineBelow(editor: Editor, text: string): void {
	const end = editor.getCursor("to");
	const lineText = editor.getLine(end.line);
	const insertAt = { line: end.line, ch: lineText.length };
	editor.replaceRange(`\n${text}`, insertAt);
	editor.setCursor({ line: end.line + 1, ch: text.length });
}
