<template>
	<div class="action-pengembalian">
		<div class="header">
			<h3 class="header-title">
				{{
					choosedPeminjaman !== null
						? 'Informasi Peminjam'
						: 'Peminjaman Alat Terbaru'
				}}
			</h3>
			<div class="button-group">
				<button
					class="smil-btn smil-bg-danger mr-3"
					@click="$router.push({ name: 'BerandaPeminjaman' })"
				>
					Batal
				</button>
				<button
					class="smil-btn smil-bg-primary"
					:disabled="!formFilled"
					@click="returnPeminjaman"
				>
					Simpan
				</button>
			</div>
		</div>
		<template v-if="choosedPeminjaman !== null">
			<span class="link-back" @click="cancelChoosedPeminjaman">
				Pilih Peminjaman Lain
			</span>
			<div class="form-content">
				<!-- START: Data Diri -->
				<b-row>
					<b-col lg="6">
						<table class="table table-borderless smil-table info-table">
							<tr>
								<th class="info-peminjam">Nama Peminjam</th>
								<td>
									{{
										peminjamanData.nim_mahasiswa !== null
											? peminjamanData.mahasiswa_peminjam_model
													.mahasiswa_fullname
											: peminjamanData.staff_peminjam_model.staff_fullname
									}}
								</td>
							</tr>
							<tr>
								<th class="info-peminjam">Waktu Peminjaman</th>
								<td>
									{{ formatDate(peminjamanData.created_date, 'DD MMM YYYY') }}
								</td>
							</tr>
							<tr>
								<th class="info-peminjam">Keperluan</th>
								<td>
									{{ peminjamanData.pjm_purpose }}
								</td>
							</tr>
						</table>
					</b-col>
					<b-col lg="6">
						<table class="table table-borderless smil-table info-table">
							<tr>
								<th class="info-peminjam">Ruang Pemakaian</th>
								<td>
									{{
										peminjamanData.ruangan_id !== null
											? peminjamanData.ruangan_model.ruangan_name
											: '-'
									}}
								</td>
							</tr>
							<tr>
								<th class="info-peminjam">Waktu Pengembalian</th>
								<td>
									{{
										formatDate(
											peminjamanData.expected_return_date,
											'DD MMM YYYY'
										)
									}}
								</td>
							</tr>
							<tr>
								<th class="info-peminjam">Dosen Penanggung Jawab</th>
								<td>
									{{
										peminjamanData.nip_staff_in_charge !== null
											? peminjamanData.staff_in_charge_model.staff_fullname
											: '-'
									}}
								</td>
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
									<tr v-if="listAlatDipinjam.length === 0">
										<td
											:colspan="headsTable.length"
											class="empty-table text-center"
										>
											<span class="empty-table-description">
												Tidak ada alat yang dapat ditampilkan
											</span>
										</td>
									</tr>
									<tr
										v-else
										v-for="(rows, indexRow) in listTableAlatDipinjam"
										:key="`row-alat-dipinjam-${indexRow}`"
									>
										<td
											v-for="(content, indexContent) in rows"
											:key="`content-alat-dipinjam-${indexContent}`"
										>
											<template v-if="indexContent === rows.length - 1">
												<div @click="verifyAlat(indexRow)" v-if="!content">
													<icon-component
														v-b-tooltip.hover
														title="Verifikasi Alat"
														iconClass="scanner-class"
														iconName="scanner"
														:size="42"
														colorIcon="#101939"
													/>
												</div>
												<div v-else>
													<b-icon
														icon="check-circle-fill"
														style="width: 42px;height:42px"
														variant="success"
													/>
												</div>
											</template>
											<template v-else>
												{{ content }}
											</template>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</b-col>
				</b-row>
				<!-- END: Table Alat Dipinjam -->
			</div>
		</template>
		<template v-else>
			<div class="form-content">
				<template v-for="(list, idxList) in listPeminjamanData">
					<div
						:key="`list-peminjaman-data-${idxList}`"
						class="list-box"
						v-b-toggle="`collapse-${idxList}`"
						:ref="`collapse-index`"
					>
						<div class="info-box">
							<h5 class="font-weight-bold">
								{{
									list.nim_mahasiswa === null
										? list.staff_peminjam_model.staff_fullname
										: list.mahasiswa_peminjam_model.mahasiswa_fullname
								}}
							</h5>
							<p>
								Dibuat pada
								{{ formatDate(list.created_at, 'DD MMMM YYYY HH:mm A') }}
								<span @click="choosePeminjaman(idxList)"
									>Pilih Data Peminjaman</span
								>
							</p>
						</div>
						<b-icon icon="chevron-down" class="icon-style"></b-icon>
						<!-- <b-icon
							icon="chevron-up"
							style="width: 32px; height: 32px; margin-left:auto"
						></b-icon> -->
					</div>
					<b-collapse
						:key="`list-collapse-peminjaman-data-${idxList}`"
						:id="`collapse-${idxList}`"
						class="collapse-box"
					>
						<h6 class="font-weight-bold">Alat yang Dipinjam</h6>
						<div
							class="d-flex"
							v-for="(detail, idxDetail) in list.detail_peminjaman_model"
							:key="`detail-peminjaman-${idxDetail}`"
						>
							<p class="mr-2">{{ idxDetail + 1 }}.</p>
							<p>
								{{
									`${detail.barcode_alat} - ${detail.barcode_alat_pinjam.alat_model.alat_name}`
								}}
							</p>
						</div>
					</b-collapse>
				</template>
			</div>
		</template>

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
				:notes="notes"
				:closeAlert="closePopup"
			/>
			<base-modal-check-barcode
				v-if="baseModalType === 'check-barcode'"
				:barcodeToCheck="selectedData.barcode_alat"
				:submitCheck="isAlatVerify"
				:closeModal="closePopup"
			/>
		</b-modal>
	</div>
