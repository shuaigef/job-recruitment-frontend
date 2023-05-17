<template>
    <a-row :gutter="[32,24]">
        <a-col :span="18">
            <a-card
                    style="margin: 40px 0;"
                    title="岗位详情"
                    :headStyle="{
                fontSize: '40px'
            }"
                    :bodyStyle="{
                padding: '0'
            }"
            >
                <template #extra>
                    <a
                        style="font-size: 20px"
                        @click="sendResume"
                    >
                        投简历
                    </a>
                </template>

                <!--岗位信息-->
                <a-card
                    :bodyStyle="{
                        padding: '0'
                    }"
                >
                    <a-descriptions
                            bordered
                            :column="3"
                            layout="vertical"
                    >
                        <a-descriptions-item label="岗位名称" :span="2">{{ currentRecruitment.chiefName }}</a-descriptions-item>
                        <a-descriptions-item label="岗位薪资" :span="2">{{ currentRecruitment.chiefSalary }}</a-descriptions-item>
                        <a-descriptions-item label="工作时间" :span="2">{{ currentRecruitment.chiefTime }}</a-descriptions-item>
                        <a-descriptions-item label="招聘人数" :span="2">{{ currentRecruitment.chiefHc }}</a-descriptions-item>
                        <a-descriptions-item label="岗位描述" :span="3">{{ currentRecruitment.chiefDescription }}</a-descriptions-item>
                        <a-descriptions-item label="岗位要求" :span="3">{{ currentRecruitment.chiefCommand }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>

            </a-card>
        </a-col>
        <a-col :span="6">
            <!--企业信息-->
            <a-card style="margin: 40px 0;"
                title="企业信息"
                :headStyle="{
                    fontSize: '40px'
                }"
            >
                <template #extra>
                    <a style="font-size: 20px"
                       @click="talkWithCompany">沟通</a>
                </template>
                <a-card-meta :title="currentRecruitment.companyName" :description="currentRecruitment.companyMark">
                    <template #avatar>
                        <a-avatar :src="currentRecruitment.url" />
                    </template>
                    <template #description>
                        <a-tag>{{ currentRecruitment.companyIndustry }}</a-tag>
                        <a-tag>{{ currentRecruitment.companyScale }}</a-tag>
                        <a-tag>{{ currentRecruitment.companyAddress }}</a-tag>
                    </template>
                </a-card-meta>
            </a-card>
            <!--企业项目-->
            <a-card
                style="margin: 40px 0;"
                title=" 企业项目"
                :headStyle="{
                    fontSize: '40px'
                }"

            >
                <a-list item-layout="horizontal" :data-source="companyTaskDataList">
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta
                                    :description="item.taskContent"
                            >
                                <template #title>
                                    <span>{{ item.taskTitle }}</span>
                                </template>
                            </a-list-item-meta>
                        </a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-col>
    </a-row>

</template>

<script setup>

import {useIndexStore, useRouteStore, useTalkStore} from "../../store/index.js";
import {getCurrentRecruitmentRequest, getUserInfoRequest, sendResumeRequest} from "../../api/user/index.js";
import {onMounted, ref} from "vue";
import {searchCompanyTaskRequest} from "../../api/company/task.js";
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import {addUserChatListRequest} from "../../api/user/talk.js";

const indexStore = useIndexStore()
const { currentRecruitmentId, currentCompanyId } = storeToRefs(indexStore)
const routeStore = useRouteStore()
const { currentUserId, currentUserRole } = storeToRefs(routeStore)
const currentRecruitment = ref({})

const companyTaskDataList = ref([]);

const sendResume = async () => {
    await sendResumeRequest(currentUserId.value, currentCompanyId.value, currentRecruitment.value.id)
        .then(res => {
            console.log('投简历', res)
            if (res.data){
                message.success('投递成功!')
            } else {
                message.error('投递失败!')
            }
        })
}

const userInfo = ref({})

onMounted(async () => {
    await getCurrentRecruitmentRequest(currentRecruitmentId.value)
        .then(res => {
            console.log('getCurrentRecruitmentRequest', res)
            currentRecruitment.value = res.data
        })
    await searchCompanyTaskRequest({
        taskType: '全部',
        companyId: currentCompanyId.value
    }).then(res => {
        companyTaskDataList.value = res.data
    })
    await getUserInfoRequest(currentUserId.value, currentUserRole.value)
        .then(res => {
            console.log('getUserInfoRequest', res)
            userInfo.value = res.data
        })
})

const router = useRouter()

// 与企业沟通
const talkWithCompany = async () => {
    currentRecruitment.value.companyId
    await addUserChatListRequest(userInfo.value.id, currentRecruitment.value.companyId)
        .then(res => {
            console.log('addUserChatListRequest', res)
        })
    await router.push('/user/userMessage')
}



</script>

<style scoped>

</style>
