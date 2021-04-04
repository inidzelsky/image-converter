export class Utilities {
  public static splitByNumber<T>(arr: T[], size: number): T[][] {
    let restArr: T[] = [...arr];
    let counter: number = 0;
    let temp: T[] = [];
    const result: T[][] = [];


    while (restArr.length) {
      temp.push(restArr[0]);
      if (++counter === size) {
        result.push(temp);
        counter = 0;
        temp = [];
      }
      restArr.shift();
    }

    return result;
  }
}

export class Hex {
  public static decimalToLittleEndian(dec: number, length: number): string {
    const bigEndian: string = dec.toString(16).padStart(length, '0');
    const littleEndian: string =
      Utilities.splitByNumber(bigEndian.split(''), 2)
        .reverse()
        .flat()
        .join('');

    return littleEndian;
  }

  public static littleEndianToDecimal(hex: string): number {
    const littleEndianHexBytes = Utilities.splitByNumber(hex.split(''), 2);
    const bigEndianHexBytes = [...littleEndianHexBytes].reverse().flat();
    return parseInt(bigEndianHexBytes.join(''), 16);
  }
}
