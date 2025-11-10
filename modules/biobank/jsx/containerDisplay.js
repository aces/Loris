import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

import {
  TextboxElement,
  StaticElement,
  CheckboxElement,
  FormElement,
  ButtonElement,
  SearchableDropdown,
} from 'jsx/Form';
import {mapFormOptions} from './helpers.js';

/**
 * React component to display a container
 *
 * @param {object} props - React props
 * @return {JSX}
 */
function ContainerDisplay(props) {
  const {
    barcodes,
    coordinates,
    current = {},
    data,
    dimensions,
    editable,
    options,
  } = props;
  const {history, select, container, selectedCoordinate} = props;
  const {
    clearAll,
    editContainer,
    setContainer,
    updateContainer,
    setCurrent,
    setCheckoutList,
    edit,
  } = props;

  const redirectURL = (e) => {
    let coordinate = e.target.id;
    if (coordinates[coordinate]) {
      let barcode = data.containers[coordinates[coordinate]].barcode;
      history.push(`/barcode=${barcode}`);
    }
  };

  const allowDrop = (e) => e.preventDefault();

  const drag = (e) => {
    let container = JSON.stringify(
      data.containers[coordinates[e.target.id]]
    );
    e.dataTransfer.setData('text/plain', container);
  };

  const drop = (e) => {
    e.preventDefault();
    const container = JSON.parse(e.dataTransfer.getData('text/plain'));
    const newCoordinate = parseInt(e.target.id);
    container.coordinate = newCoordinate;
    updateContainer(container, false);
  };

  const increaseCoordinate = (coordinate) => {
    const capacity = dimensions.x * dimensions.y * dimensions.z;
    coordinate++;
    Object.keys(coordinates).forEach((c) => {
      if (coordinate > capacity) {
        clearAll();
      } else if (c == coordinate) {
        coordinate++;
      }
    });
    setCurrent('coordinate', coordinate);
  };

  const setBarcode = (name, barcode) => setCurrent('barcode', barcode);

  const loadContainer = () => {
    const barcode = current.barcode;
    const containerId = Object.keys(barcodes)
      .find((id) => barcodes[id] === barcode);

    if (!containerId) {
      return;
    }

    const newContainer = data.containers[containerId];
    newContainer.parentContainerId = container.id;
    newContainer.coordinate = current.coordinate;

    updateContainer(newContainer, false)
      .then(() => {
        if (current.sequential) {
          let coordinate = current.coordinate;
          increaseCoordinate(coordinate);
          setCurrent('barcode', null);
        } else {
          clearAll();
        }
      });

    setCurrent('prevCoordinate', newContainer.coordinate);
  };

  const checkoutContainers = () => {
    const checkoutList = current.list;
    const checkoutPromises = Object.values(checkoutList).map((container) => {
      container.parentContainerId = null;
      container.coordinate = null;
      return updateContainer(container, false);
    });

    Promise.all(checkoutPromises)
      .then(() => clearAll())
      .then(() => Swal.fire(
        'Containers Successfully Checked Out!', '', 'success')
      );
  };

  let barcodeField;
  if ((editable||{}).loadContainer) {
    barcodeField = (
      <TextboxElement
        name='barcode'
        label='Barcode'
        onUserInput={setBarcode}
        value={current.barcode}
        placeHolder='Please Scan or Type Barcode'
        autoFocus={true}
      />
    );
  }

  let load = (
    <div className={((editable||{}).loadContainer) ? 'open' : 'closed'}>
      <FormElement>
        <StaticElement
          label='Note'
          text='Scan Containers to be Loaded. If Sequential is checked,
           the Coordinate will Auto-Increment after each Load.'
        />
        <CheckboxElement
          name='sequential'
          label='Sequential'
          value={current.sequential}
          onUserInput={setCurrent}
        />
        {barcodeField}
        <ButtonElement
          label='Load'
          onUserInput={loadContainer}
        />
        <StaticElement
          text={<a onClick={clearAll} style={{cursor: 'pointer'}}>Cancel</a>}
        />
      </FormElement>
    </div>
  );

  // place container children in an object
  let children = {};
  if ((container||{}).childContainerIds) {
    Object.values(data.containers).map((c) => {
      container.childContainerIds.forEach((id) => {
        if (c.id == id) {
          children[id] = c;
        }
      });
    });
  }

  if ((editable||{}).containerCheckout) {
    // Only children of the current container can be checked out.
    let barcodes = mapFormOptions(children, 'barcode');

    barcodeField = (
      <SearchableDropdown
        name='barcode'
        label='Barcode'
        options={barcodes}
        onUserInput={(name, value) => {
          value && setCheckoutList(children[value]);
        }}
        value={current.containerId}
        placeHolder='Please Scan or Select Barcode'
        autoFocus={true}
      />
    );
  }

  let checkout = (
    <div className={((editable||{}).containerCheckout) ? 'open' : 'closed'}>
      <FormElement>
        <StaticElement
          label='Note'
          text="Click, Select or Scan Containers to be
                Unloaded and Press 'Confirm'"
        />
        {barcodeField}
        <ButtonElement
          label='Confirm'
          type='button'
          onUserInput={checkoutContainers}
        />
        <StaticElement
          text={<a onClick={clearAll} style={{cursor: 'pointer'}}>Cancel</a>}
        />
      </FormElement>
    </div>

  );

  let display;
  let column = [];
  let row = [];
  let coordinate = 1;
  if (dimensions) {
    for (let y=1; y <= dimensions.y; y++) {
      column = [];
      for (let x=1; x <= dimensions.x; x++) {
        let nodeWidth = (500/dimensions.x) - (500/dimensions.x * 0.08);
        let nodeStyle = {width: nodeWidth};
        let nodeClass = 'node';
        let tooltipTitle = null;
        let title = null;
        let dataHtml = 'false';
        let dataToggle = null;
        let dataPlacement = null;
        let draggable = 'false';
        let onDragStart = null;
        let onDragOver = allowDrop;
        let onDrop = drop;
        let onClick = null;
        const optcon = options.container;

        if (!select) {
          if ((coordinates||{})[coordinate]) {
            onClick = redirectURL;
            if (coordinate in current.list) {
              nodeClass = 'node checkout';
            } else if (coordinate == current.prevCoordinate) {
              nodeClass = 'node new';
            } else {
              nodeClass = 'node occupied';
            }

            dataHtml = 'true';
            dataToggle = 'tooltip';
            dataPlacement = 'top';
            // This is to avoid a console error
            if (children[coordinates[coordinate]]) {
              const coord = coordinates[coordinate];
              tooltipTitle =
                '<h5>'+children[coord].barcode+'</h5>' +
                '<h5>'+optcon.types[children[coord].typeId].label+'</h5>' +
                '<h5>'+optcon.stati[children[coord].statusId].label+'</h5>';
            }
            draggable = !loris.userHasPermission(
              'biobank_container_update') ||
                        editable.loadContainer ||
                        editable.containerCheckout
              ? 'false' : 'true';
            onDragStart = drag;

            if (editable.containerCheckout) {
              onClick = (e) => {
                let container = data.containers[coordinates[e.target.id]];
                setCheckoutList(container);
              };
            }
            if (editable.loadContainer) {
              onClick = null;
            }
            onDragOver = null;
            onDrop = null;
          } else if (loris.userHasPermission('biobank_container_update') &&
                     !editable.containerCheckout) {
            nodeClass = coordinate == current.coordinate ?
              'node selected' : 'node load';
            title = 'Load...';
            onClick = (e) => {
              let containerId = e.target.id;
              edit('loadContainer')
                .then(() => editContainer(container))
                .then(() => setCurrent('coordinate', containerId));
            };
          }
        }

        if (select) {
          if (coordinate == selectedCoordinate) {
            nodeClass = 'node occupied';
          } else if (selectedCoordinate instanceof Array &&
                     selectedCoordinate.includes(coordinate)) {
            nodeClass = 'node occupied';
          } else if (!coordinates) {
            nodeClass = 'node available';
            onClick = (e) => setContainer('coordinate', e.target.id);
          } else if (coordinates) {
            if (!coordinates[coordinate]) {
              nodeClass = 'node available';
              onClick = (e) => setContainer('coordinate', e.target.id);
            } else if (coordinates[coordinate]) {
              const childContainer = data.containers[coordinates[coordinate]];
              const specimen = Object.values(data.specimens)
                .find((specimen) => specimen.containerId == childContainer.id);
              let quantity = '';
              if (specimen) {
                quantity = `<h5>${specimen.quantity +
                    ' '+options.specimen.units[specimen.unitId].label}</h5>`;
              }
              dataHtml = 'true';
              dataToggle = 'tooltip';
              dataPlacement = 'top';
              tooltipTitle =
                `<h5>${childContainer.barcode}</h5>` +
                `<h5>${optcon.types[childContainer.typeId].label}</h5>` +
                quantity +
                `<h5>${optcon.stati[childContainer.statusId].label}</h5>`;
            }
          }
        }

        let coordinateDisplay;
        if (dimensions.xNum == 1 && dimensions.yNum == 1) {
          coordinateDisplay = x + (dimensions.x * (y-1));
        } else {
          const xVal = dimensions.xNum == 1 ? x : String.fromCharCode(64+x);
          const yVal = dimensions.yNum == 1 ? y : String.fromCharCode(64+y);
          coordinateDisplay = yVal+''+xVal;
        }

        column.push(
          <div
            key={x}
            id={coordinate}
            title={title}
            className={nodeClass}
            data-html={dataHtml}
            data-toggle={dataToggle}
            data-placement={dataPlacement}
            data-original-title={tooltipTitle}
            style={nodeStyle}
            onClick={onClick}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            {coordinateDisplay}
          </div>
        );

        coordinate++;
      }

      let rowHeight = (500/dimensions.y) - (500/dimensions.y * 0.08);
      // let rowMargin = (500/dimensions.y * 0.04);
      let rowStyle = {height: rowHeight};

      row.push(
        <div key={y} className='row' style={rowStyle}>{column}</div>
      );
    }

    display = row;
  }

  return (
    <div>
      <div style={{width: 500}}>
        {checkout}
        {load}
      </div>
      <div className='display'>
        {display}
      </div>
    </div>
  );
}

