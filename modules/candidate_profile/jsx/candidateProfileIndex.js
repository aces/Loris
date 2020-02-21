import React, {Component} from 'react';

import Loader from 'Loader';
import Card from 'Card';

/**
 * Candidate Profile Menu
 *
 * Create a candidate profile menu
 *
 * @author  Shen Wang
 * @version 1.0.0
 * */
export class CandidateProfileIndex extends Component {
   /**
    * Construct the React component
    *
    * @param {array} props - The list of React props
    */
  constructor(props) {
    super(props);
    this.state = {
        cards: [],
    };
  }

  /**
   * Render the react component
   *
   * @return {object} - A rendered CSS grid containing all cards.
   */
  render() {
    // Show a loading spin wheel until at least 1 card is loaded.
    if (this.props.Cards.length < 1) {
      return <Loader/>;
    }

    const grid = {
        display: 'grid',
        gridTemplateColumns: '33% 33% 33%',
        gridAutoFlow: 'row dense',
        gridRowGap: '1em',
        rowGap: '1em',
    };

     let cards = this.props.Cards.map((value, idx) => {
         let cardID = 'card' + idx;
         return (<Card title={value.Title} id={cardID} key={cardID}>
                 {value.Content}
             </Card>);
     });
    return (
      <div style={grid}>{cards}</div>
    );
  }
}
