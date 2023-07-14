import { DEFAULT_SVGNS } from "../../constant/index";
import { ellipseTopath } from "../../util/utils";
import { SvgComponet } from "./SvgComponet";

export class Ellipse extends SvgComponet implements EllipseService {
  type = "ellipse";
  width: number = 0;
  height: number = 0;
  isEdit: boolean = false;
  point: string = "";
  options: LineStyleType = {};
  id: string;
  constructor(option: CommonObject, dw: DrawerService) {
    super(option, dw);
    this.el = document.createElementNS(DEFAULT_SVGNS, "ellipse");
    dw.isDrawBypoint = this as any;
    this.id = "r" + Date.now();
    this.el.setAttribute("id", this.id);
    this.draw("all");
  }

  moveDrawPosition(width: number, height: number) {
    this.width += width;
    this.height += height;
    this.draw("p");
    this.draw("r");
  }
  startDrawPosition(position: Position) {
    this.x = position.x;
    this.y = position.y;
    this.draw("p");
  }
  setPoint(offset: Position, t: string) {
    if (t == "rt") {
      this.y -= offset.y;
    } else if (t == "rb") {
    } else if (t == "lb") {
      this.x -= offset.x;
    } else {
      this.x -= offset.x;
      this.y -= offset.y;
    }
    this.draw("p");
  }
  setActive(color: string) {
    this.activeColor = color;
    this.el.style.stroke = color;
  }
  draw(type?: string) {
    if (type == "all" || type == "p") {
      this.el.setAttribute("cx", this.x + this.width / 2);
      this.el.setAttribute("cy", this.y + this.height / 2);
    }
    if (type == "all" || type == "r") {
      this.el.setAttribute("rx", this.width / 2 > 0 ? this.width / 2 : 0);
      this.el.setAttribute("ry", this.height / 2 > 0 ? this.height / 2 : 0);
    }
    if (type == "all" || type == "t") {
      this.el.style.stroke = this.lineColor;
      this.el.style.strokeWidth = this.lineWeight;
      this.el.style.fill = this.fill;
    }
  }
  getPath() {
    return ellipseTopath(
      Number(this.el.getAttribute('cx')),
      Number(this.el.getAttribute('cy')),
      Number(this.el.getAttribute('rx')),
      Number(this.el.getAttribute('ry'))
    );
  }
}
