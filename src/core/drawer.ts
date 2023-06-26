import {
  DEFAULT_CACHE,
  DEFAULT_MULTIPLE,
  DEFAULT_PATH_LINECOLOR,
  DEFAULT_PATH_LINEWEIGHT,
  DEFAULT_SIZE,
  DEFAULT_SVGNS,
  SVG_PATH_DIRECTION,
  SVG_TYPE,
} from "../constant/index";
import { createCache } from "../hooks/cache";
import { useDragComponet } from "../hooks/drag";
import { initCanvas } from "../svg/canvas";
import { Circle } from "../svg/circle";
import { createPath } from "../svg/path";
import {
  addDragEvent,
  addEvent,
  minPoint,
  montageOffset,
  pointOffset,
} from "../util/utils";
import { complairVnode, createVnode } from "../util/vnode";
export let activeComponet: any = null;

export const { CacheQueue, initCache, EnterCache, OutCache } = createCache();
export let { setComponet, clickComponet } = useDragComponet();

export class Drawer implements DrawerService {
  width: number;
  height: number;
  _DOM: HTMLElement;
  cache: number;
  multiple: number;
  canvas?: SVGElement;
  scale: number = 1;
  isEdit: boolean = false;
  group?: HTMLElement | null;
  dev: boolean = true;
  extremePoints: Array<any> = [];
  children: Array<any> = [];
  pointList: Array<any> = [];
  idStore: Record<string, any> = {};
  status: StatusType;
  _isDrag: boolean = false;
  activeEidter: any;
  get isDrag() {
    return this._isDrag;
  }
  set isDrag(val) {
    this._isDrag = val;
    if (val) {
      this._removePoint();
    } else {
      this._addPoint(this.activeComponet);
    }
  }
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
        this._ActiveComponet.setAttribute(
          "stroke",
          this._ActiveComponet.dataset.line
        );
        this._ActiveComponet = val;
        val.setAttribute("stroke", this.activeColor);
        activeComponet = val;
      }
      if (!isSelect) {
        val.setAttribute("stroke", this.activeColor);
        this._ActiveComponet = val;
      }
      this._addPoint(val);
    } else {
      this._removePoint();
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
    this.group = document.getElementById("defs");
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
      if (this.status == "curve") {
        let point = this.activeComponet.getAttribute("d");
        let obj: Record<keyof any, any> = {
          x: e.offsetX,
          y: e.offsetY,
        };
        if (point) {
          const oi =
            this.idStore[this.activeComponet.dataset.id].point[
              this.idStore[this.activeComponet.dataset.id].point.length - 1
            ];
          let x = oi.x;
          let y = oi.y;
          obj.x1 = (e.offsetX - x) / 2 + x;
          obj.y1 = (e.offsetY - y) / 2 + y;
          point += ` ${SVG_PATH_DIRECTION.Q} ${obj.x1} ${obj.y1} ${e.offsetX} ${e.offsetY}`;
          obj.type = SVG_PATH_DIRECTION.Q;
        } else {
          point = `${SVG_PATH_DIRECTION.M} ${e.offsetX} ${e.offsetY}`;
          obj.type = SVG_PATH_DIRECTION.M;
        }
        this.idStore[this.activeComponet.dataset.id].point.push(obj);
        this.activeComponet.setAttribute("d", point);
      }
      let target = e.target as any
      if (target?.nodeName == ' svg') {
        this.activeComponet = this._ActiveComponet.dataset.line
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
    const com = path || this.activeComponet;
    com.setAttribute("stroke", this.activeColor);
    this.status = com.dataset.type as StatusType;
    return () => {
      this.status = "none";
      this._closeFn();
      this.activeComponet = this.activeComponet.dataset.line;
    };
  }
  getCanvasContext() {
    return createVnode(this.children, 2, this);
  }
  setCanvasContext(vnode: Array<Record<string | number, any>>) {
    let g = document.createElementNS(DEFAULT_SVGNS, "g");
    let id = "" + Date.now();
    g.id = id;
    complairVnode(vnode, g);
    this.group?.appendChild(g);
    // return complairVnode(vnode, g);
  }
  private _addPoint(path: HTMLElement) {
    const id = path.dataset.id as string;
    if (this.idStore[id] && this.idStore[id].point.length) {
      let point = this.idStore[id].point;
      this._removePoint();
      let eql =
        point[0].x == point[point.length - 1].x &&
        point[0].y == point[point.length - 1].y;
      for (let index = 0; index < point.length; index++) {
        const element = point[index];
        let circle: any = new Circle(
          {
            r: 4,
            x: element.x,
            y: element.y,
            fill: this.activeColor,
          },
          this
        );
        let circle1: any;
        if (element.x1 && element.y1) {
          circle1 = new Circle(
            {
              r: 4,
              x: element.x1,
              y: element.y1,
              fill: this.activeColor,
            },
            this
          );
          circle1.index = index;
          circle1.type = "curve";
          this.canvas?.appendChild(circle1.el as SVGPathElement);
          this.pointList.push({
            type: "curve",
            el: circle1.el,
          });
        }
        if (!eql || index != 0) {
          circle.type = "point";
          circle.index = index;
          this.canvas?.appendChild(circle.el as SVGPathElement);
          this.pointList.push({
            type: "point",
            el: circle.el,
          });
        }
      }
    }
  }
  private _removePoint() {
    if (this.pointList && this.pointList.length) {
      this.pointList.map((item) => {
        this.canvas?.removeChild(item.el as SVGPathElement);
      });
    }
    this.pointList = [];
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
      const oi =
        this.idStore[this.activeComponet.dataset.id].point[
          this.idStore[this.activeComponet.dataset.id].point.length - 1
        ];
      let point = this.idStore[this.activeComponet.dataset.id].point;
      let x1 = (point[0].x - oi.x) / 2 + oi.x;
      let y1 = (point[0].y - oi.y) / 2 + oi.y;
      this.idStore[this.activeComponet.dataset.id].point.push({
        type: SVG_TYPE[this.status],
        x: point[0].x,
        y: point[0].y,
        ...(this.status == "curve" ? { x1, y1 } : {}),
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
    this._removePoint();
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
    addDragEvent(path);
    this.children.push(path);
    this.canvas?.appendChild(path as SVGPathElement);
    return () => {
      this._closeFn();
      if (this.status == "none") {
        return;
      }
      this.status = "none";
    };
  }
  drawCurve(lineStyle: LineStyleType = {}) {
    if (this.status == "curve") {
      this._closeFn();
    }
    this.status = "curve";
    this.clearLast();
    this._removePoint();
    const path = createPath(
      lineStyle.lineColor || "#000",
      lineStyle.lineWeight || "1",
      lineStyle.fill ? (lineStyle.fill as string) : "transparent"
    );
    this.activeComponet = path;
    const id = "c" + Date.now();
    this.idStore[id] = {
      type: "curve",
      lineStyle: lineStyle,
      point: [],
    };
    path.setAttribute("data-id", id);
    path.setAttribute("data-line", lineStyle.lineColor || "#000");
    path.setAttribute("data-type", "curve");
    addEvent(path, this);
    addDragEvent(path);
    this.children.push(path);
    this.canvas?.appendChild(path as SVGPathElement);
    return () => {
      this._closeFn();
      if (this.status == "none") {
        return;
      }
      this.status = "none";
    };
  }
}
