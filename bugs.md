As of 2024.04.10 -> showMessage() method should take an optional
                    time variable.

As of 2024.04.09 -> There is no service agreement for an account
                    sign-up, can use ITIL here. 

As of 2024.04.09 -> Need to add close database statements to 
                    the Database class.

As of 2024.04.09 -> When user visits contact-us page, it should
                    check:
                        (a) that they are signed in
                        (b) that they have a chatID with history 
                            to pull, should reflect in options

As of 2024.04.09 -> Signed webhooks isn't implemented which is a
                    known security hole. Messages may be tampered
                    while at sea.

As of 2024.04.09 -> Vonage uses a `punycode` module that is 
                    deprecated.

As of 2024.04.09 -> I still need authetication for displaying
                    the admin page data + link.

As of 2024.04.09 -> I forgot to include email validation for
                    the contact form.

As of 2024.04.06 -> The showMessage() and toggleLanguage()
                    functions are repeated all over and need
                    to be consolidated in the static JS.

As of 2024.04.06 -> The contact form requires a 
                    check if signed in function.

As of 2024.04.06 -> Some buttons on the admin page should
                    possibly be buttons, not submits.

As of 2024.04.06 -> Any forced diversion to the login page
                    should have an automatic redirect to the 
                    source page (i.e., contact us & booking)

As of 2024.04.06 -> On the contact us form, if the guest 
                    logs in, they should be able to select
                    which booking they are responding to.

As of 2024.04.06 -> Of course, the language toggle should
                    remain for the entire site.

As of 2024.04.05 -> Methods for validation should be static.

As of 2024.04.05 -> I need to review my class, in particular to 
                    ensure resources are closed and static methods 
                    are used judiciously.

As of 2024.04.05 -> The prepareBookingConfirmationPage() method
                    in the Booking controller uses the 
                    getBookingByStart() method to gather the booking.
                    This will produce errors once guests are 
                    incorporated.

As of 2024.04.05 -> Admin page would benefit from the following:
                        - Booking table fully visible on hover
                        - Booking table rows selectable
                        - Responsive collapse 
                        - Completing new booking feature
                        - Completing user manipuation 
                        - Dynamic reloading of parts

As of 2024.04.05 -> The delete booking logic is missing logic 
                    for when booking has guests. The admin needs
                    to be able to delete single partipant or delete
                    trip and all child participants.

As of 2024.04.04 -> The user credential placed in sessionStorage
                    should come from the userCredential object
                    and not the user object which appears during
                    the stateChange function.

As of 2024.03.29 -> Nothing on admin.handlebars updates
                    dynamically. Needs refactoring so calander
                    , table, and forms can update dynamically.

As of 2024.03.29 -> My checkIfAdmin function is in my model
                    which should just be a getRoleByID function,
                    not any business logic.

As of 2024.03.29 -> The globalSelectedDate is orignially set to
                    an empty string. If submitted without being
                    set, an error throws because there is no
                    .toISOString function.

                    solved with a hack, set to date outside 
                    of range

As of 2024.03.26 -> My checkIfAdmin fucntion is not housed in 
                    my Authorization controller. Should it be?

As of 2024.03.26 -> Still need to add email authentication and
                    Gmail account access

As of 2024.03.26 -> When user signs in, fields are not cleared.
                    Not redirecting.

As of 2024.03.25 -> User still cannot select package for booking.

As of 2024.03.24 -> Homescreen still has terrible breaks in 
                    main text.

As of 2024.03.24 -> I'm putting the Firebase Authentication 
                    in a partial. It's a client side script. Maybe
                    is should just be in a static JS file.

As of 2024.03.23 -> When scrolling through booking form, arrows
                    are misleading as first still shows left arrow
                    and last panel shows right arrow.

As of 2024.03.21 -> When anyone refreshes the booking_result page
                    their confirmation details to not persist and it
                    appears as a failed booking. 
                    Add to local storage? 

As of 2024.03.19 -> When user is forced to resubmit, the selected
                    day for climbing does not remain visually selected 
                    (the input) remains the same.

As of 2024.03.19 -> Site needs user prefrences option once complete.

As of 2024.03.19 -> Booking.handlebars needs Chinese translation

As of 2024.03.16 -> Clients must be able to book on the same 
                    day in case of separate payment.
                    If day is taken, admin can double book.

As of 2024.03.16 -> No booking controller exists. Needs to in 
                    order to pull together booking validation,
                    authentication, weather pull + booking calander information.

As of 2024.03.15 -> intialize_database.js does not use the database.js
                    db class. This requires some refactoring.

As of 2024.03.13 -> climblongdong.com is not a registered domain 
                    for my Firebase authentication. In case of 
                    deployment, it will need to be added. 

                    Same goes in reverse for localhost.

As of 2024.03.13 -> Register account button is not centered.

As of 2024.03.13 -> Register/Login account doesn't show relevant errors
                    to viewer.

As of 2024.03.13 -> Google sign-in link has no functionality.

As of 2024.03.13 -> Remember me checkbox has no functionality.

As of 2024.03.13 -> Forgot password link has no functionality.

As of 2024.03.12 -> As Firebase login logic is held in header.handlebars,
                    on pages that don't have the sign in, the form event
                    listener throws and error. I need to change this to a
                    function and call it in the HTML.

As of 2024.03.10 -> In packages.handlebars, when the overlay is opened,
                    if the mouse is on the border, the card will flutter.
                    Need to make border constent to remove flutter.

As of 2024.02.10 -> CSS for main background images is redundant
                    CSS for overlays is often redundant
                    CSS found in index.css can be minimized
                    Bootstrap can be removed from the site.

                    