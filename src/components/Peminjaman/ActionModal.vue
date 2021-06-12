<template>
	<div class="action-modal">
		<h4 class="action-modal-title">
			{{ title }}
		</h4>
		<div class="form-group">
			<label for="action-input" class="form-label">
				{{ form.label }}
			</label>
			<input :type="form.type" v-model="form.model" class="form-control" />
		</div>
		<div class="button-group">
			<button class="smil-btn smil-bg-secondary mr-2" @click="closeAction">
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!formFilled"
				@click="doAction()"
			>
				<b-spinner style="color:#fff" v-if="loading"></b-spinner>
				<span v-else>Lanjutkan</span>
			</button>
		</div>
	</div>
</template>

<script>
	// Vuex
	import * as types from '@/store/types'
	// API
	import api from '@/api/peminjam_api'
	export default {
		name: 'action-modal',
		props: {
			title: String,
			form: Object,
			closeModal: Function,
			actionType: String,
		},
		computed: {
			formFilled() {
				return this.form.model !== ''
			},
		},
		data() {
			return {
				loading: false,
			}
		},
		methods: {
			async doAction() {
				let payload = {
					nomor_induk: this.form.model,
				}
				if (this.actionType === 'peminjaman') {
					// Call API to get data Peminjam
					this.loading = true
					try {
						const response = await api.getDataPeminjam(payload)
						if (
							response.data.response.code === 200 &&
							response.data.data !== null
						) {
							// Save data peminjam into Vuex
							let peminjamData = response.data.data
							this.$store.dispatch(types.UPDATE_PEMINJAM, peminjamData)
							this.$router.push({
								name: 'ActionPeminjaman',
								params: { actionType: this.actionType },
							})
						} else {
							this.loading = false
							this.form.model = ''
							alert(response.data.response.message)
						}
					} catch (e) {
						this.loading = false
						this.form.model = ''
						if (e.response) {
							alert(e.response.data.response.message)
						} else {
							alert(e)
						}
					}
				} else if (this.actionType == 'pengembalian') {
					// Call API to get data peminjaman
					this.loading = true
					try {
						const response = await api.getNeedReturnedPeminjam(payload)
						if (
							response.data.response.code === 200 &&
							response.data.data !== null
						) {
							let peminjamanData = response.data.data
							this.$store.dispatch(types.UPDATE_PEMINJAMANDATA, peminjamanData)
							this.$router.push({ name: 'ActionPengembalian' })
						} else {
							alert(response.data.response.message)
							this.loading = false
							this.form.model = ''
						}
					} catch (e) {}
				}
			},
			closeAction() {
				this.form.model = ''
				this.closeModal()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.action-modal {
		.action-modal-title {
			font-size: 20px;
			font-weight: 700;
			margin-bottom: 30px;
		}
		.button-group {
			margin-top: 40px;
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
