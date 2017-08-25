import Panel from 'Panel';
import FilterForm from 'FilterForm';

class CandidateListFilter extends React.Component {
  constructor(props) {
    super(props);

    this.getBasicOpts = this.getBasicOpts.bind(this);
    this.getAdvancedOpts = this.getAdvancedOpts.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleAdvanced = this.toggleAdvanced.bind(this);

    this.getDisplayedFormElements = this.getDisplayedFormElements.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.state = {
        // Whether or not to show the advanced options
        showadvanced: false,
        dynamicfilters : {
            projects : { '' : 'All', 'placeholder' : 'Loading valid projects..' },
            subprojects : { '' : 'All', 'placeholder' : 'Loading valid subprojects..' }, 
            visits : { '' : 'All', 'placeholder' : 'Loading valid visits...' }, 
            sites : { '' : 'All', 'placeholder' : 'Loading valid sites...' },
            participantstatus : { '' : 'All', 'placeholder' : 'Loading participant status options...' },
        },
        filter: {}
    };
  }
  updateFilter(filter) {
	// FIXME: This should be this.props instead of this.state, but for now
	// the caller and callee are formatted differently, so just use a callback
    if (filter.ParticipantStatus) {
        filter.ParticipantStatus.exactMatch = true;
    }
    this.setState({filter});
	if(this.props.onFilterUpdated) {
		this.props.onFilterUpdated(filter);
	}
  }

  getBasicOpts() {
      var basicopts = {
          'PSCID' : {
              label : 'PSCID',
              name : 'PSCID',
              type : 'text',
              'class' : 'form-control input-sm'
          },
          'DCCID' : {
              label : 'DCCID',
              name : 'DCCID',
              type : 'text',
              'class' : 'form-control input-sm'
          },
          'Visits' : {
              label : 'Visit Label',
              name : 'Visits',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : this.state.dynamicfilters.visits, 
          },
          'Site' : {
              label : 'Site',
              name : 'Site',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : this.state.dynamicfilters.sites,
          },
          'Subproject' : {
              label : 'Subproject',
              name : 'Subproject',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : this.state.dynamicfilters.subprojects,
          },
          'Project' : {
              label : 'Project',
              name : 'Project',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : this.state.dynamicfilters.projects,
          },
          'EntityType' : {
              label : 'Entity Type',
              name : 'EntityType',
              type : 'select',
              'emptyOption' : false,
              'class' : 'form-control input-sm',
              'options' : { '' : 'All', 'Human' : 'Human', 'Scanner' : 'Scanner' }
          },
          // Include 2 blank cells to ensure that the Advanced filters start on the next row.
          'Placeholder' : { },
          'Placeholder2' : { },
      }
      return basicopts;
  }

  componentDidMount() {
      $.get(loris.BaseURL + "/api/v0.0.2/projects/", function(data) {
          var projects = {'' : 'All'}
          if (data.Projects) {
              for (var proj in data.Projects) {
                  if (data.Projects.hasOwnProperty(proj)) {
                      projects[proj] = proj;
                  }
              }
          }
          var state = this.state;
          state.dynamicfilters.projects = projects;
          this.setState(state);
      }.bind(this),
      'json');
      $.get(loris.BaseURL + "/candidate_list/ajax/dynamicfilters.php", function(data) {
          var st = this.state;

          var sites = { '' : 'All' }
          if (data.sites) {
              for (var site in data.sites) {
                  if (data.sites.hasOwnProperty(site)) {
                      sites[data.sites[site]] = data.sites[site];
                  }
              }
          }

          var subprojects = { '' : 'All' }
          if (data.subprojects) {
              for (var sp in data.subprojects) {
                  if (data.subprojects.hasOwnProperty(sp)) {
                      subprojects[data.subprojects[sp]] = data.subprojects[sp];
                  }
              }
          }

          var visits = { '' : 'All' }
          if (data.visits) {
              for (var v in data.visits) {
                  if (data.visits.hasOwnProperty(v)) {
                      visits[data.visits[v]] = data.visits[v];
                  }
              }
          }
          var participantstatus = { '' : 'All' }
          if (data.participantstatus) {
              for (var ps in data.participantstatus) {
                  if (data.participantstatus.hasOwnProperty(ps)) {
                      participantstatus[data.participantstatus[ps]] = data.participantstatus[ps];
                  }
              }
          }
          st.dynamicfilters.sites = sites;
          st.dynamicfilters.subprojects = subprojects;
          st.dynamicfilters.visits = visits;
          st.dynamicfilters.participantstatus = participantstatus;

          this.setState(st);
      }.bind(this),
      'json');
  }

