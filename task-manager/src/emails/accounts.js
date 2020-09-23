const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomEmail = (email, name) => {
    const msg = {
        to: email,
        from: "lokdawn80@gmail.com",
        subject: "Thanks for joing",
        text: `Welcome to app, ${name}. Let me know how you get along with the app.`
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log('email send');
        })
        .catch((error) => {
            console.log("error", error, error.response.body);
        });;
}

const sendCancelationEmail = (email, name) => {
    const msg = {
        to: email,
        from: "lokdawn80@gmail.com",
        subject: "You account is canceled",
        text: `Hello ${name}. You account is canceled. Please tell why you deside to cancel it?`,
    };
    sgMail
        .send(msg)
        .then(() => {
            console.log("email send");
        })
        .catch((error) => {
            console.log("error", error, error.response.body);
        });
};

module.exports = {
    sendWelcomEmail,
    sendCancelationEmail,
};

