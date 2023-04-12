<template>
  <el-card class="box-card">
    <div class="top-box">
      <el-button type="primary" @click="add"
        ><el-icon><Plus /></el-icon>添加</el-button
      >
      <el-button
        type="danger"
        :disabled="selectArr.length == 0"
        @click="selectDel"
        ><el-icon><Delete /></el-icon>批量删除</el-button
      >

      <div>管理员姓名：</div>
      <el-input v-model="keyword" placeholder="输入关键字" class="input-select">
        <template #append>
          <el-button @click="search">搜索</el-button>
        </template>
      </el-input>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      ref="multipleTableRef"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="Id" width="80" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="gender" label="性别" width="55" />
      <el-table-column prop="telephone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="200" />
      <el-table-column prop="address" label="地址" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="editAdmin(scope.row)"
            >修改</el-button
          >
          <el-button
            link
            type="danger"
            size="small"
            @click="deleteAdmin(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <template #empty>
      <el-empty description="暂无数据" />
    </template>
    </el-table>
    <div class="page-pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        v-model:currentPage="page"
        v-model:page-size="size"
        @current-change="pageChange"
        :total="total"
      />
    </div>
  </el-card>
  <!-- 添加 修改弹窗 -->
  <el-dialog v-model="dialogFormVisible" :title="title" width="40%">
    <el-form
      :model="form"
      ref="ruleFormRef"
      :rules="rules"
      :label-width="formLabelWidth"
    >
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入管理员姓名"
        />
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender" class="ml-4">
          <el-radio label="男" size="large">男</el-radio>
          <el-radio label="女" size="large">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input
          v-model="form.telephone"
          autocomplete="off"
          placeholder="请输入联系电话"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input
          v-model="form.email"
          autocomplete="off"
          placeholder="请输入邮箱"
        />
      </el-form-item>
      <el-form-item v-if="editStatus == 'add'" label="密码" prop="password">
        <el-input
          v-model="form.password"
          autocomplete="off"
          type="password"
          show-password
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item
        v-if="editStatus == 'add'"
        label="确认密码"
        prop="password2"
      >
        <el-input
          v-model="form.password2"
          autocomplete="off"
          type="password"
          show-password
          placeholder="确认密码"
        />
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input
          v-model="form.address"
          autocomplete="off"
          placeholder="请输入住址"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="saveForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getAdminApi,
  saveOrUpdateAdminApi,
  deleteAdminApi,
} from "../api/admin";
const formLabelWidth = "140px";
const title = ref("");
const total = ref(0); // 分页总数
const page = ref(1);
const size = ref(10);
const loading = ref(false);
const keyword = ref("");
const selectArr = ref([]); // 选中的行id数组
const dialogFormVisible = ref(false); //修改 添加弹窗
const form = reactive({
  id: "",
  name: "",
  password: "",
  password2: "",
  gender: "",
  telephone: "",
  email: "",
  address: "",
  portraitPath: "/upload",
});
const tableData = ref([]);
const editStatus = ref("");
const ruleFormRef = ref(); // 表单校验
const rules = reactive({
  name: [{ required: true, message: "姓名必填", trigger: "change" }],
  gender: [{ required: true, message: "性别必选", trigger: "change" }],
  password: [{ required: true, message: "密码必填", trigger: "change" }],
  password2: [{ required: true, message: "密码必填", trigger: "change" }],
  address: [{ required: true, message: "地址必填", trigger: "change" }],
  telephone: [
    { pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/, message: "请输入正确的手机号" },
    { required: true, message: "管理员电话必填", trigger: "change" },
  ],
  email: [
    {
      pattern:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "请输入正确的邮箱",
    },
    { required: true, message: "管理员邮箱必填", trigger: "change" },
  ],
});
// 查询班级列表
await getAdmin();
// 获取所有管理员列表
// async function getAdminAll() {
//   loading.value = true;
//   const { code, data, message } = await getAdminApi();
//   loading.value = false;
//   if (code == 200) {
//     options.value = data;
//   } else {
//     ElMessage.error(message);
//   }
// }
async function getAdmin() {
  loading.value = true;
  const { code, data, message } = await getAdminApi(
    page.value,
    size.value,
    keyword.value
  );
  loading.value = false;

  if (code == 200) {
    tableData.value = data.records || [];

    total.value = data.total;
  } else {
    ElMessage.error(message);
  }
}
// 添加管理员按钮事件
function add() {
  title.value = "添加管理员信息";
  editStatus.value = "add";
  // 清空表单数据
  clearForm();
  dialogFormVisible.value = true;
}
// 修改管理员
function editAdmin(item) {
  // 清空表单数据
  clearForm();
  title.value = "修改信息";
  editStatus.value = "edit";
  form.name = item.name;
  form.telephone = item.telephone;
  form.email = item.email;
  form.id = item.id;
  form.password = item.password;
  form.gender = item.gender;
  form.address = item.address;
  dialogFormVisible.value = true;
}
// 删除管理员
async function deleteAdmin(item) {
  loading.value = true;
  const bodyData = [item.id];
  const { code, message } = await deleteAdminApi(bodyData);
  loading.value = false;

  if (code == 200) {
    ElMessage.success(message);
    getAdmin();
  } else {
    ElMessage.error(message);
  }
}
// 批量删除
async function selectDel() {
  loading.value = true;
  const bodyData = selectArr.value;
  const { code, message } = await deleteAdminApi(bodyData);
  loading.value = false;

  if (code == 200) {
    ElMessage.success(message);
    getAdmin();
  } else {
    ElMessage.error(message);
  }
}
// 搜索
function search() {
  page.value = 1;
  getAdmin();
}
// 列选中状态 触发
function handleSelectionChange(val) {
  selectArr.value = [];
  val.forEach((it) => {
    selectArr.value.push(it.id);
  });
}

// 添加
function saveForm() {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      delete form.password2;
      const { code, message } = await saveOrUpdateAdminApi(form);
      loading.value = false;

      if (code == 200) {
        ElMessage.success(message);
        // 关闭弹窗
        dialogFormVisible.value = false;
        //  刷新列表
        getAdmin();
      } else {
        ElMessage.error(message);
      }
    }
  });
}
// 重置搜索条件
function reset() {
  keyword.value = "";
  getAdmin();
}
function clearForm() {
  const keys = Object.keys(form);
  let obj = {};
  keys.forEach((item) => {
    obj[item] = "";
  });
  Object.assign(form, obj);
}

// 分页事件
function pageChange(v) {
  page.value = v;
  getAdmin();
}
</script>

<style scoped lang="less">
.top-box {
  display: flex;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
}
.input-select {
  width: 30%;
}

.page-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
:deep(.el-form-item) {
  align-items: center;
}
</style>
