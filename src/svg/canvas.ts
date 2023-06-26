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
  function up() {
    dw.isEdit = false;
    flag = false;
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
    if (dw.isEdit) {
      let offset = {
        x: (dx - event.clientX) / dw?.scale,
        y: (dy - event.clientY) / dw?.scale,
      };
      dx = event.clientX;
      dy = event.clientY;
      if (dw.idStore[dw.activeComponet.dataset.id]) {
        const point = dw.idStore[dw.activeComponet.dataset.id].point;
        if (dw.activeEidter.type == "curve") {
          dw.idStore[dw.activeComponet.dataset.id].point[
            dw.activeEidter.index
          ].x1 = dw.activeEidter.x - offset.x;
          dw.idStore[dw.activeComponet.dataset.id].point[
            dw.activeEidter.index
          ].y1 = dw.activeEidter.y - offset.y;
        }
        if (dw.activeEidter.index !== point.length - 1) {
          if (dw.activeEidter.type == "point") {
            dw.idStore[dw.activeComponet.dataset.id].point[
              dw.activeEidter.index
            ].x = dw.activeEidter.x - offset.x;
            dw.idStore[dw.activeComponet.dataset.id].point[
              dw.activeEidter.index
            ].y = dw.activeEidter.y - offset.y;
          }
        }
        let eql =
          dw.idStore[dw.activeComponet.dataset.id].point[dw.activeEidter.index]
            .x == dw.idStore[dw.activeComponet.dataset.id].point[0].x &&
          dw.idStore[dw.activeComponet.dataset.id].point[dw.activeEidter.index]
            .y == dw.idStore[dw.activeComponet.dataset.id].point[0].y;
        if (
          dw.activeEidter.index == point.length - 1 &&
          eql &&
          dw.activeEidter.type == "point"
        ) {
          dw.idStore[dw.activeComponet.dataset.id].point[
            dw.activeEidter.index
          ].x = dw.activeEidter.x - offset.x;
          dw.idStore[dw.activeComponet.dataset.id].point[
            dw.activeEidter.index
          ].y = dw.activeEidter.y - offset.y;
          dw.idStore[dw.activeComponet.dataset.id].point[0].x =
            dw.activeEidter.x - offset.x;
          dw.idStore[dw.activeComponet.dataset.id].point[0].y =
            dw.activeEidter.y - offset.y;
        }
        dw.activeEidter.setPosition(
          dw.activeEidter.x - offset.x,
          dw.activeEidter.y - offset.y
        );
        console.log(
          dw.idStore[dw.activeComponet.dataset.id].point[dw.activeEidter.index]
        );
        dw.activeComponet.setAttribute(
          "d",
          montageOffset(dw.idStore[dw.activeComponet.dataset.id].point)
        );
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
      clickComponet.com?.dataset.id === activeComponet?.dataset.id
    ) {
      dw.isDrag = true;
      let offset = {
        x: (dx - event.clientX) / scale,
        y: (dy - event.clientY) / scale,
      };
      dx = event.clientX;
      dy = event.clientY;
      dw.idStore[clickComponet.com.dataset.id].point = pointOffset(
        dw.idStore[clickComponet.com.dataset.id].point,
        offset
      );
      clickComponet.com.setAttribute(
        "d",
        montageOffset(dw.idStore[clickComponet.com.dataset.id].point)
      );
    }
  };
}
