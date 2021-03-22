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
    async function loadCandidate() {
        let response = await fetch(loris.BaseURL + '/api/v0.0.3/candidates/{$candidate->getCandID()}');
        let data = await response.json();
        candidate = data;
        return data;
    };

    async function loadVisits(candidate) {
        let visits = candidate.Visits.map(async function(visit) {
            // FIXME: This shouldn't use the dev version. See #6058
            let response = await fetch(loris.BaseURL + '/api/v0.0.3/candidates/' + candidate.Meta.CandID + '/' + visit);
            let data = await response.json();
            return data;
        });
        return Promise.all(visits);
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

        cards.push({
            Title: '{$widget->getTitle()|escape:js}',
            Content: React.createElement(
                {$widget->getComponentName()},
                allprops
            )
            {if $widget->getWidth()},Width: {$widget->getWidth()}{/if}
            {if $widget->getOrder()},Order: {$widget->getOrder()}{/if}
            {if $widget->getHeight()},Height: {$widget->getHeight()}{/if}
        });
        {/section}

        return cards;
    }

    function displayCards(cards) {
        ReactDOM.render(
            React.createElement(
                lorisjs.CSSGrid.default,
                { Cards: cards }
            ),
            document.getElementById('candidatedashboard')
        );
    }

    loadCandidate().then(loadVisits).then(loadCards).then(displayCards);
});
</script>
