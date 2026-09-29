import {scaleLinear} from 'd3-scale';
import {Axis as VxAxis} from '@visx/axis';

type AxisProps = {
  top: number,
  orientation: 'top' | 'right' | 'bottom' | 'left',
  domain: [number, number],
  range: [number, number],
  ticks: number,
  padding: number,
  format: (_: number) => string,
  hideLine: boolean,
};

/** Axis component. */
function Axis({
  top,
  orientation,
  domain,
  range,
  ticks,
  padding,
  format,
  hideLine,
}: AxisProps) {
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
      tickFormat={(value) => format(value.valueOf())}
      hideAxisLine={hideLine}
      hideZero={true}
    />
  );
}

Axis.defaultProps = {
  top: 0,
  orientation: 'bottom',
  domain: [0, 1],
  ticks: 10,
  padding: 0,
  hideLine: false,
  /**
   *
   * @param tick - Tick value to format.
   */
  format: (tick: number) => `${tick}`,
};

export default Axis;
