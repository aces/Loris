import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Panel from 'PanelTabs';

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
          content: null,
          div: null,
        },
      };
      if (this.props.data) {
        console.log(this.props.data);
        if (this.props.data.progress.overall.recruitment_target) {
          panel.overall.title = <h5>{this.props.data.progress.overall.title}</h5>;
          if (this.props.data.progress.overall.surpassed_recruitment) {
            panel.overall.content = (
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
                       title={this.props.data.progress.overall.female_full_percent + '%'}
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
                       title={this.props.data.progress.overall.male_full_percent + '%'}
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
            panel.overall.content = (
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
          panel.overall.content = (
            <div>
              Please add a recruitment target for {this.props.data.progress.overall.title}.
            </div>
          );
        }
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
                  <div id='recruitmentPieChart'></div>
                </div>
              </div>
              <div className='col-lg-8 col-md-8 col-sm-8'>
                <div>
                  <h5 className='chart-title'>
                    Biological sex breakdown by site
                  </h5>
                  <div id='recruitmentBarChart'></div>
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
          // {foreach from=$recruitment key=ID item=project}
          // {if $ID != "overall"}
          // {include file='progress_bar.tpl' project=$project}
          // {/if}
          //   {/foreach}
          for (let i=0; i<this.props.data.progress)
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
