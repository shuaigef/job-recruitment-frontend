<template>
    <a-col :span="16">
        <a-card title="简介"
                :headStyle="{
                            fontSize: '32px'
                        }"
                :bodyStyle="{

                        }"
        >
            <template #extra>
                <a-button type="primary">编辑</a-button>
            </template>
            <a-descriptions bordered :column="2">
                <a-descriptions-item label="头像">
                    <a-avatar :src="userInfo.avatarUrl" shape="square" :size="64"/>
                </a-descriptions-item>
                <a-descriptions-item label="姓名" :span="1">{{ userInfo.userName }}</a-descriptions-item>
                <a-descriptions-item label="性别" :span="1">{{ userInfo.gender }}</a-descriptions-item>
                <a-descriptions-item label="年龄" :span="1">{{ userInfo.age }}</a-descriptions-item>
                <a-descriptions-item label="手机号" :span="1">{{ userInfo.phone }}</a-descriptions-item>
                <a-descriptions-item label="邮箱" :span="1">{{ userInfo.userEmail }}</a-descriptions-item>
            </a-descriptions>
        </a-card>
    </a-col>
</template>

<script setup>
import {useRouteStore} from "../store/index.js";
import {storeToRefs} from "pinia";
import {onMounted, ref} from "vue";
import { getUserInfoRequest} from "../api/user/index.js";

const userInfo = ref({})

onMounted(async () => {
    await getUserInfoRequest(localStorage.getItem('userId'), localStorage.getItem('role'))
        .then(res => {
            console.log('getUserInfoRequest', res)
            userInfo.value = res.data

        })
})


</script>

<style scoped>

</style>
