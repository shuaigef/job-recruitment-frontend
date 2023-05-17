<template>
    <!--搜索栏-->
    <a-row style="margin: 50px 0" >
        <a-col :span="2" :offset="6">
            <a-select style="width: 100%" size="large" v-model:value="searchFormState.taskType">
                <a-select-option value="全部">全部</a-select-option>
                <a-select-option value="实践型">实践型</a-select-option>
                <a-select-option value="研究型">研究型</a-select-option>
            </a-select>
        </a-col>
        <a-col :span="10">
            <a-input-search
                    v-model:value="searchFormState.taskTitle"
                    placeholder="请输入标题"
                    enter-button="Search"
                    size="large"
                    @search="onSearch"
            />
        </a-col>
    </a-row>
    <!--项目展示-->
    <a-row :gutter="[24, 32]" style="margin: 0 100px">
        <template v-for="task in companyTaskDataList" :key="task.id">
            <a-col :span="6">
                <a-card
                    @click="openTaskModal(task)"
                >
                    <a-card-meta>
                        <template #avatar>
                            <a-avatar :size="64" :src="task.companyAvatar"/>
                        </template>
                        <template #title>
                            <span style="font-size: 20px">{{ task.taskTitle }}</span>
                        </template>
                        <template #description>
                            <span style="font-size: 16px">{{ task.companyName.substring(0, 50) }}</span>
                        </template>
                    </a-card-meta>
                </a-card>
            </a-col>
        </template>
    </a-row>
    <!--项目详情弹窗-->
    <a-modal style="width: 1000px" v-model:visible="currentTaskVisible" :footer="null" :closable="false" @ok="handleOk">
        <a-card
            :headStyle="{
                textAlign: 'center',
                fontSize: '32px'
            }"
            :bodyStyle="{
                padding: '0'
            }"
            :title="currentTaskInfo.taskTitle"
        >
            <template #extra>
                <a @click="() => {commitTaskVisible = true}">
                    提交项目
                </a>
            </template>
            <a-card-meta style="margin: 20px 10px">
                <template #avatar>
                    <a-avatar :src="currentTaskInfo.companyAvatar" :size="64" />
                </template>
                <template #title>
                    <span style="font-size: 20px">{{ currentTaskInfo.companyName }}</span>
                </template>
                <template #description>

                </template>
            </a-card-meta>
            <a-card
                :headStyle="{
                    fontSize: '20px'
                }"
                title="项目内容"
            >
                <div>{{ currentTaskInfo.taskContent }}</div>
            </a-card>
            <a-card
                :headStyle="{
                    fontSize: '20px'
                }"
                title="项目要求"
            >
                <div>{{ currentTaskInfo.taskCommand }}</div>
            </a-card>
        </a-card>
        <a-card
            :headStyle="{
                fontSize: '24px',
                textAlign: 'left'
            }"
            :bodyStyle="{
                    }"
            style="margin: 20px 0"
            title="评论区"
        >
            <template #extra>
                <a-button @click="createComment" type="primary">发评论</a-button>
            </template>
            <!--评论列表-->
            <div v-for="taskCommentLevel1 in currentTaskCommentLevel1" :key="taskCommentLevel1.commentId">
                <a-comment>
                    <template #author>{{taskCommentLevel1.userName}}</template>
                    <template #avatar>
                        <a-avatar :src="taskCommentLevel1.userAvatar" alt="" />
                    </template>
                    <template #content>
                        {{ taskCommentLevel1.userComment }}
                    </template>
                    <template #datetime>
                        <a-tooltip title="">
                            <span>{{ taskCommentLevel1.createTime }}</span>
                        </a-tooltip>
                    </template>
                </a-comment>
            </div>
            <a-card v-if="createCommentVisible" :bodyStyle="{ padding: '20px 0' }">
                <a-card-meta>
                    <template #avatar>
                        <a-avatar :src="userInfo.avatarUrl" shape="square" :size="64" />
                    </template>
                    <template #description>
                        <a-textarea
                            :autosize="{ minRows: 3, maxRows: 3 }"
                            :maxlength="100"
                            style="width: 70%"
                            v-model:value="addTaskCommentInfo"
                        ></a-textarea>
                        <a-button
                            v-if="createCommentVisible"
                            style="width: 70px; height: 55px; margin: 10px 0 10px 10px; "
                            type="primary"
                            @click="addTaskCommentLevel1(currentTaskInfo.id)"
                        >
                            <span >发布</span>
                        </a-button>

                    </template>
                </a-card-meta>
            </a-card>

        </a-card>
        <!--提交项目弹窗-->
        <a-modal v-model:visible="commitTaskVisible" :footer="null">
            <a-upload


                :before-upload="beforeUpload"
                :custom-request="customRequest"
            >
                <a-button>
                    <upload-outlined></upload-outlined>
                    上传项目
                </a-button>
            </a-upload>
        </a-modal>
    </a-modal>
    <!--分页-->
    <a-row>
        <a-col :span="12" :offset="16">
            <a-pagination
                :show-total="total => `总共 ${total} 条`"
                @change="onPageChange"
                v-model:current="current"
                :total="currentPageTaskList.length"
                show-less-items
                :page-size="pageSize"
                :showSizeChanger="false"
            />
        </a-col>
    </a-row>
