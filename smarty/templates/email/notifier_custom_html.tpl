<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!-- saved from url=(0073)http://zurb.com/playground/projects/responsive-email-templates/basic.html -->
<html xmlns="http://www.w3.org/1999/xhtml">
<body bgcolor="#FFFFFF">

<table width="75%" align="center" bgcolor="#053665">
    <tbody><tr>
        <td></td>
        <td>
            <div>
                <table width="100%" bgcolor="#053665">
                    <tbody><tr>
                        <td></td>
                        <td >
                            <h3 style="color:white;">{$study_name}</h3>
                        </td>
                        <td align="right"><img src="{$baseurl}/images/LORIS_logo.png" height="25%"></td>
                        <td></td>
                    </tr>
                    </tbody></table>
            </div>
        </td>
        <td></td>
    </tr>
    </tbody>
</table>
<table width="75%" align="center">
    <tbody>
    <tr>
        <td></td>
        <td bgcolor="#FFFFFF">
            <div>
                <table>
                    <tbody>
                    <tr>
                        <td>
                            <h3>Hi, {$notified_user}</h3>
                            <p>{$custom_message}</p>
                            <p>Thank you,<br>
                                Loris Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#ECF8FF">
                            <p>This is an automated message sent by the Loris system. To configure your notification settings,
                                follow <a href="{$baseurl}/user_accounts/my_preferences/">this link to your preference page</a>.</p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </td>
        <td></td>
    </tr>
    </tbody>
</table>
</body>
</html>