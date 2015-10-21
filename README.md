Slack Bot Poker Vietnam
===================

A bot that allows you to play Poker in Vietnam.
Start a game in any channel or private group, and more people can play.

Written for fun and to practice nodejs.

Inspired by [@duonghung1269/slack-pokervn-bot](https://github.com/duonghung1269/slack-pokervn-bot).

## Getting started
1. Create a new [bot integration here](https://my.slack.com/services/new/bot)
2. Run the bot locally or have it running on a heroku server
3. Start a game using: `@<bot-name>: start`
4. Follow the instructions

## Running locally
```sh
$ git clone git@github.com:duonghung1269/slack-pokervn-bot.git && cd slack-pokervn-bot
$ npm install
$ npm start
```
Create `token.txt` in the root directory and paste in the API token given when creating your bot integration.

## Deploying to Heroku
```sh
$ heroku create
$ heroku config:set SLACK_POKERVN_BOT_TOKEN=[Your API token]
$ git push heroku master
```

Alternatively, you can deploy your own copy with one click using this button:

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/duonghung1269/slack-pokervn-bot)

See the [Heroku documentation](https://devcenter.heroku.com/articles/config-vars) for more info about changing the configuration variables after deployment.

## Test

Tests can be run using `npm test`.
