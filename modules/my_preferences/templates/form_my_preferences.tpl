<form method="post" name="my_preferences" id="my_preferences" autocomplete="off">
    <h3>Password Rules</h3>
      <ul>
        <li>The password must be at least 8 characters long.</li>
        <li>The password cannot be your username or email address.</li>
        <li>No special characters are required but your password must be sufficiently complex to be accepted.</li>
      </ul>
        <p>Please choose a unique password.</p>
        <p>We suggest using a password manager to generate one for you.</p>
    <h3>Edit My Information</h3>
    {foreach from=$form.errors item=error}
        <ul>
            <li class="error">{$error}</li>
        </ul>
    {/foreach}
    <div class="row">
        <div class="form-group">
            <label class="col-sm-12 col-sm-2">
                   {$form.UserID.label}
            </label>
            <div class="col-sm-10">
                {$form.UserID.html}
            </div>
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.First_name.label}
        </label>
        <div class="col-sm-10">
            {$form.First_name.html}
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.Last_name.label}
        </label>
        <div class="col-sm-10">
            {$form.Last_name.html}
        </div>
    </div><div class="row form-group">
        <label class="col-sm-2">
            {$form.Email.label}
        </label>
        <div class="col-sm-10">
            {$form.Email.html}
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.Password_hash.label}
        </label>
        <div class="col-sm-4">
            <input type="password" name="{$form.Password_hash.name}" />
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.__Confirm.label}
        </label>
        <div class="col-sm-4">
            <input type="password" name="{$form.__Confirm.name}" />
        </div>
    </div>
    <div class="row form-group">
        <label class="col-sm-2">
            {$form.language_preference.label}
        </label>
        <div class="col-sm-10">
            {$form.language_preference.html}
        </div>
    </div>
    <br><br>
    <h3>Notifications</h3>
    <table class="table table-instrument" >
        <thead>
            {foreach key=gkey item=gitem from=$form.notification_headers.elements}
                <th style="color: black">{$gitem.html}</th>
            {/foreach}
        </thead>
        <tbody>
            {foreach key=opkey item=op from=$notification_rows}
                <tr>
                    {foreach key=rkey item=ritem from=$form.{$op}.elements}
                        <td>{$ritem.html}</td>
                    {/foreach}
                </tr>
            {/foreach}
        </tbody>
    </table>
    {* Add any preferences registered from other modules *}
    <div id="module_preferences" style="display: flex">
    {section name=widget loop=$module_userpreference_widgets}
        {assign var="widget" value=$module_userpreference_widgets[widget]}
        <div id="widget_{$widget->componentname}">
            <h3>{$widget->title}</h3>
            {* Include the widget's javascript before trying to invoke it *}
            <script src="{$widget->jsurl}" type="text/javascript"></script>

            {* Create a react root to render it into *}
            <script>
                const el = document.createElement("div");
                ReactDOM.createRoot(el).render(
                    {$widget->componentname}({})
                );
                document.getElementById("widget_{$widget->componentname}").appendChild(el);
            </script>
        </div>
    {/section}
    </div>
    <div class="row form-group">
        <div class="col-sm-2">
            <input class="btn btn-sm btn-primary col-xs-12" name="fire_away" value="Save" type="submit" />
        </div>
        <div class="col-sm-2">
            <input class="btn btn-sm btn-primary col-xs-12" value="Reset" type="reset" />
        </div>
    </div>


{$form.hidden|default}
</form>
