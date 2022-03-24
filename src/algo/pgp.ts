import { createMessage, decrypt, decryptKey, encrypt, enums, readKeys, readMessage, readPrivateKey } from 'openpgp';

import { AlgoBase } from 'algo/base';
import { toByteArray } from 'utils';

export class PGP extends AlgoBase {
	constructor() {
		super();
		this.generateGPGKey().catch();
	}
	declare privateKey: string;
	declare publicKey: string;
	declare passphrase: string;

	generateGPGKey = async () => {
		this.privateKey = new TextDecoder().decode(toByteArray(import.meta.env.VITE_GPG_PRIVATE));
		this.publicKey = new TextDecoder().decode(toByteArray(import.meta.env.VITE_GPG_PUBLIC));
		this.passphrase = '1234';
	};

	encrypt = async (message: string): Promise<Uint8Array> => {
		try {
			if (!this.privateKey) await this.generateGPGKey();
			const privateKey = await decryptKey({
				privateKey: await readPrivateKey({ armoredKey: this.privateKey }),
				passphrase: this.passphrase,
			});

			const encrypted = await encrypt({
				message: await createMessage({ text: message }),
				encryptionKeys: await readKeys({ armoredKeys: this.publicKey }),
				signingKeys: privateKey,
				config: { preferredCompressionAlgorithm: enums.compression.bzip2 },
			});
			return new TextEncoder().encode(encrypted as string);
		} catch (e) {
			console.error(e);
		}
	};

	decrypt = async (message: Uint8Array) => {
		if (!this.privateKey) await this.generateGPGKey();

		const privateKey = await decryptKey({
			privateKey: await readPrivateKey({ armoredKey: this.privateKey }),
			passphrase: this.passphrase,
		});

		const m = await readMessage({
			armoredMessage: new TextDecoder().decode(message), // parse armored message
		});

		const encrypted = await decrypt({
			message: m,
			verificationKeys: await readKeys({ armoredKeys: this.publicKey }),
			decryptionKeys: privateKey,
			expectSigned: true,
		});
		return encrypted.data as string;
	};
}
