import { requestUrl } from "obsidian";

export interface Word {
	word: string;
	score: number;
	tags: string[];
}

// Reference: https://www.datamuse.com/api/
export const BASE_URL = "https://api.datamuse.com/words";

export const MODES = [
	{ name: "Means like...", params: "ml=" },
	{ name: "Rhymes with...", params: "arhy=1&sl=" },
	{ name: "Nouns described by...", params: "rel_jja=" },
	{ name: "Adjectives that describe...", params: "rel_jjb=" },
] as const;

export const RHYME_MODE = 1;

export async function fetchWords(
	search: string,
	mode: number,
	topics = ""
): Promise<Word[]> {
	if (!search) return [];
	const url = `${BASE_URL}?max=500&md=fr&topics=${encodeURIComponent(
		topics
	)}&${MODES[mode].params}${encodeURIComponent(search)}`;
	const response = await requestUrl(url);
	return response.json as Word[];
}

export function getPronunciation(word: Word): string {
	for (const tag of word.tags ?? []) {
		if (tag.startsWith("pron:")) {
			return tag.slice(5);
		}
	}
	return "";
}

export function getMeterFromWord(word: Word): string {
	let meter = "";
	for (const char of getPronunciation(word)) {
		if (char === "1") {
			meter += "/";
		} else if (char === "0") {
			meter += "x";
		}
	}
	return meter;
}
