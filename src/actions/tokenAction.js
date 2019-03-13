export const tokenActionTypes = {
  SET_TOKENS: 'TOKEN.SET_TOKENS',
};

export function setTokens(tokens) {
  return {
    type: tokenActionTypes.SET_TOKENS,
    payload: tokens
  }
}
