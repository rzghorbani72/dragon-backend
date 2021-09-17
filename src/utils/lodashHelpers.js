import _ from "lodash";
export const isFalse = (x) => _.includes(["false", false], x);
export const isTrue = (x) => _.includes(["true", true], x);
