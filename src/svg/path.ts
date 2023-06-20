import { DEFAULT_SVGNS } from "../constant/index";

export const createPath = (
  lineColor: string,
  lineWeight: string,
  fill: string
): SVGPathElement => {
  const path = document.createElementNS(
    DEFAULT_SVGNS,
    "path"
  ) as SVGPathElement;
  path.setAttribute("stroke", lineColor);
  path.setAttribute("stroke-width", lineColor);
  path.setAttribute("fill", fill);
  return path;
};
