

require.config({
    paths: {
    	"jquery" : "vendor/jquery"
    	, "bootstrap" : "/bootstrap/js/bootstrap.min"
    	, "knockout" : "vendor/knockout-2.3.0"		
    	, "bus" : "libs/bus"
    	, "utils" : "libs/knockout.localStorage"
    	, "REST" : "libs/REST"
    	, "text": "vendor/text"
    	, "templateEngine" : "vendor/stringTemplateEngine"
    	, "Sammy" : "vendor/sammy"
    },
    shim: {
    	"bootstrap" : ["jquery"],
    	"Sammy" : ["jquery"]
    }
})


require([
	"knockout"
	, "jquery"
	, "app/router"
	], function(
		ko
		, $
		, router
	){
	
	$(function() {
		router.run();
	})
});
