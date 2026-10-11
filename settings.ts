import { App, PluginSettingTab, Setting } from "obsidian";
import type WordCraft from "./main";

export interface WordCraftSettings {
	/** Themes passed to Datamuse `topics=` — nouns work best. */
	themes: string;
}

export const DEFAULT_SETTINGS: WordCraftSettings = {
	themes: "",
};

export class WordCraftSettingTab extends PluginSettingTab {
	plugin: WordCraft;

	constructor(app: App, plugin: WordCraft) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Themes")
			.setDesc(
				"Optional themes for Datamuse (nouns work best). Used by the Insert rhyme below command and as the default Themes field in the WordCraft view."
			)
			.addText((text) =>
				text
					.setPlaceholder("e.g. ocean, night, longing")
					.setValue(this.plugin.settings.themes)
					.onChange(async (value) => {
						this.plugin.settings.themes = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
