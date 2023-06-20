import {
  DEFAULT_CACHE,
  DEFAULT_MULTIPLE,
  DEFAULT_PATH_LINECOLOR,
  DEFAULT_PATH_LINEWEIGHT,
  DEFAULT_SIZE,
  SVG_PATH_DIRECTION,
} from "../constant/index";
import { createCache } from "../hooks/cache";
import { initCanvas } from "../svg/canvas";
import { createPath } from "../svg/path";
import { addEvent, minPoint, montageOffset, pointOffset } from "../util/utils";
import { createVnode } from "../util/vnode";

export const { CacheQueue, initCache, EnterCache, OutCache } = createCache();

export class Drawer implements DrawerService {
  width: number;
  height: number;
  _DOM: HTMLElement;
  cache: number;
  multiple: number;
  canvas?: SVGElement;
  dev = false;
  children: Array<any> = [];
  idStore: Record<string, any> = {};
  status: StatusType;
  activeColor = "rgb(43 219 237)";
  _ActiveComponet: any;
  get activeComponet() {
    return this._ActiveComponet;
  }
  set activeComponet(val) {
    if (typeof val !== "string") {
      const isSelect = !!this.children.find(
        (item: any) => item.dataset.id === val.dataset.id
      );
      if (isSelect && this._ActiveComponet) {
        val.setAttribute("stroke", this.activeColor);
        this._ActiveComponet.setAttribute(
          "stroke",
          this._ActiveComponet.dataset.line
        );
        this._ActiveComponet = val;
      }
      if (!isSelect) {
        val.setAttribute("stroke", this.activeColor);
        this._ActiveComponet = val;
      }
    } else {
      this._ActiveComponet.setAttribute("stroke", val);
    }
  }
  constructor(el: HTMLElement, option?: DrawerOptions) {
    if (!el || typeof el !== "object" || !el.tagName) {
      throw new Error("You need to pass in a HTMLElement");
    }
    this.width = option?.width || DEFAULT_SIZE;
    this.height = option?.height || DEFAULT_SIZE;
    this.cache = option?.cache || DEFAULT_CACHE;
    this.multiple = option?.multiple || DEFAULT_MULTIPLE;
    this._DOM = el;
    this.status = "none";
    this.init();
    initCache(this.cache);
  }
  private init() {
    this.canvas = initCanvas(
      this._DOM,
      this.width,
      this.height,
      this.multiple,
      this
    );
    this.canvas.onclick = (e: MouseEvent) => {
      if (this.status == "line") {
        let point = this.activeComponet.getAttribute("d");
        let obj: Record<keyof any, any> = {
          x: e.offsetX,
          y: e.offsetY,
        };
        if (point) {
          point += ` ${SVG_PATH_DIRECTION.L} ${e.offsetX} ${e.offsetY}`;
          obj.type = SVG_PATH_DIRECTION.L;
        } else {
          point = `${SVG_PATH_DIRECTION.M} ${e.offsetX} ${e.offsetY}`;
          obj.type = SVG_PATH_DIRECTION.M;
        }
        this.idStore[this.activeComponet.dataset.id].point.push(obj);
        this.activeComponet.setAttribute("d", point);
      }
    };
  }
  clearLast() {
    if (this._ActiveComponet) {
      this._ActiveComponet.setAttribute(
        "stroke",
        this._ActiveComponet.dataset.line
      );
    }
  }
  reStart(path?: HTMLElement) {
    const com = path || this.activeComponet
    com.setAttribute("stroke", this.activeColor);
    this.status = com.dataset.type as StatusType;
    return () => {
      this.status = "none";
      this._closeFn()
      this.activeComponet = this.activeComponet.dataset.line;
    };
  }
  getCanvasContext() {
    return createVnode(this.children, 2, this);
  }
  setBlank(offsetIn?: { x: number; y: number }) {
    if (offsetIn && (!offsetIn.x || !offsetIn.y)) {
      throw new Error("offset need x and y");
    }
    this._filterData();
    let arr = [];
    for (const key in this.idStore) {
      arr.push(minPoint(this.idStore[key].point));
    }
    const offset = offsetIn || minPoint(arr);
    this.children.map((item: HTMLElement) => {
      const point = this.idStore[item.dataset.id as string].point;
      const point2 = pointOffset(point, offset);
      item.setAttribute("d", montageOffset(point2));
    });
  }
  private _filterData() {
    this.children = this.children.filter((item: SVGPathElement) => {
      if (!this.idStore[item.dataset.id as string].point.length) {
        this.canvas?.removeChild(item as SVGPathElement);
        delete this.idStore[item.dataset.id as string];
      }
      return this.idStore[item.dataset.id as string]?.point?.length;
    });
  }
  private _closeFn() {
    if (
      this.idStore[this.activeComponet.dataset.id].lineStyle.autoClose &&
      this.idStore[this.activeComponet.dataset.id].point[0]
    ) {
      this.idStore[this.activeComponet.dataset.id].point.push({
        type: SVG_PATH_DIRECTION.L,
        x: this.idStore[this.activeComponet.dataset.id].point[0].x,
        y: this.idStore[this.activeComponet.dataset.id].point[0].y,
      });
      this.activeComponet.setAttribute(
        "d",
        montageOffset(this.idStore[this.activeComponet.dataset.id].point)
      );
    }
    this._filterData();
    this.activeComponet = this.activeComponet.dataset.line || "#000";
  }
  drawLine(lineStyle: LineStyleType = {}) {
    if (this.status == "line") {
      this._closeFn();
    }
    this.status = "line";
    this.clearLast();
    const path = createPath(
      lineStyle.lineColor || "#000",
      lineStyle.lineWeight || "1",
      lineStyle.fill ? (lineStyle.fill as string) : "transparent"
    );
    this.activeComponet = path;
    const id = "l" + Date.now();
    this.idStore[id] = {
      type: "line",
      lineStyle: lineStyle,
      point: [],
    };
    path.setAttribute("data-id", id);
    path.setAttribute("data-line", lineStyle.lineColor || "#000");
    path.setAttribute("data-type", "line");
    addEvent(path, this);
    this.children.push(path);
    this.canvas?.appendChild(path as SVGPathElement);
    return () => {
      if (this.status == "none") {
        return;
      }
      this.status = "none";
      this._closeFn();
    };
  }
}
