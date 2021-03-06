import { Subtle } from './algo/Subtle';
import { getNonce, setNonce } from './utils';
import './app.css';

import App from './Components/App.svelte';

const main = async () => {
	const u = crypto.getRandomValues(new Uint8Array(16));

	const k = await crypto.subtle.importKey('raw', u, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);

	const s = new Subtle(k);

	const test = await setNonce('test');
	console.log(test);

	const m = await s.encrypt('test', new TextEncoder().encode(test));

	console.log(m);

	const val = s.decrypt(m, new TextEncoder().encode(test));

	console.log(await val);
	// const gpg = new GPG();
	// await gpg.generateGPGKey();
	// const encrypted = await gpg.encrypt(JSON.stringify(tenMB));

	// console.log(encrypted);
	// const rsa = new RSA_OEP();

	// // JSON.parse(k)

	// const cypher = await rsa.encryptAES(JSON.stringify(tenMB));
	// const stringified = new Uint8Array(cypher).toString();

	// const el = stringified
	//   .split(",")
	//   .map((el) => parseInt(el)) as ArrayLike<number>;
	// console.log(JSON.stringify(el));

	// JSON.stringify(el);

	// const decoded = await rsa.decryptAES(new Uint8Array(el));
	// console.log(decoded);

	// const nacl = new Nacl();

	// const box = nacl.encrypt(JSON.stringify(tenMB));

	// const el2 = box
	//   .toString()
	//   .split(",")
	//   .map((el) => parseInt(el)) as ArrayLike<number>;
	// console.log(JSON.stringify(el2));

	// const v = nacl.decrypt(box);
	// console.log(v);
	new App({
		target: document.getElementById('app'),
	});
};

main().catch(console.error);
