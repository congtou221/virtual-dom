var _ = require('./util');
var diff = require('./diff');

function patch(root, patches){

	var walker = {index:0};

	this.patchWalker(root, walker.index, patches);

}

patch.prototype.patchWalker = function(node, currentIndex, patches){
	var currentPatch = patches[currentIndex];

	switch currentPatch.type
		case 'TEXT':
			var content = currentPatch.content;
			var contentStr = _.isString(content) ? content : content+'';
			var textNode = document.createTextNode(contentStr);
		break;
		case 'PROPS':
			var prop = patch
		break;
		case 'REORDER':

		break;
		case 'REPLACE':

		break;
		default:

}