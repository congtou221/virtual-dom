var _ = require('./util');
var patch = require('./patch');
var listDiff = require('list-diff2');

// reorder 节点重新排列 
// replace  节点替换
// text 文本更新
// props 属性更新
function diff(oldNode, newNode){

	var index = 0;
	var patches = [];

	dfsWalk(oldNode, newNode, index, patches);

	return patches;
}

var dfsWalk = function(oldNode, newNode, index, patches){
	var currentPatches = [];

	if(!newNode){

	}else if(_.isString(oldNode) && _.isString(newNode)){
		// update text node
		currentPatches.push({type: 'TEXT', content: newNode});
		patches[index] = currentPatches;
	}else if(oldNode.tagName === newNode.tagName && oldNode.key === newNode.key){
		// update props

		var propPatches = diffProps(oldNode.props, newNode.props);
		if(propPatches){
			currentPatches.push({type: 'PROPS', prop: propPatches});
		}
		// compare child node
		if (!(oldNode.count === 0 || newNode.count === 0)){
			diffChildren(
				oldNode.children, 
				newNode.children,
				index,
				currentPatches,
				patches
				);
		}else{
			patches[index] = currentPatches;
		}
	}else{
		// replace oldNode
		currentPatches.push({type: 'REPLACE', content: newNode});
		patches[index] = currentPatches;
	}
	

};

var diffChildren = function(oldChildren, newChildren, index, currentPatches, patches){
	// reorder child node
	var diffs = listDiff(oldChildren, newChildren, 'key');
	newChildren = diffs.children;  //?

	if(diffs.moves.length){
		var reorderPatch = {type: 'REORDER', moves: diffs.moves};
		currentPatches.push(reorderPatch);
		patches[index] = currentPatches;
	}

	var leftNode = null;
	var currentNodeIndex = index;

	_.each(oldChildren, function(oldChild, index){

		var newChild = newChildren[index];

		currentNodeIndex = (leftNode && leftNode.count)
							? currentNodeIndex + leftNode.count + 1
							: currentNodeIndex + 1;


		dfsWalk(oldChild, newChild, currentNodeIndex, patches);
		leftNode = oldChild;
	})
	

};

var diffProps = function(oldProps, newProps){
	var count = 0;
	var propName;
	var propPatches = {};

	// update properties
	for(propName in oldProps){
		var value = oldProps[propName];
		if(value !== newProps[propName]){
			propPatches[propName] = newProps[propName];
			count++;
		}
	}
	// add properties
	for(propName in newProps){
		if(!oldProps.hasOwnProperty(propName)){
			propPatches[propName] = newProps[propName];
			count++;
		}
	}
	if(count === 0){
		return null;
	}
	return propPatches;
};

module.exports = diff;