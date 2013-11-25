var express = require('express')
    , http = require('http')
    , path = require('path')


var app = express();

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



var DAO = require('./dao/DAO').DAO;
var connection = require('./dao/DAO').connection;

DAO('budget_fields').makeREST(app, '/api/budget_fields');
DAO('app_category').makeREST(app, '/api/app_category');
DAO('budget_item').makeREST(app, '/api/budget_item');
DAO('app').makeREST(app, '/api/app');


app.get('/api/fields', function(req, res){
	connection.query('describe budget_item', function(e, rows){
		rows = rows.filter(function(column){
			return column.Field != 'id' && column.Field != 'category_id';
		})
		res.json(rows);
	})
})

app.post('/api/add_budget_column', function(req, res){
	connection.query('ALTER TABLE budget_item ADD ' + req.body.field +' VARCHAR(60); ', function(e, rows){
		res.json('ok');
	})
})

app.post('/api/remove_budget_column', function(req, res){
	var sql = " ALTER TABLE budget_item DROP " + req.body.field +" ";
	connection.query(sql, function(e, rows){
		console.log(e);
		res.json('ok');
	})
})

http.createServer(app).listen(3000, function(){
    console.log('Express server listening on port 3000');
});
