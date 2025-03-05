import { Plugin, ItemView, WorkspaceLeaf } from "obsidian";
import WordCraftComponent from "./WordCraftView.svelte";
import { mount, unmount } from "svelte";

export const VIEW_TYPE_WORDCRAFT = "wordcraft-view";

export default class WordCraft extends Plugin {
	async onload() {
		this.registerView(
			VIEW_TYPE_WORDCRAFT,
			(leaf) => new WordCraftView(leaf)
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
}

export class WordCraftView extends ItemView {
	component: ReturnType<typeof WordCraftComponent> | undefined;
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
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
			props: { search: "", topics: "", mode: 0 },
		});
	}

	async onClose() {
		if (this.component) {
			unmount(this.component);
		}
	}
}