</template>

<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';
import {onMounted, ref} from "vue";
import {searchCompanyTaskRequest} from "../../api/company/task.js";
import {addCommentRequest, getUserInfoRequest} from "../../api/user/index.js";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {
    addTaskCommentRequest,
    listTaskCommentRequest,
    uploadTaskFileRequest
} from "../../api/user/companyTaskCenter.js";
import {message} from "ant-design-vue";
import axios from "axios";

const companyTaskDataList = ref([])
const currentTaskVisible = ref(false)
const commitTaskVisible = ref(false)
const currentTaskInfo = ref({})
// 用户信息
const userInfo = ref({})
const routeStore = useRouteStore()
const { currentUserId, currentUserRole } = storeToRefs(routeStore)

const currentPageTaskList = ref([])

// 分页
const current = ref('1')
const pageSize = ref('15')
const onPageChange = () => {
    console.log('current', current.value)
    currentPageTaskList.value = []
    for (let i = (current.value - 1) * pageSize.value; i < current.value * pageSize.value; i++) {
        currentPageTaskList.value.push(companyTaskDataList.value[i])
    }
}

const searchFormState = ref({
    taskTitle: '',
    taskType: '全部'
})

// 搜索按钮
const onSearch = (e) => {
    console.log('搜索', e)
}

// 打开项目弹窗
const openTaskModal = async (task) => {
    currentTaskVisible.value = true
    currentTaskInfo.value = task
    await listTaskComment(task.id)
}

const currentTaskCommentLevel1 = ref([])
const addTaskCommentInfo = ref('')
const createCommentVisible = ref(false)

// 获取一级评论数据
const listTaskComment = async (taskId) => {
    console.log('获取文章评论 taskId', taskId)
    await listTaskCommentRequest(taskId)
        .then(res => {
            console.log('获取文章评论', res)
            currentTaskCommentLevel1.value = res.data
        })
}

// 发评论按钮
const createComment = () => {
    addTaskCommentInfo.value = ''
    createCommentVisible.value = !createCommentVisible.value
}

const addTaskCommentLevel1 = async (taskId) => {
    console.log('添加评论参数1 用户id', currentUserId.value)
    console.log('添加评论参数2 taskId', currentTaskInfo.value.id)
    console.log('添加评论参数3 评论内容', addTaskCommentInfo.value)
    await addTaskCommentRequest({
        userId: currentUserId.value,
        taskId,
        userComment: addTaskCommentInfo.value,
    }).then(res => {
        console.log('发评论', res)
        if (res.data){
            addTaskCommentInfo.value = ''
        } else {
            message.error('您还未提交项目，无法评论！')
        }
    })
    await listTaskComment(taskId)
}

onMounted(async () => {
    await getUserInfoRequest(currentUserId.value, currentUserRole.value)
        .then(res => {
            console.log('getUserInfoRequest', res)
            userInfo.value = res.data
        })
    await searchCompanyTaskRequest(searchFormState.value)
        .then(res => {
            console.log('搜索项目', res)
            companyTaskDataList.value = res.data
            console.log('companyTaskDataList', companyTaskDataList.value)
            for (let i = 0; i < pageSize.value; i++) {
                currentPageTaskList.value.push(companyTaskDataList.value[i])
            }
        })
})

// 上传
/*const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 文件!');
    }

    if (!isLt2M) {
        message.error('文件大小不能超过 2MB!');
    }

    return isJpgOrPng && isLt2M;
}*/
const customRequest = async (options) => {
    const formData = new FormData();
    formData.append('file', options.file);

    // TODO: 发送上传请求
    await uploadTaskFileRequest(formData)
        .then(response => {
            // 请求成功后，调用 options.onSuccess() 方法通知<a-upload>组件上传成功
            options.onSuccess(response.data, options.file);
        }).catch(error => {
            // 请求失败后，调用 options.onError() 方法通知<a-upload>组件上传失败
            options.onError(error);
        });
}


</script>

<style scoped>

</style>
