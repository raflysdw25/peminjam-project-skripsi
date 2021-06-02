export default {
	data() {
		return {
			headsTable: [],
			listData: [],
			tableInfo: {
				listSize: 10,
				listTotal: 0,
				pageNo: 1,
				totalPage: 10,
			},
			filterData: {},
			tableCount: [5, 10, 15, 20, 25, 30],
		}
	},
	methods: {
		// Table Page Interaction
		nextPage() {
			if (this.tableInfo.pageNo !== this.tableInfo.totalPage) {
				this.tableInfo.pageNo += 1
			}
		},
		previousPage() {
			if (this.tableInfo.pageNo !== 1) {
				this.tableInfo.pageNo -= 1
			}
		},
		jumpPage(pageNo) {
			this.tableInfo.pageNo = pageNo
		},
		changeFilterValue(objFilter) {
			this.filterData[objFilter.model] = objFilter.value
		},
	},
	computed: {},
}
