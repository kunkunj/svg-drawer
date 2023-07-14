type Position = {
  x: number;
  y: number;
};

interface CircleService {
  r: number;
  x: number;
  y: number;
}
interface RectService {
  type: string;
  isEdit: boolean;
  id: string;
  width: number;
  height: number;
  options:LineStyleType
  startDrawPosition(position: Position);
  moveDrawPosition(width: number, height: number);
}

interface EllipseService {
  type: string;
  isEdit: boolean;
  width: number;
  height: number;
  options: LineStyleType;
  startDrawPosition(position: Position);
  moveDrawPosition(width: number, height: number);
}

type ComponetChild = any;
