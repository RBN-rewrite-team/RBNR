<script lang="ts" setup>
import { POST_NONREC } from '@/core/post-nonrec';
import { formatTime, format } from '@/utils/format';
</script>

<template>
	<div class="main">
		<h1>Y序列维度引擎</h1>
		<div class="dims">
			<div class="y-seq-inner">
				<div class="progress">
					<div class="progress-inner"></div>
					<div
						style="
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
						"
					></div>
				</div>
			</div>
			<div class="dim-single">
				<span>第一Y序列维度</span>
				<span>每秒推演{{ format(POST_NONREC.Y_SEQ.dimensionEffect(0)) }}次</span>
				<div class="buy">购买</div>
			</div>
			<div class="dim-single">
				<span>第二Y序列维度</span>
				<span>每{{ format(POST_NONREC.Y_SEQ.dimensionInterval(1)) }}秒生产一次</span>
				<span>每次+{{ format(POST_NONREC.Y_SEQ.dimensionEffect(1)) }}第一Y序列维度</span>
				<div class="buy">购买</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.dims {
	background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
	width: 95%;
	margin: auto;
}
.dim-single {
	min-height: 60px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border: 5px;
	overflow: hidden;
}
.y-seq-inner {
	align-items: center;
	justify-content: center;
	position: relative;
}
.progress {
	height: 30px;
	position: relative;
}
.progress-inner {
	width: 50%;
	height: 100%;
	position: relative;
	background: linear-gradient(135deg, #1a6c5e, #1fb286, #ef2dfd);
}
</style>
