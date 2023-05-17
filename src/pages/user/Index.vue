<template>

    <!--通告弹窗-->
    <a-modal v-model:visible="noticeModalVisible" title="" :footer="null" :closable="false" @ok="handleOk">
        <a-card
            :headStyle="{
                fontSize: '32px',
                textAlign: 'center'
            }"
            :title="currentNotice.noticeTitle"
        >
            {{ currentNotice.noticeContent }}
        </a-card>
    </a-modal>
    <a-row>
        <a-col :span="6" :offset="1">
            <!--通告栏-->
            <a-card
                style="margin: 20px 0"
                :headStyle="{
                    fontSize: '32px'
                }"
                title="通告栏"
            >
                <a-list item-layout="horizontal" :data-source="noticeDataList"
                        style="height: 350px; overflow-y: auto;"
                >
                    <template #renderItem="{ item }">
                        <a-list-item>
                            <a-list-item-meta>
                                <template #title>
                                    <a @click="openNoticeModal(item)">{{ item.noticeTitle }}</a>
                                </template>
                            </a-list-item-meta>
                        </a-list-item>
                    </template>
                </a-list>
            </a-card>
        </a-col>
        <a-col :span="15" :offset="1">
            <a-row>
                <a-col>
                    <!--轮播图-->
                    <a-carousel autoplay>
                        <div>
                            <img alt="" src="https://ts1.cn.mm.bing.net/th/id/R-C.db6a7c65eb95d9dc319e2adf32f10569?rik=zLz1W2QDErUPbQ&riu=http%3a%2f%2fwww.siomm.com%2fueditor%2fphp%2fupload%2fimage%2f20181109%2f1541739142510227.jpg&ehk=9p1OdTiaUJNh7OEt%2f%2bxsRQhV5freO8weSXIk7MkOnZM%3d&risl=&pid=ImgRaw&r=0"/>
                        </div>
                        <div>
                            <img alt="" src="https://1.s91i.faiusr.com/4/AFsI4uYPEAQYACDv69bhBSiCruq3BTDABzicBA!800x800.png?v=1556100745578"/>
                        </div>
                        <div>
                            <img alt="" src="https://1.s91i.faiusr.com/4/AFsI4uYPEAQYACDw69bhBSjulrWKBTDABzicBA!800x800.png?v=1556100764632">
                        </div>
                    </a-carousel>
                </a-col>
            </a-row>
            <a-row>
                <a-col>
                    <!--搜索-->
                    <div style=" margin: 20px 70px 0 70px">
                        <a-form
                            ref="formRef"
                            name="advanced_search"
                            class="ant-advanced-search-form"
                            :model="formState"

                            @finish="search"
                        >
                            <a-row :gutter="24">
                                <a-col :span="8">
                                    <a-form-item
                                        label="岗位名称"
                                        name="chiefName"
                                    >
                                        <a-input v-model:value="formState.chiefName"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item
                                        label="企业地址"
                                        name="chiefAddress"
                                    >
                                        <a-input v-model:value="formState.chiefAddress"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item
                                        label="企业名称"
                                        name="chiefAddress"
                                    >
                                        <a-input v-model:value="formState.chiefAddress"/>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item
                                        label="最小薪资"
                                        name="chiefMinSalary"
                                    >
                                        <a-input-number v-model:value="formState.chiefMinSalary" :defaultValue="0" :min="0"></a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item
                                        label="最大薪资"
                                        name="chiefMaxSalary"
                                    >
                                        <a-input-number v-model:value="formState.chiefMaxSalary" :defaultValue="0" :min="0"></a-input-number>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="8">
                                    <a-form-item
                                        label="项目类型"
                                        name="companyTaskType"
                                    >
                                        <a-input v-model:value="formState.companyTaskType"/>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                            <a-row>
                                <a-col :span="24" style="text-align: right">
                                    <a-button type="primary" html-type="submit">搜索</a-button>
                                    <a-button style="margin: 0 8px" @click="() => formRef.resetFields()">清空</a-button>
                                </a-col>
                            </a-row>
                        </a-form>
                    </div>
                </a-col>
            </a-row>
        </a-col>
    </a-row>


    <!--招聘信息-->
    <div style=" padding: 40px 60px">
        <div>
            <a-row
                :gutter="[32,24]"
            >
                <div v-for="(recruitment) in currentPageRecruitmentList" :key="recruitment.id">
                    <a-col :span="6">
                        <a-card hoverable style="width: 350px"
                            @click="clickCard(recruitment.id, recruitment.companyId)"
                        >
                            <template #extra>
                                <span style="font-size: 28px">{{ recruitment.chiefSalary }}</span>
                            </template>
                            <template #title>
                                <span style="font-size: 30px">{{ recruitment.chiefName }}</span>
                                <a-tag style="margin-left: 10px"><span style="font-size: 18px; ">{{ recruitment.chiefAddress }}</span></a-tag>
                            </template>
                            <a-card-meta>
                                <template #avatar>
                                    <a-avatar :src="recruitment.companyAvatar" :size="48"/>
                                </template>
                                <template #title>
                                    <span style="font-size: 20px">{{ recruitment.companyName }}</span>
                                </template>
                                <template #description>
                                    <span style="font-size: 14px">{{ recruitment.chiefDescription }}</span>
                                </template>
                            </a-card-meta>
                        </a-card>
                    </a-col>
                </div>
            </a-row>
        </div>
    </div>
    <!--分页-->
    <a-row>
        <a-col :span="12" :offset="16">
            <a-pagination
                :show-total="total => `总共 ${total} 条`"
                @change="onPageChange"
                v-model:current="current"
                :total="recruitmentDataList.length"
                show-less-items
                :page-size="pageSize"
                :showSizeChanger="false"
            />
        </a-col>
    </a-row>



