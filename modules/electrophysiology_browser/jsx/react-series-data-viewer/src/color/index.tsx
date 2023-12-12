import * as R from 'ramda';
import {scaleOrdinal} from 'd3-scale';
import {schemeDark2, schemeCategory10} from 'd3-scale-chromatic';

export const colorOrder = scaleOrdinal(
  R.concat(schemeDark2, schemeCategory10)
);

/**
 * hex2rgba
 *
 * @param {object} root - An object
 * @param {string} root.color - An hexadecimal color
 * @param {number} root.alpha - Opacity
 * @returns {string} - An rgba expression
 */
export const hex2rgba = ({color = '#000000', alpha = 1} : {
  color: string,
  alpha: number,
}) => {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
