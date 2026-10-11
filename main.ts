import {
	Plugin,
	ItemView,
	WorkspaceLeaf,
	Editor,
	MarkdownView,
	Notice,
} from "obsidian";
import WordCraftComponent from "./WordCraftView.svelte";
import { mount, unmount } from "svelte";
import { RHYME_MODE, fetchWords } from "./datamuse";
import { getSeedWord, insertLineBelow } from "./editor";
import { SuggestWordsModal } from "./SuggestWordsModal";
import {
	DEFAULT_SETTINGS,
	WordCraftSettingTab,
	type WordCraftSettings,
} from "./settings";

export const VIEW_TYPE_WORDCRAFT = "wordcraft-view";

export default class WordCraft extends Plugin {
	settings: WordCraftSettings = DEFAULT_SETTINGS;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_WORDCRAFT,
			(leaf) => new WordCraftView(leaf, this)
		);

		this.addRibbonIcon("book-open-text", "Open WordCraft", () => {
			this.activateView();
		});

		this.addCommand({
			id: "open-view",
			name: "Open view",
			callback: () => {
				this.activateView();
			},
		});

		this.addCommand({
			id: "insert-rhyme-below",
			name: "Insert rhyme below",
			editorCallback: async (editor: Editor, _view: MarkdownView) => {
				await this.insertRhymeBelow(editor);
			},
		});

		this.addSettingTab(new WordCraftSettingTab(this.app, this));
	}

	async insertRhymeBelow(editor: Editor) {
		const seed = getSeedWord(editor);
		if (!seed) {
			new Notice("WordCraft — select a word or place the cursor on one.");
			return;
		}

		let results: Awaited<ReturnType<typeof fetchWords>>;
		try {
			results = await fetchWords(seed, RHYME_MODE, this.settings.themes);
		} catch (error) {
			new Notice(
				`WordCraft — ${error instanceof Error ? error.message : error}`
			);
			return;
		}

		const words = [
			...new Set(
				results
					.map((w) => w.word)
					.filter((w) => w && w.toLowerCase() !== seed.toLowerCase())
			),
		];

		if (words.length === 0) {
			new Notice(`WordCraft — no rhymes found for “${seed}”.`);
			return;
		}

		new SuggestWordsModal(this.app, words, (selected) => {
			insertLineBelow(editor, selected);
		}).open();
	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_WORDCRAFT);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({
				type: VIEW_TYPE_WORDCRAFT,
				active: true,
			});
		}

		if (leaf) {
			workspace.revealLeaf(leaf);
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

export class WordCraftView extends ItemView {
	plugin: WordCraft;
	component: ReturnType<typeof WordCraftComponent> | undefined;

	constructor(leaf: WorkspaceLeaf, plugin: WordCraft) {
		super(leaf);
		this.plugin = plugin;
		this.icon = "book-open-text";
	}

	getViewType() {
		return VIEW_TYPE_WORDCRAFT;
	}

	getDisplayText() {
		return "WordCraft";
	}

	async onOpen() {
		this.component = mount(WordCraftComponent, {
			target: this.contentEl,
			props: {
				topics: this.plugin.settings.themes,
				onTopicsChange: (topics: string) => {
					this.plugin.settings.themes = topics;
					void this.plugin.saveSettings();
				},
			},
		});
	}

	async onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
