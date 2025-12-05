import PropTypes from 'prop-types';
import {withTranslation} from 'react-i18next';
import SpecimenProcessForm from './processForm';
import ContainerParentForm from './containerParentForm';
import {ListForm, ListItem} from './listForm';
import Modal from 'Modal';
import {mapFormOptions, clone} from './helpers.js';
import {
  SearchableDropdown,
  StaticElement,
  SelectElement,
  TextboxElement,
  CheckboxElement,
  DateElement,
  ButtonElement,
} from 'jsx/Form';

const initialState = {
  list: {},
  current: {container: {}, sessionId: null, candidateId: null},
  printBarcodes: false,
  errors: {specimen: {}, container: {}, list: {}},
};

/**
 * Biobank Collection Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 */
class SpecimenForm extends React.Component {
  /**
   * Constructor
   */
  constructor() {
    super();

    this.state = initialState;
    this.setList = this.setList.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setContainer = this.setContainer.bind(this);
    this.setSession = this.setSession.bind(this);
    this.generateBarcodes = this.generateBarcodes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * React lifecycle method
   *
   * @param {object} prevProps - the prior react props
   */
  componentDidUpdate(prevProps) {
    // If a parent specimen is provided, set the current global values.
    if (this.props.parent !== prevProps.parent) {
      const current = clone(this.state.current);
      const specimen = this.props.parent[0].specimen;
      const container = this.props.parent[0].container;
      current.parentSpecimenIds = Object.values(this.props.parent)
        .map((item) => item.specimen.id);
      current.candidateId = specimen.candidateId;
      current.sessionId = specimen.sessionId;
      current.typeId = specimen.typeId;
      current.originId = container.originId;
      current.centerId = container.centerId;
      if (this.props.parent > 1) {
        current.quantity = 0;
      }

      this.setState({current});
    }
  }

  /**
   * Set the current specimen
   *
   * @param {string} name - the name
   * @param {string} value - the value
   * @return {Promise}
   */
  setCurrent(name, value) {
    const {current} = clone(this.state);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  /**
   * Set the current container
   *
   * @param {string} name - container name
   * @param {string} value - container value
   * @return {Promise}
   */
  setContainer(name, value) {
    const {current} = clone(this.state);
    current.container[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  /**
   * Set a list in the object state?
   *
   * @param {object} list - a list of properties to set
   */
  setList(list) {
    this.setState({list});
  }

  /**
   * When a session is selected, set the sessionId, centerId and originId.
   *
   * @param {object} session
   * @param {number} sessionId
   */
  setSession(session, sessionId) {
    const {current} = clone(this.state);
    current.centerId = this.props.options.sessions[sessionId].centerId;
    current.originId = current.centerId;
    current.sessionId = sessionId;
    this.setState({current});
  }

  /**
   * Fetch Barcodes from the backend.
   *
   * @param {number} limit - the number of barcodes to be generated
   * @return {array} an array of barcodes
   */
  async fetchBarcodes(limit) {
    try {
      const response = await fetch(
        `${loris.BaseURL}/biobank/barcodes?limit=${limit}`
      );
      const barcodes = await response.json();
      return barcodes;
    } catch (error) {
      console.error('Error fetching barcodes:', error);
      return [];
    }
  }

  /**
   * Generate barcodes and store in the component state.
   */
  async generateBarcodes() {
    let {list} = this.state;
    const limit = Object.keys(list).length;

    const barcodes = await this.fetchBarcodes(limit);

    list = Object.keys(list).reduce((result, key, index) => {
      const specimen = list[key];
      specimen.container.barcode = barcodes[index];
      result[key] = specimen;
      return result;
    }, {});

    this.setState({list});
  }

  /**
   * Handle the submission of a form
   *
   * @return {Promise}
   */
  handleSubmit() {
    const {list, current, printBarcodes} = this.state;
    return new Promise(
      (resolve, reject) => {
        this.props.onSubmit(list, current, printBarcodes)
          .then(() => resolve(), (errors) => this.setState({errors}, reject()));
      }
    );
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {errors, current, list} = this.state;
    const {options, data, parent} = this.props;

    const renderNote = () => {
      if (parent) {
        return (
          <StaticElement
            label={this.props.t('Note', {ns: 'loris'})}
            text={this.props.t(`To create new aliquots, enter a Barcode, fill out the
                coresponding sub-form and press Submit. Press "New Entry" button
                to add another barcode field, or press for the "Copy" button to
                  duplicate the previous entry.`, {ns: 'biobank'})}
          />
        );
      } else {
        return (
          <StaticElement
            label={this.props.t('Note', {ns: 'loris'})}
            text={this.props.t(`To create new specimens, first select a PSCID and Visit Label.
                  Then, enter a Barcode, fill out the coresponding sub-form and
                  press submit. Press "New Entry" button to add another barcode
                  field, or press for the "Copy" button to duplicate the
                  previous entry.`, {ns: 'biobank'})}
          />
        );
      }
    };

    const renderGlobalFields = () => {
      const {sessionId, candidateId} = current;
      if (parent && candidateId && sessionId) {
        const parentBarcodes = Object.values(parent).map(
          (item) => item.container.barcode
        );
        const parentBarcodesString = parentBarcodes.join(', ');
        return (
          <>
            <StaticElement
              label={this.props.t('Parent Specimen(s)', {ns: 'biobank'})}
              text={parentBarcodesString}
            />
            <StaticElement
              label={this.props.t('PSCID', {ns: 'loris'})}
              text={options.candidates[candidateId].pscid}
            />
            <StaticElement
              label={this.props.t('Visit Label', {ns: 'loris'})}
              text={options.sessions[sessionId].label}
            />
          </>
        );
      } else {
        const sessionsObject = current.candidateId
          ? options.candidates[current.candidateId].sessionIds
            .reduce((acc, sessionId) => {
              if (options.sessions[sessionId]) {
                acc[sessionId] = options.sessions[sessionId];
              }
              return acc;
            }, {})
          : {};
        const mappedSessions = mapFormOptions(sessionsObject, 'label');
        const candidates = mapFormOptions(
          this.props.options.candidates, 'pscid'
        );
        return (
          <>
            <SearchableDropdown
              name="candidateId"
              label={this.props.t('PSCID', {ns: 'loris'})}
              options={candidates}
              onUserInput={this.setCurrent}
              required={true}
              value={candidateId}
              placeHolder={this.props.t('Search for a PSCID', {ns: 'biobank'})}
              errorMessage={errors.specimen.candidateId}
            />
            <SelectElement
              name='sessionId'
              label={this.props.t('Visit Label', {ns: 'loris'})}
              options={mappedSessions}
              onUserInput={this.setSession}
              required={true}
              value={sessionId}
              disabled={candidateId ? false : true}
              errorMessage={errors.specimen.sessionId}
              autoSelect={true}
            />
          </>
        );
      }
    };

    const renderRemainingQuantityFields = () => {
      if (parent) {
        if (loris.userHasPermission('biobank_specimen_update')
                    && parent.length === 1
        ) {
          const specimenUnits = mapFormOptions(
            this.props.options.specimen.units,
            'label'
          );
          return (
            <>
              <TextboxElement
                name="quantity"
                label={this.props.t("Remaining Quantity", {ns: 'biobank'})}
                onUserInput={this.props.setSpecimen}
                required={true}
                value={this.props.current.specimen.quantity}
              />
              <SelectElement
                name="unitId"
                label={this.props.t("Unit", {ns: 'biobank'})}
                options={specimenUnits}
                onUserInput={this.props.setSpecimen}
                required={true}
                value={this.props.current.specimen.unitId}
                autoSelect={true}
              />
            </>
          );
        }
      }
    };

    // Container to be passed to the ContainerParentForm to generate displayed
    // placeholders for the position of the specimens to be created.
    const container = clone(current.container);
    if (container.parentContainerId) {
      container.coordinate = [];
      Object.keys(list).reduce(
        (coord, key) => {
          coord = this.props.increaseCoordinate(
            coord,
            container.parentContainerId,
          );
          const coordinates = [...container.coordinate, parseInt(coord)];
          container.coordinate = coordinates;
          return coord;
        }, 0
      );
    }
    const placeHolder = {container};

    const handleClose = () => this.setState(initialState, this.props.onClose);
    return (
      <Modal
        title={this.props.title}
        show={this.props.show}
        onClose={handleClose}
        onSubmit={this.handleSubmit}
        throwWarning={true}
      >
        <div className='row'>
          <div className="col-xs-11">
            {renderNote()}
            {renderGlobalFields()}
            {renderRemainingQuantityFields()}
          </div>
        </div>
        <ListForm
          list={list}
          errors={errors.list}
          setList={this.setList}
          listItem={{container: {}, collection: {}}}
        >
          <SpecimenBarcodeForm
            typeId={current.typeId}
            options={options}
          />
        </ListForm>
        <br/>
        <div className='form-top'/>
        <ContainerParentForm
          display={true}
          data={data}
          setContainer={this.setContainer}
          setCurrent={this.setCurrent}
          current={placeHolder}
          options={options}
        />
        <div className='form-top'/>
        <ButtonElement
          name='generate'
          label={this.props.t('Generate Barcodes', {ns: 'biobank'})}
          type='button'
          onUserInput={this.generateBarcodes}
          disabled={current.candidateId ? false : true}
        />
        <CheckboxElement
          name='printBarcodes'
          label={this.props.t('Print Barcodes', {ns: 'biobank'})}
          onUserInput={(name, value) => this.setState({[name]: value})}
          value={this.state.printBarcodes}
        />
      </Modal>
    );
  }
}

// SpecimenForm.propTypes
SpecimenForm.propTypes = {
  // Parent prop: Array of parent objects containing specimen and container
  parent: PropTypes.arrayOf(
    PropTypes.shape({
      specimen: PropTypes.shape({
        candidateId: PropTypes.number,
        sessionId: PropTypes.number,
        typeId: PropTypes.number.isRequired,
      }).isRequired,
      container: PropTypes.shape({
        originId: PropTypes.number,
        centerId: PropTypes.number,
      }).isRequired,
    })
  ).isRequired,

  // Options prop: Configuration options for specimen, containers, etc.
  options: PropTypes.shape({
    candidates: PropTypes.arrayOf(PropTypes.string).isRequired,
    sessions: PropTypes.arrayOf(PropTypes.string).isRequired,
    projects: PropTypes.arrayOf(PropTypes.string).isRequired,
    specimen: PropTypes.shape({
      typeUnits: PropTypes.string,
      units: PropTypes.string.isRequired,
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      typeContainerTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
      protocols: PropTypes.arrayOf(PropTypes.string),
      protocolAttributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
      attributes: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ),
    }).isRequired,
  }).isRequired,

  // Data prop: Contains containers and specimens data
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    specimens: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
      })
    ).isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,

