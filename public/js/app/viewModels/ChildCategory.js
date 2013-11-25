
define([
	"knockout"
	, "text!./../templates/ChildCategory.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(category){
		var self = this;

		self.back = function(){
			bus.trigger('category');
		}

		self.parentId = category.id;

		self.categoryTitle = ko.observable('Sub Category : ' + category.title);

		self.categories = ko.observableArray([])
							.extend({
									fetch : {
										source : '/api/app_category',
										params : {
											parentId : category.id
										}
									}
								});		
		self.categories.reload();

		self.title = ko.observable();
		self.add = function(item){
			var data = {
				parentId : category.id,
				title : self.title()
			};
			$.post('/api/app_category', data, function(){
				self.categories.reload();
			})
		}

		self.remove = function(item){
			$.delete('/api/app_category/' + item.id, function(){
				self.categories.reload();		
			})
		}


		// self.fieldName = ko.observable('');

		// self.fields = ko.observableArray([])
		// 					.extend({
		// 							fetch : {
		// 								source : '/api/budget_fields',
		// 								params : {
		// 									category_id : category.id
		// 								}
		// 							}
		// 						});
		// self.fields.reload();

		// self.fieldsSet = ko.observableArray([])
		// 					.extend({
		// 							fetch : {
		// 								source : '/api/fields'
		// 							}
		// 						});

		// self.fieldsSet.reload();

		// self.fieldsToAdd = ko.observableArray([]);

		// self.field = ko.observable();

		// self.add = function(item){
		// 	var data = {
		// 		category_id : category.id,
		// 		field : self.field()
		// 	};
		// 	$.post('/api/budget_fields', data, function(){
		// 		self.fields.reload();
		// 	})
		// }

		// self.remove = function(item){

		// }

		// self.change_field = function(){
		// 	bus.trigger('fields_set');
		// }

		self.template = template;
	}
});
