<script lang="ts">
	interface Props {
		topics: string;
		search: string;
		mode: number;
	}

	interface Word {
		word: string;
		score: number;
		tags: string[];
	}

	let { topics = "", search = "", mode = 0 }: Props = $props();
	let words: Word[] = $state([]);

	// Reference: https://www.datamuse.com/api/
	const BASE_URL = "https://api.datamuse.com/words";
	const modes = [
		{
			name: "Means like...",
			params: "ml=",
		},
		{
			name: "Rhymes with...",
			params: "arhy=1&md=fr&sl=",
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

	let globalParams = "max=500&topics=";

	async function fetchWords() {
		if (!search) return;
		let url = `${BASE_URL}?${globalParams}${topics}&${modes[mode].params}${search}`;
		let response = await fetch(url);
		let result: Word[] = await response.json();
		words = result;
	}

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
	<input
		bind:value={topics}
		type="text"
		placeholder="Topics (Optional)"
		oninput={debounce}
	/>
	<input
		bind:value={search}
		type="text"
		placeholder="Search for words..."
		oninput={debounce}
	/>

	<select bind:value={mode} class="mode dropdown" onclick={fetchWords}>
		{#each modes as mode, i}
			<option value={i}>{mode.name}</option>
		{/each}
	</select>

	<div class="list">
		{#each words as word}
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
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
		{/each}
	</div>
</div>

<style>
	.wordcraft {
		width: 100%;
		height: 100%;
		max-width: 400px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		padding: 8px;
	}
	.wordcraft > * {
		width: 100%;
		margin: 4px 0;
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

		display: inline-block;
	}

	.list > div:hover {
		color: var(--text-normal);
		background-color: var(--background-modifier-hover);
	}
</style>
