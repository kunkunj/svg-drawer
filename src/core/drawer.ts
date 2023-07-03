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
import { Path } from "./componets/Path";
import { Rect } from "./componets/Rect";
export let activeComponet: any = null;

export const { CacheQueue, initCache, EnterCache, OutCache } = createCache();
export let { setComponet, clickComponet } = useDragComponet();

export class Drawer implements DrawerService {
  width: number;
  height: number;
  _DOM: HTMLElement;
  isDrawBypoint: any;
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
  activeColor = "rgb(43,219,237)";
  _ActiveComponet: any;
  get activeComponet() {
    return this._ActiveComponet;
  }
  set activeComponet(val) {
    if (typeof val !== "string") {
      const isSelect = !!this.children.find(
        (item: ComponetChild) => item.id === val.id
      );
      if (isSelect && this._ActiveComponet) {
        this._ActiveComponet.setTheme();
        this._ActiveComponet = val;
        activeComponet = val;
      }
      if (!isSelect) {
        this._ActiveComponet = val;
      }
      val.setActive(this.activeColor);
      this._addPoint(val);
    } else {
      this._removePoint();
      this._ActiveComponet.setTheme({ color: val });
      this._ActiveComponet.activeColor = val;
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
        let point = this.activeComponet.point;
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
        this.idStore[this.activeComponet.id].point.push(obj);
        this.activeComponet.setPoint(point);
      }
      if (this.status == "curve") {
        let point = this.activeComponet.point;
        let obj: Record<keyof any, any> = {
          x: e.offsetX,
          y: e.offsetY,
        };
        if (point) {
          const oi =
            this.idStore[this.activeComponet.id].point[
              this.idStore[this.activeComponet.id].point.length - 1
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
        this.idStore[this.activeComponet.id].point.push(obj);
        this.activeComponet.setPoint(point);
      }
      let target = e.target as any;
      if (target?.nodeName == "svg" && this.status == "none") {
        this.activeComponet = this._ActiveComponet?.lineColor || "#000";
      }
    };
  }
  clearLast() {
    if (this._ActiveComponet) {
      this._ActiveComponet.setTheme();
    }
  }
  reStart(path?: HTMLElement) {
    const com = path || this.activeComponet;
    com.setAttribute("stroke", this.activeColor);
    this.status = com.type as StatusType;
    return () => {
      this.status = "none";
      this._closeFn();
      this.activeComponet = this.activeComponet.line;
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
  _addPoint(path: CommonObject) {
    const id = path.id as string;
    if (this.idStore[id] && this.idStore[id].point.length) {
      let point = this.idStore[id].point;
      this._removePoint();
      console.log(path.type)
      if (["curve", "line"].includes(path.type)) {
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
              edit: true,
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
                edit: true,
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
      if (path.type == "rect") {
        for (let index = 0; index < point.length; index++) {
          const element = point[index];
          let circle: any = new Circle(
            {
              r: 4,
              x: element.x,
              y: element.y,
              fill: this.activeColor,
              edit: true,
            },
            this
          );
          circle.t = element.t;
          circle.type = "rect";
          this.canvas?.appendChild(circle.el as SVGPathElement);
          this.pointList[index] = circle;
        }
      }
    }
  }
  _removePoint() {
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
    this.children.map((item: ComponetChild) => {
      const point = this.idStore[item.id as string].point;
      const point2 = pointOffset(point, offset);
      item.setPoint(montageOffset(point2));
    });
  }
  private _filterData() {
    this.children = this.children.filter((item: ComponetChild) => {
      if (!this.idStore[item.id as string].point.length) {
        this.canvas?.removeChild(item.el as SVGPathElement);
        delete this.idStore[item.id as string];
      }
      return this.idStore[item.id as string]?.point?.length;
    });
  }
  private _closeFn() {
    if (
      this.idStore[this.activeComponet.id].lineStyle.autoClose &&
      this.idStore[this.activeComponet.id].point[0]
    ) {
      const oi =
        this.idStore[this.activeComponet.id].point[
          this.idStore[this.activeComponet.id].point.length - 1
        ];
      let point = this.idStore[this.activeComponet.id].point;
      let x1 = (point[0].x - oi.x) / 2 + oi.x;
      let y1 = (point[0].y - oi.y) / 2 + oi.y;
      this.idStore[this.activeComponet.id].point.push({
        type: SVG_TYPE[this.status],
        x: point[0].x,
        y: point[0].y,
        ...(this.status == "curve" ? { x1, y1 } : {}),
      });
      this.activeComponet.setPoint(
        montageOffset(this.idStore[this.activeComponet.id].point)
      );
    }
    this._filterData();
    this.activeComponet = this.activeComponet.lineColor || "#000";
  }
  drawLine(lineStyle: LineStyleType = {}) {
    if (this.status == "line") {
      this._closeFn();
    }
    this.status = "line";
    this.clearLast();
    this._removePoint();
    const path = new Path(lineStyle, this);
    path.type = "line";
    this.activeComponet = path;
    this.idStore[path.id] = {
      type: "line",
      lineStyle: lineStyle,
      point: [],
    };
    addEvent(path, this);
    addDragEvent(path);
    this.children.push(path);
    this.canvas?.appendChild(path.el as SVGPathElement);
    return () => {
      this._closeFn();
      this.activeComponet = path.lineColor;
      this.status = "none";
      return path;
    };
  }
  drawRect(lineStyle: LineStyleType = {}) {
    const rect = new Rect(lineStyle, this);
    rect.type = "rect";
    rect.isEdit = true;
    this.activeComponet = rect;
    this.idStore[rect.id] = {
      type: "rect",
      lineStyle: lineStyle,
      point: [],
    };
    addEvent(rect, this);
    addDragEvent(rect);
    this.children.push(rect);
    this.canvas?.appendChild(rect.el as SVGPathElement);
    return rect;
  }
  drawCurve(lineStyle: LineStyleType = {}) {
    if (this.status == "curve") {
      this._closeFn();
    }
    this.status = "curve";
    this.clearLast();
    this._removePoint();
    const path = new Path(lineStyle, this);
    path.type = "curve";
    this.activeComponet = path;
    this.idStore[path.id] = {
      type: "curve",
      lineStyle: lineStyle,
      point: [],
    };
    addEvent(path, this);
    addDragEvent(path);
    this.children.push(path);
    this.canvas?.appendChild(path.el as SVGPathElement);
    return () => {
      this._closeFn();
      this.activeComponet = path.lineColor;
      this.status = "none";
      return path;
    };
  }
}
