<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8"/>
    <link rel="shortcut icon" href="{$baseurl}/images/mni_icon.ico" type="image/ico" />
    <title>{$study_title}</title>
    <link type="text/css" href="{$baseurl}/bootstrap/css/bootstrap.min.css" rel="Stylesheet" />
    <link type="text/css" href="{$baseurl}/css/direct-entry.css" rel="Stylesheet" />
    <script type="text/javascript" src="{$baseurl}/js/react/react-with-addons.js"></script>
    <script type="text/javascript" src="{$baseurl}/js/react/react-dom.js"></script>
    <script type="text/javascript" src="{$baseurl}/js/modules/direct-entry-react.compiled.js"></script>
</head>

<body>
    <div data-json="{$json}" data-initial="{$initialData}" data-inst_lang="{$lang}" data-context="{$context}" id="instrument"></div>
    <div id="container"></div>
</body>
</html>
