const express = require('express');
const bodyParser = require("body-parser")
const { write } = require('fs');
const https = require('https');
const app = express()
const port = 3000
const client = require('@mailchimp/mailchimp_marketing'); // Import the Mailchimp library

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public")) //put css file and images in public folder


// Set up Mailchimp API configuration
client.setConfig({
    apiKey: "bb3e4a4aade17d60a6fec94ff8a78bb5-us21",
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

    res.send("Thanks for signing up!")

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
        res.send("Thanks for signing up!");
      } catch (error) {
        console.error("Error adding subscriber to Mailchimp:", error);
        res.status(500).send("Internal Server Error");
      }



})



// app.get("/", (req, res) => {
//     res.send("Server running")
// })


// API Key
// bb3e4a4aade17d60a6fec94ff8a78bb5-us21


// Audience ID 
// 71f1a874a8





  








app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })