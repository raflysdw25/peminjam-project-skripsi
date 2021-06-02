<template>
	<footer class="footer-layout" :class="newClass">
		<div class="copyright-section">
			Copyright {{ currentYear }} Laboratorium Jurusan Teknik Informatika dan
			Komputer
		</div>
		<div class="secondary-section">
			Dikembangkan oleh Muhammad Rafly Sadewa
		</div>
	</footer>
</template>

<script>
	export default {
		name: 'footer-layout',
		props: {
			newClass: String,
		},
		computed: {
			currentYear() {
				return new Date().getFullYear().toString()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.footer-layout {
		background-color: #fff;
		border-top: 1px solid #c5c5c5;
		padding: 21px 40px;
		width: 100%;

		.copyright-section {
			font-weight: 700;
		}

		.secondary-section {
			font-weight: 400;
			color: #c5c5c5;
			font-size: 12px;
		}
	}
	@media screen and (max-width: 992px) {
		.footer-layout {
			.copyright-section {
				font-size: 12px;
			}
			.secondary-section {
				font-size: 10px;
			}
		}
	}
</style>
