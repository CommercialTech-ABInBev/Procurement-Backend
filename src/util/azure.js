/* eslint-disable linebreak-style */
import { BlobServiceClient } from "@azure/storage-blob";
import azure from "azure-storage';
import { env } from '../config';

const {
  BUCKET_NAME,
  AZURE_KEY,
  STORAGE_CONNECTION_STRING
} = env;
const blobService__ = azure.createBlobService(BUCKET_NAME, AZURE_KEY);

async function main() {
    const blobServiceClient = BlobServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);

    let i = 1;
    for await (const container of blobServiceClient.listContainers()) {
        console.log(`Container ${i++}: ${container.name}`);
    }
    blobService__.createBlockBlobFromText('procurement', fileName, buffer, {contentType:type}, function(error, result, response)
};

export default main;
