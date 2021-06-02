<template>
	<div class="base-modal-add">
		<h4 class="title-modal">
			{{ modalTitle }}
		</h4>
		<div class="form-section">
			<div
				class="form-section-group"
				v-for="(form, indexForm) in formList"
				:key="`form-modal-${form.id}-${indexForm}`"
			>
				<p class="form-label">
					{{ form.label }}
				</p>
				<template v-if="!form.canAddValue">
					<input
						:type="form.type"
						class="form-control"
						v-if="formInputType(form.type) === 'input'"
						:disabled="form.disabled"
						v-model="form.model"
					/>
					<select
						v-if="form.type === 'select'"
						class="custom-select"
						v-model="form.model"
					>
						<option
							v-for="(op, indexOp) in form.options"
							:key="`options-${indexOp}`"
							:value="op.value"
							:disabled="op.disabled"
						>
							{{ op.text }}
						</option>
					</select>
					<textarea
						class="form-control"
						v-if="form.type === 'text-area'"
						v-model="form.model"
						cols="30"
						rows="10"
					></textarea>
					<date-picker
						v-else-if="form.type === 'date'"
						format="DD-MM-YYYY"
						value-type="format"
						v-model="form.model"
						:disabled="form.disabled"
						@closed="setNullString(form.model)"
					>
						<template slot="icon-clear">
							<b-icon-x-circle-fill></b-icon-x-circle-fill>
						</template>
						<template slot="icon-calendar">
							<b-icon icon="calendar-month-fill"></b-icon>
						</template>
					</date-picker>
					<div class="form-radio-group" v-if="form.type === 'radio'">
						<b-form-radio
							:name="`radio-${form.label}`"
							v-model="form.model"
							:value="radio.value"
							v-for="(radio, indexStatus) in form.child"
							:key="`radio-add-${radio.text}-${indexStatus}`"
						>
							{{ radio.text }}
						</b-form-radio>
					</div>
				</template>
				<template v-else>
					<template v-if="formInputType(form.type) === 'input'">
						<div
							class="add-value-group"
							v-for="(child, indexChild) in form.model"
							:key="`child-input-${child.id}-${indexChild}`"
						>
							<input
								type="text"
								class="form-control form-child-add"
								v-model="child.value"
							/>
							<button
								class="smil-btn smil-btn-small smil-bg-danger"
								@click="deleteAddValue(indexChild, form.model)"
							>
								<b-icon icon="trash-fill"></b-icon>
							</button>
						</div>
					</template>
					<template v-if="form.type === 'select'">
						<div
							class="add-value-group"
							v-for="(child, indexChild) in form.model"
							:key="`child-select-${child.id}-${indexChild}`"
						>
							<select
								class="custom-select form-child-add"
								v-model="child.value"
							>
								<option
									v-for="(op, indexOp) in form.options"
									:key="`options-${indexOp}`"
									:value="op.value"
									:disabled="op.disabled"
								>
									{{ op.text }}
								</option>
							</select>
							<button
								class="smil-btn smil-btn-small smil-bg-danger"
								@click="deleteAddValue(indexChild, form.model)"
							>
								<b-icon icon="trash-fill"></b-icon>
							</button>
						</div>
					</template>
					<p class="add-input smil-text-primary" @click="addInput(form.model)">
						+ Tambah {{ form.label }}
					</p>
				</template>
			</div>
			<div class="button-group d-flex justify-content-end">
				<button
					class="smil-btn smil-btn-small smil-bg-secondary mr-2"
					@click="closeModal"
				>
					Cancel
				</button>
				<button
					class="smil-btn smil-btn-small smil-bg-primary"
					:disabled="!formFilled"
					@click="submit"
				>
					Submit
				</button>
			</div>
		</div>
	</div>
</template>

<script>
	// Mixins
	import FormInputMixins from '@/mixins/FormInputMixins'
	export default {
		name: 'base-modal-add',
		props: {
			modalTitle: {
				type: String,
				default: 'Tambah Data',
			},
			formList: {
				type: Array,
				required: false,
			},
			formFilled: {
				type: Boolean,
				default: true,
			},
			submitFunction: {
				type: Function,
				required: false,
			},
			closeFunction: {
				type: Function,
				required: true,
			},
		},
		mixins: [FormInputMixins],
		watch: {},
		methods: {
			addInput(arrayInput) {
				let object = {
					id: null,
					value: '',
					disabled: false,
				}

				object.id = arrayInput.length + 1
				arrayInput.push(object)
			},
			deleteAddValue(indexChild, arrayInput) {
				arrayInput.splice(indexChild, 1)
			},
			async submit() {
				await this.submitFunction()
			},
			closeModal() {
				this.formList.forEach((form) => {
					if (typeof form.model !== 'object') {
						form.model = ''
					} else {
						form.model = [
							{
								id: 1,
								value: '',
								disabled: false,
							},
						]
					}
				})
				this.closeFunction()
			},
			setNullString(form) {
				form.model = ''
			},
		},
	}
</script>

<style lang="scss" scoped>
	.base-modal-add {
		.title-modal {
			font-weight: bold;
		}
		.form-section {
			margin-top: 17px;
			.form-section-group {
				margin-top: 20px;
				.form-label {
					margin-bottom: 8px;
					font-size: 12px;
				}
				.form-child-add {
					margin-bottom: 10px;
					margin-right: 10px;
				}
				.form-radio-group {
					display: flex;
					.custom-radio {
						margin-right: 20px;
					}
				}

				.add-value-group {
					display: flex;
				}
			}
			.add-input {
				margin-top: 10px;
			}
		}
		.button-group {
			margin-top: 20px;
		}

		.smil-text-primary {
			&:hover {
				text-decoration: underline;
				font-weight: 700;
				cursor: pointer;
			}
		}
		.mx-datepicker {
			width: 100%;
		}
	}
</style>
<style lang="scss">
	.smil-btn {
		&.smil-btn-small {
			height: 33.5px;
		}
	}
</style>
