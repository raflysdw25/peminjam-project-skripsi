<template>
	<div class="add-alat-pinjam">
		<h4 class="modal-title">Tambah Alat Dipinjam</h4>
		<div class="form-content">
			<div class="form-group">
				<label class="form-label">
					{{ formAdd[addType].label }}
				</label>
				<template v-if="addType === 'long'">
					<b-form-input
						v-if="formAdd[addType].type === 'select'"
						list="input-list"
						id="input-with-list"
						v-model="formAdd[addType].model"
						:placeholder="formAdd[addType].placeholder"
						:disabled="formAdd[addType].disabled"
					></b-form-input>
					<b-form-datalist
						id="input-list"
						:options="formAdd[addType].options"
					></b-form-datalist>
				</template>
				<template v-if="addType === 'short'">
					<input
						:type="formAdd[addType].type"
						v-model="formAdd[addType].model"
						:placeholder="formAdd[addType].placeholder"
						class="form-control"
					/>
				</template>
				<p class="desc" v-if="formAdd[addType].desc !== ''">
					{{ formAdd[addType].desc }}
				</p>
			</div>
		</div>
		<div class="info-content">
			<h6>Informasi Alat</h6>
			<p class="empty-form" v-if="formAdd[addType].model === ''">
				Belum ada alat {{ addType === 'short' ? 'terdeteksi' : 'dipilih' }}
			</p>
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
				:disabled="formAdd[addType].model == ''"
			>
				Submit
			</button>
		</div>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'add-alat-pinjam',
		props: {
			addType: String,
			closeModal: Function,
		},
		mixins: [FormInputMixins],
		data() {
			return {
				formAdd: {
					long: {
						label: 'Alat Dipinjam',
						type: 'select',
						placeholder: 'Pilih alat yang akan dipinjam',
						model: '',
						options: [],
					},
					short: {
						label: 'Barcode Alat',
						type: 'text-barcode',
						placeholder: 'Barcode Alat',
						desc:
							'Arahkan kursor ke kolom input, lalu Gunakan barcode scanner yang tersedia untuk membaca barcode alat',
						model: '',
						options: [],
					},
				},
			}
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
		}

		.button-group {
			margin-top: 50px;
		}
	}
</style>
