import {
  SuperTokenInfo,
  SuperTokenList,
  TokenInfo,
} from "@superfluid-finance/tokenlist";
import { produce } from "immer";

type ReturnValue = Readonly<{
  superTokens: ReadonlyArray<SuperTokenInfo>;
  underlyingTokens: ReadonlyArray<TokenInfo>;
}>;

export function filterSuperTokensFromTokenList(
  tokenList: SuperTokenList,
): ReturnValue {
  return tokenList.tokens.reduce(
    (accumulator, tokenInfo) => {
      if (tokenInfo.extensions?.superTokenInfo) {
        return produce(accumulator, (draft) => {
          draft.superTokens.push(tokenInfo);
        });
      } else {
        return produce(accumulator, (draft) => {
          draft.underlyingTokens.push(tokenInfo);
        });
      }
    },
    { superTokens: [], underlyingTokens: [] } as ReturnValue,
  );
}
