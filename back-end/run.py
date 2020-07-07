from flask import Flask, request
import json
import SqliteUtil as DBUtil
app = Flask(__name__)


@app.after_request
def cors(environ):
    environ.headers['Access-Control-Allow-Origin']='*'
    environ.headers['Access-Control-Allow-Method']='*'
    environ.headers['Access-Control-Allow-Headers']='x-requested-with,content-type'
    return environ

@app.route('/hi')
def hello_world():
    return 'Hello World!'

# apiPrefix = '/api'


@app.route('/AddPrize/<int:isUpdate>',  methods=['GET', 'POST'])
def updateStaff(isUpdate):
    if request.method == 'POST':
        data = request.get_data(as_text=True)
        print(isUpdate)
        re = DBUtil.addOrUpdateStaff(data,isUpdate)    
        return json.dumps(re)
    # return 'Hello World!'
    
@app.route('/getData/<int:job>')
def getStaffList(job):
    print("---------------------job", job)
    array = DBUtil.getStaffList(job)  # [('1', '1', '1', '1', '1'), ('1', '1', '2', '3', '4'), ...] 二维数组
    print("---------------------array", array)
    jsonStaffs = DBUtil.getStaffsFromData(array)
    print("jsonStaffs:", jsonStaffs)
    # 变成字符串形式
    return json.dumps(jsonStaffs)
    # return 'Hello World!'

@app.route('/deleteData/<int:id>')
def deletePrize(id):
    # return str(id)+"hi"
    re = DBUtil.deletePrize(id)
    return re


@app.route('/searchPrize/<idSearch>/<typeSearch>')
def searchStaff_2(idSearch,typeSearch):
    # data = request.args.get('where')
    print('idSearch:', idSearch)
    print('typeSearch:', typeSearch)
    # where = json.loads(data)
    array = DBUtil.searchStaff_2(idSearch,typeSearch)
    jsonStaffs = DBUtil.getStaffsFromData_2(array)
    print('jsonStaffs:', jsonStaffs)
    re = json.dumps(jsonStaffs)
    print('re:', re)
    return re


if __name__ == '__main__':
    app.run()
