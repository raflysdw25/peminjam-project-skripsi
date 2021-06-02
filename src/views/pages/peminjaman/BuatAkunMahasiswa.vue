<template>
	<div class="buat-akun-mahasiswa">
		<div class="header">
			<h3 class="header-title">
				Buat Akun Mahasiswa
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
			<div class="smil-row">
				<div
					class="form-group col-lg-6 col-12"
					v-for="(form, idxForm) in formList"
					:key="`form-${idxForm}`"
				>
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
					<template v-if="form.type === 'select'">
						<b-form-input
							:list="`input-list-${indexInput}`"
							id="input-with-list"
							v-model="form.model"
							:placeholder="form.placeholder"
						></b-form-input>
						<b-form-datalist
							:id="`input-list-${indexInput}`"
							:options="form.options"
						></b-form-datalist>
					</template>
					<p class="desc" v-if="form.description !== ''">
						{{ form.description }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'buat-akun-mahasiswa',
		mixins: [FormInputMixins],
		data() {
			return {
				formList: [
					{
						label: 'Nomor Induk Mahasiswa',
						type: 'text',
						model: '',
						description: 'Masukkan Nomor Induk Mahasiswa anda',
						placeholder: 'Nomor Induk Mahasiswa',
						isRequired: true,
					},
					{
						label: 'Nama Lengkap',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Nama Lengkap',
						isRequired: true,
					},
					{
						label: 'Email Mahasiswa',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Email Mahasiswa',
						isRequired: true,
					},
					{
						label: 'Nomor Telepon',
						type: 'tel',
						model: '',
						description: '',
						placeholder: 'Nomor Telepon',
						isRequired: true,
					},
					{
						label: 'Password',
						type: 'password',
						model: '',
						description: '',
						placeholder: 'Password',
						isRequired: true,
					},
					{
						label: 'Konfirmasi Password',
						type: 'password',
						model: '',
						description: '',
						placeholder: 'Konfirmasi Password',
						isRequired: true,
					},
					{
						label: 'Program Studi',
						type: 'select',
						model: '',
						description: '',
						placeholder: 'Program Studi',
						isRequired: true,
						options: [{ text: '', value: '' }],
					},
					{
						label: 'Tahun Diterima',
						type: 'text',
						model: '',
						description: '',
						placeholder: 'Tahun Diterima',
						isRequired: true,
					},
					{
						label: 'Alamat',
						type: 'text-area',
						model: '',
						description: '',
						placeholder: 'Alamat',
						isRequired: true,
					},
				],
			}
		},
		mounted() {
			this.getListProdi()
		},
		computed: {
			submitRequest() {
				let form = this.formList
				return {
					nim: form[0].model,
					nama: form[1].model,
					email: form[2].model,
					no_telp: form[3].model,
					password: form[4].model,
					prodi: parseInt(form[6].model.split(' - ')[0]),
					tahun: form[7].model,
					alamat: form[8].model,
				}
			},
			formFilled() {
				let sr = this.submitRequest
				return (
					sr.nim !== '' &&
					sr.nama !== '' &&
					sr.email !== '' &&
					sr.no_telp !== '' &&
					sr.password !== '' &&
					sr.prodi !== '' &&
					sr.tahun !== '' &&
					sr.alamat !== '' &&
					sr.password === this.formList[5].model
				)
			},
		},
		methods: {
			async getListProdi() {
				let list = [
					{
						id: 1,
						text: '1 - Teknik Multimedia dan Digital',
						value: '1 - Teknik Multimedia dan Digital',
					},
					{
						id: 2,
						text: '2 - Teknik Multimedia Jaringan',
						value: '2 - Teknik Multimedia Jaringan',
					},
					{
						id: 3,
						text: '3 - Teknik Informatika',
						value: '3 - Teknik Informatika',
					},
					{
						id: 4,
						text: '4 - Teknik Jaringan dan Komputer',
						value: '4 - Teknik Jaringan dan Komputer',
					},
				]
				// let list = ['TMD', 'TMJ', 'TI', 'TKJ']
				this.formList[6].options = list
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
	.buat-akun-mahasiswa {
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
	.buat-akun-mahasiswa {
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
				// font-size: 12px;s
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
		.form-control {
			font-size: 16px;
		}
	}
</style>
