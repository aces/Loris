<div id="candidatedashboard"></div>
{* First load all the javascript URLs for the widgets so that component
   names are resolvable *}
{section name=widget loop=$widgets}
    <script src="{$widgets[widget]->getJSURL()}" type="text/javascript"></script>
{/section}
<script type="text/javascript">
{* On page load, retrieve the candidate and all of its visits via the API so that
   they can be passed as properties to widgets. Nearly every widget uses them, so
   this saves them all having to make the same requests over and over again. *}
window.addEventListener('load', () => {
    let candidate = null;

    function fetchProfileData(url) {
        return fetch(loris.BaseURL + '/api/v0.0.3/' + url, {
            cache: 'no-cache',
            credentials: 'same-origin',
        });
    }

    async function loadCandidate() {
        let response = await fetchProfileData(
            'candidates/{$candidate->getCandID()}'
        );
        if (!response.ok) {
            return new Error('Failed to load candidate (' + response.status + ')');
        } else {
            let data = await response.json();
            return data;
        }
    };

    async function loadVisits(candidate) {
        let visits = candidate.Visits.map(async function(visit) {
            let response = await fetchProfileData(
                'candidates/' + candidate.Meta.CandID + '/' + visit
            );
            if (!response.ok) {
              return new Error('Failed to load visit (' + response.status + ')');
            } else {
              let data = await response.json();
              return data;
            }
        });
        return Promise.all(visits);
    }

    async function filterVisits(visits) {
      return visits.filter(function(v) {
        return !(v instanceof Error);
      });
    }

    async function loadCards(visits) {
        // Common properties that all cards get for free
        let baseprops = {
            BaseURL: loris.BaseURL,
            Candidate: candidate,
            Visits: visits,
            VisitMap: {$visitmap|json_encode},
        };

        let modprops, allprops;
        let cards = [];

        // Now render all the cards as React components to pass
        // to the grid.
        {section name=widget loop=$widgets}
        {assign var="widget" value=$widgets[widget]}

        modprops = {$widget->getComponentProps()|json_encode};
        allprops = { ...baseprops, ...modprops };

        try {
		cards.push({
		    Title: '{$widget->getTitle()|escape:js}',
		    Content: React.createElement(
			{$widget->getComponentName()},
			allprops
		    ),
		    collapsing: false
		    {if $widget->getWidth()},Width: {$widget->getWidth()}{/if}
		    {if $widget->getOrder()},Order: {$widget->getOrder()}{/if}
		    {if $widget->getHeight()},Height: {$widget->getHeight()}{/if}
		    {if $widget->getMaxHeight()},MaxHeight: "{$widget->getMaxHeight()}"{/if}
		});
        } catch(err) {
             console.error(err);
        }
        {/section}

        return cards;
    }

    function displayCards(cards) {
        ReactDOM.createRoot(
            document.getElementById('candidatedashboard')
        ).render(
            React.createElement(
                lorisjs.CSSGrid.default,
                { Cards: cards }
            )
        );
    }

    loadCandidate().then(loadVisits).then(filterVisits).then(loadCards).then(displayCards);
});
</script>