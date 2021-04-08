/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config();

import {Storage} from '@google-cloud/storage';
import { TextForTTS } from '../types';
const projectName = process.env.G_PROJECT;

const gCloud = new Storage({
  keyFilename: path.join(__dirname, "../" + projectName + "-5c6c752e9840.json"),
  projectId: projectName
});

const radioBucket = gCloud.bucket("radio-1800");

//var testFile = path.join(__dirname + "/Media/TestTracks/Spectator/Spec1.mp3");

export const uploadFile = (filename: string, cloudName: string, metadata: TextForTTS): string => {
  
  // eslint-disable-next-line no-useless-escape
  const cleanedName = cloudName.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").replace( /\s/g, '');

  const readStream = fs.createReadStream(filename);
  readStream.pipe(
      radioBucket.file(`${cleanedName}.mp3`).createWriteStream({
        resumable: false,
        gzip: true,
        metadata: {
          metadata
        }
      })
    )
  .on("finish", () => {
    console.log("File: " + filename + " stored");

  });
  return `http://storage.cloud.google.com/radio-1800/${cleanedName}.mp3`;
};