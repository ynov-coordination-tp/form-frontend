export enum OptionTargetType {
	QuoteItem = 'QUOTE_ITEM',
	Quote = 'QUOTE'
}

export interface Option {
	id: number;
	name: string;
	price?: number;
	targetType?: OptionTargetType;
}

export interface Tour {
	id: number;
	name: string;
	country: string;
	durationDays?: number;
	description?: string;
}

export interface Formula {
	id: number;
	name: string;
	includesMoto?: boolean;
	includesAccommodation?: boolean;
	includesMeals?: boolean;
}

export interface TourFormula {
	id: number;
	tour: Tour;
	formula: Formula;
	isActive?: boolean;
}

export enum AccommodationType {
	Hotel = 'HOTEL',
	Airbnb = 'AIRBNB',
	Guesthouse = 'GUESTHOUSE'
}

export interface Accommodation {
	id: number;
	name: string;
	city?: string;
	country?: string;
	type?: AccommodationType;
}

export interface MotoCategory {
	id: number;
	name: string;
}

export interface MotoLocation {
	id: number;
	motoCategory: MotoCategory;
	brand: string;
	model: string;
	count: number;
}

export interface QuoteItemOptionCreateDto {
	optionId: number;
	quantity?: number;
}

export interface QuoteItemCreateDto {
	participantName?: string;
	motoLocationId?: number | null;
	accommodationId?: number;
	options?: QuoteItemOptionCreateDto[];
}

export interface QuoteCreateDto {
	customerId?: number;
	tourPackageId?: number;
	departureDate?: string;
	returnDate?: string;
	items?: QuoteItemCreateDto[];
}

export enum QuoteStatus {
	Draft = 'DRAFT',
	Confirmed = 'CONFIRMED',
	Cancelled = 'CANCELLED'
}

export interface Quote {
	id: number;
	quoteNumber?: string;
	createdAt?: string;
	departureDate?: string;
	returnDate?: string;
	customerId?: number;
	tourPackageId?: number;
	participantCount?: number;
	lockedTotalPrice?: number;
	status?: QuoteStatus;
}
