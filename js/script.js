


$(document).ready(function(){
    // var adjustSidebar = function(){
    //     $(".sidebar").slimScroll({
    //         height: document.documentElement.clientHeight - $(".navbar").outerHeight()
    //     })(jQuery);
    // };
    // adjustSidebar();

    // $(window).resize(function(){
    //     adjustSidebar();
    // })
    $(".sideMenuToggler").on("click", function(){
        $(".wrapper").toggleClass("active");

    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
      }
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imageUpload").change(function () {
    readURL(this);
  }); 

  $('#file-upload').change(function() {
    var filepath = this.value;
    var m = filepath.match(/([^\/\\]+)$/);
    var filename = m[1];
    $('#filename').html(filename);

});