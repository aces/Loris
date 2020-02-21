import Card from 'Card';

/**
 * Create a three column grid of cards using a CSS grid.
 * The grid is densely populated (if there's a hole in the
 * grid and a later card fits in it, it will be added to it.)
 *
 * @param {array} props - Cards to add to the grid.
 *
 * @return {object} - A React component for a CSS grid of cards
 */
function CSSGrid(props) {
  const grid = {
    display: 'grid',
    gridTemplateColumns: '33% 33% 33%',
    gridAutoFlow: 'row dense',
    gridRowGap: '1em',
    rowGap: '1em',
  };

  let cards = props.Cards.map((value, idx) => {
    let cardID = 'card' + idx;

    let style= {};
    if (value.Width) {
      style.gridColumnEnd = 'span ' + value.Width;
    }
    if (value.Height) {
      style.gridRowEnd = 'span ' + value.Height;
    }
    if (value.Order) {
      style.order = value.Order;
    }

    style.alignSelf = 'stretch';
    return (<Card title={value.Title} id={cardID} key={cardID} style={style}>
      {value.Content}
      </Card>);
  });
  return (
    <div style={grid}>{cards}</div>
  );
}

export default CSSGrid;
