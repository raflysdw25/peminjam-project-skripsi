<template>
	<div class="base-modal-alert">
		<div class="process-section" v-if="isProcess">
			<b-spinner
				class="icon-class icon-size"
				variant="secondary"
				style=""
			></b-spinner>
			<p class="message">Mohon tunggu sesaat.... <br /></p>
			<p class="user-message">
				Permintaan anda sedang diproses
			</p>
		</div>
		<div class="result-section" v-else>
			<b-icon
				:icon="icon.name"
				:variant="icon.variant"
				class="icon-class icon-size"
			></b-icon>
			<p class="message">{{ titleMessage }} <br /></p>
			<p class="user-message">
				{{ message }}
			</p>
			<div
				class="note-message"
				:class="notes.length > 4 && 'scrollbar'"
				v-if="notes.length > 0"
			>
				<p class="notes-message" v-if="isSuccess">Dengan Catatan :</p>
				<ul>
					<li v-for="(note, idx) in notes" :key="`note-${idx}`">
						{{ note.title }} <br />
						<span class="errorMessage">
							{{ note.message }}
						</span>
					</li>
				</ul>
			</div>
			<button
				class="smil-btn smil-btn-small mx-auto mt-4 smil-bg-secondary"
				v-if="!isSuccess"
				@click="closeAlert"
			>
				Tutup
			</button>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'base-modal-alert',
		props: {
			isProcess: Boolean,
			isSuccess: Boolean,
			message: String,
			notes: {
				default() {
					return []
				},
				type: Array,
			},
			closeAlert: Function,
		},
		mounted() {
			if (this.isSuccess) {
				setTimeout(() => {
					this.closeAlert()
				}, 1500)
			}
		},
		watch: {
			isSuccess: {
				immediate: true,
				handler: function() {
					if (this.isSuccess) {
						setTimeout(() => {
							this.closeAlert()
						}, 1500)
					}
				},
			},
		},
		computed: {
			icon() {
				if (this.isSuccess) {
					return {
						name: 'check-circle-fill',
						variant: 'success',
					}
				} else {
					return {
						name: 'x-circle-fill',
						variant: 'danger',
					}
				}
			},
			titleMessage() {
				if (this.isSuccess) {
					return 'Proses Berhasil'
				} else {
					return 'Proses Gagal'
				}
			},
		},
	}
</script>

<style lang="scss">
	.base-modal-alert {
		display: flex;
		justify-content: center;
		padding: 51px 53px;
		box-sizing: border-box;
		.process-section,
		.result-section {
			display: flex;
			justify-content: center;
			flex-flow: column;
			.icon-class {
				margin-left: auto;
				margin-right: auto;
				border-width: 8px;
			}
			.icon-size {
				width: 6rem;
				height: 6rem;
			}
		}

		p {
			margin-bottom: 0;
			text-align: center;
			&.message {
				margin-top: 30px;
				margin-bottom: 0;
				color: #111;
				font-size: 20px;
				font-weight: 700;
			}
			&.user-message {
				margin-top: 10px;
			}
			&.notes-message {
				text-align: left;
				font-weight: 700;
				margin-bottom: 5px;
			}
		}

		.note-message {
			margin-top: 10px;
			&.scrollbar {
				overflow-y: scroll;
			}
			height: 240px;
			background: #f3f3f3;
			border: 1px solid #e1e1e1;
			text-align: left;

			padding: 20px 16px;
			ul {
				padding-inline-start: 0;
				list-style-type: none;
				li {
					font-size: 12px;
					margin-bottom: 8px;
					color: #464646;
				}
				.errorMessage {
					color: #e03120;
					font-size: 12px;
				}
			}
		}
	}
</style>
