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
                :data-source="commentReportList"
                :pagination="pagination"
                :row-key="record => record.commentId"
                :scroll="{ x: 1300, y: 1000 }"
        >
            <template #bodyCell="{ column, text, record }">
                <template v-if="column.dataIndex === 'operation'">
                    <span>
                        <a @click="passReportComment(record.commentId)">通过</a>
                    </span>
                    <span style="margin-left: 10px">
                        <a @click="disableReportComment(record.commentId)">禁用</a>
                    </span>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {passReportCommentRequest, searchCommentReportListRequest} from "../../../api/root/commentCheck.js";
import {message} from "ant-design-vue";


const commentReportList = ref([])

// 分页配置项
const pagination = reactive({
    current: ref(1),
    pageSize: ref(10),
    total: ref(commentReportList.value.length),
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
});

const searchCommentReportList = async (commentReport) => {
    await searchCommentReportListRequest(commentReport)
        .then((res) => {
            console.log('onMounted 搜索被举报评论', res)
            commentReportList.value = res.data
        })
}

onMounted(async () => {
    await searchCommentReportListRequest()
        .then((res) => {
            console.log('onMounted 获取被举报评论', res)
            commentReportList.value = res.data
        })
})

const search = async values => {
    console.log('Received values of form: ', values);
    console.log('formState: ', formState);
    await searchCommentReportList(values)
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
        title: '评论者',
        dataIndex: 'userName',
        fixed: 'left',
        width: 100
    }, {
        title: '评论内容',
        dataIndex: 'commentContent',
    }, {
        title: '时间',
        dataIndex: 'createTime',
    }, {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 150
    }];

const passReportComment = async (id) => {
    await passReportCommentRequest(id, '通过')
        .then(res => {
            console.log('恢复正常', res)
            if (res.data){
                message.success('恢复评论')
            } else {
                message.error('通过失败')
            }
        })
    await searchCommentReportList()
}
const disableReportComment = async (id) => {
    await passReportCommentRequest(id, '禁用')
        .then(res => {
            console.log('举报成功', res)
            if (res.data){
                message.success('禁用评论')
            } else {
                message.error('禁用失败')
            }
        })
    await searchCommentReportList()
}



</script>

<style scoped>

</style>
