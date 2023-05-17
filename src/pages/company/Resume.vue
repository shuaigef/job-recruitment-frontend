<template>
  <!--搜索-->
    <div style="margin: 20px 0">
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
                            name="chiefName"
                            label="岗位名称"
                    >
                        <a-input v-model:value="formState.chiefName" placeholder="请输入名称"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                            name="gender"
                            label="性别"
                    >
                        <a-select v-model:value="formState.gender" placeholder="请选择性别">
                            <a-select-option value="男">男</a-select-option>
                            <a-select-option value="女">女</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                            name="chiefStatus"
                            label="状态"
                    >
                        <a-select v-model:value="formState.chiefStatus" placeholder="请选择状态">
                            <a-select-option value="审核">审核</a-select-option>
                            <a-select-option value="通过">通过</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="academicDegree"
                        label="学位"
                    >
                        <a-select v-model:value="formState.academicDegree" placeholder="请选择状态">
                            <a-select-option value="大专以下">大专以下</a-select-option>
                            <a-select-option value="大专">大专</a-select-option>
                            <a-select-option value="本科">本科</a-select-option>
                            <a-select-option value="硕士">硕士</a-select-option>
                            <a-select-option value="博士">博士</a-select-option>
                        </a-select>
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
  <!--数据表格-->
    <div>
        <a-table
                :columns="columns"
                :data-source="resumeDataList"
                :pagination="pagination"
                :row-key="record => record.noteId"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'operation'">
                    <span>
                        <a @click="viewResume(record.noteId)">查看简历</a>
                    </span>
                    <span style="margin-left: 20px">
                        <a @click="talkWithUser(record.userId)">沟通</a>
                    </span>
                </template>
            </template>
        </a-table>
        <!--简历查看弹窗-->
        <a-modal
            v-model:visible="visible"
            title="简历"
            @ok="handleOk"
            width="1000px"
            okText="通过"
            cancel-text="待定"
        >
            <a-descriptions
                bordered
                :column="3"
            >
                <a-descriptions-item label="姓名">{{ currentResume.userName }}</a-descriptions-item>
                <a-descriptions-item label="性别">{{ currentResume.gender }}</a-descriptions-item>
                <a-descriptions-item label="年龄">{{ currentResume.age }}</a-descriptions-item>
                <a-descriptions-item label="毕业学校" :span="2">{{ currentResume.graduateSchool }}</a-descriptions-item>
                <a-descriptions-item label="学位">{{ currentResume.academicDegree }}</a-descriptions-item>
                <a-descriptions-item label="个人介绍" :span="3">{{ currentResume.noteDescription }}</a-descriptions-item>
                <a-descriptions-item label="教育经历" :span="3">{{ currentResume.noteEducation }}</a-descriptions-item>
                <a-descriptions-item label="项目经历" :span="3">{{ currentResume.noteItem }}</a-descriptions-item>
                <a-descriptions-item label="工作期望" :span="3">{{ currentResume.noteExpect }}</a-descriptions-item>
                <a-descriptions-item label="工作经历" :span="3">{{ currentResume.noteWork }}</a-descriptions-item>
            </a-descriptions>
        </a-modal>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {getResumeByIdRequest, passCurrentResumeRequest, searchResumePageRequest} from "../../api/company/resume.js";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {message} from "ant-design-vue";
import {addUserChatListRequest} from "../../api/user/talk.js";
import {useRouter} from "vue-router";

const resumeDataList = ref([])
const currentResume = ref({})

const routeStore = useRouteStore()
const { currentUserId } = storeToRefs(routeStore)

let noteId = ref(0)

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(resumeDataList.value.length),
    showTotal(total) {
        return '总共 ' + total + ' 条记录'
    },
    onChange(page, pageSize){
        console.log(page, pageSize)
        this.current = page
    }
})

const formRef = ref();
const formState = reactive({
    chiefName: '',
    gender: '',
    chiefStatus: '',
    academicDegree: '',
});

const searchResumeList = async (data) => {
    await searchResumePageRequest({
        ...data,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('onMounted res', res)
        resumeDataList.value = res.data
    })
}

onMounted(async () => {
    await searchResumePageRequest({
        ...formState,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('onMounted resume', res)
        resumeDataList.value = res.data
    })
})

const search = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    searchResumeList(values)
};

// 表头
const columns = [
    {
        title: '岗位名称',
        dataIndex: 'chiefName',
        fixed: 'left',
        width: 100
    }, {
        title: '求职人姓名',
        dataIndex: 'userName',
    }, {
        title: '状态',
        dataIndex: 'userChiefStatus',
    }, {
        title: '性别',
        dataIndex: 'gender',
    }, {
        title: '简历描述',
        dataIndex: 'noteDescription',
    }, {
        title: '毕业学校',
        dataIndex: 'graduatesSchool',
    }, {
        title: '学位',
        dataIndex: 'academicDegree',
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 150
    }];

const visible = ref(false);
const handleOk = async e => {
    console.log(e);
    console.log('noteId', noteId)
    await passCurrentResumeRequest(noteId)
        .then(res => {
            console.log('passCurrentResumeRequest', res)
        })
    visible.value = false;
    await searchResumeList(formState)
};

const getResumeById = (noteId) => {
    getResumeByIdRequest(noteId)
        .then( res => {
            console.log('getResumeById', res)
            currentResume.value = res.data
        })
}

// 查看简历
const viewResume = async (id) => {
    console.log('noteId', id)
    noteId = id
    await getResumeByIdRequest(id)
        .then( res => {
            console.log('getResumeById', res)
            if (res.code === 0){
                currentResume.value = res.data
                visible.value = true
            } else {
                message.error('操作失败')
            }

        })
    // await getResumeById(noteId)
}

const router = useRouter()
// 与学生沟通
const talkWithUser = async (userId) => {
    await addUserChatListRequest(userId, currentUserId.value)
        .then(res => {
            console.log('addUserChatListRequest', res)
        })
    await router.push('/user/userMessage')
}



</script>

<style scoped>

</style>
