export class SvgComponet {
  x: number = 0;
  y: number = 0;
  el: any = null;
  lineColor: string = "#000";
  fill: string = "#000";
  point: any;
  lineWeight: number = 1;
  isVnodeComponet = true;
  activeColor: string = "";
  img: SVGImageElement | undefined;
  constructor(option: any, dw: DrawerService) {
    this.lineColor = option.lineColor || "#000";
    this.lineWeight = option.lineWeight || 1;
    this.fill = option.fill || "transparent";
    this.x = option.x || 0;
    this.y = option.y || 0;
  }
  startDrawPosition(position: { x: number; y: number }) {
    this.x = position.x;
    this.y = position.y;
  }
  draw(type?: string) {}
  setTheme(theme: { color?: string; weight?: number; fill?: string }) {
    this.lineColor = theme?.color || this.lineColor;
    this.lineWeight = theme?.weight || this.lineWeight;
    this.fill = theme?.fill || this.fill;
    this.draw("t");
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.draw("p");
  }
  setActive(color: string) {
    this.activeColor = color;
    this.el.setAttribute("stroke", color);
  }
  getPath() {
    return this.point
  }
  motionByLine(
    list: any,
    options: { dur?: number; repeatCount?: string } = {}
  ) {
    this.x = 0;
    this.y = 0;
    this.draw("p");
    this.el.innerHTML = `<animateMotion dur="${
      options.dur || 5
    }s" repeatCount="${
      options.repeatCount || "indefinite"
    }" path="${list.getPath()}"></animateMotion>`;
    if (this.img) {
      this.img.innerHTML = `<animateMotion dur="${
        options.dur || 5
      }s" repeatCount="${
        options.repeatCount || "indefinite"
      }" path="${list.getPath()}"></animateMotion>`;
    }
  }
}
