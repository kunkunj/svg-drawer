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
  startDrawPosition(position: Position);
  moveDrawPosition(width: number, height: number);
}

type ComponetChild = any