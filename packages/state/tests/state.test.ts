import { state } from "@/state.js";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("state", () => {
    it("on update: calls subscribers with the new value", () => {
        const counter = state(0);
        let updatedValue = counter.value;
        let updateCount = 0;

        function onUpdate(newValue: number) {
            updatedValue = newValue;
            updateCount++;
        }

        counter.subscribe(onUpdate);
        counter.value++;

        assert.equal(updatedValue, counter.value);
        assert.equal(updateCount, 1);
    });
    it("on update: don't call unsubscribed", () => {
        const counter = state(0);
        let updateCount = 0;

        function onUpdate(newValue: number) {
            updateCount++;
        }

        counter.subscribe(onUpdate);
        counter.unsubscribe(onUpdate);
        counter.value++;

        assert.equal(updateCount, 0);
    });
});
