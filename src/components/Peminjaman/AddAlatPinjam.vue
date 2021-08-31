<template>
	<div class="add-alat-pinjam">
		<h4 class="modal-title">Tambah Alat Dipinjam</h4>
		<div class="form-content">
			<div class="form-group">
				<label class="form-label">
					{{ formAdd[formKey].label }}
				</label>
				<template v-if="formKey === 'booking'">
					<model-list-select
						ref="list-alat"
						v-if="formAdd[formKey].type === 'select'"
						:list="formAdd[formKey].options"
						class="form-control"
						v-model="formAdd[formKey].model"
						option-value="value"
						option-text="name"
						placeholder="Pilih alat yang dipinjam"
					/>
				</template>
				<template v-if="formKey === 'direct'">
					<input
						:type="formAdd[formKey].type"
						v-model="formAdd[formKey].model"
						:placeholder="formAdd[formKey].placeholder"
						class="form-control"
						ref="focus-barcode"
						@change="cekAlatByBarcode"
						@keypress="formConstraint($event, 'barcode-input')"
					/>
				</template>
				<p class="desc" v-if="formAdd[formKey].desc !== ''">
					{{ formAdd[formKey].desc }}
				</p>
			</div>
		</div>
		<div class="info-content" v-if="formKey == 'direct'">
			<h6>Informasi Alat</h6>

			<p class="empty-form" v-if="formAdd['direct'].model.length < 2">
				Belum ada alat terdeteksi
			</p>
			<template v-else>
				<b-spinner
					v-if="loadingAlat"
					style="width: 35px; height: 35px; margin-top: 10px"
				></b-spinner>
				<div class="table-responsive-sm" v-else>
					<table class="table table-borderless">
						<tr>
							<th>Nama Alat</th>
							<td>{{ barcodeAlatData.alat_name }}</td>
						</tr>
						<tr>
							<th>Kondisi Alat</th>
							<td>
								<span class="smil-status smil-bg-success">
									Baik
								</span>
							</td>
						</tr>
						<tr>
							<th>Ketersediaan Alat</th>
							<td>
								<span class="smil-status smil-bg-info">
									Tersedia
								</span>
							</td>
						</tr>
					</table>
				</div>
			</template>
		</div>
		<div class="button-group d-flex justify-content-end">
			<button
				class="smil-btn smil-btn-small smil-bg-secondary mr-2"
				@click="closeModal"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-btn-small smil-bg-primary"
				:disabled="
					(formKey === 'direct' && formAdd[formKey].model.length < 2) ||
						(formKey === 'booking' && formAdd[formKey].model === null)
				"
				@click="addAlat"
			>
				Submit
			</button>
		</div>
	</div>
</template>

<script>
	//Components
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'

	// API
	import api from '@/api/peminjam_api'

	export default {
		name: 'add-alat-pinjam',
		props: {
			closeModal: Function,
			isBooking: Boolean,
			submitFunction: Function,
		},
		mixins: [FormInputMixins],
		async mounted() {
			if (this.isBooking) {
				await this.getAlatList()
			}
		},
		computed: {
			formKey() {
				return this.isBooking ? 'booking' : 'direct'
			},
		},
		data() {
			return {
				formAdd: {
					booking: {
						label: 'Alat Dipinjam',
						type: 'select',
						placeholder: 'Pilih alat yang tersedia',
						model: null,
						options: [],
					},
					direct: {
						label: 'Barcode Alat',
						type: 'text-barcode',
						placeholder: 'Barcode Alat',
						desc:
							'Arahkan kursor ke kolom input, lalu Gunakan barcode scanner yang tersedia untuk membaca barcode alat',
						model: '',
					},
				},
				barcodeAlatData: {},
				loadingAlat: false,
			}
		},
		methods: {
			// Call API
			async getAlatList() {
				try {
					const response = await api.getPlainData('alat')
					if (response.data.response.code === 200) {
						let listData = response.data.data
						let listAlat = []

						listData.forEach((data) => {
							let alat = {
								id: data.id,
								name: data.alat_name,
								value: data.id,
								disabled: false,
							}
							listAlat.push(alat)
						})
						this.formAdd['booking'].options = listAlat
					}
				} catch (e) {
					if (this.environment === 'development') {
						console.log(e)
					}
					let output = this.getErrorMessage(e, 'alert')
					alert(output)
				}
			},
			async cekAlatByBarcode() {
				if (this.formAdd['direct'].model.length > 2) {
					this.loadingAlat = true
					try {
						let payload = {
							barcode_alat: this.formAdd['direct'].model,
						}
						const response = await api.cekData('alat', payload)
						if (response.data.response.code == 200) {
							let data = response.data.data
							if (data !== null) {
								this.barcodeAlatData = data
							} else {
								this.formAdd['direct'].model = ''
								alert(response.data.response.message)
							}
							this.loadingAlat = false
						}
					} catch (e) {
						this.loadingAlat = false
						this.formAdd['direct'].model = ''
						if (this.environment === 'development') {
							console.log(e)
						}
						let output = this.getErrorMessage(e, 'alert')
						alert(output)
					}
				}
			},
			addAlat() {
				if (this.formKey == 'booking') {
					let form = this.formAdd.booking
					let alat = form.options.find((ops) => ops.id === form.model)
					this.submitFunction({
						id: alat.id,
						alat_name: alat.name,
					})
				} else if (this.formKey == 'direct') {
					this.submitFunction({
						barcode_alat: this.barcodeAlatData.barcode_alat,
						alat_name: this.barcodeAlatData.alat_name,
					})
				}
				this.closeModal()
			},
			focusInput(inputRef) {
				this.$refs[inputRef].focus()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.add-alat-pinjam {
		h4 {
			&.modal-title {
				font-weight: 700;
				font-size: 18px;
			}
		}
		.form-content {
			margin-top: 30px;
			.form-group {
				.desc {
					margin-top: 5px;
					margin-bottom: 0;
					font-size: 12px;
					color: #696969;
				}
			}
		}
		.info-content {
			margin-top: 30px;
			h6 {
				font-weight: 700;
			}
			p {
				margin-bottom: 0;
				&.empty-form {
					color: #696969;
				}
			}
			table {
				th {
					width: 120px;
				}
				th,
				td {
					padding-left: 0;
					font-size: 12px;
				}
				td {
					span {
						&.smil-status {
							font-size: 12px;
						}
					}
				}
			}
		}

		.button-group {
			margin-top: 50px;
		}
	}
</style>
<style lang="scss">
	.add-alat-pinjam {
		.form-control {
			height: 40px;
		}
	}
</style>
