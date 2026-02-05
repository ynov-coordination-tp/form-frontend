<script lang="ts">
	import { onMount } from 'svelte';
	import BreadcrumbStepper from '$lib/components/BreadcrumbStepper.svelte';
	import LoaderDots from '$lib/components/LoaderDots.svelte';
	import { t } from '$lib/i18n';
	import { createApiClient } from '$lib/api/client';
	import {
	OptionTargetType,
	type Accommodation,
	type AccommodationPrice,
	type MotoCategoryPrice,
	type MotoLocation,
	type Option,
	type Tour,
	type TourFormula,
	type TourPrice
} from '$lib/api/types';

	const { client: apiClient, mode: apiMode } = createApiClient(fetch);
	const isOffline = apiMode === 'mock';

	let stepIndex = 0;
	let tours: Tour[] = [];
	let tourFormulas: TourFormula[] = [];
	let motoLocations: MotoLocation[] = [];
	let accommodations: Accommodation[] = [];
	let options: Option[] = [];
	let tourPrices: TourPrice[] = [];
	let motoCategoryPrices: MotoCategoryPrice[] = [];
	let accommodationPrices: AccommodationPrice[] = [];

	let loadingTours = false;
	let loadingFormulas = false;
	let loadingMotos = false;
	let loadingAccommodations = false;
	let loadingOptions = false;
	let loadingTourPrices = false;
	let loadingMotoCategoryPrices = false;
	let loadingAccommodationPrices = false;
	let motosLoaded = false;
	let accommodationsLoaded = false;
	let optionsLoaded = false;
	let tourPricesLoaded = false;
	let motoCategoryPricesLoaded = false;
	let accommodationPricesLoaded = false;

	let selectedTourId: number | null = null;
	let selectedTourFormulaId: number | null = null;
	let departureDate = '';
	let returnDate = '';
	let participantsCount = 1;
	let motoChoice: 'rent' | 'own' = 'rent';
	let selectedMotoLocationId: number | null = null;
	let selectedAccommodationId: number | null = null;
	let selectedOptionIds: number[] = [];

	let submissionStatus: 'idle' | 'sending' | 'success' | 'error' = 'idle';
	let submissionMessage = '';
	let selectedTour: Tour | null = null;
	let selectedTourFormula: TourFormula | null = null;
	let quoteItemOptions: Option[] = [];
	let selectedOptions: Option[] = [];
	let errors: {
		tour: string;
		formula: string;
		date: string;
		participants: string;
		moto: string;
	} = {
		tour: '',
		formula: '',
		date: '',
		participants: '',
		moto: ''
	};
	let stepStatuses: ('incomplete' | 'error' | 'valid')[] = [];
	let canSubmit = false;
	let totalEstimatedIndividual = 0;
	let totalEstimatedGroup = 0;
	let selectedTourBasePrice: number | null = null;
	let selectedMotoDailyPrice: number | null = null;
	let selectedAccommodationNightlyPrice: number | null = null;

	const formatPrice = (value: number) => `${value.toLocaleString('fr-FR')} €`;

	const formatOptionPrice = (value?: number) => {
		if (typeof value === 'number') {
			return formatPrice(value);
		}
		return $t('ui.fields.optionIncludedLabel');
	};

	const parseDate = (value: string) => new Date(`${value}T00:00:00`);
	const formatDate = (value: Date) => value.toISOString().slice(0, 10);
	const addDays = (date: Date, days: number) => {
		const copy = new Date(date.getTime());
		copy.setDate(copy.getDate() + days);
		return copy;
	};
	const parseId = (value: string): number | null => {
		if (!value) return null;
		const parsed = Number(value);
		return Number.isNaN(parsed) ? null : parsed;
	};

	const isPriceActiveForDate = (startDate: string, endDate: string, selectedDate?: string) => {
		if (!selectedDate) return true;
		return selectedDate >= startDate && selectedDate <= endDate;
	};

	const pickCurrentTourPrice = (prices: TourPrice[], selectedDate?: string) => {
		return prices.find((price) => isPriceActiveForDate(price.startDate, price.endDate, selectedDate));
	};

	const pickCurrentMotoPrice = (prices: MotoCategoryPrice[], categoryId: number, selectedDate?: string) => {
		return prices.find(
			(price) =>
				price.motoCategory.id === categoryId &&
				isPriceActiveForDate(price.startDate, price.endDate, selectedDate)
		);
	};

	const pickCurrentAccommodationPrice = (prices: AccommodationPrice[], accommodationId: number, selectedDate?: string) => {
		return prices.find(
			(price) =>
				price.accommodationId === accommodationId &&
				isPriceActiveForDate(price.startDate, price.endDate, selectedDate)
		);
	};

	onMount(() => {
		void loadTours();
	});

	const loadTours = async () => {
		loadingTours = true;
		try {
			tours = await apiClient.getTours();
		} finally {
			loadingTours = false;
		}
	};

	const loadTourFormulas = async (tourId: number) => {
		loadingFormulas = true;
		try {
			tourFormulas = await apiClient.getTourFormulasByTour(tourId);
		} finally {
			loadingFormulas = false;
		}
	};

	const loadMotos = async () => {
		loadingMotos = true;
		try {
			motoLocations = await apiClient.getMotoLocations();
			motosLoaded = true;
		} finally {
			loadingMotos = false;
		}
	};

	const loadAccommodations = async () => {
		loadingAccommodations = true;
		try {
			accommodations = await apiClient.getAccommodations();
			accommodationsLoaded = true;
		} finally {
			loadingAccommodations = false;
		}
	};

	const loadOptions = async () => {
		loadingOptions = true;
		try {
			options = await apiClient.getOptions();
			optionsLoaded = true;
		} finally {
			loadingOptions = false;
		}
	};

	const loadTourPrices = async (tourFormulaIds: number[]) => {
		if (tourFormulaIds.length === 0) {
				tourPricesLoaded = true;
			return;
		}

		loadingTourPrices = true;
		try {
			const pricesByFormula = await Promise.all(
				tourFormulaIds.map((tourFormulaId) => apiClient.getTourPricesByFormula(tourFormulaId))
			);
			tourPrices = pricesByFormula.flat();
			tourPricesLoaded = true;
		} finally {
			loadingTourPrices = false;
		}
	};

	const loadMotoCategoryPrices = async () => {
		loadingMotoCategoryPrices = true;
		try {
			motoCategoryPrices = await apiClient.getMotoCategoryPrices();
			motoCategoryPricesLoaded = true;
		} finally {
			loadingMotoCategoryPrices = false;
		}
	};

	const loadAccommodationPrices = async () => {
		loadingAccommodationPrices = true;
		try {
			accommodationPrices = await apiClient.getAccommodationPrices();
			accommodationPricesLoaded = true;
		} finally {
			loadingAccommodationPrices = false;
		}
	};

	const resetSelectionsAfterTour = () => {
		selectedTourFormulaId = null;
		tourFormulas = [];
		departureDate = '';
		returnDate = '';
		participantsCount = 1;
		selectedOptionIds = [];
		selectedMotoLocationId = null;
		selectedAccommodationId = null;
		motosLoaded = false;
		accommodationsLoaded = false;
		optionsLoaded = false;
		tourPricesLoaded = false;
		tourPrices = [];
		submissionStatus = 'idle';
		submissionMessage = '';
	};

	const handleTourChange = async (value: string) => {
		selectedTourId = parseId(value);
		resetSelectionsAfterTour();

		if (selectedTourId) {
			await loadTourFormulas(selectedTourId);
			const formulaIds = tourFormulas.map((formula) => formula.id);
			await loadTourPrices(formulaIds);
		}
	};

	const handleFormulaSelect = (id: number) => {
		selectedTourFormulaId = id;
		selectedOptionIds = [];
		selectedMotoLocationId = null;
		selectedAccommodationId = null;
		submissionStatus = 'idle';
		submissionMessage = '';
		const formula = tourFormulas.find((item) => item.id === id);
		if (formula?.formula.includesMoto) {
			motoChoice = 'rent';
		} else {
			motoChoice = 'own';
		}
	};

	const handleMotoChoice = (value: 'rent' | 'own') => {
		motoChoice = value;
		if (value === 'own') {
			selectedMotoLocationId = null;
		}
	};

	const toggleOption = (optionId: number) => {
		selectedOptionIds = selectedOptionIds.includes(optionId)
			? selectedOptionIds.filter((id) => id !== optionId)
			: [...selectedOptionIds, optionId];
	};

	const goToStep = (index: number) => {
		stepIndex = index;
	};

	const submitQuote = async () => {
		if (!canSubmit) {
			submissionStatus = 'error';
			submissionMessage = $t('ui.messages.submitBlocked');
			stepIndex = 5;
			return;
		}

		submissionStatus = 'sending';
		submissionMessage = '';

		const items = Array.from({ length: participantsCount }).map(() => ({
			motoLocationId: motoChoice === 'own' ? null : selectedMotoLocationId ?? undefined,
			accommodationId: selectedAccommodationId ?? undefined,
			options: selectedOptionIds.map((optionId) => ({ optionId, quantity: 1 }))
		}));

		try {
			await apiClient.createQuote({
				tourPackageId: selectedTourFormulaId ?? undefined,
				departureDate: departureDate || undefined,
				returnDate: returnDate || undefined,
				items
			});
			submissionStatus = 'success';
			submissionMessage = $t('ui.messages.submitSuccess');
		} catch (error) {
			console.error(error);
			submissionStatus = 'error';
			submissionMessage = $t('ui.messages.submitError');
		} finally {
			stepIndex = 5;
		}
	};

	$: selectedTour = tours.find((tour) => tour.id === selectedTourId) ?? null;
	$: selectedTourFormula = tourFormulas.find((formula) => formula.id === selectedTourFormulaId) ?? null;

	$: if (departureDate && selectedTour?.durationDays) {
		returnDate = formatDate(addDays(parseDate(departureDate), selectedTour.durationDays));
	} else {
		returnDate = '';
	}

	$: if (selectedTourFormula && !optionsLoaded && !loadingOptions) {
		void loadOptions();
	}

	$: if (
		selectedTourFormula?.formula.includesMoto &&
		!motosLoaded &&
		!loadingMotos
	) {
		void loadMotos();
	}

	$: if (
		selectedTourFormula?.formula.includesAccommodation &&
		!accommodationsLoaded &&
		!loadingAccommodations
	) {
		void loadAccommodations();
	}


	$: if (selectedTourFormula?.formula.includesMoto && !motoCategoryPricesLoaded && !loadingMotoCategoryPrices) {
		void loadMotoCategoryPrices();
	}

	$: if (
		selectedTourFormula?.formula.includesAccommodation &&
		!accommodationPricesLoaded &&
		!loadingAccommodationPrices
	) {
		void loadAccommodationPrices();
	}

	$: quoteItemOptions = options.filter((option) => option.targetType !== OptionTargetType.Quote);
	$: selectedOptions = quoteItemOptions.filter((option) => selectedOptionIds.includes(option.id));

	$: if (motoChoice === 'rent' && !selectedTourFormula?.formula.includesMoto) {
		motoChoice = 'own';
	}

	$: errors = {
		tour: selectedTourId ? '' : $t('ui.errors.selectCircuit'),
		formula: selectedTourFormulaId ? '' : $t('ui.errors.selectFormula'),
		date: departureDate ? '' : $t('ui.errors.dateDepartRequired'),
		participants: participantsCount >= 1 ? '' : $t('ui.errors.participantsMin'),
		moto:
			selectedTourFormula?.formula.includesMoto && motoChoice === 'rent' && !selectedMotoLocationId
				? $t('ui.errors.selectMoto')
				: ''
	};

	$: stepStatuses = [
		errors.tour ? 'incomplete' : 'valid',
		errors.formula ? 'incomplete' : 'valid',
		errors.date ? 'incomplete' : 'valid',
		errors.participants ? 'incomplete' : 'valid',
		errors.moto ? 'error' : 'valid',
		submissionStatus === 'success' ? 'valid' : 'incomplete'
	];

	$: canSubmit =
		!errors.tour &&
		!errors.formula &&
		!errors.date &&
		!errors.participants &&
		!errors.moto &&
		submissionStatus !== 'sending';

	$: selectedTourBasePrice = pickCurrentTourPrice(tourPrices, departureDate)?.basePrice ?? null;
	$: selectedMotoDailyPrice = (() => {
		if (motoChoice === 'own' || !selectedMotoLocationId) return null;
		const selectedMoto = motoLocations.find((moto) => moto.id === selectedMotoLocationId);
		if (!selectedMoto) return null;
		return pickCurrentMotoPrice(motoCategoryPrices, selectedMoto.motoCategory.id, departureDate)?.dailyPrice ?? null;
	})();
	$: selectedAccommodationNightlyPrice = (() => {
		if (!selectedAccommodationId) return null;
		return pickCurrentAccommodationPrice(accommodationPrices, selectedAccommodationId, departureDate)?.nightlyPrice ?? null;
	})();

	$: {
		const durationDays = selectedTour?.durationDays ?? 0;
		const totalOptionsPrice = selectedOptions.reduce((sum, option) => sum + (option.price ?? 0), 0);
		const motoTotal = (selectedMotoDailyPrice ?? 0) * durationDays;
		const accommodationTotal = (selectedAccommodationNightlyPrice ?? 0) * durationDays;
		totalEstimatedIndividual = (selectedTourBasePrice ?? 0) + totalOptionsPrice + motoTotal + accommodationTotal;
		totalEstimatedGroup = totalEstimatedIndividual * participantsCount;
	}

	let steps: { label: string; index: number }[] = [];
	$: steps = [
		{ label: $t('ui.step.tour'), index: 0 },
		{ label: $t('ui.step.formula'), index: 1 },
		{ label: $t('ui.step.dates'), index: 2 },
		{ label: $t('ui.step.participants'), index: 3 },
		{ label: $t('ui.step.options'), index: 4 },
		{ label: $t('ui.step.submit'), index: 5 }
	];
