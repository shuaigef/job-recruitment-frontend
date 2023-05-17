<template>
    <a-modal style="width: 800px" v-model:visible="props.visible" @keypress="()=>{props.visible.value = false}" :closable="false" :footer="null">
        <a-card
                :headStyle="{
                    fontSize: '32px',
                    textAlign: 'center'
                }"
                :bodyStyle="{
                    padding: '20px 0'
                }"
        >
            <template #extra>
                <a @click="report">举报</a>
            </template>
            <template #title>
                    <span>
                        {{ currentBlog.blogTitle }}
                    </span>
            </template>
            <a-card-meta style="margin: 0 10px">
                <template #title>
                    <span style="font-size: 24px">{{ currentBlog.userName }}</span>
                </template>
                <template #avatar>
                    <a-avatar :src="currentBlog.userAvatar" :size="64" />
                </template>
                <template #description>
                    <span style="font-size: 18px">{{ currentBlog.blogContent }}</span>
                </template>
            </a-card-meta>
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
                <div v-for="commentLevel1 in currentBlogCommentLevel1" :key="commentLevel1.commentId">
                    <a-comment>
                        <template #author>{{commentLevel1.userName}}</template>
                        <template #avatar>
                            <!--<a-avatar :src="CommentLevel1.userAvatar" alt="" />-->
                            <a-avatar :src="commentLevel1.userAvatar" alt="" />
                        </template>
                        <template #content>
                            {{ commentLevel1.commentContent }}
                        </template>
                        <template #datetime>
                            <a-tooltip title="">
                                <span>{{ commentLevel1.createTime }}</span>
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
                                    v-model:value="addCommentInfo"
                            ></a-textarea>
                            <a-button
                                    v-if="createCommentVisible"
                                    style="width: 70px; height: 55px; margin: 10px 0 10px 10px; "
                                    type="primary"
                                    @click="addCommentLevel1(currentBlog.id)"
                            >
                                <span >发布</span>
                            </a-button>

                        </template>
                    </a-card-meta>
                </a-card>

            </a-card>
        </a-card>

    </a-modal>
</template>

<script setup>
import {onMounted, ref } from "vue";

import {message} from "ant-design-vue";
import {
    addCommentRequest,
    getBlogCommentLevel1Request,
    reportBlogRequest
} from "../api/user/index.js";

const createCommentVisible = ref(false)
const currentBlog = ref({})
const props = defineProps(['visible', 'blogId'])

onMounted(async () => {
    await getBlogCommentLevel1Request(props.blogId)
        .then(res => {
            console.log('获取文章评论', res)
            currentBlogCommentLevel1.value = res.data
        })
})

// 举报
const report = async () => {
    await reportBlogRequest(currentBlog.value.id)
        .then(res => {
            console.log('举报', res)
            if (res.data){
                message.success('举报成功')
            }else {
                message.error('举报失败')
            }
        })
}

const currentBlogCommentLevel1 = ref([])

// 获取一级评论数据
const getBlogCommentLevel1 = async (blogId) => {
    await getBlogCommentLevel1Request(blogId)
        .then(res => {
            console.log('获取文章评论', res)
            currentBlogCommentLevel1.value = res.data
        })
}

// 发评论
const addCommentInfo = ref('')
const addCommentLevel1 = async (blogId) => {
    console.log('添加评论参数1 用户id', currentUserId.value)
    console.log('添加评论参数2 blogId', currentBlog.value.id)
    console.log('添加评论参数3 评论内容', addCommentInfo.value)
    await addCommentRequest({
        userId: currentUserId.value,
        blogId,
        blogCommentContent: addCommentInfo.value,
    }).then(res => {
        console.log('发评论', res)
        addCommentInfo.value = ''
    })
    await getBlogCommentLevel1(blogId)
}

</script>

<style scoped>

</style>
