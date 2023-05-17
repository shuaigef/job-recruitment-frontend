<template>
    <div style="width: 1000px; margin: 0 auto">
        <a-row style="margin: 40px 0" :gutter="[32,48]">
            <a-col :span="24">
                <a-card>
                    <a-card-meta>
                        <template #avatar>
                            <a-avatar :size="96" :src="userInfo.avatarUrl"/>
                        </template>
                        <template #title>
                            <span style="font-size: 32px">{{userInfo.userName}}</span>
                        </template>
                        <template #description>
                            <div>
                                <span style="margin-left: 10px">
                                    <a-tag color="blue">{{userInfo.gender}}</a-tag>
                                </span>
                                <span style="margin-left: 10px">
                                    <a-tag color="orange">{{userInfo.age}}</a-tag>
                                </span>
                            </div>
                            <div style="margin: 5px 10px">
                                <span >
                                <a-tag color="red">{{userInfo.userEmail}}</a-tag>
                                </span>
                            </div>
                        </template>
                    </a-card-meta>
                </a-card>
            </a-col>
            <!--导航菜单-->
            <a-col :span="8">
                <a-card title="个人中心"
                    :headStyle="{
                        fontSize: '32px'
                    }"
                    :bodyStyle="{
                        padding: '0',

                    }"
                >
                    <a-menu
                        key="center"
                        style="text-align: center; font-size: 20px"
                        @click="toPage"
                    >
                        <a-menu-item key="detail">个人详情页</a-menu-item>
                        <a-menu-item key="resume">我的简历</a-menu-item>
                        <a-menu-item key="collect">我的收藏</a-menu-item>
                        <a-menu-item key="blog">我的话题</a-menu-item>
                    </a-menu>
                </a-card>
            </a-col>
            <!--个人详情-->
            <a-col v-if="menuName === 'detail'" :span="16">
                <a-card title="简介"
                    :headStyle="{
                        fontSize: '32px'
                    }"
                    :bodyStyle="{

                    }"
                >
                    <template #extra>
                        <a-button type="primary" @click="()=>{detailVisible=true}">编辑</a-button>
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
                <a-modal v-model:visible="detailVisible" title="修改个人信息" :footer="null">
                    <a-form
                        :model="userInfoFormState"
                        name="修改个人信息"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 16 }"
                        @finish="updateUser"
                    >
                        <a-form-item
                            label="姓名"
                            name="userName"
                        >
                            <a-input v-model:value="userInfoFormState.userName" />
                        </a-form-item>
                        <a-form-item
                            label="原始密码"
                            name="oldPassword"
                        >
                            <a-input v-model:value="userInfoFormState.oldPassword" />
                        </a-form-item>
                        <a-form-item
                            label="新密码"
                            name="newPassword"
                        >
                            <a-input v-model:value="userInfoFormState.newPassword" />
                        </a-form-item>
                        <a-form-item
                            label="年龄"
                            name="age"
                        >
                            <a-input v-model:value="userInfoFormState.age" />
                        </a-form-item>
                        <a-form-item
                            label="性别"
                            name="gender"
                        >
                            <!--<a-switch v-model:checked="userInfoFormState.gender" checked-children="男" un-checked-children="女" />-->
                            <!--<a-input v-model:value="userInfoFormState.gender" />-->
                            <a-radio-group v-model:value="userInfoFormState.gender" button-style="solid">
                                <a-radio-button value="男">男</a-radio-button>
                                <a-radio-button value="女">女</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item
                            label="邮箱"
                            name="userEmail"
                        >
                            <a-input v-model:value="userInfoFormState.userEmail" />
                        </a-form-item>

                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button type="primary" html-type="submit">修改</a-button>
                        </a-form-item>
                    </a-form>
                </a-modal>
            </a-col>
            <!--个人简历-->
            <a-col v-if="menuName === 'resume'" :span="16">
                <a-card title="我的简历"
                        :headStyle="{
                        fontSize: '32px'
                    }"
                        :bodyStyle="{

                    }"
                >
                    <template #extra>
                        <a-button type="primary" @click="()=>{resumeVisible=true}">修改简历</a-button>
                    </template>
                    <a-descriptions bordered :column="2">
                        <a-descriptions-item label="姓名">{{ resumeInfo.userName }}</a-descriptions-item>
                        <a-descriptions-item label="性别">{{ resumeInfo.gender }}</a-descriptions-item>
                        <a-descriptions-item label="年龄">{{ resumeInfo.age }}</a-descriptions-item>
                        <a-descriptions-item label="毕业学校">{{ resumeInfo.graduateSchool }}</a-descriptions-item>
                        <a-descriptions-item label="毕业时间">{{ resumeInfo.graduateYear }}</a-descriptions-item>
                        <a-descriptions-item label="学位">{{ resumeInfo.academicDegree }}</a-descriptions-item>
                        <a-descriptions-item label="求职状态" :span="2">{{ resumeInfo.jobStatus }}</a-descriptions-item>
                        <a-descriptions-item label="个人介绍" :span="2">{{ resumeInfo.noteDescription }}</a-descriptions-item>
                        <a-descriptions-item label="教育经历" :span="2">{{ resumeInfo.noteEducation }}</a-descriptions-item>
                        <a-descriptions-item label="项目经历" :span="2">{{ resumeInfo.noteItem }}</a-descriptions-item>
                        <a-descriptions-item label="工作期望" :span="2">{{ resumeInfo.noteExpect }}</a-descriptions-item>
                        <a-descriptions-item label="工作经历" :span="2">{{ resumeInfo.noteWork }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>
                <a-modal v-model:visible="resumeVisible" title="修改个人信息" :footer="null">
                    <a-form
                        :model="resumeInfoFormState"
                        name="修改简历信息"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 16 }"
                        @finish="updateResume"
                    >
                        <a-form-item
                            label="毕业学校"
                            name="graduateSchool"
                        >
                            <a-input v-model:value="resumeInfoFormState.graduateSchool" />
                        </a-form-item>
                        <a-form-item
                            label="毕业时间"
                            name="graduateYear"
                        >
                            <a-date-picker v-model:value="resumeInfoFormState.graduateYear" format="YYYY" value-format="YYYY" picker="year" placeholder="请选择毕业年份" />
                        </a-form-item>
                        <a-form-item
                            label="学位"
                            name="academicDegree"
                        >
                            <a-select v-model:value="resumeInfoFormState.academicDegree" placeholder="请选择求职状态">
                                <a-select-option value="本科">本科</a-select-option>
                                <a-select-option value="硕士">硕士</a-select-option>
                                <a-select-option value="博士">博士</a-select-option>
                                <a-select-option value="大专">大专</a-select-option>
                                <a-select-option value="高中及以下">高中及以下</a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item
                            label="求职状态"
                            name="jobStatus"
                        >
                            <a-select v-model:value="resumeInfoFormState.jobStatus" placeholder="请选择求职状态">
                                <a-select-option value="离校随时到岗">离校随时到岗</a-select-option>
                                <a-select-option value="在校月内到岗">在校月内到岗</a-select-option>
                                <a-select-option value="在校考虑机会">在校考虑机会</a-select-option>
                                <a-select-option value="在校暂不考虑">在校暂不考虑</a-select-option>
                            </a-select>

                        </a-form-item>
                        <a-form-item
                            label="个人介绍"
                            name="noteDescription"
                        >
                            <a-textarea :auto-size='{minRows: 2}' v-model:value="resumeInfoFormState.noteDescription" />
                        </a-form-item>
                        <a-form-item
                            label="教育经历"
                            name="noteEducation"
                        >
                            <a-textarea :auto-size='{minRows: 2}' v-model:value="resumeInfoFormState.noteEducation" />
                        </a-form-item>
                        <a-form-item
                            label="项目经历"
                            name="noteItem"
                        >
                            <a-textarea :auto-size='{minRows: 2}' v-model:value="resumeInfoFormState.noteItem" />
                        </a-form-item>
                        <a-form-item
                            label="工作经历"
                            name="noteWork"
                        >
                            <a-textarea :auto-size='{minRows: 2}' v-model:value="resumeInfoFormState.noteWork" />
                        </a-form-item>
                        <a-form-item
                            label="工作期望"
                            name="noteExpect"
                        >
                            <a-textarea :auto-size='{minRows: 2}' v-model:value="resumeInfoFormState.noteExpect" />
                        </a-form-item>

                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button type="primary" html-type="submit">修改</a-button>
                        </a-form-item>
                    </a-form>
                </a-modal>
            </a-col>
            <!--我的收藏-->
            <a-col v-if="menuName === 'collect'" :span="16">
                <a-card title="我的收藏"
                    :headStyle="{
                        fontSize: '32px'
                    }"
                    :bodyStyle="{

                    }"
                >
                    <a-card
                        v-for="blog in collectBlogList" :key="blog.id"
                    >
                        <a-card-meta>
                            <template #avatar>
                                <a-avatar :src="blog.blogUserAvatar" :size="96" shape="square"/>
                            </template>
                            <template #title>
                                <a style="font-size: 20px" @click="openBlogModal(blog)">{{ blog.blogTitle }}</a>
                                <a-popconfirm style="position: relative;" @confirm="deleteCollectBlog(blog.id)" title="你确定要删除吗？" ok-text="确定" cancel-text="取消">
                                    <a style="right: 20px;top: 20px;position: absolute;" >删除</a>
                                </a-popconfirm>
                            </template>
                            <template #description>
                                {{ blog.blogContent.substring(0, 50) }}
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-card>
            </a-col>
            <!--我的话题-->
            <a-col v-if="menuName === 'blog'" :span="16">
                <a-card title="我的话题"
                        :headStyle="{
                        fontSize: '32px'
                    }"
                        :bodyStyle="{

                    }"
                >
                    <a-card
                        v-for="userBlog in userBlogList" :key="userBlog.id"
                    >
                        <a-card-meta>
                            <template #avatar>
                                <a-avatar :src="userBlog.blogUserAvatar" :size="96" shape="square"/>
                            </template>
                            <template #title>
                                <a style="font-size: 20px" @click="openBlogModal(userBlog)">{{ userBlog.blogTitle }}</a>
                                <a-popconfirm style="position: relative;" @confirm="deleteUserBlog(userBlog.id)" title="你确定要删除吗？" ok-text="确定" cancel-text="取消">
                                    <a style="right: 20px;top: 20px;position: absolute;" >删除</a>
                                </a-popconfirm>
                            </template>
                            <template #description>
                                {{ userBlog.blogContent.substring(0, 50) }}
                            </template>
                        </a-card-meta>
                    </a-card>
                </a-card>
            </a-col>
        </a-row>
        <!--话题详情弹窗-->
        <a-modal style="width: 800px" v-model:visible="blogModalVisible" :closable="false" :footer="null">
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
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {
    addCommentRequest,
    deleteUserBlogRequest, getBlogCommentLevel1Request,
    getResumeInfoRequest,
    getUserInfoRequest, listCollectBlogRequest, listUserBlogRequest,
    updateResumeInfoRequest,
    updateUserInfoRequest,
    reportBlogRequest, deleteCollectBlogRequest
} from "../../api/user/index.js";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";

