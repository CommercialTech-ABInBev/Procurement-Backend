/* eslint-disable linebreak-style */
import { BlobServiceClient } from "@azure/storage-blob";
import azure from "azure-storage";
import { env } from '../config';

const {
  BUCKET_NAME,
  AZURE_KEY,
  STORAGE_CONNECTION_STRING
} = env;

const Upload = async(fileName, buffer) => {
  try {
    //connecting to azure 
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    let i = 1;
    for await (const container of blobServiceClient.listContainers()) {
        console.log(`Container ${i++}: ${container.name}`);
    };
    const blobService__ = azure.createBlobService(BUCKET_NAME, AZURE_KEY);
    const upload = await blobService__.createBlockBlobFromText('procurement', 
    fileName, buffer, {contentType:type})
    return upload;
  } catch (error) {
    console.error(`i am the error ${error}`);
  }
}

export default Upload;
