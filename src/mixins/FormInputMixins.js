let moment = require('moment')
export default {
	data() {
		return {
			inputType: [
				'number',
				'text',
				'password',
				'email',
				'tel',
				'text-barcode',
				'barcode-input',
			],
			isCreate: false,
			loadingForm: false,
		}
	},
	methods: {
		formInputType(type) {
			if (this.inputType.includes(type)) {
				return 'input'
			} else {
				return type
			}
		},

		formConstraint(e, type) {
			if (type === 'tel') {
				let char = String.fromCharCode(e.keyCode) // Get the character
				if (/^[0-9]+$/.test(char)) return true
				// Match with regex
				else e.preventDefault() // If not match, don't add to input text
			} else if (type === 'barcode-input') {
				let timer = 0
				clearTimeout(timer)
				timer = setTimeout(() => {
					if (e.target.value.length <= 1) {
						e.target.value = ''
					}
				}, 66)
			} else {
				return true
			}
		},
		formPasteConstraint(e, type) {
			if (type === 'barcode-input') {
				e.preventDefault()
			} else {
				return true
			}
		},
		formatDate(date, format = 'YYYY-MM-DD') {
			return moment(date).format(format)
		},
		notBeforeToday(date) {
			return date < new Date().setHours(0, 0, 0, 0)
		},
		dateRange(start, end) {
			if (end !== null) {
				let startDate = moment(start.split('-'))
				let endDate = moment(end.split('-'))
				return endDate.diff(startDate, 'days')
			} else {
				return null
			}
		},
	},
}
