type ContextOptionType = {
  attr: RectAttr | CircleAttr | EllipseAttr | GlobalAttr | ImageAttr | LineAttr;
};
type GlobalAttr = "width" | "height" | "x" | "y";
type RectAttr = "rx" | "ry";
type CircleAttr = "r";
type EllipseAttr = "rx" | "ry";
type ImageAttr = "href" | "preserveAspectRatio";
type LineAttr = "x1" | "x2" | "y1" | "y2";

export const createAnimateOnContext = (option: any) => {};
export const createAnimateContextOnPath = (option: any) => {};
// export const createAnimateContextOnPath = (option: any) => {

// }
