/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config();

import {Storage} from '@google-cloud/storage';
const projectName = process.env.G_PROJECT;

const gCloud = new Storage({
  keyFilename: path.join(__dirname + "/" + projectName + "-5c6c752e9840.json"),
  projectId: projectName
});

const radioBucket = gCloud.bucket("radio-1800");

//var testFile = path.join(__dirname + "/Media/TestTracks/Spectator/Spec1.mp3");

export const uploadFile = (filename: string) => {
  const readStream = fs.createReadStream(filename);
  readStream.pipe(
      radioBucket.file("temporary.mp3").createWriteStream({
        resumable: false,
        gzip: true
      })
    )
  .on("finish", () => {
    console.log("File:" + filename + "stored");
  });
};