import { DEFAULT_SVGNS } from "../../constant/index";
import { rectTopath } from "../../util/utils";
import { setComponet } from "../drawer";
import { SvgComponet } from "./SvgComponet";

export class Rect extends SvgComponet implements RectService {
  id: string;
  img: any;
  width: number = 0;
  height: number = 0;
  ry: number = 0;
  rx: number = 0;
  isEdit: boolean = false;
  options: LineStyleType = {};
  type: string = "rect";
  dw: any;
  constructor(option: any, dw?: any) {
    super(option, dw);
    this.rx = option.rx || 0;
    this.ry = option.ry || 0;
    this.el = document.createElementNS(DEFAULT_SVGNS, "rect");
    dw.isDrawBypoint = this;
    this.dw = dw;
    this.id = "r" + Date.now();
    this.el.setAttribute("id", this.id);
    this.draw("all");
  }
  setRadius(rx: number, ry: number) {
    this.rx = rx;
    this.ry = ry;
    this.draw("ra");
  }
  setImage(url: string, ratio: string = "none") {
    this.img = document.createElementNS(DEFAULT_SVGNS, "image");
    this.img.setAttribute("href", url);
    this.img.onmousedown = () => {
      setComponet(this);
    };
    this.img.onmouseup = () => {
      setComponet(null);
    };
    this.img.style.cursor = "pointer";
    this.img.onclick = () => {
      if (this.dw.status == "none") {
        this.dw.activeComponet = this;
      }
    };
    this.img.setAttribute("preserveAspectRatio", ratio);
    this.dw.canvas?.appendChild(this.img as SVGPathElement);
    this.draw("all");
  }
  moveDrawPosition(width: number, height: number) {
    this.width += width;
    this.height += height;
    this.draw("c");
    this.draw("t");
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
      this.el.setAttribute("x", this.x);
      this.el.setAttribute("y", this.y);
      this.img?.setAttribute("x", this.x);
      this.img?.setAttribute("y", this.y);
    }
    if (type == "all" || type == "ra") {
      this.el.setAttribute("rx", this.rx);
      this.el.setAttribute("ry", this.ry);
    }
    if (type == "all" || type == "t") {
      this.el.style.stroke = this.lineColor;
      this.el.style.strokeWidth = this.lineWeight;
      this.el.style.fill = this.fill;
    }
    if (type == "all" || type == "c") {
      this.el.setAttribute("width", this.width > 0 ? this.width : 0);
      this.el.setAttribute("height", this.height > 0 ? this.height : 0);
      this.img?.setAttribute("width", this.width > 0 ? this.width : 0);
      this.img?.setAttribute("height", this.height > 0 ? this.height : 0);
    }
  }
  getPath() {
    return rectTopath(
      Number(this.el.getAttribute("x")),
      Number(this.el.getAttribute("y")),
      Number(this.el.getAttribute("width")),
      Number(this.el.getAttribute("height")),
      Number(this.el.getAttribute("rx")),
      Number(this.el.getAttribute("ry"))
    );
  }
}
