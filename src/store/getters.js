import * as types from '@/store/types'

export default {
	[types.PEMINJAMANDATA]: (state) => {
		return state.peminjamanData
	},
	[types.PEMINJAM]: (state) => {
		return state.peminjam
	},
}
