<script lang="ts" setup>
import {
	calcMountain,
	findByIndex,
	findByCoord,
	type Mountain,
	type NodeMountain,
	type LeafMountain,
} from '../../../utils/y-seq';
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

const Y = reactive({
	Y: '1,6,30,155,575,1046,867',
	type: 'ω-Y',
}); // 后面会改

const getYDimensionsLim = (type: string) => {
	if (type === '1-Y') return 2;
	if (type === 'ω-Y') return Infinity;
	throw new TypeError('Unknown type');
};

const calculatedMountain = computed(() => calcMountain(Y.Y, getYDimensionsLim(Y.type)));
const mountain = ref<HTMLElement | null>(null);

const rowHeight = 32;
const columnWidth = 32;
const lineThickness = 1;
const numberSize = 10;
const gap = 3;

function draw() {
	if (!mountain.value) return;
	if (!calculatedMountain.value) return;

	const canvas = mountain.value as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');

	if (!ctx) return;

	const columnPosition: [number, number][] = [];
	const rowPosition: Record<string, number> = {};
	const calculatedMount = calculatedMountain.value as Mountain;

	let maxRowLabelWidth = columnWidth;
	const rowLabels: string[] = [];

	for (let cycles = 0; cycles < 2; cycles++) {
		let currentRow = 0;
		let renderingIndex = [0];
		let tempMountain: Mountain = calculatedMount;
		for (let i = 0; i < calculatedMount.dim - 1; i++) {
			renderingIndex.unshift((tempMountain as NodeMountain).arr.length - 1);
			tempMountain = (tempMountain as NodeMountain).arr[
				(tempMountain as NodeMountain).arr.length - 1
			];
		}
		renderingIndex.unshift(0);
		ctx.font = `400 ${numberSize}px "Computer Modern"`;
		while (true) {
			tempMountain = findByIndex(calculatedMount, renderingIndex.slice(1, -1).reverse())!;
			if (cycles === 1) {
				render1Dmountain(calculatedMount, tempMountain, rowPosition, columnPosition);
			} else {
				rowPosition['c' + tempMountain.coord.slice(1).join(',')] = currentRow;
				const rowLabel =
					tempMountain.coord.length < 1
						? '0'
						: tempMountain.coord.slice(1).reverse().join(',');
				rowLabels[currentRow] = rowLabel;
				const textWidth = ctx.measureText(rowLabel).width;
				maxRowLabelWidth = Math.max(maxRowLabelWidth, textWidth);
			}
			currentRow++;
			let d = 1;
			for (; d < calculatedMount.dim; d++) {
				renderingIndex[d]--;
				if (renderingIndex[d] < 0) continue;
				for (let e = d - 1; e >= 1; e--) {
					tempMountain = findByIndex(
						calculatedMount,
						renderingIndex.slice(e + 1, -1).reverse(),
					)! as NodeMountain;
					renderingIndex[e] = tempMountain.arr.length - 1;
				}
				if (d > 1) currentRow++;
				if (cycles === 1 && d > 1) {
					const lines = d - 1;
					ctx.strokeStyle = "#777"
					ctx.beginPath();
					for (let i = 0; i < lines; i++) {
						let y =
							currentRow * rowHeight -
							numberSize -
							gap +
							(rowHeight * (i + 1)) / (lines + 1) +
							numberSize * 2;
						ctx.moveTo(maxRowLabelWidth + gap * 2, y);
						ctx.lineTo(canvas.width - lineThickness / 2, y);
					}
					ctx.stroke();
					ctx.strokeStyle = getRootCssVariable("--color")
				}
				break;
			}

			if (d >= calculatedMount.dim) {
				if (cycles === 0) {
					let bottomRow = calculatedMount as NodeMountain;
					while (bottomRow.dim > 1)
						bottomRow = (bottomRow as NodeMountain).arr[0] as NodeMountain;

					let totalWidth = maxRowLabelWidth + gap * 2;
					for (let i = 0; i < bottomRow.arr.length; i++) {
						columnPosition.push([columnWidth, totalWidth]);
						totalWidth += columnWidth;
					}

					const totalHeight = (rowPosition['c'] + 1) * rowHeight + numberSize * 2;
					let dpr = devicePixelRatio ?? 1;
					if (visualViewport) dpr *= visualViewport.scale;

					canvas.style.width = totalWidth + 'px';
					canvas.style.height = totalHeight + 'px';
					canvas.width = totalWidth * dpr;
					canvas.height = totalHeight * dpr;

					ctx.fillStyle = getRootCssVariable('--background-color') ?? 'white';
					ctx.fillRect(0, 0, canvas.width, canvas.height);
					ctx.fillStyle = getRootCssVariable('--color') ?? 'black';
					ctx.strokeStyle = getRootCssVariable('--color') ?? 'black';
					ctx.lineWidth = lineThickness;
					ctx.textAlign = 'center';
					ctx.scale(dpr, dpr);
					ctx.lineJoin = 'round';
					ctx.lineCap = 'round';
				}
				break;
			}
		}
		if (cycles === 1) {
			ctx.fillStyle = '#777';
			ctx.font = `400 ${numberSize}px serif`;
			ctx.fillText('行标', numberSize + gap, rowHeight);
			ctx.fillStyle = getRootCssVariable('--color');
		}
	}
}

