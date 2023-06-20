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
  let flag: boolean;
  let scale: number = 1;
  function moueScale(e: WheelEvent & Record<"wheelDelta", number>) {
    if (e.wheelDelta > 0) {
      scale += 0.1;
    } else {
      scale = scale >= 0.6 ? scale - 0.1 : 0.5;
    }
    mSvg.style.transform = `scale(${scale})`;
  }
  function up() {
    flag = false;
  }
  mSvg.addEventListener("mousewheel", moueScale as any);
  window.addEventListener("mouseup", up);
  mSvg.onmousedown = function (event: MouseEvent) {
    x = event.offsetX * scale;
    y = event.offsetY * scale;
    flag = true;
  };
  mSvg.onmouseup = up;
  mSvg.onmousemove = function (event: MouseEvent) {
    if (flag && dw.status == 'none') {
      mSvg.style.left =
        event.clientX - parent.getBoundingClientRect().left - x + "px";
      mSvg.style.top =
        event.clientY - parent.getBoundingClientRect().top - y + "px";
    }
  };
}
