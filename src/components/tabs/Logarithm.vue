<script setup lang="ts">
import { Logarithm } from '@/core/exponention/logarithm';
import TDBuyable from '../TDBuyable.vue';
import { format, formatGain, formatTime } from '@/utils/format';
import { player } from '@/core/save';
import ObserveButton from '../ObserveButton.vue';

</script>

<template>
    <div class="main">
        <p style="color: grey; table-align: center">
            对数的发现，因其节省劳力而延长了天文学家的寿命。——拉普拉斯
        </p>
        <p>
            你有 <b style="color: rgb(127, 127, 255); font-size: 25px">
                {{ format(Logarithm.logarithm.observe_datas) }}
            </b> 观测数据，
        </p>
        <p>
            你有 <b style="color: rgb(127, 127, 255); font-size: 25px">
                {{ format(Logarithm.logarithm.calculate_datas) }}
            </b> 计算数据，
        </p>
        <div>
            <p v-for="astr in Object.entries(player.exponention.logarithm.astronomers)">
                天文学家 {{ astr[0] }}: 工作时长 {{ formatTime(astr[1].life) }} {{formatGain( Logarithm.logarithm.calculate_datas, Logarithm.astronomerProduce(Number(astr[0])), "计算数据") }}
            </p>
        </div>
        <table align="center">
            <tbody>
                <tr>
                    <TDBuyable bylid="lgr_emp" />
                    <TDBuyable bylid="lgr_impr" />
                </tr>
            </tbody>
        </table>
        <div align="center" style="margin-top: 100px;">
            <div @click="Logarithm.observe"><ObserveButton>观测</ObserveButton></div>
            <div @click="Logarithm.observeConvert"><ObserveButton  style="font-size: 15px">使用对数表进行计算</ObserveButton></div>
            
        </div>
    </div>
</template>