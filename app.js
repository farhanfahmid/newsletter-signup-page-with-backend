const express = require('express');
const bodyParser = require("body-parser")
const { write } = require('fs');
const https = require('https');
const app = express()
const port = 3000
const client = require('@mailchimp/mailchimp_marketing'); // Import the Mailchimp library
const config = require('./config');

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public")) //put css file and images in public folder


// Set up Mailchimp API configuration
client.setConfig({
    apiKey: config.apiKey,
    server: "us21",
  });


  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})



app.post("/", async (req, res) => {

    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var emailID = req.body.emailID

    console.log(firstName);
    console.log(lastName);
    console.log(emailID);


    // Validate email format
  if (!isValidEmail(emailID)) {
    res.sendFile(__dirname + "/failure.html");
  }

  else{
    res.sendFile(__dirname + "/success.html");
  }

    

    try {
        // Add subscriber to the Mailchimp list
        const response = await client.lists.addListMember("71f1a874a8", {
          email_address: emailID,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
          },
        });
    
        console.log("Subscriber added to Mailchimp:", response);
        
      } catch (error) {
        console.error("Error adding subscriber to Mailchimp:", error);
        res.status(!200).send("Internal Server Error");
      }



})

app.post("/failure", (req, res) => { //on clicking try again button, user is redirected to signup page
  res.redirect("/")
})


app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })



// Function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}