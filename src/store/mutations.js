import * as types from '@/store/types'

export default {
	[types.MUTATE_PEMINJAMANDATA]: (state, payload) => {
		state.peminjamanData = payload
	},
	[types.MUTATE_PEMINJAM]: (state, payload) => {
		state.peminjam = payload
	},
}
