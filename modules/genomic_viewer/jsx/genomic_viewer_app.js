class GenomicRange {
  constructor(props) {
    var genomicRange = {
      chromosome: null,
      startLoc: null,
      endLoc: null
    };

    if (props instanceof GenomicRange) {
       genomicRange.chromosome = props.getChromosome();
       genomicRange.startLoc = props.getStartLoc();
       genomicRange.chromosome = props.getEndLoc();
    } else if (typeof props == 'string') {
      var matches = props.match(/(^chr|^)([0-9]|[1][0-9]|[2][0-2]|[XYM]):([0-9, ]+)-([0-9, ]+)/i);
      if (Array.isArray(matches)) {
        genomicRange.chromosome = 'chr' + matches[2].toUpperCase();
        genomicRange.startLoc = Number(matches[3].replace(/[, ]/g,''));
        genomicRange.endLoc = Number(matches[4].replace(/[, ]/g,''));
      } else {
        console.error('Invalid input');
        this.state = {isValid: false};
        return 'Invalid genomic range';
      }
    }

    this.state = {
      isValid: true,
      genomicRange: genomicRange
    }
    
    this.getChromosome = this.getChromosome.bind(this);
    this.getStartLoc = this.getStartLoc.bind(this);
    this.getEndLoc = this.getEndLoc.bind(this);
  }

  getChromosome() {
    return this.state.genomicRange.chromosome;
  }

  getStartLoc() {
    return this.state.genomicRange.startLoc;
  }

  getEndLoc() {
    return this.state.genomicRange.endLoc;
  }

  toString() {
    var value = null;
    if (this.state.isValid) {
      value = ''.concat(
        this.state.genomicRange.chromosome,
        ':',
        this.state.genomicRange.startLoc,
        '-',
        this.state.genomicRange.endLoc
      );
    } else {
      value = 'Invalid';
    }
    return value;
  }
}

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {genomicRange: props.genomicRange.toString()};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({genomicRange: event.target.value});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('genomicRange')) { 
      this.setState({genomicRange: nextProps.genomicRange.toString()});
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setGenomicRange(event.target.value);
  }

  render() {
    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <span className="glyphicon glyphicon-search" onClick={this.handleSubmit}></span>
        <input type="text" value={this.state.genomicRange} onChange={this.handleChange} />
      </form>
      </div>
    );
  }
}
ControlPanel.propTypes = {
  genomicRange: React.PropTypes.instanceOf(GenomicRange),
  setGenomicRange: React.PropTypes.func.isRequired
};

class GeneTrack extends React.Component {render() {return null;}}
class CPGTrack extends React.Component {render() {return null;}}
class SNPTrack extends React.Component {render() {return null;}}
class ChipSeqPeakTrack extends React.Component {render() {return null;}}


/* exported GenomicViewerApp */

/**
 * Genomic viewer tool
 *
 * Serves as an browser for genomic data.
 *
 * @author Xavier Lecours Boucher
 * @version 1.0.0
 *
 * */
class GenomicViewerApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // Create a default genomic range to show 
      genomicRange: new GenomicRange('chrY:15,012,776-15,036,313')
    };

    // Bind component instance to custom methods
    this.setGenomicRange = this.setGenomicRange.bind(this);
  }

  /**
   * Update the state with the browser info.
   */
  componentDidMount() {
    console.log(React.findDOMNode(this));
  }

  /**
   * Sets a new Genomic Range
   *
   * @param {GenomicRange} genomicRange - the new genomic range
   *
   * @note This function will try to construct a genomicRange if a string is received.
   */
  setGenomicRange(genomicRange) {
    var genomicRange = new GenomicRange(genomicRange);

    if (!genomicRange instanceof GenomicRange) {
      console.error('Invalid parameter provided');
    }

    this.setState({genomicRange: genomicRange});
  }

  render() {

    // Defining element names here ensures that `name` and `ref`
    // properties of the element are always kept in sync
    const patientID = "patientID";

    const genomicRange = this.state.genomicRange;

    // Create the tracks according to state
    return (
      <table className='col-md-12'>
        <tbody>
        <th>
          <td className="col-md-1"></td>
          <td className="col-md-2"></td>
          <td className="col-md-9"></td>
        </th>
        <tr>
          <td colSpan="3">
            <ControlPanel genomicRange={genomicRange} setGenomicRange={this.setGenomicRange} />
          </td>
        </tr>
        </tbody>
      </table>
    );
  }
}

/**
 * Render dicom_page on page load
 */
window.onload = function() {
  var viewer = (
    <GenomicViewerApp />
  );

  // Create a wrapper div in which react component will be loaded
  const genomicViewerDOM = document.createElement('div');
  genomicViewerDOM.id = 'page-genomic-viewer';

  // Append wrapper div to page content
  const rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(genomicViewerDOM);

  React.render(viewer, document.getElementById("page-genomic-viewer"));
};
