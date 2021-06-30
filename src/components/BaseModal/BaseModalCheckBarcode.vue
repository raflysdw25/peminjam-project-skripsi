<template>
	<div class="base-modal-check-barcode">
		<h4 class="modal-title">Verifikasi Barcode Alat</h4>
		<div class="form-content">
			<div class="form-group">
				<label for="" class="form-label">
					Barcode Alat
				</label>
				<input
					type="text"
					v-model="barcodeInput"
					class="form-control"
					:class="verified ? 'verified' : ''"
					@change="checkBarcode"
					@keypress="formConstraint($event, 'barcode-input')"
					:disabled="verified"
				/>
				<p class="desc" v-if="barcodeInput === '' && verified == null">
					Arahkan kursor ke kolom input, lalu Gunakan barcode scanner yang
					tersedia untuk membaca barcode alat
				</p>
				<p
					class="desc success"
					v-else-if="barcodeInput !== '' && this.verified"
				>
					Barcode Alat Sesuai
				</p>
				<p class="desc failed" v-else-if="!this.verified">
					Barcode Alat Tidak Sesuai
				</p>
			</div>
		</div>
		<div class="button-group">
			<button class="smil-btn smil-btn-small smil-bg-secondary" @click="close">
				Batal
			</button>
			<button
				class="smil-btn smil-btn-small smil-bg-primary ml-2"
				@click="verifyCheck"
				:disabled="!verified"
			>
				Verifikasi
			</button>
		</div>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'base-modal-check-barcode',
		props: {
			closeModal: Function,
			submitCheck: Function,
			barcodeToCheck: String,
		},
		mixins: [FormInputMixins],
		data() {
			return {
				barcodeInput: '',
				verified: null,
			}
		},
		methods: {
			close() {
				this.barcodeInput = ''
				this.closeModal()
			},
			verifyCheck() {
				this.submitCheck(this.verified)
				this.close()
			},
			checkBarcode() {
				if (this.barcodeInput.length > 2) {
					if (this.barcodeInput === this.barcodeToCheck) {
						this.verified = true
					} else {
						this.barcodeInput = ''
						this.verified = false
					}
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.base-modal-check-barcode {
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
					&.success {
						color: #28a745;
						font-weight: 700;
					}
					&.failed {
						color: #dc3545;
						font-weight: 700;
					}
				}
			}
		}
		.button-group {
			display: flex;
			justify-content: flex-end;
		}
	}
</style>
<style lang="scss">
	.base-modal-check-barcode {
		.form-control {
			&.verified {
				border-color: #28a745;
			}
		}
	}
</style>
