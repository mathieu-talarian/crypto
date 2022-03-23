export abstract class AlgoBase {
  abstract encrypt(message: string): Promise<Uint8Array>;
  abstract decrypt(cypher: Uint8Array): Promise<string>;
}
