import axios from 'axios'

const domain_api = process.env.VUE_APP_BASE_API_PEMINJAM_SMIL

export const peminjam_api = axios.create({
	baseURL: domain_api,
	headers: {
		'Content-type': 'application/json',
	},
})
