var _ = require('./util');
var patch = require('./patch');
var listDiff = require('./list-diff2');

// reorder 节点重新排列 
// replace  节点替换
// text 文本更新
// props 属性更新
function diff(oldNode, newNode){

	var index = 0;
	var patches = [];

	this.dfsWalk(oldNode, newNode, index, patches);

	return patches;
}

diff.prototype.dfsWalk = function(oldNode, newNode, index, patches){
	var currentPatches = [];

	if(!newNode){

	}else if(_.isString(oldNode) && _.isString(newNode)){
		// update text node
		currentPatches={type: 'TEXT', content: newNode};
	}else if(oldNode.tagName === newNode.tagName){
		// update props
		this.diffProps(oldNode.props, newNode.props);
		// compare child node
		if (!(oldNode.count === 0 || newNode.count === 0)){
			this.diffChildren(oldNode.children, newNode.children);
		}
	}else{
		// replace oldNode
		currentPatches={type: 'REPLACE', content: newNode};
	}
	patches[index] = currentPatches;
	index++;
};

diff.prototype.diffChildren = function(oldChildren, newChildren){
	// reorder child node
	var diffs = listDiff(oldChildren, newChildren);

	if(diffs.moves.length){
		var reorderPatch = {type: 'REORDER', moves: diffs.moves};
		currentPatch.push(reorderPatch);
	}

	

};

diff.prototype.diffProps = function(oldProps, newProps){
	var diffProps = {type: 'PROPS', prop: {} };
	var propName;
	for(propName in oldProps){
		if(oldProps[propName] !== newProps[propName]){
			diffProps.prop[propName] = newProps[propName];
		}
	}
	for(propName in newProps){
		if(!oldProps[propName]){
			diffProps.prop[propName] = newProps[propName];
		}
	}
	currentPatches = diffProps;
};