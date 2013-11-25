define([ 
    "Sammy" 
    , "knockout"
    , "bus"
    , "app/viewModels/Page"
    , "app/viewModels/ChildCategory"
    , "app/viewModels/FieldsPopup"
    , "app/viewModels/FieldList"
    , "app/viewModels/TestForm"
    , "utils"
    , "REST"
    , "bootstrap"
    , "templateEngine"

    ],function(
        Sammy
        , ko
        , bus
        , Page
        , ChildCategory
        , FieldsPopup
        , FieldList
        , TestForm
        ) {

var app = {
        breadcrumb : ko.observableArray([
                { name : 'Home', href : '#/app' },
                { name : 'Stationnery', href : '#/app' },
                { name : 'Invitation', href : '#/app' }
            ]),
        popup : ko.observable(null),
        content : ko.observable(null)
    };




    bus.on('fields_set', function(){
        app.popup(new FieldsPopup())
        $('#edit-form').modal('show');
    })


    bus.on('close_popup', function(){
        app.content().updateFieldSet();
    })


    return  Sammy(function(){

        this.get('#/test', function(){
            app.content(new TestForm());
            app.breadcrumb([
                { name : 'Home', href : '#/app' },
                { name : 'Test Form', href : '#/app' }
            ]);
        })

        this.get('#/app', function(){
            app.content(new Page());
            app.breadcrumb([{ name : 'Home', href : '#/app' }]);
        })

        this.get('#/app/:id', function(){
            $.get('/api/app_category/' + this.params["id"], function(category){
                app.content(new ChildCategory(category));
                app.breadcrumb([
                    { name : 'Home', href : '#/app' },
                    { name : category.title , href : '#/app/' + category.id  }
                ]);
            })
        })

        this.get('#/app/:parentId/:id', function(){
            var parentId = this.params["parentId"];
            var id = this.params["id"];
            $.get('/api/app_category/' + id, function(category){
                app.content(new FieldList(category));
                var breadcrumb = [{ name : 'Home', href : '#/app' }];
                $.get('/api/app_category/' + parentId, function(parent){
                    breadcrumb.push({name : parent.title , href : '#/app/' + parent.id});
                    breadcrumb.push({name : category.title , href : '#/app/' + parent.id + '/' + category.id}); 
                    app.breadcrumb(breadcrumb);
                });
            })
        })


        this.get('', function (req) {
            window.location = '#/app';
        });

        this.bind('run', function(){
            ko.applyBindings(app);
        })
    });
});    