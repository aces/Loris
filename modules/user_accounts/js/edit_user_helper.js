function toggleGroup(group) {
    if(group) {
        // id is the header that was clicked
        id = group.target.id;

        // chop off header_ to get section name
        section = id.substring(7);

        // hide (or show) the appropriate div for that section
        section_el = $("#perms_" + section);
        section_el.toggle();
    }
}

$(document).ready(function() {
    passwordVisibility();

    $('[name="NA_UserID"]').change(function() {
        $('.userid-star').toggleClass('hide', this.checked);
        $('[name="UserID"]').prop('disabled', this.checked).val('');
    }).change();

    $('[name="NA_Password"]').change(function() {
        $('.pwd-star').toggleClass('hide', this.checked);
        $('[name="SendEmail"]').prop('checked', this.checked);
        $('[name="Password_hash"], [name="__Confirm"]').prop('disabled', this.checked).val('');
    }).change();

    $('[name="Password_hash"], [name="__Confirm"]').change(function() {
        $('.pwd-star.password').toggleClass('hide',
            !($('.pwd-star.password').hasClass('required')
                || ($('[name="__Confirm"]').val().length !== 0
                    && $('[name="Password_hash"]').val().length === 0))
            );

        $('.pwd-star.confirm-password').toggleClass('hide',
            !($('.pwd-star.confirm-password').hasClass('required')
                || ($('[name="Password_hash"]').val().length !== 0
                    && $('[name="__Confirm"]').val().length === 0))
            );
    }).change();

    // define event handler for all the header sections
    $(".perm_header").click(toggleGroup);
    // Get rid of the extra <br /> tag that Quickform element adds at the top of each <div>
    $(".perm_header").each(function(idx, el) {
        id = el.id;
        section = id.substring(7);
        section_el = $("#perms_" + section + " br:nth-child(1)").hide();
    });
});