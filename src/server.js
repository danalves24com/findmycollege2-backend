const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const path = require("path")
app.use(bodyParser.json()) // to process params

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Saniroot",
  database: "edi",
  port: 3306
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to database!");
});
//




app.use(cors())



var controler_get = {


	"describe": function(req, res) {
		var vals = []
		var sql = "describe colleges;"
		con.query(sql, function(err, result) {
			for(var a in result) {
				vals.push(result[a]["Field"])
			}
			res.json({"values": vals})
		})
	},

	"filter" : function(req, res) {
		var param = req.body
		var conditions = []
		for(var a in param) {
			console.log(a)
			var condition = `${a} like '%${param[a]}%'`
			conditions.push(condition)
		}
		var conditions = conditions.join(" and ")
		console.log(conditions)
		var sql = `select * from colleges where ${conditions}`
		con.query(sql, function(err, result){
			if (err) throw err;
			result = result
			var out = {"found": result.length,"results": result}
			res.json(out)
		})
	},
	"about": function(req, res) {
		var param = req.params.param;		
		var sql = "select * from colleges where WEBSITE like '%"+param+"%'";
		console.log(sql)
		con.query(sql, function(err, result) {
			res.send(result)
		})
	},	
	"get_all": function(req, res){
		var param = req.params.param==undefined?10:req.params.param;
		var sql = "select * from colleges;";
		con.query(sql, (err, result) => {
			if(err) throw err;
			res.send(result)
		})
//		res.send("sending all "+param)
	}

}


app.get("/edi/:command/:param",(req, res)=>{
	controler_get[req.params.command](req, res);
})

app.post("/edi/:command", (req, res) => {
	controler_get[req.params.command](req, res);
})


app.get("/edi/:command",(req, res)=>{
	controler_get[req.params.command](req, res);
})



var clientPath = "/client/build"


app.use(express.static(path.join(__dirname, clientPath)));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, clientPath, "index.html"));
});


app.listen(8000, () => console.log("server is listening on port 8000, happy coding"))
