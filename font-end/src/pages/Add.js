import React from "react";
import { Button, message } from "antd";
import HttpUtil from "../utils/HttpUtil";
import ApiUtil from "../utils/ApiUtil";
import { withRouter } from "react-router-dom";
import "./Add.css";

class Add extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      type: "",
      id: "",
      total: "",
      stock: "",
      operator: "",
      time: "",
    };

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

    if (this.props.match.params.id) {
      HttpUtil.get(
        `http://127.0.0.1:5000/getData/${this.props.match.params.id}`
      ) //获取指定id的数据
        .then((staffList) => {
          this.setState({
            name: staffList[0].name,
            type: staffList[0].type,
            id: staffList[0].id,
            total: staffList[0].total,
            stock: staffList[0].stock,
            operator: staffList[0].operator,
            time: staffList[0].time,
          });
        })
        .catch((error) => {
          message.error(error.message);
        });
    }
  }

  totalChange(e) {
    this.setState({
      total: e.target.value,
    });
  }

  nameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  typeChange(e) {
    this.setState({
      type: e.target.value,
    });
  }

  idChange(e) {
    this.setState({
      id: e.target.value,
    });
  }

  stockChange(e) {
    this.setState({
      stock: e.target.value,
    });
  }

  operatorChange(e) {
    this.setState({
      operator: e.target.value,
    });
  }

  timeChange(e) {
    this.setState({
      time: e.target.value,
    });
  }

  returnApp() {
    this.props.history.push(`/`);
  }

  handleSubmit = () => {
    if (
      this.state.name === "" ||
      this.state.type === "" ||
      this.state.id === "" ||
      this.state.total === "" ||
      this.state.stock === "" ||
      this.state.operator === "" ||
      this.state.time === ""
    ) {
      alert("输入信息有误，请重新输入");
    } else {
      const values = {
        name: this.state.name,
        type: this.state.type,
        id: this.state.id,
        total: this.state.total,
        stock: this.state.stock,
        operator: this.state.operator,
        time: this.state.time,
      };
      let test = window.location.href;
      let Url = "";
      //test最后的0表示新增奖品，其他值表示编辑已有奖品，并且test的最后一段为被编辑的奖品的ID
      if (!this.props.match.params.id) {
        Url = 'http://127.0.0.1:5000/AddPrize/0';
      } else {
        Url = `http://127.0.0.1:5000/AddPrize/${this.props.match.params.id}`;
      }
      HttpUtil.post(Url, values).then((re) => {
        message.info(re.message);
      });
    }
  };

  render() {
    return (
      <div>
        <div className="main">
          <form>
            <div className="return-style">
              <Button onClick={this.returnApp}>返回</Button>
            </div>
            <div className="form-item">
              <label>奖品ID</label>
              <div className="input-container">
                <input value={this.state.id} onChange={this.idChange} />
              </div>
            </div>

            <div className="form-item">
              <label>奖品名称</label>
              <div className="input-container">
                <input value={this.state.name} onChange={this.nameChange} />
              </div>
            </div>

            <div className="form-item">
              <label>奖品类型</label>
              <div className="input-container">
                <input value={this.state.type} onChange={this.typeChange} />
              </div>
            </div>

            <div className="form-item">
              <label>奖品总数</label>
              <div className="input-container">
                <input value={this.state.total} onChange={this.totalChange} />
              </div>
            </div>

            <div className="form-item">
              <label>现有库存</label>
              <div className="input-container">
                <input value={this.state.stock} onChange={this.stockChange} />
              </div>
            </div>

            <div className="form-item">
              <label>操作人</label>
              <div className="input-container">
                <input
                  value={this.state.operator}
                  onChange={this.operatorChange}
                />
              </div>
            </div>

            <div className="form-item">
              <label>操作时间</label>
              <div className="input-container">
                <input value={this.state.time} onChange={this.timeChange} />
              </div>
            </div>
            <div className="input-style">
              <input onClick={this.handleSubmit} type="button" value="确定" />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Add);
