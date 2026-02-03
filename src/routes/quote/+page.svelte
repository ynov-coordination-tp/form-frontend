<script lang="ts">
	import BreadcrumbStepper from '$lib/components/BreadcrumbStepper.svelte';
	import { createQuoteWizard } from '$lib/services/quoteWizard.js';
	import type { PageData } from "../../../.svelte-kit/types/src/routes/quote/$types.js";

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

	const steps = [
		{ label: 'Tour', index: 0 },
		{ label: 'Participants', index: 1 },
		{ label: 'Formule', index: 2 },
		{ label: 'Formulaire', index: 3 },
		{ label: 'Envoi', index: 4 }
	];

	const fallbackMaxParticipants = 10;

	const formatPrice = (value: number) => `${value.toLocaleString('fr-FR')} €`;
</script>

<svelte:head>
	<title>Hellenic Riders — Demande de devis</title>
</svelte:head>

<main class="min-h-screen bg-[var(--c-bg)] px-4 py-10">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
		<header class="flex flex-col gap-3">
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--c-accent)]">
				Hellenic Riders
			</p>
			<h1 class="text-3xl font-bold text-[var(--c-text)]">
				Demande de devis
			</h1>
			{#if data.isOffline}
				<div
					class="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--c-warning)]"
				>
					<span>Mode offline</span>
					<span aria-hidden="true">•</span>
					<span>catalog mock</span>
				</div>
			{/if}
		</header>

		<BreadcrumbStepper
			{steps}
			currentStep={$stepIndex}
			statuses={$stepStatuses}
			onStepClick={(index) => actions.goToStep(index)}
		/>

		<section class="rounded-[var(--radius)] bg-white p-6 shadow-sm">
			{#if $stepIndex === 0}
				<h2 class="mb-4 text-xl font-semibold">1) Choix du circuit</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					Sélectionnez le circuit principal. Les formules disponibles dépendent du circuit choisi.
				</p>
				<div class="flex flex-col gap-3">
					<label class="flex items-center gap-4 text-sm font-medium" for="circuit-select">
						<span>Circuit</span>
						<select
							id="circuit-select"
							class="rounded-lg border border-[var(--c-border)] px-3 py-2"
							value={$selectedCircuitId}
							on:change={(event) => actions.setCircuit(event.currentTarget.value)}
						>
							<option value="">Choisir un circuit</option>
							{#each circuits as circuit}
								<option value={circuit.id}>{circuit.nom}</option>
							{/each}
						</select>
					</label>
					{#if $currentCircuit}
						<div class="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)] p-4">
							<p class="text-sm">
								Durée: <strong>{$currentCircuit.duree_jours} jours</strong>
							</p>
							<p class="text-sm">
								Distance: <strong>{$currentCircuit.distance_km} km</strong>
							</p>
						</div>
					{/if}
					{#if $visibleErrors.circuitId}
						<p class="text-sm text-[var(--c-error)]">{$visibleErrors.circuitId}</p>
					{/if}
				</div>
			{/if}

			{#if $stepIndex === 1}
				<h2 class="mb-4 text-xl font-semibold">2) Participants</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					Indiquez le nombre total de participants. Le maximum dépend des places restantes sur la formule.
				</p>
				<div class="flex flex-col gap-3">
					<label class="flex items-center gap-4 text-sm font-medium" for="participants-count">
						<span>Nombre de participants</span>
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
							Places restantes: {$placesRestantes}
						</p>
						{/if}
					</label>

					{#if $visibleErrors.participantsCount}
						<p class="text-sm text-[var(--c-error)]">{$visibleErrors.participantsCount}</p>
					{/if}
				</div>
			{/if}

			{#if $stepIndex === 2}
				<h2 class="mb-4 text-xl font-semibold">3) Formule</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					Veuillez choisir parmi les formules disponibles.
				</p>
				{#if !$currentCircuit}
					<p class="text-sm text-[var(--c-text2)]">
						Sélectionnez d'abord un circuit pour voir les formules disponibles.
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
								<p class="text-sm opacity-95">Base: {formatPrice(formule.prix_base)}</p>
								<p class="text-xs opacity-95">
									Places restantes:{' '}
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

			{#if $stepIndex === 3}
				<h2 class="mb-4 text-xl font-semibold">4) Informations & options</h2>
				<div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
					<div class="flex flex-col gap-6">
						<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
							<h3 class="mb-3 text-lg font-semibold">Contact principal</h3>
							<div class="grid gap-3 md:grid-cols-2">
								<label class="flex flex-col gap-1 text-sm">
									Prénom
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
									Nom
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
									Email
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
									Téléphone
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
							<h3 class="mb-3 text-lg font-semibold">Dates</h3>
							<div class="grid gap-3 md:grid-cols-2">
								<label class="flex flex-col gap-1 text-sm">
									Date de départ
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
									Date de retour (calculée)
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
							<h3 class="mb-3 text-lg font-semibold">Options</h3>
							{#if !$currentFormula}
								<p class="text-sm text-[var(--c-text2)]">
									Sélectionnez une formule pour afficher les options disponibles.
								</p>
							{:else}
								<ul class="flex flex-col gap-3">
									{#each $currentFormula.options as option}
										<li class="flex items-center justify-between rounded-lg border border-[var(--c-border)] px-3 py-2">
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
						<h3 class="text-lg font-semibold">Récapitulatif</h3>
						<div class="text-sm">
							<p>Formule: {$currentFormula?.nom ?? '—'}</p>
							<p class="mt-1">Base: {formatPrice($currentFormula?.prix_base ?? 0)}</p>
						</div>
						<div>
							<h4 class="text-sm font-semibold">Options sélectionnées</h4>
							{#if $selectedOptions.length === 0}
								<p class="text-xs text-[var(--c-text2)]">Aucune option sélectionnée.</p>
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
							Total estimé: {formatPrice($totalPrice)}
						</div>
					</aside>
				</div>
			{/if}

			{#if $stepIndex === 4}
				<h2 class="mb-4 text-xl font-semibold">5) Envoi</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">
					Vérifiez le récapitulatif puis envoyez votre demande.
				</p>

			{#if $submissionStatus === 'success'}
				<div class="mb-4 rounded-[var(--radius)] border border-[var(--c-success)] bg-white p-4">
					<p class="text-sm font-semibold text-[var(--c-success)]">{$submissionMessage}</p>
					{#if data.isOffline}
						<p class="text-xs text-[var(--c-text2)]">
							Un récapitulatif a été loggué dans la console (mode offline).
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
						<h3 class="mb-2 text-lg font-semibold">Votre devis</h3>
						<ul class="text-sm text-[var(--c-text2)]">
							<li class="mr-2"><strong>Circuit:</strong> {$currentCircuit?.nom ?? '—'}</li>
							<li class="flex mr-2"><strong>Formule:</strong> {$currentFormula?.nom ?? '—'} <span class="ml-auto">{formatPrice($currentFormula?.prix_base ?? 0) ?? '-'}</span></li>
							<li class="mr-2"><strong>Participants:</strong> {$participantsCount}</li>
							<li class="mr-2"><strong>Départ:</strong> {$dateDepart ?? '—'}</li>
							<li class="mr-2"><strong>Retour:</strong> {$dateRetour ?? '—'}</li>
						</ul>
						<div class="mt-3">
							<h4 class="text-sm font-semibold">Options</h4>
							{#if $selectedOptions.length === 0}
								<p class="text-xs text-[var(--c-text2)]">Aucune option.</p>
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
						<span class="flex mt-3 text-sm font-semibold">Total: <span class="ml-auto">{formatPrice($totalPrice)}</span></span>
					</div>

					<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="mb-2 text-lg font-semibold">Contact principal</h3>
						<ul class="text-sm text-[var(--c-text2)]">
							<li><strong>Prénom:</strong> {$lead.prenom || '—'}</li>
							<li><strong>Nom:</strong> {$lead.nom || '—'}</li>
							<li><strong>Email:</strong> {$lead.email || '—'}</li>
							<li><strong>Téléphone:</strong> {$lead.telephone || '—'}</li>
						</ul>
					</div>
				</div>

				<div class="mt-4 flex items-center gap-3">
					<button
						type="button"
						class="rounded-full bg-[var(--c-accent)] px-5 py-2 text-sm font-semibold text-white"
						on:click={() => actions.submit()}
					>
						Envoyer la demande
					</button>
				</div>
			{/if}
		</section>
	</div>
</main>
