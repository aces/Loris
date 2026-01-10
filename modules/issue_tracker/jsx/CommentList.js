import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Markdown from 'jsx/Markdown';
import {withTranslation, Trans} from 'react-i18next';

/**
 * React component used to display a button and a collapsible list
 * with comments.
 */
class CommentList extends Component {
  /**
   * @constructor
   * @param {object} props - React Component properties
   */
  constructor(props) {
    super(props);

    this.state = {collapsed: true};

    // Bind component instance to custom methods
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  /**
   * Toggle Collapsed
   */
  toggleCollapsed() {
    this.setState({collapsed: !this.state.collapsed});
  }

  /**
   * Maps field names to their translated labels
   *
   * @param {string} fieldName - The field name from database
   * @param {function} t - Translation function
   * @return {string} - Translated label
   */
  getFieldLabel(fieldName, t) {
    const fieldLabelMap = {
      'title': t('Title', {ns: 'issue_tracker'}),
      'lastUpdatedBy': t('Last Updated By', {ns: 'issue_tracker'}),
      'assignee': t('Assignee', {ns: 'issue_tracker'}),
      'status': t('Status', {ns: 'loris'}),
      'priority': t('Priority', {ns: 'issue_tracker'}),
      'category': t('Category', {ns: 'issue_tracker'}),
      'site': t('Site', {ns: 'loris', count: 1}),
      'PSCID': t('PSCID', {ns: 'loris'}),
      'Visit Label': t('Visit Label', {ns: 'loris'}),
      'module': t('Module', {ns: 'loris'}),
      'instrument': t('Instrument', {ns: 'loris', count: 1}),
      'description': t('Description', {ns: 'issue_tracker'}),
      'externalIssueID': t('External Issue ID', {ns: 'issue_tracker'}),
    };
    return fieldLabelMap[fieldName] || fieldName;
  }

  render() {
    const {t} = this.props;
    const changes = this.props.commentHistory.reduce(function(carry, item) {
      let label = item.dateAdded.concat(' - ', item.addedBy);
      if (!carry[label]) {
        carry[label] = {
          data: {},
          user: item.addedBy,
          date: new Date(item.dateAdded),
        };
      }
      carry[label].data[item.fieldChanged] = item.newValue;
      return carry;
    }, {});

    const self = this;
    const history = Object.keys(changes).sort().reverse().map(function(key, i) {
      let comment;
      const item = changes[key];
      const textItems = Object.keys(item.data).map(function(index, j) {
        if (index == 'comment') {
          comment = <div className='history-comment'>
            <Markdown content={item.data[index]} />
          </div>;
          return;
        }
        const fieldLabel = self.getFieldLabel(index, t);
        return (
          <li key={j} className='row' style={{color: 'rgb(149, 149, 149)'}}>
            <div className='col-md-2'>
              <div className='col-md-8'><strong>{fieldLabel}</strong></div>
              <div className='col-md-4'>
                {' '}{t(' to ', {ns: 'issue_tracker'})}{' '}
              </div>
            </div>
            <div className='col-md-10'><i>{item.data[index]}</i></div>
          </li>
        );
      }, this);

      let now = new Date();
      const datediffSec = (now.getTime() - item.date.getTime()) / 1000;
      let headerstr;
      if (datediffSec < 60) {
        headerstr = <Trans
          ns="issue_tracker"
          defaults="Updated by <0>{{user}}</0> {{seconds}} seconds ago"
          components={[<span className='history-item-user' />]}
          values={{user: item.user, seconds: Math.round(datediffSec)}}
        />;
      } else if (datediffSec < 60*60) {
        headerstr = <Trans
          ns="issue_tracker"
          defaults="Updated by <0>{{user}}</0> {{minutes}} minutes ago"
          components={[<span className='history-item-user' />]}
          values={{user: item.user, minutes: Math.round(datediffSec / 60)}}
        />;
      } else if (datediffSec < 60*60*24) {
        headerstr = <Trans
          ns="issue_tracker"
          defaults="Updated by <0>{{user}}</0> {{hours}} hours ago"
          components={[<span className='history-item-user' />]}
          values={{user: item.user, hours: Math.round(datediffSec / (60*60))}}
        />;
      } else {
        const dateFormatter = new Intl.DateTimeFormat(
          loris.user.langpref.replace('_', '-'),
          {
            dateStyle: 'full',
            timeStyle: 'long',
          }
        );

        headerstr = <Trans
          ns="issue_tracker"
          defaults="Updated by <0>{{user}}</0> on {{date}}"
          components={[<span className='history-item-user' />]}
          values={{user: item.user, date: dateFormatter.format(item.date)}}
        />;
      }

      return (
        <div key={i}>
          <hr/>
          <div className='history-item-label'>{headerstr}</div>
          <ul className='history-item-changes'>{textItems}</ul>
          {comment}
        </div>
      );
    }, this);

    return (
      <div id='comment-history'>
        <h3>{t('Comments and History', {ns: 'issue_tracker'})}</h3>
        {history}
      </div>
    );
  }
}
CommentList.propTypes = {
  commentHistory: PropTypes.array,
  t: PropTypes.func,
};

export default withTranslation(['issue_tracker', 'loris'])(CommentList);
