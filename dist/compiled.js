(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports.el = require('./lib/element');
},{"./lib/element":2}],2:[function(require,module,exports){
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
		_.setAttr(el, propKey, propsValue);
	}

	_.each(this.children, function(child){
		var childNode = child instanceof Element 
		? child.render()
		: document.createTextNode(child);

		el.append(childNode);
	});

	return el;
}

module.exports = Element;
},{"./util":3}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
window.vd = require('./index');
},{"./index":1}]},{},[4]);
