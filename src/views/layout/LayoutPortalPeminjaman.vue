<template>
	<div class="layout-portal-peminjaman">
		<!-- START: Navbar -->
		<menu-navigation :listMenu="menus" type="navbar" />
		<!-- END: Navbar -->

		<!-- START: CONTENT VIEW -->
		<div class="content-view">
			<!-- START: CONTENT VIEW -->
			<div class="content-peminjaman">
				<router-view />
			</div>
			<!-- END: CONTENT VIEW -->
		</div>

		<!-- START: FOOTER -->
		<footer-layout />
		<!-- END: FOOTER -->
		<!-- END: CONTENT VIEW -->
	</div>
</template>

<script>
	// Components
	import MenuNavigation from '@/components/MenuNavigation.vue'
	import FooterLayout from '@/components/FooterLayout.vue'

	export default {
		name: 'layout-portal-peminjaman',
		components: { MenuNavigation, FooterLayout },
		data() {
			return {
				menus: [
					{
						id: 1,
						text: 'Beranda',
						to: 'BerandaPeminjaman',
						icon: {
							iconName: 'scanner',
							size: 24,
							color: '#fff',
						},
					},
					{
						id: 2,
						text: 'Lapor Kerusakan Alat',
						to: 'LaporKerusakanAlat',
						icon: { iconName: 'fixing-tools', size: 24, color: '#fff' },
					},
					{
						id: 3,
						text: 'Buat Akun',
						icon: {
							iconName: 'users',
							size: 24,
							color: '#fff',
						},
						child: [{ id: 1, text: 'Mahasiswa', to: 'BuatAkunMahasiswa' }],
					},
				],
			}
		},
	}
</script>

<style lang="scss" scoped>
	.layout-portal-peminjaman {
		.content-view {
			display: flex;
			flex-direction: column;
			// grid-template-rows: auto 1fr auto;
			.content-peminjaman {
				overflow-y: auto !important;
				margin: 80px 0 45px;
				padding: 0 20px;
				height: 90%;
			}

			.footer-layout {
				padding-left: 10px;
			}
		}
	}

	@media screen and (max-width: 992px) {
		.content-view {
			.content-peminjaman {
				padding: 0 10px 0 10px !important;
			}
		}
	}
</style>
