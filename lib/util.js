var _ = exports;

_.type = function(obj){
	return Object.prototype.toString.call(obj).replace(/\[object\s|\]/g, '');
};

_.isArray = function(list){
	return _.type(list) === 'Array';
};

_.isString = function(list){
	return _.type(list) === 'String';
};

_.each = function(array, fn){
	for(var i = 0, len = array.length; i < len ; i++){
		fn(array[i], i);
	}
};

_.toArray = function(listLike){

};

_.setAttr = function(node, key, value){
	switch(key){
		case "style":
			node.style = value;
			break;
		case "value":
			var tagName = node.tagName || '';
			tagName = tagName.toLowerCase();

			if(tagName === 'input' || tagName === 'textarea'){
				node.value = value;
			}else{
				node.setAttribute(key, value);
			}
			break;
		default:
		node.setAttribute(key, value);
		break;
	}
};