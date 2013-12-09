var express = require('express')
    , http = require('http')
    , path = require('path')


var app = express();

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));



var DAO = require('./dao/DAO').DAO;
var connection = require('./dao/DAO').connection;



app.delete('/api/category/:id', function(req, res){
	var categoryId = req.params["id"];
	var sql = 'delete from user_category_status_new where category_id=' + connection.escape(categoryId);
	console.log(sql);
	connection.query(sql, function(sql, rows){
		DAO('category_new').remove(categoryId, function(){	
			res.json({ success : true });
		})
	})
})


DAO('budget_fields').makeREST(app, '/api/budget_fields');
DAO('app_category').makeREST(app, '/api/app_category');
DAO('budget_item').makeREST(app, '/api/budget_item');
DAO('app').makeREST(app, '/api/app');

DAO('category_new').makeREST(app, '/api/category');

DAO('expenditure_type_new').makeREST(app, '/api/expenditure_type_new');
DAO('template_fields').makeREST(app, '/api/template_fields');
DAO('user').makeREST(app, '/api/users');





app.get('/api/userbudgets', function(req, res){
	var sql = 'select * from app_payment inner join app on app_payment.app_id = app.id' 
			  +' where app_payment.app_id=' + req.query["budgetId"] + ' and app_payment.user_id=' + req.query["usetId"];

	connection.query(sql, function(e, rows){
		res.json(rows);
	})
})

app.delete('/api/userbudgets', function(req, res){
	var budgetId = req.query["budgetId"] ;
	var userId = req.query["userId"]; 

	var sql = 'delete from app_payment where user_id=' + userId +' and app_id=' + budgetId;
	console.log(sql);
	connection.query(sql , function(e, rows){
		connection.query('delete from test where user_id=' + userId +' and app_id=' + budgetId , function(e, rows){
			res.json({ success : true })
		});
	})
});

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
