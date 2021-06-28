<template>
	<div class="tab-menu-component">
		<div class="header-tab">
			<div class="header-title text-center">
				<h3>
					{{ tabMenu.contentTitle }}
				</h3>
			</div>
			<div
				class="header-desc text-center"
				v-if="tabMenu.desc"
				v-html="tabMenu.desc"
			></div>
		</div>
		<div class="steps-section" v-if="tabMenu.steps">
			<div class="smil-row">
				<template v-for="(step, idxStep) in tabMenu.steps">
					<div
						class="steps-box col-lg-3 col-12"
						:class="idxStep !== tabMenu.steps.length - 1 ? `not-last` : ``"
						:key="`step-${idxStep}`"
					>
						<icon-component
							:iconName="step.icon"
							:size="154"
							colorIcon="#101939"
						/>
						<div class="step-title">
							<h6>
								{{ step.title }}
							</h6>
						</div>
						<div class="step-desc">
							<p>
								{{ step.desc }}
							</p>
						</div>
					</div>
					<div
						class="arrow"
						:key="`arrow-next-${idxStep}`"
						v-if="idxStep !== tabMenu.steps.length - 1"
					>
						<b-icon icon="arrow-right" class="arrow-next"></b-icon>
					</div>
				</template>
				<div class="button-group">
					<p
						v-if="tabMenu.id == 2 && isMobile"
						class="text-center font-weight-bold"
					>
						Silahkan melakukan pengembalian alat <br />
						di Laboratorium TIK
					</p>
					<button
						v-else
						class="smil-btn smil-btn-large smil-bg-primary"
						@click="action"
					>
						{{ tabMenu.textButton }}
					</button>
				</div>
			</div>
		</div>
		<div class="input-section" v-else>
			<div class="form-group">
				<input
					type="text"
					class="form-control"
					v-model="tabMenu.inputValue"
					placeholder="Nomor Induk Peminjaman"
				/>
				<div class="button-group">
					<button
						class="smil-btn smil-btn-large smil-bg-primary w-100"
						@click="checkFunction"
						:disabled="!activeButton"
					>
						{{ tabMenu.textButton }}
					</button>
				</div>
			</div>
			<div class="input-display">
				<h5>Informasi Peminjaman Terakhir</h5>
				<div class="list-info" v-if="listInfo.length > 0">
					<h6>
						{{
							listInfo[0].nim_mahasiswa !== null
								? listInfo[0].mahasiswa_peminjam_model.mahasiswa_fullname
								: listInfo[0].staff_peminjam_model.staff_fullname
						}}
					</h6>
					<div
						class="info-group"
						v-for="(list, idxList) in listInfo"
						:key="`unfinished-peminjaman-${idxList}`"
					>
						<p class="created-date">
							{{ formatDate(list.created_date, 'DD MMMM YYYY') }}
							s.d
							{{ formatDate(list.expected_return_date, 'DD MMMM YYYY') }}
						</p>
						<div class="alat-list">
							<p
								v-for="(alat, idxAlat) in list.detail_peminjaman_model"
								:key="`list-detail-alat-${idxAlat}`"
							>
								<template v-if="list.pjm_status >= 1 && list.pjm_status <= 3">
									{{ alat.alat_pinjam.alat_name }}
								</template>
								<template v-else>
									{{ alat.barcode_alat }} -
									{{ alat.barcode_alat_pinjam.alat_model.alat_name }}
								</template>
							</p>
						</div>
						<p
							class="smil-status"
							:class="statusPeminjaman(list.pjm_status).background"
						>
							{{ statusPeminjaman(list.pjm_status).text }}
						</p>
					</div>
				</div>
				<p class="empty-display" v-else>
					Tidak ada informasi yang dapat ditampilkan
				</p>
			</div>
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
				:notes="notes"
			/>
		</b-modal>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	import ModalMixins from '@/mixins/ModalMixins'
	// Component
	import IconComponent from '@/components/IconComponent'
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'
	// API
	import api from '@/api/peminjam_api'
	export default {
		name: 'tab-menu-component',
		components: { IconComponent, BaseModalAlert },
		mixins: [FormInputMixins, ModalMixins],
		props: {
			tabMenu: Object,
			actionButton: Function,
			activeButton: Boolean,
		},
		data() {
			return {
				listInfo: [],
			}
		},
		computed: {
			inputCekFilled() {
				if (this.tabMenu.inputValue) {
					return this.tabMenu.inputValue !== ''
				}
			},
		},
		methods: {
			// API
			async checkFunction() {
				this.showAlert(true)
				let payload = {
					nomor_induk: this.tabMenu.inputValue,
				}
				try {
					const response = await api.cekData('peminjaman', payload)
					if (response.data.response.code === 200) {
						let data = response.data.data
						if (data.length === 0) {
							this.listInfo = []
							this.showAlert(false, true, 'Tidak ada peminjaman')
						} else {
							this.listInfo = data
							this.showAlert(false, true, 'Peminjaman Ditemukan')
						}
						this.tabMenu.inputValue = ''
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
			// Action
			action() {
				this.actionButton('action')
			},
			statusPeminjaman(status_id) {
				let listStatus = [
					{
						id: 1,
						text: 'Butuh Persetujuan',
						background: 'smil-bg-warning',
					},
					{
						id: 2,
						text: 'Alat belum diambil',
						background: 'smil-bg-info',
					},
					{
						id: 3,
						text: 'Ditolak',
						background: 'smil-bg-danger',
					},
					{
						id: 4,
						text: 'Belum Kembali',
						background: 'smil-bg-warning',
					},
					{
						id: 5,
						text: 'Selesai',
						background: 'smil-bg-success',
					},
				]

				return listStatus.find((status) => status.id === status_id)
			},
		},
	}
</script>

<style lang="scss" scoped>
	.tab-menu-component {
		.header-tab {
			.header-title {
				h3 {
					font-size: 24px;
					color: #000;
					font-weight: 700;
				}
			}
			.header-desc {
				font-size: 16px;
				margin-top: 30px;
				margin-bottom: 50px;
			}
		}
		.steps-section {
			display: flex;
			justify-content: center;
			margin: 70px 0;
			.steps-box {
				.icon-component {
					margin-right: 0;
				}
				&.not-last {
					margin-right: 10px;
				}
				width: 275px;
				text-align: center;
				padding: 20px;

				display: flex;
				flex-direction: column;
				align-items: center;
				.step-title {
					margin-top: 18px;
					h6 {
						font-size: 18px;
						font-weight: 700;
					}
				}
				.step-desc {
					margin-top: 30px;
				}
			}
		}
		.arrow {
			display: flex;
			flex-direction: column;
			// align-items: center;
			justify-content: center;
			.arrow-next {
				color: #101939;
				width: 72px;
				height: 72px;
				font-weight: bold;
			}
		}
		.input-section {
			padding: 0 102px;
			.input-display {
				margin-top: 50px;
				height: 200px;
				&.scroll-info {
					overflow-y: scroll;
				}
				h5 {
					font-size: 18px;
					font-weight: 700;
				}
				.empty-display {
					margin-top: 20px;
					color: #696969;
				}
				.list-info {
					padding-top: 30px;
					height: 200px;
					overflow: scroll;
					.info-group {
						display: flex;
						margin-bottom: 20px;
						.created-date {
							color: #696969;
							margin-right: 25px;
						}
						.alat-list {
							width: 260px;
							p {
								color: #000;
								font-weight: 500;
							}
						}
						p {
							&.smil-status {
								margin-bottom: 0;
								margin-left: 25px;
							}
						}
					}
				}
			}
		}
		.button-group {
			margin-top: 30px;
		}
	}
	@media screen and (max-width: 992px) {
		.tab-menu-component {
			.header-tab {
				.header-title {
					h3 {
						font-size: 18px;
						color: #000;
						font-weight: 700;
					}
				}
				.header-desc {
					font-size: 11px;
				}
			}
			.steps-section {
				.steps-box {
					&.not-last {
						margin-right: 0;
					}
				}
			}
			.arrow {
				display: none;
			}
			.input-section {
				padding: 0 10px;
				.input-display {
					h5 {
						font-size: 14px;
					}
					.list-info {
						.info-group {
							.created-date {
								margin-right: 10px;
							}

							p {
								font-size: 12px;
								&.smil-status {
									margin-left: 10px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	.tab-menu-component {
		.col-lg-4,
		.col-12 {
			padding-left: 0;
		}

		.smil-row {
			justify-content: center;
		}

		input {
			&.form-control {
				color: #000;
				background-color: #fff;
				border-color: #c5c5c5;
				border-radius: 5px;
				font-size: 14px;
				&:focus {
					box-shadow: 0 0 0 1px #020b2a;
				}
				&:disabled {
					background-color: #c5c5c5;
					border-color: #696969;
				}

				height: 50px;
			}
		}
	}
</style>
