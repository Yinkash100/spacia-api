const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name, activationToken) => {

  sgMail.send({
    to: email,
    from: "yinkash@spacialab.com",
    subject: "Welcome to curious.",
    text: `Dear ${name},
     Welcome to spacialab. Where we celebrate designers without design. we promise to provide an awesome bla blah blah blah
     
     Please activate your account by visiting http://localhost:3000/account_activate/${activationToken}
     The activation link above expires in 24 hours.
     
     If you did not initiate this process, and you think someone used your email address, please send us a mail at help@spacialab.com or ignore this mail.
     `,
  }).then().catch((error)=>{
    console.log(error.response.body.errors)
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "yinkash@spacialab.com",
    subject: `${name}, Sorry to see you go.`,
    text: `Uh oh!, It has been a plesant experience having you around.
    and we are utmost appreciative of your time. >Thanks for using Spacialab.
    If there anything lagging, you can discuss it with us by sending a mail to yinkash1000@gmail.com`,
  }).then().catch((error)=>{
    console.log(error.response.body.errors)
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
};
