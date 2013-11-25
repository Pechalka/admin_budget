define([
        "knockout"
        , "jquery"
        , "bus"
        , "text!./../templates/FieldsPopup.html"
        ], function(
                ko,
                $,
                bus,
                template
                ){


        return function(model){
                var self = this;
                
                self.fields = ko.observableArray([])
                                .extend({
                                        fetch : {
                                                source : '/api/fields'
                                        }
                                        
                                });

                self.field = ko.observable();

                self.add = function(){
                        var field = self.field();
                        $.post('/api/add_budget_column', { field : field}, function(){
                                self.fields.reload();
                                self.field(''); 
                        })
                }

                self.remove = function(item){
                        $.post('/api/remove_budget_column', { field : item.Field }, function(){
                                self.fields.reload();
                        })
                }

                self.close = function(){
                        $('#edit-form').modal('hide');
                        bus.trigger('close_popup')
                }

                self.template = template;
        }
});