import type { Actions } from './$types';
import { env } from '$env/dynamic/private';

const JWT = 'Bearer ' + env.PRIVATE_PINATA_JWT;

export const actions = {
	createreport: async ({ request }) => {
		const data = await request.formData();
		if(data.get('name').length > 35) { return { success: false, data: null }  }
		const jsonToPin = { name: data.get('name'), description: data.get('description') };
		let reqData;
		try {
			reqData = JSON.stringify({
				'pinataOptions:': {
					cidVersion: 1
				},
				pinataContent: {
					data: jsonToPin
				}
			});
		} catch {
			return { success: false, data: null };
		}

		const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
			method: 'POST',
			body: reqData,
			headers: {
				'Content-Type': 'application/json',
				Authorization: JWT
			}
		});
		if (!res.ok) {
			return { success: false, data: null };
		}
		const json = await res.json();
		return { success: true, data: { description: json['IpfsHash'] } };
	}
};
