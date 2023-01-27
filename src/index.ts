import {
  atom as recoilAtom,
  atomFamily as recoilAtomFamily,
  AtomFamilyOptions,
  AtomOptions,
  Loadable,
  ReadOnlySelectorOptions,
  ReadWriteSelectorOptions,
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
  selector as recoilSelector,
  SerializableParam,
  WrappedValue,
} from "recoil";

export type HasOptionalKey = {
  key?: string | null;
};
export type WithOptionalKey<T> = Omit<T, "key"> & HasOptionalKey;
type Keyed = "atom" | "atomFamily" | "selector";

let keyId = 0;
const generateKey = (prefix: Keyed, item: HasOptionalKey): string => {
  if (item.key) return item.key;
  return `${prefix}_${keyId++}`;
};

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
