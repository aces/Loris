<div class="container">
    <div class="panel panel-default panel-center">
        <div class="panel-heading">
            <h3 class="panel-title">{$page_title}</h3>
        </div>
        <div class="panel-body">
                <form method="POST">
                    <p class="text-center">
                        Please enter your ParticipantID
                    </p>
                    <div class="form-group">
                        {$form.participantID.html}
                        {if $form.participantID.error}
                            <span id="helpBlock" class="help-block">
                   <b class="text-danger">{$form.participantID.error}</b>
                 </span>
                        {/if}
                    </div>
                    <p class="text-center">
                        Please enter your Email
                    </p>
                    <div class="form-group">
                        {$form.email.html}
                        {if $form.email.error}
                            <span id="helpBlock" class="help-block">
                   <b class="text-danger">{$form.email.error}</b>
                 </span>
                        {/if}
                    </div>
                    <div class="form-group">
                        <input type="submit" name="submit" class="btn btn-primary btn-block"
                               value="Go To Participant Portal"/>
                    </div>
                </form>
        </div>
    </div>
</div>

