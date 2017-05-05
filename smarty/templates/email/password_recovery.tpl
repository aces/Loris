Subject: [LORIS Password Notification]
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- saved from url=(0073)http://zurb.com/playground/projects/responsive-email-templates/basic.html -->
<html xmlns="http://www.w3.org/1999/xhtml">
<body bgcolor="#FFFFFF">

<table width="75%" align="center" cellspacing="0">
    <tbody>
    <tr bgcolor="#053665">
        <td><img src="{$baseurl}/images/LORIS_logo_white.svg" height="25%"></td>
        <td align="center" width="70%">
            <h3 style="color:white;">{$study}</h3>
        </td>
        <td align="right"><img src="{$baseurl}/images/study_logo.png" height="25%"></td>
    </tr>
    <tr>
        <td></td>
        <td bgcolor="#FFFFFF" style="padding:2%">
            <div>
                <h3>Hi {$realname},</h3>
                <p>You have recently request to reset the password on your Loris account. Please click the button below to proceed with changes.</p>

                <div style="-moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;padding:0;" align="center">
                    <a href= "{$url}" class="button_link" target="_blank" style = "padding: 10px;width:150px;display: block;text-decoration: none;border:0;text-align: center;font-weight: bold;font-size: 15px;font-family: sans-serif;color: #ffffff;background: #1fbbef;-moz-border-radius: 4px; -webkit-border-radius: 4px; border-radius: 4px;line-height:17px;">
                        Reset Password
                    </a>
                </div>

                <p>This link will only be valid for 24 hours. If you have not made this request, please ignore this email or reply to notify the site administrator.</p>
                <p>Thank you,<br>
                    Loris Team</p>
            </div>
        </td>
        <td></td>
    </tr>
    <tr bgcolor="#ECF8FF">
        <td></td>
        <td>
            <p>This is an automated message sent by the Loris system.</p>
        </td>
        <td></td>
    </tr>
    </tbody>
</table>
</body>
</html>