import { PropsWithChildren, useEffect, useState } from "react";

export type ChildrenProp = PropsWithChildren["children"];

// https://github.com/ethers-io/ethers.js/blob/13593809bd61ef24c01d79de82563540d77098db/src.ts/constants/numbers.ts#L21
export const MaxUint256 = BigInt(
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
);

export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

// Inspired by: https://stackoverflow.com/a/67893529/6099842
export function useStateWithDep<T>(defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return [value, setValue] as const;
}

export function shortenHex(address: string, length = 4) {
  return `${address.substring(0, 2 + length)}...${address.substring(
    address.length - length,
    address.length
  )}`;
}

export async function copyToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export const absoluteValue = (n: bigint) => {
  return n >= 0 ? n : -n;
};

export function toFixedUsingStrings(numStr: string, decimalPlaces: number) {
  const [wholePart, decimalPart] = numStr.split('.');

  if (!decimalPart || decimalPart.length <= decimalPlaces) {
    return numStr.padEnd(wholePart.length + 1 + decimalPlaces, '0');
  }

  const decimalPartBigInt = BigInt(decimalPart.slice(0, decimalPlaces + 1));
  
  const round = decimalPartBigInt % 10n >= 5n;
  const roundedDecimal = decimalPartBigInt / 10n + (round ? 1n : 0n);

  return wholePart + '.' + roundedDecimal.toString().padStart(decimalPlaces, '0');
}