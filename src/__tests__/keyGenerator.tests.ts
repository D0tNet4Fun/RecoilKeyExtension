import { atom, recoilKeyGenerator } from "..";

describe("key generator", () => {
  test("when user-defined", () => {
    recoilKeyGenerator.current = (prefix) => prefix + "_<UUID>"; // not unique, but I'd rather not add the uuid package just for this
    const state = atom({ default: 123 });
    expect(state.key).toBe("atom_<UUID>");
  });
  test("when null", () => {
    recoilKeyGenerator.current = null;
    const state = atom({ default: 123 });
    expect(state.key.startsWith("atom_")).toBeTruthy();
  });
  test("when undefined", () => {
    recoilKeyGenerator.current = undefined;
    const state = atom({ default: 123 });
    expect(state.key.startsWith("atom_")).toBeTruthy();
  });
});
