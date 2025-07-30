<script lang="ts" setup>
import { player } from '@/core/save';
import DilateButton from '../DilateButton.vue';
import { Logarithm } from '@/core/exponention/logarithm';
import { feature } from '@/core/global';
import { format } from '@/utils/format';
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
                对数膨胀内获得的最高数值{{format(Logarithm.logarithm.highest_dilate)}}会增加对 数值（^{{format(Logarithm.dilateEffect()[0])}}），指数能量(*{{format(Logarithm.dilateEffect()[1])}})的获取
            </p>
        </div>
    </div>
</template>