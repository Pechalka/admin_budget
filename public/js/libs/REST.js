
$.delete = function(url, cb){
	return $.ajax({
		url : url,
		type : 'DELETE',
		success : cb
	})
}

$.put = function(url, data, cb){
	return $.ajax({
		url : url,
		data : data,
		type : 'PUT',
		success : cb
	})
}