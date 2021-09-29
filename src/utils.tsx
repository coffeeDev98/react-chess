declare let window: any;

export const updateDimensions = (setWidthFn: any, setHeightFn: any) => {
  console.log("called");
  setWidthFn(window.innerWidth);
  setHeightFn(window.innerHeight);
};
