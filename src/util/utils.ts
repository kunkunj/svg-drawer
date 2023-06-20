export const addEvent = (el: any, dw: DrawerService) => {
  el.style.cursor = "pointer";
  el.onclick = function () {
    if (dw.status == "none") {
      dw.activeComponet = el;
    }
  };
};

export const getAttribute = (el: any, data: string) => {
  return el.getAttribute(data);
};

export const montageOffset = (list: any, reduce: number = 1) => {
  function compute(data: number) {
    if (reduce < -1) {
      return data / Math.abs(reduce);
    } else if (reduce > 1) {
      return data * reduce;
    } else {
      return data;
    }
  }
  return list.reduce((total: string, item: Record<keyof any, any>) => {
    return total + ` ${item.type} ${compute(item.x)} ${compute(item.y)}`;
  }, "");
};

export const minPoint = (path: Array<CommonObject>) => {
  let obj: CommonObject = {};
  obj.x = path.reduce((min: number, item: CommonObject) => {
    return min > item.x ? item.x : min;
  }, path[0].x);
  obj.y = path.reduce((min: number, item: CommonObject) => {
    return min > item.y ? item.y : min;
  }, path[0].y);
  return obj;
};

export const pointOffset = (point:Array<CommonObject>,offsetObj:CommonObject) => {
  return point.map((item: CommonObject) => {
    item.x = item.x - offsetObj.x
    item.y = item.y - offsetObj.y
    return item
  })
}