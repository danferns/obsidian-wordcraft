import { App, SuggestModal } from "obsidian";

export class SuggestWordsModal extends SuggestModal<string> {
	words: string[];
	onChoose: (word: string) => void;

	constructor(app: App, words: string[], onChoose: (word: string) => void) {
		super(app);
		this.words = words;
		this.onChoose = onChoose;
		this.setPlaceholder("Filter rhymes…");
	}

	getSuggestions(query: string): string[] {
		const q = query.toLowerCase();
		return this.words.filter((word) => word.toLowerCase().includes(q));
	}

	renderSuggestion(word: string, el: HTMLElement): void {
		el.createEl("div", { text: word });
	}

	onChooseSuggestion(word: string): void {
		this.onChoose(word);
	}
}
