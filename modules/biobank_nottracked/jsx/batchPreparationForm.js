import SpecimenProcessForm from './processForm';

/**
 * Biobank BatchPreparation Specimen Form
 *
 * TODO: DESCRIPTION
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/
class BatchPreparationForm extends React.Component {
  constructor() {
    super();

    this.setPreparationList = this.setPreparationList.bind(this);
    this.setPool = this.setPool.bind(this);
  };

  setPreparationList(containerId) {
    this.props.setCurrent('containerId', 1)
      .then(()=>this.props.setCurrent('containerId', null));

    const list = this.props.current.list;
    const container = this.props.data.containers.primary[containerId];
    const specimen = Object.values(this.props.data.specimens).find(
      (specimen) => specimen.containerId == containerId
    );

    let count = this.props.current.count;
    if (count == null) {
      count = 0;
    } else {
      count++;
    }

    // Use setListItem here instead.
    list[count] = {specimen, container};

    this.props.setCurrent('list', list);
    this.props.setCurrent('count', count);
    this.props.setCurrent('typeId', specimen.typeId);
    this.props.setCurrent('centerId', container.centerId);
  }

  setPool(name, poolId) {
    const specimens = Object.values(this.props.data.specimens)
      .filter((specimen) => specimen.poolId == poolId);

    this.props.setCurrent(name, poolId)
      .then(() => Promise.all(specimens
        .map((specimen) => Object.values(this.props.current.list)
          .find((item) => item.specimen.id === specimen.id)
          || this.setPreparationList(specimen.containerId))
        .map((p) => p instanceof Promise ? p : Promise.resolve(p))))
      .then(() => this.props.setCurrent(name, null));
  }

  render() {
    const {current, data, errors, options, setCurrent} = this.props;
    const list = current.list;

    // Create options for barcodes based on match typeId
    const containersPrimary = Object.values(data.containers.primary)
      .reduce((result, container) => {
        const specimen = Object.values(data.specimens).find(
          (specimen) => specimen.containerId == container.id
        );
        const availableId = Object.keys(options.container.stati).find(
          (key) => options.container.stati[key].label == 'Available'
        );
        const protocolExists = Object.values(options.specimen.protocols).find(
          (protocol) => protocol.typeId == specimen.typeId
        );

        if (specimen.quantity != 0 && container.statusId == availableId
            && protocolExists) {
          if (current.typeId) {
            if (
               specimen.typeId == current.typeId
               && container.centerId == current.centerId
             ) {
              result[container.id] = container;
            }
          } else {
            result[container.id] = container;
          }
        }
        return result;
      }, {}
    );

    const validContainers = Object.keys(containersPrimary).reduce((result, id) => {
      const inList = Object.values(list).find((i) => i.container.id == id);
      if (!inList) {
        result[id] = containersPrimary[id];
      }
      return result;
    }, {});

    const barcodesPrimary = this.props.mapFormOptions(validContainers, 'barcode');

    const specimenInput = (
      <SearchableDropdown
        name={'containerId'}
        label={'Specimen'}
        onUserInput={(name, containerId) => {
          containerId && this.setPreparationList(containerId);
        }}
        options={barcodesPrimary}
        value={current.containerId}
      />
    );

    const preparationForm = (
      <SpecimenProcessForm
        edit={true}
        errors={errors.preparation}
        mapFormOptions={this.props.mapFormOptions}
        options={options}
        process={current.preparation}
        processStage='preparation'
        setParent={setCurrent}
        setCurrent={setCurrent}
        typeId={current.typeId}
      />
    );

    const pools = this.props.mapFormOptions(data.pools, 'label');
    const glyphStyle = {
      color: '#DDDDDD',
      marginLeft: 10,
      cursor: 'pointer',
    };

    const barcodeList = Object.entries(current.list)
      .map(([key, item]) => {
        return (
          <div key={key} className='preparation-item'>
            <div>{item.container.barcode}</div>
            <div
              className='glyphicon glyphicon-remove'
              style={glyphStyle}
              onClick={() => this.props.removeListItem(key)}
            />
          </div>
        );
      });

    return (
      <FormElement>
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <StaticElement
              label='Preparation Note'
              text="Select or Scan the specimens to be prepared. Specimens must
                    have a Status of 'Available', have a Quantity of greater
                    than 0, and share the same Type. Any previous Preparation
                    associated with a Pooled Specimen will be overwritten if one
                    is added on this form."
            />
            <StaticElement
              label='Specimen Type'
              text={(options.specimen.types[current.typeId]||{}).label || '—'}
            />
            <StaticElement
              label='Site'
              text={options.centers[current.centerId] || '—'}
            />
            <div className='row'>
              <div className='col-xs-6'>
                <h4>Barcode Input</h4>
                <div className='form-top'/>
                {specimenInput}
                <SearchableDropdown
                  name={'poolId'}
                  label={'Pool'}
                  onUserInput={this.setPool}
                  options={pools}
                  value={current.poolId}
                />
              </div>
              <div className='col-xs-6'>
                <h4>Barcode List</h4>
                <div className='form-top'/>
                <div className='preparation-list'>
                  {barcodeList}
                </div>
              </div>
            </div>
            <div className='form-top'/>
            {preparationForm}
          </div>
        </div>
      </FormElement>
    );
  }
}

BatchPreparationForm.propTypes = {
};

export default BatchPreparationForm;
