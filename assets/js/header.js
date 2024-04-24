// Toggle nav dropdown
document.getElementById('navDropDownIcon').addEventListener('click', function(event) {
    event.stopPropagation(); // Stop the click event from bubbling up to the window

    const dropDown = document.getElementById('navDropDown');
    dropDown.classList.toggle('show');

    const dropDownIcon = document.getElementById('navDropDownIcon');
    dropDownIcon.classList.toggle('active');

    // Close dropdown when clicking anywhere but dropDown icon
    window.addEventListener('click', function() {
        dropDown.classList.remove('show');
        dropDownIcon.classList.remove('active');
    }, { once: true });
});
