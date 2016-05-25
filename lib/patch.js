var _ = require('./util');
var diff = require('./diff');

function patch(root, patches){
	_.each(patches, function(patchItem, index){
		switch patchItem.type
			case 'TEXT':
				var content = patch.content;
				var contentStr = _.isString(content) ? content : content+'';
				var textNode = document.createTextNode(contentStr)
			break;
			case 'PROPS':

			break;
			case 'REORDER':

			break;
			case 'REPLACE':

			break;
			default:
	})
}