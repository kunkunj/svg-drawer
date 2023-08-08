export class Group {
    children: any;
    constructor() {}
    set(child: any) {
      this.children.push(child);
    }
  }
  