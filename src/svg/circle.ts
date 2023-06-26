import { DEFAULT_SVGNS } from "../constant/index";
import { montageOffset } from "../util/utils";

export class Circle {
  r: number;
  lineColor: string;
  lineWeight: number;
  x: number;
  y: number;
  index: number = -1;
  fill: string;
  flag: boolean = false;
  el: any = null;
  constructor(option: any, dw?: any) {
    this.r = option.r || 2;
    this.lineColor = option.lineColor || "#000";
    this.lineWeight = option.lineWeight || 1;
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.fill = option.fill || "transparent";
    this.el = document.createElementNS(DEFAULT_SVGNS, "circle");
    this.el.style.cursor = "n-resize";
    this.el.onmousedown = (event: MouseEvent) => {
      dw.isEdit = true;
      dw.activeEidter = this
    };
    this.el.onmouseup = (e: MouseEvent) => {
      dw.isEdit = false;
    };
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
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.draw("p");
  }
  setTheme(theme: { color: string; weight: number; fill: string }) {
    this.lineColor = theme.color || this.lineColor;
    this.lineWeight = theme.weight || this.lineWeight;
    this.fill = theme.fill || this.fill;
    this.draw("t");
  }
  setR(r: number) {
    this.r = r;
    this.draw("r");
  }
}