  // Functional props
  onSubmit: PropTypes.func.isRequired,
  increaseCoordinate: PropTypes.func.isRequired,
  createSpecimens: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,

  // UI Control props
  title: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,

  // Current state props
  current: PropTypes.shape({
    container: PropTypes.shape({
      temperature: PropTypes.number,
      statusId: PropTypes.number.isRequired,
      comments: PropTypes.string,
    }).isRequired,
    specimen: PropTypes.shape({
      quantity: PropTypes.number,
      unitId: PropTypes.number,
    }).isRequired,
  }).isRequired,

  // Setter and updater functions
  setSpecimen: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  clearAll: PropTypes.func.isRequired,
  updateSpecimen: PropTypes.func.isRequired,

  // Editable actions
  edit: PropTypes.func.isRequired,
  editSpecimen: PropTypes.func.isRequired,

  // Error handling props
  errors: PropTypes.shape({
    container: PropTypes.shape({
      typeId: PropTypes.string,
      temperature: PropTypes.string,
      statusId: PropTypes.string,
      comments: PropTypes.string,
    }),
    specimen: PropTypes.shape({
      quantity: PropTypes.string,
      unitId: PropTypes.string,
      // Add other specimen-specific error properties if necessary
    }),
  }).isRequired,
};

/**
 * Biobank Barcode Form
 *
 * Acts a subform for BiobankSpecimenForm
 */
