import {scaleOrdinal} from 'd3-scale';
// import * as R from 'ramda';
// import {schemeCategory10, schemeSet3} from 'd3-scale-chromatic';
// export const colorOrder = scaleOrdinal(R.concat(schemeCategory10, schemeSet3));
export const colorOrder = scaleOrdinal();

export const hex2rgba = ({color = '#000000', alpha = 1} : {
  color: string,
  alpha: number,
}) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
