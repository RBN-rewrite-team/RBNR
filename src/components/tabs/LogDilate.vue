<script lang="ts" setup>
import { player } from '@/core/save';
import DilateButton from '../DilateButton.vue';
import { Logarithm } from '@/core/exponention/logarithm';
import { feature } from '@/core/global';
import { format } from '@/utils/format';
import Decimal from 'break_eternity.js';
import TRMilestone from '../TRMilestone.vue';
</script>

<template>
    <div class="main">
        <p style="color: grey; table-align: center">给我空间、时间及对数，我就可以创造一个宇宙。”——伽利略</p>
        <div align="center" style="margin-top: 5px;">
            <div @click="feature.EXPONENTION.toggleDilate()">
                <DilateButton style="font-size: 18px;" :class="{
                    dilate_activate: player.exponention.logarithm.in_dilate
                }">进入膨胀</DilateButton>
            </div>
            <p>
                进入对数膨胀后：
                <br>
                数值指数塔减{{format(Logarithm.dilateNerf())}}层。
                乘法能量指数塔减{{format(Logarithm.dilateNerf().div(2))}}层。
                <br>同时，大部分生活质量升级失效，部分加成减弱。
            </p>
            <p>
                在膨胀中购买升级和购买项会永久提升它们的效果。
            </p>
            <p>
                对数膨胀内获得的最高数值{{format(Logarithm.logarithm.highest_dilate)}}会增加对 数值（^{{format(Logarithm.dilateEffect()[0])}}），指数能量(*{{format(Logarithm.dilateEffect()[1])}})的获取。
            </p>
            <table>
                <tbody class="milestones">
                    <TRMilestone id='dil_1' />
                    <TRMilestone id='dil_2' />
                    <TRMilestone id='dil_3' />
                </tbody>
            </table>
        </div>
    </div>
</template>