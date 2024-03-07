<div class="list-group">
    {foreach from=$starredqueries item=query}
        <a href="{$baseURL}/dataquery/?queryID={$query->queryID}" class="list-group-item">
            <span class="fa-stack">
                <i style="color: yellow"
                   class="fas fa-star fa-stack-1x"
                ></i>
                <i style="color: black"
                   class="far fa-star fa-stack-1x"
                ></i>
            </span>
            {$query->name}
        </a>
    {/foreach}
</div>
