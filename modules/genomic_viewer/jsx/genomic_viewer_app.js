/*
 * The control panel is used to input the genomic location to view.
 * It also provide ways to navigate namely zomming and scrolling.
 */
class ControlPanel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      genomicRange: props.genomicRange
    };

    this.handleChange     = this.handleChange.bind(this);
    this.handleSubmit     = this.handleSubmit.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
  }

  // Update the state only if a new genomicRange is received.
  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('genomicRange')) { 
      this.setState({genomicRange: nextProps.genomicRange});
    }
  }

  // Update the state on each key sent.
  handleChange(event) {
    this.setState({genomicRange: event.target.value});
  }

  // Submit the new value to the GenomicViewerApp
  handleSubmit(event) {
    event.preventDefault();
    this.props.setGenomicRange(this.state.genomicRange);
  }

  // Function to handle the zomming and the moving.
  handleNavigation(event) {
    event.preventDefault();

    let newGenomicRange, newFrom, newTo, rangeSpan;
    let [genomicRange, prefix, chr, from, to] = this.state.genomicRange.match(/(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/i);

    from = parseInt(from);
    to = parseInt(to);
    rangeSpan = to - from;

    switch (event.target.id) {
      case 'control-chevron-left':
        // Move 90% of the viewer's span toward 5' (left)
        newFrom = from - Math.round(rangeSpan * 0.9);
        newTo = to - Math.round(rangeSpan * 0.9);
      break;
      case 'control-chevron-zoom-out':
        // Increase the viewer' span 2 times keeping center
        newFrom = from - Math.round(rangeSpan * 0.5);
        newTo = to + Math.round(rangeSpan * 0.5);
      break;
      case 'control-chevron-zoom-in':
        // Reduce the viewer' span by 50% keeping center
        newFrom = from + Math.round(rangeSpan * 0.25);
        newTo = to - Math.round(rangeSpan * 0.25);
      break;
      case 'control-chevron-right':
        // Move 90% of the viewer's span toward 3' (right)
        newFrom = from + Math.round(rangeSpan * 0.9);
        newTo = to + Math.round(rangeSpan * 0.9);
      break;
    }

    newGenomicRange = 'chr'.concat(
      chr,
      ':',
      newFrom,
      '-',
      newTo
    );
    this.props.setGenomicRange(newGenomicRange);
  }

  render() {
    return (
      <div>
      <center>
      <form onSubmit={this.handleSubmit}>
        <div className="searche-input">
          <input 
            type="text"
            size="30"
            value={this.state.genomicRange}
            onChange={this.handleChange}
            placeholder="Ex: chrY:15012776-15036313" 
            pattern="(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)"
          />
          <span 
            id="control-glyphicon-search"
            className="glyphicon glyphicon-search" 
            onClick={this.handleSubmit}>
          </span>
        </div>
        <div className="navigation-buttons">
          <span
            id="control-chevron-left"
            className="glyphicon glyphicon-chevron-left"
            onClick={this.handleNavigation}
          />
          <span
            id="control-chevron-zoom-out"
            className="glyphicon glyphicon-zoom-out"
            onClick={this.handleNavigation}
          />
          <span
            id="control-chevron-zoom-in"
            className="glyphicon glyphicon-zoom-in"
            onClick={this.handleNavigation}
          />
          <span
            id="control-chevron-right"
            className="glyphicon glyphicon-chevron-right"
            onClick={this.handleNavigation}
          />
        </div>
      </form>
      </center>
      </div>
    );
  }
}

ControlPanel.propTypes = {
  genomicRange: React.PropTypes.string,
  setGenomicRange: React.PropTypes.func.isRequired
};

ControlPanel.defaultProps = {
  genomicRange: ""
};

class Track extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <tr>
        <td>{this.props.title}</td>
        <td>{this.props.children}</td>
      </tr>
    );
  }
}

Track.propTypes = {
  title:  React.PropTypes.node.isRequired,
  children: React.PropTypes.arrayOf(React.PropTypes.element)
};

Track.defaultProps = {
  children: []
};

/*
 * Using a reduce definition of gene prediction tracks convention @
 * https://genome.ucsc.edu/goldenPath/help/hgTracksHelp.html#GeneDisplay
 * 
 * Coding exons are represented by blocks connected by horizontal lines representing
 * introns. The 5' and 3' untranslated regions (UTRs) are displayed as thinner
 * blocks on the leading and trailing ends of the aligning regions. 
 * Arrowheads on the connecting intron lines indicate the direction of
 * transcription.
 */
