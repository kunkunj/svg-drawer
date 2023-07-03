import { DEFAULT_SVGNS } from "../../constant/index";
import { SvgComponet } from "./SvgComponet";

export class Rect extends SvgComponet implements RectService {
  id: string;
  width: number = 0;
  height: number = 0;
  ry: number = 0;
  rx: number = 0;
  isEdit: boolean = false;
  type: string = "rect";
  constructor(option: any, dw?: any) {
    super(option, dw);
    this.el = document.createElementNS(DEFAULT_SVGNS, "rect");
    dw.isDrawBypoint = this;
    this.id = "r" + Date.now();
    this.draw("all");
  }
  moveDrawPosition(width: number, height: number) {
    this.width += width;
    this.height += height;
    this.draw("c");
    this.draw("t");
  }
  startDrawPosition(position: Position) {
    this.x = position.x
    this.y = position.y
    this.draw("p");
  }
  setPoint(offset: Position) {
    this.x -= offset.x
    this.y -= offset.y
    this.draw("p");
  }
  draw(type?: string) {
    if (type == "all" || type == "p") {
      this.el.setAttribute("x", this.x);
      this.el.setAttribute("y", this.y);
    }
    if (type == "all" || type == "t") {
      this.el.setAttribute("stroke", this.lineColor);
      this.el.style.strokeWidth = this.lineWeight;
      this.el.style.fill = this.fill;
    }
    if (type == "all" || type == "c") {
      this.el.setAttribute("width", this.width);
      this.el.setAttribute("height", this.height);
    }
  }
}
