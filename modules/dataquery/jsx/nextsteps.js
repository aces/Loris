import {useState} from 'react';

/**
 * Next steps options for query navigation
 *
 * @param {object} props - React props
 *
 * @return {ReactDOM}
 */
function NextSteps(props) {
    const [expanded, setExpanded] = useState(true);
    const steps = [];


    const canRun = (props.fields && props.fields.length > 0);
    const fieldLabel = (props.fields && props.fields.length > 0)
        ? 'Modify Fields'
        : 'Choose Fields';
    const filterLabel = (props.filters && props.filters.group.length > 0)
        ? 'Modify Filters'
        : 'Add Filters';
    switch (props.page) {
    case 'Info':
        if (canRun) {
            // A previous query was loaded, it can be either
            // modified or run
            steps.push(<ButtonElement
                    label={fieldLabel}
                    columnSize='col-sm-12'
                    key='fields'
                    onUserInput={() => props.changePage('DefineFields')}
            />);
            steps.push(<ButtonElement
                    label={filterLabel}
                    columnSize='col-sm-12'
                    key='filters'
                    onUserInput={() => props.changePage('DefineFilters')}
            />);
            steps.push(<ButtonElement
                    label='Run Query'
                    columnSize='col-sm-12'
                    key='runquery'
                    onUserInput={() => props.changePage('ViewData')}
            />);
        } else {
            // No query loaded, must define fields
            steps.push(<ButtonElement
                    label={fieldLabel}
                    columnSize='col-sm-12'
                    key='fields'
                    onUserInput={() => props.changePage('DefineFields')}
            />);
        }
        break;
    case 'DefineFields':
        steps.push(<ButtonElement
                label={filterLabel}
                columnSize='col-sm-12'
                key='filters'
                onUserInput={() => props.changePage('DefineFilters')}
        />);
        if (canRun) {
            steps.push(<ButtonElement
                    label='Run Query'
                    columnSize='col-sm-12'
                    key='runquery'
                    onUserInput={() => props.changePage('ViewData')}
            />);
        }
        break;
    case 'DefineFilters':
        if (canRun) {
            steps.push(<ButtonElement
                    label='Run Query'
                    key='runquery'
                    columnSize='col-sm-12'
                    onUserInput={() => props.changePage('ViewData')}
            />);
        }
        steps.push(<ButtonElement
                label={fieldLabel}
                key='fields'
                columnSize='col-sm-12'
                onUserInput={() => props.changePage('DefineFields')}
        />);
        break;
    case 'ViewData':
        steps.push(<ButtonElement
                label={fieldLabel}
                key='fields'
                columnSize='col-sm-12'
                onUserInput={() => props.changePage('DefineFields')}
        />);
        steps.push(<ButtonElement
                label={filterLabel}
                key='filters'
                columnSize='col-sm-12'
                onUserInput={() => props.changePage('DefineFilters')}
        />);
        break;
    }

    const expandIcon = <i
            style={{transform: 'scaleY(2)', fontSize: '2em'}}
            className='fas fa-chevron-left'
            onClick={() => setExpanded(!expanded)}
        ></i>;
    const style = expanded ? {
        background: 'white',
        padding: '0.5em',
        paddingLeft: '2em',
    } : {
        display: 'none',
        visibility: 'hidden',
        padding: '0.5em',
        paddingLeft: '2em',
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            right: 10,
            // Fix the height size so it doesn't move when
            // expanded or collapsed
            height: 120,
            // Make sure we're on top of the footer
            zIndex: 300,
        }}>
          <div style={{
              display: 'flex',
              alignItems: 'stretch',
              height: 120,
            }}>
              <div style={style}>
                <h3>Next Steps</h3>
                <div style={{display: 'flex'}}>
                    {steps}
                </div>
              </div>
              <div
                  style={{alignSelf: 'center'}}
              >{expandIcon}</div>
          </div>
        </div>
    );
}

export default NextSteps;
