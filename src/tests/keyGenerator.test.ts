import { atom, recoilKeyGenerator } from "..";

describe("key generator when creating atoms", () => {
  test("if user-defined then the user-defined key is used", () => {
    recoilKeyGenerator.current = (prefix) => prefix + "_<UUID>"; // not unique, but I'd rather not add the uuid package just for this
    const state = atom({ default: 123 });
    expect(state.key).toBe("atom_<UUID>");
  });
  test("if null then the default key generator is used", () => {
    recoilKeyGenerator.current = null;
    const state = atom({ default: 123 });
    expect(state.key.startsWith("atom_")).toBeTruthy();
  });
  test("if undefined then the default key generator is used", () => {
    recoilKeyGenerator.current = undefined;
    const state = atom({ default: 123 });
    expect(state.key.startsWith("atom_")).toBeTruthy();
  });
});
