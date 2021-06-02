export default {
	data() {
		return {
			baseModalType: '',
			isProcess: false,
			isSuccess: false,
			message: '',
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
		showAlert(isProcess, isSuccess = false, message = '') {
			this.isProcess = isProcess
			this.isSuccess = isSuccess
			this.message = message
			this.openPopup('alert')
		},
	},
}
