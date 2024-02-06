import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Loader from 'Loader';
import StaticDataTable from 'jsx/StaticDataTable';
import {
  FormElement,
  StaticElement,
  FieldsetElement,
} from 'jsx/Form';

/**
 * Candidate date of birth component
 */
class DiagnosisEvolution extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      error: false,
      isLoaded: false,
    };

    this.fetchData = this.fetchData.bind(this);
    this.formattedDiagnosisEvolution =
    this.formattedDiagnosisEvolution.bind(this);
    this.renderLatestDiagnosis =
    this.renderLatestDiagnosis.bind(this);
  }

  /**
   * Called by React when the component has been rendered on the page.
   */
  componentDidMount() {
    this.fetchData()
    .then(() => this.setState({isLoaded: true}));
  }

  /**
   * Fetch data
   *
   * @return {Promise<void>}
   */
  fetchData() {
    return fetch(this.props.dataURL, {credentials: 'same-origin'})
      .then((resp) => resp.json())
      .then((data) => this.setState({data: data}))
      .catch((error) => {
        this.setState({error: true});
        console.error(error);
      });
  }

  /**
   * @return {array}
   */
  formattedDiagnosisEvolution() {
    const dxEvolution = this.state.data.diagnosisEvolution;
    let formattedDxEvolution = [];
    dxEvolution.map((record) => {
      let formattedDiagnosis = [];
      Object.entries(JSON.parse(record.Diagnosis)).map((entry, index) => {
        const [fieldName, dx] = entry;
        formattedDiagnosis.push(
          <p key={index}>{fieldName}: <strong>{dx}</strong></p>
        );
      });
      let sourceFields = [];
      record.sourceField.split(',').map((field, index) => {
        sourceFields.push(<p key={index}>{field}</p>);
      });
      const confirmed = record.Confirmed === 'Y' ?
        <p style={{color: 'green', fontSize: '3rem', textAlign: 'center'}}>
          &#10004;
        </p> :
        <p style={{color: 'red', fontSize: '3rem', textAlign: 'center'}}>
          &#10007;
        </p>;
      formattedDxEvolution.push(
        [
          record.TrajectoryName,
          record.Project,
          record.OrderNumber,
          record.visitLabel,
          record.instrumentName,
          sourceFields,
          formattedDiagnosis,
          confirmed,
          record.LastUpdate,
        ]
      );
    });
    return formattedDxEvolution;
  }

  /**
   * Render latest diagnosis element
   *
   * @param {*} latestDiagnosis
   * @return {JSX} - React markup for the component
   */
  renderLatestDiagnosis(latestDiagnosis) {
    let element = [];

    latestDiagnosis.map((entry) => {
      const projectName = this.state.data.projects[entry.ProjectID];
      let diagnosis = [];
      Object.entries(JSON.parse(entry.Diagnosis)).map((entry) => {
        const [fieldName, dx] = entry;
        diagnosis.push(
          <StaticElement
            key={fieldName}
            label={fieldName}
            text={dx}
          />
        );
      });

      element.push(
        <FieldsetElement
          key={entry.DxEvolutionID}
          legend={<h5>{projectName} - {entry.Name}</h5>}
          class='col-md-6'
        >
          {diagnosis}
        </FieldsetElement>
      );
    });
    return element;
  }

  /**
   * Renders the React component.
   *
   * @return {JSX} - React markup for the component
   */
  render() {
    if (this.state.error) {
        return <h3>An error occured while loading the page.</h3>;
    }

    if (!this.state.isLoaded) {
        return <Loader/>;
    }

    const latestConfirmedProjectDiagnosisIDs =
      this.state.data.latestConfirmedProjectDiagnosis.length > 0 ?
      this.state.data.latestConfirmedProjectDiagnosis.map((item) => {
      return item.DxEvolutionID;
    }) : null;

    const latestProjectDiagnosisIDs =
      this.state.data.latestProjectDiagnosis.length > 0 ?
      this.state.data.latestProjectDiagnosis.map((item) => {
      return item.DxEvolutionID;
    }) : null;

    // Unset diagnosis in latest project diagnosis list if it also exists
    // in the confirmed latest project diagnosis list
    let latestProjectDiagnosis = this.state.data.latestProjectDiagnosis;
    if (latestConfirmedProjectDiagnosisIDs != null) {
      latestProjectDiagnosisIDs.map((dxEvolutionID, index) => {
        if (latestConfirmedProjectDiagnosisIDs.find(
            (element) => (element === dxEvolutionID)
          ) != undefined
        ) {
          latestProjectDiagnosis.splice(index, 1);
        }
      });
    }

    const latestDiagnosis = latestProjectDiagnosis.length > 0 ?
      <div className='col-md-10'>
        <h3>Latest Diagnosis</h3>
        <p>This diagnosis is <strong style={{color: 'red'}}>
          unconfirmed</strong>.
          A confirmed diagnosis is one that belongs to a visit
          that has been sent to DCC for approval.
        </p>
        {this.renderLatestDiagnosis(latestProjectDiagnosis)}
      </div>
      : null;
    const latestConfirmedDiagnosis =
      this.state.data.latestConfirmedProjectDiagnosis.length > 0 ?
        <div className='col-md-10'>
          <h3>Latest Confirmed Diagnosis</h3>
          <p>This diagnosis is <strong style={{color: 'green'}}>
            confirmed</strong>.
            A confirmed diagnosis is one that belongs to a visit
            that has been sent to DCC for approval.
          </p>
          {this.renderLatestDiagnosis(
            this.state.data.latestConfirmedProjectDiagnosis
          )}
        </div>
        : null;

    return (
      <div className='row'>
        <FormElement
          name='diagnosisEvolution'
          onSubmit={this.handleSubmit}
          ref='form'
          class='col-md-12'
        >
          <StaticElement
            label='PSCID'
            text={this.state.data.pscid}
          />
          <StaticElement
            label='DCCID'
            text={this.state.data.candID}
          />
          {latestDiagnosis}
          {latestConfirmedDiagnosis}
          <h3>Diagnosis Evolution</h3>
          <StaticDataTable
            Headers={[
              'Trajectory Name',
              'Project',
              'Configured Order',
              'Visit',
              'Instrument',
              'Source Field(s)',
              'Diagnosis',
              'Confirmed',
              'Last Update',
            ]}
            Data={this.formattedDiagnosisEvolution()}
            Hide={{rowsPerPage: true, downloadCSV: true}}
          />
        </FormElement>
      </div>
    );
  }
}
DiagnosisEvolution.propTypes = {
  submitURL: PropTypes.string,
  dataURL: PropTypes.string,
  tabName: PropTypes.string,
};
export default DiagnosisEvolution;
