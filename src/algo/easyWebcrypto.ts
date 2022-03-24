import axios from 'axios';
import { decryptBuffer, decryptMasterKey, encryptBuffer, genAESKey, genEncryptedMasterKey } from 'easy-web-crypto';

import { AlgoBase } from 'algo/base';

export class easyWebcrypto extends AlgoBase {
	public declare keyPairs: CryptoKey;

	constructor() {
		super();
		// this.generateKeys().catch();
		this.masterKey().catch();
	}

	async masterKey() {
		const p = (await axios.post('http://localhost:3030/pass')).data;
		console.log(p);

		const pass = await genEncryptedMasterKey(p);
		this.keyPairs = await decryptMasterKey(p, pass);
	}
	async generateKeys() {
		this.keyPairs = await genAESKey();
	}

	encrypt = async (message: string, iv: Uint8Array): Promise<Uint8Array> => {
		const mes = await encryptBuffer(this.keyPairs, new TextEncoder().encode(message) as Buffer, {
			name: 'AES-GCM',
			iv,
		});

		return Promise.resolve(mes);
	};

	decrypt = async (cypher: Uint8Array, iv?: Uint8Array): Promise<string> => {
		const mes = await decryptBuffer(this.keyPairs, cypher, { name: 'AES-GCM', iv });

		return new TextDecoder().decode(mes);
	};
}
