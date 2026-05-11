<script>
function getMatchCount(QueryID, domEl) {
    fetch(
      loris.BaseURL + '/dataquery/queries/'
        + QueryID + '/count',
      {
         method: 'GET',
         credentials: 'same-origin',
      }).then((resp) => {
          console.log(resp);
         if (!resp.ok) {
           throw new Error('Could not get count.');
         }
         return resp.json();
      }).then((result) => {
          domEl.textContent = result.count;
      });
}
</script>
<div class="list-group">
    {foreach from=$queries item=query}
        <a href="{$baseURL}/dataquery/?queryID={$query->queryID}" class="list-group-item">
            {$query->name}
            <span class="pull-right text-muted small">{dgettext("dataquery", "Candidate matches:")}
                <span id="studyquerymatch_{$query->queryID}"></span>
            </span>
            <script>
            window.addEventListener('load', function() {
                getMatchCount(
                    {$query->queryID},
                    document.getElementById("studyquerymatch_{$query->queryID}")
                );
            });
            </script>
        </a>
    {/foreach}
</div>
<div style="padding-bottom: 1em; font-style: italic">
{dgettext("dataquery", "Note: matches count only includes candidates that you have access to. Results may vary from other users due to permissions.")}
</div>
