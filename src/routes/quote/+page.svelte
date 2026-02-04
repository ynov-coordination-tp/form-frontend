<script lang="ts">
	import BreadcrumbStepper from '$lib/components/BreadcrumbStepper.svelte';
	import { t } from '$lib/i18n';
	import { createQuoteWizard } from '$lib/services/quoteWizard.js';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/quote/$types.js';

	// Page data injected by SvelteKit's load function.
	export let data: PageData;

	const wizard = createQuoteWizard(data.catalog, { isOffline: data.isOffline });

	const { state, derived, actions } = wizard;

	const {
		stepIndex,
		selectedCircuitId,
		selectedFormulaId,
		participantsCount,
		lead,
		dateDepart,
		submissionStatus,
		submissionMessage
	} = state;

	const {
		circuits,
		currentCircuit,
		currentFormula,
		placesRestantes,
		datesLocked,
		dateRetour,
		selectedOptions,
		totalPrice,
		visibleErrors,
		stepStatuses
	} = derived;

	// Reactive step labels: when `$t` changes, the stepper updates automatically.
	let steps: { label: string; index: number }[] = [];
	$: steps = [
		{ label: $t('ui.step.tour'), index: 0 },
		{ label: $t('ui.step.formula'), index: 1 },
		{ label: $t('ui.step.participants'), index: 2 },
		{ label: $t('ui.step.form'), index: 3 },
		{ label: $t('ui.step.submit'), index: 4 }
	];

	const fallbackMaxParticipants = 10;

	// Note: price formatting is kept simple here; it is not part of the i18n system.
	const formatPrice = (value: number) => `${value.toLocaleString('fr-FR')} €`;
</script>

<svelte:head>
	<!-- Even the document title is localized. -->
	<title>{$t('ui.quote.title')}</title>
</svelte:head>

