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
    this.setState({genomicRange: event.target.value.trim()});
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
    let containerStyle = {
      display: "flex",
      flexWrap: "nowrap",
      justifyContent: "space-between",
      alignItems: "center"
    };
    return (
      <tr className="track">
        <td>
          <div className="track-handle" style={containerStyle}>
            <div className="track-title">
              {this.props.title}
            </div>
            <div className="track-yAxis">
              {this.props.yAxis}
            </div>
          </div>
        </td>
        <td>
          <div className="track-content">
            {this.props.children}
          </div>
        </td>
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

      let y = height / 2;
      let x1 = (txStart <= start) ? 0 : (txStart - start) * xScale;
      let x2 = (txEnd >= end) ? width : (txEnd - start) * xScale;

      // Add the strand background
      // XLB 20161219 :: For some reason, the image are reversed... I can't explain so I reversed the ternary results.
      let imageName = (strand == "+" ) ? 'reverseBackground' : 'forwardBackground';
      let img = document.getElementById(imageName);
      let background = ctx.createPattern(img, 'repeat');
      ctx.fillStyle = background;
      ctx.fillRect(x1,7.5,x2-x1,5);

      // Draw horizontal lines representing introns.
      ctx.strokeStyle = "navy";
      ctx.beginPath();
      ctx.moveTo(x1,y);
      ctx.lineTo(x2,y);
      ctx.stroke();
      

      // Add UTR's
      // left
      

      // Add exons
      if (exonStarts.length != exonEnds.length) {
        console.error('Exon counts differs.')
      }

      let count = exonStarts.length
      for (let i = 0; i < count; i++) {
        let exonStart = parseInt(exonStarts[i]);
        let exonEnd = parseInt(exonEnds[i]);
 
        if (exonStart < end && exonEnd > start) {
          if (exonStart <= cdsStart) {
            if (exonEnd <= cdsStart) {
              // The whole exon is in UTR
              let x = (exonStart < start) ? 0 : (exonStart - start) * xScale;
              let exonWidth = (exonEnd > end) ? width - x : (exonEnd - start) * xScale - x;

              ctx.fillStyle="#000080";
              ctx.fillRect( x, height / 4 , exonWidth, height / 2);

            } else {
              // This exon is both UTR and exon
              let x = (exonStart < start) ? 0 : (exonStart - start) * xScale;
              let utrWidth = (cdsStart - start) * xScale - x;
              let exonWidth = (exonEnd > end) ? width - (x + utrWidth) : (exonEnd - cdsStart) * xScale;
 
              ctx.fillStyle="#000080";
              ctx.fillRect( x, height / 4 , utrWidth, height / 2);
              ctx.fillRect( (x + utrWidth), 0, exonWidth, height);
            }
          } else if (exonEnd >= cdsEnd) {
            if (exonStart >= cdsEnd) {
              // The whole exon is in UTR
              let x = (exonStart < start) ? 0 : (exonStart - start) * xScale;
              let exonWidth = (exonEnd > end) ? width - x : (exonEnd - start) * xScale - x;

              ctx.fillStyle="#000080";
              ctx.fillRect( x, height / 4 , exonWidth, height / 2);

            } else {
              // This exon is both UTR and exon
              let x = (exonStart < start) ? 0 : (exonStart - start) * xScale;
              let exonWidth = (cdsEnd - exonStart) * xScale;
              let utrWidth = (exonEnd - cdsEnd) * xScale;

              ctx.fillStyle="#000080";
              ctx.fillRect(x, 0, exonWidth, height);
              ctx.fillRect(x + exonWidth, height/4 , utrWidth, height/2)
            }
          } else {
            // It is all exoninc
            let x = (exonStart < start) ? 0 : (exonStart - start) * xScale;
            let exonWidth = (exonEnd > end) ? width - x : (exonEnd - start) * xScale - x;

            ctx.fillStyle="#000080";
            ctx.fillRect( x, 0, exonWidth, height);
          }
        }

      }
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
  cdsStart: React.PropTypes.number.isRequired,
  cdsEnd: React.PropTypes.number.isRequired,
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
    this.addBackground = this.addBackground.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props.genomicRange);
    this.addBackground();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('genomicRange') && nextProps.genomicRange !== this.props.genomicRange) {
      this.fetchData(nextProps.genomicRange);
    }
  }

  fetchData(genomicRange) {
    var pattern = /(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/;
    var table = 'refFlat';

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

  // This create the images used as backgroung for Gene following strand direction.
  addBackground() {
    const forwardCanvas = this.refs.forwardBackgroundCanvas; 
    const reverseCanvas = this.refs.reverseBackgroundCanvas;  

    if (forwardCanvas) {
      const ctx = forwardCanvas.getDOMNode().getContext('2d');   
      ctx.strokeStyle = "navy";
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(5,2.5);
      ctx.lineTo(0,5);
      ctx.stroke();
    } else {
      console.error('forwardCanvas is missing');
    }

    if (reverseCanvas) {
      const ctx = reverseCanvas.getDOMNode().getContext('2d');
      ctx.strokeStyle = "navy";
      ctx.beginPath();
      ctx.moveTo(5,0);
      ctx.lineTo(0,2.5);
      ctx.lineTo(5,5);
      ctx.stroke();
    } else {
      console.error('reverseCanvas is missing');
    }


  }

  render() {
    const genomicRange = this.props.genomicRange;

    // Thightly coupled with the UCSC knownGene table columns.
    let genes = this.state.genes.map(function (g) {
       const accession_number = g.name;
       const chrom = g.chrom;
       const strand = g.strand;
       const txStart = parseInt(g.txStart);
       const txEnd = parseInt(g.txEnd);
       const cdsStart = parseInt(g.cdsStart);
       const cdsEnd = parseInt(g.cdsEnd);
       const exonStarts = g.exonStarts.split(',').map(function (e) {return parseInt(e);});
       const exonEnds = g.exonEnds.split(',').map(function (e) {return parseInt(e);});
       const name = g.geneName;
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

    let yAxisItems = this.state.genes.map(function (g) {
      return (
        <div className="yAxis-geneName" >
          <span>{g.geneName}</span>
        </div>
      );
    });

    let yAxis = [
      <div className="geneNames">
        {yAxisItems}
      </div>
    ];

    return (
      <Track title="Genes" yAxis={yAxis}>
        <canvas id="forwardBackground" ref="forwardBackgroundCanvas" width="10" height="5" style={{display: "none"}}/>
        <canvas id="reverseBackground" ref="reverseBackgroundCanvas" width="10" height="5" style={{display: "none"}}/>
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

class BetaValueDistribution extends React.Component {
  constructor(props) {
    super(props);

    this.drawBox = this.drawBox.bind(this);
    this.iqr = this.iqr.bind(this);
  }

  componentDidMount() {
    this.drawBox();
  }

  componentWillReceiveProps(nextProps) {
    this.drawBox();
  }

  drawBox() {
    // Drawing the boxplot using d3 library
    const margin = {top: 10, right: 0, bottom: 10, left: 0};
    const boxWidth = 5;

    let boxPlot = d3.box()
      .whiskers(this.iqr(1.5))
      .width(boxWidth)
      .height(100);

    boxPlot.domain([0,1]);

    // Binding data the the svg element group
    const g = d3.select('#' + this.props.cpgName)
      .data([this.props.betaValues])
    
    // Generating the boxplot
    g.call(boxPlot);
    
    // Moving the boxplot according to display scale
    g.attr("transform", "translate(" + ( this.props.x - boxWidth / 2 ) + ", " + margin.top + ")");
  }

  // Returns a function to compute the interquartile range.
  iqr(k) {
    return function(d, i) {
      var q1 = d.quartiles[0],
      q3 = d.quartiles[2],
      iqr = (q3 - q1) * k,
      i = -1,
      j = d.length;
      while (d[++i] < q1 - iqr);
      while (d[--j] > q3 + iqr);
      return [i, j];
    };
  }

  render() {
    return (
      <g id={this.props.cpgName} ref={this.props.cpgName} className="box"></g>
    );
  }
}

BetaValueDistribution.propTypes = {
  cpgName: React.PropTypes.string.isRequired,
  x: React.PropTypes.number,
  betaValues: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
};

BetaValueDistribution.defaultProps = {
  x: 0
};

class CPGTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
    this.adjustLines = this.adjustLines.bind(this);
  }

  componentDidMount() {
    this.adjustLines();
    this.fetchData(this.props.genomicRange);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.hasOwnProperty('genomicRange') && nextProps.genomicRange !== this.props.genomicRange) {
      this.fetchData(nextProps.genomicRange);
    }
  }

  fetchData(genomicRange) {
    const pattern = /(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/;

    if (pattern.test(genomicRange)) {
      // calculate the scale for the X axis
      const [wholeString,  prefix, chromosome, start, end] = genomicRange.match(pattern);
      const width = this.refs.thatDiv.getDOMNode().clientWidth;
      const xScale = width / (parseInt(end) - parseInt(start));

      $.ajax(this.props.dataURL + '?genomic_range=' + genomicRange, {
        method: "GET",
        dataType: 'json',
        success: function(data) {
          data.forEach(function(d){
            // calculate the coresponding X for each location
            d.x = xScale * (parseInt(d.genomic_location) - parseInt(start));
          }, this);
          this.setState({
            isLoaded: true,
            data: data,
          });
        }.bind(this),
        error: function(error) {
          console.error(error);
        }
      });
    }
  }

  adjustLines() {
    const width = this.refs.thatDiv.getDOMNode().clientWidth;
    const hypo = this.refs.hypo.getDOMNode();
    const hyper = this.refs.hyper.getDOMNode();
    const yAxis = this.refs.yAxis.getDOMNode();

    hypo.setAttribute("x2", width);
    hypo.setAttribute("transform", "translate(0,10)");

    hyper.setAttribute("x2", width);
    hyper.setAttribute("transform", "translate(0,10)");
    
    yAxis.setAttribute("transform", "translate(0,10)");
  }

  render() {
    let yAxisStyle = {
      stroke: "black"
    };
    const yAxis = [
      <svg width="30px" height="120">
        <g ref="yAxis">
        <line x1="25" y1="0" x2="25" y2="100" style={yAxisStyle} />
        <text x="1" y="40" dy="0.5em">0.6</text>
        <text x="1" y="80" dy="0.5em">0.2</text>
        </g>
      </svg>
    ];
    const lines = [
      <line ref="hypo" x1="0" y1="80" x2="0" y2="80" />, 
      <line ref="hyper" x1="0" y1="40" x2="0" y2="40" />
    ];

    let boxPlots = this.state.data.map(function(d) {
      let ref = 'cpg-' + d.cpg_name;
      return (
        <BetaValueDistribution ref={ref} cpgName={d.cpg_name} x={d.x} betaValues={d.beta_values}/>
      );
    }, this);
    return (
      <Track
        title="Methylation 450k"
        yAxis={yAxis}>
        <div className="Methylation-450k-chart" ref="thatDiv">
          <svg width='100%' height="120" className="boxes">
            {boxPlots}
            {lines}
          </svg>
        </div>
      </Track>
    );
  }
}

CPGTrack.defaultProps = { 
  dataURL: loris.BaseURL + "/genomic_viewer/ajax/getCPG.php"
};

class SNPTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };

    this.fetchData = this.fetchData.bind(this);
    this.onClick = this.onClick.bind(this);
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
    const pattern = /(^chr|^Chr|^CHR|^)([0-9]|[1][0-9]|[2][0-2]|[xXyYmM]):([0-9, ]+)-([0-9, ]+)/;

    if (pattern.test(genomicRange)) {
      // calculate the scale for the X axis
      const [wholeString,  prefix, chromosome, start, end] = genomicRange.match(pattern);
      const width = this.refs.thatDiv.getDOMNode().clientWidth;
      const xScale = width / (parseInt(end) - parseInt(start));

      $.ajax(this.props.dataURL + '?genomic_range=' + genomicRange, {
        method: "GET",
        dataType: 'json',
        success: function(data) {
          data.forEach(function(d){
            // calculate the coresponding X for each location
            d.x = xScale * (parseInt(d.genomic_location) - parseInt(start));
          }, this);
          this.setState({
            isLoaded: true,
            data: data,
          });
        }.bind(this),
        error: function(error) {
          console.error(error);
        }
      });
    }
  }

  onClick(event) {
    alert(event.target.textContent);
  }

  render() {
    let snps = this.state.data.map(function(s) {

      let className;

      console.log(s);
      return (
        <rect 
          className={className}
          x={s.x}
          y="5"
          width="5"
          height="10"
          rx="2"
          ry="2"
          onClick={this.onClick}
        >
          <title>
            {s.rsID}
          </title>
        </rect>
      );
    }, this);
    return (
      <Track title="SNP">
        <div className="snp-chart" ref="thatDiv">
          <svg width='100%' height="15" className="snps">
            {snps}
          </svg>
        </div>
      </Track>
    );
  }
}
 
SNPTrack.defaultProps = {
  dataURL: loris.BaseURL + "/genomic_viewer/ajax/getSNP.php"
};

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

    // TODO:: Alex tells me that table are evil. (suggestion: flex-box)
    return (
      <table className='col-md-12'>
        <tbody>
          <tr>
            <th className="col-md-2">chrY:15010000-15040000</th>
            <th className="col-md-10"></th>
          </tr>
          <tr>
            <td colSpan="2">
              <ControlPanel ref={controlPanel} genomicRange={genomicRange} setGenomicRange={this.setGenomicRange} />
            </td>
          </tr>
          <GeneTrack genomicRange={genomicRange}/>
          <CPGTrack genomicRange={genomicRange}/>
          <SNPTrack genomicRange={genomicRange}/>
          <ChIPPeakTrack />
        </tbody>
      </table>
    );
  }
}

/**
 * Render genomic_viewer_app on page load
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
