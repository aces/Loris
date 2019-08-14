/**
 * Biobank Pool Specimen Form
 *
 * TODO: DESCRIPTION
 *
 * @author Henri Rabalais
 * @version 1.0.0
 *
 **/
class PoolSpecimenForm extends React.Component {
  render() {
    const {current, data, errors, options, setPool, setPoolList} = this.props;
    const list = current.list;

    // Create options for barcodes based on match candidateId, sessionId and
    // typeId and don't already belong to a pool.
    const barcodesPrimary = Object.values(data.containers.primary)
      .filter((container) => {
        const specimen = Object.values(data.specimens).find(
          (specimen) => specimen.containerId == container.id
        );
        const availableId = Object.keys(options.container.stati).find(
          (key) => options.container.stati[key].label === 'Available'
        );

        if (specimen.quantity != 0 &&
            container.statusId == availableId &&
            specimen.poolId == null) {
          if (current.candidateId) {
            if (
              specimen.candidateId == current.candidateId &&
              specimen.sessionId == current.sessionId &&
              specimen.typeId == current.typeId &&
              container.centerId == current.centerId
            ) {
              return true;
            }
          } else {
            return true;
          }
        }
        return false;
      })
    .filter((container) => !Object.values(list).find((i) => i.container.id == container.id))
    .reduce((result, container) => {
      result[container.id] = container.barcode;
      return result;
    }, {});

    const barcodeInput = (
      <SearchableDropdown
        name={'containerId'}
        label={'Specimen'}
        onUserInput={(name, containerId) => {
          containerId && setPoolList(containerId);
        }}
        options={barcodesPrimary}
        value={current.containerId}
        errorMessage={errors.pool.total}
      />
    );

    const specimenUnits = this.props.mapFormOptions(options.specimen.units, 'label');

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
      <FormElement name="poolSpecimenForm">
        <div className='row'>
          <div className='col-sm-10 col-sm-offset-1'>
            <StaticElement
              label='Pooling Note'
              text="Select or Scan the specimens to be pooled. Specimens must
                    be have a Status of 'Available', have a Quantity of greater
                    than 0, and share the same Type, PSCID, Visit Label
                    and Current Site. Pooled specimens cannot already belong to
                    a pool. Once pooled, the Status of specimen will be changed
                    to 'Dispensed' and there Quantity set to '0'"
            />
            <StaticElement
              label='Specimen Type'
              text={
                (options.specimen.types[current.typeId]||{}).label || '—'}
            />
            <StaticElement
              label='PSCID'
              text={(options.candidates[current.candidateId]||{}).pscid || '—'}
            />
            <StaticElement
              label='Visit Label'
              text={(options.sessions[current.sessionId]||{}).label || '—'}
            />
            <div className='row'>
              <div className='col-xs-6'>
                <h4>Barcode Input</h4>
                <div className='form-top'/>
                {barcodeInput}
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
            <TextboxElement
              name='label'
              label='Label'
              onUserInput={setPool}
              required={true}
              value={current.pool.label}
              errorMessage={errors.pool.label}
            />
            <TextboxElement
              name='quantity'
              label='Quantity'
              onUserInput={setPool}
              required={true}
              value={current.pool.quantity}
              errorMessage={errors.pool.quantity}
            />
            <SelectElement
              name='unitId'
              label='Unit'
              options={specimenUnits}
              onUserInput={setPool}
              required={true}
              value={current.pool.unitId}
              errorMessage={errors.pool.unitId}
            />
            <DateElement
              name='date'
              label='Date'
              onUserInput={setPool}
              required={true}
              value={current.pool.date}
              errorMessage={errors.pool.date}
            />
            <TimeElement
              name='time'
              label='Time'
              onUserInput={setPool}
              required={true}
              value={current.pool.time}
              errorMessage={errors.pool.time}
            />
          </div>
        </div>
      </FormElement>
    );
  }
}

PoolSpecimenForm.propTypes = {
};

export default PoolSpecimenForm;
