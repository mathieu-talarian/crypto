export abstract class AlgoBase {
	abstract encrypt(message: string, iv?: Uint8Array): Promise<Uint8Array>;

	abstract decrypt(cypher: Uint8Array, iv?: Uint8Array): Promise<string>;
}
