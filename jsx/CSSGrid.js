import Card from 'Card';
import React, {useState, useEffect, useRef} from 'react';

/**
 * Create a three column grid of cards using a CSS grid.
 * The grid is densely populated (if there's a hole in the
 * grid and a later card fits in it, it will be added to it.)
 *
 * The props must have a 'Cards' value and each card should
 * be an object that has, at a minimum, a Title and a Content
 * where the Content is the value to display in the card and
 * the Title is the card title. Width, Height, and Order properties
 * may also be optionally specified for each card.
 *
 * @param {array} props - Cards to add to the grid.
 *
 * @return {object} - A React component for a CSS grid of cards
 */
function CSSGrid(props) {
    const cardsRef = useRef(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [panelHeights, setPanelHeights] = useState({});

    useEffect(() => {
        // Upon load, store the calculated height of every rendered panel
        // in state, so that we can use it to dynamically set the heights
        // (number of rows spanned) in the CSS grid.
        if (cardsRef.current.childNodes.length < 1) {
            return;
        }

        // All rows in the width have the same width, so only look
        // up the first.
        const wSize = cardsRef.current.childNodes[0].clientWidth;

        // Do not change the state unless the width changed to avoid
        // infinite re-render loops.
        if (wSize == cardWidth) {
            return;
        }
        setCardWidth(wSize);

        // Store the height in pixels of each panel. The first node is
        // the CSS grid element, the first child is the panel.
        // The childNodes are the DOM elements, not the React elements,
        // but we make the assumption that they're in the same order
        // as props.Cards in the DOM, and any re-arranging was done by
        // using the CSS order property.
        const heights = Array.from(cardsRef.current.childNodes.values()).map(
            (node) => (node.firstChild.clientHeight)
        );
        setPanelHeights(heights);
    });
    const grid = {
        display: 'grid',
        gridTemplateColumns: '33% 33% 33%',
        gridAutoFlow: 'row dense',
        gridRowGap: '1em',
        rowGap: '1em',
    };

    let orderedCards = [];
    for (let i = 0; i < props.Cards.length; i++) {
       orderedCards.push(props.Cards[i]);
        if (!props.Cards[i].Order) {
            orderedCards[i].Order = 1;
        }
    }
    orderedCards.sort((a, b) => (a.Order - b.Order));

    let lastLargeCardIdx = 0;
    for (let i = 0; i < orderedCards.length; i++) {
        if (orderedCards[i].Width >= 2) {
            lastLargeCardIdx = i;
        }
    }

    const cards = orderedCards.map((value, idx) => {
        let cardID = 'card' + idx;

        let pSize;
        let style = {};
        if (value.Width) {
            style.gridColumnEnd = 'span ' + value.Width;
            if (value.Width == 1 || value.Width === 3) {
                if (idx < lastLargeCardIdx) {
                    style.gridColumnStart = 1;
                }
            } else if (value.Width == 2) {
                style.gridColumnStart = 2;
            }
        }

        if (cardWidth != 0) {
            const pxHeight = panelHeights[idx];
            let spanHeight = 1;
            const hSpan = 100;
            if ((pxHeight % hSpan) === 0) {
                spanHeight = pxHeight / hSpan;
            } else {
                spanHeight = Math.floor(pxHeight / hSpan) + 1;
            }
            style.gridRowEnd = 'span ' + spanHeight;
            pSize = spanHeight * hSpan;
        }
        if (value.Order) {
            style.order = value.Order;
        }

        style.alignSelf = 'stretch';
        return (
            <Card title={value.Title} id={cardID} key={cardID} style={style}
                cardSize={pSize}>
            {value.Content}
            </Card>
        );
    });

    return (
        <div ref={cardsRef} style={grid}>{cards}</div>
    );
}

export default CSSGrid;
