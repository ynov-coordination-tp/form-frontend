<script lang="ts">
	// Import global styles once at the root layout.
	import '../app.css';

	import { onMount } from 'svelte';
	import LanguageSelect from '$lib/components/LanguageSelect.svelte';
	import { initLocaleFromStorage } from '$lib/i18n';

	// SSR-safe initialization: only runs in the browser thanks to onMount.
	// This keeps localStorage access out of the server rendering path.
	onMount(() => {
		initLocaleFromStorage();
	});
</script>

<div class="relative min-h-screen">
	<!-- Top-left language selector (simple and global). -->
	<div class="absolute left-4 top-4 z-10">
		<LanguageSelect />
	</div>

	<slot />
</div>
