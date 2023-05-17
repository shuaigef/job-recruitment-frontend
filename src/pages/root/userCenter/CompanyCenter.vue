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
                        name="companyName"
                        label="名称"
                    >
                        <a-input v-model:value="formState.companyName" placeholder="请输入名称"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="companyAccount"
                        label="账号"
                    >
                        <a-input v-model:value="formState.companyAccount" placeholder="请输入账号"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="scale"
                        label="规模"
                    >
                        <a-select v-model:value="formState.scale" placeholder="请选择性别">
                            <a-select-option value="小">小</a-select-option>
                            <a-select-option value="中">中</a-select-option>
                            <a-select-option value="大">大</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="industry"
                        label="行业"
                    >
                        <a-input v-model:value="formState.companyIndustry" placeholder="请输入行业"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="address"
                        label="地址"
                    >
                        <a-input v-model:value="formState.address" placeholder="请输入地址"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="companyStatus"
                        label="状态"
                    >
                        <a-select v-model:value="formState.companyStatus" placeholder="请选择性别">
                            <a-select-option value="启用">启用</a-select-option>
                            <a-select-option value="停用">停用</a-select-option>
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
        <div style="margin-bottom: 16px">
            <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="deleteStudent">
                删除
            </a-button>
            <a-button style="margin-left: 10px" type="primary" :loading="state.loading" @click="addCompanyButton">
                添加
            </a-button>
        </div>
        <a-table
            :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, fixed: true }"
            :columns="columns"
            :data-source="companyDataList"
            :pagination="pagination"
            :row-key="record => record.id"
            :scroll="{ x: 1300, y: 1000 }"
            @expand="showCompanyTaskList"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex !== 'operation'">
                    <div>
                        <a-input
                            v-if="editableData[record.id]"
                            v-model:value="editableData[record.id][column.dataIndex]"
                            style="margin: -5px 0"
                        />
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex === 'operation'">
                    <div class="editable-row-operations">
                        <span v-if="editableData[record.id]">
                            <a-typography-link @click="save(record.id)">Save</a-typography-link>
                            <a-popconfirm title="Sure to cancel?" @confirm="cancel(record.id)">
                                <a>Cancel</a>
                             </a-popconfirm>
                            </span>
                        <span v-else>
                            <a @click="edit(record.id)">编辑</a>
                        </span>
                    </div>
                </template>
            </template>
            <template #expandedRowRender>
                <a-table
                    :columns="innerColumns"
                    :data-source="companyTaskList"
                    :pagination="false"
                    :row-key="record => record.id"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'operation'">
                        </template>
                    </template>
                </a-table>
            </template>
        </a-table>
    </div>
    <!--新增学生弹窗-->
    <a-modal v-model:visible="addCompanyVisible" title="新增学生" @ok="handleOk" :closable="false" :footer="null">
        <a-form
            :model="addFormState"
            name="addTask"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="addCompany"
        >
            <a-form-item
                name="companyName"
                label="姓名"
            >
                <a-input v-model:value="addFormState.companyName" placeholder="请输入企业名称"></a-input>
            </a-form-item>
            <a-form-item
                name="companyPhone"
                label="手机号"
            >
                <a-input v-model:value="addFormState.companyPhone" placeholder="请输入手机号"></a-input>
            </a-form-item>
            <a-form-item
                name="companyPassword"
                label="密码"
            >
                <a-input v-model:value="addFormState.companyPassword" placeholder="请输入密码"></a-input>
            </a-form-item>
            <a-form-item
                name="checkPassword"
                label="二次密码"
            >
                <a-input v-model:value="addFormState.checkPassword" placeholder="请再次输入密码"></a-input>
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                <a-button type="primary" html-type="submit">创建用户</a-button>
            </a-form-item>
        </a-form>
    </a-modal>

</template>

<script setup>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {cloneDeep} from "lodash-es";
import {
    addCompanyRequest,
    deleteCompanyByIdsRequest,
    listCompanyPageRequest,
    searchCompanyPageRequest,
    updateCompanyRequest
} from "../../../api/root/companyCenter.js";
import {getUserCommitRequest, searchCompanyTaskRequest} from "../../../api/company/task.js";
import {addStudentRequest} from "../../../api/root/studentCenter.js";
import {message} from "ant-design-vue";


const companyDataList = ref([])


// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(companyDataList.value.length),
    showTotal(total) {
        return '总共 ' + total + ' 条记录'
    },
    onChange(page, pageSize){
        console.log(page, pageSize)
        this.current = page
        // getCompanyList()
    }
})


