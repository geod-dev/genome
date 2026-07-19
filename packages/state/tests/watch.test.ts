import { state } from "@/state.js";
import { watch } from "@/watch.js";
import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("watch", () => {
    it("on state update: calls attached method", () => {
        const counter = state(8);

        class TestWatcher {
            updatedValue: number = 0;
            onUpdateCallCount: number = 0;

            @watch(counter)
            onUpdate(newValue: number) {
                this.updatedValue = newValue;
                this.onUpdateCallCount++;
            }
        }
        const watcher = new TestWatcher();

        counter.value++;

        assert.equal(watcher.updatedValue, counter.value);
        assert.equal(watcher.onUpdateCallCount, 1);
    });
});
