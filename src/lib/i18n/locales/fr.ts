// Dictionnaire français pour les textes d'interface (UI).
//
// Les clés restent plates ("ui.section.title") pour simplifier les recherches.
const fr = {
	// Libellés du stepper
	'ui.step.tour': 'Circuit',
	'ui.step.participants': 'Participants',
	'ui.step.formula': 'Formule',
	'ui.step.form': 'Formulaire',
	'ui.step.submit': 'Envoi',

	// Actions globales
	'ui.actions.next': 'Suivant',
	'ui.actions.back': 'Retour',
	'ui.actions.submit': 'Envoyer la demande',

	// Messages
	'ui.messages.submitBlocked':
		'Certains champs sont invalides. Corrigez les erreurs indiquées avant d’envoyer.',
	'ui.messages.offlineSuccess': 'Demande enregistrée localement (offline).',
	'ui.messages.submitSuccess': 'Demande envoyée avec succès.',
	'ui.messages.offlineSummaryLogged': 'Un récapitulatif a été loggué dans la console (mode offline).',
	'ui.messages.noOptionsSelected': 'Aucune option sélectionnée.',
	'ui.messages.noOptions': 'Aucune option.',

	// Erreurs
	'ui.errors.required': '{field} est requis.',
	'ui.errors.emailInvalid': 'Email invalide (doit contenir @).',
	'ui.errors.phoneInvalid': 'Le téléphone est requis.',
	'ui.errors.selectCircuit': 'Merci de choisir un circuit.',
	'ui.errors.selectFormula': 'Merci de sélectionner une formule.',
	'ui.errors.participantsMin': 'Le nombre de participants doit être au moins 1.',
	'ui.errors.participantsMax': 'Maximum disponible: {count} participants.',
	'ui.errors.dateDepartRequired': 'La date de départ est requise.',
	'ui.errors.dateReturnMissing': 'La date de retour est manquante.',

	// Page d'accueil
	'ui.home.heading': 'Formulaire de devis',
	'ui.home.description': 'Réalisez une demande de devis en suivant le lien ci-dessous.',
	'ui.home.cta': 'Faire ma demande',

	// En-tête de la page de devis
	'ui.quote.title': 'Hellenic Riders — Demande de devis',
	'ui.quote.heading': 'Demande de devis',
	'ui.quote.offlineMode': 'Mode offline',
	'ui.quote.mockCatalog': 'catalog mock',

	// Stepper/aria
	'ui.stepper.aria': 'Étapes',
	'ui.languageSelect.aria': 'Langue',

	// Sections et libellés
	'ui.sections.circuitChoiceTitle': '1) Choix du circuit',
	'ui.sections.circuitChoiceDescription':
		'Sélectionnez le circuit principal. Les formules disponibles dépendent du circuit choisi.',
	'ui.fields.circuitLabel': 'Circuit',
	'ui.fields.circuitPlaceholder': 'Choisir un circuit',
	'ui.fields.durationLabel': 'Durée',
	'ui.fields.distanceLabel': 'Distance',

	'ui.sections.formulaTitle': '2) Formule',
	'ui.sections.formulaDescription': 'Veuillez choisir parmi les formules disponibles.',
	'ui.sections.formulaNeedCircuit':
		"Sélectionnez d'abord un circuit pour voir les formules disponibles.",
	'ui.fields.basePriceLabel': 'Base',
	'ui.fields.remainingSeatsLabel': 'Places restantes',

	'ui.sections.participantsTitle': '3) Participants',
	'ui.sections.participantsDescription':
		'Indiquez le nombre total de participants. Le maximum dépend des places restantes sur la formule.',
	'ui.fields.participantsCountLabel': 'Nombre de participants',

	'ui.sections.infoOptionsTitle': '4) Informations & options',
	'ui.sections.contactTitle': 'Contact principal',
	'ui.fields.firstNameLabel': 'Prénom',
	'ui.fields.lastNameLabel': 'Nom',
	'ui.fields.emailLabel': 'Email',
	'ui.fields.phoneLabel': 'Téléphone',

	'ui.sections.datesTitle': 'Dates',
	'ui.fields.departureDateLabel': 'Date de départ',
	'ui.fields.returnDateComputedLabel': 'Date de retour (calculée)',

	'ui.sections.optionsTitle': 'Options',
	'ui.sections.optionsNeedFormula':
		'Sélectionnez une formule pour afficher les options disponibles.',

	'ui.sections.summaryTitle': 'Récapitulatif',
	'ui.fields.formulaLabel': 'Formule',
	'ui.fields.baseLabel': 'Base',
	'ui.sections.selectedOptionsTitle': 'Options sélectionnées',
	'ui.fields.totalEstimatedSingle': 'Total estimé',
	'ui.fields.totalEstimatedIndividual': 'Total individuel estimé',
	'ui.fields.totalCollectiveEstimated': 'Total collectif estimé',

	'ui.sections.submitTitle': '5) Envoi',
	'ui.sections.submitDescription': 'Vérifiez le récapitulatif puis envoyez votre demande.',
	'ui.sections.quoteSummaryTitle': 'Votre devis',
	'ui.fields.participantsLabel': 'Participants',
	'ui.fields.departureLabel': 'Départ',
	'ui.fields.returnLabel': 'Retour',
	'ui.fields.totalCollective': 'Total collectif',

	// Unités
	'ui.units.days': 'jours',
	'ui.units.kilometers': 'km'
} as const;

export default fr;
