export function toHexString(byteArray: Uint8Array): string {
  return Array.prototype.map
    .call(byteArray, function (byte) {
      return ("0" + (byte & 0xff).toString(16)).slice(-2);
    })
    .join("");
}
export function toByteArray(hexString: string): Uint8Array {
  const result = [];
  for (let i = 0; i < hexString.length; i += 2) {
    result.push(parseInt(hexString.substr(i, 2), 16));
  }
  return new Uint8Array(result);
}
