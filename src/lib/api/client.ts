import { env } from '$env/dynamic/public';
import {
	QuoteStatus,
	type Accommodation,
	type AccommodationPrice,
	type MotoCategoryPrice,
	type MotoLocation,
	type Option,
	type Quote,
	type QuoteCreateDto,
	type Tour,
	type TourFormula,
	type TourPrice
} from '$lib/api/types';
import {
	accommodationPrices,
	accommodations,
	motoCategoryPrices,
	motoLocations,
	options,
	tourFormulas,
	tourPrices,
	tours
} from '$lib/api/mockData';

export type ApiMode = 'api' | 'mock';

export interface ApiClient {
	getTours(): Promise<Tour[]>;
	getTourFormulasByTour(tourId: number): Promise<TourFormula[]>;
	getMotoLocations(): Promise<MotoLocation[]>;
	getAccommodations(): Promise<Accommodation[]>;
	getTourPricesByFormula(tourFormulaId: number): Promise<TourPrice[]>;
	getMotoCategoryPrices(): Promise<MotoCategoryPrice[]>;
	getAccommodationPrices(): Promise<AccommodationPrice[]>;
	getOptions(): Promise<Option[]>;
	createQuote(payload: QuoteCreateDto): Promise<Quote>;
}

const normalizeBasePath = (value?: string) => {
	if (!value) return '/api';
	return value.startsWith('/') ? value : `/${value}`;
};

const joinUrl = (origin: string, path: string) => {
	const trimmedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
	const normalizedPath = path.startsWith('/') ? path : `/${path}`;
	return `${trimmedOrigin}${normalizedPath}`;
};

const resolveApiBaseUrl = () => {
	const origin = env.PUBLIC_API_ORIGIN;
	if (!origin) return null;
	const basePath = normalizeBasePath(env.PUBLIC_API_BASE_PATH);
	return joinUrl(origin, basePath);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiClient implements ApiClient {
	async getTours(): Promise<Tour[]> {
		await delay(300);
		return tours;
	}

	async getTourFormulasByTour(tourId: number): Promise<TourFormula[]> {
		await delay(300);
		return tourFormulas.filter((formula) => formula.tour.id === tourId);
	}

	async getMotoLocations(): Promise<MotoLocation[]> {
		await delay(300);
		return motoLocations;
	}

	async getAccommodations(): Promise<Accommodation[]> {
		await delay(300);
		return accommodations;
	}

	async getTourPricesByFormula(tourFormulaId: number): Promise<TourPrice[]> {
		await delay(300);
		return tourPrices.filter((price) => price.tourFormula.id === tourFormulaId);
	}

	async getMotoCategoryPrices(): Promise<MotoCategoryPrice[]> {
		await delay(300);
		return motoCategoryPrices;
	}

	async getAccommodationPrices(): Promise<AccommodationPrice[]> {
		await delay(300);
		return accommodationPrices;
	}

	async getOptions(): Promise<Option[]> {
		await delay(300);
		return options;
	}

	async createQuote(payload: QuoteCreateDto): Promise<Quote> {
		await delay(600);
		return {
			id: Math.floor(Math.random() * 10000) + 1,
			createdAt: new Date().toISOString(),
			departureDate: payload.departureDate,
			returnDate: payload.returnDate,
			tourPackageId: payload.tourPackageId,
			participantCount: payload.items?.length ?? 0,
			status: QuoteStatus.Draft
		};
	}
}

class HttpApiClient implements ApiClient {
	constructor(private readonly baseUrl: string, private readonly fetcher: typeof fetch) {}

	private async request<T>(path: string, options?: RequestInit): Promise<T> {
		const response = await this.fetcher(`${this.baseUrl}${path}`, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...(options?.headers ?? {})
			}
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`API error ${response.status}: ${errorText || response.statusText}`);
		}

		if (response.status === 204) {
			return undefined as T;
		}

		return (await response.json()) as T;
	}

	getTours(): Promise<Tour[]> {
		return this.request<Tour[]>('/tours');
	}

	getTourFormulasByTour(tourId: number): Promise<TourFormula[]> {
		return this.request<TourFormula[]>(`/tour-formulas/tour/${tourId}`);
	}

	getMotoLocations(): Promise<MotoLocation[]> {
		return this.request<MotoLocation[]>('/moto-locations');
	}

	getAccommodations(): Promise<Accommodation[]> {
		return this.request<Accommodation[]>('/accommodations');
	}

	getTourPricesByFormula(tourFormulaId: number): Promise<TourPrice[]> {
		return this.request<TourPrice[]>(`/tour-prices/formula/${tourFormulaId}`);
	}

	getMotoCategoryPrices(): Promise<MotoCategoryPrice[]> {
		return this.request<MotoCategoryPrice[]>('/moto-category-prices');
	}

	getAccommodationPrices(): Promise<AccommodationPrice[]> {
		return this.request<AccommodationPrice[]>('/accommodation-prices');
	}

	getOptions(): Promise<Option[]> {
		return this.request<Option[]>('/options');
	}

	createQuote(payload: QuoteCreateDto): Promise<Quote> {
		return this.request<Quote>('/quotes', {
			method: 'POST',
			body: JSON.stringify(payload)
		});
	}
}

export const createApiClient = (fetcher: typeof fetch = fetch): { client: ApiClient; mode: ApiMode } => {
	const modeFlag = env.PUBLIC_API_MODE;
	const baseUrl = resolveApiBaseUrl();

	if (modeFlag === 'mock') {
		return { client: new MockApiClient(), mode: 'mock' };
	}

	if (modeFlag === 'api' && baseUrl) {
		return { client: new HttpApiClient(baseUrl, fetcher), mode: 'api' };
	}

	if (baseUrl) {
		return { client: new HttpApiClient(baseUrl, fetcher), mode: 'api' };
	}

	return { client: new MockApiClient(), mode: 'mock' };
};
