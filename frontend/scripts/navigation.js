export const JOIN_PAGE = "/";
export const START_PAGE = "/Queue";
export const PLAYING_PAGE = "/Game";
export const PLAYER_LOST = "/Lost";
export const WAITING_FOR_FINISH = "/AwaitFinish";

/**
 * Returns the value of the URL parameter with the given name.
 */
export function getUrlArgument(name) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(name);
}

/**
 * Creates a new url string with the given arguments.
 *
 * Given base url 'abc' and args = {key1: value1, key2: value2}, then the return value is:
 * 'abc?key1=value1&key2=value2
 */
export function makeUrlWithArguments(prefix, args = {}) {
  let argumentsAsStrings = [];
  for (const key of Object.keys(args)) {
    argumentsAsStrings.push(`${key}=${args[key]}`);
  }

  return prefix + "?" + argumentsAsStrings.join("&");
}

export function navigateTo(pageRoute, params = {}) {
  window.location.href = makeUrlWithArguments(pageRoute, params);
}
