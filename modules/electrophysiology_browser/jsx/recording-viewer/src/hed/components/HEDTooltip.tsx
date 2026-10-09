import React, {CSSProperties, ReactNode} from 'react';

type TooltipLine = {
  isVertical: boolean,
  lineLength: string,
  lineTop: string,
  lineRight: string,
  lineBottom: string,
  lineLeft: string,
};

type HEDTooltipProps = {
  itemRef: string,
  hoveredItem: string,
  tooltipText: ReactNode,
  tooltipTop: string,
  tooltipRight: string,
  tooltipBottom: string,
  tooltipLeft: string,
  tooltipLines: TooltipLine[],
  extraClasses?: string,
  extraStyles?: CSSProperties,
};

/** Display contextual HED information beside a hovered item. */
function HEDTooltip({
  itemRef,
  hoveredItem,
  tooltipText,
  tooltipTop,
  tooltipRight,
  tooltipBottom,
  tooltipLeft,
  tooltipLines,
  extraStyles,
  extraClasses = '',
}: HEDTooltipProps) {
  return (
    <div
      className={['hed-endorsement-tooltip', extraClasses].join(' ')}
      style={{
        display: itemRef === hoveredItem ? 'inline-block' : 'none',
        top: tooltipTop,
        right: tooltipRight,
        bottom: tooltipBottom,
        left: tooltipLeft,
        ...extraStyles,
      }}
    >
      {tooltipText}
      {tooltipLines.map((line, index) => (
        <div
          key={`tooltip-line-${itemRef}-${index}`}
          className="hed-endorsement-tooltip-line"
          style={{
            width: line.isVertical ? '1px' : line.lineLength,
            height: line.isVertical ? line.lineLength : '1px',
            top: line.lineTop,
            right: line.lineRight,
            bottom: line.lineBottom,
            left: line.lineLeft,
          }}
        />
      ))}
    </div>
  );
}

export default HEDTooltip;
