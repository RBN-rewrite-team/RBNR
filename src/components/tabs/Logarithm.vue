<script setup lang="ts">
import TDBuyable from '../TDBuyable.vue';

</script>

<template>
    <div class="main">
        <p style="color: grey; table-align: center">
            对数的发现，因其节省劳力而延长了天文学家的寿命。——拉普拉斯
        </p>
        <p>
            你有 <b style="color: rgb(127, 127, 255); font-size: 25px">
                NaN
            </b> 观测数据，
        </p>
        <p>
            你有 <b style="color: rgb(127, 127, 255); font-size: 25px">
                NaN
            </b> 计算数据，
        </p>
        <p>
            当前天文学家的寿命为 <b style="color: rgb(127, 127, 255); font-size: 25px">
                0 年
            </b>
        </p>
        <table align="center">
            <tbody>
                <tr>
                    <TDBuyable bylid="lgr_emp" />
                    <TDBuyable bylid="lgr_impr" />
                </tr>
            </tbody>
        </table>
    </div>
</template>