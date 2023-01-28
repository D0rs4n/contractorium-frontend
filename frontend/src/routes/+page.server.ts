import type { Actions } from './$types';


export const actions = {
  editprogram: async ({ request }) => {
    const data = await request.formData();
    // TODO: upload new file to IPFS
    console.log(data)
    return { success: true, edit: true,  data: { name: data.get("name")?.toString() || "", description: data.get("description")?.toString() || "", image: data.get("image")?.toString() || "" }}
    
  },
  newprogram: async ({ request }) => {
    const data = await request.formData();
    // TODO: upload new file to IPFS
    console.log(data)
    return { success: true, edit: false,  data: { name: data.get("name")?.toString() || "", description: data.get("description")?.toString() || "", image: data.get("image")?.toString() || "" }}
    
  }
} satisfies Actions;