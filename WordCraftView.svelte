<script lang="ts">
	import { SvelteSet } from "svelte/reactivity";

	interface Word {
		word: string;
		score: number;
		tags: string[];
	}

	let {
		topics = "",
		search = "",
		mode = 0,
		meters = "/ x/ /x // /xx x/x xx/".split(" "),
	} = $props();

	let selectedMeters = $state(new SvelteSet<string>());

	let words: Word[] = $state([]);
	let meterCounts = $derived(getMeterCounts(words));

	function getMeterCounts(words: Word[]) {
		let counts: { [key: string]: number } = {};
		for (let word of words) {
			let meter = getMeterFromWord(word);
			if (meters.includes(meter)) {
				counts[meter] = (counts[meter] || 0) + 1;
			} else {
				counts["misc"] = (counts["misc"] || 0) + 1;
			}
		}
		return counts;
	}

	// Reference: https://www.datamuse.com/api/
	const BASE_URL = "https://api.datamuse.com/words";
	const modes = [
		{
			name: "Means like...",
			params: "ml=",
		},
		{
			name: "Rhymes with...",
			params: "arhy=1&sl=",
		},
		{
			name: "Nouns described by...",
			params: "rel_jja=",
		},
		{
			name: "Adjectives that describe...",
			params: "rel_jjb=",
		},
	];

	let globalParams = `max=500&md=fr&topics=`;

	async function fetchWords() {
		if (!search) return;
		let url = `${BASE_URL}?${globalParams}${topics}&${modes[mode].params}${search}`;
		let response = await fetch(url);
		let result: Word[] = await response.json();
		words = result;
	}

	function getPronunciation(word: Word) {
		for (let tag of word.tags) {
			if (tag.startsWith("pron:")) {
				return tag.slice(5);
			}
		}
		return "";
	}

	function getMeterFromWord(word: Word) {
		let meter = "";
		for (let char of getPronunciation(word)) {
			if (char === "1") {
				meter += "/";
			} else if (char === "0") {
				meter += "x";
			}
		}
		return meter;
	}

	function displayWord(word: Word) {
		const meter = getMeterFromWord(word);
		return (
			selectedMeters.size === 0 ||
			selectedMeters.has(meter) ||
			(selectedMeters.has("misc") && !meters.includes(meter))
		);
	}

	// debounce keyboard input
	let timer: NodeJS.Timeout;
	const debounce = () => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			fetchWords();
		}, 200);
	};

	fetchWords();
</script>

<div class="wordcraft">
	<select bind:value={mode} class="mode dropdown" onclick={fetchWords}>
		{#each modes as mode, i}
			<option value={i}>{mode.name}</option>
		{/each}
	</select>

	<input
		bind:value={search}
		type="text"
		placeholder="Search for words..."
		oninput={debounce}
	/>

	<input
		bind:value={topics}
		type="text"
		placeholder="Themes (Optional)"
		oninput={debounce}
	/>

	<div class="list">
		{#each words as word}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			{#if displayWord(word)}
				<div
					onclick={() => {
						search = word.word;
						// alternate between noun / adjective search
						if (mode === 2) {
							mode = 3;
						} else if (mode === 3) {
							mode = 2;
						}
						fetchWords();
					}}
				>
					{word.word}
				</div>
			{/if}
		{/each}
	</div>

	<div
		class="meters"
		onwheel={(e) => {
			if (!e.deltaY) return; // ignore actual horizontal scrolling
			e.preventDefault();
			e.currentTarget.scrollLeft += e.deltaY;
		}}
	>
		{#each [...meters, "misc"] as meter}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={() => {
					if (selectedMeters.has(meter)) {
						selectedMeters.delete(meter);
					} else {
						selectedMeters.add(meter);
					}
				}}
				class={{ meter, selected: selectedMeters.has(meter) }}
			>
				{meter}{#if meterCounts[meter]}
					<span>{meterCounts[meter]}</span>{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.wordcraft {
		width: 100%;
		height: 100%;
		max-width: var(--file-line-width);
		margin-left: auto;
		margin-right: auto;
		display: flex;
		flex-direction: column;
		padding: 8px;
	}
	.wordcraft > * {
		width: 100%;
		margin: 4px 0;
	}

	.wordcraft > input,
	select,
	.meters {
		flex-shrink: 0;
	}

	.list {
		height: 100%;
		overflow-y: scroll;
		text-align: center;
	}

	.list > div {
		padding: 8px 12px;
		text-align: center;
		border-radius: var(--radius-s);
		transition: background-color 0.1s ease-out;
		display: inline-block;
	}

	.list > div:hover {
		color: var(--text-normal);
		background-color: var(--background-modifier-hover);
	}

	.meters {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}

	.meter {
		margin: 2px;
		padding: 2px 4px;
		border-radius: var(--radius-s);
		font-family: var(--font-monospace);
		font-size: var(--font-ui-medium);
		background: var(--interactive-normal);
		transition: background-color 0.1s ease-out;
	}

	.meter:hover {
		background: var(--interactive-hover);
	}

	.meter.selected {
		background: var(--interactive-accent);
		--text-color: var(--text-on-accent);
	}

	.meter.selected:hover {
		background: var(--interactive-accent-hover);
	}

	.meter > span {
		font-family: var(--font-interface);
		font-size: var(--font-ui-smaller);
		font-weight: var(--font-thin);
		padding: 4px;
	}
</style>
