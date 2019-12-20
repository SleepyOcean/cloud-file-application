<template>
	<svg class="icon" aria-hidden="true">
		<use :xlink:href="'#' + name"></use>
	</svg>
</template>

<script>
export default {
	name: 'FileIcon',
	props: {
		name: {
			type: String,
			default: 'icon-file'
		}
	}
};
</script>

<style scoped>
	.icon {
		width: 1em; height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
		font-size: inherit;
	}
</style>
