import type {PageLoad} from "../../../.svelte-kit/types/src/routes/quote/$types.js";
import {loadCatalog} from "$lib/services/catalogService.js";

export const load: PageLoad = async ({fetch}) => {
	const {catalog, source} = await loadCatalog(fetch);

	return {
		catalog,
		isOffline: source === 'mock'
	};
};
