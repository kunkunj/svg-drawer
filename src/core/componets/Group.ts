import { DEFAULT_SVGNS } from "../../constant/index";
import { minPoint } from "../../util/utils";
import { SvgComponet } from "./SvgComponet";

export class Group extends SvgComponet {
  children: any[] = [];
  el: any = null;
  g: any = null;
  id: string = "";
  constructor(opt: GroupOptionType, dw: DrawerService) {
    super(opt, dw);
    if (!opt.list) {
      console.error("options.list must be a componets array");
      return;
    }
    this.initChildren(opt.list);
    this.el = document.createElementNS(DEFAULT_SVGNS, "use");
    this.g = document.createElementNS(DEFAULT_SVGNS, "g");
    this.el.setAttribute("id", "use" + Date.now());
    this.g.setAttribute("id", "g" + Date.now());
    dw.group.appendChild(this.g);
    dw.canvas.appendChild(this.el);
    this.id = "g" + Date.now();
    const { x, y } = minPoint(opt.list);
    this.x = x;
    this.y = y;
    this.draw('all')
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
  }
  append(child: any) {
    this.children.push(child);
  }
  remove(child: any) {
    this.children = this.children.filter((item: any) => item.id !== child.id);
  }
}
