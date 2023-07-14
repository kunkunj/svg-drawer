import { setComponet } from "../core/drawer";

export const addEvent = (el: any, dw: DrawerService) => {
  el.el.style.cursor = "pointer";
  el.el.onclick = function () {
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
    if (data == undefined) {
      return false;
    }
    if (reduce < -1) {
      return data / Math.abs(reduce);
    } else if (reduce > 1) {
      return data * reduce;
    } else {
      return data;
    }
  }
  return list.reduce((total: string, item: Record<keyof any, any>) => {
    return (
      total +
      ` ${item.type} ${compute(item.x1) || ""} ${
        compute(item.y1) || ""
      } ${compute(item.x)} ${compute(item.y)}`
    );
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

export const pointOffset = (
  point: Array<CommonObject>,
  offsetObj: CommonObject
) => {
  return point.map((item: CommonObject) => {
    item.x = item.x - offsetObj.x;
    item.y = item.y - offsetObj.y;
    item.x1 = item.x1 - offsetObj.x;
    item.y1 = item.y1 - offsetObj.y;
    return item;
  });
};

export const addDragEvent = (com: TypeComponet) => {
  com.el.onmousedown = () => {
    setComponet(com);
  };
  com.el.onmouseup = () => {
    setComponet(null);
  };
};

export const countPoint = (dw: DrawerService) => {
  const points = dw.idStore[dw.activeComponet.id].point;
  const arr = points.sort((a: CommonObject, b: CommonObject) => a.y - b.y);
  if (arr[1].y == arr[2].y) {
    let temp1 = arr[0];
    let temp2 = arr[1];
    let temp3 = arr[2];
    arr[0] = temp2.x > temp3.x ? temp3 : temp2;
    arr[1] = temp1;
    arr[2] = temp2.x > temp3.x ? temp2 : temp3;
  } else {
    if (arr[0].x >= arr[1].x) {
      let temp = arr[0];
      arr[0] = arr[1];
      arr[1] = temp;
    }
    if (arr[2].x <= arr[3].x) {
      let temp = arr[2];
      arr[2] = arr[3];
      arr[3] = temp;
    }
  }
  return arr;
};
function bubbleSort(arr: Array<CommonObject>) {
  if (!Array.isArray(arr)) {
    return;
  }

  let sortedFlag = true; //是否是已经有序
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      // console.log(arr[j].x <= arr[i].x,arr[j].y <= arr[i].y)
      if (arr[j].x <= arr[i].x && arr[j].y <= arr[i].y) {
        let temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;

        sortedFlag = false;
      }
    }

    // 优化：如果是本身就是有序的，那么就不需要再继续循环了。
    if (sortedFlag) {
      break;
    }
  }
  let brr = JSON.parse(JSON.stringify(arr));
  return brr;
}

export function rectTopath(
  x: number,
  y: number,
  width: number,
  height: number,
  rx: number,
  ry: number
) {
  /*
   * rx 和 ry 的规则是：
   * 1. 如果其中一个设置为 0 则圆角不生效
   * 2. 如果有一个没有设置则取值为另一个
   */
  rx = rx || ry || 0;
  ry = ry || rx || 0;
  //非数值单位计算，如当宽度像100%则移除
  if (isNaN(x - y + width - height + rx - ry)) return;
  rx = rx > width / 2 ? width / 2 : rx;
  ry = ry > height / 2 ? height / 2 : ry;
  //如果其中一个设置为 0 则圆角不生效
  if (0 == rx || 0 == ry) {
    // var path =
    // 'M' + x + ' ' + y +
    // 'H' + (x + width) + 不推荐用绝对路径，相对路径节省代码量
    // 'V' + (y + height) +
    // 'H' + x +
    // 'z';
    var path =
      "M" + x + " " + y + "h" + width + "v" + height + "h" + -width + "z";
  } else {
    var path =
      "M" +
      x +
      " " +
      (y + ry) +
      " a " +
      rx +
      " " +
      ry +
      " 0 0 1 " +
      rx +
      " " +
      -ry +
      " h " +
      (width - rx - rx) +
      " a " +
      rx +
      " " +
      ry +
      " 0 0 1 " +
      rx +
      " " +
      ry +
      " v " +
      (height - ry - ry) +
      " a " +
      rx +
      " " +
      ry +
      " 0 0 1 " +
      -rx +
      " " +
      ry +
      " h " +
      (rx + rx - width) +
      " a " +
      rx +
      " " +
      ry +
      " 0 0 1 " +
      -rx +
      " " +
      -ry +
      " z";
  }
  return path;
}

export function ellipseTopath(cx: number, cy: number, rx: number, ry: number) {
  //非数值单位计算，如当宽度像100%则移除
  if (isNaN(cx - cy + rx - ry)) return;
  var path =
    "M" +
    (cx - rx) +
    " " +
    cy +
    "a" +
    rx +
    " " +
    ry +
    " 0 1 0 " +
    2 * rx +
    " 0" +
    "a" +
    rx +
    " " +
    ry +
    " 0 1 0 " +
    -2 * rx +
    " 0" +
    "z";
  return path;
}
