import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'PanelTabs';

import * as chartBuilder from '../helper/chartBuilder';

/**
 * Recruitment Panel.
 *
 * @description panel for dashboard.
 *
 * @author Alizée Wickenheiser
 * @version 1.0.0
 *
 */
class Recruitment extends Component {
  /**
   * Constructor of component
   * @param {object} props - the component properties.
   */
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    chartBuilder.process();
  }

  progressBarBuilder(json) {
    if (this.props.data.progress.overall.recruitment_target) {
      json.title = <h5>{this.props.data.progress.overall.title}</h5>;
      if (this.props.data.progress.overall.surpassed_recruitment) {
        json.content = (
          <div>
            <p>
              The recruitment target (
              {this.props.data.progress.overall.recruitment_target}
              ) has been passed.
            </p>
            <div className='progress'>
              <div className='progress-bar progress-bar-female'
                   role='progressbar'
                   style={
                     {
                       width: this.props.data.progress.overall.female_full_percent + '%',
                     }
                   }
                   data-toggle='tooltip'
                   data-placement='bottom'
                   title={
                     this.props.data.progress.overall.female_full_percent + '%'
                   }
              >
                <p>
                  {this.props.data.progress.overall.female_total}
                  <br/>
                  Females
                </p>
              </div>
              <div className='progress-bar progress-bar-male'
                   data-toggle='tooltip'
                   data-placement='bottom'
                   role='progressbar'
                   style={
                     {
                       width: this.props.data.progress.overall.male_full_percent + '%',
                     }
                   }
                   title={
                     this.props.data.progress.overall.male_full_percent + '%'
                   }
              >
                <p>
                  {this.props.data.progress.overall.male_total}
                  <br/>
                  Males
                </p>
              </div>
              <p className='pull-right small target'>
                Target: {this.props.data.progress.overall.recruitment_target}
              </p>
            </div>
          </div>
        );
      } else {
        json.content = (
          <div className='progress'>
            <div className='progress-bar progress-bar-female'
                 role='progressbar'
                 style={
                   {
                     width: this.props.data.progress.overall.female_percent + '%',
                   }
                 }
                 data-toggle='tooltip'
                 data-placement='bottom'
                 title={this.props.data.progress.overall.female_percent + '%'}
            >
              <p>
                {this.props.data.progress.overall.female_total}
                <br/>
                Females
              </p>
            </div>
            <div className='progress-bar progress-bar-male'
                 data-toggle='tooltip'
                 data-placement='bottom'
                 role='progressbar'
                 style={
                   {
                     width: this.props.data.progress.overall.male_percent + '%',
                   }
                 }
                 title={this.props.data.progress.overall.male_percent + '%'}
            >
              <p>
                {this.props.data.progress.overall.male_total}
                <br/>
                Males
              </p>
            </div>
            <p className='pull-right small target'>
              Target: {this.props.data.progress.overall.recruitment_target}
            </p>
          </div>
        );
      }
    } else {
      json.content = (
        <div>
          Please add a recruitment target for {
          this.props.data.progress.overall.title
        }.
        </div>
      );
    }
    return json;
  }

  /**
   * @return {DOMRect}
   */
  render() {
    if (this.props.display) {
      let panel = {
        overall: {
          title: null,
          content: null,
          div: null,
        },
        siteBreakdown: {
          content: null,
          div: null,
        },
        useProjects: {
          content: [],
          div: null,
        },
      };
      if (this.props.data) {
        panel.overall = this.progressBarBuilder(panel.overall);
        panel.overall.div = (
          <div className='recruitment-panel' id='overall-recruitment'>
            {panel.overall.title}
            {panel.overall.content}
          </div>
        );
        if (this.props.data.progress['overall'] &&
          this.props.data.progress.overall.total_recruitment > 0) {
          panel.siteBreakdown.content = (
            <div>
              <div className='col-lg-4 col-md-4 col-sm-4'>
                <div>
                  <h5 className='chart-title'>
                    Total recruitment per site
                  </h5>
                  <div id='recruitmentPieChart'/>
                </div>
              </div>
              <div className='col-lg-8 col-md-8 col-sm-8'>
                <div>
                  <h5 className='chart-title'>
                    Biological sex breakdown by site
                  </h5>
                  <div id='recruitmentBarChart'/>
                </div>
              </div>
            </div>
          );
        } else {
          panel.siteBreakdown.content = (
            <div>
              <p>There have been no candidates registered yet.</p>
            </div>
          );
        }
        panel.siteBreakdown.div = (
          <div className='recruitment-panel hidden'
               id='recruitment-site-breakdown'>
            {panel.siteBreakdown.content}
          </div>
        );
        if (this.props.data.useProjects === 'true') {
          for (const key in this.props.data.progress) {
            if (this.props.data.progress.hasOwnProperty(key)) {
              panel[key] = {
                title: null,
                  content: null,
                  div: null,
              };
              if (key !== 'overall') {
                panel[key] = this.progressBarBuilder(panel[key]);
                panel[key].div = (
                  <div className='recruitment-panel' id='overall-recruitment'>
                    {panel[key].title}
                    {panel[key].content}
                  </div>
                );
                panel.siteBreakdown.content.push(panel[key].div);
              }
            }
          }
          panel.useProjects.div = (
            <div className='recruitment-panel hidden'
                 id='recruitment-project-breakdown'>
              {panel.siteBreakdown.content}
            </div>
          );
        }
      }
      return (
        <Panel
          title={'Recruitment'}
          id={'recruitmentPanel'}
          class={'panel panel-default'}
          menu={
            [
              {
                dataTarget: 'overall-recruitment',
                text: 'View overall recruitment',
              },
              {
                dataTarget: 'recruitment-site-breakdown',
                text: 'View site breakdown',
              },
            ]
          }
        >
          {panel.overall.div}
          {panel.siteBreakdown.div}
          {panel.useProjects.div}
        </Panel>
      );
    } else {
      return null;
    }
  }
}
Recruitment.defaultProps = {
  display: false,
  data: null,
};

Recruitment.propTypes = {
  display: PropTypes.bool,
  data: PropTypes.object,
};

export default Recruitment;
