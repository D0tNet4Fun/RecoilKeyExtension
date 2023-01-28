import { useRecoilState, RecoilRoot } from "recoil";
import renderer from "react-test-renderer";
import { atomFamily } from "../index";
import React from "react";

describe("atomFamily", () => {
  it("can be used to create a state that stores the expected value", () => {
    const stateFactory = atomFamily({
      default: (param: number) => param + 123,
    });
    const state = stateFactory(123);
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
    expect(value).toBe(246);
  });
});
