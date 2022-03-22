import {
  createMessage,
  decryptKey,
  encrypt,
  enums,
  generateKey,
  readKeys,
  readPrivateKey,
} from "openpgp";

export class GPG {
  declare privateKey: string;
  declare publicKey: string;
  declare passphrase: string;

  generateGPGKey = async () => {
    const keys = await generateKey({
      curve: "p521",
      passphrase: "1234",
      userIDs: [{ name: "awesomeTable", email: "support@awesometable.com" }],
    });
    this.privateKey = keys.privateKey;
    this.publicKey = keys.publicKey;
    this.passphrase = "1234";
  };

  encrypt = async (message: string) => {
    const privateKey = await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: this.privateKey }),
      passphrase: this.passphrase,
    });

    const encrypted = await encrypt({
      message: await createMessage({ text: message }),
      encryptionKeys: await readKeys({ armoredKeys: this.publicKey }),
      signingKeys: privateKey,
      config: { preferredCompressionAlgorithm: enums.compression.zip },
    });
    return encrypted;
  };
}
