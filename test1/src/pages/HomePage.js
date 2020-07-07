import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Form, Layout, Table, Input, Button, Select, Modal, message } from 'antd';
// import Highlighter from 'react-highlight-words';
//import SearchOutlined from '@ant-design/icons';
//import  Space  from '@ant-design/icons';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ApiUtil from '../utils/ApiUtil';
import HttpUtil from '../utils/HttpUtil';
const { Header, Content } = Layout;

const { Option } = Select;
//第一行 目录
let columns = [
  {
    title: '奖品ID',
    dataIndex: 'id',
    width: "200px",
  },
  {
    title: '奖品名称',
    dataIndex: 'name',
    width: "200px",

  },
  {
    title: '奖品图标',
    dataIndex: 'icon',
    width: "200px",
  },
  {
    title: '奖品类型',
    dataIndex: 'type',
    width: "200",
  },
  {
    title: '奖品总数',
    dataIndex: 'total',
    width: "200px",
  },
  {
    title: '现有库存',
    dataIndex: 'stock',
    width: "200px",
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    width: "200px",
  },
  {
    title: '操作时间',
    dataIndex: 'time',
    width: "200px",
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: "200px",
  }
];

const dataSource = [
  //   {
  //     //如果 dataIndex 唯一，则 key 值可忽略
  //     id: '123',
  //     name: '测试奖品-小米商城兑换券',
  //     icon: '',
  //     type: '虚拟-小米商城兑换券',
  //     total: '7',
  //     stock: '2',
  //     operator: 'sunwan',
  //     time: '2020-01-23-21:23:43',
  //     operation: '00'
  //   }, {
  //     id: '123',
  //     name: '测试奖品-小米商城兑换券',
  //     icon: '',
  //     type: '虚拟-小米商城兑换券',
  //     total: '7',
  //     stock: '2',
  //     operator: 'sunwan',
  //     time: '2020-01-23-21:23:43',
  //     operation: '00'
  //   }, {
  //     key: '1',
  //     id: '123',
  //     name: '测试奖品-小米商城兑换券',
  //     icon: '',
  //     type: '虚拟-小米商城兑换券',
  //     total: '7',
  //     stock: '2',
  //     operator: 'sunwan',
  //     time: '2020-01-23-21:23:43',
  //     operation: '00'
  //   }, {
  //     key: '1',
  //     id: '123',
  //     name: '测试奖品-小米商城兑换券',
  //     icon: '',
  //     type: '虚拟-小米商城兑换券',
  //     total: '7',
  //     stock: '2',
  //     operator: 'sunwan',
  //     time: '2020-01-23-21:23:43',
  //     operation: '00'
  //   }, {
  //     key: '1',
  //     id: '123',
  //     name: '测试奖品-小米商城兑换券',
  //     icon: '',
  //     type: '虚拟-小米商城兑换券',
  //     total: '7',
  //     stock: '2',
  //     operator: 'sunwan',
  //     time: '2020-01-23-21:23:43',
  //     operation: '00'
  //   }, {
  //     key: '1',
  //     id: '123',
  //     name: '测试奖品-小米商城兑换券',
  //     icon: '',
  //     type: '虚拟-小米商城兑换券',
  //     total: '7',
  //     stock: '2',
  //     operator: 'sunwan',
  //     time: '2020-01-23-21:23:43',
  //     operation: '00'
  //   },
];

// var tmp = {title:'123', money:'1200', card_number:'1002886', name:'王小二', phone:'18066668888', 
//     project:'散打', shop_guide:'江小白', teacher:'王大锤', financial:'图片1', remarks1:'B6A9B5A5BAC5B2E9D1AF',
//     collect_money:'图片2', remarks2:'B6A9B5A5BAC5B2E9D1AF'};

// var data = [];
// for (var i = 0; i < 30; i++) {
//   data.push(tmp);
// }

const Search = ({ value, onChange }) => {
  return (
    <form>
      <input type="text" value={value} onChange={onChange} />
    </form>
  )
}

//表单提交的布局
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 10,
  },
};
const onFinish = values => {
  console.log('Success:', values);
};

const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
function Child() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  // let { id } = useParams();

  return (
    <div>
      <h3>ID: niha</h3>
    </div>
  );
}
function isSearched(searchTerm) {
  return function (item) {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
  };
}


class HomePage extends React.Component {
  mAllData = [];
  state = {
    showInfoDialog: false,
    editingItem: null,
    mData: [], //table里的数据
    title: "新建奖品",
    // visible: "true"
  }
  //React组件生命周期
  componentDidMount() {
    // fetch
    this.getData();//初始化，获取数据并显示
    columns.push(this.admin_item);////加了一列，用来编译或删除

  }
  admin_item = {
    title: '操作',
    render: (staff) => (
      <span>
        <Icon type="edit" onClick={() => this.showUpdateDialog(staff)} />
        <Icon type="close" title="删除" style={{ color: '#ee6633', marginLeft: 12 }} onClick={() => this.deleteConfirm(staff)} />
      </span>
    ),
  };
  //删除商品前进行确认
  deleteConfirm = (staff) => {
    var that = this;//下面的内嵌对象里面，this就改变了，这里先保存一下
    const modal = Modal.confirm({
      title: '确认',
      content: '您确定要删除这条记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.removeData(staff.id);
        modal.destroy();
      },
      onCancel() { },
    });
  }

  //调用get请求删除商品
  removeData(id) {
    HttpUtil.get('http://127.0.0.1:5000/deleteData/' + id)
      .then(
        x => {
          console.log('删除了');
          this.getData();
        }
      )
  }

  //从后台请求所有数据，给mData
  getData() {
    console.log("getdata")
    HttpUtil.get('http://127.0.0.1:5000/getData/0') //获取所有数据
      .then(
        staffList => {
          this.mAllData = staffList;
          console.log("staffList")
          // console.log(staffList)
          this.setState({
            mData: staffList
            // showInfoDialog: false,
          });
          console.log(this.state.mData)
        }
      )
      .catch(error => {
        // message.error(error.message);
      });
  }
  //新建操作的入口
  showUpdateDialog(item) {
    if (item === undefined) {
      item = {};
    }
    this.setState({
      showInfoDialog: true,
      editingItem: item,
    })
  }

  render() {
    const { title } = this.NewPrizeState;
    const { visible } = this.NewPrizeState;
    return (
      <div>
      <Header>
        <div style={{ lineHeight: '64px', fontSize: "20px", color: "white", textAlign: "center" }}>
          奖品管理系统
    </div>
      </Header>
      <Button style={{ position: "absolute", right: "70px", top: "20px" }} ><Link to="/newPrize">新建</Link></Button>
      <Button style={{ position: "absolute", right: "180px", top: "20px" }} ><Link to="/searchPrize">查询</Link></Button>
    
            <Layout>
                <Content > {/* style={{"border":"solid red"}} */}
                  {/* 单独的 padding 表示左右上下均为24 */}
                  <div style={{ background: '#fff', padding: 24, minHeight: 480 }}>
                    {/* <Button style={{ position: "absolute", right: "70px", top: "20px" }} onClick={() => this.showUpdateDialog()}>新建</Button> */}
                    <Table
                      columns={columns}
                      dataSource={this.state.mData}
                      rowKey={item => item.id}  //现阶段，写不写效果一样
                      pagination={{ pageSize: 8 }}
                      //一页表单中内容的高度
                      scroll={{ y: 800 }} />
                  </div>
                </Content>
              </Layout>
      </div>
    )
  }
}

export default HomePage;
