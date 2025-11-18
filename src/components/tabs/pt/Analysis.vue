<script setup lang="ts">
import { player } from '@/core/global.ts';
import { Analysis, dayOfWeek, PTEffects, realPTreset } from '@/core/pt/index.ts';
import { format } from '@/utils/format';
import type { IntClosedRange } from 'type-fest';
import { useI18n } from 'vue-i18n';

function unlockedList(): string {
	let s = '';
	for (let i = 0; i < 7; i++) if (Analysis.analysisUnlocked(i)) s += Analysis.systems[i] + ' ';
	return s;
}

const Axioms = Object.freeze([
	[
		"(\\forall x)x' \\ne 0",
		"(\\forall x\\forall y)x' = y' \\rightarrow x = y",
		'(\\forall x)x + 0 = x',
		"(\\forall x\\forall y)x+y' = (x+y)'",
		'(\\forall x)x \\cdot 0 = 0',
		"(\\forall x\\forall y)x \\cdot y' = x\\cdot y+x",
		"p(0)\\rightarrow(\\forall x(p(x)\\rightarrow p(x'))\\rightarrow\\forall x(p(x)))\\text{ for any  formula }p\\text{ truthly}",
	],
	[
		'(∀A∀B)[(∀x)(x ∈ A ↔ x ∈ B) → A = B]',
		'(∃A)(∀x)(x ∉ A)',
		'(∀x∀y)(∃A)(∀z)[z ∈ A ↔ (z = x ∨ z = y)]',
		'(∀A)(∃U)(∀x)[x ∈ U ↔ (∃Y ∈ A)(x ∈ Y)]',
		'(∀A)[A ≠ \\varnothing → (∃x ∈ A)(∀y ∈ x)(y ∉ A)]',
		'\\text{for any }Δ_0\\text{ formula }φ(x),(∀A)(∃B)(∀x)[x ∈ B ↔ (x ∈ A ∧ φ(x))]',
		'\\text{for any }Δ_0\\text{ formula }φ(x,y),(∀A)[(∀x ∈ A)(∃y)φ(x, y) → (∃B)(∀x ∈ A)(∃y ∈ B)φ(x, y)]',
	],
	[
		'(\\forall x)\\neg(x<x)',
		'(∀x∀y∀z) (x < y ∧ y < z) → x < z',
		'(∀x∀y) x < y ∨ x = y ∨ y < x',
		'(∀x) 0 ≤ x',
		'(∀X∀Y) (∀z)(z ∈ X ↔ z ∈ Y) → X = Y',
		'\\text{for any }Σ_0^1\\text{ formula }φ(0),[φ(0) ∧ (∀x)(φ(x) → φ(S(x)))] → (∀x)φ(x)',
		'\\text{for any }Π_1\\text{ formula }ψ(n),(∃Y)(∀n)(n ∈ Y ↔ ψ(n))',
	],
	['\\text{for any }Π_2\\text{ Formula} ψ(n),(∃Z)(∀n)(n ∈ Z ↔ ψ(n))'],
	[
		'(∀X) [0 ∈ X ∧ (∀x)(x ∈ X → S(x) ∈ X)] → (∀x)(x ∈ X)',
		'(\\exists Z)(\\forall x)[x \\in Z \\leftrightarrow \\varphi(x)]',
	],
	[
		'\\forall X_n \\forall Y_n)[(\\forall z_{n-1})(z_{n-1} \\in X_n \\leftrightarrow z_{n-1} \\in Y_n) \\rightarrow X_n = Y_n]',
		'(∃Y_n)(∀x_{n-1})[x_{n-1} ∈ Y_n ↔ φ(x_{n-1})]',
		'(∀X_n)[0 ∈ X_n ∧ (∀x_0)(x_0 ∈ X_n → S(x_0) ∈ X_n) → (∀x_0)(x_0 ∈ X_n)]',
	],
	[
		'(∀A∀B)[(∀x)(x ∈ A ↔ x ∈ B) → A = B]',
		'(∃A)(∀x)(x ∉ A)',
		'(∀x∀y)(∃A)(∀z)[z ∈ A ↔ (z = x ∨ z = y)]',
		'(∀A)(∃U)(∀x)[x ∈ U ↔ (∃Y ∈ A)(x ∈ Y)]',
		'(∀A)(∃B)(∀x)[x ∈ B ↔ x ⊆ A]',
		'(∃A)[\\varnothing ∈ A ∧ (∀x ∈ A)(x ∪ {x} ∈ A)]',
		'(∀A)(∃B)(∀x)[x ∈ B ↔ (x ∈ A ∧ φ(x))]',
		'(∀A)[(∀x ∈ A)(∃!y)φ(x,y) → (∃B)(∀y)(y ∈ B ↔ (∃x ∈ A)φ(x,y))]',
		'(∀A)[A ≠ \\varnothing → (∃x ∈ A)(∀y ∈ x)(y ∉ A)]',
		'(∀A)[\\varnothing ∉ A → (∃f: A → ⋃A)(∀X ∈ A)(f(X) ∈ X)]',
	],
] as const);
const $t = useI18n().t;
function ptDesc() {
	return $t('pt.desc', {
		week: dayOfWeek()[1],
		sys: unlockedList(),
		rate: Analysis.analysisRate() * 100,
		cycle: Analysis.analysisCycle(),
	});
}
function resetEffect() {
	return $t('pt.effresettimes', {
		eff1: format(PTEffects.effectToPreCardinal()),
		eff2: format(PTEffects.effectToHydraEnergyLogSoftCap()),
		eff3: format(PTEffects.effectToSolutions()),
		eff4: format(PTEffects.effectToNonrecResetTimes()),
	});
}
</script>

