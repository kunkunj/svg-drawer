import { createPath } from "../../svg/path";
import { SvgComponet } from "./SvgComponet";

export class Path extends SvgComponet {
  el: any = null;
  id: string = "";
  dataset: any = {};
  point: string = "";
  type: string = "";
  constructor(lineStyle: any, dw: DrawerService) {
    super(lineStyle, dw);
    this.el = createPath(
      lineStyle.lineColor || "#000",
      lineStyle.lineWeight || "1",
      lineStyle.fill ? (lineStyle.fill as string) : "transparent"
    );
    this.id = "l" + Date.now();
    this.draw("all");
  }
  setPoint(point: string) {
    this.point = point;
    this.draw("p");
  }
  draw(type?: string) {
    if (type == "all" || type == "p") {
      this.el.setAttribute("d", this.point);
    }
    if (type == "all" || type == "t") {
      this.el.setAttribute("stroke", this.activeColor || this.lineColor);
      this.el.setAttribute("stroke-width", this.lineWeight);
      this.el.setAttribute("fill", this.fill);
    }
  }
}
