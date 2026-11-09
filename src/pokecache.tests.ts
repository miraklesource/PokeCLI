import { Cache } from "./pokecache.js";
import { test, expect } from "vitest";

test("stores values under separate keys and replaces an existing value", () => {
    const cache = new Cache(60_000);
    try {
        cache.add("first", { name: "original" });
        cache.add("second", 0);
        cache.add("first", { name: "updated" });

        expect(cache.get<{ name: string }>("first")).toEqual({
            name: "updated",
        });
        expect(cache.get<number>("second")).toBe(0);
        expect(cache.get("missing")).toBeUndefined();
    } finally {
        cache.stopReapLoop();
    }
});

test("reaps old entries in the background", async () => {
    const cache = new Cache(20);
    try {
        cache.add("page", { name: "locations" });
        expect(cache.get("page")).toEqual({ name: "locations" });
        await expect.poll(() => cache.get("page")).toBeUndefined();
    } finally {
        cache.stopReapLoop();
    }
});

test("stops the cleanup timer", async () => {
    const cache = new Cache(20);
    cache.stopReapLoop();
    cache.add("page", "locations");

    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(cache.get("page")).toBe("locations");
});
