import {scaleLinear} from 'd3-scale';
import {Axis as VxAxis} from '@visx/axis';

type CProps = {
  top: number,
  orientation: 'top' | 'right' | 'bottom' | 'left',
  domain: [number, number],
  range: [number, number],
  ticks: number,
  padding: number,
  format: (_: number) => string,
  hideLine: boolean,
};

/**
 *
 * @param root0
 * @param root0.orientation
 * @param root0.domain
 * @param root0.range
 * @param root0.ticks
 * @param root0.padding
 * @param root0.format
 * @param root0.hideLine
 */
const Axis = ({
  top,
  orientation,
  domain,
  range,
  ticks,
  padding,
  format,
  hideLine,
}: CProps) => {
  const scale = scaleLinear()
    .domain(domain)
    .range(range);

  let tickValues = scale.ticks(ticks);
  tickValues = tickValues.slice(padding, tickValues.length - padding);

  return (
    <VxAxis
      top={top}
      scale={scale}
      orientation={orientation}
      tickValues={tickValues}
      tickFormat={format}
      hideAxisLine={hideLine}
      hideZero={true}
    />
  );
};

Axis.defaultProps = {
  top: 0,
  orientation: 'bottom',
  domain: [0, 1],
  ticks: 10,
  padding: 0,
  hideLine: false,
  /**
   *
   * @param tick
   */
  format: (tick) => `${tick}`,
};

export default Axis;
