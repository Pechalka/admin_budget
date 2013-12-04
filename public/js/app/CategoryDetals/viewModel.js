
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
		self.templates = ['Table', 'TableJoinWith', 'TableAnual', 'TableAnualHolidays', 'Table5field', 'Table8field', 'Table2field'];
		self.selectedTemplate = ko.observable('Table');
		self.template_id = ko.observable();
		self.category = null;

		$.get('/api/category/' + model.parent_id, function(c){
			self.category = c;
			self.selectedTemplate(c.template);			
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

			self.status('proccess');
			
			self.category.template = self.selectedTemplate();

			$.put('/api/category/' + model.parent_id, self.category, complete);
		}

		self.title = ko.observable();
		self.type = ko.observable(0);// ?????????WTF

		self.add = function(){
			$.post('/api/expenditure_type_new', { type : self.type(),  title : self.title, category_id : model.parent_id }, function(){
				self.types.reload();
				self.title('')
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

		self.template = template;
	}
});
