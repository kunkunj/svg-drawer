import { DEFAULT_SVGNS } from "../constant/index";

export const createSvgTag = (): SVGElement => {
  const Svg = document.createElementNS(DEFAULT_SVGNS, "svg");
  const Defs = document.createElementNS(DEFAULT_SVGNS, "defs");
  Defs.id = "defs";
  Svg.appendChild(Defs);
  return Svg;
};
