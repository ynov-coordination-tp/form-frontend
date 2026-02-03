// English UI dictionary.
//
// We keep keys flat ("ui.section.title") to make lookups simple and avoid
// deeply nested objects for beginners.
const en = {
	// Stepper labels
	'ui.step.tour': 'Tour',
	'ui.step.participants': 'Participants',
	'ui.step.formula': 'Formula',
	'ui.step.form': 'Form',
	'ui.step.submit': 'Submit',

	// Global actions
	'ui.actions.next': 'Next',
	'ui.actions.back': 'Back',
	'ui.actions.submit': 'Submit request',

	// Messages
	'ui.messages.submitBlocked':
		'Some fields are invalid. Please fix the highlighted errors before submitting.',
	'ui.messages.offlineSuccess': 'Request saved locally (offline).',
	'ui.messages.submitSuccess': 'Request sent successfully.',
	'ui.messages.offlineSummaryLogged': 'A summary has been logged in the console (offline mode).',
	'ui.messages.noOptionsSelected': 'No options selected.',
	'ui.messages.noOptions': 'No options.',

	// Errors
	'ui.errors.required': '{field} is required.',
	'ui.errors.emailInvalid': 'Invalid email address (must contain @).',
	'ui.errors.phoneInvalid': 'Phone number is required.',
	'ui.errors.selectCircuit': 'Please choose a tour.',
	'ui.errors.selectFormula': 'Please select a formula.',
	'ui.errors.participantsMin': 'The number of participants must be at least 1.',
	'ui.errors.participantsMax': 'Maximum available: {count} participants.',
	'ui.errors.dateDepartRequired': 'Departure date is required.',
	'ui.errors.dateReturnMissing': 'Return date is missing.',

	// Home page
	'ui.home.heading': 'Quote request form',
	'ui.home.description': 'Submit a quote request by following the link below.',
	'ui.home.cta': 'Start my request',

	// Quote page header
	'ui.quote.title': 'Hellenic Riders — Quote request',
	'ui.quote.heading': 'Quote request',
	'ui.quote.offlineMode': 'Offline mode',
	'ui.quote.mockCatalog': 'mock catalog',

	// Stepper/aria
	'ui.stepper.aria': 'Steps',
	'ui.languageSelect.aria': 'Language',

	// Sections and labels
	'ui.sections.circuitChoiceTitle': '1) Choose a tour',
	'ui.sections.circuitChoiceDescription':
		'Select the main tour. Available formulas depend on the selected tour.',
	'ui.fields.circuitLabel': 'Tour',
	'ui.fields.circuitPlaceholder': 'Choose a tour',
	'ui.fields.durationLabel': 'Duration',
	'ui.fields.distanceLabel': 'Distance',

	'ui.sections.formulaTitle': '2) Formula',
	'ui.sections.formulaDescription': 'Please choose from the available formulas.',
	'ui.sections.formulaNeedCircuit': 'Select a tour first to see the available formulas.',
	'ui.fields.basePriceLabel': 'Base',
	'ui.fields.remainingSeatsLabel': 'Remaining spots',

	'ui.sections.participantsTitle': '3) Participants',
	'ui.sections.participantsDescription':
		'Enter the total number of participants. The maximum depends on remaining spots for the formula.',
	'ui.fields.participantsCountLabel': 'Number of participants',

	'ui.sections.infoOptionsTitle': '4) Information & options',
	'ui.sections.contactTitle': 'Main contact',
	'ui.fields.firstNameLabel': 'First name',
	'ui.fields.lastNameLabel': 'Last name',
	'ui.fields.emailLabel': 'Email',
	'ui.fields.phoneLabel': 'Phone',

	'ui.sections.datesTitle': 'Dates',
	'ui.fields.departureDateLabel': 'Departure date',
	'ui.fields.returnDateComputedLabel': 'Return date (calculated)',

	'ui.sections.optionsTitle': 'Options',
	'ui.sections.optionsNeedFormula': 'Select a formula to display the available options.',

	'ui.sections.summaryTitle': 'Summary',
	'ui.fields.formulaLabel': 'Formula',
	'ui.fields.baseLabel': 'Base',
	'ui.sections.selectedOptionsTitle': 'Selected options',
	'ui.fields.totalEstimatedSingle': 'Estimated total',
	'ui.fields.totalEstimatedIndividual': 'Estimated individual total',
	'ui.fields.totalCollectiveEstimated': 'Estimated group total',

	'ui.sections.submitTitle': '5) Submit',
	'ui.sections.submitDescription': 'Review the summary and send your request.',
	'ui.sections.quoteSummaryTitle': 'Your quote',
	'ui.fields.participantsLabel': 'Participants',
	'ui.fields.departureLabel': 'Departure',
	'ui.fields.returnLabel': 'Return',
	'ui.fields.totalCollective': 'Group total',

	// Units
	'ui.units.days': 'days',
	'ui.units.kilometers': 'km'
} as const;

export default en;
