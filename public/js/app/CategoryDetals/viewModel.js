define([
 "knockout"
 , "text!./template.html"
 , "bus"
 ], function(
  ko
  , template
  , bus
  ){

    var initField = function(self, fields){
        for(var field in fields){
           if (['id', 'app_id', 'title', 'can_delete', 'category_id', 'total_cost'].indexOf(field)!=-1) continue;

           self.fields.push({ label : field, visable : ko.observable(fields[field]), canEdit : true })
        }

        self.sync = ko.computed(function(){
            var data = ko.toJS(self.fields);

            if (!self.sync) return;

 
            console.log('update', data);

            ko.utils.arrayForEach(data, function(item){
                if (['id', 'title', 'app_id', 'can_delete', 'category_id', 'total_cost'].indexOf(item.label)!=-1) return;
                
                self.templateFieldsItem[item.label] = item.visable ? 1 : 0;    
            });
    

            $.put('/api/template_fields/' + self.templateFieldsItem.id, self.templateFieldsItem , function(){
                
            });

        })
    }


 return function(model){
  var self = this;
  self.templates = ['Table', 'TableJoinWith', 'TableAnual', 'TableAnualHolidays', 'Table5field', 'Table8field', 'Table2field'];
  self.selectedTemplate = ko.observable('Table');
  self.template_id = ko.observable();
  self.category = null;
    self.appId = ko.observable();
  
    self.fields = ko.observableArray([ 
        { label : 'title', visable : ko.observable(true), canEdit : false }, 
        { label : 'total_cost', visable : ko.observable(true), canEdit : false }     
    ]);

    

  self.templateFieldsItem = ko.observable();



  $.get('/api/template_fields', { category_id : model.parent_id, app_id : 26 }, function(details){
    if (details.length == 0){
      $.post('/api/template_fields', { category_id : model.parent_id, app_id : 26 }, function(d){
        self.templateFieldsItem = d;
        initField(self, d);
      })
    } else {
      $.get('/api/template_fields/' + details[0].id, function(d){
        self.templateFieldsItem = d;
        initField(self, d);
      });     
    }
  });

  $.get('/api/category/' + model.parent_id, function(c){
    self.category = c;
    self.selectedTemplate(c.template);   
  });
  
  
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
   $.post('/api/expenditure_type_new', { app_id : self.appId(), type : self.type(),  title : self.title, category_id : model.parent_id }, function(){
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