const routeStore = useRouteStore()
const { currentUserId, currentUserRole } = storeToRefs(routeStore)

const userInfo = ref({})
const resumeInfo = ref({})
const collectBlogList = ref([])
const userBlogList = ref([])

const detailVisible = ref(false)
const resumeVisible = ref(false)



const userInfoFormState = ref({
    userName: '',
    gender: '',
    age: '',
    phone: '',
    userEmail: '',
    oldPassword: '',
    newPassword: ''
});
const resumeInfoFormState = ref({
    userName: '',
    gender: '',
    age: '',
    graduateSchool: '',
    graduateYear: '',
    academicDegree: '',
    jobStatus: '',
    noteDescription: '',
    noteEducation: '',
    noteItem: '',
    noteExpect: '',
    noteWork: ''

});
const updateUser = async values => {
    console.log('updateUserInfoRequest Success:', values);
    await updateUserInfoRequest({
        id: currentUserId.value,
        pwd: values.oldPassword,
        newPwd: values.newPassword,
        ...values
    })
        .then(res => {
            console.log('updateUserInfoRequest', res)
            detailVisible.value = false
        })
};

const updateResume = async  values => {
    console.log('updateResumeInfoRequest Success:', values);
    console.log('date', values.graduateYear)
    await updateResumeInfoRequest({
        id: currentUserId.value,
        noteId: resumeInfo.value.noteId,
        ...values
    })
        .then(res => {
            console.log('updateUserInfoRequest', res)
            resumeVisible.value = false
        })
}

