$(function() {
  var incompleteEl = document.getElementById("incomplete");
  var conflictsEl = document.getElementById("conflicts");
  var feedbackEl = document.getElementById("feedback");
  var graphicsEl = document.getElementById("graphics");

  var CandiPanel = <IncompleteCandidates
    title="Incomplete Forms"
    header={["Visit", "DCCID", "Instrument"]}
    incomplete_candidates={JSON.parse(incompleteEl.dataset.incomplete)}
    BaseURL={loris.BaseURL}
  />;

  var ConflictsPanel = <InstrumentConflicts
    title="Data Entry Conflicts"
    header={["Visit", "DCCID", "Instrument", "Field Name"]}
    conflicts={JSON.parse(conflictsEl.dataset.conflicts)}
    BaseURL={loris.BaseURL}
  />;

  var FeedbackTab = <BehaviouralFeedbackTab
    title="Behvarioural Feedback"
    header={["DCCID", "Feedback Level", "Field Name"]}
    feedback={JSON.parse(feedbackEl.dataset.feedback)}
    BaseURL={loris.BaseURL}
  />;

  var percentCompleted = graphicsEl.dataset.percentCompleted;
  var pscid = graphicsEl.dataset.pscid;
  var visit = graphicsEl.dataset.visit;
  var instrument = graphicsEl.dataset.instrument;

  var DataTeamGraphics = <GraphicsPanel
    percentCompleted={percentCompleted}
    pscid={pscid}
    visit={visit}
    instrument={instrument}
  />;

  ReactDOM.render(CandiPanel, incompleteEl);

  ReactDOM.render(ConflictsPanel, conflictsEl);

  ReactDOM.render(FeedbackTab, feedbackEl);

  ReactDOM.render(DataTeamGraphics, graphicsEl);

});
