<script setup lang="ts">
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
    <div class="upgrade" style="height: auto;margin-top: 80px;">
        <div class="achievement_button">1-1</div>
    </div>    
    <div class="upgrade" style="height: auto;margin-top: 30px;">
        <div class="autobuyer" id="achievementText" style="line-height: 24px;font-size: 16px;">
            <p><b>1-1&nbsp;起点</b></p>
            <p>购买一个后继器</p>
            <p>奖励：1成就点</p>
        </div>
    </div>
</template>