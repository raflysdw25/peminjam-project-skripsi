import { peminjam_api } from '@/api/config'

export default {
	createData(type, createPayload) {
		// laporan-kerusakan, mahasiswa
		return peminjam_api.post(`add-${type}`, createPayload)
	},

	getPlainData(type) {
		return peminjam_api.get(`get-${type}`)
	},

	cekData(type, cekPayload) {
		// cek-alat, cek-pelapor, cek-peminjaman
		return peminjam_api.post(`cek-${type}`, cekPayload)
	},
}
