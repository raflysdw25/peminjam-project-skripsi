<template>
	<div class="lapor-kerusakan-alat">
		<div class="header">
			<h3 class="header-title">
				Lapor Kerusakan Alat
			</h3>
			<div class="button-group">
				<button
					class="smil-btn smil-bg-danger mr-3"
					@click="$router.push({ name: 'BerandaPeminjaman' })"
				>
					Batal
				</button>
				<button class="smil-btn smil-bg-primary" :disabled="!formFilled">
					Submit
				</button>
			</div>
		</div>
		<div class="form-content">
			<div
				class="smil-row"
				v-for="(form, idxForm) in formList"
				:key="`form-${idxForm}`"
			>
				<div class="col-lg-3 d-lg-block"></div>
				<div class="form-group col-lg-6 col-12">
					<label :for="`input-${idxForm}`" class="form-label">
						{{ form.label }}
					</label>
					<span style="color: #dc3545; font-size: 14px">
						*
					</span>
					<input
						:type="form.type"
						class="form-control"
						v-if="formInputType(form.type) === 'input'"
						:placeholder="form.placeholder"
						v-model="form.model"
					/>
					<textarea
						v-if="form.type === 'text-area'"
						class="form-control"
						cols="30"
						rows="10"
						:placeholder="form.placeholder"
						v-model="form.model"
					>
					</textarea>
					<p class="desc" v-if="form.description !== ''">
						{{ form.description }}
					</p>
				</div>
				<div class="col-lg-3 d-lg-block"></div>
			</div>
		</div>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'lapor-kerusakan-alat',
		mixins: [FormInputMixins],
		data() {
			return {
				formList: [
					{
						label: 'Nomor Induk',
						type: 'text',
						model: '',
						description: 'NIM unutk Mahasiswa dan NIP untuk Staff / Dosen',
						placeholder: 'Nomor Induk',
						isRequired: true,
					},
					{
						label: 'Barcode Alat',
						type: 'text',
						model: '',
						description:
							'Arahkan kursor ke kolom input, lalu Gunakan barcode scanner yang tersedia untuk membaca barcode alat',
						placeholder: 'Barcode Alat',
						isRequired: true,
					},
					{
						label: 'Kronologi Kerusakan',
						type: 'text-area',
						model: '',
						description: '',
						placeholder: 'Kronologi Kerusakan Alat',
						isRequired: true,
					},
				],
			}
		},
		computed: {
			submitRequest() {
				let form = this.formList
				return {
					nomor_induk: form[0].model,
					barcode_alat: form[1].model,
					kronologi: form[2].model,
				}
			},
			formFilled() {
				return (
					this.submitRequest.nomor_induk !== '' &&
					this.submitRequest.barcode_alat !== ''
				)
			},
		},
		beforeRouteLeave(to, from, next) {
			let confirm = window.confirm(
				'Apakah anda yakin akan meninggalkan halaman ini? Data yang telah dimasukkan tidak akan tersimpan'
			)
			if (confirm) {
				next()
			}
		},
	}
</script>

<style lang="scss" scoped>
	.lapor-kerusakan-alat {
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
		}
		.button-group {
			display: flex;
		}
	}
</style>
<style lang="scss">
	.lapor-kerusakan-alat {
		.col-lg-6,
		.col-12 {
			padding-left: 0;
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