</template>

<script>
	//Components
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'
	import BaseModalCheckBarcode from '@/components/BaseModal/BaseModalCheckBarcode'
	import IconComponent from '@/components/IconComponent'
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'

	// Api
	import api from '@/api/peminjam_api'
	// Vuex
	import * as types from '@/store/types'

	export default {
		name: 'action-pengembalian',
		components: {
			BaseModalAlert,
			IconComponent,
			BaseModalCheckBarcode,
		},
		mixins: [ModalMixins, FormInputMixins],
		data() {
			return {
				isCollapsed: false,
				// Table
				headsTable: ['Barcode', 'Nama Alat', 'Verifikasi Alat'],
				listAlatDipinjam: [],
				choosedPeminjaman: null, //Index dari list peminjaman yang ingin dikembalikan
				selectedData: {},
				selectedRow: null,
			}
		},
		computed: {
			formFilled() {
				if (Object.keys(this.peminjamanData).length > 0) {
					let alatValid = this.listAlatDipinjam.every(
						(list) => list.isVerified == true
					)
					return alatValid
				} else {
					return false
				}
			},
			listPeminjamanData() {
				return this.$store.state.peminjamanData
			},
			listTableAlatDipinjam() {
				let list = []
				if (this.listAlatDipinjam.length > 0) {
					this.listAlatDipinjam.forEach((alat) => {
						let row = [
							alat.barcode_alat,
							alat.barcode_alat_pinjam.alat_model.alat_name,
							alat.isVerified,
						]
						list.push(row)
					})
				}
				return list
			},
			peminjamanData() {
				if (this.choosedPeminjaman !== null) {
					let data = this.listPeminjamanData[this.choosedPeminjaman]
					let list = []

					data.detail_peminjaman_model.forEach((detail) => {
						let verifiedAlat = false
						let detailAlat = detail.barcode_alat_pinjam
						if (
							detailAlat.condition_status !== 2 ||
							detailAlat.alat_model.habis_pakai
						) {
							verifiedAlat = true
						}

						let row = {
							...detail,
							isVerified: verifiedAlat,
						}
						list.push(row)
					})
					this.listAlatDipinjam = list
					return data
				} else {
					return {}
				}
			},
		},
		mounted() {
			if (this.listPeminjamanData == null) {
				this.$store.dispatch(types.UPDATE_PEMINJAMANDATA, null)
				this.$router.push({ name: 'BerandaPeminjaman' })
			} else {
				if (this.listPeminjamanData.length == 1) {
					this.choosedPeminjaman = this.listPeminjamanData.length - 1
				}
			}
		},
		methods: {
			// Call API
			async returnPeminjaman() {
				this.isCreate = true
				this.showAlert(true)
				try {
					const response = await api.returnPeminjaman(this.peminjamanData.id)
					if (response.data.response.code === 200) {
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
			// Methods
			verifyAlat(indexRow) {
				this.selectedRow = indexRow
				this.selectedData = this.listAlatDipinjam[indexRow]
				this.openPopup('check-barcode')
			},
			choosePeminjaman(indexList) {
				this.choosedPeminjaman = indexList
			},
			isAlatVerify(isVerify) {
				let data = this.listAlatDipinjam[this.selectedRow]
				if (isVerify) {
					data.isVerified = true
				}
			},
			cancelChoosedPeminjaman() {
				this.choosedPeminjaman = null
			},
		},
		beforeRouteLeave(to, from, next) {
			if (this.listPeminjamanData !== null && !this.isCreate) {
				let confirm = window.confirm(
					'Apakah anda yakin tidak melanjutkan proses pengembalian ini? Alat yang telah diverifikasi tidak akan tersimpan'
				)
				if (confirm) {
					this.$store.dispatch(types.UPDATE_PEMINJAMANDATA, null)
					next()
				}
			} else {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.action-pengembalian {
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header-title {
				font-size: 32px;
				font-weight: 700;
			}
		}

		.link-back {
			display: inline-block;
			color: #101939;
			padding-left: 5px;
			margin-top: 1.5rem;
			&:hover {
				cursor: pointer;
				font-weight: 700;
			}
		}

		.form-content {
			margin-top: 20px;

			.title-section {
				margin-top: 30px;
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
			.list-box {
				border: 1px solid #c5c5c5;
				box-sizing: border-box;
				padding: 8px 10px;
				display: flex;
				align-items: center;
				margin-bottom: 15px;

				p {
					margin-bottom: 0;
					font-size: 12px;
					color: #696969;
					span {
						font-size: 12px;
						color: #17a2b8;
						&:hover {
							cursor: pointer;
							font-weight: 700;
							text-decoration: underline;
						}
					}
				}
				.icon-style {
					width: 32px;
					height: 32px;
					margin-left: auto;
				}
			}
			.collapse-box {
				border: 1px solid #c5c5c5;
				margin-top: 2px;
				margin-bottom: 15px;
				margin-left: 5px;
				margin-right: 5px;
				padding: 10px;
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
		.scanner-class {
			width: max-content;
			&:hover {
				cursor: pointer;
			}
		}

		.button-group {
			display: flex;
		}
	}
</style>
