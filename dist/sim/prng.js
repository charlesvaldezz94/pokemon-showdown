"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var prng_exports = {};
__export(prng_exports, {
  Gen5RNG: () => Gen5RNG,
  PRNG: () => PRNG,
  SodiumRNG: () => SodiumRNG
});
module.exports = __toCommonJS(prng_exports);
var import_ts_chacha20 = require("ts-chacha20");
var import_utils = require("../lib/utils");
/**
 * PRNG
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This simulates the on-cartridge PRNG used in the real games.
 *
 * In addition to potentially allowing us to read replays from in-game,
 * this also makes it possible to record an "input log" (a seed +
 * initial teams + move/switch decisions) and "replay" a simulation to
 * get the same result.
 *
 * @license MIT license
 */
class PRNG {
  /** Creates a new source of randomness for the given seed. */
  constructor(seed = null, initialSeed) {
    if (!seed) seed = PRNG.generateSeed();
    if (Array.isArray(seed)) {
      seed = seed.join(",");
    }
    if (typeof seed !== "string") {
      throw new Error(`PRNG: Seed ${seed} must be a string`);
    }
    this.startingSeed = initialSeed ?? seed;
    this.setSeed(seed);
  }
  setSeed(seed) {
    if (seed.startsWith("sodium,")) {
      this.rng = new SodiumRNG(seed.split(","));
    } else if (seed.startsWith("gen5,")) {
      const gen5Seed = [seed.slice(5, 9), seed.slice(9, 13), seed.slice(13, 17), seed.slice(17, 21)];
      this.rng = new Gen5RNG(gen5Seed.map((n) => parseInt(n, 16)));
    } else if (/[0-9]/.test(seed.charAt(0))) {
      this.rng = new Gen5RNG(seed.split(",").map(Number));
    } else {
      throw new Error(`Unrecognized RNG seed ${seed}`);
    }
  }
  getSeed() {
    return this.rng.getSeed();
  }
  /**
   * Creates a clone of the current PRNG.
   *
   * The new PRNG will have its initial seed set to the seed of the current instance.
   */
  clone() {
    return new PRNG(this.rng.getSeed(), this.startingSeed);
  }
  /**
   * Retrieves the next random number in the sequence.
   * This function has three different results, depending on arguments:
   * - random() returns a real number in [0, 1), just like Math.random()
   * - random(n) returns an integer in [0, n)
   * - random(m, n) returns an integer in [m, n)
   * m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.
   */
  random(from, to) {
    const result = this.rng.next();
    if (from) from = Math.floor(from);
    if (to) to = Math.floor(to);
    if (from === void 0) {
      return result / 2 ** 32;
    } else if (!to) {
      return Math.floor(result * from / 2 ** 32);
    } else {
      return Math.floor(result * (to - from) / 2 ** 32) + from;
    }
  }
  /**
   * Flip a coin (two-sided die), returning true or false.
   *
   * This function returns true with probability `P`, where `P = numerator
   * / denominator`. This function returns false with probability `1 - P`.
   *
   * The numerator must be a non-negative integer (`>= 0`).
   *
   * The denominator must be a positive integer (`> 0`).
   */
  randomChance(numerator, denominator) {
    return this.random(denominator) < numerator;
  }
  /**
   * Return a random item from the given array.
   *
   * This function chooses items in the array with equal probability.
   *
   * If there are duplicate items in the array, each duplicate is
   * considered separately. For example, sample(['x', 'x', 'y']) returns
   * 'x' 67% of the time and 'y' 33% of the time.
   *
   * The array must contain at least one item.
   *
   * The array must not be sparse.
   */
  sample(items) {
    if (items.length === 0) {
      throw new RangeError(`Cannot sample an empty array`);
    }
    const index = this.random(items.length);
    const item = items[index];
    if (item === void 0 && !Object.prototype.hasOwnProperty.call(items, index)) {
      throw new RangeError(`Cannot sample a sparse array`);
    }
    return item;
  }
  /**
   * A Fisher-Yates shuffle. This is how the game resolves speed ties.
   *
   * At least according to V4 in
   * https://github.com/smogon/pokemon-showdown/issues/1157#issuecomment-214454873
   */
  shuffle(items, start = 0, end = items.length) {
    while (start < end - 1) {
      const nextIndex = this.random(start, end);
      if (start !== nextIndex) {
        [items[start], items[nextIndex]] = [items[nextIndex], items[start]];
      }
      start++;
    }
  }
  static generateSeed() {
    return PRNG.convertSeed(SodiumRNG.generateSeed());
  }
  static convertSeed(seed) {
    return seed.join(",");
  }
  static get(prng) {
    return prng && typeof prng !== "string" && !Array.isArray(prng) ? prng : new PRNG(prng);
  }
}
class SodiumRNG {
  static {
    // nonce chosen to be compatible with libsodium's randombytes_buf_deterministic
    // https://github.com/jedisct1/libsodium/blob/ce07d6c82c0e6c75031cf627913bf4f9d3f1e754/src/libsodium/randombytes/randombytes.c#L178
    this.NONCE = Uint8Array.from([..."LibsodiumDRG"].map((c) => c.charCodeAt(0)));
  }
  /** Creates a new source of randomness for the given seed. */
  constructor(seed) {
    this.setSeed(seed);
  }
  setSeed(seed) {
    const seedBuf = new Uint8Array(32);
    import_utils.Utils.bufWriteHex(seedBuf, seed[1].padEnd(64, "0"));
    this.seed = seedBuf;
  }
  getSeed() {
    return `sodium,${import_utils.Utils.bufReadHex(this.seed)}`;
  }
  next() {
    const zeroBuf = new Uint8Array(36);
    const buf = new import_ts_chacha20.Chacha20(this.seed, SodiumRNG.NONCE).encrypt(zeroBuf);
    this.seed = buf.slice(0, 32);
    return buf.slice(32, 36).reduce((a, b) => a * 256 + b);
  }
  static generateSeed() {
    const seed = new Uint32Array(4);
    if (typeof crypto === "undefined") globalThis.crypto = require("node:crypto");
    crypto.getRandomValues(seed);
    const strSeed = seed[0].toString(16).padStart(8, "0") + seed[1].toString(16).padStart(8, "0") + seed[2].toString(16).padStart(8, "0") + seed[3].toString(16).padStart(8, "0");
    return [
      "sodium",
      strSeed
    ];
  }
}
class Gen5RNG {
  /** Creates a new source of randomness for the given seed. */
  constructor(seed = null) {
    this.seed = [...seed || Gen5RNG.generateSeed()];
  }
  getSeed() {
    return this.seed.join(",");
  }
  next() {
    this.seed = this.nextFrame(this.seed);
    return (this.seed[0] << 16 >>> 0) + this.seed[1];
  }
  /**
   * Calculates `a * b + c` (with 64-bit 2's complement integers)
   */
  multiplyAdd(a, b, c) {
    const out = [0, 0, 0, 0];
    let carry = 0;
    for (let outIndex = 3; outIndex >= 0; outIndex--) {
      for (let bIndex = outIndex; bIndex < 4; bIndex++) {
        const aIndex = 3 - (bIndex - outIndex);
        carry += a[aIndex] * b[bIndex];
      }
      carry += c[outIndex];
      out[outIndex] = carry & 65535;
      carry >>>= 16;
    }
    return out;
  }
  /**
   * The RNG is a Linear Congruential Generator (LCG) in the form: `x_{n + 1} = (a x_n + c) % m`
   *
   * Where: `x_0` is the seed, `x_n` is the random number after n iterations,
   *
   * ````
   * a = 0x5D588B656C078965
   * c = 0x00269EC3
   * m = 2^64
   * ````
   */
  nextFrame(seed, framesToAdvance = 1) {
    const a = [23896, 35685, 27655, 35173];
    const c = [0, 0, 38, 40643];
    for (let i = 0; i < framesToAdvance; i++) {
      seed = this.multiplyAdd(seed, a, c);
    }
    return seed;
  }
  static generateSeed() {
    return [
      Math.trunc(Math.random() * 2 ** 16),
      Math.trunc(Math.random() * 2 ** 16),
      Math.trunc(Math.random() * 2 ** 16),
      Math.trunc(Math.random() * 2 ** 16)
    ];
  }
}
//# sourceMappingURL=prng.js.map