  getAdvancedOpts() {
      return {
          'ScanDone' : { 
              label : 'Scan Done',
              name : 'ScanDone',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : {
                  '' : 'All',
                  'Yes' : 'Yes',
                  'No' : 'No',
              },
          },
          'ParticipantStatus' : {
              label : 'Participant Status',
              name : 'ParticipantStatus',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              options : this.state.dynamicfilters.participantstatus
          },
          'DoB' : {
              label : 'Date Of Birth',
              name : 'DoB',
              type : 'text',
              'class' : 'form-control input-sm',
          },
          'Gender' : {
              label : 'Gender',
              name : 'Gender',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : {
                  '' : 'All',
                  'Male' : 'Male',
                  'Female' : 'Female',
              },
          },
          'VisitCount' : {
                label : 'Number of visits',
                name : 'VisitCount',
                type : 'numeric',
                'class' : 'form-control input-sm'
          },
          'Feedback' : {
                label : 'Feedback',
                name : 'Feedback',
                type : 'select',
                'class' : 'form-control input-sm',
                'emptyOptions' : false,
                'options' : {
                    '' : 'All',
                    '0' : 'None',
                    '1' : 'opened',
                    '2' : 'answered',
                    '3' : 'closed',
                    '4' : 'comment'
                },
          },
          'LatestVisitStatus' : {
                label : 'Latest Visit Status',
                name : 'LatestVisitStatus',
                type : 'select',
                'class' : 'form-control input-sm',
                'emptyOptions' : false,
                'options' : {
                    '' : 'All',
                    'Not Started' : 'Not Started',
                    'Screening' : 'Screening',
                    'Visit' : 'Visit',
                    'Approval' : 'Approval',
                    'Recycling Bin' : 'Recycling Bin'
                },
          },
      };
  }
    
  toggleAdvanced(filter) {
    var st = this.state;
    this.state.showadvanced = !this.state.showadvanced;
    this.setState(st);
  }

  resetFilters() {
    this.refs.candidateList.clearFilter();
  }

  getDisplayedFormElements() {
    var filters = this.getBasicOpts();
    var advanced;
    if (this.state.showadvanced) {
        var advanced = this.getAdvancedOpts();
        for (var el in advanced) {
            if (advanced.hasOwnProperty(el)) {
                filters[el] = advanced[el];
            }
        }
    }
    return filters;
  }

  render() {
    return (
          <FilterForm
            Module="candidate_list"
            name="candidate_list_filter"
            id="candidate_list_filter_form"
            ref="candidateList"
            columns={3}
            onUpdate={this.updateFilter}
            formElements={this.getDisplayedFormElements()}
            filter={this.state.filter}
          >
              <div className="row">
                <div className="col-sm-4 col-md-3 col-xs-12 pull-right">
                  <ButtonElement label="Advanced" type="button" onUserInput={this.toggleAdvanced} className="col-sm-4"/>
                </div>
                <div className="col-sm-4 col-md-3 col-xs-12 pull-right">
                  <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters} className="col-sm-4" />
                </div>
              </div>
          </FilterForm>
    );
  }
}

export default CandidateListFilter;
