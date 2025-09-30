import PropTypes from 'prop-types';

/**
 * LifeCycle component.
 */
class LifeCycle extends React.Component {
  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    // Create Collection Node
    let collectionNode;
    if ((this.props.specimen||{}).collection || this.props.container) {
      collectionNode = (
        <div
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
        <div className='lifecycle-node preparation'>
          <div className='letter'>P</div>
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
  specimen: PropTypes.shape({
    typeId: PropTypes.number.isRequired,
    quantity: PropTypes.number,
    poolId: PropTypes.number,
    fTCycle: PropTypes.string,
    projectId: PropTypes.number,
    sessionId: PropTypes.number,
    candidateId: PropTypes.number,
    unitId: PropTypes.number,
    parentSpecimenIds: PropTypes.arrayOf(PropTypes.number),
    parentSpecimenBarcodes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  container: PropTypes.shape({
    statusId: PropTypes.number.isRequired,
    barcode: PropTypes.string.isRequired,
    lotNumber: PropTypes.string,
    expirationDate: PropTypes.string,
    parentContainerId: PropTypes.number,
    coordinate: PropTypes.string,
  }).isRequired,
};

export default LifeCycle;
