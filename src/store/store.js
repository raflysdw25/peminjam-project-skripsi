import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import actions from '@/store/actions'
import getters from '@/store/getters'
import mutations from '@/store/mutations'

export const store = new Vuex.Store({
	state: {
		admin: {},
		peminjam: {},
	},
	getters,
	mutations,
	actions,
})
