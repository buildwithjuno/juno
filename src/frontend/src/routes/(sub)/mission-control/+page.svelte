<script lang="ts">
	import MissionControl from '$lib/components/mission-control/MissionControl.svelte';
	import {
		type Tab,
		TABS_CONTEXT_KEY,
		type TabsContext,
		type TabsStore
	} from '$lib/types/tabs.context';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import Tabs from '$lib/components/ui/Tabs.svelte';
	import IdentityGuard from '$lib/components/guards/IdentityGuard.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import MissionControlControllers from '$lib/components/mission-control/MissionControlControllers.svelte';
	import { nonNullish } from '$lib/utils/utils';
	import { missionControlStore } from '$lib/stores/mission-control.store';

	const tabs: Tab[] = [
		{
			id: Symbol('1'),
			labelKey: 'mission_control.overview'
		},
		{
			id: Symbol('2'),
			labelKey: 'controllers.title'
		}
		// TODO: implement and add transactions tab when ICP index canisters makes it to mainnet
		// {
		// 	id: Symbol('3'),
		// 	name: $i18n.mission_control.transactions
		// }
	];

	const store = writable<TabsStore>({
		tabId: tabs[0].id,
		tabs
	});

	setContext<TabsContext>(TABS_CONTEXT_KEY, {
		store
	});
</script>

<IdentityGuard>
	<Tabs help="https://juno.build/docs/architecture">
		{#if nonNullish($missionControlStore)}
			{#if $store.tabId === $store.tabs[0].id}
				<MissionControl />
			{:else if $store.tabId === $store.tabs[1].id}
				<MissionControlControllers missionControlId={$missionControlStore} />
			{/if}
		{/if}
	</Tabs>
</IdentityGuard>
