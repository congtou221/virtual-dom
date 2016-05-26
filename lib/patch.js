var _ = require('./util');

function patch(root, patches){

	var walker = {index:0};

	this.patchWalk(root, walker.index, patches);

}

patch.prototype.patchWalk = function(node, currentIndex, patches){
	var currentPatch = patches[currentIndex];

	_.each(currentPatch, function(currentPatchItem, index){

		switch (currentPatchItem.type){
			case 'TEXT':
				var content = currentPatchItem.content;
				var newTextNode = _.isString(content) ? document.createTextNode(content) : node.render();
				node.parentNode.replaceChild(newTextNode);
				break;
			case 'PROPS':
				this.setProps(node, currentPatchItem);
			break;
			case 'REORDER':
				this.reorderChildren(node, currentPatchItem.moves);
			break;
			case 'REPLACE':
				var newNode = currentPatchItem.content;
				var newDom = newNode.render();
				node.parentNode.replaceChild(newDom);
			break;
			default:
				throw new Error('Unknown patch type '+ currentPatchItem.type);
		}
	});
};

patch.prototype.setProps = function(node, currentPatchItem){
	var prop = currentPatchItem.prop;
	for(var propName in prop){
		if(prop[propName] === void 0){
			node.removeAttribute(propName);
		}
		_.setAttr(node, propName, prop[propName]);
	}	
};

patch.prototype.reorderChildren = function(node, moves){
	var staticNodeList = _.toArray(node.children);
	var maps = {};
	
	_.each(staticNodeList, function(staticNodeItem){
		var staticNodeItemKey = staticNodeItem.key;
		maps[staticNodeItemKey] = staticNodeItem;
	});

	_.each(moves, function(move){
		var index = move.index;
		if(move.type === 0){
			// remove item
			node.removeChild(node.childNodes[index]);
		}else if(move.type === 1){
			// insert item
			var insertItem = maps[move.item.key] ?
								maps[move.item.key] :
								(typeof move.item === 'object') ?
								move.item.render() :
								document.createTextNode(move.item);
			node.insertBefore(insertNode, node.childNodes[index]||null);

		}
	});
};

module.exports = patch;