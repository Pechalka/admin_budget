define([ 
    "Sammy" 
    , "knockout"
    , "bus"
    , "app/viewModels/Page"
    , "app/viewModels/ChildCategory"
    , "app/viewModels/FieldsPopup"
    , "app/viewModels/FieldList"
    , "app/viewModels/TestForm"
    , "app/CategoriesList/viewModel"
    , "app/BudgetsList/viewModel"
    , "app/EditBudget/viewModel"
    , "app/CategoryDetals/viewModel"
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
        , CategoriesList
        , BudgetsList
        , EditBudget
        , CategoryDetals
        ) {

var app = {
        page : ko.observable('categories'),
        breadcrumb : ko.observableArray([]),
        popup : ko.observable(null),
        content : ko.observable(null)
    };

    bus.on('budget_start_edit', function(e, id){
        if (id){
            $.get('/api/app/' + id, function(model){
                app.popup(new EditBudget(model))
            })
        } else {
            app.popup(new EditBudget())
        }
        $('#popup').modal('show');    
    })

    bus.on('budget_complete_edit', function(){
        app.content().reload();
    })


    bus.on('fields_set', function(){
        app.popup(new FieldsPopup())
        $('#edit-form').modal('show');
    })


    bus.on('close_popup', function(){
        app.content().updateFieldSet();
    })


    var buildBreadcrumb = function(id, cb){
        cb = cb ||  function(){}

        $.get('/api/category/' + id, function(category){
            if (!category) cb();
            else {
                app.breadcrumb.unshift ({ name : category.title, href : '#/category/' + category.id })
                if (category.parent_id == 0){
                    cb();
                }
                else{
                    buildBreadcrumb(category.parent_id, cb)
                }
            }
        })
    }

    return  Sammy(function(){

        this.get('#/test', function(){
            app.content(new TestForm());
            app.breadcrumb([
                { name : 'Home', href : '#/app' },
                { name : 'Test Form', href : '#/app' }
            ]);
        })

        this.get('#/category', function(){
            app.content(new CategoriesList({ parent_id : 0 }));
            app.page('categories')
            app.breadcrumb([]);
            buildBreadcrumb(0, function(){
                app.breadcrumb.unshift({ name : 'categories', href : '#/category'});    
            })
        })

        this.get('#/category/:parent_id', function(){
            app.content(new CategoriesList({ parent_id : this.params["parent_id"] }));
            app.page('categories');
            app.breadcrumb([]);
            buildBreadcrumb(this.params["parent_id"], function(){
                app.breadcrumb.unshift({ name : 'categories', href : '#/category'});    
            })
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

        this.get('#/budgets', function(){
            app.content(new BudgetsList());
            app.page('budgets')
            app.breadcrumb([
                { name : 'Budgets', href : '#' }
            ]);
        })


        this.get('#/categorydetails/:id', function(){
            app.content(new CategoryDetals({ parent_id : this.params["id"]}));
            app.page('categories');
            app.breadcrumb([]);
            buildBreadcrumb(this.params["id"], function(){
                app.breadcrumb.unshift({ name : 'categories', href : '#/category'});    
                app.breadcrumb.push({ name : 'details', href : '#'})
            })
        })


        this.get('', function (req) {
            window.location = '#/category';
        });

        this.bind('run', function(){
            ko.applyBindings(app);
        })
    });
});    