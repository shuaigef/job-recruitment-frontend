<template>
    <!--发表话题-->
    <a-row style="margin: 20px 0">
        <a-col :span="14" :offset="5">
            <a-card
                :headStyle="{
                        fontSize: '32px'
                    }"
                :bodyStyle="{

                    }"
                title="发表话题"
            >
                <a-card
                    style="background-color: #f8f9fa"
                    @click="() => {createBlogVisible = true}"
                >
                    <a-card-meta>
                        <template #avatar>
                            <a-avatar :src="userInfo.avatarUrl"/>
                        </template>
                        <template #title>
                            点击发表话题
                        </template>
                    </a-card-meta>
                </a-card>

            </a-card>
        </a-col>
    </a-row>
    <!--发表话题弹窗-->
    <a-modal v-model:visible="createBlogVisible" title="知识星球" @ok="createBlog" ok-text="发布" cancel-text="取消">
        <a-input v-model:value="blogFormState.blogTitle" :bordered="false" show-count :maxlength="20" placeholder="请输入标题" />
        <a-divider />
        <span>请选择话题类型：</span>
        <a-select v-model:value="blogFormState.blogType" placeholder="请选择话题类型" style="width: 200px">
            <a-select-option value="经历">经历</a-select-option>
            <a-select-option value="职场动态">职场动态</a-select-option>
            <a-select-option value="企业职位">企业职位</a-select-option>
            <a-select-option value="企业">企业</a-select-option>
            <a-select-option value="资料">资料</a-select-option>
        </a-select>
        <a-divider />
        <a-textarea v-model:value="blogFormState.blogContent" :autosize="{ minRows: 10, maxRows: 10 }" :bordered="false" show-count :maxlength="1000" placeholder="请输入话题内容" />
    </a-modal>
    <!--搜索栏-->
    <a-row style="margin: 20px 0">
        <a-col :span="9" :offset="5">
            <a-radio-group @change="changeBlogTypeHandle" v-model:value="tabBlogType" button-style="solid" size="large">
                <a-space :size="10">
                    <a-radio-button value="全部">全部</a-radio-button>
                    <a-radio-button value="经历">经历</a-radio-button>
                    <a-radio-button value="职场动态">职场动态</a-radio-button>
                    <a-radio-button value="企业职位">企业职位</a-radio-button>
                    <a-radio-button value="企业">企业</a-radio-button>
                    <a-radio-button value="资料">资料</a-radio-button>
                </a-space>
            </a-radio-group>
        </a-col>
        <a-col :span="4" >
            <a-input-search
                v-model:value="searchTitle"
                placeholder="请输入标题"
                :size="'large'"
                style="width: 300px"
                @search="onSearch"
        /></a-col>
    </a-row>
    <!--话题展示-->
    <a-row style="margin: 20px 0">
        <a-col
            v-for="(blog, index) in blogList" :key="blog.id"
            :span="14"
            :offset="5"
            style="margin-bottom: 20px"
        >
            <a-card>
                <a-card-meta>
                    <template #title>
                        <a style="font-size: 24px" @click="openCurrentBlog(blog)">{{ blog.blogTitle }}</a>
                    </template>
                    <template #avatar>
                        <a-avatar :src="blog.userAvatar" :size="64" />
                    </template>
                    <template #description>
                        <span style="font-size: 18px">{{ blog.blogContent }}</span>
                    </template>
                </a-card-meta>
                <template #actions>
                    <span @click="collectHandle(blog.id, index)">
                        <a-space :size="10">
                            <heart-outlined v-if="!blog.isCollected" />
                            <heart-outlined v-if="blog.isCollected" :style="{ color: 'red' }" />
                            <span>
                                {{ blog.blogCollections }}
                            </span>
                        </a-space>
                    </span>
                    <span @click="likeHandle(blog.id, index)">
                        <a-space :size="10">
                            <like-outlined v-if="!blog.isLiked" />
                            <like-outlined v-if="blog.isLiked" :style="{ color: 'red' }"/>
                            <span>
                                {{ blog.blogLikes }}
                            </span>
                        </a-space>
                    </span>
                    <span @click="commentHandle(blog)">
                        <a-space :size="10">
                            <message-outlined />
                            <span>
                                {{ blog.blogComments }}
                            </span>
                        </a-space>
                    </span>
                </template>
            </a-card>
        </a-col>
        <!--评论区-->
        <a-modal style="width: 800px" v-model:visible="currentBlogVisible" @ok="createBlog" :closable="false" :footer="null">
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
                    <a
                        v-if="currentBlog.userId !== currentUserId"
                        @click="talkToBlogAuthor"
                        style="margin-right: 20px"
                    >
                        咨询
                    </a>
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
                            <template #author><span style="font-size: 16px">{{commentLevel1.userName}}</span></template>
                            <template #avatar >
                                <a-avatar :src="commentLevel1.userAvatar" alt="" />
                            </template>
                            <template #content>
                                <span>{{ commentLevel1.commentContent }}</span>
                            </template>
                            <template #datetime>
                                <a-tooltip title="">
                                    <span>{{ commentLevel1.createTime }}</span>
                                </a-tooltip>
                            </template>
                            <template #actions>
                                <span><a @click="reportComment(commentLevel1.commentId)">举报</a></span>
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
<!--                                <a-button
                                    v-if="addReplyVisible"
                                    style="width: 70px; height: 55px; margin: 10px 0 10px 10px; "
                                    type="primary"
                                    @click="addCommentLevel2(currentBlog.id)"
                                >
                                    <span >回复</span>
                                </a-button>-->
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
    </a-row>
