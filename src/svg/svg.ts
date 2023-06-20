import { DEFAULT_SVGNS } from "../constant/index";

export const createSvgTag = (): SVGElement => {
  const Svg = document.createElementNS(DEFAULT_SVGNS, "svg");
  return Svg;
};
