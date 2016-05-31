<script type="text/javascript" src="{$baseurl}/GetJS.php?Module=statistics&file=form_stats_enrollment.js"></script>
<div id="enrollment">
    <h2 class="statsH2">Enrollment Statistics{if $CurrentSite} for {$CurrentSite.Name}{/if}</h2>
    <div class="col-sm-2 col-xs-12 form-group">
        {html_options id="EnrollmentSite" options=$Sites name="EnrollmentSite" selected=$CurrentSite.ID class="form-control"}
    </div>
    <div class="col-sm-2 col-xs-12 form-group">
        {html_options id="EnrollmentProject" options=$Projects name="EnrollmentProject" selected=$CurrentProject.ID class="form-control"}
    </div>
    <div class="col-sm-3 col-xs-12 form-group">
        <button onClick="updateEnrollmentTab()" class="btn btn-primary btn-small col-xs-12">Submit Query</button>
    </div>
    <br><br>
    <div class="row">
        <div class="table-reponsive">
            <table class="table table-primary table-bordered">
                <thead>
                <tr class="info">
                    <th>Ethnic Category</th>
                    <th>Females</th>
                    <th>Males</th>
                    <th>Sex / Gender unknown or not reported</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {foreach from=$enrollment_completion.enroll_data item=enroll}
                    <tr>
                        <td>{$enroll.ethnic_cat}</td>
                        <td>{$enroll.female_count}</td>
                        <td>{$enroll.male_count}</td>
                        <td>{$enroll.unknown_count}</td>
                        <td>{$enroll.total_count}</td>
                    </tr>
                {/foreach}
                {section name=item loop=$enrollment_completion.enroll_data_total}
                    <tr>
                        <td><strong>{$enrollment_completion.enroll_data_total[item].total_name}</strong></td>
                        <td>{$enrollment_completion.enroll_data_total[item].total_female}</td>
                        <td>{$enrollment_completion.enroll_data_total[item].total_male}</td>
                        <td>{$enrollment_completion.enroll_data_total[item].total_unknown}</td>
                        <td>{$enrollment_completion.enroll_data_total[item].total_total}</td>
                    </tr>
                {/section}

                </tbody>
            </table>
        </div>
        <div class="table-reponsive">
            <table class="table table-primary table-bordered">
                <thead>
                <tr class="info">
                    <th>Racial Categories</th>
                    <th>Females</th>
                    <th>Males</th>
                    <th>Sex / Gender unknown or not reported</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {foreach from=$enrollment_completion.enroll_data_race item=enroll}
                    <tr>
                        <td>{$enroll.race_cat}</td>
                        <td>{$enroll.female_count}</td>
                        <td>{$enroll.male_count}</td>
                        <td>{$enroll.unknown_count}</td>
                        <td>{$enroll.total_count}</td>
                    </tr>
                {/foreach}
                {section name=item loop=$enrollment_completion.enroll_data_racetotal}
                    <tr>
                        <td><strong>{$enrollment_completion.enroll_data_racetotal[item].total_name}</strong></td>
                        <td>{$enrollment_completion.enroll_data_racetotal[item].total_female}</td>
                        <td>{$enrollment_completion.enroll_data_racetotal[item].total_male}</td>
                        <td>{$enrollment_completion.enroll_data_racetotal[item].total_unknown}</td>
                        <td>{$enrollment_completion.enroll_data_racetotal[item].total_total}</td>
                    </tr>
                {/section}
                </tbody>
            </table>
        </div>
        <div class="table-reponsive">
            <table class="table table-primary table-bordered">
                <thead>
                <tr class="info">
                    <th>Racial Categories (Hispanic or Latinos)</th>
                    <th>Females</th>
                    <th>Males</th>
                    <th>Sex / Gender unknown or not reported</th>
                    <th>Total</th>
                </tr>
                </thead>
                <tbody>
                {foreach from=$enrollment_completion.enroll_data_hispanic item=enroll}
                    <tr>
                        <td>{$enroll.race_cat}</td>
                        <td>{$enroll.female_count}</td>
                        <td>{$enroll.male_count}</td>
                        <td>{$enroll.unknown_count}</td>
                        <td>{$enroll.total_count}</td>
                    </tr>
                {/foreach}
                {section name=item loop=$enrollment_completion.enroll_data_hispanictotal}
                    <tr>
                        <td><strong>{$enrollment_completion.enroll_data_hispanictotal[item].total_name}</strong></td>
                        <td>{$enrollment_completion.enroll_data_hispanictotal[item].total_female}</td>
                        <td>{$enrollment_completion.enroll_data_hispanictotal[item].total_male}</td>
                        <td>{$enrollment_completion.enroll_data_hispanictotal[item].total_unknown}</td>
                        <td>{$enrollment_completion.enroll_data_hispanictotal[item].total_total}</td>
                    </tr>
                {/section}
                </tbody>
            </table>
        </div>
    </div>
</div>

