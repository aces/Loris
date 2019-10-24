/**
 * React component used to display a button and a collapsible list
 * with attachments.
 */
import React, {Component} from 'react';

class FileCollectionList extends Component {
  constructor(props) {
    super(props);

    this.state = {collapsed: true};

    // Bind component instance to custom methods
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const changes = this.props.fileHistory.reduce(function(carry, item) {
      let label = item.dateAdded.concat(' - ', item.addedBy);
      if (!carry[label]) {
        carry[label] = {};
      }
      carry[label][item.fieldChanged] = item.newValue;
      return carry;
    }, {});

    const history = Object.keys(changes).sort().reverse().map(function(key, i) {
      const textItems = Object.keys(changes[key]).map(function(index, j) {
        return (
          <div key={j} className='row'>
            <div className='col-md-2'>
              <div className='col-md-8'><b>{index}</b></div>
              <div className='col-md-4'> to </div>
            </div>
            <div className='col-md-10'><i>{changes[key][index]}</i></div>
          </div>
        );
      }, this);

      return (
        <div key={i}>
          <hr/>
          <div className='history-item-label'>
            <span>{key}</span> updated :
          </div>
          <div className='history-item-changes'>
            {textItems}
          </div>
        </div>
      );
    }, this);

    return (
      <div id='file-collection'>
        <h3>Attachment History</h3>
        {history}
      </div>
    );
  }
}

export default FileCollectionList;
