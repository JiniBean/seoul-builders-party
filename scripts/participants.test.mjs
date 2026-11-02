import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { validateParticipant, validateDirectory } from "./validate-participants.mjs";
const sample = { id: "test-builder", name: "테스트", role: "메이커", message: "함께 만들어요", color: "#FF5934", shape: "round", accessory: "none" };
test("valid character accepted", () => assert.deepEqual(validateParticipant(sample, "test-builder.json"), []));
test("filename and ID must match", () => assert.ok(validateParticipant(sample, "other-builder.json").length));
test("duplicate ID is rejected", () => assert.ok(validateParticipant(sample, "test-builder.json", new Set(["test-builder"])).length));
test("message length limited", () => assert.ok(validateParticipant({ ...sample, message: "가".repeat(37) }, "test-builder.json").length));
test("unsupported color rejected", () => assert.ok(validateParticipant({ ...sample, color: "url(evil)" }, "test-builder.json").length));
test("unsupported shape/accessory rejected", () => {
  assert.ok(validateParticipant({ ...sample, shape: "html" }, "test-builder.json").length);
  assert.ok(validateParticipant({ ...sample, accessory: "script" }, "test-builder.json").length);
});
test("empty fields and unexpected properties rejected", () => {
  assert.ok(validateParticipant({ ...sample, name: " " }, "test-builder.json").length);
  assert.ok(validateParticipant({ ...sample, email: "not-allowed" }, "test-builder.json").length);
});
test("all repository examples valid", async () => {
  const result = await validateDirectory(fileURLToPath(new URL("../src/participants", import.meta.url)));
  assert.equal(result.errors.length, 0, result.errors.join("\n"));
  assert.ok(result.count > 0, "At least one valid participant is required.");
});
