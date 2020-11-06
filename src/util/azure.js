/* eslint-disable linebreak-style */
import { BlobServiceClient } from "@azure/storage-blob";
import sharp from "sharp";
import azure from "azure-storage";
import { env } from '../config';

const {
  BUCKET_NAME,
  AZURE_KEY,
  STORAGE_CONNECTION_STRING
} = env;

 
const AzureUpload = {
    /**
   * send email verification to user after signup
   * @param {object} req
   * @param {object} user - { id, email, firstName ...etc}
   * @returns {Promise<boolean>} - Returns true if mail is sent, false if not
   * @memberof AzureUpload
   */
  async uploadImage(file) {
    try {
      const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
      let i = 1;
      for await (const container of blobServiceClient.listContainers()) {
          console.log(`Container ${i++}: ${container.name}`);
      };
      const blobService__ = azure.createBlobService(BUCKET_NAME, AZURE_KEY);

      let result = [];
      await file.forEach( async(item) => {
        let fileName = item.filename;
        let buffer = item.buffer;
        let type = item.mimetype

        const data = await blobService__.createBlockBlobFromText('procurement', fileName, buffer, 
          { contentType:type }, async (err, resultImage) => {
            if(err) {
              console.log(err);
            } else {
              return await resultImage;
            }
          });
          const imageUrl = `https://eyemarket6973837452.blob.core.windows.net/procurement/${data.name}`
          result.push(imageUrl);
      });
      return result;
    } catch (error) {
      console.error(`i am the error ${error}`);
    }
  }

}

export default AzureUpload;