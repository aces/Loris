/*
    Makes sure that when a form is submitted and is invalid, the window is
    scrolled to the uppermost invalid element (so it is visible to the user).
 */

$(document).ready(function bindInvalidFormListeners() {
    // This will make sure that the flag indicating whether we scrolled
    // to an invalid element when the form is submitted is reset
  document.getElementsByName('fire_away')[0].addEventListener('click', function() {
    bindInvalidFormListeners.scrollingDone = false;
  });

    // Override default event handler for invalid input elements
    // This will make sure that the invalid element appears at the top
    // of the page.
  let elements = document.querySelectorAll('input,select,textarea');
  let navbarHeader = document.getElementsByClassName('navbar-header');
  for (let i = elements.length; i--;) {
    elements[i].addEventListener('invalid', function() {
            // Only make the uppermost invalid element visible when the
            // form is submitted
      if (!bindInvalidFormListeners.scrollingDone) {
        this.scrollIntoView(true);
                // scrollingIntoView is not enough: the navigation bar will appear
                // over the invalid element and hide it.
                // We have to scroll an additional number of pixels down so that
                // the elements becomes visible.
        if (navbarHeader) {
          window.scrollBy(0, -$(navbarHeader).height() - 10);
        }

                // Only scroll once
        bindInvalidFormListeners.scrollingDone = true;
      }
    });
  }
});
