<template>
	<div class="buat-akun-mahasiswa">
		<div class="header">
			<h3 class="header-title">
				Buat Akun Mahasiswa
			</h3>
			<div class="button-group" v-if="!isMobile">
				<button
					class="smil-btn smil-bg-danger mr-3"
					@click="$router.push({ name: 'BerandaPeminjaman' })"
				>
					Batal
				</button>
				<button
					class="smil-btn smil-bg-primary"
					@click="addMahasiswa"
					:disabled="!formFilled"
				>
					Submit
				</button>
			</div>
		</div>
		<div class="form-content">
			<div class="smil-row">
				<div
					class="form-group col-lg-6 col-12"
					v-for="(form, idxForm) in formList"
					:key="`form-${idxForm}`"
				>
					<label :for="`input-${idxForm}`" class="form-label">
						{{ form.label }}
					</label>
					<span style="color: #dc3545; font-size: 14px" v-if="form.isRequired">
						*
					</span>
					<input
						:type="form.type == 'nomor_induk' ? 'text' : form.type"
						class="form-control"
						v-if="formInputType(form.type) === 'input'"
						@keydown="formConstraint($event, form.type)"
						:placeholder="form.placeholder"
						v-model="form.model"
					/>
					<textarea
						v-if="form.type === 'text-area'"
						class="form-control"
						cols="30"
						rows="10"
						:placeholder="form.placeholder"
						v-model="form.model"
					>
					</textarea>
					<select
						class="custom-select"
						v-if="form.type === 'select'"
						v-model="form.model"
					>
						<option
							:value="ops.value"
							v-for="(ops, idxOps) in form.options"
							:key="`select-form-${idxOps}`"
						>
							{{ ops.name }}
						</option>
					</select>

					<p class="desc" v-if="form.description !== ''">
						{{ form.description }}
					</p>
				</div>
			</div>
		</div>
		<div class="button-group" v-if="isMobile">
			<button
				class="smil-btn smil-bg-danger mr-3"
				@click="$router.push({ name: 'BerandaPeminjaman' })"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				@click="addMahasiswa"
				:disabled="!formFilled"
			>
				Submit
			</button>
		</div>

		<b-modal
			ref="modal-popup"
			hide-footer
			hide-header
			centered
			no-close-on-backdrop
			no-close-on-esc
		>
			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>
		</b-modal>
	</div>
</template>

<script>
	// Components
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'

	// API
	import api from '@/api/peminjam_api'
	export default {
		name: 'buat-akun-mahasiswa',
		components: { BaseModalAlert },
		mixins: [FormInputMixins, ModalMixins],
		data() {
			return {
				formList: [
					{
						label: 'Nomor Induk Mahasiswa',
						type: 'number',
						model: '',
						description: 'Masukkan Nomor Induk Mahasiswa anda',
						placeholder: 'Nomor Induk Mahasiswa',
						isRequired: true,
					},
					{
						label: 'Nama Lengkap',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nama Lengkap',
						isRequired: true,
					},
					{
						label: 'Email Mahasiswa',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Email Mahasiswa',
						isRequired: true,
					},
					{
						label: 'Nomor Telepon',
						type: 'tel',
						model: '',
						description: '',
						placeholder: 'Nomor Telepon',
						isRequired: true,
					},
					{
						label: 'Program Studi',
						type: 'select',
						model: null,
						description: '',
						placeholder: 'Program Studi',
						isRequired: true,
						options: [],
					},
					{
						label: 'Tahun Diterima',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Tahun Diterima',
						isRequired: true,
					},
					{
						label: 'Alamat',
						type: 'text-area',
						model: '',
						description: '',
						placeholder: 'Alamat',
						isRequired: false,
					},
				],
			}
		},
		async mounted() {
			await this.getListProdi()
			// this.showAlert(false, false, 'Alert Berhasil')
		},
		computed: {
			submitRequest() {
				let form = this.formList
				return {
					nim: form[0].model,
					mahasiswa_fullname: form[1].model,
					email: form[2].model,
					phone_number: form[3].model,
					prodi_id: form[4].model,
					register_year: form[5].model,
					address: form[6].model,
				}
			},
			formFilled() {
				let sr = this.submitRequest
				return (
					sr.nim !== '' &&
					sr.mahasiswa_fullname !== '' &&
					sr.email !== '' &&
					this.emailValidate(sr.email) &&
					sr.phone_number !== '' &&
					sr.register_year !== '' &&
					sr.prodi_id !== null
				)
			},
		},
		methods: {
			async getListProdi() {
				try {
					const response = await api.getPlainData('prodi')
					let listProdi = response.data.data
					if (response.data.response.code === 200) {
						let list = [
							{
								id: null,
								name: 'Pilih Program Studi',
								value: null,
								disabled: false,
							},
						]
						listProdi.forEach((prodi) => {
							let pd = {
								id: prodi.id,
								name: prodi.prodi_name,
								value: prodi.id,
								disabled: false,
							}
							list.push(pd)
						})
						this.formList[4].options = list
					}
				} catch (e) {
					if (this.environment == 'development') {
						console.log(e)
					}
					let message = this.getErrorMessage(e)
					if (typeof message == 'object' && message.length > 0) {
						this.showAlert(false, false, 'Terjadi Kesalahan', message)
					} else {
						this.showAlert(false, false, message)
					}
				}
			},
			async addMahasiswa() {
				this.isCreate = true
				this.showAlert(true)
				try {
					const response = await api.createData('mahasiswa', this.submitRequest)
					if (response.data.response.code === 201) {
						this.showAlert(false, true, response.data.response.message)
						setTimeout(() => {
							this.$router.push({ name: 'BerandaPeminjaman' })
						}, 2000)
					}
				} catch (e) {
					this.isCreate = false
					if (this.environment == 'development') {
						console.log(e)
					}
					let message = this.getErrorMessage(e)
					if (typeof message == 'object' && message.length > 0) {
						this.showAlert(false, false, 'Terjadi Kesalahan', message)
					} else {
						this.showAlert(false, false, message)
					}
				}
			},
		},
		beforeRouteLeave(to, from, next) {
			if (!this.isCreate) {
				let confirLeave = window.confirm(
					'Apakah anda yakin akan meninggalkan halaman ini? Data yang telah dimasukkan tidak akan tersimpan'
				)
				if (confirLeave) {
					next()
				}
			} else {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.buat-akun-mahasiswa {
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header-title {
				font-size: 32px;
				font-weight: 700;
			}
		}
		.form-content {
			margin-top: 50px;
			.form-group {
				.form-label {
					font-size: 16px;
				}
				.desc {
					margin-top: 5px;
					margin-bottom: 0;
					font-size: 12px;
					color: #696969;
				}
			}
		}
		.button-group {
			display: flex;
		}
	}

	@media screen and (max-width: 998px) {
		.buat-akun-mahasiswa {
			.header {
				.header-title {
					font-size: 20px;
				}
			}

			.form-content {
				margin-top: 20px;
			}

			.button-group {
				margin-top: 30px;
				padding-right: 15px;
				justify-content: flex-end;
			}
		}
	}
</style>
<style lang="scss">
	.buat-akun-mahasiswa {
		.col-lg-6,
		.col-12 {
			padding-left: 0;
		}
	}
</style>
