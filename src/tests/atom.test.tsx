import { useRecoilState, RecoilRoot } from "recoil";
import renderer from "react-test-renderer";
import { atom } from "../index";
import React from "react";

describe("atom", () => {
  it("should store the expected value", () => {
    const state = atom({
      default: 123,
    });
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
