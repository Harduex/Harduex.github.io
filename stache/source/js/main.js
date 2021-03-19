function triggerAnimationOnScroll(section, target, classToAttach) {
    $(window).on('scroll', function (e) {
        var top = $(window).scrollTop() + $(window).height();
        var isVisible = top > $(section).offset().top;

        $(target).toggleClass(classToAttach, isVisible);
    });
}
