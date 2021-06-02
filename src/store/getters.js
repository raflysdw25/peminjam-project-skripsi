import * as types from '@/store/types'

export default {
	[types.ADMIN]: (state) => {
		return state.admin
	},
	[types.PEMINJAM]: (state) => {
		return state.peminjam
	},
}
