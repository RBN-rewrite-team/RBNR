<script setup lang="ts">
import { player } from '@/core/global';
import { format, formatWhole } from '../../../utils/format.ts';
import {
	clickWellOrder,
	energyToUNOCFSpeed,
	levelreq,
	levelup,
	leveldown,
	ltEffect,
	stepProceed,
	wellOrderGainPerClick,
} from '@/core/ordinal/well_ordering.ts';
import { component as cttc } from '../help/text-to-component-convert.tsx';

import PageSelect from './PageSelect.vue';
import { useI18n } from 'vue-i18n';
import type { IntClosedRange } from 'type-fest';

import Upgrades from '@/components/upg/Upgrades.tsx';
import Decimal from 'break_eternity.js';
import { useUpdate } from '@/lib/useUpdate.ts';
import type PrimaryButton from '@/components/ui/PrimaryButton.tsx';
function getCurrentSequenceName(): string {
	const selecting = player.numbertheory.well_ordering.selecting;
	if (selecting === 0) return $t('nt.wellorderness.select.0');
	if (selecting === 1) return $t('nt.wellorderness.select.1');
	if (selecting === 2) return $t('nt.wellorderness.select.2');
	if (selecting === 3 && player.milestones['sin_10']) return $t('nt.wellorderness.select.3');
	return '???';
}
const $t = useI18n().t;
function c() {
	return $t('nt.wellorderness.ded', {
		a: `<b style="color: #c98300; font-size: 30px">${formatWhole(player.numbertheory.well_ordering.energy)}</b>`,
		b: format(energyToUNOCFSpeed()),
	});
}
const lt = useUpdate(() => ltEffect());
</script>

