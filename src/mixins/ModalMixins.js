export default {
	data() {
		return {
			baseModalType: '',
			isProcess: false,
			isSuccess: false,
			message: '',
			notes: [],
			countError: 0,
		}
	},
	methods: {
		openPopup(type = '') {
			this.baseModalType = type
			this.$refs['modal-popup'].show()
		},
		closePopup() {
			this.baseModalType = ''
			this.$refs['modal-popup'].hide()
		},
		showAlert(isProcess, isSuccess = false, message = '', notes = []) {
			this.isProcess = isProcess
			this.isSuccess = isSuccess
			this.message = message
			this.notes = notes
			this.openPopup('alert')
		},
		setEmptyNotes() {
			this.notes = []
			this.countError = 0
		},
	},
}
