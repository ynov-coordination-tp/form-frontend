import { derived, get, writable } from 'svelte/store';
import type {Catalog, CatalogCircuit, CatalogFormula, CatalogOption} from "$lib/services/catalogService.js";

export type LeadInfo = {
	prenom: string;
	nom: string;
	email: string;
	telephone: string;
};

export type QuoteWizardOptions = {
	isOffline: boolean;
};

export type QuoteWizardStepStatus = 'incomplete' | 'error' | 'valid';

const DEFAULT_MAX_PARTICIPANTS = 10;

const EMPTY_LEAD: LeadInfo = {
	prenom: '',
	nom: '',
	email: '',
	telephone: ''
};

const STEP_LABELS = ['Tour', 'Participants', 'Formule', 'Formulaire', 'Envoi'];

const createEmptyTouched = (): Record<string, boolean> => ({
	circuitId: false,
	formulaId: false,
	participantsCount: false,
	leadPrenom: false,
	leadNom: false,
	leadEmail: false,
	leadTelephone: false,
	dateDepart: false
});

const normalizeDate = (value?: string | null): string | null => {
	if (!value) return null;
	return value;
};

const parseDate = (value: string): Date => new Date(`${value}T00:00:00`);

const formatDate = (value: Date): string => value.toISOString().slice(0, 10);

const addDays = (date: Date, days: number): Date => {
	const copy = new Date(date.getTime());
	copy.setDate(copy.getDate() + days);
	return copy;
};

const calculateReturnDate = (depart: string | null, duration: number | null): string | null => {
	if (!depart || !duration) return null;
	return formatDate(addDays(parseDate(depart), duration));
};

const computePlacesRestantes = (formula: CatalogFormula | null): number => {
	if (!formula) return DEFAULT_MAX_PARTICIPANTS;
	if (typeof formula.maxParticipant === 'number' && typeof formula.currParticipant === 'number') {
		return Math.max(formula.maxParticipant - formula.currParticipant, 0);
	}
	return DEFAULT_MAX_PARTICIPANTS;
};