</template>

<script setup>
import { HeartOutlined, LikeOutlined, MessageOutlined, LikeFilled, DislikeFilled, DislikeOutlined } from '@ant-design/icons-vue';
import {onMounted, ref, toRefs, watch} from "vue";
import {
    addCommentRequest,
    blogCollectRequest,
    blogLikeRequest,
    createBlogRequest, getBlogCommentLevel1Request, getBlogCommentLevel2Request,
    getUserInfoRequest, reportBlogCommentRequest, reportBlogRequest,
    searchBlogRequest
} from "../../api/user/index.js";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";
import {useRouter} from "vue-router";
import {addUserChatListRequest} from "../../api/user/talk.js";

const createBlogVisible = ref(false)
const currentBlogVisible = ref(false)
const createCommentVisible = ref(false)
const addReplyVisible = ref(false)
const currentBlog = ref({})
const tabBlogType = ref('全部');
const searchTitle = ref('');
const blogList = ref([])
const routeStore = useRouteStore()
const { currentUserRole, currentUserId } = storeToRefs(routeStore)
const onSearch = async searchValue => {
    console.log('use value', searchValue);
    await getBlogList()
};
// 用户信息
const userInfo = ref({})

const getBlogList = async () => {
    await searchBlogRequest({
        userId: currentUserId.value,
        blogType: tabBlogType.value === '全部'?'':tabBlogType.value,
        blogTitle: searchTitle.value
    }).then(res => {
        console.log('searchBlogRequest', res)
        blogList.value = res.data
    })
}
onMounted(async () => {
    // console.log('currentUserId.value', currentUserId.value)
    await getUserInfoRequest(currentUserId.value, currentUserRole.value)
        .then(res => {
            console.log('getUserInfoRequest', res)
            userInfo.value = res.data
        })
    await getBlogList()
})

const changeBlogTypeHandle = async (e) => {
    await getBlogList()

}

const blogFormState = ref({
    blogContent: '',
    blogTitle: '',
    blogType: ''
})

const createBlog = async (e) => {
    console.log(e);
    await createBlogRequest({
        userId: currentUserId.value,
        ...blogFormState.value
    })
        .then(res => {
            console.log('createBlogRequest', res)
        })
    createBlogVisible.value = false;
};

const router = useRouter()
// 私聊
const talkToBlogAuthor = async () => {
    await addUserChatListRequest(userInfo.value.id, currentBlog.value.userId)
        .then(res => {
            console.log('addUserChatListRequest', res)
        })
    await router.push('/user/userMessage')
}


