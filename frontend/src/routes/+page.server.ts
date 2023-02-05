/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

function checkFile(f: File): boolean {
  const mbytes = f.size / (1024 * 1024);
  if(f.type.split('/')[0] != 'image' || mbytes > 20) {
    return false;
  }
  return true;
}

const JWT = "Bearer " + env.PRIVATE_PINATA_JWT

export const actions = {
  editprogram: async ({ request }) => {
    const data = await request.formData();
    const image_file = data.get("image") as File  
    if(!checkFile(image_file)) { return { success: false, error: "File checking failed, make sure to upload an image that is less than 20 MB." } }
    const formData: FormData = new FormData();
    let img_ipfs_hash: string;
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
          Authorization: JWT
        }
      });
      const json = await res.json();
      img_ipfs_hash = json["IpfsHash"]

    } catch (error) {
      return { success: false };
    }

    const jsonToPin = {"description": data.get("description")?.toString()}
    let reqData;
    try {
      reqData = JSON.stringify({
          "pinataOptions:" : {
              "cidVersion": 1
          },
          "pinataContent": {
              "data": jsonToPin
          }
      })
    } catch (error) {
        return { success: false, data: null }
    }
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    body: reqData,
    headers: {
      'Content-Type': 'application/json',
      Authorization: JWT
    }
    });
    if(!res.ok) {
      return { success: false, data: {} }
    }
    const desc_json = await res.json()
    return { success: true, edit: true,  data: { name: data.get("name")?.toString() || "", description: desc_json["IpfsHash"] || "", image: img_ipfs_hash || "" }}
    
  },
  newprogram: async ({ request }) => {
    const data = await request.formData();
    const image_file = data.get("image") as File  
    if(!checkFile(image_file)) { return { success: false, error: "File checking failed, make sure to upload an image that is less than 20 MB." } }
    const formData: FormData = new FormData();
    let img_ipfs_hash: string;
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
          Authorization: JWT
        }
      });
      const json = await res.json();
      img_ipfs_hash = json["IpfsHash"]

    } catch (error) {
      return { success: false };
    }

    const jsonToPin = {"description": data.get("description")?.toString()}
    let reqData;
    try {
      reqData = JSON.stringify({
          "pinataOptions:" : {
              "cidVersion": 1
          },
          "pinataContent": {
              "data": jsonToPin
          }
      })
    } catch (error) {
        return { success: false, data: null }
    }
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    body: reqData,
    headers: {
      'Content-Type': 'application/json',
      Authorization: JWT
    }
    });
    if(!res.ok) {
      return { success: false, data: {} }
    }
    const desc_json = await res.json()
    return { success: true, edit: false,  data: { name: data.get("name")?.toString() || "", description: desc_json["IpfsHash"] || "", image: img_ipfs_hash || "" }}
    
  }
} satisfies Actions;