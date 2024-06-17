// Handling hover and click for each icon individually
const footerIcons = document.querySelectorAll('.footer-icon');
footerIcons.forEach(function(icon) {
    icon.addEventListener('mouseenter', function(event) {
        event.currentTarget.classList.add('active');
    });
    icon.addEventListener('mouseleave', function(event) {
        event.currentTarget.classList.remove('active');
    });
    icon.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the footer from toggling visibility
        footerIcons.forEach(function(el) {
            if (el !== event.currentTarget) {
                el.classList.remove('active'); // Remove active from other icons
            }
        });
        event.currentTarget.classList.toggle('active');
    });
});
