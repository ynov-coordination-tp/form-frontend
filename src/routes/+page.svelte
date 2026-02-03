<script lang="ts">
	import { t } from '$lib/i18n';

	// `$t` is a reactive translation function from the i18n store.
	// Whenever the locale changes, the template updates automatically.
</script>

<main class="min-h-screen bg-[var(--c-bg)] px-6 py-16">
	<div class="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-[var(--radius)] bg-white p-8 shadow-sm">
		<p class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--c-accent)]">
			Hellenic Riders
		</p>
		<h1 class="text-3xl font-bold text-[var(--c-text)]">{$t('ui.home.heading')}</h1>
		<p class="text-sm text-[var(--c-text2)]">{$t('ui.home.description')}</p>
		<a
			href="/quote"
			class="rounded-full bg-[var(--c-accent)] px-5 py-2 text-sm font-semibold text-white"
		>
			{$t('ui.home.cta')}
		</a>
	</div>
</main>
