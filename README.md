# WordCraft

Find rhymes, synonyms, and describing words from within Obsidian. Designed for songwriting and poetry.

Search Modes:

-   Means like... (thesaurus / reverse dictionary)
-   Rhymes with... (also includes near rhymes)
-   Nouns described by... (endless -> sea)
-   Adjectives that describe... (sea -> endless)

If you wish, you may specify a couple of `Themes` to skew the results towards them. Nouns work best.

Click on a word from the results to repeat the search on it. Noun and Adjective modes will swap, so clicking on a _noun_ will trigger a search for _adjectives_ that describe the noun.

You may filter words for [syllabic stress patterns](https://youtu.be/JMxzLOSlhbs):
- `/` is a stressed syllable.
- `x` is an unstressed syllable.

NOTE: WordCraft needs an internet connection to work.

![app___obsidian md_index html](https://github.com/user-attachments/assets/4321b709-2f46-4cc7-9f0c-aa518d594608)

## Usage

Open the WordCraft view:

-   Use the `WordCraft: Open view` command.
-   Click on the WordCraft "book" icon in the side ribbon.

Or insert a rhyme without leaving the editor:

1. Put the cursor on a word (or select it).
2. Run `WordCraft: Insert rhyme below` from the command palette.
3. Pick a rhyme — it is inserted on the **next line**, so your seed word stays put.

Themes from Settings (or the Themes field in the view) are passed to Datamuse as `topics=`, same as the sidebar.

## Credits

This plugin uses the free [Datamuse API](https://www.datamuse.com/api/).

## Say thanks

If this plugin adds value to your life and you wish to give back, feel welcomed to buy my music on [Bandcamp](https://twinklingkites.bandcamp.com/). It makes my day! :)

## License

This plugin is released under the [MIT License](LICENSE).
