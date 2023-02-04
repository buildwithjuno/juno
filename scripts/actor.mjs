import pkgAgent from '@dfinity/agent';
import pkgPrincipal from '@dfinity/principal';
import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import { idlFactory } from '../src/declarations/console/console.factory.did.mjs';
import { initIdentity } from './identity.utils.mjs';

const { HttpAgent, Actor } = pkgAgent;
const { Principal } = pkgPrincipal;

const consolePrincipalIC = () => {
	const buffer = readFileSync('./canister_ids.json');
	const { console } = JSON.parse(buffer.toString('utf-8'));
	return Principal.fromText(console.ic);
};

const consolePrincipalLocal = () => {
	const buffer = readFileSync('./.dfx/local/canister_ids.json');
	const { console } = JSON.parse(buffer.toString('utf-8'));
	return Principal.fromText(console.local);
};

export const consoleActorIC = async () => {
	const canisterId = consolePrincipalIC();

	const agent = new HttpAgent({ fetch, host: 'https://ic0.app' });

	return Actor.createActor(idlFactory, {
		agent,
		canisterId
	});
};

export const localAgent = async () => {
	const identity = initIdentity();

	const agent = new HttpAgent({ identity, fetch, host: 'http://127.0.0.1:8000/' });

	await agent.fetchRootKey();

	return agent;
};

export const consoleActorLocal = async () => {
	const canisterId = consolePrincipalLocal();

	const agent = await localAgent();

	return Actor.createActor(idlFactory, {
		agent,
		canisterId
	});
};
