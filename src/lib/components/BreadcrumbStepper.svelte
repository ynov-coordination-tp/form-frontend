<script lang="ts">
	export type Step = {
		label: string;
		index: number;
	};

	export let steps: Step[] = [];
	export let currentStep = 0;
	export let statuses: ('incomplete' | 'error' | 'valid')[] = [];
	export let onStepClick: (index: number) => void;

	const statusStyles = {
		incomplete: 'bg-[rgb(var(--c-border))] text-[rgb(var(--c-text2))]',
		error: 'bg-[rgb(var(--c-error))] text-white',
		valid: 'bg-[rgb(var(--c-success))] text-white'
	};
</script>

<nav aria-label="Étapes" class="w-full">
	<ol class="flex flex-wrap items-center gap-4">
		{#each steps as step (step.index)}
			<li class="flex items-center gap-3">
				<button
					type="button"
					class={`flex items-center gap-2 rounded-full border border-[rgb(var(--c-border))] px-3 py-1 text-sm font-medium transition hover:border-[rgb(var(--c-accent))] ${
						step.index === currentStep ? 'bg-white' : 'bg-transparent'
					}`}
					on:click={() => onStepClick?.(step.index)}
				>
					<span
						class={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
							statusStyles[statuses[step.index] ?? 'incomplete']
						}`}
					>
						{step.index + 1}
					</span>
					<span class="text-sm">{step.label}</span>
				</button>
			</li>
		{/each}
	</ol>
</nav>
