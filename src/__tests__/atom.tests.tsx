import { useRecoilState, RecoilRoot } from "recoil";
import renderer from "react-test-renderer";
import { atom } from "../index";
import React from "react";

test("atom", () => {
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

  expect(state.key).toBeDefined();
  expect(state.key).toBe("atom_0");
  expect(value).toBe(123);
});
