<template>
	<div class="text-center" v-if="loadingForm">
		<b-spinner style="width: 120px; height: 120px"></b-spinner>
	</div>
	<div class="action-peminjaman" v-else>
		<div class="header">
			<h3 class="header-title">
				Informasi Peminjam
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
					:disabled="!formFilled"
					@click="createPeminjaman"
				>
					Simpan
				</button>
			</div>
		</div>
		<div class="form-content" :class="isMobile ? 'mobile' : ''">
			<div class="smil-row">
				<div class="col-lg-6 col-12 mb-4">
					<div
						class="form-group"
						v-for="(form, idxForm) in formPeminjaman"
						:key="`form-peminjaman-${idxForm}`"
					>
						<label :for="`input-${idxForm}`" class="form-label">
							{{ form.label }}
						</label>
						<span
							style="color: #dc3545; font-size: 14px"
							v-if="form.isRequired"
						>
							*
						</span>
						<input
							:type="form.type"
							class="form-control"
							v-if="formInputType(form.type) === 'input'"
							:placeholder="form.placeholder"
							v-model="form.model"
							:disabled="form.disabled"
						/>
						<!-- START: TEXT AREA -->
						<textarea
							v-if="form.type === 'text-area'"
							class="form-control"
							cols="30"
							rows="10"
							:placeholder="form.placeholder"
							v-model="form.model"
							:disabled="form.disabled"
						>
						</textarea>
						<!-- END: TEXT AREA -->
						<!-- START: SELECT LIST TAG -->
						<b-form-input
							v-if="form.type === 'select-list'"
							:list="`input-${form.label}-${idxForm}`"
							v-model="form.model"
							:placeholder="form.placeholder"
							:disabled="form.disabled"
						></b-form-input>
						<b-form-datalist
							:id="`input-${form.label}-${idxForm}`"
							:options="form.options"
						></b-form-datalist>
						<!-- END: SELECT LIST TAG -->

						<!-- START: SELECT TAG -->
						<select
							class="custom-select"
							v-if="form.type === 'select'"
							v-model="form.model"
						>
							<option
								:value="ops.value"
								v-for="(ops, idxOps) in form.options"
								:key="`select-options-${idxOps}`"
							>
								{{ ops.name }}
							</option>
						</select>
						<!-- END: SELECT TAG -->

						<!-- DATEPICKER -->
						<date-picker
							v-if="form.type === 'date'"
							format="YYYY-MM-DD"
							value-type="format"
							v-model="form.model"
							:disabled="form.disabled"
							@closed="setNullString(form.model)"
							@change="changeDate(form)"
							:placeholder="form.placeholder"
							:disabled-date="notBeforeToday"
						>
							<template slot="icon-clear">
								<b-icon-x-circle-fill></b-icon-x-circle-fill>
							</template>
							<template slot="icon-calendar">
								<b-icon icon="calendar-month-fill"></b-icon>
							</template>
						</date-picker>
						<!-- DATEPICKER -->
						<p class="desc" v-if="form.description !== ''">
							{{ form.description }}
						</p>
					</div>
				</div>
				<div class="col-lg-6 col-12">
					<div
						class="title-section d-flex align-align-items-start justify-content-between"
					>
						<div class="title">
							<h4>Daftar Alat yang Dipinjam</h4>
							<p>
								Jenis Peminjaman :
								<span>
									{{
										addedAlatType === 'short'
											? 'Jangka Pendek'
											: addedAlatType === 'long'
											? 'Jangka Panjang'
											: '-'
									}}
								</span>
							</p>
						</div>
						<button
							class="smil-btn smil-bg-primary"
							:class="isMobile ? 'smil-btn-small' : ''"
							@click="openPopup('add-alat')"
							:disabled="!addAlatBtnActive"
						>
							Tambah Alat
						</button>
					</div>
					<div class="table-responsive-lg mt-4">
						<table class="table smil-table">
							<thead class="smil-thead">
								<tr>
									<th
										v-for="(head, idxHead) in headsTable"
										:key="`table-head-${idxHead}`"
									>
										{{ head }}
									</th>
								</tr>
							</thead>
							<tbody class="smil-tbody">
								<tr v-if="addedAlat.length === 0">
									<td
										:colspan="headsTable.length"
										class="empty-table text-center"
									>
										<span class="empty-table-description">
											Belum ada alat yang ditambahkan
										</span>
									</td>
								</tr>
								<tr
									v-else
									v-for="(rows, indexRow) in listAddedAlat"
									:key="`row-added-alat-${indexRow}`"
								>
									<td
										v-for="(content, indexContent) in rows"
										:key="`column-added-alat-${indexContent}`"
									>
										<template v-if="indexContent === rows.length - 1">
											<button
												class="smil-btn smil-btn-small smil-bg-danger"
												@click="deleteAddedAlat(indexRow)"
											>
												<b-icon icon="trash"></b-icon>
											</button>
										</template>
										<template v-else>
											{{ content }}
										</template>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>

		<div class="button-group mobile justify-content-end" v-if="isMobile">
			<button
				class="smil-btn smil-bg-danger mr-3"
				@click="$router.push({ name: 'BerandaPeminjaman' })"
			>
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!formFilled"
				@click="createPeminjaman"
			>
				Simpan
			</button>
		</div>

		<b-modal
			ref="modal-popup"
			hide-header
			hide-footer
			centered
			no-close-on-backdrop
			no-close-on-esc
		>
			<add-alat-pinjam
				v-if="baseModalType === 'add-alat'"
				:isBooking="this.peminjamanStatus !== null"
				:submitFunction="addToList"
				:closeModal="closePopup"
			/>
			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:notes="notes"
				:closeAlert="closePopup"
			/>
		</b-modal>
	</div>
