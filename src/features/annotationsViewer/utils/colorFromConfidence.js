export const colorFromConfidence = (conf) => {
  const g = conf * 255;
  const r = (1 - conf) * 255;
  return `rgb(${r},${g},0)`;
};
