{*
  This layout is used for all the 'public' modules
  (i.e Loris modules or pages that don't require user to be logged in)
*}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>{$study_title}</title>
  <link rel="stylesheet" href="{$baseurl}/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="{$baseurl}/css/public_layout.css">
  <link type="image/x-icon" rel="icon" href="{$baseurl}/images/favicon.ico">
  <script>
  const loris = { user: { langpref: "{$language}" }};
  </script>
  {section name=jsfile loop=$jsfiles}
    <script src="{$jsfiles[jsfile]}" type="text/javascript"></script>
  {/section}

  {section name=cssfile loop=$cssfiles}
    <link rel="stylesheet" href="{$cssfiles[cssfile]}">
  {/section}
</head>
<body>
  <header class="header">
    <div class="header-container">
      <div class="flex-wrapper">
        <!-- Left Logo (conditionally a link) -->
        <div class="logo-wrapper logo-left{if !isset($logo_left)} d-none{/if}">
          {if isset($logo_left_link)}
            <a href="{$logo_left_link}">
              <img src="{$logo_left}" alt="Left Logo"/>
            </a>
          {else}
            <img src="{$logo_left}" alt="Left Logo"/>
          {/if}
        </div>
        <!-- Center Study Title -->
        <div class="study-title hidden-xs">
          {$study_title}
        </div>
        <!-- Right Logo (conditionally a link) -->
        <div class="logo-wrapper logo-right{if !isset($logo_right)} d-none{/if}">
          {if isset($logo_right_link)}
            <a href="{$logo_right_link}" target="_blank" rel="noopener noreferrer">
              <img src="{$logo_right}" alt="Right Logo"/>
            </a>
          {else}
            <img src="{$logo_right}" alt="Right Logo"/>
          {/if}
        </div>

      {if count($languages) > 1}
        <div style="padding: 2ex">
        <form method="get" >
          <div class="form-group">
            <select class="form-control" name="lang" onChange="this.form.submit()">
              {foreach from=$languages key=langcode item=lang}
                <option value={$langcode} {if $langcode==$language}selected="selected"{/if}>{$lang}</option>
              {/foreach}
            </select>
          </div>
        </form>
        </div>
      {/if}
      </div>
    </div>
  </header>

  <section class="main-content">
    {$workspace}
  </section>

  <footer class="footer">
    Powered by <a href="https://loris.ca/" target="_blank">LORIS</a>
    | GPL-3.0 &copy; {$currentyear} <br/>
    Developed at
    <a href="https://mcgill.ca/neuro/" target="_blank">
      The Neuro (Montreal Neurological Institute-Hospital)
    </a>
    by <a href="https://mcin.ca/" target="_blank">MCIN</a>
  </footer>
  <script src="{$baseurl}/js/modernizr/modernizr.min.js"/>
  <script>
    if (!Modernizr.webgl) {
      alert("Please download the latest version of Google Chrome of Mozilla Firefox in order to use Loris!");
    }
  </script>
</body>
</html>
