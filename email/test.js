// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey('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')
// const msg = {
//   to: 'atiqahammedshamim@yahoo.com', // Change to your recipient
//   from: 'atiqahammed@yandex.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })

/*
 1) Install Courier SDK: npm install @trycourier/courier
 2) Make sure you allow ES module imports: Add "type": "module" to package.json file 
 */
const { CourierClient } = require("@trycourier/courier");

 const courier = CourierClient(
   { authorizationToken: "pk_prod_S754PKGGSX47MQNW675SFBS56EDH"});
 

 async function send () {   
 const { requestId } = await courier.send({
   message: {
     content: {
       title: "Welcome to Courier!",
       body: "Want to hear a joke? {{joke}}"
     },
     data: {
       joke: "Why was the JavaScript developer sad? Because they didn't Node how to Express themselves"
     },
     to: {
       email: "neverbetterpakas@gmail.com"
     }
   }
 });
}

send()