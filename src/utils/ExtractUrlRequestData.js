/* eslint no-useless-escape:0 */
/* eslint no-mixed-operators:0 */
import crypto from "crypto";

// generate a hash of a specific length
function hash(str, length) {
  return crypto
    .createHash("sha512") // crypto.stackexchange.com/questions/26336
    .update(str.toString())
    .digest("base64")
    .replace("/", "")
    .replace(/[Il0oO=\/\+]/g, "") // remove ambiguous chars
    .substring(0, length || 12);
}
/**
 * This file/module's only job is to extract the request data from http headers
 * @param {Object} request - the standard nodejs http request object.
 * @returns {string} hit - see readme for format.
 */
function extractIpBrowser(request) {
  const h = request.headers || {}; // shortcut to headers reduces typing

  // get the user's IP address from headers or connection object:
  const ip =
    h["x-forwarded-for"] ||
    (request.connection && request.connection.remoteAddress);

  return [Math.floor(Date.now() / 1000), h["user-agent"], ip];
}

/**
 * add - adds an entry into the List for a given url
 * @param {Object} hit - the hit we just received
 * @param {Function} callback - call this once redis responds
 */
export default function generateUniqueHash(request) {
  const h = extractIpBrowser(request);

  // save unique hash of browser data to avoid duplication
  const uniqueBrowserString = [h[1], h[2]].join("|");
  return hash(uniqueBrowserString, 10);
}