// 举报文章
const report = async () => {
    await reportBlogRequest(currentBlog.value.id, currentUserId.value)
        .then(res => {
            console.log('举报', res)
            if (res.data === true){
                message.success('举报成功')
            }else {
                message.error('举报失败')
            }

        })
}

// 举报评论
const reportComment = async (commentId) => {
    await reportBlogCommentRequest(commentId)
        .then(res => {
            if (res.data){
                message.success('举报成功')
            } else {
                message.error('举报失败')
            }
        })
}

// 获取一级评论数据
const getBlogCommentLevel1 = async (blogId) => {
    await getBlogCommentLevel1Request(blogId)
        .then(res => {
            console.log('获取话题评论', res)
            currentBlogCommentLevel1.value = res.data
        })
}

// 发评论
const addCommentInfo = ref('')
const commentId = ref('')
const answerId = ref('')
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
const addCommentLevel2 = async (blogId) => {
    console.log('添加评论参数1 用户id', currentUserId.value)
    console.log('添加评论参数2 blogId', blogId)
    console.log('添加评论参数3 评论内容', addCommentInfo.value)
    console.log('添加评论参数4 commentId', commentId.value)
    console.log('添加评论参数5 answerId', answerId.value)
    await addCommentRequest({
        userId: currentUserId.value,
        blogId,
        blogCommentContent: addCommentInfo.value,
        // commentId: '3',
        // answerId: '1'
        commentId: commentId.value,
        answerId: answerId.value
    }).then(res => {
        console.log('发评论', res)
        addCommentInfo.value = ''
    })
}


// 展开
const openCommentLevel2 = async (commentLevel1Id) => {
    isShowCommentLevel2.value = true
    commentId.value = commentLevel1Id
    await getBlogCommentLevel2Request(commentLevel1Id)
        .then(res => {
            console.log('获取二级评论', res)
            currentBlogCommentLevel2.value = res.data
        })
}


// 打开当前话题详情
const openCurrentBlog = async (blog) => {
    currentBlogVisible.value = true
    addCommentInfo.value = ''
    createCommentVisible.value = false
    currentBlog.value = toRefs(blog)
    await getBlogCommentLevel1(blog.id)
}

// 收藏
const collectHandle = async (blogId, index) => {
    console.log('collectHandle 我点了')
    await blogCollectRequest(currentUserId.value, blogId)
        .then(res => {
            console.log('blogCollectRequest', res)
            blogList.value[index].isCollected = !blogList.value[index].isCollected
            if (blogList.value[index].isCollected){
                blogList.value[index].blogCollections++
            }else {
                blogList.value[index].blogCollections--
            }
        })
}
// 点赞
const likeHandle = async (blogId, index) => {
    console.log('likeHandle 我点了')
    await blogLikeRequest(currentUserId.value, blogId)
        .then(res => {
            console.log('blogCollectRequest', res)
            blogList.value[index].isLiked = !blogList.value[index].isLiked
            if (blogList.value[index].isLiked){
                blogList.value[index].blogLikes++
            }else {
                blogList.value[index].blogLikes--
            }
        })
}
// 评论
const commentHandle = async (blog) => {
    console.log('commentHandle 我点了', blog)
    addCommentInfo.value = ''
    createCommentVisible.value =false
    currentBlogVisible.value = true
    currentBlog.value = toRefs(blog)
    await getBlogCommentLevel1(blog.id)
}

// 当前话题弹窗
const isShowCommentLevel2 = ref(false)
const currentBlogCommentLevel1 = ref([])


const currentBlogCommentLevel2 = ref([])
// 对话题发表评论
// 发评论按钮
const createComment = () => {
    addCommentInfo.value = ''
    // addReplyVisible.value = false
    createCommentVisible.value = !createCommentVisible.value
}
// 回复一级评论
const replyCommentLevel1 = (commentLevel1Id) => {
    addCommentInfo.value = ''
    createCommentVisible.value = false
    addReplyVisible.value = true
    commentId.value = commentLevel1Id
}
// 回复二级评论
const replyCommentLevel2 = (commentLevel2Id) => {
    addCommentInfo.value = ''
    createCommentVisible.value = false
    addReplyVisible.value = true
    answerId.value = commentLevel2Id
}


</script>

<style scoped>

</style>
