// 随机颜色(rgba形式)
export const randomColor = () => {
  return `rgba(${randomColorChannel()},${randomColorChannel()},${randomColorChannel()}`;
};

export const randomColorChannel = () => {
  return Math.floor(Math.random() * 256);
};
