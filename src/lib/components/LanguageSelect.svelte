<script lang="ts">
	import { locale, setLocale, t, type Locale } from '$lib/i18n';

	// Simple list of locale options.
	// Keeping it typed helps us avoid typos when we add new languages later.
	const options: { value: Locale; label: string }[] = [
		{ value: 'en', label: 'EN' },
		{ value: 'fr', label: 'FR' }
	];
</script>

<!--
	A minimal <select> for language switching.
	- `value={$locale}` keeps the select in sync with the global store.
	- on:change calls setLocale(...) to update the app language.
	- aria-label uses `$t(...)` to stay accessible in both languages.
-->
<select
	class="rounded-md border border-[var(--c-border)] bg-white px-2 py-1 text-xs font-semibold"
	value={$locale}
	on:change={(event) => setLocale(event.currentTarget.value as Locale)}
	aria-label={$t('ui.languageSelect.aria')}
>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