</script>

<svelte:head>
	<title>{$t('ui.quote.title')}</title>
</svelte:head>

<main class="min-h-screen bg-[var(--c-bg)] px-4 py-10">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-6">
		<header class="flex flex-col gap-3">
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--c-accent)]">
				Hellenic Riders
			</p>
			<h1 class="text-3xl font-bold text-[var(--c-text)]">{$t('ui.quote.heading')}</h1>
			{#if isOffline}
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
			currentStep={stepIndex}
			statuses={stepStatuses}
			ariaLabel={$t('ui.stepper.aria')}
			onStepClick={(index) => goToStep(index)}
		/>

		<section class="rounded-[var(--radius)] bg-white p-6 shadow-sm">
			{#if stepIndex === 0}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.circuitChoiceTitle')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.circuitChoiceDescription')}</p>
				<div class="flex flex-col gap-3">
					<label class="flex items-center gap-4 text-sm font-medium" for="tour-select">
						<span>{$t('ui.fields.circuitLabel')}</span>
						{#if loadingTours}
							<LoaderDots />
						{:else}
							<select
								id="tour-select"
								class="rounded-lg border border-[var(--c-border)] px-3 py-2"
								value={selectedTourId ?? ''}
								on:change={(event) => handleTourChange(event.currentTarget.value)}
							>
								<option value="">{$t('ui.fields.circuitPlaceholder')}</option>
								{#each tours as tour}
									<option value={tour.id}>{tour.name}</option>
								{/each}
							</select>
						{/if}
					</label>
					{#if selectedTour}
						<div class="rounded-lg border border-[var(--c-border)] bg-[var(--c-bg)] p-4">
							<p class="text-sm">
								{$t('ui.fields.durationLabel')}:
								<strong>{selectedTour.durationDays ?? '—'} {$t('ui.units.days')}</strong>
							</p>
							<p class="text-sm">
								{$t('ui.fields.countryLabel')}:
								<strong>{selectedTour.country}</strong>
							</p>
							{#if selectedTour.description}
								<p class="mt-2 text-xs text-[var(--c-text2)]">{selectedTour.description}</p>
							{/if}
						</div>
					{/if}
					{#if errors.tour}
						<p class="text-sm text-[var(--c-error)]">{errors.tour}</p>
					{/if}
				</div>
			{/if}

			{#if stepIndex === 1}
				<h2 class="mb-4 text-xl font-semibold">{$t('ui.sections.formulaTitle')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.formulaDescription')}</p>
				{#if !selectedTour}
					<p class="text-sm text-[var(--c-text2)]">{$t('ui.sections.formulaNeedCircuit')}</p>
				{:else if loadingFormulas}
					<LoaderDots />
				{:else}
					<div class="grid gap-4 md:grid-cols-2">
						{#each tourFormulas as formule}
							<button
								type="button"
								class={`flex flex-col gap-3 rounded-[var(--radius)] border p-4 text-left transition card ${
									selectedTourFormulaId === formule.id
										? 'card-selected border-[var(--c-accent)] bg-[var(--c-bg)]'
										: 'border-[var(--c-border)] bg-white'
								}`}
								on:click={() => handleFormulaSelect(formule.id)}
							>
								<div class="flex items-center justify-between">
									<h3 class="font-cinzel text-lg font-semibold text-[var(--light)]">{formule.formula.name}</h3>
									{#if pickCurrentTourPrice(tourPrices.filter((price) => price.tourFormula.id === formule.id), departureDate)?.basePrice}
										<span class="text-sm font-semibold text-[var(--light)]">
											{formatPrice(pickCurrentTourPrice(tourPrices.filter((price) => price.tourFormula.id === formule.id), departureDate)?.basePrice ?? 0)}
										</span>
									{/if}
								</div>
								<ul class="text-xs text-[var(--light)]/90">
									<li>
										{$t('ui.fields.includesMotoLabel')}: {formule.formula.includesMoto ? $t('ui.fields.yes') : $t('ui.fields.no')}
									</li>
									<li>
										{$t('ui.fields.includesAccommodationLabel')}: {formule.formula.includesAccommodation ? $t('ui.fields.yes') : $t('ui.fields.no')}
									</li>
									<li>
										{$t('ui.fields.includesMealsLabel')}: {formule.formula.includesMeals ? $t('ui.fields.yes') : $t('ui.fields.no')}
									</li>
								</ul>
							</button>
						{/each}
					</div>
				{/if}
				{#if errors.formula}
					<p class="mt-3 text-sm text-[var(--c-error)]">{errors.formula}</p>
				{/if}
			{/if}

			{#if stepIndex === 2}
				<h2 class="mb-4 text-xl font-semibold">3) {$t('ui.step.dates')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.datesDescription')}</p>
				<div class="grid gap-3 md:grid-cols-2">
					<label class="flex flex-col gap-1 text-sm">
						{$t('ui.fields.departureDateLabel')}
						<input
							type="date"
							class="rounded-lg border border-[var(--c-border)] px-3 py-2"
							disabled={!selectedTour}
							value={departureDate}
							on:input={(event) => (departureDate = event.currentTarget.value)}
						/>
						{#if errors.date}
							<span class="text-xs text-[var(--c-error)]">{errors.date}</span>
						{/if}
					</label>
					<label class="flex flex-col gap-1 text-sm">
						{$t('ui.fields.returnDateComputedLabel')}
						<input
							type="date"
							class="rounded-lg border border-[var(--c-border)] px-3 py-2"
							readonly
							disabled
							value={returnDate}
						/>
					</label>
				</div>
			{/if}

			{#if stepIndex === 3}
				<h2 class="mb-4 text-xl font-semibold">4) {$t('ui.step.participants')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.participantsDescription')}</p>
				<label class="flex items-center gap-4 text-sm font-medium" for="participants-count">
					<span>{$t('ui.fields.participantsCountLabel')}</span>
					<input
						id="participants-count"
						type="number"
						min="1"
						class="rounded-lg border border-[var(--c-border)] px-3 py-2"
						value={participantsCount}
						on:input={(event) => (participantsCount = Number(event.currentTarget.value))}
					/>
				</label>
				{#if errors.participants}
					<p class="mt-2 text-sm text-[var(--c-error)]">{errors.participants}</p>
				{/if}
			{/if}

			{#if stepIndex === 4}
				<h2 class="mb-4 text-xl font-semibold">5) {$t('ui.step.options')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.optionsDescription')}</p>
				{#if !selectedTourFormula}
					<p class="text-sm text-[var(--c-text2)]">{$t('ui.sections.optionsNeedFormula')}</p>
				{:else}
					<div class="grid gap-6 lg:grid-cols-[2fr,1fr]">
					<div class="flex flex-col gap-6">
						{#if selectedTourFormula?.formula.includesMoto}
							<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
								<h3 class="mb-3 text-lg font-semibold">{$t('ui.sections.motoTitle')}</h3>
								<div class="flex flex-col gap-2 text-sm">
									<label class="flex items-center gap-2">
										<input
											type="radio"
											name="moto-choice"
											checked={motoChoice === 'rent'}
											on:change={() => handleMotoChoice('rent')}
										/>
										{$t('ui.fields.motoRentLabel')}
									</label>
									<label class="flex items-center gap-2">
										<input
											type="radio"
											name="moto-choice"
											checked={motoChoice === 'own'}
											on:change={() => handleMotoChoice('own')}
										/>
										{$t('ui.fields.motoOwnLabel')}
									</label>
								</div>
								{#if motoChoice === 'rent'}
									{#if loadingMotos}
										<LoaderDots />
									{:else}
										<select
											class="mt-3 w-full rounded-lg border border-[var(--c-border)] px-3 py-2 text-sm"
											value={selectedMotoLocationId ?? ''}
											on:change={(event) =>
												(selectedMotoLocationId = parseId(event.currentTarget.value))
											}
										>
											<option value="">{$t('ui.fields.motoPlaceholder')}</option>
											{#each motoLocations as moto}
												<option value={moto.id}>
													{moto.motoCategory.name} • {moto.brand} {moto.model} ({moto.count})
												{#if pickCurrentMotoPrice(motoCategoryPrices, moto.motoCategory.id, departureDate)?.dailyPrice}
													 • {formatPrice(pickCurrentMotoPrice(motoCategoryPrices, moto.motoCategory.id, departureDate)?.dailyPrice ?? 0)}/jour
												{/if}
												</option>
											{/each}
										</select>
									{/if}
								{/if}
								{#if errors.moto}
									<p class="mt-2 text-xs text-[var(--c-error)]">{errors.moto}</p>
								{/if}
							</div>
						{/if}

						{#if selectedTourFormula?.formula.includesAccommodation}
							<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
								<h3 class="mb-3 text-lg font-semibold">{$t('ui.sections.accommodationTitle')}</h3>
								{#if loadingAccommodations}
									<LoaderDots />
								{:else}
									<select
										class="w-full rounded-lg border border-[var(--c-border)] px-3 py-2 text-sm"
										value={selectedAccommodationId ?? ''}
										on:change={(event) =>
											(selectedAccommodationId = parseId(event.currentTarget.value))
										}
									>
										<option value="">{$t('ui.fields.accommodationPlaceholder')}</option>
											{#each accommodations as accommodation}
												<option value={accommodation.id}>
													{accommodation.name}
													{accommodation.city ? ` • ${accommodation.city}` : ''}
													{#if pickCurrentAccommodationPrice(accommodationPrices, accommodation.id, departureDate)?.nightlyPrice}
														 • {formatPrice(pickCurrentAccommodationPrice(accommodationPrices, accommodation.id, departureDate)?.nightlyPrice ?? 0)}/nuit
													{/if}
												</option>
											{/each}
									</select>
								{/if}
							</div>
						{/if}

						<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
							<h3 class="mb-3 text-lg font-semibold">{$t('ui.sections.bonusTitle')}</h3>
							{#if loadingOptions}
								<LoaderDots />
							{:else}
								{#if quoteItemOptions.length === 0}
									<p class="text-sm text-[var(--c-text2)]">{$t('ui.messages.noOptions')}</p>
								{:else}
									<ul class="flex flex-col gap-3">
										{#each quoteItemOptions as option}
											<li
												class="flex items-center justify-between rounded-lg border border-[var(--c-border)] px-3 py-2"
											>
												<label class="flex items-center gap-2 text-sm">
													<input
														type="checkbox"
														checked={selectedOptionIds.includes(option.id)}
														on:change={() => toggleOption(option.id)}
													/>
													<span>{option.name}</span>
												</label>
												<span class="text-sm font-semibold">{formatOptionPrice(option.price)}</span>
											</li>
										{/each}
									</ul>
								{/if}
							{/if}
						</div>
					</div>

					<aside class="flex flex-col gap-4 rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="text-lg font-semibold">{$t('ui.sections.summaryTitle')}</h3>
						<div class="text-sm">
							<p>{$t('ui.fields.circuitLabel')}: {selectedTour?.name ?? '—'}</p>
							<p class="mt-1">{$t('ui.fields.formulaLabel')}: {selectedTourFormula?.formula.name ?? '—'}</p>
							<p class="mt-1">{$t('ui.fields.departureLabel')}: {departureDate || '—'}</p>
							<p class="mt-1">{$t('ui.fields.returnLabel')}: {returnDate || '—'}</p>
							<p class="mt-1">{$t('ui.fields.participantsLabel')}: {participantsCount}</p>
						</div>
						<div class="text-sm">
							<p>{$t('ui.fields.formulaPriceLabel')}: {selectedTourBasePrice !== null ? formatPrice(selectedTourBasePrice) : '—'}</p>
							<p class="mt-1">Moto: {selectedMotoDailyPrice !== null ? `${formatPrice(selectedMotoDailyPrice)} / jour` : '—'}</p>
							<p class="mt-1">Hébergement: {selectedAccommodationNightlyPrice !== null ? `${formatPrice(selectedAccommodationNightlyPrice)} / nuit` : '—'}</p>
						</div>
						<div>
							<h4 class="text-sm font-semibold">{$t('ui.sections.selectedOptionsTitle')}</h4>
							{#if selectedOptions.length === 0}
								<p class="text-xs text-[var(--c-text2)]">{$t('ui.messages.noOptionsSelected')}</p>
							{:else}
								<ul class="mt-2 flex flex-col gap-2 text-sm">
									{#each selectedOptions as option}
										<li class="flex items-center justify-between">
											<span>{option.name}</span>
											<span class="font-semibold">{formatOptionPrice(option.price)}</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
						<div class="rounded-lg bg-[var(--c-bg)] p-3 text-sm font-semibold">
							<p>{$t('ui.fields.totalEstimatedIndividual')}: <span class="ml-auto">{formatPrice(totalEstimatedIndividual)}</span></p>
									<p class="mt-2">{$t('ui.fields.totalCollectiveEstimated')}: <span class="ml-auto">{formatPrice(totalEstimatedGroup)}</span></p>
						</div>
					</aside>
					</div>
				{/if}
			{/if}

			{#if stepIndex === 5}
				<h2 class="mb-4 text-xl font-semibold">6) {$t('ui.step.submit')}</h2>
				<p class="mb-4 text-sm text-[var(--c-text2)]">{$t('ui.sections.submitDescription')}</p>

				{#if submissionStatus === 'success'}
					<div class="mb-4 rounded-[var(--radius)] border border-[var(--c-success)] bg-white p-4">
						<p class="text-sm font-semibold text-[var(--c-success)]">{submissionMessage}</p>
					</div>
				{:else if submissionStatus === 'error'}
					<div class="mb-4 rounded-[var(--radius)] border border-[var(--c-error)] bg-white p-4">
						<p class="text-sm font-semibold text-[var(--c-error)]">{submissionMessage}</p>
					</div>
				{/if}

				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="mb-2 text-lg font-semibold">{$t('ui.sections.quoteSummaryTitle')}</h3>
						<ul class="text-sm text-[var(--c-text2)]">
							<li>
								<strong>{$t('ui.fields.circuitLabel')}:</strong> {selectedTour?.name ?? '—'}
							</li>
							<li>
								<strong>{$t('ui.fields.formulaLabel')}:</strong> {selectedTourFormula?.formula.name ?? '—'}
							</li>
							<li>
								<strong>{$t('ui.fields.participantsLabel')}:</strong> {participantsCount}
							</li>
							<li>
								<strong>{$t('ui.fields.departureLabel')}:</strong> {departureDate || '—'}
							</li>
							<li>
								<strong>{$t('ui.fields.returnLabel')}:</strong> {returnDate || '—'}
							</li>
						</ul>
						<div class="mt-3">
							<h4 class="text-sm font-semibold">{$t('ui.sections.optionsTitle')}</h4>
							{#if selectedOptions.length === 0}
								<p class="text-xs text-[var(--c-text2)]">{$t('ui.messages.noOptions')}</p>
							{:else}
								<ul class="mt-2 flex flex-col gap-1 text-sm">
									{#each selectedOptions as option}
										<li class="flex items-center justify-between">
											<span>{option.name}</span>
											<span>{formatOptionPrice(option.price)}</span>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>

					<div class="rounded-[var(--radius)] border border-[var(--c-border)] p-4">
						<h3 class="mb-2 text-lg font-semibold">{$t('ui.sections.summaryTitle')}</h3>
						<p class="text-sm text-[var(--c-text2)]">{$t('ui.sections.submitReminder')}</p>
						<ul class="mt-3 text-sm text-[var(--c-text2)]">
							<li>
								<strong>{$t('ui.fields.motoSelectionLabel')}:</strong>
								{motoChoice === 'own' ? $t('ui.fields.motoOwnLabel') : $t('ui.fields.motoRentLabel')}
							</li>
							<li>
								<strong>{$t('ui.fields.accommodationLabel')}:</strong>
								{selectedAccommodationId
									? accommodations.find((acc) => acc.id === selectedAccommodationId)?.name
									: '—'}
							</li>
						</ul>
						<div class="mt-3 rounded-lg bg-[var(--c-bg)] p-3 text-sm font-semibold">
							<p>{$t('ui.fields.totalEstimatedIndividual')}: {formatPrice(totalEstimatedIndividual)}</p>
							<p class="mt-1">{$t('ui.fields.totalCollectiveEstimated')}: {formatPrice(totalEstimatedGroup)}</p>
						</div>
					</div>
				</div>

				<div class="mt-4 flex items-center gap-3">
					<button
						type="button"
						class="rounded-full bg-[var(--c-accent)] px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
						on:click={() => submitQuote()}
						disabled={!canSubmit}
					>
						{submissionStatus === 'sending' ? $t('ui.actions.submitSending') : $t('ui.actions.submit')}
					</button>
				</div>
			{/if}
		</section>
	</div>
</main>
