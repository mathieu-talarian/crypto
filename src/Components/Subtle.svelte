<script lang="ts">
	import { getContext, onMount } from 'svelte';

	import { Subtle } from 'algo/Subtle';
	import { tenMB } from 'files/10MB';
	import { oneMB } from 'files/1MB';
	import { fiveMB } from 'files/5MB';
	import type { Idb } from 'store';
	import { createId, getNonce, setNonce, toByteArray, toHexString } from 'utils';

	const name = `subtle`;
	let subtle: Subtle;

	let idb: Idb;
	let oneEncrypted;
	const oneId = createId(name, JSON.stringify(oneMB));
	const fiveId = createId(name, JSON.stringify(fiveMB));
	const tenId = createId(name, JSON.stringify(tenMB));
	let fiveEncrypted;
	let tenEncrypted;

	idb = getContext('idb');

	onMount(async () => {
		oneEncrypted = (await idb.getVal(`${name}/oneEncrypted`))
			? await idb.getVal(`${name}/oneEncrypted`)
			: undefined;
		fiveEncrypted = (await idb.getVal(`${name}/fiveEncrypted`))
			? await idb.getVal(`${name}/fiveEncrypted`)
			: undefined;
		tenEncrypted = (await idb.getVal(`${name}/tenEncrypted`))
			? await idb.getVal(`${name}/tenEncrypted`)
			: undefined;
	});

	$: subtle = new Subtle();

	const encodeOneMB = async () => {
		const nonce = await setNonce(oneId);
		const iv = new TextEncoder().encode(nonce);
		const encrypted = await subtle.encrypt(JSON.stringify(oneMB), iv);

		oneEncrypted = toHexString(encrypted);
		await idb.setVal(`${name}/oneEncrypted`, oneEncrypted);
	};

	const encodeFiveMB = async () => {
		const nonce = await setNonce(fiveId);
		const iv = new TextEncoder().encode(nonce);

		const encrypted = await subtle.encrypt(JSON.stringify(fiveMB), iv);
		fiveEncrypted = toHexString(encrypted);
		await idb.setVal(`${name}/fiveEncrypted`, fiveEncrypted);
	};

	const encodeTenMB = async () => {
		const nonce = await setNonce(tenId);
		const iv = new TextEncoder().encode(nonce);

		const encrypted = await subtle.encrypt(JSON.stringify(tenMB), iv);
		tenEncrypted = toHexString(encrypted);
		await idb.setVal(`${name}/tenEncrypted`, tenEncrypted);
	};

	const decodeOneMB = async () => {
		if (!oneEncrypted) return;

		const encoded = toByteArray(oneEncrypted);

		const nonce = await getNonce(oneId);
		const iv = new TextEncoder().encode(nonce);

		const decrypted = await subtle.decrypt(encoded, iv);

		if (decrypted === JSON.stringify(oneMB)) {
			console.log('1M decryption success');
		}
	};

	const decodeFiveMB = async () => {
		if (!fiveEncrypted) return;
		console.log(fiveEncrypted);
		const encoded = toByteArray(fiveEncrypted);

		const nonce = await getNonce(fiveId);
		const iv = new TextEncoder().encode(nonce);

		const decrypted = await subtle.decrypt(encoded, iv);

		if (decrypted === JSON.stringify(fiveMB)) {
			console.log('Five decryption success');
		}
	};

	const decodeTenMB = async () => {
		if (!tenEncrypted) return;
		const encoded = toByteArray(tenEncrypted);

		const nonce = await getNonce(tenId);
		const iv = new TextEncoder().encode(nonce);

		const decrypted = await subtle.decrypt(encoded, iv);

		if (decrypted === JSON.stringify(tenMB)) {
			console.log('Ten decryption success');
		}
	};
</script>

<header class="bg-white shadow">
	<div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
		<h1 class="text-3xl font-bold text-gray-900">Subtle</h1>
	</div>
</header>
<main>
	<div class="flex flex-col justify-center">
		<div class="flex flex-row align-middle justify-center">
			<button
				on:click={encodeOneMB}
				class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
				>Encrypt 1MB
			</button>
			{#if oneEncrypted}
				<button
					on:click={decodeOneMB}
					class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
					>Decrypt 1MB
				</button>
			{/if}
		</div>

		<div class="flex flex-row align-middle justify-center">
			<button
				on:click={encodeFiveMB}
				class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
				>Encrypt 5MB
			</button>
			{#if fiveEncrypted}
				<button
					on:click={decodeFiveMB}
					class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
					>Decrypt 5MB
				</button>
			{/if}
		</div>

		<div class="flex flex-row align-middle justify-center">
			<button
				on:click={encodeTenMB}
				class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
				>Encrypt 10MB
			</button>
			{#if tenEncrypted}
				<button
					on:click={decodeTenMB}
					class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
					>Decrypt 10MB
				</button>
			{/if}
		</div>
	</div>
</main>
