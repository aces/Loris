function swalFunction(event) {
  swal({
    title: 'Please confirm deletion',
    text: 'The instrument data will be deleted',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete the data',
  }, function(result) {
    if (result) {
      document.getElementById('ConfirmDelete').submit();
    }
  });
}

document.getElementById('ConfirmDelete').onclick = swalFunction;