const formRef = ref();
const formState = reactive({
    companyAccount: '',
    companyName: '',
    companyIndustry: '',
    scale: '',
    address: '',
    companyStatus: '',
    mark: '',
});

// 新增公司表单数据对象
const addFormState = ref({
    companyPhone: '',
    companyPassword: '',
    companyName: '',
    checkPassword: ''
})

const addCompanyVisible = ref(false)


const addCompanyButton = () => {
    addCompanyVisible.value = true
}

const addCompany = async (values) => {
    await addCompanyRequest(values)
        .then(res => {
            if (res.data) {
                message.success('创建成功')
                addCompanyVisible.value = false
            } else {
                message.error('创建失败')
            }
        })
}

const searchCompanyList = async (data) => {
    await searchCompanyPageRequest({
        current: pagination.current,
        pageSize: pagination.pageSize,
        ...data
    }).then((res) => {
        console.log('onMounted res', res)
        companyDataList.value = res.data.records
        pagination.total = res.data.total
    })
}

onMounted(async () => {
    await searchCompanyPageRequest({
        // current: pagination.current,
        // pageSize: pagination.pageSize,
        ...formState
    }).then((res) => {
        console.log('onMounted res', res)
        companyDataList.value = res.data
        // pagination.total = res.total
    })
})

const search = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    searchCompanyList(values)
};

// 表头
const columns = [
{
    title: '名称',
    dataIndex: 'companyName',
    fixed: 'left',
    width: 100
}, {
    title: '账号',
    dataIndex: 'companyAccount',
}, {
    title: '行业',
    dataIndex: 'companyIndustry',
}, {
    title: '规模',
    dataIndex: 'scale',
}, {
    title: '地址',
    dataIndex: 'address',
}, {
    title: '邮箱',
    dataIndex: 'companyEmail',
}, {
    title: '电话',
    dataIndex: 'companyPhone',
}, {
    title: '备注',
    dataIndex: 'mark',
}, {
    title: '状态',
    dataIndex: 'companyStatus',
}, {
    title: '创建时间',
    dataIndex: 'createTime',
}, {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 80
}];

// 公司项目表头
const innerColumns = [{
    title: '项目名称',
    dataIndex: 'taskTitle',
}, {
    title: '项目要求',
    dataIndex: 'taskCommand',
}, {
    title: '项目内容',
    dataIndex: 'taskContent',
}, {
    title: '项目类型',
    dataIndex: 'taskType',
}];

const companyTaskList = ref([])

const showCompanyTaskList = async (expanded, record) => {
    console.log('expanded',expanded)
    console.log('record',record)
    if (expanded) {
        await searchCompanyTaskRequest({
            companyId: record.id,
            taskType: '全部'
        }).then(res => {
            companyTaskList.value = res.data
            console.log('searchCompanyTaskRequest', res)
        })
    }
}



const state = reactive({
    selectedRowKeys: [],
    // Check here to configure the default column
    loading: false,
});

const hasSelected = computed(() => state.selectedRowKeys.length > 0);

const onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    state.selectedRowKeys = selectedRowKeys;
};

// 删除企业
const deleteStudent = async () => {
    await deleteCompanyByIdsRequest([...state.selectedRowKeys])
        .then((res) => {
            console.log('delete' ,res)
        })
}



const updateCompany = async (updateCompany) => {
    await updateCompanyRequest(updateCompany)
        .then((res) => {
            console.log('update', res)
        })
}

const editableData = reactive({});
const edit = id => {
    editableData[id] = cloneDeep(companyDataList.value.filter(item => id === item.id)[0]);
};


const save = id => {
    Object.assign(companyDataList.value.filter(item => id === item.id)[0], editableData[id]);
    updateCompany({
        ...editableData[id]
    })
    delete editableData[id];
};
const cancel = id => {
    delete editableData[id];
};



</script>

<style scoped>
#components-form-demo-advanced-search .ant-form {
    max-width: none;
}

#components-form-demo-advanced-search .search-result-list {
    margin-top: 16px;
    border: 1px dashed #e9e9e9;
    border-radius: 2px;
    background-color: #fafafa;
    min-height: 200px;
    text-align: center;
    padding-top: 80px;
}

[data-theme='dark'] .ant-advanced-search-form {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid #434343;
    padding: 24px;
    border-radius: 2px;
}

[data-theme='dark'] #components-form-demo-advanced-search .search-result-list {
    border: 1px dashed #434343;
    background: rgba(255, 255, 255, 0.04);
}
</style>
