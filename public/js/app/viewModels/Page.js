
define([
	"knockout"
	, "text!./../templates/Page.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(data){
		var self = this;

		self.apps = ko.observableArray([])
								.extend({
									fetch : {
										source : '/api/app',
										params : {
											type : 2
										}
									}
								});
		self.apps.reload();

		self.selectedBudgetListId = ko.observable();

		self.categories = ko.observableArray([])
								.extend({
									fetch : {
										source : '/api/app_category',
										params : {
											parentId : 0,
											budgetId : self.selectedBudgetListId
										}
									}
								});

		self.categoryTitle = ko.observable('');
		self.add = function(){
			var title = self.categoryTitle();
			var data = {
				title : title,
				budgetId : self.selectedBudgetListId()
			}
			$.post('/api/app_category', data, function(){
				self.categories.reload();
				self.categoryTitle('');
			})
		}

		self.remove = function(item){
			$.delete('/api/app_category/' + item.id, function(){
				self.categories.reload();	
			})
		}


		self.categories.reload();
		self.template = template;
	}
});
