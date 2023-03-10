<script lang="ts">
	import type { RulesContext } from '$lib/types/rules.context';
	import { getContext, setContext } from 'svelte';
	import { RULES_CONTEXT_KEY } from '$lib/types/rules.context';
	import { isNullish, nonNullish } from '$lib/utils/utils';
	import { listAssets } from '$lib/api/satellites.api';
	import { toasts } from '$lib/stores/toasts.store';
	import type { AssetNoContent } from '$declarations/satellite/satellite.did';
	import type { PaginationContext } from '$lib/types/pagination.context';
	import { PAGINATION_CONTEXT_KEY } from '$lib/types/pagination.context';
	import { initPaginationContext } from '$lib/stores/pagination.store';
	import type { DataContext } from '$lib/types/data.context';
	import { DATA_CONTEXT_KEY } from '$lib/types/data.context';
	import DataPaginator from '$lib/components/data/DataPaginator.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import DataOrder from '$lib/components/data/DataOrder.svelte';
	import { listOrderStore } from '$lib/stores/data.store';

	const { store }: RulesContext = getContext<RulesContext>(RULES_CONTEXT_KEY);

	const list = async () => {
		if (isNullish(collection)) {
			setItems({ items: undefined, matches_length: undefined });
			return;
		}

		try {
			const { items, matches_length } = await listAssets({
				collection,
				satelliteId: $store.satelliteId,
				params: {
					startAfter: $paginationStore.startAfter,
					order: $listOrderStore
				}
			});
			setItems({ items, matches_length });
		} catch (err: unknown) {
			toasts.error({
				text: `Error while listing the assets.`,
				detail: err
			});
		}
	};

	setContext<PaginationContext<AssetNoContent>>(PAGINATION_CONTEXT_KEY, {
		...initPaginationContext(),
		list
	});

	const {
		store: paginationStore,
		resetPage,
		setItems
	}: PaginationContext<AssetNoContent> = getContext<PaginationContext<AssetNoContent>>(
		PAGINATION_CONTEXT_KEY
	);

	let collection: string | undefined;
	$: collection = $store.rule?.[0];

	$: collection,
		$listOrderStore,
		(async () => {
			resetPage();
			await list();
		})();

	let empty = false;
	$: empty = $paginationStore.items?.length === 0 && collection !== undefined;

	const { store: assetsStore }: DataContext<AssetNoContent> =
		getContext<DataContext<AssetNoContent>>(DATA_CONTEXT_KEY);

	let emptyCollection = false;
	$: emptyCollection = $store.rules?.length === 0;
</script>

<div class="title">
	<DataOrder>
		{$i18n.storage.assets}
	</DataOrder>
</div>

{#if !emptyCollection}
	<div
		class="data"
		class:data-selected={nonNullish($assetsStore.data)}
		class:data-nullish={isNullish($paginationStore.items)}
	>
		{#if nonNullish($paginationStore.items)}
			{#each $paginationStore.items as item}
				{@const asset = item[1]}
				{@const key = asset.key.full_path}

				<button class="text action" on:click={() => assetsStore.set({ key, data: asset })}
					><span>{key}</span></button
				>
			{/each}

			{#if !empty}
				<DataPaginator />
			{/if}

			{#if empty}
				<p class="empty">Your collection <strong>{collection ?? ''}</strong> is empty.</p>
			{/if}
		{/if}
	</div>
{/if}

<style lang="scss">
	@use '../../styles/mixins/data';

	@include data.list;
</style>
