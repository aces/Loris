
/**
 * Created by evanmcilroy on 15-06-09.
 */
$(document).ready(function() {
  var candID = $('meta[itemprop="candID"]').attr("context");
  var sessionID = $('meta[itemprop="sessionID"]').attr("context");
  var commentID = $('meta[itemprop="commentID"]').attr("context");

  $('.navbar-toggle').on('click',function(event){
      $("#bvl_feedback_menu").toggleClass("active_panel");
      $("#bvl_panel_wrapper").toggleClass("bvl_panel");

	  //We check if a sidebar exists on the page and toggle it if such.
	  if ($("#page_wrapper_sidebar").length){
	      $("#sidebar-wrapper").toggle("#sidebar-wrapper hide_sidebar");
	      $("#page_wrapper_sidebar").toggleClass("wrapper");
	  }
    $('.dynamictable').DynamicTable();
  });
}); // end of document


