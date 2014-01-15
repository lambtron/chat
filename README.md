# Bi-directional SMS demo app

## Features

* send and receive SMS right from the web browser
* threaded conversations
* select from different phone numbers to use for SMS

## Installation

This demo is built with NodeJS and MongoDB. Requirements:

* npm
* node
* mongo
* ngrok (for running locally and testing)

To get started, clone this into your local repo with:

	$ git clone git@bitbucket.org:twiliosa/demo-app-bidirectional-sms-nodejs.git

Once you have it cloned locally, edit the config.js file (config/config.js) and
set the following variables to your Twilio information (which can be found in
your Twilio account portal).

	process.env.TWILIO_ASID = '{{YOUR ACCOUNT SID}}';
	process.env.TWILIO_AUTH_TOKEN = '{{YOUR AUTH TOKEN}}';
	process.env.TWILIO_PHONE_NUMBERS = ['{{TWILIO PHONE NUMBER}}','{{TWILIO PHONE NUMBER}}'];

Once you set the values in config.js, run the following:

	$ npm install

## Running locally

Start mongo and you can begin your node server.

	$ mongod
	$ node server.js
	$ ngrok 3000

Make sure to configure your Twilio phone numbers (the ones set in config.js). Set
their SMS URLs to 

* http://your-ngrok-domain.com/api/message

## Deploying to Heroku

	$ heroku create
	$ git add .
	$ git commit -m "push to heroku"
	$ git push heroku master

This will give you a fresh version of this app deployed to Heroku. When it is
successful, you will see the following:

	$ http://your-app-domain.herokuapp.com deployed to Heroku

**You'll need that URL to do the last bit of configuration on Twilio:**

Go to the Twilio number you specified in config.yml and set it's SMS URL to:

* http://your-app-domain.herokuapp.com/api/message

**Now you're all set. Enjoy!**

'''
                             ____
                          ,''    ''.
                         / `-.  .-' \
                        /( (O))((O) )
                       /'-..-'/\`-..|
                     ,'\   `-.\/.--'|
                   ,' ( \           |
                 ,'( (   `._        |
                /( (  ( ( | `-._ _,-;
               /( (  ( ( (|     '  ;
              / ((  (    /        /
             //         /        /
             //  / /  ,'        /
            // /    ,'         /
            //  / ,'          ;
            //_,-'          ;
            // /,,,,..-))-))\    /|
              /; ; ;\ `.  \  \  / |
             /; ; ; ;\  \.  . \/./
            (; ; ;_,_,\  .: \   /
             `-'-'     | : . |:|
                       |. | : .|
'''