// containerDisplay.propTypes
ContainerDisplay.propTypes = {
  barcodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  coordinates: PropTypes.arrayOf(PropTypes.string).isRequired,
  current: PropTypes.shape({
    barcode: PropTypes.string.isRequired,
    containerId: PropTypes.number.isRequired,
    coordinate: PropTypes.string.isRequired,
    sequential: PropTypes.number,
    list: PropTypes.array.isRequired,
    prevCoordinate: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    containers: PropTypes.arrayOf(
      PropTypes.shape({
        specimenId: PropTypes.number.isRequired,
        parentContainerId: PropTypes.number,
        coordinate: PropTypes.string.isRequired,
        childContainerIds: PropTypes.arrayOf(PropTypes.number),
      })
    ).isRequired,
    specimens: PropTypes.array.isRequired,
    pools: PropTypes.array.isRequired,
  }).isRequired,
  dimensions: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number,
    xNum: PropTypes.number,
    yNum: PropTypes.number,
  }).isRequired,
  editable: PropTypes.shape({
    loadContainer: PropTypes.func.isRequired,
    containerCheckout: PropTypes.bool.isRequired,
  }).isRequired,
  options: PropTypes.shape({
    container: PropTypes.shape({
      types: PropTypes.arrayOf(PropTypes.string).isRequired,
      stati: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
        })
      ).isRequired,
      dimensions: PropTypes.object.isRequired,
    }).isRequired,
    specimen: PropTypes.shape({
      units: PropTypes.string,
      protocols: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  container: PropTypes.shape({
    id: PropTypes.number.isRequired,
    parentContainerId: PropTypes.number,
    childContainerIds: PropTypes.array,
    coordinate: PropTypes.string.isRequired,
  }).isRequired,
  selectedCoordinate: PropTypes.string.isRequired,
  clearAll: PropTypes.func.isRequired,
  editContainer: PropTypes.func.isRequired,
  setContainer: PropTypes.func.isRequired,
  updateContainer: PropTypes.func.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setCheckoutList: PropTypes.func.isRequired,
  edit: PropTypes.func.isRequired,
  getParentContainerBarcodes: PropTypes.func.isRequired,
  getBarcodePathDisplay: PropTypes.func.isRequired,
};

export default ContainerDisplay;
