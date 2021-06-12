import Vue from 'vue'
import VueRouter from 'vue-router'

// Layout
import LayoutPortalPeminjaman from '@/views/layout/LayoutPortalPeminjaman.vue'

// PEMINJAMAN

// Pages
import BerandaPeminjaman from '@/views/pages/peminjaman/BerandaPeminjaman.vue'
import LaporKerusakanAlat from '@/views/pages/peminjaman/LaporKerusakanAlat.vue'
import BuatAkunMahasiswa from '@/views/pages/peminjaman/BuatAkunMahasiswa.vue'
import ActionPeminjaman from '@/views/pages/peminjaman/ActionPeminjaman.vue'
import ActionPengembalian from '@/views/pages/peminjaman/ActionPengembalian.vue'

Vue.use(VueRouter)

const routes = [
	// App Route

	// Portal Peminjaman
	{
		path: '/',
		component: LayoutPortalPeminjaman,
		children: [
			// Beranda
			{
				path: '',
				name: 'BerandaPeminjaman',
				component: BerandaPeminjaman,
			},
			// Form Peminjaman & Pengembalian
			{
				path: '/peminjaman',
				name: 'ActionPeminjaman',
				component: ActionPeminjaman,
			},
			{
				path: '/pengembalian',
				name: 'ActionPengembalian',
				component: ActionPengembalian,
			},
			// Form Laporan Kerusakan
			{
				path: '/lapor-kerusakan',
				name: 'LaporKerusakanAlat',
				component: LaporKerusakanAlat,
			},
			// Form Buat Akun Mahasiswa
			{
				path: '/buat-akun',
				name: 'BuatAkunMahasiswa',
				component: BuatAkunMahasiswa,
			},
		],
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior(to, from, savedPosition) {
		return { x: 0, y: 0 }
	},
})

export default router
