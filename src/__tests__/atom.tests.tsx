import { useRecoilState, RecoilRoot } from "recoil";
import renderer from "react-test-renderer";
import { atom } from "../index";
import React from "react";

describe("atom", () => {
  const state = atom({
    default: 123,
  });
  it("should store the expected value", () => {
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
});
