// TODO: Fix bars between links
class WelcomePanel extends React.Component {
  render() {
    let linkJSX = "";
    if (this.props.links) {
      let links = this.props.links.map(function(link) {
        return (
          <a href={link.url} target={link.windowName} key={link.url}>
            {link.label}
          </a>
        );
      });

      linkJSX = <div className="panel-footer">{links}</div>;
    }

    return (
      <div className="panel panel-default">
        <div className="panel-body">
          <h3 className="welcome">Welcome, {this.props.username}</h3>
          <p className="pull-right small login-time">Last login: {this.props.lastlogin}</p>
          <p className="project-description" dangerouslySetInnerHTML={{__html: this.props.description}} />
        </div>
        {linkJSX}
      </div>
    );
  }
}

class ProgressBar extends React.Component {
  render() {
    let progressBar = <p>Please add a recruitment target for {this.props.data.title}.</p>;
    if (this.props.data.recruitment_target) {

      let femaleStyle = {
        width: this.props.data.female_percent + '%'
      };
      let maleStyle = {
        width: this.props.data.male_percent + '%'
      };

      let progressBarRec = (
        <div className="progress">
          <div className="progress-bar progress-bar-female" role="progressbar" style={femaleStyle} data-toggle="tooltip" data-placement="bottom" title={this.props.data.female_percent + '%'}>
              <p>
                {this.props.data.female_total}
                <br />
                Females
              </p>
          </div>
          <div className="progress-bar progress-bar-male" data-toggle="tooltip" data-placement="bottom" role="progressbar" style={maleStyle}  title={this.props.data.male_percent + '%'}>
              <p>
                {this.props.data.male_total}
                <br />
                Males
              </p>
          </div>
          <p className="pull-right small target">Target: {this.props.data.recruitment_target}</p>
        </div>
      );

      progressBar = (
        <div>
          <h5>{this.props.data.title}</h5>
          {this.props.data.surpassed_recruitment &&
          <p>The recruitment target ({this.props.data.recruitment_target}) has been passed.</p>
          }
          {progressBarRec}
        </div>
      );
    }
    return (
      progressBar
    );
  }
}

class RecruitmentPanel extends React.Component {
  render() {
    if (!this.props.recruitment) {
      return null;
    }
    let recruitmentCharts = <p>There have been no candidates registered yet.</p>;
    if (this.props.recruitment.overall.total_recruitment > 0) {
      recruitmentCharts = (
        <div>
          <div className="col-lg-4 col-md-4 col-sm-4">
            <div>
              <h5 className="chart-title">Total recruitment per site</h5>
              <div id="recruitmentPieChart"></div>
            </div>
          </div>
          <div className="col-lg-8 col-md-8 col-sm-8">
            <div>
              <h5 className="chart-title">Gender breakdown by site</h5>
              <div id="recruitmentBarChart"></div>
            </div>
          </div>
        </div>
      );
    }

    let projectProgress = "";
    // TODO: get rid of overall project
    if (this.props.useProject == true) {
      projectProgress = this.props.recruitment.map(function(project) {
        return (
          <ProgressBar data={project} />
        );
      });
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Recruitment</h3>
          <span className="pull-right clickable glyphicon glyphicon-chevron-up"></span>
          <div className="pull-right">
            <div className="btn-group views">
              <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                Views
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu pull-right" role="menu">
                <li className="active">
                  <a data-target="overall-recruitment">View overall recruitment</a>
                </li>
                <li>
                  <a data-target="recruitment-site-breakdown">View site breakdown</a>
                </li>
                {this.props.useProject == true &&
                <li>
                  <a data-target="recruitment-project-breakdown">View project breakdown</a>
                </li>
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <div className="recruitment-panel" id="overall-recruitment">
            <ProgressBar data={this.props.recruitment.overall} />
          </div>
          <div className="recruitment-panel hidden" id="recruitment-site-breakdown">
            {recruitmentCharts}
          </div>
          {this.props.useProject == true &&
          <div className="recruitment-panel hidden" id="recruitment-project-breakdown">
            {projectProgress}
          </div>
          }
        </div>
      </div>
    );
  }
}

class StudyProgressionPanel extends React.Component {
  render() {
    if (!this.props.recruitment) {
      return null;
    }
    let scanChart = <p>There have been no scans yet.</p>;
    if (this.props.totalScans > 0) {
      scanChart = <div id="scanChart"></div>;
    }

    let recruitmentChart = <p>There have been no candidates registered yet.</p>;
    if (this.props.recruitment.overall.total_recruitment > 0) {
      recruitmentChart = <div id="recruitmentChart"></div>;
    }

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Study Progression</h3>
          <span className="pull-right clickable glyphicon glyphicon-chevron-up"></span>
          <div className="pull-right">
            <div className="btn-group views">
              <button type="button" className="btn btn-default btn-xs dropdown-toggle" data-toggle="dropdown">
                Views
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu pull-right" role="menu">
                <li className="active"><a data-target="scans-line-chart-panel">View scans per site</a></li>
                <li><a data-target="recruitment-line-chart-panel">View recruitment per site</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="panel-body">
          <div id="scans-line-chart-panel">
            <h5 className="chart-title">Scan sessions per site</h5>
            {scanChart}
          </div>
          <div id="recruitment-line-chart-panel" className="hidden">
            <h5 className="chart-title">Recruitment per site</h5>
            {recruitmentChart}
          </div>
        </div>
      </div>
    );
  }
}

