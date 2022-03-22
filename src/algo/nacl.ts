import nacl from "tweetnacl";

export class Nacl {
  public declare cryptoPublicKey: Uint8Array;
  public declare cryptoPrivateKey: Uint8Array;
  public iv: Uint8Array;
  constructor() {
    this.keys();
    this.iv = crypto.getRandomValues(new Uint8Array(24));
  }

  keys = () => {
    const keys = nacl.box.keyPair();
    this.cryptoPublicKey = keys.publicKey;
    this.cryptoPrivateKey = keys.secretKey;
  };

  encrypt = (message: string) => {
    const encoded = new TextEncoder().encode(message);
    return nacl.box(
      encoded,
      this.iv,
      this.cryptoPublicKey,
      this.cryptoPrivateKey
    );
  };

  decrypt = (cypher: Uint8Array) => {
    const encoded = nacl.box.open(
      cypher,
      this.iv,
      this.cryptoPublicKey,
      this.cryptoPrivateKey
    );

    return new TextDecoder().decode(encoded);
  };
}
