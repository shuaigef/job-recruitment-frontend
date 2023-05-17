<template>
  <!--搜索-->
    <div style="margin-top: 20px">
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
                            name="blogTitle"
                            label="标题"
                    >
                        <a-input v-model:value="formState.blogTitle" placeholder="请输入名称"></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item
                            name="blogType"
                            label="类型"
                    >
                        <a-select v-model:value="formState.blogType" placeholder="请选择文章类型" style="width: 200px">
                            <a-select-option value="经历">经历</a-select-option>
                            <a-select-option value="职场动态">职场动态</a-select-option>
                            <a-select-option value="企业职位">企业职位</a-select-option>
                            <a-select-option value="企业">企业</a-select-option>
                            <a-select-option value="资料">资料</a-select-option>
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
    <div style="margin: 20px 0">
        <a-table
                :columns="columns"
                :data-source="blogDataList"
                :pagination="pagination"
                :row-key="record => record.id"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'operation'">
                    <span>
                        <a @click="passReportBlog(record.id)">通过</a>
                    </span>
                    <span style="margin-left: 10px">
                        <a @click="disableReportBlog(record.id)">禁用</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {passRecruitmentRequest, searchRecruitmentCheckPageRequest} from "../../../api/root/recruitmentCheck.js";
import {searchBlogRequest, searchReportBlogRequest} from "../../../api/user/index.js";
import {listBlogByAdminRequest, passReportBlogRequest} from "../../../api/root/blogCheck.js";
import {message} from "ant-design-vue";


const blogDataList = ref([])

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(blogDataList.value.length),
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
    blogTitle: '',
    blogType: '',
});

const searchBlog = async (blog) => {
    await searchReportBlogRequest(blog)
        .then((res) => {
            console.log('onMounted 搜索文章', res)
            blogDataList.value = res.data
        })
}

onMounted(async () => {
    await listBlogByAdminRequest(formState)
        .then((res) => {
            console.log('onMounted 获取文章数据', res)
            blogDataList.value = res.data
        })
})

const search = values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    searchBlog(values)
};

// 表头
const columns = [
    {
        title: '文章标题',
        dataIndex: 'blogTitle',
        fixed: 'left',
        width: 100
    },
    {
        title: '文章作者',
        dataIndex: 'userName',
        fixed: 'left',
        width: 100
    }, {
        title: '文章内容',
        dataIndex: 'blogContent',
    }, {
        title: '文章类型',
        dataIndex: 'blogType',
    }, {
        title: '状态',
        dataIndex: 'blogStatus',
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100
    }];

const passReportBlog = async (id) => {
    console.log('id', id)
    await passReportBlogRequest({
        blogId: id,
        choice: '通过'
    }).then(res => {
        console.log('恢复文章', res)
        message.success('恢复文章')
    })
    await listBlogByAdminRequest(formState)
        .then((res) => {
            blogDataList.value = res.data
        })
}

const disableReportBlog = async (id) => {
    console.log('id', id)
    await passReportBlogRequest({
        blogId: id,
        choice: '禁用'
    }).then(res => {
        console.log('禁用文章', res)
        message.warn('禁用文章')
    })
    await listBlogByAdminRequest(formState)
        .then((res) => {
            blogDataList.value = res.data
        })
}


</script>

<style scoped>

</style>
