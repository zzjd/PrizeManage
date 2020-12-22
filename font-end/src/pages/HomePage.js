import React, { Component } from "react";
import "antd/dist/antd.css";
// import { createBrowserHistory } from 'history';
import { Layout, Table, Button, Select, Modal } from "antd";
import { Icon } from "@ant-design/compatible";

import {
  BrowserRouter as Router,
  withRouter,
  Route,
  Link,
} from "react-router-dom";

import HttpUtil from "../utils/HttpUtil";
const { Header, Content } = Layout;

//因为“操作”列会重复添加，这里用来控制其只添加一次
let isAddOperation = 0;

const { Option } = Select;
//第一行 目录
let columns = [
  {
    title: "奖品ID",
    dataIndex: "id",
    width: "180px",
  },
  {
    title: "奖品名称",
    dataIndex: "name",
    width: "180px",
  },
  {
    title: "奖品类型",
    dataIndex: "type",
    width: "180px",
  },
  {
    title: "奖品总数",
    dataIndex: "total",
    width: "180px",
  },
  {
    title: "现有库存",
    dataIndex: "stock",
    width: "180px",
  },
  {
    title: "操作人",
    dataIndex: "operator",
    width: "180px",
  },
  {
    title: "操作时间",
    dataIndex: "time",
    width: "180px",
  },
];

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

class HomePage extends React.Component {
  constructor() {
    super();
    this.prizeSearch = this.prizeSearch.bind(this);

    this.state = {
      showInfoDialog: false,
      editingItem: null,
      mData: [], //table里的数据
      title: "新建奖品",
      typeSearch: "123",
      idSearch: "234",
    };
  }

  mAllData = [];
  //React组件生命周期
  componentDidMount() {
    // fetch
    this.getData(); //初始化，获取数据并显示

    if (isAddOperation === 0) {
      columns.push(this.admin_item); ////加了一列，用来编译或删除
      isAddOperation++;
    }
  }
  admin_item = {
    title: "操作",
    render: (staff) => (
      <span>
        <Icon
          type="edit"
          title="编辑"
          onClick={() => this.updateDialog(staff)}
        />
        <Icon
          type="close"
          title="删除"
          style={{ color: "#ee6633", marginLeft: 12 }}
          onClick={() => this.deleteConfirm(staff)}
        />
      </span>
    ),
  };

  //编辑奖品信息
  updateDialog = (staff) => {
    this.props.history.push(`/AddPrize/${staff.id}`);
  };
  searchItems = {};
  prizeSearch() {
    this.state.mData = [];
    this.state.idSearch = document.getElementById("prizeId").value;
    this.state.typeSearch = document.getElementById("prizeType").value;
    if (!this.state.typeSearch) this.state.typeSearch = 0;
    if (!this.state.idSearch) this.state.idSearch = 0;

    let url =
      "http://127.0.0.1:5000/searchPrize/" +
      this.state.idSearch +
      "/" +
      this.state.typeSearch;
    HttpUtil.get(url)
      .then((staffLists) => {
        this.mAllData = staffLists;
        this.setState({
          mData: staffLists,
        });
      })
      .catch((error) => {});
    this.props.history.push(`/`);
  }
  //删除商品前进行确认
  deleteConfirm = (staff) => {
    var that = this; //下面的内嵌对象里面，this就改变了，这里先保存一下
    const modal = Modal.confirm({
      title: "确认",
      content: "您确定要删除这条记录吗？",
      okText: "确认",
      cancelText: "取消",
      onOk() {
        that.removeData(staff.id);
        modal.destroy();
      },
      onCancel() {},
    });
  };

  //调用get请求删除商品
  removeData(id) {
    HttpUtil.get("http://127.0.0.1:5000/deleteData/" + id).then((x) => {
      this.getData();
    });
    //动态输出跳转
    // window.location.href = "/";
  }

  //从后台请求所有数据，给mData
  getData() {
    HttpUtil.get(`http://127.0.0.1:5000/getData/0`) //获取所有数据
      .then((staffLists) => {
        this.mAllData = staffLists;
        this.setState({
          mData: staffLists,
          // showInfoDialog: false,
        });
      })
      .catch((error) => {
        // message.error(error.message);
      });
  }

  render() {
    return (
      <div>
        <Header>
          <div
            style={{
              lineHeight: "64px",
              fontSize: "20px",
              color: "white",
              textAlign: "left",
            }}
          >
            奖品管理系统
          </div>
          <label
            style={{
              color: "RGB(255 73 77)",
              position: "absolute",
              right: "500px",
              top: "0px",
            }}
          >
            奖品ID&nbsp;:&nbsp;&nbsp;
            <input
              value={this.state.value}
              type="text"
              id="prizeId"
              style={{ width: "80px", height: "30px" }}
            />
          </label>
          <label
            style={{
              color: "RGB(73 120 55)",
              position: "absolute",
              right: "300px",
              top: "0px",
            }}
          >
            奖品类型&nbsp;:&nbsp;&nbsp;
            <input
              value={this.state.value}
              id="prizeType"
              style={{ width: "80px", height: "30px" }}
              type="text"
            />
          </label>
        </Header>
        <Button style={{ position: "absolute", right: "70px", top: "20px" }}>
          <Link to="/AddPrize">新建</Link>
        </Button>
        <Button
          style={{ position: "absolute", right: "180px", top: "20px" }}
          onClick={this.prizeSearch}
        >
          查询
        </Button>
        <Layout>
          <Content>
            {" "}
            <div style={{ background: "#fff", padding: 24, minHeight: 480 }}>
              <Table
                columns={columns}
                dataSource={this.state.mData}
                pagination={{ pageSize: 8 }}
                //一页表单中内容的高度
                scroll={{ y: 800 }}
              />
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default withRouter(HomePage);
