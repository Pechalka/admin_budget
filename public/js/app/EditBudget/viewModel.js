define([
        "knockout"
        , "jquery"
        , "bus"
        , "text!./template.html"
        ], function(
                ko,
                $,
                bus,
                template
                ){


        return function(model){
            model = model || {};

            var self = this;
            
            self.popupTitle = model.id ? 'update' : 'create'; 
           
            self.close = function(){
                $('#popup').modal('hide');
            }

            self.id = model.id;
            self.title = ko.observable(model.title);
            self.description = ko.observable(model.description);
            self.benefits = ko.observable(model.benefits);
            self.price = ko.observable(model.price);
            self.imgUrl = ko.observable(model.imgUrl || '../img/tea.png');
            self.img1url = ko.observable(model.img1url || '../img/2.png');
            self.img2url = ko.observable(model.img2url || '../img/3.png');
            self.img3url = ko.observable(model.img3url || '../img/4.png');
            self.videoUrl = ko.observable(model.videoUrl || 'http://www.youtube.com/embed/XGSy3_Czz8k')

            var close = function(){
                $('#popup').modal('hide');
                bus.trigger('budget_complete_edit');    
            }

            self.save = function(){
                var data = {
                    type : 2,
                    title : self.title(),
                    description : self.description(),
                    benefits : self.benefits(),
                    price : self.price(),
                    imgUrl : self.imgUrl(),
                    img1url : self.img1url(),
                    img2url : self.img2url(),
                    img3url : self.img3url(),
                    videoUrl : self.videoUrl()
                };
                if (model.id){
                    $.put('/api/app/' + model.id, data, close)
                } else {
                    $.post('/api/category', { title : data.title, parent_id : -1 }, function(){
                        $.post('/api/app', data, close)
                    })
                }
            }

            self.template = template;
        }
});