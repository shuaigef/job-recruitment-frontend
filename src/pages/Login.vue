<template>
    <a-tabs style="margin: 20px auto; width: 600px " v-model:activeKey="activeKey">
        <a-tab-pane key="login" tab="登录">
            <!--登录-->
            <a-form
                style="margin: 20px 0"
                :model="loginFormState"
                name="login"
                :label-col="{ span: 6 }"
                :wrapper-col="{ span: 12 }"
                @finish="login"
            >
                <a-form-item
                    label="账号"
                    name="userAccount"
                    :rules="[{ required: true, message: '请输入账号'}]"
                >
                    <a-input v-model:value="loginFormState.userAccount" />
                </a-form-item>

                <a-form-item
                    label="密码"
                    name="userPassword"
                    :rules="[{ required: true, message: '请输入密码' }]"
                >
                    <a-input-password v-model:value="loginFormState.userPassword" />
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 10, span: 10 }" >
                    <a-button type="primary" html-type="submit">登录</a-button>
                </a-form-item>
            </a-form>
        </a-tab-pane>
        <a-tab-pane key="register" tab="注册" force-render>
            <!--注册-->
            <a-form
                style="margin: 20px 0"
                :model="registerFormState"
                name="register"
                :label-col="{ span: 6,  }"
                :wrapper-col="{ span: 12 }"
                @finish="register"
            >
                <a-form-item
                    label="账号"
                    name="account"
                    :rules="[{ required: true, message: '请输入账号'}]"
                >
                    <a-input v-model:value="registerFormState.account" />
                </a-form-item>

                <a-form-item
                    label="密码"
                    name="password"
                    :rules="[{ required: true, message: '请输入密码' }]"
                >
                    <a-input-password v-model:value="registerFormState.password" />
                </a-form-item>
                <a-form-item
                    label="二次密码"
                    name="checkPassword"
                    :rules="[{ required: true, message: '请再次输入密码' }]"
                >
                    <a-input-password v-model:value="registerFormState.checkPassword" />
                </a-form-item>
                <a-form-item
                    label="角色选择"
                    name="role"
                    :rules="[{ required: true, message: '请选择角色' }]"
                >
                    <a-select
                        v-model:value="registerFormState.role"
                    >
                        <a-select-option value="user">用户</a-select-option>
                        <a-select-option value="company">企业</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item :wrapper-col="{ offset: 10, span: 10 }" >
                    <a-button type="primary" html-type="submit">注册</a-button>
                </a-form-item>
            </a-form>
        </a-tab-pane>
    </a-tabs>


</template>

<script setup>
import {reactive, ref} from "vue";
import { useRouter} from "vue-router";
import {loginRequest, registerCompanyRequest, registerUserRequest} from "../api/user/index.js";
import {useRouteStore} from "../store/index.js";

const router = useRouter()

const activeKey = ref('login')

const routeStore = useRouteStore()

const loginFormState = reactive({
    userAccount: '',
    userPassword: '',
});
const registerFormState = reactive({
    account: '',
    password: '',
    checkPassword: '',
    role: ''
});
const login = async values => {
    console.log('Success:', values);
    await loginRequest(values)
        .then(res => {
            console.log('login', res)
            localStorage.setItem('userId', res.data.id)
            localStorage.setItem('role', res.data.role)

            routeStore.currentUserRole = res.data.role
            routeStore.currentUserId = res.data.id
            if (res.data.role === 'user'){
                routeStore.currentUser = res
            } else if(res.data.role === 'company'){
                routeStore.currentCompany = res.data
            }else{
                routeStore.currentAdmin = res.data
            }
            if (routeStore.currentUserRole === 'admin'){
                router.push('/root/center/studentCenter')
            } else {
                router.push('/index')
            }
        })
};
const register = async values => {
    console.log('registerSuccess:', values);
    if (values.role === 'user') {
        await registerUserRequest({
            userAccount: values.account,
            userPassword: values.password,
            checkPassword: values.checkPassword
        })
        .then(res => {
            console.log('userRegister', res)
            routeStore.currentUser = res.data
            localStorage.setItem('userId', values.id)
            localStorage.setItem('role', 'user')
            router.push('/index')
        })
    } else if (values.role === 'company') {
        await registerCompanyRequest({
            companyAccount: values.account,
            companyPwd: values.password,
            companyCheckPwd: values.checkPassword
        })
        .then(res => {
            console.log('companyRegister', res)
            routeStore.currentCompany = res.data
            localStorage.setItem('userId', values.id)
            localStorage.setItem('role', 'company')
            router.push('/index')
        })
    }

};





</script>

<style scoped>

</style>