// 删除用户收藏的话题
const deleteCollectBlog = async (blogId) => {
    console.log('blogId', blogId)
    await deleteCollectBlogRequest(blogId, currentUserId.value)
        .then(res => {
            console.log('删除用户收藏的话题', res)
            if (res.data) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    await listCollectBlogRequest(currentUserId.value)
        .then(res => {
            console.log('获取用户收藏数据', res)
            collectBlogList.value = res.data
        })
}
// 删除用户写的话题
const deleteUserBlog = async (blogId) => {
    console.log('blogId', blogId)
    await deleteUserBlogRequest(blogId)
        .then(res => {
            console.log('删除用户写的话题', res)
            if (res.data) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
}


onMounted(async () => {
    await getUserInfoRequest(currentUserId.value, currentUserRole.value)
        .then(res => {
            console.log('getUserInfoRequest', res)
            userInfo.value = res.data
            userInfoFormState.value = {
                ...res.data
            }
        })
    await getResumeInfoRequest(currentUserId.value)
        .then(res => {
            console.log('getResumeInfoRequest', res)
            resumeInfo.value = {
                ...res.data
            }
            resumeInfoFormState.value = {
                ...res.data
            }
        })
    await listCollectBlogRequest(currentUserId.value)
        .then(res => {
            console.log('获取用户收藏数据', res)
            collectBlogList.value = res.data
        })
    await listUserBlogRequest(currentUserId.value)
        .then(res => {
            console.log('获取用户写的话题', res)
            userBlogList.value = res.data
        })
})

const menuName = ref('detail')
const toPage = ({ key }) => {
    menuName.value = key
    console.log('menuName', menuName.value)
}

// 话题弹窗
const blogModalVisible = ref(false)
const currentBlog = ref({})
const currentBlogCommentLevel1 = ref([])
const createCommentVisible = ref(false)
const addCommentInfo = ref('')



// 获取一级评论数据
const getBlogCommentLevel1 = async (blogId) => {
    await getBlogCommentLevel1Request(blogId)
        .then(res => {
            console.log('获取话题评论', res)
            currentBlogCommentLevel1.value = res.data
        })
}

// 打开弹窗
const openBlogModal = async (blog) => {
    console.log('我收藏的话题', blog.id)
    if (blog.blogTitle === "话题已失效"){
        message.error('话题以失效')
        return
    }
    currentBlog.value = blog
    blogModalVisible.value = true
    await getBlogCommentLevel1(blog.id)
}

// 举报
const report = async () => {
    await reportBlogRequest(currentBlog.value.id)
        .then(res => {
            console.log('举报', res)
            if (res.data === true){
                message.success('举报成功')
            }else {
                message.error('举报失败')
            }

        })
}
// 发评论
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
// 发评论按钮
const createComment = () => {
    addCommentInfo.value = ''
    // addReplyVisible.value = false
    createCommentVisible.value = !createCommentVisible.value
}

</script>

<style scoped>

</style>