<main class="min-h-screen bg-[var(--c-bg)] px-4 py-10">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
		<header class="flex flex-col gap-3">
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--c-accent)]">
				Hellenic Riders
			</p>
			<h1 class="text-3xl font-bold text-[var(--c-text)]">{$t('ui.quote.heading')}</h1>
			{#if data.isOffline}
				<div
					class="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--c-warning)]"
				>
					<span>{$t('ui.quote.offlineMode')}</span>
					<span aria-hidden="true">•</span>
					<span>{$t('ui.quote.mockCatalog')}</span>
				</div>
			{/if}
		</header>

		<BreadcrumbStepper
			{steps}
			currentStep={$stepIndex}
			statuses={$stepStatuses}
			ariaLabel={$t('ui.stepper.aria')}
			onStepClick={(index) => actions.goToStep(index)}
		/>

		<section class="rounded-[var(--radius)] bg-white p-6 shadow-sm">
			{#if $stepIndex === 0}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.circuitChoiceTitle')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					{$t('ui.sections.circuitChoiceDescription')}
				</p>
				<div class="flex flex-col gap-3">
					<label class="flex items-center gap-4 text-sm font-medium" for="circuit-select">
						<span>{$t('ui.fields.circuitLabel')}</span>
						<select
							id="circuit-select"
							class="rounded-lg border border-[var(--c-border)] px-3 py-2"
							value={$selectedCircuitId}
							on:change={(event) => actions.setCircuit(event.currentTarget.value)}
						>
							<option value="">{$t('ui.fields.circuitPlaceholder')}</option>
							{#each circuits as circuit}
								<option value={circuit.id}>{circuit.nom}</option>
							{/each}
						</select>
					</label>
					{#if $currentCircuit}
						<div class="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)] p-4">
							<p class="text-sm">
								{$t('ui.fields.durationLabel')}:
								<strong>{$currentCircuit.duree_jours} {$t('ui.units.days')}</strong>
							</p>
							<p class="text-sm">
								{$t('ui.fields.distanceLabel')}:
								<strong>{$currentCircuit.distance_km} {$t('ui.units.kilometers')}</strong>
							</p>
						</div>
					{/if}
					{#if $visibleErrors.circuitId}
						<p class="text-sm text-[var(--c-error)]">{$visibleErrors.circuitId}</p>
					{/if}
				</div>
			{/if}

			{#if $stepIndex === 1}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.formulaTitle')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					{$t('ui.sections.formulaDescription')}
				</p>
				{#if !$currentCircuit}
					<p class="text-sm text-[var(--c-text2)]">
						{$t('ui.sections.formulaNeedCircuit')}
					</p>
				{:else}
					<div class="grid gap-4 md:grid-cols-3">
						{#each $currentCircuit.formules as formule}
							<button
								type="button"
								class={`flex flex-col gap-3 rounded-[var(--radius)] border p-4 text-left transition card ${
									$selectedFormulaId === formule.id
										? 'card-selected border-[var(--c-accent)] bg-[var(--c-bg)]'
										: 'border-[var(--c-border)] bg-white'
								}`}
								on:click={() => actions.setFormula(formule.id)}
							>
								<div class="flex items-center justify-between">
									<h3 class="font-cinzel text-lg font-semibold">{formule.code}</h3>
									<span class="text-xs">{formule.nom}</span>
								</div>
								<p class="text-sm opacity-95">
									{$t('ui.fields.basePriceLabel')}:
									{formatPrice(formule.prix_base)}
								</p>
								<p class="text-xs opacity-95">
									{$t('ui.fields.remainingSeatsLabel')}:{' '}
									{formule.maxParticipant && formule.currParticipant
										? formule.maxParticipant - formule.currParticipant
										: fallbackMaxParticipants}
								</p>
							</button>
						{/each}
					</div>
				{/if}
				{#if $visibleErrors.formulaId}
					<p class="mt-3 text-sm text-[var(--c-error)]">{$visibleErrors.formulaId}</p>
				{/if}
			{/if}

			{#if $stepIndex === 2}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.participantsTitle')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					{$t('ui.sections.participantsDescription')}
				</p>
				<div class="flex flex-col gap-3">
					<label class="flex items-center gap-4 text-sm font-medium" for="participants-count">
						<span>{$t('ui.fields.participantsCountLabel')}</span>
						<input
							id="participants-count"
							type="number"
							min="1"
							max={$placesRestantes}
							class="rounded-lg border border-[var(--c-border)] px-3 py-2"
							value={$participantsCount}
							on:input={(event) => actions.setParticipantsCount(Number(event.currentTarget.value))}
						/>
						{#if $currentFormula}
							<p class="text-xs text-[var(--c-text2)]">
								{$t('ui.fields.remainingSeatsLabel')}: {$placesRestantes}
							</p>
						{/if}
					</label>

					{#if $visibleErrors.participantsCount}
						<p class="text-sm text-[var(--c-error)]">{$visibleErrors.participantsCount}</p>
					{/if}
				</div>
			{/if}

			{#if $stepIndex === 3}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.infoOptionsTitle')}</h2>
				<div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
					<div class="flex flex-col gap-6">
						<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
							<h3 class="mb-3 text-lg font-semibold">{$t('ui.sections.contactTitle')}</h3>
							<div class="grid gap-3 md:grid-cols-2">
								<label class="flex flex-col gap-1 text-sm">
									{$t('ui.fields.firstNameLabel')}
									<input
										class="rounded-lg border border-[var(--c-border)] px-3 py-2"
										value={$lead.prenom}
										on:input={(event) => actions.updateLeadField('prenom', event.currentTarget.value)}
									/>
									{#if $visibleErrors.leadPrenom}
										<span class="text-xs text-[var(--c-error)]">{$visibleErrors.leadPrenom}</span>
									{/if}
								</label>
								<label class="flex flex-col gap-1 text-sm">
									{$t('ui.fields.lastNameLabel')}
									<input
										class="rounded-lg border border-[var(--c-border)] px-3 py-2"
										value={$lead.nom}
										on:input={(event) => actions.updateLeadField('nom', event.currentTarget.value)}
									/>
									{#if $visibleErrors.leadNom}
										<span class="text-xs text-[var(--c-error)]">{$visibleErrors.leadNom}</span>
									{/if}
								</label>
								<label class="flex flex-col gap-1 text-sm">
									{$t('ui.fields.emailLabel')}
									<input
										type="email"
										class="rounded-lg border border-[var(--c-border)] px-3 py-2"
										value={$lead.email}
										on:input={(event) => actions.updateLeadField('email', event.currentTarget.value)}
									/>
									{#if $visibleErrors.leadEmail}
										<span class="text-xs text-[var(--c-error)]">{$visibleErrors.leadEmail}</span>
									{/if}
								</label>
								<label class="flex flex-col gap-1 text-sm">
									{$t('ui.fields.phoneLabel')}
									<input
										type="tel"
										class="rounded-lg border border-[var(--c-border)] px-3 py-2"
										value={$lead.telephone}
										on:input={(event) => actions.updateLeadField('telephone', event.currentTarget.value)}
									/>
									{#if $visibleErrors.leadTelephone}
										<span class="text-xs text-[var(--c-error)]">{$visibleErrors.leadTelephone}</span>
									{/if}
								</label>
							</div>
						</div>

						<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
							<h3 class="mb-3 text-lg font-semibold">{$t('ui.sections.datesTitle')}</h3>
							<div class="grid gap-3 md:grid-cols-2">
								<label class="flex flex-col gap-1 text-sm">
									{$t('ui.fields.departureDateLabel')}
									<input
										type="date"
										class="rounded-lg border border-[var(--c-border)] px-3 py-2"
										disabled={$datesLocked}
										value={$dateDepart ?? ''}
										on:input={(event) => actions.setDateDepart(event.currentTarget.value)}
									/>
									{#if $visibleErrors.dateDepart}
										<span class="text-xs text-[var(--c-error)]">{$visibleErrors.dateDepart}</span>
									{/if}
								</label>
								<label class="flex flex-col gap-1 text-sm">
									{$t('ui.fields.returnDateComputedLabel')}
									<input
										type="date"
										class="rounded-lg border border-[var(--c-border)] px-3 py-2"
										readonly
										disabled
										value={$dateRetour ?? ''}
									/>
									{#if $visibleErrors.dateRetour}
										<span class="text-xs text-[var(--c-error)]">{$visibleErrors.dateRetour}</span>
									{/if}
								</label>
							</div>
						</div>

						<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
							<h3 class="mb-3 text-lg font-semibold">{$t('ui.sections.optionsTitle')}</h3>
							{#if !$currentFormula}
								<p class="text-sm text-[var(--c-text2)]">
									{$t('ui.sections.optionsNeedFormula')}
								</p>
							{:else}
								<ul class="flex flex-col gap-3">
									{#each $currentFormula.options as option}
										<li
											class="flex items-center justify-between rounded-lg border border-[var(--c-border)] px-3 py-2"
										>
											<label class="flex items-center gap-2 text-sm">
												<input
													type="checkbox"
													checked={$selectedOptions.some((selected) => selected.id === option.id)}
													on:change={() => actions.toggleOption(option.id)}
												/>
												<span>{option.name}</span>
												<span class="text-xs text-[var(--c-text2)]">({option.type})</span>
											</label>
											<span class="text-sm font-semibold">{formatPrice(option.price)}</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>

					<aside class="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="text-lg font-semibold">{$t('ui.sections.summaryTitle')}</h3>
						<div class="text-sm">
							<p>{$t('ui.fields.formulaLabel')}: {$currentFormula?.nom ?? '—'}</p>
							<p class="mt-1">
								{$t('ui.fields.baseLabel')}: {formatPrice($currentFormula?.prix_base ?? 0)}
							</p>
						</div>
						<div>
							<h4 class="text-sm font-semibold">{$t('ui.sections.selectedOptionsTitle')}</h4>
							{#if $selectedOptions.length === 0}
								<p class="text-xs text-[var(--c-text2)]">{$t('ui.messages.noOptionsSelected')}</p>
							{:else}
								<ul class="mt-2 flex flex-col gap-2 text-sm">
									{#each $selectedOptions as option}
										<li class="flex items-center justify-between">
											<span>{option.name}</span>
											<span class="font-semibold">{formatPrice(option.price)}</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<div class="rounded-lg bg-[var(--c-bg)] p-3 text-sm font-semibold">
							{$participantsCount > 1
								? $t('ui.fields.totalEstimatedIndividual')
								: $t('ui.fields.totalEstimatedSingle')}
							:
							<span class="ml-auto">{formatPrice($totalPrice)}</span>
						</div>
						{#if $participantsCount > 1}
							<div class="rounded-lg bg-[var(--c-bg)] p-3 text-sm font-semibold">
								{$t('ui.fields.totalCollectiveEstimated')}: {formatPrice($totalPrice * $participantsCount)}
							</div>
						{/if}
					</aside>
				</div>
			{/if}

			{#if $stepIndex === 4}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.submitTitle')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.submitDescription')}</p>

				{#if $submissionStatus === 'success'}
					<div class="mb-4 rounded-[var(--radius)] border border-[var(--c-success)] bg-white p-4">
						<p class="text-sm font-semibold text-[var(--c-success)]">{$submissionMessage}</p>
						{#if data.isOffline}
							<p class="text-xs text-[var(--c-text2)]">
								{$t('ui.messages.offlineSummaryLogged')}
							</p>
						{/if}
					</div>
				{:else if $submissionStatus === 'error'}
					<div class="mb-4 rounded-[var(--radius)] border border-[var(--c-error)] bg-white p-4">
						<p class="text-sm font-semibold text-[var(--c-error)]">{$submissionMessage}</p>
					</div>
				{/if}

				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="mb-2 text-lg font-semibold">{$t('ui.sections.quoteSummaryTitle')}</h3>
						<ul class="text-sm text-[var(--c-text2)]">
							<li class="mr-2">
								<strong>{$t('ui.fields.circuitLabel')}:</strong> {$currentCircuit?.nom ?? '—'}
							</li>
							<li class="flex mr-2">
								<strong>{$t('ui.fields.formulaLabel')}:</strong>
								{$currentFormula?.nom ?? '—'}
								<span class="ml-auto">
									{formatPrice($currentFormula?.prix_base ?? 0) ?? '-'}
								</span>
							</li>
							<li class="mr-2">
								<strong>{$t('ui.fields.participantsLabel')}:</strong> {$participantsCount}
							</li>
							<li class="mr-2">
								<strong>{$t('ui.fields.departureLabel')}:</strong> {$dateDepart ?? '—'}
							</li>
							<li class="mr-2">
								<strong>{$t('ui.fields.returnLabel')}:</strong> {$dateRetour ?? '—'}
							</li>
						</ul>
						<div class="mt-3">
							<h4 class="text-sm font-semibold">{$t('ui.sections.optionsTitle')}</h4>
							{#if $selectedOptions.length === 0}
								<p class="text-xs text-[var(--c-text2)]">{$t('ui.messages.noOptions')}</p>
							{:else}
								<ul class="mt-2 flex flex-col gap-1 text-sm">
									{#each $selectedOptions as option}
										<li class="flex items-center justify-between">
											<span>{option.name}</span>
											<span>{formatPrice(option.price)}</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<div class="flex mt-3 text-sm font-semibold">
							{$participantsCount > 1
								? $t('ui.fields.totalEstimatedIndividual')
								: $t('ui.fields.totalEstimatedSingle')}
							:
							<span class="ml-auto">{formatPrice($totalPrice)}</span>
						</div>
						{#if $participantsCount > 1}
							<span class="flex mt-3 text-sm font-semibold">
								{$t('ui.fields.totalCollective')}: 
								<span class="ml-auto">{formatPrice($totalPrice * $participantsCount)}</span>
							</span>
						{/if}
					</div>

					<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="mb-2 text-lg font-semibold">{$t('ui.sections.contactTitle')}</h3>
						<ul class="text-sm text-[var(--c-text2)]">
							<li>
								<strong>{$t('ui.fields.firstNameLabel')}:</strong> {$lead.prenom || '—'}
							</li>
							<li>
								<strong>{$t('ui.fields.lastNameLabel')}:</strong> {$lead.nom || '—'}
							</li>
							<li>
								<strong>{$t('ui.fields.emailLabel')}:</strong> {$lead.email || '—'}
							</li>
							<li>
								<strong>{$t('ui.fields.phoneLabel')}:</strong> {$lead.telephone || '—'}
							</li>
						</ul>
					</div>
				</div>

				<div class="mt-4 flex items-center gap-3">
					<button
						type="button"
						class="rounded-full bg-[var(--c-accent)] px-5 py-2 text-sm font-semibold text-white"
						on:click={() => actions.submit()}
					>
						{$t('ui.actions.submit')}
					</button>
				</div>
			{/if}
		</section>
	</div>
</main>
