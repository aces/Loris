import SpecimenProcessForm from './processForm';
import ContainerParentForm from './containerParentForm';
import {ListForm, ListItem} from './listForm';
import Modal from 'Modal';
import {mapFormOptions, clone, padBarcode} from './helpers.js';

const initialState = {
  list: {},
  current: {container: {}},
  printBarcodes: false,
  errors: {specimen: {}, container: {}, list: {}},
};

/**
 * Biobank Collection Form
 *
 * Fetches data from Loris backend and displays a form allowing
 * to specimen a biobank file attached to a specific instrument
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 * */
class SpecimenForm extends React.Component {
  constructor() {
    super();

    this.state = initialState;
    this.setList = this.setList.bind(this);
    this.setCurrent = this.setCurrent.bind(this);
    this.setContainer = this.setContainer.bind(this);
    this.setProject = this.setProject.bind(this);
    this.setSession = this.setSession.bind(this);
    this.generateBarcodes = this.generateBarcodes.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

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

  setCurrent(name, value) {
    const {current} = clone(this.state);
    current[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  }

  setContainer(name, value) {
    const {current} = clone(this.state);
    current.container[name] = value;
    return new Promise((res) => this.setState({current}, res()));
  };

  setList(list) {
    this.setState({list});
  }

  setProject(name, value) {
    const {current} = clone(this.state);
    current[name] = [value];
    return new Promise((res) => this.setState({current}, res()));
  }

  /**
   * When a session is selected, set the sessionId, centerId and originId.
   *
   * @param {object} session
   * @param {in} sessionId
   */
  setSession(session, sessionId) {
    const {current} = clone(this.state);
    current.centerId = this.props.options.sessionCenters[sessionId].centerId;
    current.originId = current.centerId;
    current.sessionId = sessionId;
    this.setState({current});
  }

  incrementBarcode(pscid, increment = 0) {
    increment++;
    const barcode = padBarcode(pscid, increment);
    if (Object.values(this.props.data.containers)
         .some((container) => container.barcode === barcode)) {
      increment = this.incrementBarcode(pscid, increment);
    }
    if (Object.values(this.state.list)
         .some((specimen) => specimen.container.barcode === barcode)) {
      increment = this.incrementBarcode(pscid, increment);
    }
    return increment;
  };

  generateBarcodes() {
    const {options} = this.props;
    let {list, current} = this.state;
    const pscid = options.candidates[current.candidateId].pscid;
    [list] = Object.keys(list)
      .reduce(([result, increment], key, i) => {
        const specimen = this.state.list[key];
        if (!specimen.container.barcode) {
          const barcode = padBarcode(pscid, increment);
          specimen.container.barcode = barcode;
          increment = this.incrementBarcode(pscid, increment);
        }
        result[key] = specimen;
        return [result, increment];
    }, [{}, this.incrementBarcode(pscid)]);
    this.setState({list});
  };

  handleSubmit() {
    const {list, current, printBarcodes} = this.state;
    return new Promise((resolve, reject) => {
      this.props.onSubmit(list, current, printBarcodes)
      .then(() => resolve(), (errors) => this.setState({errors}, reject()));
    });
  }

  render() {
    const {errors, current, list} = this.state;
    const {options, data, parent} = this.props;

    const renderNote = () => {
      if (parent) {
        return (
          <StaticElement
            label='Note'
            text='To create new aliquots, enter a Barcode, fill out the coresponding
                  sub-form and press Submit. Press "New Entry" button to add
                  another barcode field, or press for the "Copy" button to
                  duplicate the previous entry.'
          />
        );
      } else {
        return (
          <StaticElement
            label='Note'
            text='To create new specimens, first select a PSCID and Visit Label.
                  Then, enter a Barcode, fill out the coresponding sub-form and press
                  submit. Press "New Entry" button to add another barcode field,
                  or press for the "Copy" button to duplicate the previous entry.'
          />
        );
      }
    };

    const renderGlobalFields = () => {
      if (parent && current.candidateId && current.sessionId) {
        const parentBarcodes = Object.values(parent).map((item) => item.container.barcode);
        const parentBarcodesString = parentBarcodes.join(', ');
        return (
          <div>
            <StaticElement
              label="Parent Specimen(s)"
              text={parentBarcodesString}
            />
            <StaticElement
              label="PSCID"
              text={options.candidates[current.candidateId].pscid}
            />
            <StaticElement
              label="Visit Label"
              text={options.sessions[current.sessionId].label}
            />
          </div>
        );
      } else {
      const sessions = current.candidateId ?
        mapFormOptions(options.candidateSessions[current.candidateId], 'label')
        : {};
      const candidates = mapFormOptions(this.props.options.candidates, 'pscid');
        return (
          <div>
            <SearchableDropdown
              name="candidateId"
              label="PSCID"
              options={candidates}
              onUserInput={this.setCurrent}
              required={true}
              value={current.candidateId}
              placeHolder='Search for a PSCID'
              errorMessage={errors.specimen.candidateId}
            />
            <SelectElement
              name='sessionId'
              label='Visit Label'
              options={sessions}
              onUserInput={this.setSession}
              required={true}
              value={current.sessionId}
              disabled={current.candidateId ? false : true}
              errorMessage={errors.specimen.sessionId}
              autoSelect={true}
            />
          </div>
        );
      }
    };

    const renderRemainingQuantityFields = () => {
      if (parent) {
        if (loris.userHasPermission('biobank_specimen_update') && parent.length === 1) {
          const specimenUnits = mapFormOptions(this.props.options.specimen.units, 'label');
          return (
            <div>
              <TextboxElement
                name="quantity"
                label="Remaining Quantity"
                onUserInput={this.props.setSpecimen}
                required={true}
                value={this.props.current.specimen.quantity}
              />
              <SelectElement
                name="unitId"
                label="Unit"
                options={specimenUnits}
                onUserInput={this.props.setSpecimen}
                required={true}
                value={this.props.current.specimen.unitId}
                autoSelect={true}
              />
            </div>
          );
        }
      }
    };

    // Container to be passed to the ContainerParentForm to generate displayed
    // placeholders for the position of the specimens to be created.
    const container = clone(current.container);
    if (container.parentContainerId) {
      container.coordinate = [];
      Object.keys(list).reduce((coord, key) => {
        coord = this.props.increaseCoordinate(coord, container.parentContainerId);
        const coordinates = [...container.coordinate, parseInt(coord)];
        container.coordinate = coordinates;
        return coord;
      }, 0);
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
        <FormElement>
          <div className='row'>
            <div className="col-xs-11">
              {renderNote()}
              {renderGlobalFields()}
              <SelectElement
                name='projectIds'
                label='Project'
                options={this.props.options.projects}
                onUserInput={this.setProject}
                required={true}
                value={current.projectIds}
                disabled={current.candidateId ? false : true}
                errorMessage={errors.container.projectIds}
              />
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
            label='Generate Barcodes'
            type='button'
            onUserInput={this.generateBarcodes}
            disabled={current.candidateId ? false : true}
          />
          <CheckboxElement
            name='printBarcodes'
            label='Print Barcodes'
            onUserInput={(name, value) => this.setState({[name]: value})}
            value={this.state.printBarcodes}
          />
        </FormElement>
      </Modal>
    );
  }
}

SpecimenForm.propTypes = {
};

SpecimenForm.defaultProps = {
  specimenList: {},
};

/**
 * Biobank Barcode Form
 *
 * Acts a subform for BiobankSpecimenForm
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/
class SpecimenBarcodeForm extends React.Component {
  constructor() {
    super();
    this.setContainer = this.setContainer.bind(this);
    this.setSpecimen = this.setSpecimen.bind(this);
  }

  setContainer(name, value) {
    let container = this.props.item.container;
    container[name] = value;
    this.props.setListItem('container', container, this.props.itemKey);
  }

  setSpecimen(name, value) {
    this.props.setListItem(name, value, this.props.itemKey);
  }

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
              type.parentTypeIds.forEach((i) => {
                if (i == this.props.typeId) {
                  result[id] = type;
                }
              });
            }

            return result;
          }, {}
        );
      } else {
        specimenTypes = options.specimen.types;
      }

      return mapFormOptions(specimenTypes, 'label');
    };
    const containerTypesPrimary = mapFormOptions(options.container.typesPrimary, 'label');

    const validContainers = {};
    if (item.typeId && options.specimen.typeContainerTypes[item.typeId]) {
      Object.keys(containerTypesPrimary).forEach((id) => {
        options.specimen.typeContainerTypes[item.typeId].forEach((i) => {
          if (id == i) {
            validContainers[id] = containerTypesPrimary[id];
          }
        });
      });
    }
    return (
      <ListItem {...this.props}>
        <TextboxElement
          name='barcode'
          label='Barcode'
          onUserInput={this.setContainer}
          required={true}
          value={item.container.barcode}
          errorMessage={(errors.container||{}).barcode}
        />
        <SelectElement
          name="typeId"
          label="Specimen Type"
          options={renderSpecimenTypes()}
          onUserInput={this.setSpecimen}
          required={true}
          value={item.typeId}
          errorMessage={(errors.specimen||{}).typeId}
        />
        <SelectElement
          name="typeId"
          label="Container Type"
          options={item.typeId ? validContainers : containerTypesPrimary}
          onUserInput={this.setContainer}
          required={true}
          value={item.container.typeId}
          errorMessage={(errors.container||{}).typeId}
          autoSelect={true}
        />
        <TextboxElement
          name='lotNumber'
          label='Lot Number'
          onUserInput={this.setContainer}
          value={item.container.lotNumber}
          errorMessage={(errors.container||{}).lotNumber}
        />
        <DateElement
          name='expirationDate'
          label='Expiration Date'
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

SpecimenBarcodeForm.propTypes = {
};

SpecimenBarcodeForm.defaultProps = {
  specimen: {},
};

export default SpecimenForm;