class Gene extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvasHeight: 20
    };

    this.showGeneDetails = this.showGeneDetails.bind(this);
  }

  componentDidMount() {
    this.draw(this.props.genomicRange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('genomicRange')) {
      this.draw(nextProps.genomicRange);
    }
  }

  /*
   * Adjust the canvas width the draw the gene according to the displayed
   * genomic range. 
   */
  draw(genomicRange) {
    const canvas = this.refs.thatCanvas;
    if (canvas) {
      const width  = this.refs.thatDiv.getDOMNode().clientWidth;
      const height = this.state.canvasHeight;
      const pattern = /(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/;
      const [genomicRange, prefix, chromosome, start, end] = this.props.genomicRange.match(pattern);

      // Adjust width and height according to screen size
      canvas.getDOMNode().width = width;
      canvas.getDOMNode().height = height;

      // Determine the scale between the canvas width and the displayed genomicRange
      // Unit: pixel per base pair
      const xScale = width / (parseInt(end) - parseInt(start));

      const accession_number = this.props.accession_number;
      const chrom = this.props.chrom;
      const strand = this.props.strand;
      const txStart = this.props.txStart;
      const txEnd = this.props.txEnd;
      const cdsStart = this.props.cdsStart;
      const cdsEnd = this.props.cdsEnd;
      const exonStarts = this.props.exonStarts;
      const exonEnds = this.props.exonEnds;
      const name = this.props.name;
    
      const ctx = canvas.getDOMNode().getContext('2d');

      // Draw horizontal lines representing introns.
      let y = height / 2;
      let x1 = (txStart <= start) ? 0 : (txStart - start) * xScale;
      let x2 = (txEnd >= end) ? width : (txEnd - start) * xScale;
 console.log(x2);
console.log(width);
      ctx.beginPath();
      ctx.moveTo(x1,y);
      ctx.lineTo(x2,y);
      ctx.stroke();
      
      // Add UTR's
      // left
      

      // Add exons
// only the visible ones
      if (exonStarts.length != exonEnds.length) {
        console.error('Exon counts differs.')
      }
      

      ctx.rect(0,0,120,17);
      ctx.stroke();
    }
  }

  showGeneDetails(event) {
    alert(event.target.title);
  }

  render() {
    const canvasHeight = 20;
    return (
      <div ref="thatDiv" style={{width: '100%'}}>
        <canvas
          ref="thatCanvas"
          onClick={this.showGeneDetails}
          data-toggle="tooltip"
          title={this.props.name}
        />
      </div>
    );
  }
}

Gene.propTypes = {
  genomicRange: React.PropTypes.string.isRequired,
  accession_number: React.PropTypes.string.isRequired,
  chrom: React.PropTypes.string.isRequired,
  strand: React.PropTypes.string,
  txStart: React.PropTypes.number.isRequired,
  txEnd: React.PropTypes.number.isRequired,
  cdsStart: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  cdsEnd: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  exonStarts: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  exonEnds: React.PropTypes.arrayOf(React.PropTypes.number).isRequired,
  name: React.PropTypes.string
}

class GeneTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      genes: []
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.genomicRange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('genomicRange') && nextProps.genomicRange !== this.props.genomicRange) {
      this.fetchData(nextProps.genomicRange);
    }
  }

  fetchData(genomicRange) {
    var pattern = /(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/;
    var table = 'knownGene';

    if (pattern.test(genomicRange)) {
      $.ajax(this.props.dataURL + '?genomic_range=' + genomicRange + '&table=' + table, {
        method: "GET",
        dataType: 'json',
        success: function(data) {
          this.setState({
            title: table,
            genes: data,
          });
        }.bind(this),
        error: function(error) {
          console.error(error);
        }
      });
    }
  }

  render() {
    var genomicRange = this.props.genomicRange;

    // Thightly coupled with the UCSC knownGene table columns.
    var genes = this.state.genes.map(function (g) {
       const accession_number = g.name;
       const chrom = g.chrom;
       const strand = g.strand;
       const txStart = g.txStart;
       const txEnd = g.txEnd;
       const cdsStart = g.cdsStart;
       const cdsEnd = g.cdsEnd;
       const exonStarts = g.exonStarts;
       const exonEnds = g.exonEnds;
       const name = g.name;

      return (
        <Gene 
          genomicRange={genomicRange}
          accession_number={accession_number}
          chrom={chrom}
          strand={strand}
          txStart={txStart}
          txEnd={txEnd}
          cdsStart={cdsStart}
          cdsEnd={cdsEnd}
          exonStarts={exonStarts}
          exonEnds={exonEnds}
          name={name}
        />
      );
    });

    return (
      <Track title="Genes">
        {genes}
      </Track>
    );
  }
}

GeneTrack.propTypes = {
  dataURL: React.PropTypes.string,
  genomicRange: React.PropTypes.string
};

GeneTrack.defaultProps = {
  dataURL: loris.BaseURL + "/genomic_viewer/ajax/getUCSCGenes.php"
};

class CPGTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <Track
        title="Methylation 450k">
      {''}
      </Track>
    );
  }
}

class SNPTrack extends React.Component {render() {return (<div></div>);}}
class ChIPPeakTrack extends React.Component {render() {return (<div></div>);}}


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
      genomicRange: null
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
    var genomicRange = genomicRange;

    //  Do some regexp validation
    //  console.error('Invalid parameter provided');

    this.setState({genomicRange: genomicRange});
  }

  render() {

    // Defining element names here ensures that `name` and `ref`
    // properties of the element are always kept in sync
    const controlPanel = "controlPanel";
    const genomicRange = this.state.genomicRange;

    // Create control panel and the tracks according to state
    return (
      <table className='col-md-12'>
        <tbody>
          <tr>
            <th className="col-md-2"></th>
            <th className="col-md-10"></th>
          </tr>
          <tr>
            <td colSpan="2">
              <ControlPanel ref={controlPanel} genomicRange={genomicRange} setGenomicRange={this.setGenomicRange} />
            </td>
          </tr>
          <GeneTrack genomicRange={genomicRange}/>
          <CPGTrack />
          <SNPTrack />
          <ChIPPeakTrack />
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
