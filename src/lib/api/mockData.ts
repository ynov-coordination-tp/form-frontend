import {
	AccommodationType,
	OptionTargetType,
	type Accommodation,
	type MotoLocation,
	type Option,
	type Tour,
	type TourFormula
} from '$lib/api/types';

export const tours: Tour[] = [
	{
		id: 1,
		name: 'Péloponnèse Authentique',
		country: 'Grèce',
		durationDays: 7,
		description: 'Un road trip entre mer Égée et villages byzantins.'
	},
	{
		id: 2,
		name: 'Cyclades & Volcans',
		country: 'Grèce',
		durationDays: 10,
		description: 'Îles emblématiques et routes panoramiques.'
	}
];

export const tourFormulas: TourFormula[] = [
	{
		id: 101,
		tour: tours[0],
		formula: {
			id: 11,
			name: 'Évasion Libre',
			includesMoto: true,
			includesAccommodation: false,
			includesMeals: false
		},
		isActive: true
	},
	{
		id: 102,
		tour: tours[0],
		formula: {
			id: 12,
			name: 'Signature Héritage',
			includesMoto: true,
			includesAccommodation: true,
			includesMeals: true
		},
		isActive: true
	},
	{
		id: 201,
		tour: tours[1],
		formula: {
			id: 21,
			name: 'Cyclades Essentiel',
			includesMoto: false,
			includesAccommodation: true,
			includesMeals: false
		},
		isActive: true
	},
	{
		id: 202,
		tour: tours[1],
		formula: {
			id: 22,
			name: 'Grand Horizon',
			includesMoto: true,
			includesAccommodation: true,
			includesMeals: true
		},
		isActive: true
	}
];

export const motoLocations: MotoLocation[] = [
	{
		id: 1,
		motoCategory: { id: 1, name: 'Trail' },
		brand: 'BMW',
		model: 'F 850 GS',
		count: 6
	},
	{
		id: 2,
		motoCategory: { id: 2, name: 'Roadster' },
		brand: 'Triumph',
		model: 'Street Twin',
		count: 4
	},
	{
		id: 3,
		motoCategory: { id: 3, name: 'Touring' },
		brand: 'Honda',
		model: 'NT1100',
		count: 3
	}
];

export const accommodations: Accommodation[] = [
	{
		id: 11,
		name: 'Nafplio Boutique Hotel',
		city: 'Nafplio',
		country: 'Grèce',
		type: AccommodationType.Hotel
	},
	{
		id: 12,
		name: 'Mykonos Seaside Lodge',
		city: 'Mykonos',
		country: 'Grèce',
		type: AccommodationType.Guesthouse
	},
	{
		id: 13,
		name: 'Santorini Loft',
		city: 'Santorini',
		country: 'Grèce',
		type: AccommodationType.Airbnb
	}
];

export const options: Option[] = [
	{
		id: 301,
		name: 'Pack assurance premium',
		price: 120,
		targetType: OptionTargetType.QuoteItem
	},
	{
		id: 302,
		name: 'Casque communicant',
		price: 35,
		targetType: OptionTargetType.QuoteItem
	},
	{
		id: 303,
		name: 'Bagagerie incluse',
		targetType: OptionTargetType.QuoteItem
	},
	{
		id: 304,
		name: 'Option de groupe (gestion)',
		price: 250,
		targetType: OptionTargetType.Quote
	}
];