class Task extends React.Component {
  render() {
      let href = this.props.URL;
      let click = () => {};

      if (this.props.label.indexOf("Incomplete form") > -1 &&
        !loris.userHasPermission('access_all_profiles')) {
        let links = [];
        for (let siteName in href) {
          let URL = href[siteName];
          links.push(
            <a href={URL}>
              <p style={{color:'#555'}} className="small task-site">{siteName}
                <span className="glyphicon glyphicon-chevron-right small" />
              </p>
            </a>
          );
        }

        return (
          <div className="list-group-item">
            <div className="row">
              <div className="col-xs-8 test-left">
                <div className="huge">{this.props.count}</div>
                {this.props.label}
              </div>
              <div className="col-xs-4 text-right alert-chevron">
                {links}
              </div>
            </div>
          </div>
        );
      }

      if (this.props.URL === loris.BaseURL + "/user_accounts/") {
        click = filterAccountsPendingApproval;
        href="#";
      }
      return (
          <a href={href} onClick={click} className="list-group-item">
            <div className="row">
              <div className="col-xs-8 text-left">
                <div className="huge">{this.props.count}</div>
                  {this.props.label}
              </div>
              <div className="col-xs-4 text-right alert-chevron">
                <span className="glyphicon glyphicon-chevron-right medium"></span>
                <p className="small task-site">{this.props.site}</p>
              </div>
            </div>
          </a>
      );
  }
}

class TasksPanel extends React.Component {
  render() {
    let tasks = this.props.tasks.map(function(task) {
      return (
        <Task
          URL={task.URL}
          key={task.label}
          count={task.count}
          label={task.label}
          site={task.site} />
      );
    });

    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">My Tasks</h3>
          <span className="pull-right clickable glyphicon glyphicon-chevron-up"></span>
        </div>
        <div className="panel-body">
          <div className="list-group tasks">
            {tasks}
          </div>
        </div>
      </div>
    );
  }
}

class DocRepoItem extends React.Component {
  render() {
    let href = loris.baseURL + "AjaxHelper.php?Module=document_repository&script=GetFile.php&File=" + this.props.dataDir;
    return (
      <a href={href} download={this.props.fileName} className="list-group-item">
        {this.props.new ===1 &&
        <span className="pull-left new-flag">
          NEW
        </span>
        }
        <span className="pull-right text-muted small">
          Uploaded: {this.props.dateUploaded}
        </span>
        <br />
        {this.props.fileName}
      </a>
    );
  }
}

