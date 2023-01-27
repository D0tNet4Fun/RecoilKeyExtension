import {
  atom as recoilAtom,
  atomFamily as recoilAtomFamily,
  AtomFamilyOptions,
  AtomOptions,
  Loadable,
  ReadOnlySelectorFamilyOptions,
  ReadOnlySelectorOptions,
  ReadWriteSelectorFamilyOptions,
  ReadWriteSelectorOptions,
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
  selector as recoilSelector,
  selectorFamily as recoilSselectorFamily,
  SerializableParam,
  WrappedValue,
} from "recoil";

export interface RecoilKeyGenerator {
  current?: ((prefix: string) => string) | null;
}
/**
 * Allows specifying a user-defined key generator.
 */
export const recoilKeyGenerator: RecoilKeyGenerator = {
  current: undefined,
};

let keyId = 0;
const getAutoIncrementedKey = (prefix: string) => `${prefix}_${keyId++}`;

const generateKey = (prefix: Keyed, item: HasOptionalKey): string => {
  // return the user-defined key if available,
  // or run the user-defined key generator if specified,
  // or return a globally auto-incremented key based on the prefix
  if (item.key) return item.key;
  const keyGenerator = recoilKeyGenerator.current ?? getAutoIncrementedKey;
  return keyGenerator(prefix);
};

export type HasOptionalKey = {
  key?: string | null;
};
export type WithOptionalKey<T> = Omit<T, "key"> & HasOptionalKey;
type Keyed = "atom" | "atomFamily" | "selector" | "selectorFamily";

type AtomOptionsDefault<T> = RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T> | T; // from recoil's own AtomOptionsWithDefault

export type AtomOptionsWithDefault<T> = AtomOptions<T> & {
  default?: AtomOptionsDefault<T>;
};
export type AtomFamilyOptionsWithDefault<T, P extends SerializableParam> = AtomFamilyOptions<T, P> & {
  default?: AtomOptionsDefault<T> | ((param: P) => AtomOptionsDefault<T>); // from recoil's own AtomFamilyOptionsWithDefault
};

/**
 * Creates an atom, which represents a piece of writeable state, using a default key.
 */
export function atom<T>(options: WithOptionalKey<AtomOptionsWithDefault<T>>): RecoilState<T> {
  const atomOptions: AtomOptions<T> = { ...options, key: generateKey("atom", options) };
  return recoilAtom(atomOptions);
}

/**
 * Returns a function which returns a memoized atom for each unique parameter value, using a default key.
 */
export function atomFamily<T, P extends SerializableParam>(
  options: WithOptionalKey<AtomFamilyOptionsWithDefault<T, P>>,
): (param: P) => RecoilState<T> {
  const atomFamilyOptions: AtomFamilyOptions<T, P> = { ...options, key: generateKey("atomFamily", options) };
  return recoilAtomFamily(atomFamilyOptions);
}

/**
 * Creates a selector which represents derived state, using a default key.
 */
export function selector<T>(options: WithOptionalKey<ReadOnlySelectorOptions<T>>): RecoilValueReadOnly<T>;
export function selector<T>(options: WithOptionalKey<ReadWriteSelectorOptions<T>>): RecoilState<T>;
export function selector<T>(
  options: WithOptionalKey<ReadOnlySelectorOptions<T> | WithOptionalKey<ReadWriteSelectorOptions<T>>>,
) {
  const selectorOptions: ReadOnlySelectorOptions<T> | ReadWriteSelectorOptions<T> = {
    ...options,
    key: generateKey("selector", options),
  };
  return recoilSelector(selectorOptions);
}

/**
 * Returns a function which returns a memoized atom for each unique parameter value, using a default key.
 */
export function selectorFamily<T, P extends SerializableParam>(
  options: WithOptionalKey<ReadOnlySelectorFamilyOptions<T, P>>,
): (param: P) => RecoilValueReadOnly<T>;
export function selectorFamily<T, P extends SerializableParam>(
  options: WithOptionalKey<ReadWriteSelectorFamilyOptions<T, P>>,
): (param: P) => RecoilState<T>;
export function selectorFamily<T, P extends SerializableParam>(
  options: WithOptionalKey<ReadOnlySelectorFamilyOptions<T, P> | WithOptionalKey<ReadWriteSelectorFamilyOptions<T, P>>>,
) {
  const selectorFamilyOptions: ReadOnlySelectorFamilyOptions<T, P> | ReadWriteSelectorFamilyOptions<T, P> = {
    ...options,
    key: generateKey("selectorFamily", options),
  };
  return recoilSselectorFamily(selectorFamilyOptions);
}
