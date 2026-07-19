import { clearGlobalStates, globalState } from "@/globalState.js";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("globalState", () => {
    it("on create: call the default value callback", () => {
        const counter = globalState<number>("counter", () => 8);
        assert.equal(counter.value, 8);
        clearGlobalStates();
    });
    it("on create: set default value to undefined if no callback passed", () => {
        const counter = globalState<number>("counter");
        assert.equal(counter.value, undefined);
        clearGlobalStates();
    });
    it("on clear: delete all global states", () => {
        let counter = globalState<number>("counter", () => 8);
        assert.equal(counter.value, 8);
        clearGlobalStates();
        counter = globalState<number>("counter", () => 10);
        assert.equal(counter.value, 10);
        clearGlobalStates();
    });
    it("on get: return the already created state", () => {
        const counter = globalState<number>("counter", () => 8);
        const counter2 = globalState<number>("counter");
        assert.equal(counter.value, 8);
        assert.equal(counter2.value, 8);
        counter.value++;
        assert.equal(counter.value, 9);
        assert.equal(counter2.value, 9);
        counter2.value++;
        assert.equal(counter.value, 10);
        assert.equal(counter2.value, 10);
        clearGlobalStates();
    });
});
