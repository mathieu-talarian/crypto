import { AlgoBase } from 'algo/base';
import { toByteArray } from 'utils';

export class Subtle extends AlgoBase {
	public declare key: CryptoKey;
	public declare ecdsaPublic: CryptoKey;
	public declare ecdsaPrivate: CryptoKey;
	constructor(k?: CryptoKey) {
		super();
		this.genAESKey(k).catch(console.error);
		this.genEDCSA().catch();
	}

	async genEDCSA() {
		this.ecdsaPublic = await crypto.subtle.importKey(
			'spki',
			toByteArray(import.meta.env.VITE_ECDSA_PUBLIC_KEY),
			{ name: 'ECDSA', namedCurve: 'P-256' },
			true,
			['verify'],
		);
		this.ecdsaPrivate = await crypto.subtle.importKey(
			'pkcs8',
			toByteArray(import.meta.env.VITE_ECDSA_PRIVATE_KEY),
			{ name: 'ECDSA', namedCurve: 'P-256' },
			true,
			['sign'],
		);
	}

	genAESKey = async (k?: CryptoKey) => {
		this.key =
			k ??
			(await crypto.subtle.importKey(
				'raw',
				toByteArray(import.meta.env.VITE_AES_SUBTLE_KEY),
				{ name: 'AES-GCM', length: 256 },
				true,
				['encrypt', 'decrypt'],
			));
	};

	sign = async (message: string) =>
		await crypto.subtle.sign(
			{
				name: 'ECDSA',
				hash: { name: 'SHA-256' },
			},
			this.ecdsaPrivate,
			new TextEncoder().encode(message),
		);

	verify = (message: string, signature: string) =>
		window.crypto.subtle.verify(
			{
				name: 'ECDSA',
				hash: { name: 'SHA-256' },
			},
			this.ecdsaPublic,
			toByteArray(signature),
			new TextEncoder().encode(message),
		);

	async encrypt(message: string, iv?: Uint8Array): Promise<Uint8Array> {
		const encodedMessage = new TextEncoder().encode(message);

		const cypher = await crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			this.key,
			encodedMessage,
		);
		return new Uint8Array(cypher);
	}
	async decrypt(cypher: Uint8Array, iv?: Uint8Array): Promise<string> {
		const decrypted = await crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			this.key,
			cypher,
		);
		const v = new Uint8Array(decrypted);
		return new TextDecoder().decode(v);
	}
}
