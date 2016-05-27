var _ = require('./util');


function Element(tagName, props, children){

	if(!this instanceof Element){
		return new Element(tagName, props, children);
	}

	if(_.isArray(props)){
		children = props;
		props = {};
	}

	this.tagName = tagName;
	this.props = props || {};
	this.children = children || [];
	this.key = props ? props.key : void 666; 

	var count = 0;
	_.each(children, function(child, i){
		if(child instanceof Element){
			count += child.count;
		}else{
			children[i] = '' + child;
		}
		count++;
	});

	this.count = count;

}

Element.prototype.render = function(){

	var tagName = this.tagName;
	if(!tagName){
		return false;
	}
	var el = document.createElement(tagName);

	var props = this.props;
	for(var propName in props){
		var propsValue = props[propName];
		_.setAttr(el, propName, propsValue);
	}

	_.each(this.children, function(child){
		var childNode = child instanceof Element 
		? child.render()
		: document.createTextNode(child);

		el.appendChild(childNode);
	});

	return el;
}

module.exports = Element;