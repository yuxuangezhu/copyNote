var express = require('express');
var config = require('./config/config');
var app = express();
var request = require('request');
// var httpProxy = require('http-proxy');
var path = require('path');
var bodyParser = require('body-parser');
var headerBase = [{
        type: '*',
        value: ''
    }, {
        type: '/js/*',
        value: 'application/json;charset=utf-8'
    }, {
        type: '/css/*',
        value: 'text/css;charset=utf-8'
    }]
    //设置跨域限制
headerBase.forEach(function(v, i) {
    app.all(v.type, function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By", ' 3.2.2');
        if (v.value) {
            res.header("Content-Type", v.value);
        }
        next();
    });
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res) {
    res.send('Service has been started！');
})

var Router = express.Router();
// var proxy = httpProxy.createProxyServer({});
// var proxyUrl = 'http://111.206.13.63/'; //线上透传地址
// var jsBase = ['']; //代理路径配置

// // js代理透传
// jsBase.forEach(function(v) {
//     Router.get(v + '*', function(req, res) {
//         var url = 'http://localhost' + v + req.params[0];
//         request(url, function(error, response, body) {
//             if (!error && response.statusCode == 200) {
//                 res.send(body);
//             } else {
//                 proxy.web(req, res, {
//                     target: proxyUrl + req.baseUrl
//                 });
//             }
//         })
//     })
// })

Router.post('/api/saveData', function(req, res) {
    console.log(req.body);
    var pageId = req.body.pageId,
        text = req.body.text;
        config.doQuery("SELECT * FROM test WHERE user='"+ pageId +"'", function(e) {
            console.log(e)
            if (e.data.rows.length != 0) {
                config.doQuery("UPDATE test SET text = '" + text + "' WHERE user='"+ pageId +"'", function(data) {
                    if (data.code == 'A00000') {
                        res.send({
                            code: 'A00000',
                            text: '保存成功！',
                            data: data.data
                        })
                    } else {
                        res.send({
                            code: 'A00001',
                            text: '保存失败！',
                            data: data.data
                        })
                    }
                })
            } else {
                config.doQuery("INSERT INTO  `test`.`test` (`user`, `text`) VALUES ('"+ pageId + "','" + text +"');", function(data) {
                    if (data.code == 'A00000') {
                        res.send({
                            code: 'A00000',
                            text: '保存成功！',
                            data: data.data
                        })
                    } else {
                        res.send({
                            code: 'A00001',
                            text: '保存失败！',
                            data: data.data
                        })
                    }
                })
            }
        })
})
Router.get('/api/getData', function(req, res) {
    console.log(req.query)
    var pageId = req.query.pageId;
        config.doQuery("SELECT * FROM test WHERE user='"+ pageId +"'", function(data) {
            if (data.code == 'A00000') {
                res.send({
                    code: 'A00000',
                    text: '查询成功！',
                    data: data.data
                })
            } else {
                res.send({
                    code: 'A00001',
                    text: '查询失败！',
                    data: data.data
                })
            }
        })
})
Router.get('/api/getText', function(req, res) {
    try {
        var number = req.query.number,
            url = 'http://www.kuaidi100.com/autonumber/autoComNum?text=' + number;
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            }
        })
    } catch(e) {}
})
Router.get('/api/getPhysical', function(req, res) {
    try {
        var number = req.query.number,
            name = req.query.name,
            url = 'http://www.kuaidi100.com/query?type='+ name +'&postid=' + number +'&id=1&valicode=&temp=' + Math.random();
        request(url, function(error, response, body) {
            if (!error && response.statusCode == 200) {
                res.send(body);
            }
        });
    } catch(e) {}
})
app.use('/js', Router);
console.log('Service has been started！');
module.exports = app;