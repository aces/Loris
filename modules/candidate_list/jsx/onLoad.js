/* global formatColumn */

import AccessProfilePanel from './AccessProfilePanel';
import CandidateListFilter from './CandidateListFilter';

class CandidateListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'filters': { }
    };
	this.updateFilter = this.updateFilter.bind(this);
  }

  updateFilter(filter) {
    var f = {};
    for (var filt in filter) {
        if (filter.hasOwnProperty(filt)) {
            f[this.toCamelCase(filt)] = filter[filt];
        }
    }
    this.setState({ filters: f});
  }

  // FIXME: This is stupid, but StaticDataTable insists that filters 
  // are capitalized this way for some reason.
  toCamelCase(str) {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (Number(match) === 0) {
              return "";
          }
          return index === 0 ? match.toLowerCase() : match.toUpperCase();
      });
  }

  render() {
    return (<div>
        <div className="row">
            <AccessProfilePanel 
            />,
        </div>
        <div className="row">
            <div className="col-sm-9">
                <CandidateListFilter 
                    onFilterUpdated={this.updateFilter}
		        />,
            </div>
        </div>
        <DynamicDataTable
            DataURL={`${loris.BaseURL}/candidate_list/?format=json`}
            getFormattedCell={formatColumn}
            Filter={this.state.filters}
            freezeColumn="PSCID"
        />
    </div>
    );
  }
}

$(function() {
  ReactDOM.render(<CandidateListPage />, document.getElementById("lorisworkspace"));
});
