import nacl from "tweetnacl";

import { AlgoBase } from "algo/base";
import { toByteArray, toHexString } from "utils";

export class Nacl extends AlgoBase {
  public declare cryptoPublicKey: Uint8Array;
  public declare cryptoPrivateKey: Uint8Array;
  public declare signKeyPair: nacl.SignKeyPair;

  public iv: Uint8Array;
  constructor() {
    super();
    this.keys();

    this.signKeys();
    this.iv = toByteArray(import.meta.env.VITE_NACL_IV);
  }

  signKeys = () => {
    this.signKeyPair = nacl.sign.keyPair();
  };

  keys = () => {
    this.cryptoPublicKey = toByteArray(import.meta.env.VITE_NACL_PUBLIC);
    this.cryptoPrivateKey = toByteArray(import.meta.env.VITE_NACL_PRIVATE);
  };

  encrypt = (message: string): Promise<Uint8Array> => {
    const encoded = new TextEncoder().encode(message);
    return Promise.resolve(
      nacl.secretbox(encoded, this.iv, this.cryptoPrivateKey)
    );
  };

  decrypt = (cypher: Uint8Array): Promise<string> => {
    const encoded = nacl.secretbox.open(cypher, this.iv, this.cryptoPrivateKey);

    return Promise.resolve(new TextDecoder().decode(encoded));
  };
}
