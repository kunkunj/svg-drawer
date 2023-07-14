/**
 * @parmas{cache} 缓存步数
 */
type DrawerOptions = {
  width?: number;
  height?: number;
  cache?: number;
  multiple?: number;
};
type LineStyleType = {
  lineWeight?: string;
  lineColor?: string;
  fill?: boolean | string;
  autoClose?: Boolean;
};
interface DrawerService {
  activeComponet: any;
  idStore: Record<string, any> = {};
  status: StatusType;
  isDrag: boolean;
  scale: number;
  isEdit: boolean;
  activeEidter: any;
  pointList: Array<CommonObject>
  isDrawBypoint: CircleService & RectService & EllipseService | null;
  _removePoint(): void;
  _addPoint(dw:DrawerService):void
}
type StatusType = "line" | "none" | "curve";
type CommonObject = Record<string | number, any>;

type TypeComponet = SVGPathElement | any;