function render1Dmountain(
	mount: Mountain,
	tempMountain: Mountain,
	rowPosition: Record<string, number>,
	columnPosition: [number, number][],
) {
	if (!mountain.value) return;

	const canvas = mountain.value as HTMLCanvasElement;
	const ctx = canvas.getContext('2d');

	if (!ctx) return;

	const rowLabel =
		tempMountain.coord.length < 1 ? '0' : tempMountain.coord.slice(1).reverse().join(',');
	const rowLabelWidth = ctx.measureText(rowLabel).width;
	const rowLabelAreaWidth = rowLabelWidth + gap * 2;

	const rowID = rowPosition['c' + tempMountain.coord.slice(1).join(',')];

	ctx.fillStyle = '#777';
	ctx.textAlign = 'center';
	ctx.fillText(rowLabel, rowLabelAreaWidth / 2, (rowID + 1) * rowHeight - gap + numberSize * 2);
	ctx.fillStyle = getRootCssVariable('--color');

	ctx.beginPath();
	for (let k = 0; k < (tempMountain as NodeMountain).arr.length; k++) {
		const point = (tempMountain as NodeMountain).arr[k] as LeafMountain;
		ctx.fillText(
			String(point.value),
			columnPosition[point.position][1] + columnPosition[point.position][0] / 2,
			(rowID + 1) * rowHeight - gap + numberSize * 2,
		);
		if (point.leftLegCoord !== null) {
			ctx.moveTo(
				columnPosition[point.position][1] + columnPosition[point.position][0] / 2,
				(rowPosition['c' + point.rightLegCoord!.slice(1).join(',')] + 1) * rowHeight +
					numberSize -
					gap,
			);
			ctx.lineTo(
				columnPosition[point.position][1] + columnPosition[point.position][0] / 2,
				(rowID + 1) * rowHeight + numberSize * 2,
			);
			const parentPosition = (findByCoord(mount, point.leftLegCoord!) as LeafMountain)
				.position;
			ctx.lineTo(
				columnPosition[parentPosition][1] + columnPosition[parentPosition][0] / 2,
				(rowID + 2) * rowHeight + numberSize - gap,
			);
			ctx.lineTo(
				columnPosition[parentPosition][1] + columnPosition[parentPosition][0] / 2,
				(rowPosition['c' + point.leftLegCoord!.slice(1).join(',')] + 1) * rowHeight +
					numberSize -
					gap,
			);
		}
	}
	ctx.stroke();
}

function getRootCssVariable(variableName: string): string {
	return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
}

watch(calculatedMountain, draw);

onMounted(() => {
	nextTick(draw);
});

let interval = setInterval(draw, 40);
onUnmounted(() => clearInterval(interval));
</script>

<template>
	<canvas ref="mountain" />
</template>