export function createQuoteWizard(catalog: Catalog, options: QuoteWizardOptions) {
	const stepIndex = writable(0);
	const selectedCircuitId = writable<string>('');
	const selectedFormulaId = writable<string>('');
	const participantsCount = writable<number>(1);
	const lead = writable<LeadInfo>({ ...EMPTY_LEAD });
	const dateDepart = writable<string | null>(null);
	const selectedOptionIds = writable<string[]>([]);
	const touched = writable<Record<string, boolean>>(createEmptyTouched());
	const submissionStatus = writable<'idle' | 'success' | 'error'>('idle');
	const submissionMessage = writable<string>('');
	const hasSubmitted = writable(false);

	const circuits: CatalogCircuit[] = catalog.circuits ?? [];

	const currentCircuit = derived(selectedCircuitId, ($selectedCircuitId): CatalogCircuit | null => {
		return circuits.find((circuit) => circuit.id === $selectedCircuitId) ?? null;
	});

	const currentFormula = derived(
		[selectedFormulaId, currentCircuit],
		([$selectedFormulaId, $currentCircuit]): CatalogFormula | null => {
			if (!$currentCircuit) return null;
			return $currentCircuit.formules.find((formula) => formula.id === $selectedFormulaId) ?? null;
		}
	);

	const placesRestantes = derived(currentFormula, ($currentFormula) => computePlacesRestantes($currentFormula));

	const datesLocked = derived(currentFormula, ($currentFormula) => {
		return Boolean($currentFormula?.startDate && $currentFormula?.endDate);
	});

	const dateRetour = derived(
		[currentFormula, currentCircuit, dateDepart],
		([$currentFormula, $currentCircuit, $dateDepart]) => {
			if ($currentFormula?.startDate && $currentFormula?.endDate) {
				return normalizeDate($currentFormula.endDate);
			}
			return calculateReturnDate($dateDepart, $currentCircuit?.duree_jours ?? null);
		}
	);

	const selectedOptions = derived(
		[currentFormula, selectedOptionIds],
		([$currentFormula, $selectedOptionIds]): CatalogOption[] => {
			if (!$currentFormula) return [];
			return $currentFormula.options.filter((option) => $selectedOptionIds.includes(option.id));
		}
	);

	const totalPrice = derived([currentFormula, selectedOptions], ([$currentFormula, $selectedOptions]) => {
		const basePrice = $currentFormula?.prix_base ?? 0;
		const optionsTotal = $selectedOptions.reduce((sum, option) => sum + option.price, 0);
		return basePrice + optionsTotal;
	});

	const rawErrors = derived(
		[selectedCircuitId, selectedFormulaId, participantsCount, lead, dateDepart, dateRetour, placesRestantes],
		([
			$selectedCircuitId,
			$selectedFormulaId,
			$participantsCount,
			$lead,
			$dateDepart,
			$dateRetour,
			$placesRestantes
		]) => {
			const errors: Record<string, string> = {};

			if (!$selectedCircuitId) {
				errors.circuitId = 'Merci de choisir un circuit.';
			}

			if (!$selectedFormulaId) {
				errors.formulaId = 'Merci de sélectionner une formule.';
			}

			if (!$participantsCount || $participantsCount < 1) {
				errors.participantsCount = 'Le nombre de participants doit être au moins 1.';
			}

			if ($participantsCount > $placesRestantes) {
				errors.participantsCount = `Maximum disponible: ${$placesRestantes} participants.`;
			}

			if (!$lead.prenom.trim()) {
				errors.leadPrenom = 'Le prénom est requis.';
			}

			if (!$lead.nom.trim()) {
				errors.leadNom = 'Le nom est requis.';
			}

			if (!$lead.email.includes('@')) {
				errors.leadEmail = 'Email invalide (doit contenir @).';
			}

			if (!$lead.telephone.trim()) {
				errors.leadTelephone = 'Le téléphone est requis.';
			}

			if (!$dateDepart) {
				errors.dateDepart = 'La date de départ est requise.';
			}

			if (!$dateRetour) {
				errors.dateRetour = 'La date de retour est manquante.';
			}

			return errors;
		}
	);

	const visibleErrors = derived([rawErrors, touched, hasSubmitted], ([$rawErrors, $touched, $hasSubmitted]) => {
		if ($hasSubmitted) return $rawErrors;

		return Object.fromEntries(
			Object.entries($rawErrors).filter(([key]) => {
				return Boolean($touched[key]);
			})
		);
	});

	const stepStatuses = derived(
		[rawErrors, visibleErrors, selectedCircuitId, selectedFormulaId, participantsCount, lead, dateDepart, dateRetour, hasSubmitted],
		([
			$rawErrors,
			$visibleErrors,
			$selectedCircuitId,
			$selectedFormulaId,
			$participantsCount,
			$lead,
			$dateDepart,
			$dateRetour,
			$hasSubmitted
		]) => {
			const statuses: QuoteWizardStepStatus[] = [];

			const stepCompletion = [
				Boolean($selectedCircuitId),
				$participantsCount >= 1,
				Boolean($selectedFormulaId),
				Boolean($lead.prenom.trim() && $lead.nom.trim() && $lead.email.includes('@') && $lead.telephone.trim() && $dateDepart && $dateRetour),
				true
			];

			const stepErrors: Record<number, boolean> = {
				0: Boolean($visibleErrors.circuitId),
				1: Boolean($visibleErrors.participantsCount),
				2: Boolean($visibleErrors.formulaId),
				3:
					Boolean(
						$visibleErrors.leadPrenom ||
							$visibleErrors.leadNom ||
							$visibleErrors.leadEmail ||
							$visibleErrors.leadTelephone ||
							$visibleErrors.dateDepart ||
							$visibleErrors.dateRetour
					),
				4: $hasSubmitted && Object.keys($rawErrors).length > 0
			};

			STEP_LABELS.forEach((_, index) => {
				if (stepErrors[index]) {
					statuses[index] = 'error';
					return;
				}

				if (stepCompletion[index]) {
					statuses[index] = 'valid';
					return;
				}

				statuses[index] = 'incomplete';
			});

			return statuses;
		}
	);

	const touchField = (key: keyof ReturnType<typeof createEmptyTouched>) => {
		touched.update((current) => ({ ...current, [key]: true }));
	};

	const setCircuit = (id: string) => {
		selectedCircuitId.set(id);
		selectedFormulaId.set('');
		selectedOptionIds.set([]);
		dateDepart.set(null);
		submissionStatus.set('idle');
		submissionMessage.set('');
		touchField('circuitId');
	};

	const setFormula = (id: string) => {
		selectedFormulaId.set(id);
		selectedOptionIds.set([]);
		submissionStatus.set('idle');
		submissionMessage.set('');
		touchField('formulaId');

		const formula = get(currentFormula);
		if (formula?.startDate && formula.endDate) {
			dateDepart.set(formula.startDate);
		}

		const max = computePlacesRestantes(formula ?? null);
		participantsCount.update((count) => Math.min(count, max || DEFAULT_MAX_PARTICIPANTS));
	};

	const setParticipantsCount = (value: number) => {
		participantsCount.set(value);
		touchField('participantsCount');
	};

	const updateLeadField = (field: keyof LeadInfo, value: string) => {
		lead.update((current) => ({ ...current, [field]: value }));
		const keyMap: Record<keyof LeadInfo, keyof ReturnType<typeof createEmptyTouched>> = {
			prenom: 'leadPrenom',
			nom: 'leadNom',
			email: 'leadEmail',
			telephone: 'leadTelephone'
		};
		touchField(keyMap[field]);
	};

	const setDateDepart = (value: string) => {
		dateDepart.set(value);
		touchField('dateDepart');
	};

	const toggleOption = (id: string) => {
		selectedOptionIds.update((current) =>
			current.includes(id) ? current.filter((optionId) => optionId !== id) : [...current, id]
		);
	};

	const goToStep = (index: number) => {
		stepIndex.set(index);
	};

	const submit = () => {
		hasSubmitted.set(true);

		const errors = get(rawErrors);
		if (Object.keys(errors).length > 0) {
			submissionStatus.set('error');
			submissionMessage.set(
				'Certains champs sont invalides. Corrigez les erreurs indiquées avant d’envoyer.'
			);
			stepIndex.set(4);
			return { ok: false, errors };
		}

		const summary = buildSummary();

		if (options.isOffline) {
			console.log('[offline quote]', summary);
			submissionStatus.set('success');
			submissionMessage.set('Demande enregistrée localement (offline).');
			return { ok: true, summary };
		}

		// TODO: brancher l'API quand elle sera disponible.
		console.log('[online quote placeholder]', summary);
		submissionStatus.set('success');
		submissionMessage.set('Demande envoyée avec succès.');
		return { ok: true, summary };
	};

	const buildSummary = () => {
		const circuit = get(currentCircuit);
		const formula = get(currentFormula);
		const optionsSelected = get(selectedOptions);
		const depart = get(dateDepart);
		const retour = get(dateRetour);
		const total = get(totalPrice);
		const participants = get(participantsCount);
		const leadInfo = get(lead);

		return {
			circuit,
			formule: formula,
			options: optionsSelected,
			total,
			participants,
			dates: {
				depart,
				retour
			},
			lead: leadInfo
		};
	};

	return {
		state: {
			stepIndex,
			selectedCircuitId,
			selectedFormulaId,
			participantsCount,
			lead,
			dateDepart,
			selectedOptionIds,
			touched,
			submissionStatus,
			submissionMessage,
			hasSubmitted
		},
		derived: {
			circuits,
			currentCircuit,
			currentFormula,
			placesRestantes,
			datesLocked,
			dateRetour,
			selectedOptions,
			totalPrice,
			rawErrors,
			visibleErrors,
			stepStatuses
		},
		actions: {
			setCircuit,
			setFormula,
			setParticipantsCount,
			updateLeadField,
			setDateDepart,
			toggleOption,
			goToStep,
			submit
		}
	};
}
