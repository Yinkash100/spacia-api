const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name, activationToken) => {

  sgMail.send({
    to: email,
    from: "Moses@spacialab.com",
    subject: "Welcome to SpaciaLab.",
    text: `Hi ${name},

 Thank for joining our online community. SpaciaLab is a community for creative designers. 
And we are so happy you have considered being a part of us.
Our community offers you :
     * Paid-design tasks 
     * A large pool of job providers
     * Acess to SpaciaMEET
     * Shared community task
     * Online tutorship
     * Access to community engagements and open discussions and so much more

To ensure you get the best out of the community ensure to read FAQs.

Thank you.
   
Jason Moses
Community Recruit Lead
     `,
  }).then().catch((error)=>{
    console.log(error.response.body.errors)
  });
};

const sendActivationEmail = (email, name, activationLink) => {
  sgMail.send({
    to: email,
    from: "Spacialab@spacialab.com",
    subject: `SpaciaLab activation link`,
    text: `Hi ${name},
    
Please activate your account by visiting ${activationLink}
  The activation link above expires in 24 hours.

  If you did not initiate this process, and you think someone used your email address, please send us a mail at help@spacialab.com or ignore this mail.`,
  }).then().catch((error)=>{
    console.log(error.response.body.errors)
  });
};

const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "yinkash@spacialab.com",
    subject: `Sorry to see you go.`,
    text: `
    We noticed you recently signed off the SpaciaLab community. Could this be a mistake?
if its a mistake , we are waiting for you. If it isnt, we believe you have your reasons. 
But we will like to hear from you. It provides us the opportunity to serve you and others 
better.

Please fill out our short form and lets know how we can be better.

For more enquiries and other complaints , you should contact recruit@spaciaLab.com

Thank you .

Jason Moses
Community Recruit Lead
    `,
  }).then().catch((error)=>{
    console.log(error.response.body.errors)
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail,
  sendActivationEmail
};
