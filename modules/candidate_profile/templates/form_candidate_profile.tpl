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
    let candidate = undefined;
        async function loadCandidate() {
            let response = await fetch(loris.BaseURL + '/api/v0.0.2/candidates/{$candidate->getCandID()}');
            let data = await response.json();
            candidate = data;
            return data;
        };

        async function loadVisits(candidate) {
            visits = candidate.Visits.map(async function(visit) {
                // FIXME: This shouldn't use the dev version. See #6058
                let response = await fetch(loris.BaseURL + '/api/v0.0.3-dev/candidates/' + candidate.Meta.CandID + '/' + visit);
                let data = await response.json();
                return data;
            });
            return Promise.all(visits);
        }

    async function loadCards(visits) {
        let baseprops = {
            BaseURL: loris.BaseURL,
            Candidate: candidate,
            Visits: visits,
            VisitMap: {$visitmap|json_encode},
        };

        let modprops, allprops;

        {* Now generate events to register the cards into the dashboard. *}
        {section name=widget loop=$widgets}
        {assign var="widget" value=$widgets[widget]}

        modprops = {$widget->getComponentProps()|json_encode};
        allprops = { ...baseprops, ...modprops };

        window.dispatchEvent(
            new CustomEvent('registercard', {
                detail: {
                title: '{$widget->getTitle()|escape:js}',
                content: React.createElement(
                    {$widget->getComponentName()},
                    allprops
                )
                {if $widget->getWidth()},width: {$widget->getWidth()}{/if}
                {if $widget->getOrder()},order: {$widget->getOrder()}{/if}
                {if $widget->getHeight()},height: {$widget->getHeight()}{/if}
                }
            })
        );
        {/section}

    }

    loadCandidate().then(loadVisits).then(loadCards);
});
</script>

{*
{section name=widget loop=$widgets}
{assign var="widget" value=$widgets[widget]}
<script>
window.addEventListener('dashboardloaded', () => {
    window.dispatchEvent(
    );
});
</script>

{/section}
*}
