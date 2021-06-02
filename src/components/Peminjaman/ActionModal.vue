<template>
	<div class="action-modal">
		<h4 class="action-modal-title">
			{{ title }}
		</h4>
		<div class="form-group">
			<label for="action-input" class="form-label">
				{{ form.label }}
			</label>
			<input :type="form.type" v-model="form.model" class="form-control" />
		</div>
		<div class="button-group">
			<button class="smil-btn smil-bg-secondary mr-2" @click="closeModal">
				Batal
			</button>
			<button
				class="smil-btn smil-bg-primary"
				:disabled="!formFilled"
				@click="doPeminjaman()"
			>
				Lanjutkan
			</button>
		</div>
	</div>
</template>

<script>
	// Vuex
	import * as types from '@/store/types'
	export default {
		name: 'action-modal',
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
		methods: {
			async doPeminjaman() {
				// Call API to get data Peminjam
				// let peminjamData = {
				// 	nim: this.form.model,
				// 	nama: 'Muhammad Rafly Sadewa',
				// }
				let peminjamData = {
					nip: this.form.model,
					nama: 'Muhammad Rafly Sadewa',
				}

				// Save data peminjam into Vuex
				this.$store.dispatch(types.UPDATE_PEMINJAM, peminjamData)
				this.$router.push({
					name: 'ActionPeminjaman',
					params: { actionType: this.actionType },
				})
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
	}
</style>
