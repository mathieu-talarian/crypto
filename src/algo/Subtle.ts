import { AlgoBase } from 'algo/base';
import { toByteArray, toHexString } from 'utils';

export class Subtle extends AlgoBase {
	public declare key: CryptoKey;
	constructor() {
		super();
		this.genAESKey().catch(console.error);
	}

	genAESKey = async () => {
		const v = toByteArray(import.meta.env.VITE_AES_SUBTLE_KEY);

		this.key = await crypto.subtle.importKey('raw', v, { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
	};
	async encrypt(message: string, iv?: Uint8Array): Promise<Uint8Array> {
		const cypher = await crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv,
			},
			this.key,
			new TextEncoder().encode(message),
		);
		console.log(cypher);
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

	// createAESKey = async () => {
	// 	this.cryptoAESKey = await crypto.subtle.generateKey(
	// 		{
	// 			name: 'AES-GCM',
	// 			length: 256,
	// 		},
	// 		true,
	// 		['encrypt', 'decrypt'],
	// 	);
	// };
	//
	// importAESKey = async () => await this.createAESKey();
	//
	// encryptAES = async (data: string): Promise<ArrayBuffer> => {
	// 	if (!this.cryptoAESKey) await this.createAESKey();
	// 	return crypto.subtle.encrypt(
	// 		{
	// 			name: 'AES-GCM',
	// 			iv: this.AESIv,
	// 		},
	// 		this.cryptoAESKey,
	// 		new TextEncoder().encode(data),
	// 	);
	// };
	// decryptAES = async (data: ArrayBuffer): Promise<string> => {
	// 	if (!this.cryptoAESKey) await this.createAESKey();
	// 	const decrypted = await crypto.subtle.decrypt(
	// 		{
	// 			name: 'AES-GCM',
	// 			iv: this.AESIv,
	// 		},
	// 		this.cryptoAESKey,
	// 		data,
	// 	);
	//
	// 	return new TextDecoder().decode(decrypted);
	// };
	//
	// encryptRSA = async (data: string): Promise<ArrayBuffer> => {
	// 	const cypher = await this.encryptAES(data);
	// 	if (!this.cryptoPublicKey) {
	// 		await this.createRSAKey();
	// 	}
	//
	// 	return await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, this.cryptoPublicKey, cypher);
	// };
	//
	// decryptRSA = async (cypher: Uint8Array | ArrayBuffer): Promise<string> => {
	// 	if (!this.cryptoPrivateKey) {
	// 		await this.createRSAKey();
	// 	}
	//
	// 	const buff = await crypto.subtle.decrypt({ name: 'RSA-OAEP' }, this.cryptoPrivateKey, cypher);
	//
	// 	return this.decryptAES(buff);
	// };
}
