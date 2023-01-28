import { useRecoilState, useSetRecoilState, RecoilRoot, useRecoilValue } from "recoil";
import renderer from "react-test-renderer";
import { atom, selectorFamily } from "../index";
import React from "react";

describe("read-only selector family", () => {
  it("can be used to create a selector that should return the state value", () => {
    const state = atom({
      default: 123,
    });
    const stateSelectorFamily = selectorFamily({
      get:
        (param: number) =>
        ({ get }) =>
          param + get(state),
    });
    const stateSelector = stateSelectorFamily(1); // add 1
    let value = 0;
    const Dummy = () => {
      value = useRecoilValue(stateSelector);
      return <></>;
    };
    renderer.create(
      <RecoilRoot>
        <Dummy />
      </RecoilRoot>,
    );
    expect(value).toBe(124); // default + 1
  });
});

describe("read-write selector family", () => {
  it("can be used to create a selector that should update the state value", () => {
    const [defaultValue, updatedValue] = [123, 456];
    const state = atom({
      default: defaultValue,
    });
    const stateSelectorFamily = selectorFamily({
      get:
        (param: number) =>
        ({ get }) =>
          param + get(state),
      set:
        (param: number) =>
        ({ set, get, reset }, newValue) =>
          set(state, param + newValue),
    });
    const stateSelector = stateSelectorFamily(1); // add 1
    let value = 0;
    const Dummy = () => {
      const valueUpdater = useSetRecoilState(stateSelector);
      valueUpdater(updatedValue); // triggers the setter of the selector, which then updates the state value + 1
      [value] = useRecoilState(state);
      return <></>;
    };
    renderer.create(
      <RecoilRoot>
        <Dummy />
      </RecoilRoot>,
    );
    expect(value).toBe(updatedValue + 1);
  });
});
