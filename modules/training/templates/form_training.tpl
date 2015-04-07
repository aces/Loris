<div id="training-options">
    <div class="row hidden-xs">
        {if isset($certifications['content'])}
        <div class="col-sm-4">
            <h3>Online training completed</h3>
            <p>Select an instrument below to review the training content.</p>
        </div>
        <div class="col-sm-4 col-sm-offset-1">
            <h3>No online training</h3>
            <p>The following instruments do not have online training.</p>
        </div>
        {else}
        <div class="col-sm-3">
            <h3>Certifications to complete</h3>
            <p>Select an instrument below to receive certification.</p>
        </div>
        <div class="col-sm-3 col-sm-offset-1">
            <h3>Completed certifications</h3>
            <p>You can browse the training content for any of the instruments you have already been certified for.</p>
        </div>
        <div class="col-sm-3 col-sm-offset-1">
            <h3>No online training</h3>
            <p>These instruments do not have any online training. Certification can be granted by an administrator.</p>
        </div>
        {/if}
    </div>
    <hr class="hidden-xs">
    <div class="row">
        {if isset($certifications['content'])}
            <div class="col-sm-4">
                {foreach $certifications['content'] key=id item=name}
                    <div class="panel panel-certified clickable" id="instrument-{$id}" data-instrument="{$name}">
                        <div class="panel-body">
                            <strong>{$name}</strong>
                        </div>
                    </div>
                {foreachelse}
                    <p class="text-muted hidden-xs">There are no instruments with online training.</p>
                {/foreach}
            </div>
            <div class="col-sm-4 col-sm-offset-1">
                {foreach $certifications['no_content'] key=id item=name}
                    <div class="panel panel-no-content" id="instrument-{$id}" data-instrument="{$name}">
                        <div class="panel-body">
                            <strong>{$name}</strong>
                        </div>
                    </div>
                {foreachelse}
                    <p class="text-muted hidden-xs">All instruments have online training.</p>
                {/foreach}
            </div>
        {else}
        <div class="col-sm-3">
            {foreach $certifications['not_certified'] key=id item=name}
                <div class="panel panel-not-certified clickable" id="instrument-{$id}" data-instrument="{$name}">
                    <div class="panel-body">
                        <strong>{$name}</strong>
                    </div>
                </div>
            {foreachelse}
                <p class="text-muted hidden-xs">You have completed all existing training modules.</p>
            {/foreach}
        </div>
        <div class="col-sm-3 col-sm-offset-1">
            {foreach $certifications['certified'] key=id item=name}
                <div class="panel panel-certified clickable" id="instrument-{$id}" data-instrument="{$name}">
                    <div class="panel-body">
                        <strong>{$name}</strong>
                    </div>
                </div>
            {foreachelse}
                <p class="text-muted hidden-xs">You have not completed any training modules yet.</p>
            {/foreach}
        </div>
        <div class="col-sm-3 col-sm-offset-1">
            {foreach $certifications['no_content'] key=id item=name}
                <div class="panel panel-no-content" id="instrument-{$id}" data-instrument="{$name}">
                    <div class="panel-body">
                        <strong>{$name}</strong>
                    </div>
                </div>
            {foreachelse}
                <p class="text-muted hidden-xs">All instruments have online training.</p>
            {/foreach}
        </div>
        {/if}
    </div>
</div>

<div id="tabs">
</div>

<div class="modal fade" id="correct">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <p>You are now certified.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick="window.location.href='main.php?test_name=training'">Return to training center</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="incorrect">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <p>Your answers were not correct. You can repeat the training and try again to get certified.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" onclick="window.location.href='main.php?test_name=training'">Return to training center</button>
                <button type="button" class="btn btn-primary" onclick="tryAgain()">Try again</button>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="incomplete">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-body">
                <p>Please answer every question.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>