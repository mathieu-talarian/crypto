import { AlgoBase } from "algo/base";

export class RSA_OEP extends AlgoBase {
  public declare cryptoPublicKey: CryptoKey;
  public declare cryptoPrivateKey: CryptoKey;
  public declare cryptoAESKey: CryptoKey;
  public declare AESIv: Uint8Array;
  constructor() {
    super();
    this.AESIv = crypto.getRandomValues(new Uint8Array(12));
  }

  createRSAKey = async () => {
    const key = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        // Consider using a 4096-bit key for systems that require long-term security
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-512",
      },
      true,
      ["encrypt", "decrypt"]
    );
    this.cryptoPublicKey = key.publicKey;
    this.cryptoPrivateKey = key.privateKey;
  };

  createAESKey = async () => {
    this.cryptoAESKey = await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  };

  importAESKey = async () => await this.createAESKey();

  encryptAES = async (data: string): Promise<ArrayBuffer> => {
    if (!this.cryptoAESKey) await this.createAESKey();
    return crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: this.AESIv,
      },
      this.cryptoAESKey,
      new TextEncoder().encode(data)
    );
  };
  decryptAES = async (data: ArrayBuffer): Promise<string> => {
    if (!this.cryptoAESKey) await this.createAESKey();
    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: this.AESIv,
      },
      this.cryptoAESKey,
      data
    );

    return new TextDecoder().decode(decrypted);
  };

  encryptRSA = async (data: string): Promise<ArrayBuffer> => {
    const cypher = await this.encryptAES(data);
    if (!this.cryptoPublicKey) {
      await this.createRSAKey();
    }

    return await crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      this.cryptoPublicKey,
      cypher
    );
  };

  decryptRSA = async (cypher: Uint8Array | ArrayBuffer): Promise<string> => {
    if (!this.cryptoPrivateKey) {
      await this.createRSAKey();
    }

    const buff = await crypto.subtle.decrypt(
      { name: "RSA-OAEP" },
      this.cryptoPrivateKey,
      cypher
    );

    return this.decryptAES(buff);
  };
}
