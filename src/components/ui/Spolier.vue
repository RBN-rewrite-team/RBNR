<template>
	<span class="spolier">
		<slot></slot>
	</span>
</template>

<style lang="scss" scoped>
.spolier {
	background-color: var(--color);
	color: var(--color);
	&:active {
		background-color: var(--background-color);
	}
}
</style>
