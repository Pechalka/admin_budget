
define([
	"knockout"
	, "text!./view.html"
	, "bus"
	], function(
		ko
		, template
		, bus
		){

	return function(model){
		var self = this;

		self.users = ko.observableArray([])
						.extend({
							fetch : {
								source : '/api/users'
							}
						});
		self.users.reload();				
		self.userId = ko.observable();


		self.budgets = ko.observableArray([])
      					.extend({
       						fetch : {
        						source : '/api/app',
        						params : {
         							type : 2
        						}
       						}
      					});
  		self.budgets.reload();
  		self.budgetId = ko.observable();

  		self.UserBudgets = ko.observableArray([])
 


  		var reload = function(){
  			var data = {
				usetId : self.userId(),
				budgetId : self.budgetId()
			}

			if (!self.sync) return;


			$.ajax({
              url : '/api/userbudgets',
              data : $.param(data),
              type : "GET",
              cache : false
            }).done(self.UserBudgets)
		} 

		self.sync = ko.computed(reload);

  		self.deleteItem = function(item){
  			var	budgetId = item.id;
  			var	userId = self.userId();
  			
  			$.delete('/api/userbudgets?budgetId=' + budgetId + '&userId=' + userId, function(json){
  				reload();
  			})
  		}


		self.template = template;
	}
});
