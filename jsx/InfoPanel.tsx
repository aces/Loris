import {ReactElement, ReactNode} from 'react';

/**
 * Display a message in an information panel.
 *
 * @param {object} props - React props

 * @returns {ReactNode} - the InfoPanel
 */
function InfoPanel(props: {children: ReactNode}): ReactElement {
    return (
        <div className="alert alert-info"
           style={{
             backgroundColor: '#BEDFFF',
             color: 'black',
             display: 'flex',
             flexBasis: 'row',
             flexWrap: 'nowrap',
         }}>
            <div style={{
                alignSelf: 'center',
                padding: '1em',
            }}>
                <i style={{fontSize: '2em', color: 'blue'}}
                    className="fas fa-info-circle"></i>
            </div>
            <div style={{
                paddingLeft: '1em',
                alignSelf: 'center',
            }}>{props.children}</div>
         </div>
   );
}

export default InfoPanel;
