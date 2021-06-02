<template>
	<div class="action-peminjaman">
		<div class="header">
			<h3 class="header-title">
				Informasi Peminjam
			</h3>
			<div class="button-group">
				<button
					class="smil-btn smil-bg-danger mr-3"
					@click="$router.push({ name: 'BerandaPeminjaman' })"
				>
					Batal
				</button>
				<button class="smil-btn smil-bg-primary" :disabled="!formFilled">
					Simpan
				</button>
			</div>
		</div>
		<div class="form-content">
			<template v-if="actionType === 'peminjaman'">
				<b-row>
					<!-- START: TAMBAH ALAT DIPINJAM -->
					<b-col lg="7" order="1" order-sm="1">
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
								class="smil-btn smil-btn-small smil-bg-primary"
								@click="openPopup('add-alat')"
								:disabled="addedAlat.length >= 3 || addedAlatType === ''"
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
								</tbody>
							</table>
						</div>
					</b-col>
					<!-- END: TAMBAH ALAT DIPINJAM -->
					<!-- START: FORM INFORMASI PEMINJAM -->
					<b-col lg="5" order="2" order-sm="2">
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
							<!-- START: SELECT TAG -->
							<b-form-input
								v-if="form.type === 'select'"
								:list="`input-list-${idxForm}`"
								id="input-with-list"
								v-model="form.model"
								:placeholder="form.placeholder"
								:disabled="form.disabled"
							></b-form-input>
							<b-form-datalist
								:id="`input-list-${idxForm}`"
								:options="form.options"
							></b-form-datalist>
							<!-- END: SELECT TAG -->
							<!-- DATEPICKER -->
							<date-picker
								v-if="form.type === 'date'"
								format="DD-MM-YYYY"
								value-type="format"
								v-model="form.model"
								:disabled="form.disabled"
								@closed="setNullString(form.model)"
								@change="changeDate(form)"
								:placeholder="form.placeholder"
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
					</b-col>
					<!-- END: FORM INFORMASI PEMINJAM -->
				</b-row>
			</template>
			<template v-if="actionType === 'pengembalian'">
				<!-- START: Data Diri -->
				<b-row>
					<b-col lg="6">
						<table class="table table-borderless smil-table info-table">
							<tr>
								<th class="info-peminjam">Nama Peminjam</th>
								<td>{{ peminjamData.nama }}</td>
							</tr>
							<tr>
								<th class="info-peminjam">Waktu Peminjaman</th>
								<td>{{ formatDate(new Date(), 'DD MMM YYYY') }}</td>
							</tr>
							<tr>
								<th class="info-peminjam">Keperluan</th>
								<td>
									{{ `Pembuatan video wawancara dengan kepala jurusan. ` }}
								</td>
							</tr>
						</table>
					</b-col>
					<b-col lg="6">
						<table class="table table-borderless smil-table info-table">
							<tr>
								<th class="info-peminjam">Ruang Pemakaian</th>
								<td>{{ `AA301` }}</td>
							</tr>
							<tr>
								<th class="info-peminjam">Waktu Pengembalian</th>
								<td>{{ formatDate(new Date(), 'DD MMM YYYY') }}</td>
							</tr>
							<tr>
								<th class="info-peminjam">Dosen Penanggung Jawab</th>
								<td>{{ `Budiantoro Wijaya Kusuma` }}</td>
							</tr>
						</table>
					</b-col>
				</b-row>
				<!-- END: Data Diri -->

				<!-- START: Table Alat Dipinjam -->
				<b-row>
					<b-col lg="12">
						<div
							class="title-section d-flex align-align-items-start justify-content-between"
						>
							<div class="title">
								<h4>Daftar Alat yang Dipinjam</h4>
							</div>
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
												Tidak ada alat yang dapat ditampilkan
											</span>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</b-col>
				</b-row>
				<!-- END: Table Alat Dipinjam -->
			</template>
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
				:addType="addedAlatType"
				:closeModal="closePopup"
			/>
		</b-modal>
	</div>
