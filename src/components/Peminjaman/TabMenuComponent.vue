<template>
	<div class="tab-menu-component">
		<div class="header-tab">
			<div class="header-title text-center">
				<h3>
					{{ tabMenu.contentTitle }}
				</h3>
			</div>
			<div
				class="header-desc text-center"
				v-if="tabMenu.desc"
				v-html="tabMenu.desc"
			></div>
		</div>
		<div class="steps-section" v-if="tabMenu.steps">
			<div class="smil-row">
				<div
					class="steps-box col-lg-3 col-12"
					:class="idxStep !== tabMenu.steps.length - 1 ? `not-last` : ``"
					v-for="(step, idxStep) in tabMenu.steps"
					:key="`step-${idxStep}`"
				>
					<icon-component
						:iconName="step.icon"
						:size="154"
						colorIcon="#101939"
					/>
					<div class="step-title">
						<h6>
							{{ step.title }}
						</h6>
					</div>
					<div class="step-desc">
						<p>
							{{ step.desc }}
						</p>
					</div>
				</div>
				<div class="button-group">
					<button
						class="smil-btn smil-btn-large smil-bg-primary"
						@click="action"
					>
						{{ tabMenu.textButton }}
					</button>
				</div>
			</div>
		</div>
		<div class="input-section" v-else>
			<div class="form-group">
				<input
					type="text"
					class="form-control"
					v-model="tabMenu.inputValue"
					placeholder="Nomor Induk Peminjaman"
				/>
				<div class="button-group">
					<button
						class="smil-btn smil-btn-large smil-bg-primary w-100"
						@click="checkFunction"
						:disabled="tabMenu.inputValue === ''"
					>
						{{ tabMenu.textButton }}
					</button>
				</div>
			</div>
			<div class="input-display">
				<h5>Informasi Peminjaman Terakhir</h5>
				<div class="list-info" v-if="listInfo.length > 0">
					<div
						class="info-group"
						:class="listInfo.length > 2 ? `scroll-info` : ``"
					>
						<p class="created-date">
							{{ this.formatDate(new Date(), 'DD MMM YYYY HH:mm') }} s.d
							{{
								this.formatDate(
									new Date('2021-05-21T10:20:30Z'),
									'DD MMM YYYY HH:mm '
								)
							}}
						</p>
						<div class="alat-list">
							<p>{{ `64MA2017` }} - {{ `Macbook Pro 2017` }}</p>
							<p>{{ `25POC2021` }} - {{ `POCO X3 PRO 2021` }}</p>
						</div>
						<p class="smil-status smil-bg-warning">
							Belum Kembali
						</p>
					</div>
				</div>
				<p class="empty-display" v-else>
					Tidak ada informasi yang dapat ditampilkan
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	// Component
	import IconComponent from '@/components/IconComponent'
	export default {
		name: 'tab-menu-component',
		components: { IconComponent },
		mixins: [FormInputMixins],
		props: {
			tabMenu: Object,
			actionButton: Function,
		},
		data() {
			return {
				listInfo: [],
			}
		},
		methods: {
			// API
			checkFunction() {
				alert(this.tabMenu.inputValue)
			},
			// Action
			action() {
				this.actionButton('action')
			},
		},
	}
</script>

<style lang="scss" scoped>
	.tab-menu-component {
		.header-tab {
			.header-title {
				h3 {
					font-size: 24px;
					color: #000;
					font-weight: 700;
				}
			}
			.header-desc {
				font-size: 16px;
				margin-top: 30px;
				margin-bottom: 50px;
			}
		}
		.steps-section {
			display: flex;
			justify-content: center;
			margin: 70px 0;
			.steps-box {
				.icon-component {
					margin-right: 0;
				}
				&.not-last {
					margin-right: 88px;
				}
				width: 275px;
				text-align: center;
				padding: 20px;

				display: flex;
				flex-direction: column;
				align-items: center;
				.step-title {
					margin-top: 18px;
					h6 {
						font-size: 18px;
						font-weight: 700;
					}
				}
				.step-desc {
					margin-top: 30px;
				}
			}
		}
		.input-section {
			padding: 0 102px;
			.input-display {
				margin-top: 50px;
				height: 200px;
				&.scroll-info {
					overflow-y: scroll;
				}
				h5 {
					font-size: 18px;
					font-weight: 700;
				}
				.empty-display {
					margin-top: 20px;
					color: #696969;
				}
				.list-info {
					padding-top: 30px;
					.info-group {
						display: flex;
						margin-bottom: 20px;
						.created-date {
							color: #696969;
							margin-right: 25px;
						}
						.alat-list {
							p {
								color: #000;
								font-weight: 500;
							}
						}
						p {
							&.smil-status {
								margin-bottom: 0;
								margin-left: 25px;
							}
						}
					}
				}
			}
		}
		.button-group {
			margin-top: 30px;
		}
	}
	@media screen and (max-width: 992px) {
		.tab-menu-component {
			.header-tab {
				.header-title {
					h3 {
						font-size: 18px;
						color: #000;
						font-weight: 700;
					}
				}
				.header-desc {
					font-size: 11px;
				}
			}
			.steps-section {
				.steps-box {
					&.not-last {
						margin-right: 0;
					}
				}
			}
			.input-section {
				padding: 0 30px;
				.input-display {
					h5 {
						font-size: 14px;
					}
					.list-info {
						.info-group {
							.created-date {
								margin-right: 10px;
							}

							p {
								&.smil-status {
									margin-left: 10px;
								}
							}
						}
					}
				}
			}
		}
	}
</style>

<style lang="scss">
	.tab-menu-component {
		.col-lg-4,
		.col-12 {
			padding-left: 0;
		}

		.smil-row {
			justify-content: center;
		}

		input {
			&.form-control {
				color: #000;
				background-color: #fff;
				border-color: #c5c5c5;
				border-radius: 5px;
				font-size: 14px;
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
	}
</style>
