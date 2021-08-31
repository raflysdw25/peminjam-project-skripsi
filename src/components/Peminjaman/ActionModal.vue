<template>
	<div class="action-modal">
		<h4 class="action-modal-title">
			{{ title }}
		</h4>

		<div class="error-message" v-if="errorMessage !== ''">
			<p class="mb-0">{{ errorMessage }}</p>
			<span class="close-error" @click="eraseError">X</span>
		</div>
		<div class="form-group">
			<label for="action-input" class="form-label">
				{{ form.label }}
			</label>
			<input
				:type="form.type"
				v-model="form.model"
				class="form-control"
				@keypress.enter="doAction()"
			/>
			<small>
				Staff atau Dosen jurusan menggunakan NIP, Mahasiswa menggunakan NIM
			</small>
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
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	// API
	import api from '@/api/peminjam_api'
	export default {
		name: 'action-modal',
		mixins: [FormInputMixins],
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
		watch: {
			errorMessage: {
				deep: true,
				handler: function(newValue) {
					if (newValue !== '') {
						setTimeout(() => {
							this.errorMessage = ''
						}, 2000)
					}
				},
			},
		},
		data() {
			return {
				loading: false,
				errorMessage: '',
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
							// alert(response.data.response.message)
							this.errorMessage = response.data.response.message
						}
					} catch (e) {
						this.loading = false
						this.form.model = ''
						if (this.environment === 'development') {
							console.log(e)
						}
						let output = this.getErrorMessage(e, 'alert')
						// alert(output)
						this.errorMessage = output
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
							// alert(response.data.response.message)
							this.errorMessage = response.data.response.message
							this.loading = false
							this.form.model = ''
						}
					} catch (e) {
						if (this.environment === 'development') {
							console.log(e)
						}
						let output = this.getErrorMessage(e, 'alert')
						// alert(output)
						this.errorMessage = output
					}
				}
			},
			closeAction() {
				this.form.model = ''
				this.closeModal()
			},
			eraseError() {
				this.errorMessage = ''
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
		.error-message {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20px;
			padding: 12px;
			border-radius: 6px;
			color: #dc3545;
			font-weight: bold;
			background-color: #da3b4b6e;
			.close-error {
				color: #000;
				font-weight: bold;
				&:hover {
					cursor: pointer;
				}
			}
		}
	}
</style>
<style lang="scss">
	.action-modal {
		.form-control {
			height: 40px;
		}
	}
</style>
