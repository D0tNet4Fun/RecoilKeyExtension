import {
  atom as recoilAtom,
  AtomOptions,
  Loadable,
  ReadOnlySelectorOptions,
  ReadWriteSelectorOptions,
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
  selector as recoilSelector,
  WrappedValue,
} from "recoil";

export type HasOptionalKey = {
  key?: string | null;
};
export type WithOptionalKey<T> = Omit<T, "key"> & HasOptionalKey;
type Keyed = "atom" | "selector";

let keyId = 0;
const generateKey = (prefix: Keyed, item: HasOptionalKey): string => {
  if (item.key) return item.key;
  return `${prefix}_${keyId++}`;
};

export type AtomOptionsWithDefault<T> = AtomOptions<T> & {
  default?: RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T> | T; // from recoil's own AtomOptionsWithDefault
};

/**
 * Creates an atom, which represents a piece of writeable state, using a default key.
 */
export function atom<T>(options: WithOptionalKey<AtomOptionsWithDefault<T>>): RecoilState<T> {
  const atomOptions: AtomOptions<T> = { ...options, key: generateKey("atom", options) };
  return recoilAtom(atomOptions);
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
