// access the Express.js router module to create local router
const express = require('express');
const router = express.Router();

// import the bodyParser module to parse incoming requests
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// import controllers
const Authorize = require('../controllers/Authorize.js');
const Booking = require('../controllers/Booking.js');
const Validation = require('../controllers/Validation.js');
const Mailer = require('../controllers/Mailer.js');
const Messanger = require('../controllers/Messenger.js');

// define the routes desired using the router object, url is end url
router.get('/', (request, response) => {
    response.render('../views/index.handlebars');
});

router.get('/admin', async (request, response) => {
    
    const dataForAdminPage = { pageSpecificCSS: '../../assets/css/admin.css' };
    dataForAdminPage.baseData = await Booking.prepareAdminPageData();

    response.render('../views/admin.handlebars', dataForAdminPage);
});

router.get('/about', (request, response) => {
    response.render('../views/about.handlebars', { pageSpecificCSS: '../../assets/css/about.css' });
});


router.get('/booking', async (request, response) => {
    const packageID = request.query.packageID;

    try {
        const dataForBookingPage = await Booking.prepareBookingPageBase(packageID);
        response.render('../views/booking.handlebars', dataForBookingPage);
    } catch (error) {
        response.status(500).send('We\'re sorry! We had a problem fetching this page for you.');
    }
});

router.post('/booking-submit', async (request, response) => {
    const formData = request.   body;
    
    const validation = new Validation();
    let { sanitized: sanitizedFormData, errors } = await validation.validateBookingSubmissionAll(formData);

    if (Object.keys(errors).length > 0) {
        const dataForBookingPage = await Booking.prepareBookingPageBase(sanitizedFormData.booking_package);
        dataForBookingPage.errors = errors; 
        dataForBookingPage.sanitizedFormData = sanitizedFormData;
        response.render('../views/booking.handlebars', dataForBookingPage);
    } else {
        try {
            // Only after validation is complete, ensure user is signed-in 
            const verifiedUserEmail = await Authorize.verifyIdToken(sanitizedFormData.tokenID);
            if(!verifiedUserEmail) {
                // Take user to login page, supply notice
                const dataForConditionalLogin = { pageSpecificCSS: '../../assets/css/login.css', 
                                                  notice: 'Please sign-in or register to complete booking!',  
                                                  sanitizedFormData };
                response.render('../views/login.handlebars', dataForConditionalLogin);
                
            } else if(verifiedUserEmail != sanitizedFormData.host_email) {
                // Take user to login page, supply notice 
                const dataForConditionalLogin = { pageSpecificCSS: '../../assets/css/login.css', 
                                                  notice: 'Booking host email must match account email!',  
                                                  sanitizedFormData };
                response.render('../views/login.handlebars', dataForConditionalLogin);
                
            } else {
                // Proceed with processing form data  
                await Booking.saveBookingUserToDB(sanitizedFormData);
                const tripId = await Booking.createTrip(sanitizedFormData);
                await Booking.addParticipant(tripId, sanitizedFormData);
    
                const dataForConfirmationPage = await Booking.prepareBookingConfirmationPage(tripId, sanitizedFormData);
                response.render('../views/booking_result.handlebars', dataForConfirmationPage);
            }

            
        } catch (error) {
            const dataForConfirmationPage = { pageSpecificCSS: '../../assets/css/booking.css', 
                                              sanitizedFormData };
            response.render('../views/booking_result.handlebars', dataForConfirmationPage);
        }
    }
}); 

router.get('/contact', (request, response) => { 
    response.render('../views/contact.handlebars', { pageSpecificCSS: '../../assets/css/contact.css' });
});

router.post('/contact-mail-forwarding', async (request, response) => { 
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);

    try {
        if(sanitizedFormData) {
            const instanceMailer = new Mailer();
            instanceMailer.sendContactMessageEmail(sanitizedFormData);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/contact.handlebars', { pageSpecificCSS: '../../assets/css/contact.css' });
});

router.post('/contact-text-message-forwarding', async (request, response) => { 
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);

    if (!sanitizedFormData) {
        return response.status(400).json({ message: "Invalid form data." });
    }

    // Initialize the messenger instance
    const instanceMessanger = new Messanger();

    try {
        // Attach message header to the sanitized form data
        const messageWithHeader = await instanceMessanger.attachMessageHeader(sanitizedFormData);

        // TO-DO: write logic to save message to DB

        // Send SMS using Vonage
        const vonageResponse = await instanceMessanger.sendSMS(instanceMessanger.serviceNumber, instanceMessanger.vonageFromNumber, messageWithHeader);

        // Handle the Vonage response
        if (vonageResponse.messages[0].status == '0') {
            // Success
            response.json({
                success: true,
                message: "SMS sent successfully"
            });
        } else {
            // SMS sent but not successful as per Vonage's response
            response.status(500).json({
                success: false,
                message: "Failed to send SMS, received non-success status from SMS service."
            });
        }
    } catch (error) {
        // Log and handle errors if SMS sending fails
        console.error('Inside Router (vonageError):', error);
        response.status(500).json({
            success: false,
            message: "Failed to send SMS due to server error."
        });
    }
});


