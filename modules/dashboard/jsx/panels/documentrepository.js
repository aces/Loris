import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'Panel';

/**
 * Document Repository Notifications Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class DocumentRepositoryNotifications extends Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
  }

  /**
   * @return {DOMRect}
   */
  render() {
    if (this.props.display) {
      let panel = {
        documentRepository: {
          content: [],
          div: null,
        },
      };
      if (this.props.data) {
        let notifications = [];
        for (let notification in this.props.data.notifications) {
          if (this.props.data.notifications.hasOwnProperty(notification)) {
            notifications.push(
              (
                <a key={'document_repository_list_item_' + notification}
                  href={
                  'AjaxHelper.php?Module=document_repository&script=GetFile.php&File=' +
                  this.props.data.notifications[notification].Data_dir
                }
                   download={
                     this.props.data.notifications[notification].File_name
                   }
                   className={'list-group-item'}>
                  {parseInt(this.props.data.notifications[notification].new) === 1 ? (
                    <span className={'pull-left new-flag'}>NEW</span>
                  ) : null}
                  <span className={'pull-right text-muted small'}>
                    Uploaded: {
                    this.props.data.notifications[notification].Date_uploaded
                  }
                  </span>
                  <br/>
                  {this.props.data.notifications[notification].File_name}
                </a>
              )
            );
          }
        }
        panel.documentRepository.content.push(notifications);

        panel.documentRepository.div = (
          <div className={'list-group document-repository-item'}>
            {panel.documentRepository.content.length > 0 ?
              panel.documentRepository.content
              : 'There have been no documents yet.'}
          </div>
        );
      }
      return (
        <Panel
          title={'Document Repository Notifications'}
          id={'documentRepositoryPanel'}
        >
          {panel.documentRepository.div}
          <a href={window.location.origin + '/document_repository/'}
             className={'btn btn-default btn-block'}>Document Repository
            <span className={'glyphicon glyphicon-chevron-right'}/></a>
        </Panel>
      );
    } else {
      return null;
    }
  }
}
DocumentRepositoryNotifications.defaultProps = {
  display: false,
  data: null,
};

DocumentRepositoryNotifications.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default DocumentRepositoryNotifications;
