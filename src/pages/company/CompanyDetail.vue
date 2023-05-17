<template>
    <div style="width: 1000px; margin: 0 auto">
        <a-row style="margin: 40px 0" :gutter="[32,48]">
            <a-col :span="24">
                <a-card>
                    <a-card-meta>
                        <template #avatar>
                            <a-avatar :size="96" :src="companyInfo.companyAvatar"/>
                        </template>
                        <template #title>
                            {{companyInfo.companyName}}
                        </template>
                        <template #description>
                            <a-tag color="blue">{{companyInfo.companyIndustry}}</a-tag>
                            <br>
                            <a-tag color="orange">{{companyInfo.scale}}</a-tag>
                            <br>
                            <a-tag color="red">{{companyInfo.companyAccount}}</a-tag>
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
                            <a-avatar :src="companyInfo.companyAvatar" shape="square" :size="64"/>
                        </a-descriptions-item>
                        <a-descriptions-item label="公司名称" :span="1">{{ companyInfo.companyName }}</a-descriptions-item>
                        <a-descriptions-item label="公司账号" :span="1">{{ companyInfo.companyAccount }}</a-descriptions-item>
                        <a-descriptions-item label="公司地址" :span="1">{{ companyInfo.address }}</a-descriptions-item>
                        <a-descriptions-item label="公司行业" :span="1">{{ companyInfo.companyIndustry }}</a-descriptions-item>
                        <a-descriptions-item label="公司规模" :span="1">{{ companyInfo.scale }}</a-descriptions-item>
                        <a-descriptions-item label="手机号" :span="1">{{ companyInfo.companyPhone }}</a-descriptions-item>
                        <a-descriptions-item label="邮箱" :span="1">{{ companyInfo.companyEmail }}</a-descriptions-item>
                        <a-descriptions-item label="企业备注" :span="1">{{ companyInfo.mark }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>
                <a-modal v-model:visible="detailVisible" title="修改企业信息" :footer="null">
                    <a-form
                        :model="companyInfoFormState"
                        name="修改企业信息"
                        :label-col="{ span: 8 }"
                        :wrapper-col="{ span: 16 }"
                        @finish="updateCompany"
                    >
                        <a-form-item
                            label="企业名称"
                            name="companyName"
                        >
                            <a-input v-model:value="companyInfoFormState.companyName" />
                        </a-form-item>
                        <a-form-item
                            label="原始密码"
                            name="oldPassword"
                        >
                            <a-input v-model:value="companyInfoFormState.oldPassword" />
                        </a-form-item>
                        <a-form-item
                            label="新密码"
                            name="newPassword"
                        >
                            <a-input v-model:value="companyInfoFormState.newPassword" />
                        </a-form-item>
                        <a-form-item
                            label="行业"
                            name="companyIndustry"
                        >
                            <a-input v-model:value="companyInfoFormState.companyIndustry" />
                        </a-form-item>
                        <a-form-item
                            label="规模"
                            name="companyScale"
                        >
                            <a-radio-group v-model:value="companyInfoFormState.companyScale" button-style="solid">
                                <a-radio-button value="小">小</a-radio-button>
                                <a-radio-button value="中">中</a-radio-button>
                                <a-radio-button value="大">大</a-radio-button>
                            </a-radio-group>
                        </a-form-item>
                        <a-form-item
                            label="地址"
                            name="companyAddress"
                        >
                            <a-input v-model:value="companyInfoFormState.companyAddress" />
                        </a-form-item>
                        <a-form-item
                            label="邮箱"
                            name="companyEmail"
                        >
                            <a-input v-model:value="companyInfoFormState.companyEmail" />
                        </a-form-item>
                        <a-form-item
                            label="手机号"
                            name="companyPhone"
                        >
                            <a-input v-model:value="companyInfoFormState.companyPhone" />
                        </a-form-item>

                        <a-form-item
                            label="备注"
                            name="mark"
                        >
                            <a-textarea :auto-size="{ minRows:2, maxRows:4 }" v-model:value="companyInfoFormState.mark" />
                        </a-form-item>
                        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                            <a-button type="primary" html-type="submit">修改</a-button>
                        </a-form-item>
                    </a-form>
                </a-modal>
            </a-col>
        </a-row>
    </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {
    updateUserInfoRequest,
} from "../../api/user/index.js";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {getCompanyInfoRequest, updateCompanyInfoRequest} from "../../api/company/companyDeatil.js";
import {message} from "ant-design-vue";

const routeStore = useRouteStore()
const { currentUserId, currentUserRole } = storeToRefs(routeStore)

const companyInfo = ref({})
const detailVisible = ref(false)

const companyInfoFormState = ref({
    companyName: '',
    oldPassword: '',
    newPassword: '',
    companyIndustry: '',
    companyScale: '',
    companyAddress: '',
    companyEmail: '',
    companyPhone: '',
    mark: '',
});

const updateCompany = async values => {
    console.log('修改企业信息', values);
    await updateCompanyInfoRequest({
        id: currentUserId.value,
        ...values
    }).then(res => {
        console.log('修改企业信息', res)
        if (res) {
            message.success('修改成功')
            detailVisible.value = false
        } else {
            message.error('修改失败')
        }
    })
};


onMounted(async () => {
    await getCompanyInfoRequest(currentUserId.value)
        .then(res => {
            console.log('获取企业信息', res)
            companyInfo.value = res.data
            companyInfoFormState.value = {
                ...res.data,
                companyScale: res.data.scale,
                companyAddress: res.data.address
            }
        })
})

const menuName = ref('detail')
const toPage = ({ key }) => {
    menuName.value = key
    console.log('menuName', menuName.value)
}


</script>

<style scoped>

</style>
