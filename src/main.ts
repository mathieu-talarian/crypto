import "./app.css";

import { RSA_OEP } from "algo/RSA_OEP";
import { GPG } from "algo/gpg";
import { Nacl } from "algo/nacl";
import { tenMB } from "files/10MB";

import App from "./App.svelte";

const main = async () => {
  const gpg = new GPG();
  await gpg.generateGPGKey();
  const encrypted = await gpg.encrypt(JSON.stringify(tenMB));

  console.log(encrypted);
  const rsa = new RSA_OEP();

  // JSON.parse(k)

  const cypher = await rsa.encryptAES(JSON.stringify(tenMB));
  const stringified = new Uint8Array(cypher).toString();

  const el = stringified
    .split(",")
    .map((el) => parseInt(el)) as ArrayLike<number>;
  console.log(JSON.stringify(el));

  JSON.stringify(el);

  const decoded = await rsa.decryptAES(new Uint8Array(el));
  console.log(decoded);

  const nacl = new Nacl();

  const box = nacl.encrypt(JSON.stringify(tenMB));

  const el2 = box
    .toString()
    .split(",")
    .map((el) => parseInt(el)) as ArrayLike<number>;
  console.log(JSON.stringify(el2));

  const v = nacl.decrypt(box);
  console.log(v);
  new App({
    target: document.getElementById("app"),
  });
};

main().catch(console.error);