<template>
	<br />
	<h3 class="pt_base" style="color: cyan; width: 50%; margin: auto" v-html="ptDesc()"></h3>
	<div class="pt_base" style="width: 50%; margin: auto" v-html="resetEffect()"></div>
	<div
		class="pt_base pt_reset"
		@click="realPTreset"
		style="width: 50%; margin: auto"
		:class="player.challenges[1][6].lt(1) ? '' : 'pt_resetable'"
	>
		<span class="pt_font">{{ $t('pt.reset') }}</span>
	</div>
	<div
		v-for="count in 7"
		align="center"
		:style="{ opacity: Analysis.analysisUnlocked(count - 1) ? 1 : 0.5 }"
	>
		<br />
		<div class="pt_base system" :style="{ height: count === 7 ? '256px' : '200px' }">
			<div style="position: absolute; opacity: 0.5" align="left">
				<div v-for="(expression, index) in Axioms[count - 1]">
					<vue-latex :expression />
				</div>
			</div>
			<h3 v-html="count + ': ' + Analysis.systems[count - 1]" />
			<br />

			{{
				$t('pt.analysisprogress', {
					x: player.pt.analysis[count - 1],
					attempt: player.pt.analysisFailed[count - 1],
				})
			}}<br />
			{{
				$t('pt.analysisprogresseff', {
					effect: Analysis.systemEffect[(count - 1) as IntClosedRange<0, 6>].desc(
						player.pt.analysis[count - 1],
						$t,
					),
				})
			}}<br />
		</div>
	</div>
</template>

<style scoped>
.pt_base {
	background-color: rgba(0, 255, 255, 0.5);
	border: 2px solid rgba(0, 255, 255, 0.75);
}
.system {
	height: 200px;
	width: calc(100% - 20px);
	border: 2px solid cyan;
	color: cyan;
}
.pt_reset {
	height: 100px;
	color: cyan;
	font-weight: bold;
	font-size: 16px;
	position: relative;
	background-color: rgba(0, 255, 255, 0.25);
}
.pt_font {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.pt_resetable {
	background: rgba(0, 255, 255, 0.5);
}
</style>
