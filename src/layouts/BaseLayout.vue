<template>
    <a-layout class="layout">
        <a-layout-header style="position: relative;" :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
            <img class="logo" src="../assets/logo.png" alt="" />

            <a-menu
                    v-model:selectedKeys="selectedKeys"
                    theme="dark"
                    mode="horizontal"
                    :style="{ lineHeight: '64px' }"
                    @click="toPage"
                    style="width: 600px; "
            >
                <a-menu-item v-if="routeStore.currentUserRole !== 'admin'" key="/index">首页</a-menu-item>
                <a-menu-item key="/user/community" v-if="currentUserRole === 'user'">
                    知识星球
                </a-menu-item>
                <a-menu-item key="/user/companyTaskCenter" v-if="currentUserRole === 'user'">
                    项目大厅
                </a-menu-item>
                <a-sub-menu key="/company" v-if="currentUserRole === 'company'">
                    <template #icon>
                        <setting-outlined />
                    </template>
                    <template #title>企业管理</template>
                    <a-menu-item-group title="用户管理">
                        <a-menu-item key="/company/recruitment">招聘管理</a-menu-item>
                        <a-menu-item key="/company/resume">简历管理</a-menu-item>
                        <a-menu-item key="/company/task">项目管理</a-menu-item>
                    </a-menu-item-group>
                </a-sub-menu>

                <a-sub-menu key="/root" v-if="routeStore.currentUserRole === 'admin'">
                    <template #icon>
                        <setting-outlined />
                    </template>
                    <template #title>管理员</template>
                    <a-menu-item-group title="管理中心">
                        <a-menu-item key="/root/center/studentCenter">学生管理</a-menu-item>
                        <a-menu-item key="/root/center/companyCenter">企业管理</a-menu-item>
                        <a-menu-item key="/root/center/noticeCenter">通告管理</a-menu-item>
                    </a-menu-item-group>
                    <a-menu-item-group title="审核管理">
                        <a-menu-item key="/root/check/recruitmentCheck">招聘信息审核</a-menu-item>
                        <a-menu-item key="/root/check/blogCheck">话题审核</a-menu-item>
                        <a-menu-item key="/root/check/commentCheck">评论审核</a-menu-item>
                    </a-menu-item-group>


                </a-sub-menu>
                <a-sub-menu
                    style=" position: absolute; right: 150px"
                    key="/user"
                >
                    <template #icon>
                        <a-avatar :size="48"
                                  :src="avatarUrl">
                        </a-avatar>
                    </template>
                    <div v-if="!isShow">
                        <a-menu-item @click="toLogin">登录</a-menu-item>
                    </div>
                    <div v-if="isShow">
                        <a-menu-item v-if="isShow !== 'admin'" @click="toDetail">个人详情</a-menu-item>
                        <a-menu-item v-if="isShow !== 'admin'" @click="toMessage">消息</a-menu-item>
                        <a-menu-item @click="toLogout">退出</a-menu-item>
                    </div>
                </a-sub-menu>
            </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px; background-color: #f3f3f4;" :style="{ padding: '0 50px', marginTop: '64px', marginBottom: '70px' }">
            <router-view/>
        </a-layout-content>
        <a-layout-footer style="text-align: center" :style="{ position: 'fixed', zIndex: 2, width: '100%', bottom: 0 }">
            学生就业管理系统 ©2023 Created by YJD
        </a-layout-footer>
    </a-layout>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
  import { SettingOutlined } from '@ant-design/icons-vue';
  import {useRouteStore} from "../store/index.js";
import { getUserInfoRequest} from "../api/user/index.js";
import {storeToRefs} from "pinia";
import loginOutlined from "@ant-design/icons-vue/lib/icons/LoginOutlined.js";

  const selectedKeys = ref(['/index'])

  const router = useRouter()
const routeStore = useRouteStore()
const { currentUserRole, currentUserId } = storeToRefs(routeStore)

const isShow = ref(localStorage.getItem('role'))
const avatarUrl = ref('')

onMounted(async () => {
    console.log(localStorage.getItem('userId'), localStorage.getItem('role'))
    await getUserInfoRequest(localStorage.getItem('userId'), localStorage.getItem('role'))
        .then(res => {
            console.log('getUserInfoRequest', res)
            if (localStorage.getItem('role') === 'user'){
                avatarUrl.value = res.data.avatarUrl
            } else if(localStorage.getItem('role') === 'company'){
                avatarUrl.value = res.data.companyAvatar
            }
        })

})



watch(() => router.currentRoute.value.path,async (newValue,oldValue) => {
    console.log('newValue',newValue);
    console.log('oldValue',oldValue);
    if (oldValue === '/login' && newValue === '/index') {
        await getUserInfoRequest(localStorage.getItem('userId'), localStorage.getItem('role'))
            .then(res => {
                console.log('getUserInfoRequest', res)
                if (localStorage.getItem('role') === 'user'){
                    avatarUrl.value = res.data.avatarUrl
                } else if(localStorage.getItem('role') === 'company'){
                    avatarUrl.value = res.data.companyAvatar
                }
            })
        isShow.value = localStorage.getItem('role')
    }
},{ immediate: true })


  const toPage = ({ key }) => {
      router.push({
          path: key
      })
  }

  const toLogin = () => {
      router.push('/login')
  }

const toLogout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    router.push('/index')
    router.go(0)
}


const toDetail = () => {
    if (localStorage.getItem('role') === 'user'){
        router.push('/user/userDetail')
    } else if (localStorage.getItem('role') === 'company'){
        router.push('/company/companyDetail')
    }
}

const toMessage = () => {
    if (localStorage.getItem('role') === 'user'){
        router.push('/user/userMessage')
    } else if (localStorage.getItem('role') === 'company'){
        router.push('/company/companyMessage')
    }
}




</script>

<style scoped>
.logo{
    height: 42px;
    float: left;
    margin-top: 12px;
    margin-right: 12px;
}
.userAvatar{
    float: right;
    margin-top: 12px;
    margin-right: 12px;
}

.site-layout-content {
    min-height: 280px;
    padding: 24px;
    background: #fff;
}
#components-layout-demo-top .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
}
.ant-row-rtl #components-layout-demo-top .logo {
    float: right;
    margin: 16px 0 16px 24px;
}

[data-theme='dark'] .site-layout-content {
    background: #141414;
}
</style>
