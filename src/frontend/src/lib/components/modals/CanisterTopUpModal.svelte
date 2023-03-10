<script lang="ts">
	import Modal from '$lib/components/ui/Modal.svelte';
	import { missionControlStore } from '$lib/stores/mission-control.store';
	import { topUp } from '$lib/api/mission-control.api';
	import { isNullish, nonNullish } from '$lib/utils/utils';
	import { toasts } from '$lib/stores/toasts.store';
	import { icpXdrConversionRate } from '$lib/api/cmc.api';
	import { createEventDispatcher, onMount } from 'svelte';
	import { formatTCycles, icpToCycles } from '$lib/utils/cycles.utils';
	import { E8S_PER_ICP, IC_TRANSACTION_FEE_ICP } from '$lib/constants/constants';
	import Input from '$lib/components/ui/Input.svelte';
	import SpinnerModal from '$lib/components/ui/SpinnerModal.svelte';
	import type { Principal } from '@dfinity/principal';
	import { i18n } from '$lib/stores/i18n.store';
	import Value from '$lib/components/ui/Value.svelte';
	import { i18nFormat } from '$lib/utils/i18n.utils';
	import { emit } from '$lib/utils/events.utils';
	import { wizardBusy } from '$lib/stores/busy.store';

	export let canisterId: Principal;

	let steps: 'init' | 'in_progress' | 'ready' | 'error' = 'init';

	let trillionRatio: bigint | undefined;
	onMount(async () => (trillionRatio = await icpXdrConversionRate()));

	let icp: number | undefined = undefined;

	let validIcp = false;
	$: validIcp = nonNullish(icp) && icp > 0;

	let cycles: number | undefined;
	$: cycles =
		nonNullish(trillionRatio) && validIcp
			? icpToCycles({ icp: icp as number, trillionRatio })
			: undefined;

	let validCycles = false;
	$: validCycles = nonNullish(cycles) && cycles > 2 * Number(IC_TRANSACTION_FEE_ICP);

	const onSubmit = async () => {
		if (isNullish($missionControlStore)) {
			toasts.error({
				text: $i18n.errors.no_mission_control
			});
			return;
		}

		if (isNullish(icp) || !validIcp || !validCycles) {
			toasts.error({
				text: `Invalid amount to top-up.`
			});
			return;
		}

		wizardBusy.start();
		steps = 'in_progress';

		try {
			await topUp({
				canisterId,
				missionControlId: $missionControlStore,
				e8s: BigInt(icp * Number(E8S_PER_ICP))
			});

			emit({ message: 'junoRestartCycles', detail: { canisterId } });

			steps = 'ready';
		} catch (err: unknown) {
			toasts.error({
				text: `Error while topping up the satellite.`,
				detail: err
			});

			steps = 'error';
		}

		wizardBusy.stop();
	};

	const dispatch = createEventDispatcher();
	const close = () => dispatch('junoClose');
</script>

<Modal on:junoClose>
	{#if steps === 'ready'}
		<div class="msg">
			<slot name="outro" />
			<button on:click={close}>{$i18n.core.close}</button>
		</div>
	{:else if steps === 'in_progress'}
		<SpinnerModal>
			<p>{$i18n.canisters.top_up_in_progress}</p>
		</SpinnerModal>
	{:else}
		<slot name="intro" />

		<p>
			{@html i18nFormat($i18n.canisters.cycles, [
				{
					placeholder: '{0}',
					value:
						'<a href="https://juno.build/docs/terminology#cycles" rel="external noopener norefferer">Cycles</a>'
				}
			])}
		</p>

		<form on:submit|preventDefault={onSubmit}>
			<div>
				<Value>
					<svelte:fragment slot="label">ICP</svelte:fragment>
					<Input
						name="icp"
						inputType="icp"
						required
						bind:value={icp}
						placeholder={$i18n.canisters.amount}
					/>
				</Value>
			</div>

			<div>
				<Value>
					<svelte:fragment slot="label">Cycles</svelte:fragment>
					{nonNullish(cycles) ? `${formatTCycles(BigInt(cycles))}` : '0'} TCycles
				</Value>
			</div>

			<button type="submit" disabled={isNullish($missionControlStore) || !validIcp || !validCycles}
				>{$i18n.canisters.top_up}</button
			>
		</form>
	{/if}
</Modal>

<style lang="scss">
	@use '../../styles/mixins/overlay';

	p {
		min-height: 24px;
	}

	.msg {
		@include overlay.message;
	}

	button {
		margin-top: var(--padding-2x);
	}
</style>
