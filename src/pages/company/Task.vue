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
                            name="taskTitle"
                            label="项目名称"
                    >
                        <a-input v-model:value="formState.taskTitle" placeholder="请输入项目名称"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                        name="taskType"
                        label="项目类型"
                    >
                        <a-select v-model:value="formState.taskType" placeholder="请输选择项目类型">
                            <a-select-option value="研究型">研究型</a-select-option>
                            <a-select-option value="实践型">实践型</a-select-option>
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
            <a-button type="primary" :disabled="!hasSelected" :loading="state.loading" @click="deleteTask">
                删除
            </a-button>
            <a-button style="margin-left: 10px" type="primary" :loading="state.loading" @click="addTaskButton">
                添加
            </a-button>
        </div>
        <a-table
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, fixed: true }"
                :columns="columns"
                :data-source="taskDataList"
                :pagination="pagination"
                :row-key="record => record.id"
                :scroll="{ x: 1300, y: 1000 }"
                @expand="showUserCommitList"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'taskType'">
                    <div>
                        <a-select
                            v-if="editableData[record.id]"
                            v-model:value="editableData[record.id][column.dataIndex]"
                            style="width: 150px"
                        >
                            <a-select-option value="研究型">研究型</a-select-option>
                            <a-select-option value="实践型">实践型</a-select-option>
                        </a-select>
                        <template v-else>
                            {{ text }}
                        </template>
                    </div>
                </template>
                <template v-else-if="column.dataIndex !== 'operation'">
                    <div>
                        <a-textarea
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
                            <span>
                                <a-typography-link @click="save(record.id)">保存</a-typography-link>
                            </span>
                            <span style="margin-left: 10px">
                                <a-popconfirm title="确定取消吗?" @confirm="cancel(record.id)">
                                    <a>取消</a>
                                </a-popconfirm>
                            </span>
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
                        :data-source="userCommitList"
                        :pagination="false"
                        :row-key="record => record.userId"
                    >
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'operation'">
                                <span><a>下载</a></span>
                                <span style="margin-left: 20px"><a @click="talkWithUser(record.userId)">沟通</a></span>
                            </template>
                        </template>
                    </a-table>
            </template>
        </a-table>
        <!--新增项目弹窗-->
        <a-modal v-model:visible="visible" title="新增项目" @ok="handleOk" :footer="null">
            <a-form
                    :model="addFormState"
                    name="addTask"
                    :label-col="{ span: 8 }"
                    :wrapper-col="{ span: 16 }"
                    autocomplete="off"
                    @finish="addCompanyTask"
            >
                <a-form-item
                    name="taskTitle"
                    label="项目名称"
                >
                    <a-input v-model:value="addFormState.taskTitle" placeholder="请输入项目名称"></a-input>
                </a-form-item>
                <a-form-item
                    name="taskContent"
                    label="项目内容"
                >
                    <a-textarea :auto-size="{ minRows:2, maxRows:4 }" v-model:value="addFormState.taskContent" placeholder="请输入项目内容"></a-textarea>
                </a-form-item>
                <a-form-item
                    name="taskCommand"
                    label="项目要求"
                >
                    <a-textarea :auto-size="{ minRows:2, maxRows:4 }" v-model:value="addFormState.taskCommand" placeholder="请输入项目要求"></a-textarea>
                </a-form-item>
                <a-form-item
                    name="taskType"
                    label="项目类型"
                >
                    <a-select v-model:value="addFormState.taskType" placeholder="请输选择项目类型">
                        <a-select-option value="研究型">研究型</a-select-option>
                        <a-select-option value="实践型">实践型</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
                    <a-button type="primary" html-type="submit">创建项目</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref } from "vue";
import {cloneDeep} from "lodash-es";
import {message} from "ant-design-vue";
import {
    addCompanyTaskRequest,
    deleteCompanyTaskRequest, getUserCommitRequest,
    searchCompanyTaskRequest,
    updateCompanyTaskRequest
} from "../../api/company/task.js";
import {useRouteStore} from "../../store/index.js";
import {storeToRefs} from "pinia";
import {addUserChatListRequest} from "../../api/user/talk.js";
import {useRouter} from "vue-router";

const routeStore = useRouteStore()
const { currentUserId, currentUserRole } = storeToRefs(routeStore)

const taskDataList = ref([])
const userCommitList = ref([])

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(taskDataList.value.length),
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
    taskTitle: '',
    taskType: ''
});

const searchTaskList = async (data) => {
    // pagination.current = 1
    await searchCompanyTaskRequest({
        ...data,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('搜索项目', res)
        taskDataList.value = res.data
    })
}

onMounted(async () => {
    await searchCompanyTaskRequest({
        ...formState,
        companyId: currentUserId.value
    }).then((res) => {
        console.log('onMounted 搜索项目', res)
        taskDataList.value = res.data
    })
})

const search = async values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    await searchTaskList(values)
};

// 表头
const columns = [
    {
        title: '项目名称',
        dataIndex: 'taskTitle',
        fixed: 'left'
    }, {
        title: '项目内容',
        dataIndex: 'taskContent',
    }, {
        title: '项目要求',
        dataIndex: 'taskCommand',
    }, {
        title: '项目类型',
        dataIndex: 'taskType',
    }, {
        title: '项目状态',
        dataIndex: 'taskStatus',
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 150
    }];
// 学生提交项目表头
const innerColumns = [{
    title: '学生姓名',
    dataIndex: 'userName',
}, {
    title: '年龄',
    dataIndex: 'userAge',
}, {
    title: '邮箱',
    dataIndex: 'userEmail',
}, {
    title: '性别',
    dataIndex: 'gender',
}, {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 150
}];

const showUserCommitList = async (expanded, record) => {
    console.log('expanded',expanded)
    console.log('record',record)
    if (expanded) {
        await getUserCommitRequest(record.companyId, record.taskType, record.taskTitle)
            .then(res => {
                userCommitList.value = res.data
                console.log('getUserCommitRequest', res)
            })
    }
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

// 删除项目
const deleteTask = async () => {
    await deleteCompanyTaskRequest([...state.selectedRowKeys], currentUserId.value)
        .then(res => {
            console.log('删除项目', res)
            if (res.data) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    await searchTaskList(formState)
}

const updateTask = async (updateTask) => {
    await updateCompanyTaskRequest(updateTask)
        .then((res) => {
            console.log('修改项目', res)
        })
}

const editableData = reactive({});
const edit = id => {
    editableData[id] = cloneDeep(taskDataList.value.filter(item => id === item.id)[0]);
};
const save = id => {
    Object.assign(taskDataList.value.filter(item => id === item.id)[0], editableData[id]);
    updateTask({
        id: editableData[id].id,
        ...editableData[id]
    })
    delete editableData[id];
};
const cancel = id => {
    delete editableData[id];
};


const visible = ref(false);
const addTaskButton = () => {
    visible.value = true;
}
const handleOk = e => {
    console.log(e);
    visible.value = false;
};

// 新增岗位表单数据对象
const addFormState = ref({
    taskTitle: '',
    taskContent: '',
    taskCommand: '',
    taskType: ''
})

// 创建项目方法
const addTask = async (addTask) => {
    await addCompanyTaskRequest({
        ...addTask,
        companyId: currentUserId.value
    }).then(res => {
        console.log('addTask', res)
        if (res.data){
            message.success('项目创建成功')
        } else {
            message.error('项目创建失败')
        }
    })
}

const addCompanyTask = async values => {
    await addTask(values)
    visible.value = false;
    message.success('新增招聘成功!')
    await searchTaskList(formState)
};

</script>

<style scoped>

</style>
