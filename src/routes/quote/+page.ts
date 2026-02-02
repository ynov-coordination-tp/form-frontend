import type { PageLoad } from './$types';
import { loadCatalog } from '$lib/services/catalogService';

export const load: PageLoad = async ({ fetch }) => {
	const { catalog, source } = await loadCatalog(fetch);

	return {
		catalog,
		isOffline: source === 'mock'
	};
};
