import { useRecoilState, useSetRecoilState, RecoilRoot, useRecoilValue } from "recoil";
import renderer from "react-test-renderer";
import { atom, selector } from "../index";
import React from "react";

describe("read-only selector", () => {
  const state = atom({
    default: 123,
  });
  const stateSelector = selector({
    get: ({ get }) => get(state),
  });

  test("should return the state value", () => {
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
    expect(value).toBe(123);
  });
});

describe("read-write selector", () => {
  const [defaultValue, updatedValue] = [123, 456];
  const state = atom({
    default: defaultValue,
  });
  const stateSelector = selector({
    get: ({ get }) => get(state),
    set: ({ set, get, reset }, newValue) => set(state, newValue),
  });

  it("should update the state value", () => {
    let value = 0;
    const Dummy = () => {
      const valueUpdater = useSetRecoilState(stateSelector);
      valueUpdater(updatedValue); // triggers the setter of the selector, which then updates the state value
      [value] = useRecoilState(state);
      return <></>;
    };
    renderer.create(
      <RecoilRoot>
        <Dummy />
      </RecoilRoot>,
    );
    expect(value).toBe(updatedValue);
  });
});
