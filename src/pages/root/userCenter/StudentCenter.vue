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
                            name="userName"
                            label="姓名"
                    >
                        <a-input v-model:value="formState.userName" placeholder="请输入姓名"></a-input>
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
                        name="age"
                        label="年龄"
                    >
                        <a-input v-model:value="formState.age" placeholder="请输入年龄"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                            name="phone"
                            label="手机号"
                    >
                        <a-input v-model:value="formState.phone" placeholder="请输入手机号"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                            name="userEmail"
                            label="邮箱"
                    >
                        <a-input v-model:value="formState.userEmail" placeholder="请输入邮箱"></a-input>
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
            <a-button style="margin-left: 10px" type="primary" :loading="state.loading" @click="addStudentButton">
                添加
            </a-button>
        </div>
        <a-table
                :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, fixed: true }"
                :columns="columns"
                :data-source="studentDataList"
                :pagination="pagination"
                :row-key="record => record.id"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="['userName', 'gender', 'age', 'phone', 'userEmail'].includes(column.dataIndex)">
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
        </a-table>
    </div>
    <!--新增学生弹窗-->
    <a-modal v-model:visible="addStudentVisible" title="新增学生" @ok="handleOk" :closable="false" :footer="null">
        <a-form
            :model="addFormState"
            name="addTask"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            autocomplete="off"
            @finish="addStudent"
        >
            <a-form-item
                name="userName"
                label="姓名"
            >
                <a-input v-model:value="addFormState.userName" placeholder="请输入学生姓名"></a-input>
            </a-form-item>
            <a-form-item
                name="userPhone"
                label="手机号"
            >
                <a-input v-model:value="addFormState.userPhone" placeholder="请输入手机号"></a-input>
            </a-form-item>
            <a-form-item
                name="userPassword"
                label="密码"
            >
                <a-input v-model:value="addFormState.userPassword" placeholder="请输入密码"></a-input>
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
    addStudentRequest,
    deleteStudentByIdsRequest,
    listStudentPageRequest,
    searchStudentPageRequest, updateStudentRequest
} from "../../../api/root/studentCenter.js";
import {message} from "ant-design-vue";
import fastForwardFilled from "@ant-design/icons-vue/lib/icons/FastForwardFilled.js";

const studentDataList = ref([])
const addStudentVisible = ref(false)

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(studentDataList.value.length),
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
    userName: '',
    gender: '',
    age: '',
    phone: '',
    userEmail: '',
});

// 新增学生表单数据对象
const addFormState = ref({
    userPhone: '',
    userPassword: '',
    userName: '',
    checkPassword: ''
})

const addStudent = async (values) => {
    await addStudentRequest(values)
        .then(res => {
            if (res.data) {
                message.success('创建成功')
                addStudentVisible.value = false
            } else {
                message.error('创建失败')
            }
        })
}

const searchStudentList = async (data) => {
    // pagination.current = 1
    await searchStudentPageRequest({
        ...data
    }).then((res) => {
        console.log('onMounted res', res)
        studentDataList.value = res.data
    })
}

onMounted(async () => {
    // pagination.current = 1
    await searchStudentPageRequest({
        ...formState
    }).then((res) => {
        console.log('onMounted res', res)
        studentDataList.value = res.data
    })
})

const search = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    searchStudentList(values)
};

// 表头
const columns = [
    {
    title: '姓名',
    dataIndex: 'userName',
    fixed: 'left',
    width: 100
}, {
    title: '性别',
    dataIndex: 'gender',
}, {
    title: '年龄',
    dataIndex: 'age',
}, {
    title: '手机号',
    dataIndex: 'phone',
}, {
    title: '邮箱',
    dataIndex: 'userEmail',
}, {
    title: '创建时间',
    dataIndex: 'createTime',
}, {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 80
}];

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

// 删除学生
const deleteStudent = async () => {
    await deleteStudentByIdsRequest([...state.selectedRowKeys])
        .then(res => {
            console.log('deleteStudent', res)
        })
}

const addStudentButton = () => {
    addStudentVisible.value = true
}

const updateStudent = async (updateStudent) => {
    await updateStudentRequest(updateStudent)
        .then((res) => {
            console.log('update', res)
        })
}

const editableData = reactive({});
const edit = id => {
    editableData[id] = cloneDeep(studentDataList.value.filter(item => id === item.id)[0]);
};
const save = id => {
    Object.assign(studentDataList.value.filter(item => id === item.id)[0], editableData[id]);
    updateStudent({
        id: editableData[id].key,
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
