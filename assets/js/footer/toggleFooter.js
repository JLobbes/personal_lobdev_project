    // Toggle footer
    document.getElementById('toggleFooterButton').addEventListener('click', function(event) {
        event.stopPropagation(); // Stop the click event from bubbling up to the window

        const toggleFooterButton = document.getElementById('toggleFooterButton');
        toggleFooterButton.classList.toggle('active');

        const footer = document.getElementsByTagName('footer')[0];
        footer.classList.toggle('show');
        
        const footerContent = document.getElementById('footerContent');
        footerContent.classList.toggle('active'); 

        // Close dropdown when clicking anywhere but dropDown icon
        window.addEventListener('click', function() {
            footer.classList.remove('show');
            footerContent.classList.remove('active');
            toggleFooterButton.classList.remove('active');
        }, { once: true });
    });
