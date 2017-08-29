import Panel from 'Panel';
import FilterForm from 'FilterForm';

class ImagingBrowserMenuFilter extends React.Component {
  constructor(props) {
    super(props);

    this.updateFilter = this.updateFilter.bind(this);
    this.resetFilters = this.resetFilters.bind(this);

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
            modalities: { '' : 'All', 'placeholder' : 'Loading valid imaging modalities...' },
        },
        filter: {}
    };
  }
  updateFilter(filter) {
    this.setState({filter});
	if(this.props.onFilterUpdated) {
		this.props.onFilterUpdated(filter);
	}
  }

  getDisplayedFormElements() {
      return {
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
          'Visit Label' : {
              label : 'Visit Label',
              name : 'Visit Label',
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
          'VisitQCStatus': {
              label : 'Visit QC Status',
              name : 'VisitQCStatus',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : {
                  '' : 'All', 
                  'Pass' : 'Pass',
                  'Fail' : 'Fail'
              },
          },
          'Project' : {
              label : 'Project',
              name : 'Project',
              type : 'select',
              'class' : 'form-control input-sm',
              'emptyOption' : false,
              'options' : this.state.dynamicfilters.projects,
          },
          'Modalities' : {
              label : 'Scan Type',
              name : 'Modalities',
              type : 'select',
              'emptyOption' : false,
              'class' : 'form-control input-sm',
              'options' : this.state.dynamicfilters.modalities,
          },
          'Pending' : {
              label : 'Pending and New',
              name : 'Pending',
              type : 'select',
              'emptyOption' : false,
              'class' : 'form-control input-sm',
              'options' : {
                  '' : 'All',
                  'P' : 'Pending',
                      'N' : 'New',
                      'B' : 'Pending or New',
              }
          }
      };
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
      $.get(loris.BaseURL + "/imaging_browser/ajax/dynamicfilters.php", function(data) {
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
          var modalities = { '' : 'All' }
          if (data.modalities) {
              for (var typ in data.modalities) {
                  if (data.modalities.hasOwnProperty(typ)) {
                      modalities[data.modalities[typ]] = data.modalities[typ];
                  }
              }
          }
          st.dynamicfilters.sites = sites;
          st.dynamicfilters.subprojects = subprojects;
          st.dynamicfilters.visits = visits;
          st.dynamicfilters.modalities = modalities;

          this.setState(st);
      }.bind(this),
      'json');
  }

  resetFilters() {
    this.refs.imagingBrowser.clearFilter();
  }

  render() {
    return (
          <FilterForm
            Module="imaging_browser"
            name="imaging_browser_filter"
            id="imaging_browser_filter_form"
            ref="imagingBrowser"
            columns={3}
            formElements={this.getDisplayedFormElements()}
            onUpdate={this.updateFilter}
            filter={this.state.filter}
          >
              <div className="row">
                <div className="col-sm-4 col-md-3 col-xs-12 pull-right">
                  <ButtonElement label="Clear Filters" type="reset" onUserInput={this.resetFilters} className="col-sm-4" />
                </div>
              </div>
          </FilterForm>
    );
  }
}

export default ImagingBrowserMenuFilter;
