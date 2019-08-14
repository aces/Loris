/**
 * LifeCycle
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/

// TODO: revise this component once Shipments are enabled.
class LifeCycle extends React.Component {
  mouseOver(e) {
    // this isn't a very 'react' way of doing things, so consider revision
      $('.collection').css({
        'border': '2px solid #093782',
        'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      });
  }

  mouseLeave(e) {
    // this isn't a very 'react' way of doing things, so consider revision
      $('.collection').css({
        'border': '2px solid #A6D3F5', 'box-shadow': 'none',
      });
  }

  mouseOverPreparation(e) {
    // this isn't a very 'react' way of doing things, so consider revision
      $('.preparation').css({
        'border': '2px solid #093782',
        'box-shadow': '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      });
  }

  mouseLeavePreparation(e) {
    // this isn't a very 'react' way of doing things, so consider revision
      $('.preparation').css({'border': '2px solid #A6D3F5', 'box-shadow': 'none'});
  }

  render() {
    // Create Collection Node
    let collectionNode;
    if ((this.props.specimen||{}).collection || this.props.container) {
      collectionNode = (
        <div
          onMouseEnter={(e) => this.mouseOver(e)}
          onMouseLeave={(e) => this.mouseLeave(e)}
          className='lifecycle-node collection'
        >
          <div className='letter'>
            C
          </div>
        </div>
      );
    }

    // Create Preparation Node
    let preparationNode;
    if ((this.props.specimen||{}).preparation) {
      preparationNode = (
        <div
          onMouseEnter={this.mouseOverPreparation}
          onMouseLeave={this.mouseLeavePreparation}
          className='lifecycle-node preparation'
        >
          <div className='letter'>
            P
          </div>
        </div>
      );
    }

    // Create Analysis Node
    let analysisNode;
    if ((this.props.specimen||{}).analysis) {
      analysisNode = (
        <div className='lifecycle-node-container'>
           <div className='lifecycle-node'>
             <div className='letter'>A</div>
           </div>
        </div>
      );
    }

    // Create Lines
    let line;
    let nodes = 0;
    for (let i in this.props.specimen) {
      if (i === 'collection' || i === 'preparation' || i === 'analysis') {
        nodes++;
      }
    }
    let lineWidth = nodes > 1 ? 60/(nodes-1) : 0;
    let lineStyle = {width: lineWidth+'%'};
    line = (<div className='lifecycle-line' style={lineStyle}/>);

    return (
      <div className='lifecycle'>
        <div className='lifecycle-graphic'>
          {collectionNode}
          {preparationNode ? line : null}
          {preparationNode}
          {analysisNode ? line : null}
          {analysisNode}
        </div>
      </div>
    );
  }
}

LifeCycle.propTypes = {
};

export default LifeCycle;
