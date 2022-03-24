import axios from 'axios';

import { Subtle } from './Subtle';

export class Subtle_Pass extends Subtle {
	genAESKey = async () => {
		const pass = (await axios.post('http://localhost:3030/pass')).data;
		if (typeof pass !== 'string' || !pass.length) {
			throw 0;
		}
		await this.deriveBits(pass, crypto.getRandomValues(new Uint8Array(12)));
		const masterKey = crypto.getRandomValues(new Uint8Array(32));
	};

	deriveBits = async (
		passPhrase: string | Uint8Array,
		salt?: Uint8Array,
		iterations = 1000,
		hashAlgo = 'SHA-256',
	) => {
		// Always specify a strong salt
		if (iterations < 10000) {
			console.warn('Less than 10000 :(');
		}
		const baseKey = await window.crypto.subtle.importKey(
			'raw',
			typeof passPhrase === 'string' ? new TextEncoder().encode(passPhrase) : passPhrase,
			'PBKDF2',
			false,
			['deriveBits', 'deriveKey'],
		);
		const derivedKey = await window.crypto.subtle.deriveBits(
			{
				name: 'PBKDF2',
				salt: salt ?? new Uint8Array([]),
				iterations: iterations || 100000,
				hash: hashAlgo || 'SHA-256',
			},
			baseKey,
			128,
		);
		return new Uint8Array(derivedKey);
	};
}