class SpecimenBarcodeForm extends React.Component {
  /**
   * Constructor
   */
  constructor() {
    super();
    this.setContainer = this.setContainer.bind(this);
    this.setSpecimen = this.setSpecimen.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if typeId has changed
    if (prevProps.item.typeId !== this.props.item.typeId) {
      this.props.setListItem('collection', {}, this.props.itemKey);
    }
  }

  /**
   * Set the current container.
   *
   * @param {string} name - the name
   * @param {string} value - the value
   */
  setContainer(name, value) {
    let container = this.props.item.container;
    container[name] = value;
    this.props.setListItem('container', container, this.props.itemKey);
  }

  /**
   * Set the specimen
   *
   * @param {string} name - a name
   * @param {string} value - a value
   */
  setSpecimen(name, value) {
    this.props.setListItem(name, value, this.props.itemKey);
  }

  /**
   * Render the React component
   *
   * @return {JSX}
   */
  render() {
    const {options, errors, item} = this.props;

    // XXX: Only allow the selection of child types
    const renderSpecimenTypes = () => {
      let specimenTypes;
      if (this.props.typeId) {
        specimenTypes = Object.entries(options.specimen.types).reduce(
          (result, [id, type]) => {
            if (id == this.props.typeId) {
              result[id] = type;
            }
            if (type.parentTypeIds) {
              type.parentTypeIds.forEach(
                (i) => {
                  if (i == this.props.typeId) {
                    result[id] = type;
                  }
                }
              );
            }
            return result;
          }, {}
        );
      } else {
        specimenTypes = options.specimen.types;
      }

      return mapFormOptions(specimenTypes, 'label');
    };
    const containerTypesPrimary = mapFormOptions(
      options.container.typesPrimary,
      'label',
    );

    const validContainers = {};
    if (item.typeId && options.specimen.typeContainerTypes[item.typeId]) {
      Object.keys(containerTypesPrimary).forEach(
        (id) => {
          options.specimen.typeContainerTypes[item.typeId].forEach(
            (i) => {
              if (id == i) {
                validContainers[id] = containerTypesPrimary[id];
              }
            }
          );
        }
      );
    }
    return (
      <ListItem {...this.props}>
        <TextboxElement
          name='barcode'
          label={this.props.t('Barcode', {ns: 'biobank'})}
          onUserInput={this.setContainer}
          required={true}
          value={item.container.barcode}
          errorMessage={(errors.container||{}).barcode}
        />
        <SelectElement
          name="typeId"
          label={this.props.t("Specimen Type", {ns: 'biobank'})}
          options={renderSpecimenTypes()}
          onUserInput={this.setSpecimen}
          required={true}
          value={item.typeId}
          errorMessage={(errors.specimen||{}).typeId}
        />
        <SelectElement
          name="typeId"
          label={this.props.t("Container Type", {ns: 'biobank'})}
          options={item.typeId ? validContainers : containerTypesPrimary}
          onUserInput={this.setContainer}
          required={true}
          value={item.container.typeId}
          errorMessage={(errors.container||{}).typeId}
          autoSelect={true}
        />
        <TextboxElement
          name='lotNumber'
          label={this.props.t('Lot Number', {ns: 'biobank'})}
          onUserInput={this.setContainer}
          value={item.container.lotNumber}
          errorMessage={(errors.container||{}).lotNumber}
        />
        <DateElement
          name='expirationDate'
          label={this.props.t('Expiration Date', {ns: 'biobank'})}
          onUserInput={this.setContainer}
          value={item.container.expirationDate}
          errorMessage={(errors.container||{}).expirationDate}
        />
        <SpecimenProcessForm
          edit={true}
          errors={(errors.specimen||{}).collection}
          options={options}
          process={item.collection}
          processStage='collection'
          setParent={this.setSpecimen}
          typeId={item.typeId}
        />
      </ListItem>
    );
  }
}

// SpecimenBarcodeForm.propTypes
SpecimenBarcodeForm.propTypes = {
  typeId: PropTypes.number,
  // Item prop: Contains container and specimen information
  item: PropTypes.shape({
    container: PropTypes.shape({
      barcode: PropTypes.string.isRequired,
      typeId: PropTypes.number.isRequired,
      lotNumber: PropTypes.string,
      expirationDate: PropTypes.string,
    }).isRequired,
    typeId: PropTypes.number.isRequired,
    collection: PropTypes.string,
  }).isRequired,

  // Functional props
  setListItem: PropTypes.func.isRequired,
  validateListItem: PropTypes.func.isRequired,

  // Key prop for list items
  itemKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // Options prop: Configuration options for container and specimen
  options: PropTypes.shape({
    container: PropTypes.shape({
      typesPrimary: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    specimen: PropTypes.shape({
      typeContainerTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
      types: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
    }).isRequired,
  }).isRequired,

  // Errors prop: Handles validation errors for container and specimen
  errors: PropTypes.shape({
    container: PropTypes.shape({
    }),
    specimen: PropTypes.shape({
    }),
  }).isRequired,
};

export default withTranslation(['biobank', 'loris'])(SpecimenForm);
