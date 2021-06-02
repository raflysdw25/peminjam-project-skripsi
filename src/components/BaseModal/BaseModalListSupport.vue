<template>
	<div class="base-modal-struktural">
		<div class="header">
			<h3 class="header-title">{{ title }}</h3>
			<b-icon
				icon="x"
				style="width:40px; height: 24px; cursor: pointer"
				@click="closeModal"
			/>
		</div>
		<div class="add-data">
			<template v-if="!inputActive">
				<button
					class="smil-btn smil-bg-primary smil-btn-small"
					@click="addInput"
				>
					Tambah Data
				</button>
			</template>
			<template v-else>
				<div class="add-form">
					<input type="text" class="form-control mr-2" v-model="inputValue" />
					<button
						class="smil-btn smil-bg-primary smil-btn-small mr-2"
						:disabled="inputValue === ''"
					>
						Simpan
					</button>
					<b-icon
						icon="x-circle-fill"
						style="color: #dc3545; width: 18px; height: 18px; cursor: pointer"
						@click="closeInput"
					/>
				</div>
			</template>
		</div>
		<div class="table-section table-responsive-sm">
			<table class="table smil-table">
				<thead class="smil-thead">
					<th v-for="(head, idxHead) in headsTable" :key="`head-${idxHead}`">
						{{ head }}
					</th>
				</thead>
				<tbody class="smil-tbody">
					<tr v-if="listData.length === 0">
						<td colspan="3" class="text-center" style="padding:60px 0;">
							Tidak ada data yang dapat ditampilkan
						</td>
					</tr>
					<tr v-else>
						<td
							v-for="(list, idxList) in listTable"
							:key="`list-table-${idxList}`"
						>
							{{ list }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'base-modal-list-support',
		props: {
			title: {
				type: String,
				default: 'List Data Support',
			},
			closeModal: Function,
			supportType: {
				required: true,
				type: String,
				/* 
					Asal Pengadaan : asal,
					Program Studi: prodi, 
					Jabatan Lab: jabatan,
					Ruangan : ruangan,
				*/
			},
		},
		data() {
			return {
				inputActive: false,
				inputValue: '',
				listData: [],
			}
		},
		mounted() {
			this.getListData()
		},
		methods: {
			getListData() {},
			addInput() {
				this.inputActive = true
			},
			closeInput() {
				this.inputValue = ''
				this.inputActive = false
			},
		},
		computed: {
			attribute() {
				if (this.supportType == 'asal') {
					return { name: 'asal_pengadaan_name', header: 'Asal Pengadaan' }
				} else if (this.supportType == 'prodi') {
					return { name: 'prodi_name', header: 'Prodi' }
				} else if (this.supportType == 'jabatan') {
					return { name: 'jabatan_name', header: 'Jabatan' }
				} else if (this.supportType == 'ruangan') {
					return { name: 'ruangan_name', header: 'Ruangan' }
				}
			},
			headsTable() {
				return ['ID', `Nama ${this.attribute.header}`, '']
			},
			listTable() {
				let listTable = []
				this.listData.forEach((list, indexList) => {
					let rowTable = [list.id, list[this.attribute.name], '']

					listTable.push(rowTable)
				})

				return listTable
			},
			submitRequest() {
				let request = {}
				request[this.attribute.name] = this.inputValue
				return request
			},
		},
	}
</script>

<style lang="scss" scoped>
	.base-modal-struktural {
		.header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.header-title {
				font-size: 20px;
				margin-bottom: 0;
				font-weight: 700;
			}
		}

		.add-data {
			margin-top: 24px;
			.add-form {
				display: flex;
				align-items: center;
			}
		}

		.table-section {
			margin-top: 24px;
		}

		.form-control {
			width: 180px;
		}
	}
</style>
