'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GenomicRange = function () {
  function GenomicRange(props) {
    _classCallCheck(this, GenomicRange);

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
        genomicRange.startLoc = Number(matches[3].replace(/[, ]/g, ''));
        genomicRange.endLoc = Number(matches[4].replace(/[, ]/g, ''));
      } else {
        console.error('Invalid input');
        this.state = { isValid: false };
        return 'Invalid genomic range';
      }
    }

    this.state = {
      isValid: true,
      genomicRange: genomicRange
    };

    this.getChromosome = this.getChromosome.bind(this);
    this.getStartLoc = this.getStartLoc.bind(this);
    this.getEndLoc = this.getEndLoc.bind(this);
  }

  _createClass(GenomicRange, [{
    key: 'getChromosome',
    value: function getChromosome() {
      return this.state.genomicRange.chromosome;
    }
  }, {
    key: 'getStartLoc',
    value: function getStartLoc() {
      return this.state.genomicRange.startLoc;
    }
  }, {
    key: 'getEndLoc',
    value: function getEndLoc() {
      return this.state.genomicRange.endLoc;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var value = null;
      if (this.state.isValid) {
        value = ''.concat(this.state.genomicRange.chromosome, ':', this.state.genomicRange.startLoc, '-', this.state.genomicRange.endLoc);
      } else {
        value = 'Invalid';
      }
      return value;
    }
  }]);

  return GenomicRange;
}();

var ControlPanel = function (_React$Component) {
  _inherits(ControlPanel, _React$Component);

  function ControlPanel(props) {
    _classCallCheck(this, ControlPanel);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ControlPanel).call(this, props));

    _this.state = { genomicRange: props.genomicRange.toString() };

    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    return _this;
  }

  _createClass(ControlPanel, [{
    key: 'handleChange',
    value: function handleChange(event) {
      this.setState({ genomicRange: event.target.value });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.hasOwnProperty('genomicRange')) {
        this.setState({ genomicRange: nextProps.genomicRange.toString() });
      }
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(event) {
      event.preventDefault();
      this.props.setGenomicRange(event.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement('span', { className: 'glyphicon glyphicon-search', onClick: this.handleSubmit }),
          React.createElement('input', { type: 'text', value: this.state.genomicRange, onChange: this.handleChange })
        )
      );
    }
  }]);

  return ControlPanel;
}(React.Component);

ControlPanel.propTypes = {
  genomicRange: React.PropTypes.instanceOf(GenomicRange),
  setGenomicRange: React.PropTypes.func.isRequired
};

var GeneTrack = function (_React$Component2) {
  _inherits(GeneTrack, _React$Component2);

  function GeneTrack() {
    _classCallCheck(this, GeneTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(GeneTrack).apply(this, arguments));
  }

  _createClass(GeneTrack, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return GeneTrack;
}(React.Component);

var CPGTrack = function (_React$Component3) {
  _inherits(CPGTrack, _React$Component3);

  function CPGTrack() {
    _classCallCheck(this, CPGTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(CPGTrack).apply(this, arguments));
  }

  _createClass(CPGTrack, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return CPGTrack;
}(React.Component);

var SNPTrack = function (_React$Component4) {
  _inherits(SNPTrack, _React$Component4);

  function SNPTrack() {
    _classCallCheck(this, SNPTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(SNPTrack).apply(this, arguments));
  }

  _createClass(SNPTrack, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return SNPTrack;
}(React.Component);

var ChipSeqPeakTrack = function (_React$Component5) {
  _inherits(ChipSeqPeakTrack, _React$Component5);

  function ChipSeqPeakTrack() {
    _classCallCheck(this, ChipSeqPeakTrack);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(ChipSeqPeakTrack).apply(this, arguments));
  }

  _createClass(ChipSeqPeakTrack, [{
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return ChipSeqPeakTrack;
}(React.Component);

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


var GenomicViewerApp = function (_React$Component6) {
  _inherits(GenomicViewerApp, _React$Component6);

  function GenomicViewerApp(props) {
    _classCallCheck(this, GenomicViewerApp);

    var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(GenomicViewerApp).call(this, props));

    _this6.state = {
      // Create a default genomic range to show 
      genomicRange: new GenomicRange('chrY:15,012,776-15,036,313')
    };

    // Bind component instance to custom methods
    _this6.setGenomicRange = _this6.setGenomicRange.bind(_this6);
    return _this6;
  }

  /**
   * Update the state with the browser info.
   */


  _createClass(GenomicViewerApp, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      console.log(React.findDOMNode(this));
    }

    /**
     * Sets a new Genomic Range
     *
     * @param {GenomicRange} genomicRange - the new genomic range
     *
     * @note This function will try to construct a genomicRange if a string is received.
     */

  }, {
    key: 'setGenomicRange',
    value: function setGenomicRange(genomicRange) {
      var genomicRange = new GenomicRange(genomicRange);

      if (!genomicRange instanceof GenomicRange) {
        console.error('Invalid parameter provided');
      }

      this.setState({ genomicRange: genomicRange });
    }
  }, {
    key: 'render',
    value: function render() {

      // Defining element names here ensures that `name` and `ref`
      // properties of the element are always kept in sync
      var patientID = "patientID";

      var genomicRange = this.state.genomicRange;

      // Create the tracks according to state
      return React.createElement(
        'table',
        { className: 'col-md-12' },
        React.createElement(
          'tbody',
          null,
          React.createElement(
            'th',
            null,
            React.createElement('td', { className: 'col-md-1' }),
            React.createElement('td', { className: 'col-md-2' }),
            React.createElement('td', { className: 'col-md-9' })
          ),
          React.createElement(
            'tr',
            null,
            React.createElement(
              'td',
              { colSpan: '3' },
              React.createElement(ControlPanel, { genomicRange: genomicRange, setGenomicRange: this.setGenomicRange })
            )
          )
        )
      );
    }
  }]);

  return GenomicViewerApp;
}(React.Component);

/**
 * Render dicom_page on page load
 */


window.onload = function () {
  var viewer = React.createElement(GenomicViewerApp, null);

  // Create a wrapper div in which react component will be loaded
  var genomicViewerDOM = document.createElement('div');
  genomicViewerDOM.id = 'page-genomic-viewer';

  // Append wrapper div to page content
  var rootDOM = document.getElementById("lorisworkspace");
  rootDOM.appendChild(genomicViewerDOM);

  React.render(viewer, document.getElementById("page-genomic-viewer"));
};