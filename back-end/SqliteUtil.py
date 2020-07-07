import pymysql
import json


db_name = 'test1'

conn = pymysql.connect("localhost", "root", "", "test1")
cursor = conn.cursor()


def createTables():
    try:
        sql_create_prize = '''create table IF NOT EXISTS prize(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name VARCHAR(20) NOT NULL,
        )'''
        cursor.execute(sql_create_prize)
        print("创建数据表成功")
    except Exception as e:
        print(repr(e))


createTables()
staffColumns = ("id", "name", "type", "total", "stock", "operator", "time")


def addOrUpdateStaff(json_str, isUpdate):
    print("isUpdate", isUpdate)
    # print(json_str)
    staff = json.loads(json_str)
    id = staff.get('id', 0)
    name = staff.get('name', 0)
    # print(id)
    # print(name)
    result = ''
    newId = id
    keys = ''
    values = ''
    # 修改
    update = ''
    isFirst = True
    # 如果是编辑商品信息
    if(isUpdate != 0):
        isFirst = True
        for key, value in staff.items():
            if isFirst:
                isFirst = False
            else:
                update += ','  # 相当于除了第一个，其他的都需要在最前面加','
            if value == None:
                value = ""
            if isinstance(value, str):
                update += (key + "='" + value + "'")
            else:
                update += (key + "=" + str(value))
        where = "where id=" + str(isUpdate)
        sql = "update prize set %s %s" % (update, where)
        # print("=="*30)
        print(sql)
        cursor.execute(sql)
        result = '更新成功'
        print(cursor.rowcount, result)
        conn.commit()
        re = {
            'code': 0,
            'id': newId,
            'message': result
        }
        return re

    else:  # 如果是添加奖品
        # 判断奖品id是否已存在，如果存在就不可以添加
        sql = "select id from prize"
        cursor.execute(sql)
        usedId = cursor.fetchone()

        while usedId != None:
            print("id:", id)
            print("usedId:", usedId)
            # print(id in usedId)
            print(type(usedId))
            # print(type(id))
            a1 = int(id)
            print(type(a1))
            if a1 == usedId[0]:
                result = '添加失败，奖品id已经存在'
                re = {
                    'code': -1,
                    'id': newId,
                    'message': result
                }
                return re
            usedId = cursor.fetchone()

        # 判断奖品id不存在，可以添加

        for key, value in staff.items():
            if isFirst:
                isFirst = False
            else:
                keys += ','
                values += ','
            keys += key
            if isinstance(value, str):
                values += ("'%s'" % value)
            else:
                values += str(value)
        sql = "INSERT INTO prize (%s) values (%s)" % (keys, values)
        print(sql)
        cursor.execute(sql)
        result = '添加成功'
        newId = cursor.lastrowid
        print(result, "newId:", newId)
        conn.commit()
        re = {
            'code': 0,
            'id': newId,
            'message': result
        }
        return re


def getStaffsFromData(dataList):
    staffs = []
    for itemArray in dataList:   # dataList数据库返回的数据集，是一个二维数组
        # itemArray: ('1', '1', '2', '3', '4')
        staff = {}
        for columnIndex, columnName in enumerate(staffColumns):
            columnValue = itemArray[columnIndex]
            staff[columnName] = columnValue

        staffs.append(staff)
    return staffs


def getStaffList(job):
    # 当job为0时，表示获取所有数据

    tableName = 'prize'  # 数据库名称
    print(type(job))
    if job == 0:
        where = ''
        order = ' order by id asc '  # 按照id的递减顺序排列，之后要改
    else:
        where = "where id=" + str(job)
        order = ''  # 按照id的递减顺序排列，之后要改
    # 元组变为字符串
    columns = ','.join(staffColumns)

    # 拼接成字符串并打印出来
    sql = "select %s from %s %s %s" % (columns, tableName, where, order)
    print(sql)

    cursor.execute(sql)

    dateList = cursor.fetchall()     # fetchall() 获取所有记录
    return dateList


def deletePrize(id):
    try:
        sql = "delete from prize where id=%d" % (id)
        cursor.execute(sql)
        conn.commit()
        re = {
            'message': '删除成功',
        }
        return json.dumps(re)
    except Exception as e:
        re = {
            'code': -1,
            'message': repr(e)
        }
        return json.dumps(re)


def searchStaff_2(idSearch, typeSearch):
    # 只搜索2个属性
    tableName = 'prize'  # 数据库名称
    where = []
    if(idSearch != '0' and typeSearch != '0'):
        where = "where id=" + str(idSearch)+" and type=" + str(typeSearch)
    elif(idSearch == '0' and typeSearch != '0'):
        where = "where type=" + str(typeSearch)
    elif(idSearch != '0' and typeSearch == '0'):
        where = "where id=" + str(idSearch)
    order = ''  # 按照id的递减顺序排列，之后要改
    # 元组变为字符串
    columns = ','.join(staffColumns)

    # 拼接成字符串并打印出来
    sql = "select %s from %s %s %s" % (columns, tableName, where, order)
    print(sql)

    cursor.execute(sql)

    dateList = cursor.fetchall()     # fetchall() 获取所有记录
    return dateList


def getStaffsFromData_2(dataList):
    staffs = []
    for itemArray in dataList:   # dataList数据库返回的数据集，是一个二维数组
        # itemArray: ('1', '1', '2', '3', '4')
        staff = {}
        for columnIndex, columnName in enumerate(staffColumns):
            columnValue = itemArray[columnIndex]
            staff[columnName] = columnValue
        staffs.append(staff)
    return staffs
