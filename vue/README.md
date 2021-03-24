# vue
## 组件
> vue中常用的一些功能组件
1. tree 单选框
2. treecheck多选框
3. Addandmodify 可以对表格添加一行，并且在给某一行修改
4. Shuttlebox 穿梭框 选中左边多选框 点击添加到右侧表格中

## 资料
1. 表格多选   
reserve-selection   
row-key="wsNbr" 
```javascript
<el-table 
:data="devInfoData" 
:height="tableheight" 
border 
stripe 
row-key="wsNbr" //表格id
class="app-table" 
@selection-change="changeFun">
<el-table-column type="selection" width="55" reserve-selection></el-table-column>
    <el-table-column width="50" label="序号" align="center">
        <template scope="scope">
        <span>{{scope.$index+1}}</span>
        </template>
    </el-table-column>
    <el-table-column property="wsTitle" label="故障标题" align="center" ></el-table-column>
    <el-table-column property="wsNbr" label="工单号" align="center"></el-table-column>
    <el-table-column property="createTime" label="建单时间" align="center"></el-table-column>
    <el-table-column property="wsState" label="分析状态" align="center"></el-table-column>
    <el-table-column property="nodeName" label="分析报告" align="center" >
        <template slot-scope="scope">
        <p v-if="scope.row['wsState']==='finish'"  style="cursor:pointer;margin:0px 10px;overflow:hidden;text-overflow: ellipsis; white-space:nowrap;color:#2c9cfa"  @click="clickWorkExport">下载</p>
        <p v-else></p>
        </template>
    </el-table-column>
</el-table>
```