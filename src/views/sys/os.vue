<template>
  <div class="app-container">

    <!-- 查询和其他操作 -->
    <div class="filter-container">
      <el-input v-model="listQuery.key" clearable class="filter-item" style="width: 200px;" placeholder="请输入对象KEY"/>
      <el-input v-model="listQuery.name" clearable class="filter-item" style="width: 200px;" placeholder="请输入对象名称"/>
      <el-button v-permission="['GET /admin/storage/list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查找</el-button>
      <el-button v-permission="['POST /admin/storage/create']" class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <!-- 查询结果 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="正在查询中。。。" border fit highlight-current-row>

      <el-table-column align="center" label="对象KEY" prop="key"/>

      <el-table-column align="center" label="对象名称" prop="name"/>

      <el-table-column align="center" label="对象类型" prop="type"/>

      <el-table-column align="center" label="对象大小" prop="size"/>

      <el-table-column align="center" property="url" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.url" preview="1" width="40">
        </template>
      </el-table-column>

      <el-table-column align="center" label="图片链接" prop="url"/>

      <el-table-column align="center" label="操作" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-permission="['POST /admin/storage/update']" type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button v-permission="['POST /admin/storage/update']" type="primary" size="mini" @click="downloadPicFile(scope.row.key,scope.row.name)">下载</el-button>
          <el-button v-permission="['POST /admin/storage/delete']" type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- 添加对话框 -->
    <el-dialog :visible.sync="createDialogVisible" title="上传对象">
      <el-upload ref="upload" :show-file-list="false" :limit="1" :http-request="handleUpload" action="#" list-type="picture">
        <el-button type="primary">点击上传</el-button>
      </el-upload>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog :visible.sync="updateDialogVisible" title="修改对象名称">
      <el-form ref="dataForm" :rules="rules" :model="dataForm" status-icon label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="对象名称" prop="name">
          <el-input v-model="dataForm.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listStorage, createStorage, updateStorage, deleteStorage } from '@/api/storage'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { downloadFile, getPicture } from '@/utils/download'

export default {
  name: 'Storage',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      picMap: new Map(),
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        key: undefined,
        name: undefined,
        sort: 'add_time',
        order: 'desc'
      },
      createDialogVisible: false,
      dataForm: {
        id: undefined,
        name: ''
      },
      updateDialogVisible: false,
      rules: {
        name: [{ required: true, message: '对象名称不能为空', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.picMap.set(8, 'test')
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      listStorage(this.listQuery).then(response => {
        let listTmp = response.data.data.rows
        this.total = response.data.data.records
        this.listLoading = false
        this.list = listTmp
        // 测试vue中async await 同步方法
        // this.handleListSetting(listTmp)
      }).catch(() => {
        this.list = []
        this.total = 0
        this.listLoading = false
      })
    },
    async handleListSetting(listValues){
      for(var i=0;i<listValues.length;i++){
        let id = listValues[i].id
        let key = listValues[i].key
        await this.getPic(id,key)
        // console.log('=====temp:'+temp)
      }
      await this.setPicList(listValues)
    },
    setPicList(list){
      return new Promise(((resolve, reject) => {
        this.list = list;
      }))
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() {
      this.dataForm = {
        id: undefined,
        name: ''
      }
    },
    handleCreate() {
      this.createDialogVisible = true
    },
    handleUpload(item) {
      this.$refs.upload.clearFiles()

      const formData = new FormData()
      formData.append('file', item.file)
      createStorage(formData).then(response => {
        this.list.unshift(response.data.data)
        this.createDialogVisible = false
        this.$notify.success({
          title: '成功',
          message: '上传成功'
        })
      }).catch(() => {
        this.$message.error('上传失败，请重新上传')
      })
    },
    handleUpdate(row) {
      this.dataForm = Object.assign({}, row)
      this.updateDialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateStorage(this.dataForm).then(() => {
            for (const v of this.list) {
              if (v.id === this.dataForm.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.dataForm)
                break
              }
            }
            this.updateDialogVisible = false
            this.$notify.success({
              title: '成功',
              message: '更新成功'
            })
          }).catch(response => {
            this.$notify.error({
              title: '失败',
              message: response.data.errmsg
            })
          })
        }
      })
    },
    handleDelete(row) {
      deleteStorage(row).then(response => {
        this.$notify.success({
          title: '成功',
          message: '删除成功'
        })
        const index = this.list.indexOf(row)
        this.list.splice(index, 1)
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: response.data.errmsg
        })
      })
    },
    downloadPicFile(url, fileName) {
      //console.log('url:' + url)
      downloadFile('/imgApi/'+url, fileName)
    },
    /*
      获取图片二进制流的方式
     picMap.get(scope.row.id)
     */
    async getPic(id,picName){
      await getPicture(picName).then(res => {
        // console.log('==>respData999999:'+res)
        this.picMap.set(id,res)
      })
    }
}
}
</script>
