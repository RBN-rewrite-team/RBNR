<script setup lang="ts">
</script>

<template>
    <button class="circle-button"><slot></slot></button>
</template>

<style scoped>
.circle-button {
    width: 100px;          /* 按钮宽度 */
    height: 100px;         /* 按钮高度，与宽度相同形成圆形 */
    border-radius: 50%;     /* 设置为50%创建圆形 */
    border: 3px solid rgb(60, 168, 9); /* 蓝色边框，3像素宽 */
    background-color: white; /* 白色背景 */
    cursor: pointer;       /* 鼠标悬停时显示手型指针 */
    display: flex;         /* 使用flex布局便于内容居中 */
    justify-content: center; /* 水平居中 */
    align-items: center;    /* 垂直居中 */
    font-size: 28px;       /* 文字大小 */
    color: rgb(60, 168, 9);           /* 文字颜色 */
    text-decoration: none; /* 去除链接下划线（如果是a标签） */
    outline: none;         /* 去除点击时的轮廓线 */
}
.dilate_activate {
    background-color: black;
    color: hsl(101, 90%, 65%);           /* 文字颜色 */
}
.circle-button:hover {
    background-color: #e0e0e0; /* 悬停时轻微改变背景色 */
    transform: scale(1.1);
}
.dilate_activate:hover {
    background-color: #202020; /* 悬停时轻微改变背景色 */
}
.circle-button:active {
    background-color: #c0c0c0; /* 点击时更深一点的背景色 */
    transform: scale(1.3);
}
.dilate_activate:active {
    background-color: hsl(0, 0%, 25%); /* 点击时更深一点的背景色 */
    transform: scale(1.3);
}
</style>