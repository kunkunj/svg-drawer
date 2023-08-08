import { DEFAULT_SVGNS } from "../../constant/index";
import { SvgComponet } from "./SvgComponet";

export class Group extends SvgComponet {
  children: any[] = [];
  el: any = null;
  g: any = null;
  id: string = "";
  constructor(opt: GroupOptionType & GroupOptionType,dw:DrawerService) {
    super(opt, dw);
    if (opt.list) {
      this.initChildren(opt.list);
    }
    this.el = document.createElementNS(DEFAULT_SVGNS, "use");
    this.g = document.createElementNS(DEFAULT_SVGNS, "g");
    this.el.setAttribute("id", "use" + Date.now());
    this.g.setAttribute("id", "g" + Date.now());
    this.id = "g" + Date.now();
  }
  initChildren(list: CommonObject[]) {
    this.children = list;
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (typeof element === "object") {
        element.parentGroup = this;
      } else {
        console.error("list must be a componets array");
      }
    }
  }
  draw(type?: string) {
    if (type == "all" || type == "p") {
      this.el.setAttribute("x", this.x);
      this.el.setAttribute("y", this.y);
    }
    if (type == "all" || type == "t") {
      this.el.setAttribute("stroke", this.lineColor);
      this.el.setAttribute("stroke-width", this.lineWeight);
      this.el.setAttribute("fill", this.fill);
    }
  }
  append(child: any) {
    this.children.push(child);
  }
  remove(child: any) {
    this.children = this.children.filter((item: any) => item.id !== child.id);
  }
}
