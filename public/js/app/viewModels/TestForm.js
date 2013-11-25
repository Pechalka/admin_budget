
define([
	"knockout"
	, "text!./../templates/TestForm.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(data){
		var self = this;

		self.categories = ko.observableArray([])
								.extend({
									fetch : {
										source : '/api/app_category',
										params : {
											parentId : '!0'
										}
									}
								});
		self.categories.reload();

		self.selectedCategoryId = ko.observable();

		self.field =  ko.observableArray([])
								.extend({
									fetch : {
										source : '/api/budget_fields',
										params : {
											category_id : self.selectedCategoryId
										}
									}
								});
		


		self.items = ko.observableArray([])
								.extend({
									fetch : {
										source : '/api/budget_item'
									}
								});		

		self.get = function(){
			self.field.reload();
			self.items.reload();
		}

		self.addForm = {};

		ko.computed(function(){			
			ko.utils.arrayForEach(self.field(), function(f){
				self.addForm [f.field] = ko.observable('');
			})

		});

		self.update = function(item){
			$.put('/api/budget_item/' + item.id, item, function(){
				self.items.reload();					
			})
		}

		self.add = function(){
			var data = ko.toJS(self.addForm);
			$.post('/api/budget_item', data, function(){
				self.items.reload();
			})
		}

		self.remove = function(item){
			$.delete('/api/budget_item/' + item.id, function(){
				self.items.reload();		
			})
		}

		self.template = template;
	}
});
