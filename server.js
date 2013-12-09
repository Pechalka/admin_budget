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

	connection.query("select * from app where id=" + connection.escape(budgetId), function(e, rows){
		var category_id = rows[0]["categoryId"];
		delete_user_status(category_id, userId, function(){
			var sql = 'delete from app_payment where user_id=' + userId +' and app_id=' + budgetId;
			connection.query(sql , function(e, rows){
				connection.query('delete from test where user_id=' + userId +' and app_id=' + budgetId , function(e, rows){
					res.json({ success : true })
				});
			});
		});
	})
});

var delete_user_status = function(parent_category_id, user_id, cb){
		var get_parent_sql = ' select ' 
		+'   t1.id , t2.id, t3.id ' 
		+' from ' 
		+'    category_new t1 ' 
		+'    left join category_new t2 on t1.id = t2.parent_id ' 
		+'    left join category_new t3 on t2.id = t3.parent_id ' 
		+'where ' 
	    +' t1.id = ' + connection.escape(parent_category_id) ;
	connection.queryCol(get_parent_sql, [], function(err, result) {
		var arr_sql = '(' + result.join(',') + ')';
		var sql = ' delete from user_category_status_new where category_id in ' + arr_sql + ' and user_id = ' + connection.escape(user_id);
		console.log(sql);
		connection.query(sql, cb);
	});
}

app.get('/v/:id/:userId', function(req, res){

// 	var get_parent_sql = 'with name_tree as ('
//    +' select id, parent_id, name'
//    +' from category_new'
//    +' where id = ' + req.params["id"] + ' '
//    +' union all '
//    +' select c.id, c.parent_id, c.name '
//    +' from category_new c '
//    +'   join name_tree p on p.id = c.parent_id '  
// +' )  '
// +' select * '
// +' from name_tree';

	var user_id = req.params["userId"] ;

	var get_parent_sql = ' select ' 
+'   t1.id , t2.id, t3.id ' //t1.title, t2.title, t3.title, t4.title, t5.title
+' from ' 
+'    category_new t1 ' 
+'    left join category_new t2 on t1.id = t2.parent_id ' 
+'    left join category_new t3 on t2.id = t3.parent_id ' 
+'where ' 
   +' t1.id = ' + req.params["id"] ;
	connection.queryCol(get_parent_sql, [], function(err, result) {
		var arr_sql = '(' + result.join(',') + ')';
		var sql = ' select * from user_category_status_new where category_id in ' + arr_sql + ' and user_id = ' + connection.escape(user_id);
		console.log(sql);
		connection.query(sql, function(e, r){
			res.json(r);
		})
	});
})

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
