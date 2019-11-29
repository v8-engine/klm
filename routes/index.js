const express = require('express');
//引入连接池模块
const pool = require('../pool.js');
//创建路由器对象 
var router = express.Router();
//个职业全国的平均工资
router.get("/", (req, res) => {
    console.log(1)
    var sql = "select type_name name, avg(max_salary+min_salary) value from it_cat, it_position where it_cat.id=it_position.pid group by it_cat.id,it_cat.type_name";
    pool.query(sql, (err, roustl) => {
        if (err) throw err;
        // console.log(roustl);
        if (roustl.length != 0) {
            console.log(roustl);
            res.send({
                code: 200,
                msg: "成功",
                data: roustl
            })
        }
    })
})
//各个城市的平均工资
router.get("/get", (req, res) => {
    // console.log(1)
    var sql = "select city,avg(max_salary+min_salary) salary from it_cat,it_position where it_cat.id=it_position.pid and it_position.city not like '%-%' group by it_position.city";
    // console.log(sql);
    pool.query(sql, (err, result) => {
        if (err) throw err;
        // console.log(1);
        if (result.length != 0) {
            res.send({
                code: 200,
                msg: "OK",
                data: result
            })
        } else {
            console.log(result)
            res.send({ code: 204 })
        }
    })
}),
//每个城市每个职业的工资
router.get("/position",(req,res)=>{
      // console.log(1)
      var sql = "select it_position.city,it_cat.type_name,avg(it_position.max_salary+it_position.min_salary) as avg from it_cat join it_position on it_cat.id=it_position.pid and it_position.city not like '%-%' group by it_position.city,it_cat.id";
      // console.log(sql);
      pool.query(sql,(err,result)=>{
        if(err) throw err;
        // console.log(1);
        if(result.length !=0){
          res.send({
            code:200,
            msg:"OK",
            data:result
          });
    
        }else{
          res.send({code:204})
        }
      })
    }),
    //4.职位学历工作经验对应薪资
    router.post('/citySalary', function (req, res) {
        console.log(req.body);
        //    var a =JSON.parse(req.body)
        //    console.log(a);
        var $type_name = req.body.type_name;//表it_cat 职位
        var $edu = req.body.edu;//表it_position  学历
        // var $experience=req.body.experience;//表it_position 工作年龄
        var $city = req.body.city;
        console.log($type_name, $edu, $city)
        var sql = `SELECT  * FROM  it_cat,it_position WHERE it_cat.id=it_position.pid `;
        if ($type_name) {
            sql += "AND type_name like ? ";
        }
        if ($edu) {
            sql += "AND edu=? ";
        }
        if ($city) {
            sql += " AND city=? ";
        }
        sql += `GROUP BY it_position.position_name`;
        // console.log(sql)
        // var sql="SELECT  it_cat.id,type_name,edu,experience,avg(max_salary+min_salary)?salary FROM  it_cat,it_position WHERE it_cat.id=it_position.pid AND type_name='web前端工程师' AND edu='大专' AND experience=3 GROUP BY it_position.position_name ";               
        pool.query(sql, ["%" + $type_name + "%", $edu, $city], function (err, result) {
            if (err) throw err;
            console.log(result);
            if (result.length == 0) {
                res.send({ code: 204 })
            }
            else {
                res.send({
                    code: 200,
                    msg: "成功",
                    data: result
                })
            }
        })
    })
//
router.get("/number",(req,res)=>{
    
    var sql="select it_cat.id,it_position.pid,type_name,it_position.position_name,it_position.city,sum(num) from it_cat join it_position on it_cat.id=it_position.pid AND it_position.pid=it_position.pid and  it_position.city NOT LIKE '%-%' GROUP BY it_position.city,it_cat.id ASC;"
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        if (result.length!=0){
            res.send({
                code:200,
                msg:"ok",
                data:result
            })
        } else {
            res.send({
                code:204
            })
        }
    })
})
router.post("/city", (req, res) => {
    var name = req.body.city;
    console.log(name)
    var sql = "select city,position_name,avg(max_salary+min_salary) salary from it_cat join it_position on it_cat.id=it_position.pid where it_cat.type_name=? group by it_position.city;"
    pool.query(sql, [name], (err, result) => {
        if (err) throw err;
        if (result.length != 0) {
            res.send({
                code: 200,
                msg: "ok",
                data: result
            })
        } else {
            res.send({
                code: 204
            })
        }
    })
})


module.exports = router;