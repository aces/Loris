$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

function swalFunction(event) {
  swal({
    title: 'Please confirm deletion',
    text: 'The instrument data will be deleted',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete the data'
  }, function(result) {
    if(result) {
      // swal does not work here. The window instantly disappears
      alert("\t\t\t Deleted! (You will need to reload the page again)");
      document.getElementById('ConfirmDelete').submit();
    }
  });
}
