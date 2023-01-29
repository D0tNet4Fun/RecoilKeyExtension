# recoil-key-extension

`recoil-key-extension` is a library that removes the restriction of specifying keys when using `recoil`.

## How it works
The library is designed to "patch" `recoil` by wrapping those functions whose parameters require a key. This results in code looking just like using `recoil`, but without `key`. These wrapped functions are:
 - `atom`
 - `atomFamily`
 - `selector`
 - `selectorFamily`
 
 The return types of the wrappers match the return types of the `recoil` functions. For example, this allows an atom created using `recoil-key-extension` to be passed to `useRecoilState`.

## Usage
Instead of:
```typescript
import { atom } from 'recoil'

const myAtom = atom({
    key: "atom",
    default: 123,
    // others
});
```
use:
```typescript
import { atom } from 'recoil-key-extension'

const myAtom = atom({
    default: 123,
    // others
});
```
Same thing for `atomFamily`, `selector` and `selectorFamily`.

## How keys are generated

By default, the keys are generated as a combination of the wrapped `recoil` function name and an auto-incremented ID, such as:
 - atom_0
 - atomFamily_1
 - selector_2
 - selectorFamily_3

### Custom key generator
 The key generation logic can be overriden. For example here's how to create unique keys using UUIDs:
 ```typescript
 import { recoilKeyGenerator } from 'recoil-key-extension'
 import { v4 as uuidv4 } from 'uuid'

 recoilKeyGenerator.current = prefix => `${prefix}_${uuidv4()}`; // returns "atom_<UUID>"
 ```

 ## User keys
 Keys are optional and they can still be specified if needed.
```typescript
import { atom } from 'recoil-key-extension'

const myAtom1 = atom({
    default: 1,
});
const myAtom2 = atom({
    default: 2,
});
const myAtom3 = atom({
    key: "atom #3 - important",
    default: 3,
});
```
⚠️ In the example above, `myAtom3` could also be created using `recoil`'s `atom` function -- once this is imported. The purpose of this feature is to not require this import. Otherwise there's no difference between the original/wrapped `atom` function in this case.

## License

`recoil-key-extension` is free and open-source, under [MIT](LICENSE).
