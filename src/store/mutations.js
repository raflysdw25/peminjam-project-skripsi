import * as types from '@/store/types'

export default {
	[types.MUTATE_ADMIN]: (state, payload) => {
		state.admin = payload
	},
	[types.MUTATE_PEMINJAM]: (state, payload) => {
		state.peminjam = payload
	},
}
