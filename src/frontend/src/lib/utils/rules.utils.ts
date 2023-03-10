import type { Permission, RulesType } from '$declarations/satellite/satellite.did';
import { listRules } from '$lib/api/satellites.api';
import {
	PermissionControllers,
	PermissionManaged,
	PermissionPrivate,
	PermissionPublic,
	type PermissionText
} from '$lib/constants/rules.constants';
import { toasts } from '$lib/stores/toasts.store';
import type { RulesStore } from '$lib/types/rules.context';
import type { Principal } from '@dfinity/principal';
import type { Writable } from 'svelte/store';

export const permissionFromText = (text: PermissionText): Permission => {
	switch (text) {
		case 'Public':
			return PermissionPublic;
		case 'Private':
			return PermissionPrivate;
		case 'Managed':
			return PermissionManaged;
		default:
			return PermissionControllers;
	}
};

export const permissionToText = (permission: Permission): PermissionText => {
	if ('Public' in permission) {
		return 'Public';
	}

	if ('Private' in permission) {
		return 'Private';
	}

	if ('Managed' in permission) {
		return 'Managed';
	}

	return 'Controllers';
};

export const reloadContextRules = async ({
	satelliteId,
	type,
	store
}: {
	satelliteId: Principal;
	store: Writable<RulesStore>;
	type: RulesType;
}) => {
	try {
		const rules = await listRules({ satelliteId, type });
		store.set({ satelliteId, rules, rule: undefined });
	} catch (err: unknown) {
		store.set({ satelliteId, rules: undefined, rule: undefined });

		toasts.error({
			text: `Error while listing the rules.`,
			detail: err
		});
	}
};
