/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Actions } from './$types';
import pinataSDK from '@pinata/sdk'
import { env } from '$env/dynamic/private';

const pinataClient = new pinataSDK(env.PRIVATE_PINATA_API_KEY, env.PRIVATE_PINATA_API_SECRET);
const JWT = "Bearer " + env.PRIVATE_PINATA_JWT
export const actions = {
  editprogram: async ({ request }) => {
    const data = await request.formData();
    const image_file = data.get("image") as File  
    try {
      await pinataClient.testAuthentication()
    }
    catch (err) {
      return { success: false }
    }
    const formData: FormData = new FormData();
    formData.append('file', image_file)
    const metaData = JSON.stringify({
      name: image_file.name
    })
    formData.append('pinataMetadata', metaData);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);


    try {
      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        body: formData,
        headers: {
          //@ts-ignore
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`, 
          //@ts-ignore
          'Content-Length': formData.length,
          Authorization: JWT
        }
      });
      const json = await res.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }

    return { success: false, edit: true,  data: { name: data.get("name")?.toString() || "", description: data.get("description")?.toString() || "", image: data.get("image")?.toString() || "" }}
    
  },
  newprogram: async ({ request }) => {
    const data = await request.formData();
    const image_file: File = data.get("image") as File  
    // Temporarily disabled.
    return { success: false, edit: false,  data: { name: data.get("name")?.toString() || "", description: data.get("description")?.toString() || "", image: data.get("image")?.toString() || "" }}
    
  }
} satisfies Actions;