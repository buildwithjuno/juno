<script lang="ts">
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import { signOut } from '$lib/services/auth.services';
	import { authSignedInStore, authStore } from '$lib/stores/auth.store';
	import IconUser from '$lib/components/icons/IconUser.svelte';
	import Popover from '$lib/components/ui/Popover.svelte';
	import IconSignOut from '$lib/components/icons/IconSignOut.svelte';
	import IconSignIn from '$lib/components/icons/IconSignIn.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import IconMissionControl from '$lib/components/icons/IconMissionControl.svelte';

	export let signIn = true;

	let button: HTMLButtonElement | undefined;
	let visible: boolean | undefined;

	const doSignIn = async () => await authStore.signIn(undefined);

	const signOutClose = async () => {
		visible = false;
		await signOut();
	};
</script>

{#if $authSignedInStore}
	<ButtonIcon on:click={() => (visible = true)} bind:button>
		<IconUser slot="icon" />
		User menu
	</ButtonIcon>
{:else if signIn}
	<ButtonIcon on:click={doSignIn}>
		<IconSignIn slot="icon" />
		Sign-in
	</ButtonIcon>
{/if}

<Popover bind:visible anchor={button} direction="rtl">
	<div class="container">
		<a
			href="/mission-control"
			class="menu"
			role="menuitem"
			aria-haspopup="menu"
			rel="external noopener norefferer"
		>
			<IconMissionControl />
			<span>{$i18n.mission_control.title}</span>
		</a>

		<button type="button" role="menuitem" aria-haspopup="menu" on:click={signOutClose} class="menu">
			<IconSignOut />
			<span>{$i18n.core.sign_out}</span>
		</button>
	</div>
</Popover>

<style lang="scss">
	.container {
		padding: var(--padding);
	}
</style>