</template>

<script>
	// Components
	import AddAlatPinjam from '@/components/Peminjaman/AddAlatPinjam'

	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'

	export default {
		name: 'action-peminjaman',
		mixins: [FormInputMixins, ModalMixins],
		components: { AddAlatPinjam },
		computed: {
			actionType() {
				return this.$route.params.actionType
			},
			formFilled() {
				return false
			},
			peminjamData() {
				return this.$store.state.peminjam
			},
			submitRequest() {
				return {
					nim: '',
					nip: '',
					waktu_kembali: '',
					staff_in_charge: '',
					ruangan_id: '',
					listAlat: [],
				}
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
						model: '',
						description: '',
						placeholder: 'Waktu Pengembalian Alat',
						isRequired: true,
						disabled: false,
					},
					{
						label: 'Dosen Penanggung Jawab',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Dosen Penanggung Jawab',
						isRequired: true,
						disabled: false,
						options: [
							// {
							// 	id: null,
							// 	text: 'Pilih Dosen Penanggung Jawab',
							// 	value: '',
							// },
						],
					},
					{
						label: 'Ruangan Pemakaian Alat',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Ruangan Pemakaian Alat',
						isRequired: true,
						disabled: false,
						options: [
							// {
							// 	id: null,
							// 	text: 'Pilih Dosen Penanggung Jawab',
							// 	value: '',
							// },
						],
					},
				],
				headsTable: ['Barcode Alat', 'Nama Alat', 'Jenis Alat', 'Action'],
				addedAlat: [],
				currentDate: this.formatDate(new Date(), 'DD-MM-YYYY'),
				addedAlatType: '', //short : peminjaman jangka pendek, long: peminjaman jangka panjang
			}
		},
		mounted() {
			// Ketika user akses halaman ini, namun belum memasukkan NIM atau NIP
			if (Object.keys(this.peminjamData).length === 0) {
				this.$router.push({ name: 'BerandaPeminjaman' })
			}

			// Set Informasi Peminjam berdasarkan NIM atau NIP yang dimasukkan
			let form = this.formPeminjaman

			// Set Field Nama
			form[0].model = this.peminjamData.nama

			// Ketika Peminjam merupakan Staff atau Dosen
			if (this.peminjamData.nip) {
				// Field Dosen Penanggung Jawab
				form[2].model = `${this.peminjamData.nip} - ${this.peminjamData.nama}`
				form[2].isRequired = false
				form[2].disabled = true
			}
		},
		methods: {
			// API
			async getStaffList() {},
			// Form Interaction
			setNullString(form) {
				form.model = ''
			},
			changeDate(fieldRow) {
				let rangeDate = this.dateRange(this.currentDate, fieldRow.model)
				console.log(rangeDate)
				if (rangeDate > 1) {
					this.addedAlatType = 'long'
				} else if (rangeDate === 1 || rangeDate === 0) {
					this.addedAlatType = 'short'
				} else {
					this.addedAlatType = ''
				}
			},
		},
		beforeRouteLeave(to, from, next) {
			if (Object.keys(this.peminjamData).length !== 0) {
				let confirm = window.confirm(
					'Apakah anda yakin tidak melanjutkan proses ini? Data yang telah dimasukkan tidak akan tersimpan'
				)
				if (confirm) {
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
		padding: 36px 120px;
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
		}

		.mx-datepicker {
			width: 100%;
		}
	}
	@media screen and (max-width: 992px) {
		.action-peminjaman {
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
		.col-lg-6 {
			margin-bottom: 50px;
		}
		input {
			&.form-control {
				color: #000;
				background-color: #fff;
				border-color: #c5c5c5;
				border-radius: 5px;
				font-size: 12px;
				&:focus {
					box-shadow: 0 0 0 1px #020b2a;
				}
				&:disabled {
					background-color: #c5c5c5;
					border-color: #696969;
				}

				height: 40px;
			}
		}
	}
</style>