</template>

<script>
	// Components
	import AddAlatPinjam from '@/components/Peminjaman/AddAlatPinjam'
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'

	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'

	// Vuex
	import * as types from '@/store/types'

	// API
	import api from '@/api/peminjam_api'

	export default {
		name: 'action-peminjaman',
		mixins: [FormInputMixins, ModalMixins],
		components: { AddAlatPinjam, BaseModalAlert },
		computed: {
			// Peminjaman
			formFilled() {
				let payload = this.submitPeminjamanRequest
				return (
					(payload.nim_mahasiswa !== '' || payload.nip_staff !== '') &&
					payload.expected_return_date !== null &&
					payload.pjm_purpose !== '' &&
					payload.list_alat.length !== 0
				)
			},
			peminjamData() {
				return this.$store.getters[types.PEMINJAM] !== null
					? this.$store.getters[types.PEMINJAM]
					: {}
			},
			peminjamanStatus() {
				let form = this.formPeminjaman
				let status = null
				if (this.isMobile || (!this.isMobile && this.addedAlatType == 'long')) {
					status = 1
				} else {
					status = null
				}
				return status
			},
			submitPeminjamanRequest() {
				let form = this.formPeminjaman
				let list_alat = []
				this.addedAlat.forEach((alat) => {
					if (this.peminjamanStatus === 1) {
						list_alat.push(alat.id)
					} else {
						list_alat.push(alat.barcode_alat)
					}
				})
				return {
					nim_mahasiswa: this.peminjamData.nim_mahasiswa
						? this.peminjamData.nim_mahasiswa
						: '',
					nip_staff: this.peminjamData.nip_staff
						? this.peminjamData.nip_staff
						: '',
					expected_return_date: form[1].model,
					nip_staff_in_charge:
						form[2].model !== '' ? form[2].model.split(' - ')[0] : '',
					pjm_type: this.addedAlatType,
					pjm_status: this.peminjamanStatus,
					ruangan_id: form[3].model,
					pjm_purpose: form[4].model,
					list_alat: list_alat,
				}
			},
			addAlatBtnActive() {
				if (this.isMobile || (!this.isMobile && this.addedAlatType !== '')) {
					return true
				} else {
					return false
				}
			},
			headsTable() {
				if (this.peminjamanStatus == 1) {
					return ['Nama Alat', 'Action']
				} else {
					return ['Barcode Alat', 'Nama Alat', 'Action']
				}
			},
			listAddedAlat() {
				let listTable = []
				if (this.addedAlat.length !== 0) {
					this.addedAlat.forEach((list) => {
						let rowTable = []
						if (this.peminjamanStatus == 1) {
							rowTable = [list.alat_name, '']
						} else {
							rowTable = [list.barcode_alat, list.alat_name, '']
						}
						listTable.push(rowTable)
					})
				}
				return listTable
			},
		},
		data() {
			return {
				formPeminjaman: [
					{
						label: 'Nama Peminjam',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nama Peminjam',
						isRequired: true,
						disabled: true,
					},
					{
						label: 'Waktu Pengembalian Alat',
						type: 'date',
						model: null,
						description: '',
						placeholder: 'Waktu Pengembalian Alat',
						isRequired: true,
						disabled: false,
					},
					{
						label: 'Dosen Penanggung Jawab',
						type: 'select-list',
						model: '',
						description: '',
						placeholder: 'Dosen Penanggung Jawab',
						isRequired: false,
						disabled: false,
						options: [],
					},
					{
						label: 'Ruangan Pemakaian Alat',
						type: 'select',
						model: null,
						description: '',
						placeholder: 'Ruangan Pemakaian Alat',
						isRequired: false,
						disabled: false,
						options: [],
					},
					{
						label: 'Tujuan Peminjaman Alat',
						type: 'text-area',
						model: '',
						description: '',
						placeholder: 'Tujuan Peminjaman Alat',
						isRequired: true,
						disabled: false,
						options: [],
					},
				],
				addedAlat: [],
				currentDate: this.formatDate(new Date(), 'YYYY-MM-DD'),
				addedAlatType: '', //short : peminjaman jangka pendek, long: peminjaman jangka panjang
			}
		},
		async mounted() {
			// Ketika user akses halaman ini, namun belum memasukkan NIM atau NIP
			if (Object.keys(this.peminjamData).length === 0) {
				this.$store.dispatch(types.UPDATE_PEMINJAM, null)
				this.$router.push({ name: 'BerandaPeminjaman' })
			}
			// Call API
			this.loadingForm = true
			await this.getRuanganList()
			await this.getStaffList()

			// Set Informasi Peminjam berdasarkan NIM atau NIP yang dimasukkan
			let form = this.formPeminjaman

			// Set Field Nama
			form[0].model =
				this.peminjamData && this.peminjamData.nip_staff !== ''
					? this.peminjamData.staff_fullname
					: this.peminjamData.mahasiswa_fullname

			// Ketika Peminjam merupakan Staff atau Dosen
			if (this.peminjamData.nip_staff !== '') {
				// Field Dosen Penanggung Jawab
				form[2].model = `${this.peminjamData.nip_staff} - ${this.peminjamData.staff_fullname}`
				form[2].isRequired = false
				form[2].disabled = false
			}
			this.loadingForm = false
		},
		methods: {
			// API
			async getStaffList() {
				try {
					const response = await api.getPlainData('staff')
					if (response.data.response.code === 200) {
						let listStaff = response.data.data
						let list = []
						listStaff.forEach((staff) => {
							let st = {
								id: staff.nip,
								text: `${staff.nip} - ${staff.staff_fullname}`,
								value: `${staff.nip} - ${staff.staff_fullname}`,
							}
							list.push(st)
						})

						this.formPeminjaman[2].options = list
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
			async getRuanganList() {
				try {
					const response = await api.getPlainData('ruangan')
					if (response.data.response.code === 200) {
						let list = [
							{
								id: null,
								name: 'Pilih Ruangan yang digunakan',
								value: null,
							},
						]
						let listRuangan = response.data.data
						listRuangan.forEach((ruangan) => {
							let rg = {
								id: ruangan.id,
								name: ruangan.ruangan_name,
								value: ruangan.id,
							}
							list.push(rg)
						})

						this.formPeminjaman[3].options = list
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
			async createPeminjaman() {
				this.isCreate = true
				this.showAlert(true)
				try {
					const response = await api.createData(
						'peminjaman',
						this.submitPeminjamanRequest
					)
					if (response.data.response.code === 201) {
						let message =
							this.peminjamanStatus === 1
								? 'silahkan hubungi staff laboratorium untuk mengambil alat'
								: 'harap untuk mengembalikan alat sesuai dengan tanggal yang ditentukan'
						this.showAlert(
							false,
							true,
							`Peminjaman berhasil dibuat, ${message}`
						)
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
			// Form Interaction
			setNullString(form) {
				form.model = ''
			},
			changeDate(fieldRow) {
				let rangeDate = this.dateRange(
					this.currentDate,
					this.formatDate(fieldRow.model, 'YYYY-MM-DD')
				)
				console.log('Range Date: ', rangeDate)
				if (!this.isMobile) {
					this.addedAlat = []
				}
				if (rangeDate === 1 || rangeDate === 0) {
					this.addedAlatType = 'short'
				} else {
					this.addedAlatType = 'long'
				}
			},
			addToList(objectAlat) {
				this.addedAlat.push(objectAlat)
			},
			deleteAddedAlat(indexData) {
				this.addedAlat.splice(indexData, 1)
			},
		},
		beforeRouteLeave(to, from, next) {
			if (Object.keys(this.peminjamData).length !== 0 && !this.isCreate) {
				let confirm = window.confirm(
					'Apakah anda yakin tidak melanjutkan proses peminjaman alat ini? Data yang telah dimasukkan tidak akan tersimpan'
				)
				if (confirm) {
					this.$store.dispatch(types.UPDATE_PEMINJAM, null)
					next()
				}
			} else {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.action-peminjaman {
		// padding: 36px 120px;
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 15px;
			.header-title {
				font-size: 32px;
				font-weight: 700;
			}
		}
		.form-content {
			margin-top: 50px;
			&.mobile {
				margin-top: 10px;
			}
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
			.title-section {
				h4 {
					font-size: 20px;
					margin-bottom: 0;
					font-weight: 700;
				}
				p {
					font-weight: 700;
					span {
						font-weight: 400;
					}
				}
			}
		}

		.smil-table {
			&.info-table {
				th {
					&.info-peminjam {
						width: 210px;
					}
				}
				th,
				td {
					padding: 15px 10.5px;
				}
			}
		}

		.button-group {
			display: flex;
			&.mobile {
				margin-top: 30px;
				padding-right: 15px;
			}
		}

		.mx-datepicker {
			width: 100%;
		}
	}
	@media screen and (max-width: 992px) {
		.action-peminjaman {
			padding: 0;
			.header {
				.header-title {
					font-size: 18px;
				}
			}
			.form-content {
				.form-group {
					margin-top: 30px;
				}
			}
		}
	}
</style>
<style lang="scss">
	.action-peminjaman {
		@import '@/assets/css/global.scss';
	}
</style>