<template>
	<h2>{{ $t('nt.wellorderness') }}</h2>
	<span v-html="c()"></span>
	<div>
		<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.selecting = Math.max(
					player.numbertheory.well_ordering.selecting - 1,
					0,
				) as IntClosedRange<0, 9>
			"
		>
			←</button
		>{{
			$t('nt.wellorderness.proving', {
				prove: getCurrentSequenceName(),
			})
		}}<button
			class="clickable_button"
			style="display: inline-block"
			@click="
				player.numbertheory.well_ordering.selecting = Math.min(
					player.numbertheory.well_ordering.selecting + 1,
					10,
				) as IntClosedRange<0, 10>
			"
		>
			→
		</button>
	</div>
	<div align="center">
		<div class="center_line" />
		<div>
			<button class="clickable_button" @click="clickWellOrder()">
				{{
					$t('nt.wellorderness.butt', {
						a: formatWhole(wellOrderGainPerClick()),
					})
				}}
			</button>
		</div>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 0" align="center">
		<Upgrades
			:upgids="[
				['bB6R11', 'bB6R12', 'bB6R13', 'bB6R14'],
				['bB6R15', 'bB6R21', 'uU6R21', 'uU6R22'],
				['uU6R11', 'uU6R12', 'uU6R13', 'uU6R14'],
				['uU6R15', 'uU6R16', 'uU6R17', 'uU6R18'],
			]"
		/>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 1" align="center">
		<cttc :text="$t('prssdefinition')" />
		<a
			href="https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E3%81%BF%E3%81%9A%E3%81%A9%E3%82%89/%E5%8E%9F%E5%A7%8B%E6%95%B0%E5%88%97%E3%81%AE%E5%81%9C%E6%AD%A2%E6%80%A7%E8%A8%BC%E6%98%8E"
			>https://googology.fandom.com/ja/wiki/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%82%B0:%E3%81%BF%E3%81%9A%E3%81%A9%E3%82%89<br />/%E5%8E%9F%E5%A7%8B%E6%95%B0%E5%88%97%E3%81%AE%E5%81%9C%E6%AD%A2%E6%80%A7%E8%A8%BC%E6%98%8E</a
		>
		<div class="center_line" />
		<PageSelect />
		<template v-if="player.numbertheory.well_ordering.pages[0] == 0">
			<div class="center_line" />
			<cttc :text="$t('prss2')" />

			<div class="center_line" />
			<p>{{ $t('nt.wellorderness.process.0') }}</p>
			<div>
				<button
					class="clickable_button"
					@click="stepProceed(1)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(1)"
				>
					{{ $t('nt.wellorderness.process.1') }}</button
				><template v-else>
					<cttc :text="$t('prss1')" />
					<p>{{ $t('nt.wellorderness.unlockedalemma') }}</p>
				</template>
			</div>
		</template>
		<div class="center_line" />
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 1 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(1)
			"
		>
			<div>
				<h3>
					{{ $t('nt.wellorderness.lemma', { a: 1 })
					}}<span v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(3)">{{
						$t('nt.wellorderness.notproved')
					}}</span>
				</h3>
				<cttc :text="$t('prss5')" />
				<div class="center_line" />
				<h2>{{ $t('nt.wellorderness.prove') }}</h2>
				1.
				<button
					class="clickable_button"
					@click="stepProceed(2)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(2)"
					style="display: inline-block"
				>
					{{ $t('nt.wellorderness.process.2') }}</button
				><template v-else>
					<cttc :text="$t('prss3')" /><br />
					<span style="color: green">{{
						$t('nt.wellorderness.effect.1')
					}}</span></template
				>

				<div class="center_line" />
				2.
				<button
					class="clickable_button"
					@click="stepProceed(3)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(3)"
					style="display: inline-block"
				>
					{{ $t('nt.wellorderness.process.3') }}</button
				><template v-else>
					<cttc :text="$t('prss4')" />

					<div class="center_line" />
					<span style="color: green">{{ $t('nt.wellorderness.effect.0') }}</span>
					<div class="center_line" />

					<button
						class="clickable_button"
						@click="stepProceed(4)"
						v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(4)"
						style="display: inline-block"
					>
						{{ $t('nt.wellorderness.process.4') }}
					</button>
				</template>
			</div>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 2 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(4)
			"
		>
			<cttc :text="$t('prss6')" />
			<button
				class="clickable_button"
				@click="stepProceed(5)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(5)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.5') }}
			</button>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 3 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(5)
			"
		>
			<h3>{{ $t('nt.wellorderness.lemma', { a: 2 }) }}</h3>
			<cttc :text="$t('prss7')" />
			<div class="center_line" />
			<h2>{{ $t('nt.wellorderness.prove') }}</h2>
			1.
			<button
				class="clickable_button"
				@click="stepProceed(6)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(6)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.6') }}</button
			><template v-else>
				<cttc :text="$t('prss8')" />
				<p style="color: green">{{ $t('nt.wellorderness.effect.2') }}</p>
			</template>
			<div class="center_line" />
			2.
			<button
				class="clickable_button"
				@click="stepProceed(7)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(7)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.7') }}</button
			><template v-else>
				<cttc :text="$t('prss9')" />

				<p style="color: green">{{ $t('nt.wellorderness.effect.3') }}</p>
			</template>
			<div class="center_line" />
			3.
			<button
				class="clickable_button"
				@click="stepProceed(8)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(8)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.8') }}</button
			><template v-else>
				<cttc :text="$t('prss10')" />
				<span style="color: green"> {{ $t('nt.wellorderness.effect.4') }}</span>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 4 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(8)
			"
		>
			<h3>{{ $t('nt.wellorderness.lemma', { a: 3 }) }}</h3>
			<button
				class="clickable_button"
				@click="stepProceed(9)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(9)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.9') }}
			</button>
			<template v-else> <cttc :text="$t('prss11')" /> </template>
			<div class="center-line"></div>
			<button
				class="clickable_button"
				@click="stepProceed(10)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(10)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.10') }}
			</button>
			<template v-else>
				<cttc :text="$t('prss12')" />
				<p style="color: green">{{ $t('nt.wellorderness.effect.5') }}</p>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 5 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(10)
			"
		>
			<h3>{{ $t('nt.wellorderness.lemma', { a: 4 }) }}</h3>
			<button
				class="clickable_button"
				@click="stepProceed(11)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(11)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.11') }}
			</button>
			<template v-else> <cttc :text="$t('prss13')" /> </template>
			<div class="center-line"></div>
			<button
				class="clickable_button"
				@click="stepProceed(12)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(12)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.12') }}
			</button>
			<template v-else>
				<cttc :text="$t('prss14')" />
				<p style="color: green">{{ $t('nt.wellorderness.effect.6') }}</p>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[0] == 6 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(12)
			"
		>
			<h3>{{ $t('nt.wellorderness.lemma', { a: 5 }) }}</h3>
			<button
				class="clickable_button"
				@click="stepProceed(13)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(13)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.13') }}
			</button>
			<template v-else> <cttc :text="$t('prss15')" /> </template>
			<div class="center-line"></div>
			<button
				class="clickable_button"
				@click="stepProceed(14)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(14)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.14') }}
			</button>
			<template v-else>
				<b> <cttc :text="$t('prss16')" /> </b><br />
				<p style="color: green">
					{{ $t('nt.wellorderness.effect.7') }}
				</p>
			</template>
		</template>
	</div>
	<div v-if="player.numbertheory.well_ordering.selecting === 2" align="center">
		<cttc :text="$t('bmsdefinition')" />
		<a href="https://arxiv.org/abs/2307.04606">https://arxiv.org/abs/2307.04606</a>
		<div class="center_line"></div>
		<PageSelect />
		<div class="center_line"></div>
		<template v-if="player.numbertheory.well_ordering.pages[1] == 0">
			<button
				class="clickable_button"
				@click="stepProceed(15)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(15)"
				style="display: inline-block"
			>
				{{ $t('nt.wellorderness.process.15') }}
			</button>
			<template v-else>
				<cttc :text="$t('bmswellorder1')" />
				<button
					class="clickable_button"
					@click="stepProceed(16)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(16)"
					style="display: inline-block"
				>
					{{ $t('nt.wellorderness.process.16') }}
				</button>
				<template v-else>
					<cttc :text="$t('bmswellorder1prove')" />
					<p style="color: green">{{ $t('nt.wellorderness.effect.8') }}</p>
					<button
						class="clickable_button"
						@click="stepProceed(17)"
						v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(17)"
					>
						{{
							$t('nt.wellorderness.process.17', {
								cost: player.retribution == 1 ? '1.000e2960' : '1.000e2975',
							})
						}}
					</button>
				</template>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 1 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(17)
			"
		>
			<cttc :text="$t('bmswellorder2')" />
			<button
				class="clickable_button"
				@click="stepProceed(18)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(18)"
			>
				{{ $t('nt.wellorderness.process.18') }}
			</button>
			<template v-else>
				<cttc :text="$t('bmswellorder2prove')" />
				<p style="color: green">
					{{ $t('nt.wellorderness.effect.9') }}
				</p>
				<button
					class="clickable_button"
					@click="stepProceed(19)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(19)"
				>
					{{ $t('nt.wellorderness.process.19') }}
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 2 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(19)
			"
		>
			<cttc :text="$t('bmswellorder3')" />
			<button
				class="clickable_button"
				@click="stepProceed(20)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(20)"
			>
				{{
					$t('nt.wellorderness.process.20', {
						cost: player.retribution == 1 ? '1.00e58,888' : '1.00e75,000',
					})
				}}
			</button>
			<template v-else>
				<cttc :text="$t('bmswellorder3prove')" />
				<p style="color: green"></p>
				<button
					class="clickable_button"
					@click="stepProceed(21)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(21)"
				>
					{{
						$t('nt.wellorderness.process.21', {
							cost: player.retribution == 1 ? '1.00e60,000' : '1.00e500,000',
						})
					}}
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 3 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(21)
			"
		>
			<cttc :text="$t('bmswellorder4')" />
			<button
				class="clickable_button"
				@click="stepProceed(22)"
				v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(22)"
			>
				{{
					$t('nt.wellorderness.process.22', {
						cost: player.retribution == 1 ? '1.00e88,000' : '1.0e1,000,000',
					})
				}}
			</button>
			<template v-else>
				<cttc :text="$t('bmswellorder4prove')" />
				<p style="color: green">{{ $t('nt.wellorderness.effect.11') }}</p>
				<button
					class="clickable_button"
					@click="stepProceed(23)"
					v-if="!player.numbertheory.well_ordering.steps_proceeded.includes(23)"
				>
					{{ $t('nt.wellorderness.process.23') }}
				</button>
			</template>
		</template>
		<template
			v-if="
				player.numbertheory.well_ordering.pages[1] == 4 &&
				player.numbertheory.well_ordering.steps_proceeded.includes(23)
			"
		>
			<cttc :text="$t('bmswellorder')" />
			<p style="color: green">
				{{
					$t('nt.wellorderness.effect.12', {
						effect: format(
							player.numbertheory.well_ordering.energy
								.log10()
								.sub(150000000)
								.div(500000000)
								.clampMin(0)
								.clampMax(1),
						),
					})
				}}
			</p>
		</template>
	</div>
	<div
		v-if="player.numbertheory.well_ordering.selecting === 3 && player.milestones['sin_10']"
		align="center"
	>
		<div v-if="player.milestones.sin_10">
			你已经证明了<b style="color: #c98300; font-size: 30px">{{
				format(player.numbertheory.well_ordering.lemmas)
			}}</b
			>个引理(CHE+{{ format(lt[0]) }}slog)，<b style="color: #c98300; font-size: 30px">{{
				formatWhole(player.numbertheory.well_ordering.theorems)
			}}</b
			>个定理(pending {{ format(player.numbertheory.well_ordering.theorems_th) }},引理效果×{{
				format(lt[1])
			}})。
			<br />
			你的引理等级为{{ formatWhole(player.numbertheory.well_ordering.lemma_level) }},
			定理等级为{{ formatWhole(player.numbertheory.well_ordering.theorem_level) }}。
		</div>
		<div>
			<button class="clickable_button" @click="() => levelup(0)" style="height: 72px">
				提升引理等级，需要{{ formatWhole(levelreq(0)) }}定理。<br />
				引理证明速度/4，但是效果×1.5。
			</button>
			<button class="clickable_button" @click="() => levelup(1)" style="height: 72px">
				提升定理等级，需要{{ formatWhole(levelreq(1)) }}定理。<br />
				重置之前的内容，但是定理效果^1.5。
			</button>
			<button class="clickable_button" @click="() => leveldown(0)">
				降低1引理等级，不返还被消耗的定理
			</button>
			<button
				class="clickable_button"
				@click="
					() =>
						(player.numbertheory.well_ordering.theoremProveStatus =
							!player.numbertheory.well_ordering.theoremProveStatus)
				"
			>
				{{
					$t('set.status', {
						label: '启用定理证明器',
						status: $t(
							player.numbertheory.well_ordering.theoremProveStatus
								? 'set.status.on'
								: 'set.status.off',
						),
					})
				}}
			</button>
		</div>
		<button class="clickable_button">证明Y序列良序性，需要F9.007e15推演能量(Coming Soon)</button>
		<Upgrades :upgids="[['uU6R31', 'uU6R32', 'uU6R33', 'uU6R34'], ['uU6R35', 'uU6R36', 'uU6R37', 'uU6R38'], ['uU6R39', 'uU6R310', 'uU6R311', 'uU6R312']]" />
	</div>
</template>
