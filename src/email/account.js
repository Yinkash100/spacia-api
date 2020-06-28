// // const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendWelcomeEmail = (email, name) => {
//   sgMail.send({
//     to: email,
//     from: "yinkash1000@gmail.com",
//     subject: "Welcome to curious.",
//     text: `Dear ${name},
//      Welcome to curious. we promise to provide an awesome bla blah blah blah`,
//   });
// };

// const sendCancelEmail = (email, name) => {
//   sgMail.send({
//     to: email,
//     from: "yinkash1000@gmail.com",
//     subject: "Sorry to see you go.",
//     text: `Uh oh!, It has been a plesant experience having you around.
//     and we are utmost accpeciative of your time. >Thanks for using curious.
//     If there anything lagging, you can discuss it with us by sending a mail to yinkash1000@gmail.com`,
//   });
// };

// module.exports = {
//   sendWelcomeEmail,
//   sendCancelEmail,
// };
