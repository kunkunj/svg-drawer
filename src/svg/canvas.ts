import { activeComponet, clickComponet } from "../core/drawer";
import { montageOffset, pointOffset } from "../util/utils";
import { createSvgTag } from "./svg";

export const initCanvas = (
  parent: HTMLElement,
  width: number,
  height: number,
  multiple: number,
  dw: DrawerService
): SVGElement => {
  const mSvg = createSvgTag();
  mSvg.setAttribute(
    "style",
    `position: absolute;
    transform-origin: 0 0;
    width:${width * multiple}px;
    height:${height * multiple}px;
    user-select:none;
    left: 0;
    right: 0;
    background: #fbf8f8;`
  );
  parent.style.position = "relative";
  parent.style.overflow = "hidden";
  parent.style.width = width + "px";
  parent.style.height = height + "px";
  parent.style.border = "1px solid #ccc";
  parent.appendChild(mSvg);
  initDrag(mSvg, parent, dw);
  return mSvg;
};
function getContextOffset(mSvg: SVGElement, point: Position) {
  return {
    x: point.x - mSvg.getBoundingClientRect().left,
    y: point.y - mSvg.getBoundingClientRect().top,
  };
}
function initDrag(mSvg: SVGElement, parent: HTMLElement, dw: DrawerService) {
  let x: number;
  let y: number;
  let dx: number;
  let dy: number;
  let flag: boolean;
  let keyDown: boolean;
  let scale: number = 1;
  function moueScale(e: WheelEvent & Record<"wheelDelta", number>) {
    if (e.wheelDelta > 0) {
      scale += 0.1;
    } else {
      scale = scale >= 0.6 ? scale - 0.1 : 0.5;
    }
    dw.scale = scale;
    mSvg.style.transform = `scale(${scale})`;
  }
  function up(event: MouseEvent) {
    dw.isEdit = false;
    flag = false;
    dw.isDrawBypoint && (dw.isDrawBypoint.isEdit = false);
    if (dw.isDrawBypoint) {
      console.log(dw.isDrawBypoint.id);
      dw.idStore[dw.isDrawBypoint.id].point = [
        { x: dw.isDrawBypoint.x, y: dw.isDrawBypoint.y, t: "lt" },
        {
          x: dw.isDrawBypoint.x + dw.isDrawBypoint.width,
          y: dw.isDrawBypoint.y,
          t: "rt",
        },
        {
          x: dw.isDrawBypoint.x + dw.isDrawBypoint.width,
          y: dw.isDrawBypoint.y + dw.isDrawBypoint.height,
          t: "rb",
        },
        {
          x: dw.isDrawBypoint.x,
          y: dw.isDrawBypoint.y + dw.isDrawBypoint.height,
          t: "lb",
        },
      ];
    }
    dw.isDrawBypoint = null;
  }
  mSvg.addEventListener("mousewheel", moueScale as any);
  window.addEventListener("mouseup", up);
  mSvg.onmousedown = function (event: MouseEvent) {
    dx = event.clientX;
    dy = event.clientY;
    if (dw.isEdit) {
      return;
    }
    dw.isDrag = true;
    x = event.offsetX * scale;
    y = event.offsetY * scale;
    flag = true;
    if (dw.isDrawBypoint) {
      dw.isDrawBypoint.startDrawPosition(
        getContextOffset(mSvg, {
          x: event.clientX,
          y: event.clientY,
        })
      );
    }
  };
  window.addEventListener("keydown", keydown);
  function keydown(event: KeyboardEvent) {
    if (event.key == "Control" && !keyDown) {
      keyDown = true;
    }
  }
  window.addEventListener("keyup", keyup);
  function keyup(event: KeyboardEvent) {
    if (event.key == "Control") {
      keyDown = false;
    }
  }
  mSvg.onmouseup = up;
  mSvg.onmousemove = function (event: MouseEvent) {
    let offset = {
      x: (dx - event.clientX) / dw?.scale,
      y: (dy - event.clientY) / dw?.scale,
    };
    if (
      dw.isDrawBypoint &&
      !keyDown &&
      flag &&
      dw.isDrawBypoint.type == "rect" &&
      dw.isDrawBypoint.isEdit
    ) {
      dw.isDrawBypoint.moveDrawPosition(-offset.x, -offset.y);
    }
    if (dw.isEdit && !keyDown && !dw.isDrawBypoint) {
      if (
        dw.idStore[dw.activeComponet.id] &&
        ["curve", "point"].includes(dw.activeEidter.type)
      ) {
        resetPath(dw, offset);
        dx = event.clientX;
        dy = event.clientY;
      }
      if (dw.idStore[dw.activeComponet.id] && dw.activeEidter.type == "rect") {
        resetRect(dw, offset);
        dx = event.clientX;
        dy = event.clientY;
      }
      return;
    }
    if (flag && keyDown && dw.status == "none") {
      mSvg.style.left =
        event.clientX - parent.getBoundingClientRect().left - x + "px";
      mSvg.style.top =
        event.clientY - parent.getBoundingClientRect().top - y + "px";
    }
    //
    if (
      !keyDown &&
      flag &&
      clickComponet.com &&
      activeComponet &&
      clickComponet.com?.id === activeComponet?.id
    ) {
      dw.isDrag = true;
      dw.idStore[clickComponet.com.id].point = pointOffset(
        dw.idStore[clickComponet.com.id].point,
        offset
      );
      if (clickComponet.com.type == "rect") {
        clickComponet.com.setPoint(offset);
        dx = event.clientX;
        dy = event.clientY;
        return;
      }
      clickComponet.com.setPoint(
        montageOffset(dw.idStore[clickComponet.com.id].point)
      );
    }

    dx = event.clientX;
    dy = event.clientY;
  };
}

