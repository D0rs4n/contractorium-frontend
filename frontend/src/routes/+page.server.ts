import type { Actions } from './$types';


export const actions = {
  editprogram: async ({ request }) => {
    const data = await request.formData();
    // Temporarily disable
    return { success: false, edit: true,  data: { name: data.get("name")?.toString() || "", description: data.get("description")?.toString() || "", image: data.get("image")?.toString() || "" }}
    
  },
  newprogram: async ({ request }) => {
    const data = await request.formData();
    const image_file: File = data.get("image") as File  
    // Temporarily disabled.
    return { success: false, edit: false,  data: { name: data.get("name")?.toString() || "", description: data.get("description")?.toString() || "", image: data.get("image")?.toString() || "" }}
    
  }
} satisfies Actions;