var _ = require('./util');

function patch(root, patches){

	var walker = {index:0};

	patchWalk(root, walker.index, patches);

}

var patchWalk = function(node, walker, patches){
	var currentPatch = patches[walker.index];

	var len = node.children ? node.children.length : 0;

	for(var i = 0 ; i < len ; i++){
		var child = node.childNodes[i];
		walker.index++;
		patchWalk(child, walker, patches);
	}
	if(currentPatch){
		applyPatches(node, currentPatch);
	}
	
};
var applyPatches = function(node, currentPatch){
	_.each(currentPatch, function(currentPatchItem, index){

		switch (currentPatchItem.type){
			case 'TEXT':
				var textContent = currentPatchItem.content;
				if(node.textContent){
					node.textContent = textContent;
				}else{
					// ie
					node.nodeValue = textContent;
				}

				break;
			case 'PROPS':
				setProps(node, currentPatchItem.props);
				break;
			case 'REORDER':
				reorderChildren(node, currentPatchItem.moves);
				break;
			case 'REPLACE':
				var newNode = currentPatchItem.content;
				var newDom = _.isString(content) ? document.createTextNode(content) : node.render();
				node.parentNode.replaceChild(newDom);
				break;
			default:
				throw new Error('Unknown patch type '+ currentPatchItem.type);
		}
	});	
}
var setProps = function(node, prop){

	for(var propName in prop){
		if(prop[propName] === void 0){
			node.removeAttribute(propName);
		}else{
			var value = prop[propName];
			_.setAttr(node, propName, value);
		}
		
	}	
};

var reorderChildren = function(node, moves){
	var staticNodeList = _.toArray(node.children);
	var maps = {};
	
	_.each(staticNodeList, function(staticNodeItem){
		if(node.nodeType === 1){
			var staticNodeItemKey = staticNodeItem.key;
			if(staticNodeItemKey){
				maps[staticNodeItemKey] = staticNodeItem;
			}
					
		}

	});

	_.each(moves, function(move){
		var index = move.index;
		if(move.type === 0){
			// remove item
			if(staticNodeList[index] === node.childNodes[index]){
				node.removeChild(node.childNodes[index]);
			}
			staticNodeList.splice(index, 1);

		}else if(move.type === 1){
			// insert item
			var insertItem = maps[move.item.key] ?
								maps[move.item.key] :
								(typeof move.item === 'object') ?
								move.item.render() :
								document.createTextNode(move.item);
			staticNodeList.splice(index, 0, insertNode);
			node.insertBefore(insertNode, node.childNodes[index]||null);

		}
	});
};

module.exports = patch;