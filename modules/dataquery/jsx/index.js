$(function() {
  var reactTestEl = document.getElementById("reactTest");
  var categoriesObj = JSON.parse(reactTestEl.dataset.categories);
  var categoriesArray = [];
  Object.keys(categoriesObj).forEach(function(key) {
    categoriesArray.push({
      category: key,
      numFields: categoriesObj[key]
    });
  });

  var sessions = JSON.parse(reactTestEl.dataset.sessions);
  var updatedTime = reactTestEl.dataset.updatedTime;
  var userQueries = JSON.parse(reactTestEl.dataset.userQueries);
  var sharedQueries = JSON.parse(reactTestEl.dataset.sharedQueries);
  var visits = JSON.parse(reactTestEl.dataset.visits);

  var queryApp = <DataQueryApp
    title="Fields"
    categories={categoriesArray}
    UpdatedTime={updatedTime}
    SavedQueries={{
      "User" : userQueries,
      "Shared" : sharedQueries
    }}
    AllSessions={sessions}
    Visits={visits}
  />;

  ReactDOM.render(queryApp, document.getElementById("reactTest"));
});