function resetPath(dw: DrawerService, offset: Position) {
  const point = dw.idStore[dw.activeComponet.id].point;
  if (dw.activeEidter.type == "curve") {
    dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].x1 =
      dw.activeEidter.x - offset.x;
    dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].y1 =
      dw.activeEidter.y - offset.y;
  }
  if (dw.activeEidter.index !== point.length - 1) {
    if (dw.activeEidter.type == "point") {
      dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].x =
        dw.activeEidter.x - offset.x;
      dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].y =
        dw.activeEidter.y - offset.y;
    }
  }
  let eql =
    dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].x ==
      dw.idStore[dw.activeComponet.id].point[0].x &&
    dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].y ==
      dw.idStore[dw.activeComponet.id].point[0].y;
  if (
    dw.activeEidter.index == point.length - 1 &&
    eql &&
    dw.activeEidter.type == "point"
  ) {
    dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].x =
      dw.activeEidter.x - offset.x;
    dw.idStore[dw.activeComponet.id].point[dw.activeEidter.index].y =
      dw.activeEidter.y - offset.y;
    dw.idStore[dw.activeComponet.id].point[0].x = dw.activeEidter.x - offset.x;
    dw.idStore[dw.activeComponet.id].point[0].y = dw.activeEidter.y - offset.y;
  }
  dw.activeEidter.setPosition(
    dw.activeEidter.x - offset.x,
    dw.activeEidter.y - offset.y
  );
  dw.activeComponet.setPoint(
    montageOffset(dw.idStore[dw.activeComponet.id].point)
  );
}
function resetRect(dw: DrawerService, offset: Position) {
  if (dw.activeEidter.t == "lt") {
    // dw.activeComponet.setPoint(offset);
    // dw.activeComponet.moveDrawPosition(offset.x, offset.y);
    dw.idStore[dw.activeComponet.id].point[0].x = dw.activeComponet.x;
    dw.idStore[dw.activeComponet.id].point[0].y = dw.activeComponet.y;
    dw.idStore[dw.activeComponet.id].point[1].x =
      dw.activeComponet.x + dw.activeComponet.width;
    dw.idStore[dw.activeComponet.id].point[1].y = dw.activeComponet.y;
    dw.idStore[dw.activeComponet.id].point[3].y =
      dw.activeComponet.y + dw.activeComponet.height;
    dw.idStore[dw.activeComponet.id].point[3].x = dw.activeComponet.x;
    dw._removePoint();
    dw._addPoint(dw.activeComponet);
  }
}
function getRectByPoint(points:any,pointIndex:number) {
  
}
