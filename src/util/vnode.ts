import { DEFAULT_SVGNS } from "../constant/index";

export const createVnode = function (
  list: Array<HTMLElement>,
  reduce: number,
  dw: DrawerService
): Array<Record<string, any>> {
  let arr = [] as Array<Record<string, any>>;
  for (let index = 0; index < list.length; index++) {
    const obj: Record<string, any> = {};
    if (list[index].children && list[index].children.length) {
      obj.children = createVnode(list[index].children as any, reduce, dw);
    }
    obj.dataset = list[index].dataset;
    obj.attributes = {};
    obj.tagName = list[index].tagName;
    for (let i = 0; i < list[index].attributes.length; i++) {
      obj.attributes[list[index].attributes[i].name] =
        list[index].attributes[i].value;
    }
    //   if(list[index].tagName)
    arr.push(obj);
  }
  return arr;
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
