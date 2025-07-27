<script setup lang="ts">
import { achievements } from '@/core/achievements';
import { temp } from '@/core/temp-data';
import { VueLatex } from 'vatex';
</script>

<template>
    <div style="height: 20px;"></div>
    <div class="upgrade" style="height: 20px;">
        <div style="width: 400px;line-height: 20px;">你有&nbsp;饿饿饿啊&nbsp;成就点(饿饿饿啊%)</div>
    </div>
    <div class="upgrade" style="height: 30px;">
        <div style="width: 250px;line-height: 30px;">
            成就点使数值获取
            <div style="display: inline;font-weight: bold;color: #169500;">
                ×1
            </div>
            <br>
            公式：
            <br>
            <vue-latex expression="(x^2)^{\sin^2x+\cos^2x-\frac{e^{2i\pi+x}}{\exp(x)}}"></vue-latex>
        </div>
    </div>
    <div style="margin-top: 80px;">
        <div class="upgrade" style="height: auto;" v-for="row in Object.entries(achievements)">
            <div class="achievement_button" v-for="ach in Object.entries(row[1])"
            @click="temp.select_ach=[parseInt(row[0]), parseInt(ach[0])]">{{parseInt(row[0])+1}}-{{ parseInt(ach[0])+1 }}</div>
        </div>    
    </div>  
    <div class="upgrade" style="height: auto;margin-top: 30px;">
        <div class="autobuyer" id="achievementText" style="line-height: 24px;font-size: 16px;">
            <p><b>{{temp.select_ach[0]+1}}-{{temp.select_ach[1]+1}}&nbsp;{{ achievements[temp.select_ach[0]][temp.select_ach[1]].title }}</b></p>
            <p>{{ achievements[temp.select_ach[0]][temp.select_ach[1]].desc }}</p>
            <p>奖励：1成就点</p>
        </div>
    </div>
</template>