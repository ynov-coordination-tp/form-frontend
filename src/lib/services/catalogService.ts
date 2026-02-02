import { PUBLIC_API_BASE_URL } from '$env/static/public';

export type CatalogOption = {
	id: string;
	name: string;
	price: number;
	type: 'hotel' | 'moto' | 'vols' | 'transfert';
	idObjet: string;
};

export type CatalogFormula = {
	id: string;
	code: string;
	nom: string;
	prix_base: number;
	options: CatalogOption[];
	startDate?: string;
	endDate?: string;
	maxParticipant?: number;
	currParticipant?: number;
};

export type CatalogCircuit = {
	id: string;
	nom: string;
	duree_jours: number;
	distance_km: number;
	formules: CatalogFormula[];
};

export type Catalog = {
	circuits: CatalogCircuit[];
};

export type CatalogLoadResult = {
	catalog: Catalog;
	// Permet d'afficher un badge "offline" et d'ajuster la soumission.
	source: 'api' | 'mock';
};

/**
 * Charge le catalogue.
 * - Si une base URL existe ET répond => on consomme l'API.
 * - Sinon, fallback automatique vers /static/mock/catalog.json.
 */
export async function loadCatalog(fetcher: typeof fetch = fetch): Promise<CatalogLoadResult> {
	const fallbackUrl = '/mock/catalog.json';

	// NOTE: PUBLIC_API_BASE_URL est volontairement optionnel pour le mode offline.
	if (PUBLIC_API_BASE_URL) {
		try {
			const response = await fetcher(`${PUBLIC_API_BASE_URL}/api/catalog`);
			if (response.ok) {
				const catalog = (await response.json()) as Catalog;
				return { catalog, source: 'api' };
			}
		} catch (error) {
			// En cas d'erreur réseau, on poursuit sur le fallback offline.
			console.warn('[catalogService] API indisponible, fallback offline.', error);
		}
	}

	const fallbackResponse = await fetcher(fallbackUrl);
	const catalog = (await fallbackResponse.json()) as Catalog;
	return { catalog, source: 'mock' };
}
