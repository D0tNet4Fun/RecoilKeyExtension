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

type Keyless<T> = Omit<T, "key">;
type Keyed = "atom" | "selector";

let keyId = 0;
const generateKey = (prefix: Keyed): string => `${prefix}_${keyId++}`;

export type AtomOptionsWithDefault<T> = AtomOptions<T> & {
  default?: RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T> | T; // from recoil's own AtomOptionsWithDefault
};

/**
 * Creates an atom, which represents a piece of writeable state, using a default key.
 */
export function atom<T>(options: Keyless<AtomOptionsWithDefault<T>>): RecoilState<T> {
  const atomOptions: AtomOptions<T> = { ...options, key: generateKey("atom") };
  return recoilAtom(atomOptions);
}

/**
 * Creates a selector which represents derived state, using a default key.
 */
export function selector<T>(options: Keyless<ReadOnlySelectorOptions<T>>): RecoilValueReadOnly<T>;
export function selector<T>(options: Keyless<ReadWriteSelectorOptions<T>>): RecoilState<T>;
export function selector<T>(options: Keyless<ReadOnlySelectorOptions<T> | Keyless<ReadWriteSelectorOptions<T>>>) {
  const selectorOptions: ReadOnlySelectorOptions<T> | ReadWriteSelectorOptions<T> = {
    ...options,
    key: generateKey("selector"),
  };
  return recoilSelector(selectorOptions);
}
