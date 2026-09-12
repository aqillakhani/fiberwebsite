import { describe, expect, it } from "vitest";

import { homeHash, homeKey } from "./address-hash";
import vectors from "./__fixtures__/home-hash.json";

describe("home identity parity with the scraper (Python)", () => {
  for (const vector of vectors) {
    it(`matches for ${JSON.stringify(vector.address)}`, async () => {
      expect(homeKey(vector.address)).toBe(vector.home_key);
      expect(await homeHash(vector.address)).toBe(vector.home_hash);
    });
  }
});
