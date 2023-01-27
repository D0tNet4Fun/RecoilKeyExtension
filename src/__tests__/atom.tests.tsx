import { useRecoilState, RecoilRoot } from "recoil";
import renderer from "react-test-renderer";
import { atom } from "../index";
import React from "react";

describe("atom", () => {
  const state = atom({
    default: 123,
  });
  it("should have a key automatically generated", () => {
    expect(state.key).toBeDefined();
    expect(state.key).toBe("atom_0");
  });
  it("should hold the expected value when passed to useRecoilState", () => {
    let value = 0;
    const Dummy = () => {
      [value] = useRecoilState(state);
      return <></>;
    };
    renderer.create(
      <RecoilRoot>
        <Dummy />
      </RecoilRoot>,
    );
    expect(value).toBe(123);
  });
  it("should not share the key with another instance", () => {
    const newState = atom({
      default: "456",
    });
    expect(newState.key).not.toBe(state.key);
  });
});
