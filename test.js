var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');
var child_process = require("child_process"),
	carryCmd = require('child_process').exec;
// app.all('*', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
//     res.header("X-Powered-By", ' 3.2.2');
//     res.header("Content-Type", 'application/json;charset=utf-8');
// });
var ss = '';

// var options = {
//         url: 'https://kyfw.12306.cn/otn/leftTicket/queryA?leftTicketDTO.train_date=2016-12-29&leftTicketDTO.from_station=BJP&leftTicketDTO.to_station=SHH&purpose_codes=ADULT',
//         rejectUnauthorized: false
//     };
// request(options, function(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         console.log(body);
//     } else {
//         console.log([error, response, body]);
//     }
// })


go()
function go() {
	carryCmd('ping kyfw.12306.cn -c 3',function (err, res) {
		if(err){
			console.log('5s replay')
			setTimeout(go, 5000)
		} else {
			var data = res.match(/PING 12306https\.xdwscache\.ourglb0\.com \((.*)\): 56 data bytes/)
			try {
				console.log(data[1])
				ss = data[1];
				save()
			} catch(e) {
				console.log('5s replay')
				setTimeout(go, 5000)
			}
		}
	});
	
	// request.post({url:'http://tool.chinaz.com/nslookup/', form: {host:'kyfw.12306.cn'}}, function(error, response, body) {
	//     if (!error && response.statusCode == 200) {
	//     	var $ = cheerio.load(body);
	//     	if (!$('.NslookList.fz16').text()) {
	//     		setTimeout(go, 30000)
	//     	}
	//     	var arr = $('.NslookList.fz16').text().replace(/ /g, '').replace(/\n/g, ',').split(',');
	//     	arr.forEach(function(v, i) {
	//     		if (!!v) {
	//     			ss.push(v)
	//     		}
	//     	})
	//     	save();
	//         console.log($('.NslookList.fz16').text().replace(/ /g, '').replace(/\n/g, ','));
	//     } else {
	//     	setTimeout(go, 30000)
	//         console.log([error, response, body]);
	//     }
	// })
}
function save() {
	fs.readFile("dd.txt", "utf8", function(error, data) {
		if (error) {
			setTimeout(save, 2000)
		} else {
			data = JSON.parse(data);
			if (data.indexOf(ss) == -1) {
				data.push(ss)
				console.log('IP:' + data.length + 1)
				var new_text = JSON.stringify(data);
				fs.writeFile("dd.txt", new_text, function (err) {
					if (err) {
						setTimeout(go, 60000)
					} else {
						setTimeout(go, 60000)
						console.log("File Saved !");
					}
				})
			} else {
				ss = '';
				console.log("File There are !");
				setTimeout(go, 60000)
			}
		}
	})
	
}
// $.ajax({
// 	url: 'http://tool.chinaz.com/nslookup/',
// 	method: 'POST',
// 	data: {
// 		'host': 'kyfw.12306.cn',
// 	},
// 	success: function(data) {
// 		console.log(data)
// 		if (data.status) {
// 			cb()
// 		}
// 	},
// 	error: function(e) {
// 		console.log(e);
// 	}
// })