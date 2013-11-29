
define([
	"knockout"
	, "text!./template.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(category){
		var self = this;
		self.items = ko.observableArray([])
						.extend({
							fetch : {
								source : '/api/app',
								params : {
									type : 2
								}
							}
						})

		self.items.reload();

		self.reload = function(){
			self.items.reload();
		}

		self.remove = function(item){
			//$.get('/api/category', { title : item.title }, function(c){
			//	$.delete('/api/category/' + c[0].id, function(){
					$.delete('/api/app/' + item.id, self.items.reload)
			//	})	
			//})
			
		}
		

		self.edit = function(item){
			bus.trigger('budget_start_edit', item.id);	
		}
	

		self.add = function(){
			bus.trigger('budget_start_edit');
		}

		self.template = template;
	}
});
