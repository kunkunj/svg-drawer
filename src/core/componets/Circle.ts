import { DEFAULT_SVGNS } from "../../constant/index";
import { montageOffset } from "../../util/utils";
import { SvgComponet } from "./SvgComponet";

export class Circle extends SvgComponet implements CircleService {
  id: string;
  r: number = 0;
  index: number = -1;
  flag: boolean = false;
  constructor(option: any, dw?: any) {
    super(option, dw);
    this.r = option.r || 2;
    this.el = document.createElementNS(DEFAULT_SVGNS, "circle");
    this.el.style.cursor = option.type == "edit" ? "n-resize" : "default";
    this.el.onmouseup = (e: MouseEvent) => {
      dw.isEdit = false;
      dw.activeEidter = this;
    };
    this.id = "c" + Date.now();
    this.draw("all");
  }
  draw(type?: string) {
    if (type == "all" || type == "p") {
      this.el.setAttribute("cx", this.x);
      this.el.setAttribute("cy", this.y);
    }
    if (type == "all" || type == "t") {
      this.el.setAttribute("stroke", this.lineColor);
      this.el.setAttribute("stroke-width", this.lineWeight);
      this.el.setAttribute("fill", this.fill);
    }
    if (type == "all" || type == "r") {
      this.el.setAttribute("r", this.r);
    }
  }
  setR(r: number) {
    this.r = r;
    this.draw("r");
  }
}
