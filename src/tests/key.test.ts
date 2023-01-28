import {
  ReadOnlySelectorFamilyOptions,
  ReadOnlySelectorOptions,
  ReadWriteSelectorFamilyOptions,
  ReadWriteSelectorOptions,
} from "recoil";
import {
  atom,
  atomFamily,
  AtomFamilyOptionsWithDefault,
  AtomOptionsWithDefault,
  HasOptionalKey,
  selector,
  selectorFamily,
  WithOptionalKey,
} from "../index";

interface TestValueProvider {
  itemWithoutKey: HasOptionalKey;
  itemWithNullKey: HasOptionalKey;
  itemWithEmptyKey: HasOptionalKey;
  getItemWithUserDefinedKey: (userKey: string) => HasOptionalKey;
}

function testKeys(valueProvider: TestValueProvider) {
  test("if the key is not specified (undefined), expect a key to be auto-generated", () => {
    const item = valueProvider.itemWithoutKey;
    expectKeyIsGenerated(item.key);
  });
  test("if the key is null, expect a key to be auto-generated", () => {
    const item = valueProvider.itemWithNullKey;
    expectKeyIsGenerated(item.key);
  });
  test("if the key is empty string, expect a key to be auto-generated", () => {
    const item = valueProvider.itemWithEmptyKey;
    expectKeyIsGenerated(item.key);
  });
  test("if the key is specified, expect this key to be used", () => {
    const uniqueKey = "myKey_" + Math.random(); // unique across the test suite
    const item = valueProvider.getItemWithUserDefinedKey(uniqueKey);
    // expect(item.key).toBe(key); // this is no longer true for atomFamily/selectorFamily because Recoil ensures the key is unique within the scope of the family, i.e. myKey__0
    expect(item.key!.startsWith(uniqueKey)).toBeTruthy();
  });

  function expectKeyIsGenerated(key?: string | null) {
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(0);
  }
}

describe("atom", () => {
  const atomOptions: WithOptionalKey<AtomOptionsWithDefault<number>> = {
    default: 123,
  };
  const valueProvider: TestValueProvider = {
    itemWithoutKey: atom(atomOptions),
    itemWithNullKey: atom({ ...atomOptions, key: null }),
    itemWithEmptyKey: atom({ ...atomOptions, key: "" }),
    getItemWithUserDefinedKey: (key) => atom({ ...atomOptions, key }),
  };
  testKeys(valueProvider);
});

describe("atomFamily", () => {
  // atomFamily is a function whose result is a atom. the test verifies this atom's key.
  const callAtomFamily = (options) => atomFamily(options)(0);
  const atomFamilyOptions: WithOptionalKey<AtomFamilyOptionsWithDefault<number, number>> = {
    default: (_param: number) => 123,
  };
  const valueProvider: TestValueProvider = {
    itemWithoutKey: callAtomFamily(atomFamilyOptions),
    itemWithNullKey: callAtomFamily({ ...atomFamilyOptions, key: null }),
    itemWithEmptyKey: callAtomFamily({ ...atomFamilyOptions, key: "" }),
    getItemWithUserDefinedKey: (key) => callAtomFamily({ ...atomFamilyOptions, key }),
  };
  testKeys(valueProvider);
});

describe("read-only selector", () => {
  const state = atom({ default: 123 });
  const selectorOptions: WithOptionalKey<ReadOnlySelectorOptions<number>> = {
    get: ({ get }) => get(state),
  };
  const valueProvider: TestValueProvider = {
    itemWithoutKey: selector({ ...selectorOptions }),
    itemWithNullKey: selector({ ...selectorOptions, key: null }),
    itemWithEmptyKey: selector({ ...selectorOptions, key: "" }),
    getItemWithUserDefinedKey: (key) => selector({ ...selectorOptions, key }),
  };
  testKeys(valueProvider);
});

describe("read-write selector", () => {
  const state = atom({ default: 123 });
  const selectorOptions: WithOptionalKey<ReadWriteSelectorOptions<number>> = {
    get: ({ get }) => get(state),
    set: ({ set }) => set(state, 456),
  };
  const valueProvider: TestValueProvider = {
    itemWithoutKey: selector({ ...selectorOptions }),
    itemWithNullKey: selector({ ...selectorOptions, key: null }),
    itemWithEmptyKey: selector({ ...selectorOptions, key: "" }),
    getItemWithUserDefinedKey: (key) => selector({ ...selectorOptions, key }),
  };
  testKeys(valueProvider);
});

describe("read-only selector family", () => {
  // selectorFamily is a function whose result is a selector. the test verifies this selector's key.
  const callSelectorFamily = (options) => selectorFamily(options)(0);
  const state = atom({ default: 123 });
  const selectorFamilyOptions: WithOptionalKey<ReadOnlySelectorFamilyOptions<number, number>> = {
    get:
      (param: number) =>
      ({ get }) =>
        param + get(state),
  };
  const valueProvider: TestValueProvider = {
    itemWithoutKey: callSelectorFamily({ ...selectorFamilyOptions }),
    itemWithNullKey: callSelectorFamily({ ...selectorFamilyOptions, key: null }),
    itemWithEmptyKey: callSelectorFamily({ ...selectorFamilyOptions, key: "" }),
    getItemWithUserDefinedKey: (key) => callSelectorFamily({ ...selectorFamilyOptions, key }),
  };
  testKeys(valueProvider);
});

describe("read-write selector family", () => {
  // selectorFamily is a function whose result is a selector. the test verifies this selector's key.
  const callSelectorFamily = (options) => selectorFamily(options)(0);
  const state = atom({ default: 123 });
  const selectorFamilyOptions: WithOptionalKey<ReadWriteSelectorFamilyOptions<number, number>> = {
    get:
      (param: number) =>
      ({ get }) =>
        param + get(state),
    set:
      (param: number) =>
      ({ set }) =>
        set(state, param),
  };
  const valueProvider: TestValueProvider = {
    itemWithoutKey: callSelectorFamily({ ...selectorFamilyOptions }),
    itemWithNullKey: callSelectorFamily({ ...selectorFamilyOptions, key: null }),
    itemWithEmptyKey: callSelectorFamily({ ...selectorFamilyOptions, key: "" }),
    getItemWithUserDefinedKey: (key) => callSelectorFamily({ ...selectorFamilyOptions, key }),
  };
  testKeys(valueProvider);
});
