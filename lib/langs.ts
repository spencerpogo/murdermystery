// Eslint no-shadow hates enums??
// eslint-disable-next-line no-shadow
export enum Lang {
  // We want to be able to check if lang is truthy, and the default enum starting
  //  value, 0, is not, so start at 1
  EN = 1,
  ZH = 2,
}

export default Lang;
