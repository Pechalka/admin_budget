
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

		self.parent_id = ko.observable(model.parent_id);
		self.items = ko.observableArray([])
						.extend({
							fetch : {
								source : '/api/category',
								params : {
									parent_id : self.parent_id
								}
							}
						})

		self.items.reload();

		self.pageTitle = ko.observable('Categories')
							.extend({
								fetch : {
									source : '/api/category/' + model.parent_id,
									proccessReponse : function(category){
										var c = category ? category.title : 'Top';
										return 'Categories ' + c;
									}
								}
							})
		self.pageTitle.reload();


		self.title = ko.observable();
		self.remove = function(item){
			$.delete('/api/category/' + item.id, function(){
				self.items.reload();	
			})
		}
		

		self.selectCategory = function(c){
			self.parent_id(c.id);
		}

		self.add = function(){
			$.post('/api/category', { title : self.title(), parent_id : self.parent_id() }, function(){
				self.items.reload();
			})
		}

		self.template = template;
	}
});
