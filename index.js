require("dotenv").config();
const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");
const CronJob = require("cron").CronJob;
const express = require("express");
const app = express();
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Function call
const photoId = Math.round(randomNumber(1, 14));

const postToInsta = async () => {
  const ig = new IgApiClient();
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  const imageBuffer = await get({
    url: process.env.IG_PHOTO,
    encoding: null,
  });

  await ig.publish.photo({
    file: imageBuffer,
    caption: process.env.IG_CAPTIONS, // nice caption (optional)
  });
};

const cronInsta = new CronJob("06 00 * * *", async () => {
  postToInsta();
  // console.log(photo);
});

cronInsta.start();
