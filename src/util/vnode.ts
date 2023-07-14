import { DEFAULT_SVGNS } from "../constant/index";

export const createVnode = function (
  list: Array<HTMLElement>,
  dw: DrawerService
): Array<Record<string, any>> {
  console.log(list)
  return list;
};
export const complairVnode = function (
  vnode: Array<Record<string, any>>,
  parent: SVGGElement
) {
  for (let index = 0; index < vnode.length; index++) {
    const element = vnode[index];
    let dom = document.createElementNS(DEFAULT_SVGNS, element.tagName);
    dom.attributes = element.attributes;
    dom.dataset = element.dataset;
    parent.appendChild(dom);
  }
};
