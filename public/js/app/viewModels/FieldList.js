
define([
	"knockout"
	, "text!./../templates/FieldList.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(category){
		var self = this;

		self.title = ko.observable('fields for ' + category.title )

		self.fieldName = ko.observable('');

		self.fields = ko.observableArray([])
							.extend({
									fetch : {
										source : '/api/budget_fields',
										params : {
											category_id : category.id
										}
									}
								});
		self.fields.reload();

		self.fieldsSet = ko.observableArray([])
							.extend({
									fetch : {
										source : '/api/fields'
									}
								});

		self.fieldsSet.reload();

		self.fieldsToAdd = ko.computed(function(){
			
			return ko.utils.arrayFilter(self.fieldsSet(), function(f){
				var exist = ko.utils.arrayFirst(self.fields(), function(ff){ return ff.field == f.Field;});
				return !exist;
			})
		})

		self.field = ko.observable();

		self.add = function(item){
			if (!self.field()) return;

			var data = {
				category_id : category.id,
				field : self.field()
			};
			$.post('/api/budget_fields', data, function(){
				self.fields.reload();
			})
		}

		self.remove = function(item){
			$.delete('/api/budget_fields/' + item.id, function(){
				self.fields.reload();
			})
		}

		self.updateFieldSet = function(){
			self.fieldsSet.reload();
		}

		self.change_field = function(){
			bus.trigger('fields_set');
		}

		self.template = template;
	}
});
