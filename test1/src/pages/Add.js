import React from 'react';
import { Form, Layout, Table, Input, Button, Select, Modal, message } from 'antd';
import App from '../App';
import HttpUtil from '../utils/HttpUtil';
import ApiUtil from '../utils/ApiUtil';
import {
  Link, withRouter, Router
} from "react-router-dom";

class Add extends React.Component {

  constructor() {
    super();
    this.state = { name: '', type: '', id: '', total: '', stock: '', operator: '', time: '' };
    // alert(super.props)
    this.nameChange = this.nameChange.bind(this);
    this.typeChange = this.typeChange.bind(this);
    this.idChange = this.idChange.bind(this);
    this.totalChange = this.totalChange.bind(this);
    this.stockChange = this.stockChange.bind(this);
    this.operatorChange = this.operatorChange.bind(this);
    this.timeChange = this.timeChange.bind(this);
    this.returnApp = this.returnApp.bind(this);
  }

  componentDidMount() {
    // fetch
    // this.getData();//初始化，获取数据并显示
    console.log("this.props", this.props)

    if (this.props.match.params.id) {
      ///
      console.log("getdata  by id")
      HttpUtil.get(`http://127.0.0.1:5000/getData/${this.props.match.params.id}`) //获取指定id的数据
        .then(
          staffList => {
            // this.mAllData = staffList;
            console.log("staffList")
            console.log(staffList)
            console.log(staffList[0].id)
            this.setState({
              name: staffList[0].name,
              type: staffList[0].type,
              id: staffList[0].id,
              total: staffList[0].total,
              stock: staffList[0].stock,
              operator: staffList[0].operator,
              time: staffList[0].time
            })
          }
        )
        .catch(error => {
          message.error(error.message);
        });
    }

    // 

  }

  totalChange(e) {
    console.log(e.target.value)
    this.setState({
      total: e.target.value
    })
  }
  nameChange(e) {
    console.log("e.target.value:" + e.target.value)
    this.setState({
      name: e.target.value
    })
  }
  typeChange(e) {
    console.log(e.target.value)
    this.setState({
      type: e.target.value
    })
  }
  idChange(e) {
    console.log(e.target.value)
    this.setState({
      id: e.target.value
    })
  }
  stockChange(e) {
    console.log(e.target.value)
    this.setState({
      stock: e.target.value
    })
  }
  operatorChange(e) {
    console.log(e.target.value)
    this.setState({
      operator: e.target.value
    })
  }
  timeChange(e) {
    console.log(e.target.value)
    this.setState({
      time: e.target.value
    })
  }
  returnApp() {

    // alert("return sucess")
    // this.props.history.push(`/`)
    window.location.href='/'
  }
  handleSubmit = () => {
    // e.preventDefault();
    console.log("handleSubmit");

    // const name = this.state.name;
    // const type = this.state.type;
    if (this.state.name === "" ||
      this.state.type === "" ||
      this.state.id === "" ||
      this.state.total === "" ||
      this.state.stock === "" ||
      this.state.operator === "" ||
      this.state.time === "") {
      alert("输入信息有误，请重新输入")
    }
    else {
      const values = {
        name: this.state.name,
        type: this.state.type,
        id: this.state.id,
        total: this.state.total,
        stock: this.state.stock,
        operator: this.state.operator,
        time: this.state.time
      };
      console.log(values);
      let test = window.location.href;
      let Url = ''
      console.log(test)
      //test最后的0表示新增奖品，其他值表示编辑已有奖品，并且test的最后一段为被编辑的奖品的ID
      if (!this.props.match.params.id) {
        Url = 'http://127.0.0.1:5000/AddPrize/0'
      }
      else {

        Url = `http://127.0.0.1:5000/AddPrize/${this.props.match.params.id}`;

      }
      console.log("Url:" + Url)
      HttpUtil.post(Url, values)
        .then(
          re => {
            message.info(re.message);
          }
        )
    }
  }
  render() {
    return (
      <div>
        <div style={{ position: "absolute", left: "700px", top: "20px" }}>
          <p></p>
          <form>
            <label >
              奖品ID&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            <input value={this.state.id} onChange={this.idChange} />
            </label>
            <p></p>
            <label>
              奖品名称:&nbsp;
            <input value={this.state.name} onChange={this.nameChange} />
            </label>
            <p></p>
            <label>
              奖品类型:&nbsp;
            <input value={this.state.type} onChange={this.typeChange} />
            </label>
            <p></p>
            <label>
              奖品总数:&nbsp;
            <input value={this.state.total} onChange={this.totalChange} />
            </label>
            <p></p>
            <label>
              现有库存:&nbsp;
            <input value={this.state.stock} onChange={this.stockChange} />
            </label>
            <p></p>
            <label>
              操作人&nbsp;&nbsp;&nbsp;&nbsp;:&nbsp;
            <input value={this.state.operator} onChange={this.operatorChange} />
            </label>
            <p></p>
            <label>
              操作时间 :
            <input value={this.state.time} onChange={this.timeChange}></input>
            </label>
            <p></p>
            <input onClick={this.handleSubmit} type="button" value="确定" />
          </form>
        </div>
        <Button style={{ position: "absolute", left: "1100px", top: "20px" }} onClick={this.returnApp}>
          {/* <Link to="/">
          返回
            </Link>
            */}
              返回
        </Button>
      </div>
    );
  }
}
export default withRouter(Add);
