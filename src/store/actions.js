import * as types from '@/store/types'

export default {
	[types.UPDATE_PEMINJAMANDATA]: ({ commit }, payload) => {
		commit(types.MUTATE_PEMINJAMANDATA, payload)
	},
	[types.UPDATE_PEMINJAM]: ({ commit }, payload) => {
		commit(types.MUTATE_PEMINJAM, payload)
	},
}
