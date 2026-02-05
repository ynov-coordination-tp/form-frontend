import {
	AccommodationType,
	OptionTargetType,
	type Accommodation,
	type MotoCategoryPrice,
	type MotoLocation,
	type Option,
	type Tour,
	type TourFormula,
	type TourPrice,
	type AccommodationPrice,
	RoomType
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


export const tourPrices: TourPrice[] = [
	{
		id: 1001,
		tourFormula: tourFormulas[0],
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		basePrice: 1650
	},
	{
		id: 1002,
		tourFormula: tourFormulas[1],
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		basePrice: 2290
	},
	{
		id: 1003,
		tourFormula: tourFormulas[2],
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		basePrice: 1890
	},
	{
		id: 1004,
		tourFormula: tourFormulas[3],
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		basePrice: 2750
	}
];

export const accommodationPrices: AccommodationPrice[] = [
	{
		id: 2001,
		accommodationId: 11,
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		nightlyPrice: 110,
		roomType: RoomType.Single
	},
	{
		id: 2002,
		accommodationId: 12,
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		nightlyPrice: 135,
		roomType: RoomType.Single
	},
	{
		id: 2003,
		accommodationId: 13,
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		nightlyPrice: 160,
		roomType: RoomType.Single
	}
];

export const motoCategoryPrices: MotoCategoryPrice[] = [
	{
		id: 3001,
		motoCategory: { id: 1, name: 'Trail' },
		country: 'Grèce',
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		dailyPrice: 85,
		kmPrice: 0.15
	},
	{
		id: 3002,
		motoCategory: { id: 2, name: 'Roadster' },
		country: 'Grèce',
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		dailyPrice: 70,
		kmPrice: 0.12
	},
	{
		id: 3003,
		motoCategory: { id: 3, name: 'Touring' },
		country: 'Grèce',
		startDate: '2026-01-01',
		endDate: '2026-12-31',
		dailyPrice: 95,
		kmPrice: 0.18
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
