const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors')({origin: true});
const axios = require('axios');
const app = express();
app.use(cors);

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
const cas_domain = "https://cas.ucdavis.edu/cas";
const app_url = "https%3A%2F%2Fwwww.aggierewards.com";

app.get('/auth/login', (req, res) => {
    // apply client id and password to link to redirect
    // probably in the form of {cas_domain}/login?service={website}
    // ex. {cas_domain}/login?https%3A%2F%2Fshibboleth.ucdavis.edu%2Fidp%2FAuthn%2FExtCas%3Fconversation%3De3s1%26entityId%3Dhttp%3A%2F%2Fucdavis.instructure.com%2Fsaml2
    let school_canvas = "/login?service=https%3A%2F%2Fshibboleth.ucdavis.edu%2Fidp%2FAuthn%2FExtCas%3Fconversation%3De3s1%26entityId%3Dhttp%3A%2F%2Fucdavis.instructure.com%2Fsaml2";
    let url = `${cas_domain}?${school_canvas}`;
    res.send(url);
});

// Endpoint for Aggie Rewards Client to validate login ticket
app.get('/auth/validate', (req, res) => {
    // Send POST request to {cas_domain}/p3/serviceValidate
    axios({
      method: "POST",
      url: `${cas_domain}/p3/serviceValidate?service=${app_url}`,
      headers: {
        Accept: "application/json",
      },
    }).then((response) => {
      res.redirect('www.google.com'/*"https://www.aggierewards.com/client/userProfile"*/);
    }).catch((error) => {
      res.send("Invalid login");
    })
  
    // IF valid, retrieve information for target user, redirect to target page
  
    // If invalid, tell the user their login was invalid
    // Note: need to set up how registered CAS application responsds to login: gives ticket, and redirects to /auth/validate
});
exports.app = functions.https.onRequest(app);