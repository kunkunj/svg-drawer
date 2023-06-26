export const useDragComponet = (com?: TypeComponet) => {
  let clickComponet: { com?: TypeComponet } = {};
  function setComponet(com: TypeComponet) {
    clickComponet.com = com;
  }
  return {
    clickComponet,
    setComponet,
  };
};
