import { AtomOptions, ReadOnlySelectorOptions, ReadWriteSelectorOptions } from "recoil";
import { atom, AtomOptionsWithDefault, HasOptionalKey, selector, WithOptionalKey } from "..";

interface TestValueFactory {
  itemWithoutKey: HasOptionalKey;
  itemWithNullKey: HasOptionalKey;
  itemWithEmptyKey: HasOptionalKey;
  getItemWithUserDefinedKey: (userKey: string) => HasOptionalKey;
}

function verifyKey(factory: TestValueFactory) {
  test("when the key is not specified (undefined), expect a key to be auto-generated", () => {
    const item = factory.itemWithoutKey;
    expectKeyIsGenerated(item.key);
  });
  test("when the key is null, expect a key to be auto-generated", () => {
    const item = factory.itemWithNullKey;
    expectKeyIsGenerated(item.key);
  });
  test("when the key is empty string, expect a key to be auto-generated", () => {
    const item = factory.itemWithEmptyKey;
    expectKeyIsGenerated(item.key);
  });
  test("when the key is specified, expect this key to be used", () => {
    const item = factory.getItemWithUserDefinedKey("myKey");
    expect(item.key).toBe("myKey");
  });

  function expectKeyIsGenerated(key?: string | null) {
    expect(key).toBeDefined();
    expect(key!.length).toBeGreaterThan(0);
  }
}

describe("atom", () => {
  const options: WithOptionalKey<AtomOptionsWithDefault<number>> = {
    default: 123,
  };
  const factory: TestValueFactory = {
    itemWithoutKey: atom(options),
    itemWithNullKey: atom({ ...options, key: null }),
    itemWithEmptyKey: atom({ ...options, key: "" }),
    getItemWithUserDefinedKey: (key) => atom({ ...options, key }),
  };
  verifyKey(factory);
});

describe("read-only selector", () => {
  const state = atom({ default: 123 });
  const options: WithOptionalKey<ReadOnlySelectorOptions<number>> = {
    get: ({ get }) => get(state),
  };
  const factory: TestValueFactory = {
    itemWithoutKey: selector({ ...options }),
    itemWithNullKey: selector({ ...options, key: null }),
    itemWithEmptyKey: selector({ ...options, key: "" }),
    getItemWithUserDefinedKey: (key) => selector({ ...options, key }),
  };
  verifyKey(factory);
});

describe("read-write selector", () => {
  const state = atom({ default: 123 });
  const options: WithOptionalKey<ReadWriteSelectorOptions<number>> = {
    get: ({ get }) => get(state),
    set: ({ set }) => set(state, 456),
  };
  const factory: TestValueFactory = {
    itemWithoutKey: selector({ ...options }),
    itemWithNullKey: selector({ ...options, key: null }),
    itemWithEmptyKey: selector({ ...options, key: "" }),
    getItemWithUserDefinedKey: (key) => selector({ ...options, key }),
  };
  verifyKey(factory);
});