</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import { searchRecruitmentRequest} from "../../api/user/index.js";
import {useIndexStore} from "../../store/index.js";
import {searchNoticeRequest} from "../../api/root/notice.js";


const router = useRouter()
const indexStore = useIndexStore()

const currentPageRecruitmentList = ref([])

// 分页
const current = ref('1')
const pageSize = ref('15')
const onPageChange = () => {
    console.log('current', current.value)
    currentPageRecruitmentList.value = []
    for (let i = (current.value - 1) * pageSize.value; i < recruitmentDataList.value.length && i < current.value * pageSize.value; i++) {
        currentPageRecruitmentList.value.push(recruitmentDataList.value[i])
    }
}


const clickCard = (recruitmentId, companyId) => {
    indexStore.currentRecruitmentId = recruitmentId
    indexStore.currentCompanyId = companyId
    router.push({path: '/user/currentRecruitment'})
}

const recruitmentDataList = ref([])
const searchCurrentRecruitment = async (data) => {
    await searchRecruitmentRequest(data)
        .then(res => {
            console.log('getCurrentRecruitmentRequest', res)
            recruitmentDataList.value = res.data
        })
}

const noticeModalVisible = ref(false)
const noticeDataList = ref([])
const currentNotice = ref({})

const openNoticeModal = (notice) => {
    currentNotice.value = notice
    noticeModalVisible.value = true
}

onMounted(async () => {
    await searchRecruitmentRequest({
        ...formState,
        chiefSalary: formState.chiefMinSalary + '-' + formState.chiefMaxSalary
    }).then(res => {
        console.log('getCurrentRecruitmentRequest', res)
        recruitmentDataList.value = res.data
        for (let i = 0; i < recruitmentDataList.value.length && i <  pageSize.value; i++) {
            currentPageRecruitmentList.value.push(recruitmentDataList.value[i])
        }
        console.log('currentPageRecruitmentList', currentPageRecruitmentList.value)
    })
    await searchNoticeRequest()
        .then(res => {
            console.log('获取通告数据', res)
            noticeDataList.value = res.data
        })
})

const formRef = ref();
const formState = reactive({
    chiefName: '',
    companyName: '',
    chiefAddress: '',
    chiefMinSalary: '0',
    chiefMaxSalary: '0',
    companyTaskType: ''
});
const search = async values => {
    console.log('Success:', values);
    console.log(values.chiefMinSalary + '-' + values.chiefMaxSalary)
    await searchCurrentRecruitment({
        ...values,
        chiefSalary: values.chiefMinSalary + '-' + values.chiefMaxSalary
    })
};


</script>

<style scoped>
/* For demo */
.ant-carousel :deep(.slick-slide) {
    text-align: center;
    height: 300px;
    line-height: 160px;
    overflow: hidden;
    margin: 20px 0;
}

.ant-carousel :deep(.slick-slide h3) {
    color: #fff;
}
</style>
