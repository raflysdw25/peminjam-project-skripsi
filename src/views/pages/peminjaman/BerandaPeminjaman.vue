<template>
	<div class="beranda-peminjaman">
		<div class="header">
			<div class="header-title">
				<h2 class="text-center">
					PORTAL PEMINJAMAN ALAT LABORATORIUM
					<br />
					TEKNIK INFORMATIKA DAN KOMPUTER
				</h2>
			</div>
		</div>
		<div class="tabs-menu">
			<b-tabs align="center">
				<b-tab
					v-for="(tab, idxTab) in tabs"
					:key="`tab-menu-${idxTab}`"
					:title="tab.tabTitle"
					lazy
					:active="activeTab == tab.tabTitle.toLowerCase()"
					@click="setActiveTab(tab.tabTitle.toLowerCase())"
				>
					<tab-menu-component :actionButton="openPopup" :tabMenu="tab" />
				</b-tab>
			</b-tabs>
		</div>

		<!-- START: POPUP ACTION -->
		<b-modal
			ref="modal-popup"
			id="modal-popup"
			centered
			hide-footer
			hide-header
			no-close-on-backdrop
			no-close-on-esc
		>
			<action-modal
				v-if="baseModalType === 'action'"
				:title="actionModal[activeTab]"
				:form="formModal"
				:closeModal="closePopup"
				:actionType="activeTab"
			/>

			<base-modal-alert
				v-if="baseModalType === 'alert'"
				:isProcess="isProcess"
				:isSuccess="isSuccess"
				:message="message"
				:closeAlert="closePopup"
			/>
		</b-modal>
		<!-- END: POPUP ACTION -->
	</div>
</template>

<script>
	// Components
	import TabMenuComponent from '@/components/Peminjaman/TabMenuComponent'
	import ActionModal from '@/components/Peminjaman/ActionModal'
	import BaseModalAlert from '@/components/BaseModal/BaseModalAlert'

	// Mixins
	import ModalMixins from '@/mixins/ModalMixins'

	export default {
		name: 'beranda-peminjaman',
		components: { TabMenuComponent, ActionModal, BaseModalAlert },
		mixins: [ModalMixins],
		data() {
			return {
				tabs: [
					{
						tabTitle: 'Peminjaman',
						contentTitle: 'ALUR PEMINJAMAN ALAT LABORATORIUM',
						textButton: 'Pinjam Alat',
						steps: [
							{
								title: 'Form Peminjaman Alat',
								desc:
									'Peminjam perlu mengisi Nomor Induk, Keperluan Peminjaman, Dosen Penanggung Jawab (untuk Mahasiswa), Ruangan Pemakaian',
								icon: 'form',
							},
							{
								title: 'Scan Barcode Alat',
								desc:
									'Setelah mengisi informasi peminjaman, scan barcode pada alat yang akan dipinjam, menggunakan opsi yang telah disediakan',
								icon: 'scanner',
							},
							{
								title: 'Ambil Alat',
								desc:
									'Jika proses peminjaman berhasil, peminjam dapat mengambil alat di Laboratorium Teknik Informatika dan Komputer',
								icon: 'smartphone',
							},
						],
					},
					{
						tabTitle: 'Pengembalian',
						contentTitle: 'ALUR PENGEMBALIAN ALAT LABORATORIUM',
						textButton: 'Kembalikan Alat',
						steps: [
							{
								title: 'Masukkan Nomor Induk ',
								desc:
									'Peminjam memasukkan Nomor Induk Mahasisaw untuk Mahasiswa dan Nomor Induk Pegawai untuk Staff / Dosen',
								icon: 'input-icon',
							},
							{
								title: 'Scan Barcode Alat',
								desc:
									'Sistem menampilkan alat yang dipinjam. Peminjam harus scan seluruh alat yang ingin dikembalikan',
								icon: 'scanner',
							},
							{
								title: 'Kembalikan  Alat',
								desc:
									'Jika proses pengembalian berhasil, peminjam dapat mengembalikan alat kepada staff` Laboratorium Teknik Informatika dan Komputer',
								icon: 'users',
							},
						],
					},
					{
						tabTitle: 'Cek Peminjaman',
						contentTitle: 'CEK PEMINJAMAN ALAT TERAKHIR',
						desc:
							'Silahkan masukkan Nomor Induk dari Peminjam (NIM untuk Mahasiswa dan NIP untuk Staff / Dosen) <br /> untuk mengetahui transaksi peminjaman alat terbaru',
						inputValue: '',
						textButton: 'Periksa Peminjaman',
					},
				],
				activeTab: 'peminjaman',
				actionModal: {
					peminjaman: 'Peminjaman Alat Laboratorium',
					pengembalian: 'Pengembalian Alat Laboratorium',
				},
				formModal: {
					label: 'Nomor Induk',
					type: 'text',
					placeholder: 'Nomor Induk',
					model: '',
				},
			}
		},
		mounted() {},
		methods: {
			// Tab Interaction
			setActiveTab(tabName) {
				this.activeTab = tabName
			},
		},
	}
</script>

<style lang="scss" scoped>
	.beranda-peminjaman {
		.header {
			.header-title {
				h2 {
					font-weight: 700;
					font-size: 32px;
				}
			}
		}
		.tabs-menu {
			margin-top: 80px;
			padding: 0;
		}
	}
	@media screen and (max-width: 992px) {
		.beranda-peminjaman {
			.header {
				.header-title {
					h2 {
						font-size: 24px;
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	.beranda-peminjaman {
		overflow-y: hidden;
		.nav-tabs {
			border-bottom: none;
			.nav-link {
				border: none;
				color: #696969;
				font-size: 20px;
				&.active {
					color: #101939;
					font-weight: 700;
					border-bottom: 2px solid;
					border-color: #101939;
				}
			}
		}

		.tab-content {
			margin-top: 40px;
			border: 1px solid #c5c5c5;
			border-radius: 8px;
			padding: 40px;
			min-height: 100%;
		}
	}

	@media screen and (max-width: 992px) {
		.beranda-peminjaman {
			.header {
				.header-title {
					h2 {
						font-size: 24px;
					}
				}
			}
			.tab-content {
				border: none;
				padding: 10px;
			}
		}
	}
</style>
