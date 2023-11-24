
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

async function findYearFolder(year) {
    try {
      const existingFolders = await drive.files.list({
        q: `name='${year}' and mimeType='application/vnd.google-apps.folder'`,
      });
  
      if (existingFolders.data.files.length > 0) {
        return existingFolders.data.files[0];
      } else {
        return null;
      }
    } catch (error) {
      console.log('Error finding folder:', error.message);
      return null;
    }
  }

  async function generatePublicUrl(ID) {
    try {
      // const fileId = ID;
      await drive.permissions.create({
        fileId: ID,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
  
      /* 
      webViewLink: View the file in browser
      webContentLink: Direct download link 
      */
      const result = await drive.files.get({
        fileId: ID,
        fields: 'webViewLink, webContentLink',
        
      });
      const webViewLink = result.data.webViewLink;
    const webContentLink = result.data.webContentLink;
      console.log(result.data);
      return { webViewLink, webContentLink };
    } catch (error) {
      console.log(error.message);
    }
  }


  async function uploadFile(fileName, pathName) {
    try {

      const currentYear = new Date().getFullYear();
    
      // Check if the folder for the current year exists
      const yearFolder = await findOrCreateFolder(currentYear);
      const response = await drive.files.create({
        requestBody: {
          name: fileName, //This can be name of your choice
          mimeType: 'application/pdf',
          parents: [yearFolder.id],
        },
        media: {
          mimeType: 'application/pdf',
          body: fs.createReadStream(pathName),
        },
      });
      // ID=response.data.id;
      // console.log(ID, response.data.id)
      console.log(response.data);
      const publicUrls = await generatePublicUrl(response.data.id);
      console.log("Public URLs", publicUrls);
      return publicUrls;
      

    } catch (error) {
      console.log(error.message);
    }
  }

  async function findOrCreateFolder(folderName) {
    try {
      // Check if the folder exists
      const existingFolders = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      });
  
      if (existingFolders.data.files.length > 0) {
        return existingFolders.data.files[0]; // Return the existing folder
      } else {
        // Create a new folder
        const newFolder = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
          },
        });
  
        return newFolder.data; // Return the newly created folder
      }
    } catch (error) {
      console.log('Error finding or creating folder:', error.message);
    }
  }

  module.exports= {drive, findOrCreateFolder, uploadFile, generatePublicUrl, findYearFolder};