router.get('/webhooks/inbound-sms', (request, response) => {
    const params = Object.assign(request.query, request.body);
    console.log(params);
    // TO-DO: Save retrieved message to DB
    response.status(204).send();
})

router.get('/retrieve-inbound-sms', (request, response) => {
    // TO-DB: Get messages from DB.
    // TO-DB: Send to client.
    // TO-DB: Ensure messages don't get double sent.
})

router.get('/packages', (request, response) => {
    response.render('../views/packages.handlebars', { pageSpecificCSS: '../../assets/css/packages.css' });
});

router.get('/login', (request, response) => { 
    response.render('../views/login.handlebars', { pageSpecificCSS: '../../assets/css/login.css' });
});

router.post('/block-date', async (request, response) => { 
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);
    const quotesRemoved = sanitizedFormData.tokenID.replace(/^"|"$/g, '');

    try {
        const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
        const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

        if(authorized) {
            Booking.blockDate(sanitizedFormData.date);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/login.handlebars', { pageSpecificCSS: '../../assets/css/login.css' });
});

router.post('/unblock-date', async (request, response) => { 
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);
    const quotesRemoved = sanitizedFormData.tokenID.replace(/^"|"$/g, '');

    try {
        const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
        const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

        if(authorized) {
            Booking.unblockDate(sanitizedFormData.date, sanitizedFormData.participantID);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/admin.handlebars', { pageSpecificCSS: '../../assets/css/admin.css' });
});

router.post('/update-booking-date', async(request, response) => {
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);
    const quotesRemoved = sanitizedFormData.tokenID.replace(/^"|"$/g, '');

    try {
        const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
        const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

        if(authorized) {
            Booking.updateBookingDate(sanitizedFormData.date, sanitizedFormData.participantID);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/admin.handlebars', { pageSpecificCSS: '../../assets/css/admin.css' });
});

router.post('/update-booking-package', async(request, response) => {
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);
    const quotesRemoved = sanitizedFormData.tokenID.replace(/^"|"$/g, '');

    try {
        const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
        const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

        if(authorized) {
            Booking.updateBookingPackage(sanitizedFormData.package, sanitizedFormData.participantID);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/admin.handlebars', { pageSpecificCSS: '../../assets/css/admin.css' });
});

router.post('/update-booking-user', async(request, response) => {
    const data = request.body; 
    const validation = new Validation();
    const sanitizedFormData = validation.sanitizeInputs(data);
    const quotesRemoved = sanitizedFormData.tokenID.replace(/^"|"$/g, '');

    try {
        const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
        const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

        if(authorized) {
            Booking.updateBookingUser(sanitizedFormData.user, sanitizedFormData.participantID);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/admin.handlebars', { pageSpecificCSS: '../../assets/css/admin.css' });
});

// router.post('/new-admin-booking', async(request, response) => {
//     const data = request.body; 
//     const validation = new Validation();
//     const santizedFormData = validation.sanitizeInputs(data);
//     const quotesRemoved = santizedFormData.tokenID.replace(/^"|"$/g, '');

//     try {
//         const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
//         const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

//         if(authorized) {
//             const tripId = await Booking.createTrip(sanitizedFormData);
//             await Booking.addParticipant(tripId, sanitizedFormData);
//         }

//     } catch (error) {
//         console.log(error);
//         throw(error);
//     }

//     response.render('../views/admin.handlebars', { pageSpecificCSS: '../../assets/css/admin.css' });
// });

router.post('/delete-booking', async(request, response) => {
    const data = request.body; 
    const validation = new Validation();
    const santizedFormData = validation.sanitizeInputs(data);
    const quotesRemoved = santizedFormData.tokenID.replace(/^"|"$/g, '');

    try {
        const verifiedUserEmail = await Authorize.verifyIdToken(quotesRemoved);
        const authorized = await Authorize.verifyAdminUser(verifiedUserEmail);

        if(authorized) {
            Booking.deleteBooking(santizedFormData.participantID);
        }

    } catch (error) {
        console.log(error);
        throw(error);
    }

    response.render('../views/admin.handlebars', { pageSpecificCSS: '../../assets/css/admin.css' });
});

// package routes as module and export
module.exports = router;