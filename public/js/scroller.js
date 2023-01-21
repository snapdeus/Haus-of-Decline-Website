$(function () {

    $(document).scroll(function () {
        var $nav = $("#topkeep");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
        // var $drop = $("#navbarSupportedContent");
        // $drop.removeClass('show', $(this).scrollTop() > $nav.height());
    })
})

$(".navbar-toggler").click(function () {
    $(".navbar").addClass("activated");
});
