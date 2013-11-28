
define([
	"knockout"
	, "text!./template.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(model){
		var self = this;
		self.templates = ['Table', 'TableJoinWith', 'TableAnual', 'TableAnualHolidays'];
		self.selectedTemplate = ko.observable('Table');
		self.template_id = ko.observable();

		$.get('/api/category_template', { category_new_id : model.parent_id }, function(c){
			if (c.length){
				self.selectedTemplate(c[0].title);
				self.template_id(c[0].id)				
			}
		});
		
		self.status = ko.observable('init');

		var complete = function(){
			self.status('complete');
			setTimeout(function(){
				self.status('init');
			}, 2000)
		}

		self.change_template = function(){
			if (self.status() == 'proccess') return;

			var data = { title : self.selectedTemplate()};
			self.status('proccess');
			if (self.template_id())
				$.put('/api/category_template/' + self.template_id(), data, complete)
			else
				$.post('/api/category_template', data, complete);
		}

		self.title = ko.observable();
		self.add = function(){
			$.post('/api/expenditure_type_new', { title : self.title, category_id : model.parent_id }, function(){
				self.types.reload();
			})
		}

		self.remove = function(item){
			$.delete('/api/expenditure_type_new/' + item.id, function(){
				self.types.reload();		
			})
		}

		self.types = ko.observableArray([])
						.extend({
							fetch : {
								source : '/api/expenditure_type_new',
								params : {
									category_id : model.parent_id
								}
							}
						});
		self.types.reload();			

		// self.parent_id = ko.observable(model.parent_id);
		// self.items = ko.observableArray([])
		// 				.extend({
		// 					fetch : {
		// 						source : '/api/category',
		// 						params : {
		// 							parent_id : self.parent_id
		// 						}
		// 					}
		// 				})

		// self.items.reload();

		// self.pageTitle = ko.observable('Categories')
		// 					.extend({
		// 						fetch : {
		// 							source : '/api/category/' + model.parent_id,
		// 							proccessReponse : function(category){
		// 								return 'Categories ' + category.title;
		// 							}
		// 						}
		// 					})
		// self.pageTitle.reload();


		// self.title = ko.observable();
		// self.remove = function(item){
		// 	$.delete('/api/category/' + item.id, function(){
		// 		self.items.reload();	
		// 	})
		// }
		

		// self.selectCategory = function(c){
		// 	self.parent_id(c.id);
		// }

		// self.add = function(){
		// 	$.post('/api/category', { title : self.title(), parent_id : self.parent_id() }, function(){
		// 		self.items.reload();
		// 	})
		// }

		self.template = template;
	}
});
