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
  status: "line" | "none";
}
type StatusType = "line" | "none";
type CommonObject = Record<string | number, any>;