class DocRepoPanel extends React.Component {
  render() {
    let DocRepoItems = this.props.notifications.map(function(notification) {
      return (
        <DocRepoItem
          dataDir={notification.dataDir}
          fileName={notification.fileName}
          new={notification.new}
          dateUploaded={notification.dateUploaded} />
      );
    });

    let docRepoURL = loris.baseURL + '/document_repository/';
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Document Repository Notifications</h3>
          <span className="pull-right clickable glyphicon glyphicon-chevron-up"></span>
        </div>
        <div className="panel-body">
          <div className="list-group bvl-feedback-item">
            {DocRepoItems}
          </div>
          <a href={docRepoURL} className="btn btn-default btn-block">
            Document Repository
            <span className="glyphicon glyphicon-chevron-right"></span>
          </a>
        </div>
      </div>
    );
  }
}

class BVLFeedbackItem extends React.Component {
  render() {
    let href = loris.BaseURL + this.props.URL;
    return (
      <a href={href} className="list-group-item">
        {this.props.new ===1 &&
        <span className="pull-left new-flag">
          NEW
        </span>
        }
        <span className="pull-right text-muted small">
          Updated: {this.props.testDate}
        </span>
        <br />
        {this.props.name}: {this.props.comment}
      </a>
    );
  }
}

class BVLFeedbackPanel extends React.Component {
  render() {
    let BVLFeedbackItems = this.props.notifications.map(function(notification, i) {
      return (
        <BVLFeedbackItem
          URL={notification.URL}
          key={i}
          new={notification.new}
          testDate={notification.testDate}
          name={notification.name}
          comment={notification.comment} />
      );
    });
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Behavioural Feedback Notifications</h3>
          <span className="pull-right clickable glyphicon glyphicon-chevron-up"></span>
        </div>
        <div className="panel-body">
          <div className="list-group bvl-feedback-item">
            {BVLFeedbackItems}
          </div>
        </div>
      </div>
    );
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      lastlogin: "",
      description: null,
      links: null,
      recruitment: null,
      useProject: false,
      totalScans: 0,
      tasks: null,
      docRepoNotifications: null,
      bvlFeedbackNotifications: null,
    };
  }

  componentDidMount() {
    $.get(loris.BaseURL + '/dashboard/ajax/getDashboardHomeData.php', function(data, status) {
      if (status === "success") {
        this.setState({
          username: data.username,
          lastlogin: data.lastlogin,
          description: data.description,
          links: data.links,
          recruitment: data.recruitment,
          useProject: data.useProject,
          totalScans: data.totalScans,
          tasks: data.tasks,
          docRepoNotifications: data.docRepoNotifications,
          bvlFeedbackNotifications: data.bvlFeedbackNotifications,
        });
        dashboardHomeLoad();
      }
    }.bind(this));
  }

  render() {
    return (
      <div id="dashboard" className="row">
        <div className="col-lg-8">
          <WelcomePanel
            username={this.state.username}
            lastlogin={this.state.lastlogin}
            description={this.state.description}
            links={this.state.links} />
          <RecruitmentPanel
            recruitment={this.state.recruitment}
            useProject={this.state.useProject} />
          <StudyProgressionPanel
            totalScans={this.state.totalScans}
            recruitment={this.state.recruitment} />
          <small><i>Note that the Recruitment and Study Progression charts include data from ineligible, excluded, and consent withdrawn candidates.</i></small>
        </div>
        <div className="col-lg-4">
          {this.state.tasks &&
          <div className="col-lg-12 col-md-6 col-sm-6 col-xs-12">
            <TasksPanel tasks={this.state.tasks} />
          </div>
          }
          {false &&
          <div className="col-lg-12 col-md-6 col-sm-6 col-xs-12">
            <DocRepoPanel notifications={this.state.docRepoNotifications} />
          </div>
          }
          {this.state.bvlFeedbackNotifications &&
          <div className="col-lg-12 col-md-6 col-sm-6 col-xs-12">
            <BVLFeedbackPanel notifications={this.state.bvlFeedbackNotifications} />
          </div>
          }
        </div>
      </div>
    );
  }
}

function filterAccountsPendingApproval(e) {
  loris.loadFilteredMenuClickHandler('user_accounts/', {
        pending: "Y"
  })(e);
}

export default Home;