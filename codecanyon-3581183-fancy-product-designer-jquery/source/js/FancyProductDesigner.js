(function (global){

	"use strict";

	var fabric=global.fabric||(global.fabric={}),
			extend=fabric.util.object.extend,
			clone=fabric.util.object.clone;

	if(fabric.CurvedText){
		fabric.warn('fabric.CurvedText is already defined');
		return;
	}
	var stateProperties=fabric.Text.prototype.stateProperties.concat();
	stateProperties.push(
			'radius',
			'spacing',
			'reverse',
			'effect',
			'range',
			'largeFont',
			'smallFont'
			);
	var _dimensionAffectingProps=fabric.Text.prototype._dimensionAffectingProps;
	_dimensionAffectingProps['radius']=true;
	_dimensionAffectingProps['spacing']=true;
	_dimensionAffectingProps['reverse']=true;
	_dimensionAffectingProps['fill']=true;
	_dimensionAffectingProps['effect']=true;
	_dimensionAffectingProps['width']=true;
	_dimensionAffectingProps['height']=true;
	_dimensionAffectingProps['range']=true;
	_dimensionAffectingProps['fontSize']=true;
	_dimensionAffectingProps['shadow']=true;
	_dimensionAffectingProps['largeFont']=true;
	_dimensionAffectingProps['smallFont']=true;


	var delegatedProperties=fabric.Group.prototype.delegatedProperties;
	delegatedProperties['backgroundColor']=true;
	delegatedProperties['textBackgroundColor']=true;
	delegatedProperties['textDecoration']=true;
	delegatedProperties['stroke']=true;
	delegatedProperties['strokeWidth']=true;
	delegatedProperties['shadow']=true;
	delegatedProperties['fontWeight']=true;
	delegatedProperties['fontStyle']=true;
	delegatedProperties['strokeWidth']=true;
	delegatedProperties['textAlign']=true;

	/**
	 * Group class
	 * @class fabric.CurvedText
	 * @extends fabric.Text
	 * @mixes fabric.Collection
	 */
	fabric.CurvedText=fabric.util.createClass(fabric.Text, fabric.Collection, /** @lends fabric.CurvedText.prototype */ {
		/**
		 * Type of an object
		 * @type String
		 * @default
		 */
		type: 'curvedText',
		/**
		 * The radius of the curved Text
		 * @type Number
		 * @default 50
		 */
		radius: 50,
		/**
		 * Special Effects, Thanks to fahadnabbasi
		 * https://github.com/EffEPi/fabric.curvedText/issues/9
		 */
		range: 5,
		smallFont: 10,
		largeFont: 30,
		effect: 'curved',
		/**
		 * Spacing between the letters
		 * @type fabricNumber
		 * @default 20
		 */
		spacing: 20,
//		letters: null,

		/**
		 * Reversing the radius (position of the original point)
		 * @type Boolean
		 * @default false
		 */
		reverse: false,
		/**
		 * List of properties to consider when checking if state of an object is changed ({@link fabric.Object#hasStateChanged})
		 * as well as for history (undo/redo) purposes
		 * @type Array
		 */
		stateProperties: stateProperties,
		/**
		 * Properties that are delegated to group objects when reading/writing
		 * @param {Object} delegatedProperties
		 */
		delegatedProperties: delegatedProperties,
		/**
		 * Properties which when set cause object to change dimensions
		 * @type Object
		 * @private
		 */
		_dimensionAffectingProps: _dimensionAffectingProps,
		/**
		 *
		 * Rendering, is we are rendering and another rendering call is passed, then stop rendering the old and
		 * rendering the new (trying to speed things up)
		 */
		_isRendering: 0,
		/**
		 * Added complexity
		 */
		complexity: function (){
			this.callSuper('complexity');
		},
		initialize: function (text, options){
			options||(options={});
			this.letters=new fabric.Group([], {
				selectable: false,
				padding: 0
			});
			this.__skipDimension=true;
			this.setOptions(options);
			this.__skipDimension=false;
//			this.callSuper('initialize', options);
			this.setText(text);
		},
		setText: function (text){
			if(this.letters){
				while(text.length!==0&&this.letters.size()>=text.length){
					this.letters.remove(this.letters.item(this.letters.size()-1));
				}
				if(text.length === 0) {
					this.letters.remove(this.letters.item(0));
				}
				for(var i=0; i<text.length; i++){
					//I need to pass the options from the main options
					if(this.letters.item(i)===undefined){
						this.letters.add(new fabric.Text(text[i]));
					}else{
						this.letters.item(i).setText(text[i]);
					}
				}
			}
			this.callSuper('setText', text);
		},
		_initDimensions: function (ctx){
			// from fabric.Text.prototype._initDimensions
			// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			if(this.__skipDimension){
				return;
			}
			if(!ctx){
				ctx=fabric.util.createCanvasElement().getContext('2d');
				this._setTextStyles(ctx);
			}
			this._textLines=this.text.split(this._reNewline);
			this._clearCache();
			var currentTextAlign=this.textAlign;
			this.textAlign='left';
			this.width=this._getTextWidth(ctx);
			this.textAlign=currentTextAlign;
			this.height=this._getTextHeight(ctx);
			// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
			this._render(ctx);
		},
		_render: function (ctx){
			var renderingCode=fabric.util.getRandomInt(100, 999);
			this._isRendering=renderingCode;
			if(this.letters){
				var curAngle=0,
						curAngleRotation=0,
						angleRadians=0,
						align=0,
						textWidth=0,
						space=parseInt(this.spacing),
						fixedLetterAngle=0;

				//get text width
				if(this.effect==='curved'){
					for(var i=0, len=this.text.length; i<len; i++){
						textWidth+=this.letters.item(i).width+space;
					}
					textWidth-=space;
				}else if(this.effect==='arc'){
					fixedLetterAngle=((this.letters.item(0).fontSize+space)/this.radius)/(Math.PI/180);
					textWidth=((this.text.length+1)*(this.letters.item(0).fontSize+space));
				}
				// Text align
				if(this.get('textAlign')==='right'){
					curAngle=90-(((textWidth/2)/this.radius)/(Math.PI/180));
				}else if(this.get('textAlign')==='left'){
					curAngle=-90-(((textWidth/2)/this.radius)/(Math.PI/180));
				}else{
					curAngle=-(((textWidth/2)/this.radius)/(Math.PI/180));
				}
				if(this.reverse)
					curAngle=-curAngle;

				var width=0,
						multiplier=this.reverse?-1:1,
						thisLetterAngle=0,
						lastLetterAngle=0;

				for(var i=0, len=this.text.length; i<len; i++){
					if(renderingCode!==this._isRendering)
						return;

					for(var key in this.delegatedProperties){
						this.letters.item(i).set(key, this.get(key));
					}

					this.letters.item(i).set('left', (width));
					this.letters.item(i).set('top', (0));
					this.letters.item(i).setAngle(0);
					this.letters.item(i).set('padding', 0);

					if(this.effect==='curved'){
						thisLetterAngle=((this.letters.item(i).width+space)/this.radius)/(Math.PI/180);
						curAngleRotation=multiplier*((multiplier*curAngle)+lastLetterAngle+(thisLetterAngle/4));	//4 is better than 2 for some reason
						curAngle=multiplier*((multiplier*curAngle)+lastLetterAngle);
						angleRadians=curAngle*(Math.PI/180);
						lastLetterAngle=thisLetterAngle;

						this.letters.item(i).setAngle(curAngleRotation);
						this.letters.item(i).set('top', multiplier*-1*(Math.cos(angleRadians)*this.radius));
						this.letters.item(i).set('left', multiplier*(Math.sin(angleRadians)*this.radius));
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set('selectable', false);

					}else if(this.effect==='arc'){//arc
						curAngle=multiplier*((multiplier*curAngle)+fixedLetterAngle);
						angleRadians=curAngle*(Math.PI/180);

						this.letters.item(i).set('top', multiplier*-1*(Math.cos(angleRadians)*this.radius));
						this.letters.item(i).set('left', multiplier*(Math.sin(angleRadians)*this.radius));
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set('selectable', false);
					}else if(this.effect==='STRAIGHT'){//STRAIGHT
						//var newfont=(i*5)+15;
						//this.letters.item(i).set('fontSize',(newfont));
						this.letters.item(i).set('left', (width));
						this.letters.item(i).set('top', (0));
						this.letters.item(i).setAngle(0);
						width+=this.letters.item(i).get('width');
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set({
							borderColor: 'red',
							cornerColor: 'green',
							cornerSize: 6,
							transparentCorners: false
						});
						this.letters.item(i).set('selectable', false);
					}else if(this.effect==='smallToLarge'){//smallToLarge
						var small=parseInt(this.smallFont);
						var large=parseInt(this.largeFont);
						//var small = 20;
						//var large = 75;
						var difference=large-small;
						var center=Math.ceil(this.text.length/2);
						var step=difference/(this.text.length);
						var newfont=small+(i*step);

						//var newfont=(i*this.smallFont)+15;

						this.letters.item(i).set('fontSize', (newfont));

						this.letters.item(i).set('left', (width));
						width+=this.letters.item(i).get('width');
						//this.letters.item(i).set('padding', 0);
						/*this.letters.item(i).set({
						 borderColor: 'red',
						 cornerColor: 'green',
						 cornerSize: 6,
						 transparentCorners: false
						 });*/
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set('selectable', false);
						this.letters.item(i).set('top', -1*this.letters.item(i).get('fontSize')+i);
						//this.letters.width=width;
						//this.letters.height=this.letters.item(i).get('height');

					}else if(this.effect==='largeToSmallTop'){//largeToSmallTop
						var small=parseInt(this.largeFont);
						var large=parseInt(this.smallFont);
						//var small = 20;
						//var large = 75;
						var difference=large-small;
						var center=Math.ceil(this.text.length/2);
						var step=difference/(this.text.length);
						var newfont=small+(i*step);
						//var newfont=((this.text.length-i)*this.smallFont)+12;
						this.letters.item(i).set('fontSize', (newfont));
						this.letters.item(i).set('left', (width));
						width+=this.letters.item(i).get('width');
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set({
							borderColor: 'red',
							cornerColor: 'green',
							cornerSize: 6,
							transparentCorners: false
						});
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set('selectable', false);
						this.letters.item(i).top=-1*this.letters.item(i).get('fontSize')+(i/this.text.length);

					}else if(this.effect==='largeToSmallBottom'){
						var small=parseInt(this.largeFont);
						var large=parseInt(this.smallFont);
						//var small = 20;
						//var large = 75;
						var difference=large-small;
						var center=Math.ceil(this.text.length/2);
						var step=difference/(this.text.length);
						var newfont=small+(i*step);
						//var newfont=((this.text.length-i)*this.smallFont)+12;
						this.letters.item(i).set('fontSize', (newfont));
						this.letters.item(i).set('left', (width));
						width+=this.letters.item(i).get('width');
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set({
							borderColor: 'red',
							cornerColor: 'green',
							cornerSize: 6,
							transparentCorners: false
						});
						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set('selectable', false);
						//this.letters.item(i).top =-1* this.letters.item(i).get('fontSize')+newfont-((this.text.length-i))-((this.text.length-i));
						this.letters.item(i).top=-1*this.letters.item(i).get('fontSize')-i;

					}else if(this.effect==='bulge'){//bulge
						var small=parseInt(this.smallFont);
						var large=parseInt(this.largeFont);
						//var small = 20;
						//var large = 75;
						var difference=large-small;
						var center=Math.ceil(this.text.length/2);
						var step=difference/(this.text.length-center);
						if(i<center)
							var newfont=small+(i*step);
						else
							var newfont=large-((i-center+1)*step);
						this.letters.item(i).set('fontSize', (newfont));

						this.letters.item(i).set('left', (width));
						width+=this.letters.item(i).get('width');

						this.letters.item(i).set('padding', 0);
						this.letters.item(i).set('selectable', false);

						this.letters.item(i).set('top', -1*this.letters.item(i).get('height')/2);
					}
				}

				var scaleX=this.letters.get('scaleX');
				var scaleY=this.letters.get('scaleY');
				var angle=this.letters.get('angle');

				this.letters.set('scaleX', 1);
				this.letters.set('scaleY', 1);
				this.letters.set('angle', 0);

				// Update group coords
				this.letters._calcBounds();
				this.letters._updateObjectsCoords();
				this.letters.saveCoords();
				// this.letters.render(ctx);

				this.letters.set('scaleX', scaleX);
				this.letters.set('scaleY', scaleY);
				this.letters.set('angle', angle);

				this.width=this.letters.width;
				this.height=this.letters.height;
				this.letters.left=-(this.letters.width/2);
				this.letters.top=-(this.letters.height/2);
			}
		},
		_renderOld: function (ctx){
			if(this.letters){
				var curAngle=0,
						angleRadians=0,
						align=0;
				// Text align
				var rev=0;
				if(this.reverse){
					rev=0.5;
				}
				if(this.get('textAlign')==='center'||this.get('textAlign')==='justify'){
					align=(this.spacing/2)*(this.text.length-rev);	// Remove '-1' after this.text.length for proper angle rendering
				}else if(this.get('textAlign')==='right'){
					align=(this.spacing)*(this.text.length-rev);	// Remove '-1' after this.text.length for proper angle rendering
				}
				var multiplier=this.reverse?1:-1;
				for(var i=0, len=this.text.length; i<len; i++){
					// Find coords of each letters (radians : angle*(Math.PI / 180)
					curAngle=multiplier*(-i*parseInt(this.spacing, 10)+align);
					angleRadians=curAngle*(Math.PI/180);

					for(var key in this.delegatedProperties){
						this.letters.item(i).set(key, this.get(key));
					}
					this.letters.item(i).set('top', (multiplier-Math.cos(angleRadians)*this.radius));
					this.letters.item(i).set('left', (multiplier+Math.sin(angleRadians)*this.radius));
					this.letters.item(i).setAngle(curAngle);
					this.letters.item(i).set('padding', 0);
					this.letters.item(i).set('selectable', false);
				}
				// Update group coords
				this.letters._calcBounds();
				if(this.reverse){
					this.letters.top=this.letters.top-this.height*2.5;
				}else{
					this.letters.top=0;
				}
				this.letters.left=this.letters.left-this.width/2; // Change here, for proper group display
				//this.letters._updateObjectsCoords();					// Commented off this line for group misplacement
				this.letters.saveCoords();
//				this.letters.render(ctx);
				this.width=this.letters.width;
				this.height=this.letters.height;
				this.letters.left=-(this.letters.width/2);
				this.letters.top=-(this.letters.height/2);
			}
		},
		render: function (ctx, noTransform){
			// do not render if object is not visible
			if(!this.visible)
				return;
			if(!this.letters)
				return;

			ctx.save();
			this.transform(ctx);

			var groupScaleFactor=Math.max(this.scaleX, this.scaleY);

			this.clipTo&&fabric.util.clipContext(this, ctx);

			//The array is now sorted in order of highest first, so start from end.
			for(var i=0, len=this.letters.size(); i<len; i++){
				var object=this.letters.item(i),
						originalScaleFactor=object.borderScaleFactor,
						originalHasRotatingPoint=object.hasRotatingPoint;

				// do not render if object is not visible
				if(!object.visible)
					continue;

//				object.borderScaleFactor=groupScaleFactor;
//				object.hasRotatingPoint=false;

				object.render(ctx);

//				object.borderScaleFactor=originalScaleFactor;
//				object.hasRotatingPoint=originalHasRotatingPoint;
			}
			this.clipTo&&ctx.restore();

			//Those lines causes double borders.. not sure why
//			if(!noTransform&&this.active){
//				this.drawBorders(ctx);
//				this.drawControls(ctx);
//			}
			ctx.restore();
			this.setCoords();
		},
		/**
		 * @private
		 */
		_set: function (key, value){
			this.callSuper('_set', key, value);
			if(this.letters){
				this.letters.set(key, value);
				//Properties are delegated with the object is rendered
//				if (key in this.delegatedProperties) {
//					var i = this.letters.size();
//					while (i--) {
//						this.letters.item(i).set(key, value);
//					}
//				}
				if(key in this._dimensionAffectingProps){
					this._initDimensions();
					this.setCoords();
				}
			}
		},
		toObject: function (propertiesToInclude){
			var object=extend(this.callSuper('toObject', propertiesToInclude), {
				radius: this.radius,
				spacing: this.spacing,
				reverse: this.reverse,
				effect: this.effect,
				range: this.range,
				smallFont: this.smallFont,
				largeFont: this.largeFont
						//				letters: this.letters	//No need to pass this, the letters are recreated on the fly every time when initiated
			});
			if(!this.includeDefaultValues){
				this._removeDefaultValues(object);
			}
			return object;
		},
		/**
		 * Returns string represenation of a group
		 * @return {String}
		 */
		toString: function (){
			return '#<fabric.CurvedText ('+this.complexity()+'): { "text": "'+this.text+'", "fontFamily": "'+this.fontFamily+'", "radius": "'+this.radius+'", "spacing": "'+this.spacing+'", "reverse": "'+this.reverse+'" }>';
		},
		/* _TO_SVG_START_ */
		/**
		 * Returns svg representation of an instance
		 * @param {Function} [reviver] Method for further parsing of svg representation.
		 * @return {String} svg representation of an instance
		 */
		toSVG: function (reviver){
			var markup=[
				'<g ',
				'transform="', this.getSvgTransform(),
				'">'
			];
			if(this.letters){
				for(var i=0, len=this.letters.size(); i<len; i++){
					markup.push(this.letters.item(i).toSVG(reviver));
				}
			}
			markup.push('</g>');
			return reviver?reviver(markup.join('')):markup.join('');
		}
		/* _TO_SVG_END_ */
	});

	/**
	 * Returns {@link fabric.CurvedText} instance from an object representation
	 * @static
	 * @memberOf fabric.CurvedText
	 * @param {Object} object Object to create a group from
	 * @param {Object} [options] Options object
	 * @return {fabric.CurvedText} An instance of fabric.CurvedText
	 */
	fabric.CurvedText.fromObject=function (object){
		return new fabric.CurvedText(object.text, clone(object));
	};

	fabric.util.createAccessors(fabric.CurvedText);

	/**
	 * Indicates that instances of this type are async
	 * @static
	 * @memberOf fabric.CurvedText
	 * @type Boolean
	 * @default
	 */
	fabric.CurvedText.async=false;

})(typeof exports!=='undefined'?exports:this);

/* Web Font Loader v1.6.27 - (c) Adobe Systems, Google. License: Apache 2.0 */(function(){function aa(a,b,c){return a.call.apply(a.bind,arguments)}function ba(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}}function p(a,b,c){p=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?aa:ba;return p.apply(null,arguments)}var q=Date.now||function(){return+new Date};function ca(a,b){this.a=a;this.m=b||a;this.c=this.m.document}var da=!!window.FontFace;function t(a,b,c,d){b=a.c.createElement(b);if(c)for(var e in c)c.hasOwnProperty(e)&&("style"==e?b.style.cssText=c[e]:b.setAttribute(e,c[e]));d&&b.appendChild(a.c.createTextNode(d));return b}function u(a,b,c){a=a.c.getElementsByTagName(b)[0];a||(a=document.documentElement);a.insertBefore(c,a.lastChild)}function v(a){a.parentNode&&a.parentNode.removeChild(a)}
function w(a,b,c){b=b||[];c=c||[];for(var d=a.className.split(/\s+/),e=0;e<b.length;e+=1){for(var f=!1,g=0;g<d.length;g+=1)if(b[e]===d[g]){f=!0;break}f||d.push(b[e])}b=[];for(e=0;e<d.length;e+=1){f=!1;for(g=0;g<c.length;g+=1)if(d[e]===c[g]){f=!0;break}f||b.push(d[e])}a.className=b.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function y(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return!0;return!1}
function z(a){if("string"===typeof a.f)return a.f;var b=a.m.location.protocol;"about:"==b&&(b=a.a.location.protocol);return"https:"==b?"https:":"http:"}function ea(a){return a.m.location.hostname||a.a.location.hostname}
function A(a,b,c){function d(){k&&e&&f&&(k(g),k=null)}b=t(a,"link",{rel:"stylesheet",href:b,media:"all"});var e=!1,f=!0,g=null,k=c||null;da?(b.onload=function(){e=!0;d()},b.onerror=function(){e=!0;g=Error("Stylesheet failed to load");d()}):setTimeout(function(){e=!0;d()},0);u(a,"head",b)}
function B(a,b,c,d){var e=a.c.getElementsByTagName("head")[0];if(e){var f=t(a,"script",{src:b}),g=!1;f.onload=f.onreadystatechange=function(){g||this.readyState&&"loaded"!=this.readyState&&"complete"!=this.readyState||(g=!0,c&&c(null),f.onload=f.onreadystatechange=null,"HEAD"==f.parentNode.tagName&&e.removeChild(f))};e.appendChild(f);setTimeout(function(){g||(g=!0,c&&c(Error("Script load timeout")))},d||5E3);return f}return null};function C(){this.a=0;this.c=null}function D(a){a.a++;return function(){a.a--;E(a)}}function F(a,b){a.c=b;E(a)}function E(a){0==a.a&&a.c&&(a.c(),a.c=null)};function G(a){this.a=a||"-"}G.prototype.c=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.a)};function H(a,b){this.c=a;this.f=4;this.a="n";var c=(b||"n4").match(/^([nio])([1-9])$/i);c&&(this.a=c[1],this.f=parseInt(c[2],10))}function fa(a){return I(a)+" "+(a.f+"00")+" 300px "+J(a.c)}function J(a){var b=[];a=a.split(/,\s*/);for(var c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1!=d.indexOf(" ")||/^\d/.test(d)?b.push("'"+d+"'"):b.push(d)}return b.join(",")}function K(a){return a.a+a.f}function I(a){var b="normal";"o"===a.a?b="oblique":"i"===a.a&&(b="italic");return b}
function ga(a){var b=4,c="n",d=null;a&&((d=a.match(/(normal|oblique|italic)/i))&&d[1]&&(c=d[1].substr(0,1).toLowerCase()),(d=a.match(/([1-9]00|normal|bold)/i))&&d[1]&&(/bold/i.test(d[1])?b=7:/[1-9]00/.test(d[1])&&(b=parseInt(d[1].substr(0,1),10))));return c+b};function ha(a,b){this.c=a;this.f=a.m.document.documentElement;this.h=b;this.a=new G("-");this.j=!1!==b.events;this.g=!1!==b.classes}function ia(a){a.g&&w(a.f,[a.a.c("wf","loading")]);L(a,"loading")}function M(a){if(a.g){var b=y(a.f,a.a.c("wf","active")),c=[],d=[a.a.c("wf","loading")];b||c.push(a.a.c("wf","inactive"));w(a.f,c,d)}L(a,"inactive")}function L(a,b,c){if(a.j&&a.h[b])if(c)a.h[b](c.c,K(c));else a.h[b]()};function ja(){this.c={}}function ka(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.c[e];f&&d.push(f(b[e],c))}return d};function N(a,b){this.c=a;this.f=b;this.a=t(this.c,"span",{"aria-hidden":"true"},this.f)}function O(a){u(a.c,"body",a.a)}function P(a){return"display:block;position:absolute;top:-9999px;left:-9999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+J(a.c)+";"+("font-style:"+I(a)+";font-weight:"+(a.f+"00")+";")};function Q(a,b,c,d,e,f){this.g=a;this.j=b;this.a=d;this.c=c;this.f=e||3E3;this.h=f||void 0}Q.prototype.start=function(){var a=this.c.m.document,b=this,c=q(),d=new Promise(function(d,e){function k(){q()-c>=b.f?e():a.fonts.load(fa(b.a),b.h).then(function(a){1<=a.length?d():setTimeout(k,25)},function(){e()})}k()}),e=new Promise(function(a,d){setTimeout(d,b.f)});Promise.race([e,d]).then(function(){b.g(b.a)},function(){b.j(b.a)})};function R(a,b,c,d,e,f,g){this.v=a;this.B=b;this.c=c;this.a=d;this.s=g||"BESbswy";this.f={};this.w=e||3E3;this.u=f||null;this.o=this.j=this.h=this.g=null;this.g=new N(this.c,this.s);this.h=new N(this.c,this.s);this.j=new N(this.c,this.s);this.o=new N(this.c,this.s);a=new H(this.a.c+",serif",K(this.a));a=P(a);this.g.a.style.cssText=a;a=new H(this.a.c+",sans-serif",K(this.a));a=P(a);this.h.a.style.cssText=a;a=new H("serif",K(this.a));a=P(a);this.j.a.style.cssText=a;a=new H("sans-serif",K(this.a));a=
P(a);this.o.a.style.cssText=a;O(this.g);O(this.h);O(this.j);O(this.o)}var S={D:"serif",C:"sans-serif"},T=null;function U(){if(null===T){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent);T=!!a&&(536>parseInt(a[1],10)||536===parseInt(a[1],10)&&11>=parseInt(a[2],10))}return T}R.prototype.start=function(){this.f.serif=this.j.a.offsetWidth;this.f["sans-serif"]=this.o.a.offsetWidth;this.A=q();la(this)};
function ma(a,b,c){for(var d in S)if(S.hasOwnProperty(d)&&b===a.f[S[d]]&&c===a.f[S[d]])return!0;return!1}function la(a){var b=a.g.a.offsetWidth,c=a.h.a.offsetWidth,d;(d=b===a.f.serif&&c===a.f["sans-serif"])||(d=U()&&ma(a,b,c));d?q()-a.A>=a.w?U()&&ma(a,b,c)&&(null===a.u||a.u.hasOwnProperty(a.a.c))?V(a,a.v):V(a,a.B):na(a):V(a,a.v)}function na(a){setTimeout(p(function(){la(this)},a),50)}function V(a,b){setTimeout(p(function(){v(this.g.a);v(this.h.a);v(this.j.a);v(this.o.a);b(this.a)},a),0)};function W(a,b,c){this.c=a;this.a=b;this.f=0;this.o=this.j=!1;this.s=c}var X=null;W.prototype.g=function(a){var b=this.a;b.g&&w(b.f,[b.a.c("wf",a.c,K(a).toString(),"active")],[b.a.c("wf",a.c,K(a).toString(),"loading"),b.a.c("wf",a.c,K(a).toString(),"inactive")]);L(b,"fontactive",a);this.o=!0;oa(this)};
W.prototype.h=function(a){var b=this.a;if(b.g){var c=y(b.f,b.a.c("wf",a.c,K(a).toString(),"active")),d=[],e=[b.a.c("wf",a.c,K(a).toString(),"loading")];c||d.push(b.a.c("wf",a.c,K(a).toString(),"inactive"));w(b.f,d,e)}L(b,"fontinactive",a);oa(this)};function oa(a){0==--a.f&&a.j&&(a.o?(a=a.a,a.g&&w(a.f,[a.a.c("wf","active")],[a.a.c("wf","loading"),a.a.c("wf","inactive")]),L(a,"active")):M(a.a))};function pa(a){this.j=a;this.a=new ja;this.h=0;this.f=this.g=!0}pa.prototype.load=function(a){this.c=new ca(this.j,a.context||this.j);this.g=!1!==a.events;this.f=!1!==a.classes;qa(this,new ha(this.c,a),a)};
function ra(a,b,c,d,e){var f=0==--a.h;(a.f||a.g)&&setTimeout(function(){var a=e||null,k=d||null||{};if(0===c.length&&f)M(b.a);else{b.f+=c.length;f&&(b.j=f);var h,m=[];for(h=0;h<c.length;h++){var l=c[h],n=k[l.c],r=b.a,x=l;r.g&&w(r.f,[r.a.c("wf",x.c,K(x).toString(),"loading")]);L(r,"fontloading",x);r=null;if(null===X)if(window.FontFace){var x=/Gecko.*Firefox\/(\d+)/.exec(window.navigator.userAgent),ya=/OS X.*Version\/10\..*Safari/.exec(window.navigator.userAgent)&&/Apple/.exec(window.navigator.vendor);
X=x?42<parseInt(x[1],10):ya?!1:!0}else X=!1;X?r=new Q(p(b.g,b),p(b.h,b),b.c,l,b.s,n):r=new R(p(b.g,b),p(b.h,b),b.c,l,b.s,a,n);m.push(r)}for(h=0;h<m.length;h++)m[h].start()}},0)}function qa(a,b,c){var d=[],e=c.timeout;ia(b);var d=ka(a.a,c,a.c),f=new W(a.c,b,e);a.h=d.length;b=0;for(c=d.length;b<c;b++)d[b].load(function(b,d,c){ra(a,f,b,d,c)})};function sa(a,b){this.c=a;this.a=b}function ta(a,b,c){var d=z(a.c);a=(a.a.api||"fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return d+"//"+a+"/"+b+".js"+(c?"?v="+c:"")}
sa.prototype.load=function(a){function b(){if(f["__mti_fntLst"+d]){var c=f["__mti_fntLst"+d](),e=[],h;if(c)for(var m=0;m<c.length;m++){var l=c[m].fontfamily;void 0!=c[m].fontStyle&&void 0!=c[m].fontWeight?(h=c[m].fontStyle+c[m].fontWeight,e.push(new H(l,h))):e.push(new H(l))}a(e)}else setTimeout(function(){b()},50)}var c=this,d=c.a.projectId,e=c.a.version;if(d){var f=c.c.m;B(this.c,ta(c,d,e),function(e){e?a([]):(f["__MonotypeConfiguration__"+d]=function(){return c.a},b())}).id="__MonotypeAPIScript__"+
d}else a([])};function ua(a,b){this.c=a;this.a=b}ua.prototype.load=function(a){var b,c,d=this.a.urls||[],e=this.a.families||[],f=this.a.testStrings||{},g=new C;b=0;for(c=d.length;b<c;b++)A(this.c,d[b],D(g));var k=[];b=0;for(c=e.length;b<c;b++)if(d=e[b].split(":"),d[1])for(var h=d[1].split(","),m=0;m<h.length;m+=1)k.push(new H(d[0],h[m]));else k.push(new H(d[0]));F(g,function(){a(k,f)})};function va(a,b,c){a?this.c=a:this.c=b+wa;this.a=[];this.f=[];this.g=c||""}var wa="//fonts.googleapis.com/css";function xa(a,b){for(var c=b.length,d=0;d<c;d++){var e=b[d].split(":");3==e.length&&a.f.push(e.pop());var f="";2==e.length&&""!=e[1]&&(f=":");a.a.push(e.join(f))}}
function za(a){if(0==a.a.length)throw Error("No fonts to load!");if(-1!=a.c.indexOf("kit="))return a.c;for(var b=a.a.length,c=[],d=0;d<b;d++)c.push(a.a[d].replace(/ /g,"+"));b=a.c+"?family="+c.join("%7C");0<a.f.length&&(b+="&subset="+a.f.join(","));0<a.g.length&&(b+="&text="+encodeURIComponent(a.g));return b};function Aa(a){this.f=a;this.a=[];this.c={}}
var Ba={latin:"BESbswy","latin-ext":"\u00e7\u00f6\u00fc\u011f\u015f",cyrillic:"\u0439\u044f\u0416",greek:"\u03b1\u03b2\u03a3",khmer:"\u1780\u1781\u1782",Hanuman:"\u1780\u1781\u1782"},Ca={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Da={i:"i",italic:"i",n:"n",normal:"n"},
Ea=/^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
function Fa(a){for(var b=a.f.length,c=0;c<b;c++){var d=a.f[c].split(":"),e=d[0].replace(/\+/g," "),f=["n4"];if(2<=d.length){var g;var k=d[1];g=[];if(k)for(var k=k.split(","),h=k.length,m=0;m<h;m++){var l;l=k[m];if(l.match(/^[\w-]+$/)){var n=Ea.exec(l.toLowerCase());if(null==n)l="";else{l=n[2];l=null==l||""==l?"n":Da[l];n=n[1];if(null==n||""==n)n="4";else var r=Ca[n],n=r?r:isNaN(n)?"4":n.substr(0,1);l=[l,n].join("")}}else l="";l&&g.push(l)}0<g.length&&(f=g);3==d.length&&(d=d[2],g=[],d=d?d.split(","):
g,0<d.length&&(d=Ba[d[0]])&&(a.c[e]=d))}a.c[e]||(d=Ba[e])&&(a.c[e]=d);for(d=0;d<f.length;d+=1)a.a.push(new H(e,f[d]))}};function Ga(a,b){this.c=a;this.a=b}var Ha={Arimo:!0,Cousine:!0,Tinos:!0};Ga.prototype.load=function(a){var b=new C,c=this.c,d=new va(this.a.api,z(c),this.a.text),e=this.a.families;xa(d,e);var f=new Aa(e);Fa(f);A(c,za(d),D(b));F(b,function(){a(f.a,f.c,Ha)})};function Ia(a,b){this.c=a;this.a=b}Ia.prototype.load=function(a){var b=this.a.id,c=this.c.m;b?B(this.c,(this.a.api||"https://use.typekit.net")+"/"+b+".js",function(b){if(b)a([]);else if(c.Typekit&&c.Typekit.config&&c.Typekit.config.fn){b=c.Typekit.config.fn;for(var e=[],f=0;f<b.length;f+=2)for(var g=b[f],k=b[f+1],h=0;h<k.length;h++)e.push(new H(g,k[h]));try{c.Typekit.load({events:!1,classes:!1,async:!0})}catch(m){}a(e)}},2E3):a([])};function Ja(a,b){this.c=a;this.f=b;this.a=[]}Ja.prototype.load=function(a){var b=this.f.id,c=this.c.m,d=this;b?(c.__webfontfontdeckmodule__||(c.__webfontfontdeckmodule__={}),c.__webfontfontdeckmodule__[b]=function(b,c){for(var g=0,k=c.fonts.length;g<k;++g){var h=c.fonts[g];d.a.push(new H(h.name,ga("font-weight:"+h.weight+";font-style:"+h.style)))}a(d.a)},B(this.c,z(this.c)+(this.f.api||"//f.fontdeck.com/s/css/js/")+ea(this.c)+"/"+b+".js",function(b){b&&a([])})):a([])};var Y=new pa(window);Y.a.c.custom=function(a,b){return new ua(b,a)};Y.a.c.fontdeck=function(a,b){return new Ja(b,a)};Y.a.c.monotype=function(a,b){return new sa(b,a)};Y.a.c.typekit=function(a,b){return new Ia(b,a)};Y.a.c.google=function(a,b){return new Ga(b,a)};var Z={load:p(Y.load,Y)};"function"===typeof define&&define.amd?define(function(){return Z}):"undefined"!==typeof module&&module.exports?module.exports=Z:(window.WebFont=Z,window.WebFontConfig&&Y.load(window.WebFontConfig));}());

//change fabricjs cursormap
//fabric.Canvas.prototype.cursorMap = ['default', 'default', 'default', 'se-resize', 'default', 'pointer', 'default', 'copy'];



//----------------------------------
// ------- Fabric.js Methods ----------
//----------------------------------


fabric.Object.prototype._drawControl = function(control, ctx, methodName, left, top) {

	var size = this.cornerSize,
		iconOffset = 4,
		iconSize = size - (iconOffset*2),
		offset = (size*.5),
		offsetCorner = 10;

	offset = offsetCorner = 0;

	this._fpdOffset = offset;
	this._fpdOffsetCorner = offsetCorner;

	if (this.isControlVisible(control)) {

		var wh = this._calculateCurrentDimensions(),
          	width = wh.x,
          	height = wh.y;

		if (control == 'br' ||
			control == 'mtr' ||
			control == 'tl' ||
			control == 'bl' ||
			control == 'ml' ||
			control == 'mr' ||
			control == 'mb' ||
			control == 'mt') {
			switch (control) {

				case 'tl': //copy
					left = left - offset + offsetCorner;
					top = top  - offset + offsetCorner;
					icon = this.__editorMode || this.copyable ? String.fromCharCode('0xe623') : false;
					break;
				case 'mtr': // rotate
					left = left + (width/2) + offset - offsetCorner;
					top = top  - offset + offsetCorner;
					icon = this.__editorMode || this.rotatable ? String.fromCharCode('0xe923') : false;
					break;
				case 'br': // resize
					left = left + offset - offsetCorner;
					top = top  + offset - offsetCorner;
					icon = this.__editorMode || this.resizable ? String.fromCharCode('0xe922') : false;
					break;
				case 'bl': //remove
					left = left - offset + offsetCorner;
					top = top + offset - offsetCorner;
					icon = this.__editorMode || this.removable ? String.fromCharCode('0xe926') : false;
					break;
				case 'ml': //unproportional scaling
					left = left - offset + offsetCorner;
					top = (top / 2) - iconOffset;
					icon = !this.lockUniScaling ? String.fromCharCode('0xe92e') : false;
					break;
				case 'mr': //unproportional scaling
					left = left + offset - offsetCorner;
					top = (top / 2) - iconOffset;
					icon = !this.lockUniScaling ? String.fromCharCode('0xe92d') : false;
					break;
				case 'mt': //unproportional scaling
					left = left - offset + offsetCorner;
					top = top - iconOffset;
					icon = !this.lockUniScaling ? String.fromCharCode('0xe92f') : false;
					break;
				case 'mb': //unproportional scaling
					left = left + offset - offsetCorner;
					top = top - iconOffset;
					icon = !this.lockUniScaling ? String.fromCharCode('0xe930') : false;
					break;
			}

		}

		this.transparentCorners || ctx.clearRect(left, top, size, size);
		if (icon !== false) {
			var extraLeftOffset = control == 'mt' || control == 'mb' ? 5 : 0;
			ctx.fillStyle = this.cornerColor;
			ctx.fillRect(left, top, size, size);
			ctx.font = iconSize+'px FontFPD';
			ctx.fillStyle = this.cornerIconColor;
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillText(icon, left+iconOffset+extraLeftOffset, top+iconOffset);
		}
	}
};

fabric.Object.prototype.setCoords = function() {

	var theta = fabric.util.degreesToRadians(this.angle),
		vpt = this.getViewportTransform(),
		dim = this._calculateCurrentDimensions(),
		//FPD: Set cursor offset
		fpdOffset = this._fpdOffset ? this._fpdOffset : 0,
		fpdOffsetCorner = this._fpdOffsetCorner ? this._fpdOffsetCorner : 0,
		fpdOffset = fpdOffsetCorner = 0,
		currentWidth = dim.x+(fpdOffset-fpdOffsetCorner)*2, currentHeight = dim.y+(fpdOffset-fpdOffsetCorner)*2;

	// If width is negative, make postive. Fixes path selection issue
	if (currentWidth < 0) {
		currentWidth = Math.abs(currentWidth);
	}

	var sinTh = Math.sin(theta),
		cosTh = Math.cos(theta),
		_angle = currentWidth > 0 ? Math.atan(currentHeight / currentWidth) : 0,
		_hypotenuse = (currentWidth / Math.cos(_angle)) / 2,
		offsetX = Math.cos(_angle + theta) * _hypotenuse,
		offsetY = Math.sin(_angle + theta) * _hypotenuse,


	// offset added for rotate and scale actions
	coords = fabric.util.transformPoint(this.getCenterPoint(), vpt),
	tl  = new fabric.Point(coords.x - offsetX, coords.y - offsetY),
	tr  = new fabric.Point(tl.x + (currentWidth * cosTh), tl.y + (currentWidth * sinTh)),
	bl  = new fabric.Point(tl.x - (currentHeight * sinTh), tl.y + (currentHeight * cosTh)),
	br  = new fabric.Point(coords.x + offsetX, coords.y + offsetY),
	ml  = new fabric.Point((tl.x + bl.x)/2, (tl.y + bl.y)/2),
	mt  = new fabric.Point((tr.x + tl.x)/2, (tr.y + tl.y)/2),
	mr  = new fabric.Point((br.x + tr.x)/2, (br.y + tr.y)/2),
	mb  = new fabric.Point((br.x + bl.x)/2, (br.y + bl.y)/2),
	mtr = new fabric.Point(tr.x + sinTh * this.rotatingPointOffset, tr.y - cosTh * this.rotatingPointOffset); //FPD: Adjust calculation for top/right position

	this.oCoords = {
		// corners
		tl: tl, tr: tr, br: br, bl: bl,
		// middle
		ml: ml, mt: mt, mr: mr, mb: mb,
		// rotating point
		mtr: mtr
	};

	// set coordinates of the draggable boxes in the corners used to scale/rotate the image
	this._setCornerCoords && this._setCornerCoords();

	return this;
 };

fabric.Canvas.prototype._getRotatedCornerCursor = function(corner, target, e) {
  var n = Math.round((target.getAngle() % 360) / 45);

  //FPD: add CursorOffset
   var cursorOffset = {
    mt: 0, // n
    tr: 1, // ne
    mr: 2, // e
    br: 3, // se
    mb: 4, // s
    bl: 5, // sw
    ml: 6, // w
    tl: 7 // nw
  };

  if (n < 0) {
    n += 8; // full circle ahead
  }
  n += cursorOffset[corner];
  //FPD: uncomment for older version of fabricjs
  /*if (e.shiftKey && cursorOffset[corner] % 2 === 0) {
    //if we are holding shift and we are on a mx corner...
    n += 2;
  }*/
  // normalize n to be from 0 to 7
  n %= 8;

  //FPD: set cursor for copy and remove
  switch(corner) {
	  case 'tl':
	  	return target.copyable ? 'copy' : 'default';
	  break;
	  case 'bl':
	  	return 'pointer';
	  break;
  }
  return this.cursorMap[n];
};

// https://jsfiddle.net/jojobyte/3j352toh/1/
fabric.Textbox.prototype._wrapLine = function(ctx, text, lineIndex) {
	var lineWidth        = 0,
		lines            = [],
		line             = '',
		words            = text.split(' '),
		word             = '',
		letter           = '',
		offset           = 0,
		infix            = ' ',
		wordWidth        = 0,
		infixWidth       = 0,
		letterWidth      = 0,
		largestWordWidth = 0;

	for (var i = 0; i < words.length; i++) {
		word = words[i];
		wordWidth = this._measureText(ctx, word, lineIndex, offset);
		lineWidth += infixWidth;

		// Break Words if wordWidth is greater than textbox width
		if (wordWidth > this.width) {
			line += infix;
			var wordLetters = word.split('');
			while (wordLetters.length) {
				letterWidth = this._getWidthOfChar(ctx, wordLetters[0], lineIndex, offset);
				if (lineWidth + letterWidth > this.width) {
					lines.push(line);
					line = '';
					lineWidth = 0;
				}
				line += wordLetters.shift();
				offset++;
				lineWidth += letterWidth;
			}
			word = '';
		} else {
			lineWidth += wordWidth;
		}

		if (lineWidth >= this.width && line !== '') {
			lines.push(line);
			line = '';
			lineWidth = wordWidth;
		}

		if (line !== '' || i === 1) {
			line += infix;
		}
		line += word;
		offset += word.length;
		infixWidth = this._measureText(ctx, infix, lineIndex, offset);
		offset++;

		//FPD: keep track of largest word
		/*if (wordWidth > largestWordWidth && !this.breakWords) {
			largestWordWidth = wordWidth;
		}*/
	}

	i && lines.push(line);

	if (largestWordWidth > this.dynamicMinWidth) {
		this.dynamicMinWidth = largestWordWidth;
	}

	return lines;
};

fabric.IText.prototype._isObjectMoved = function(e) {

	if(this.canvas) {
		var pointer = this.canvas.getPointer(e);

	    return this.__mousedownX !== pointer.x ||
	           this.__mousedownY !== pointer.y;
	}

};

/**
 * A class with some static helper functions. You do not need to initiate the class, just call the methods directly, e.g. FPDUtil.isIE();
 *
 * @class FPDUtil
 */
var FPDUtil =  {

	/**
	 * Checks if browser is IE and return version number.
	 *
	 * @method isIE
	 * @return {Boolean} Returns true if browser is IE.
	 * @static
	 */
	isIE : function() {

		var myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;

	},

	/**
	 * Resets the key names of the deprecated keys.
	 *
	 * @method rekeyDeprecatedKeys
	 * @param {Object} object An object containing element parameters.
	 * @return {Object} Returns the edited object.
	 * @static
	 */
	rekeyDeprecatedKeys : function(object) {

		var depractedKeys = [
			{old: 'x', replace: 'left'},
			{old: 'y', replace: 'top'},
			{old: 'degree', replace: 'angle'},
			{old: 'currentColor', replace: 'fill'},
			{old: 'filters', replace: 'availableFilters'},
			{old: 'textSize', replace: 'fontSize'},
			{old: 'font', replace: 'fontFamily'},
			{old: 'scale', replace: ['scaleX', 'scaleY']},
			{old: 'uploadZoneScaleMode', replace: 'scaleMode'},
		];

		for(var i=0; i < depractedKeys.length; ++i) {
			if(object.hasOwnProperty(depractedKeys[i].old) && !object.hasOwnProperty(depractedKeys[i].replace)) {

				var replaceObj = depractedKeys[i].replace;
				//this.log('FPD 4.0.0: Parameter "'+depractedKeys[i].old+'" is depracted. Please use "'+replaceObj.toString()+'" instead!', 'warn');

				if(typeof replaceObj === 'object') { //check if old needs to be replaced with multiple options, e.g. scale=>scaleX,scaleY

					for(var j=0; j < replaceObj.length; ++j) {
						object[replaceObj[j]] = object[depractedKeys[i].old];
					}

				}
				else {
					object[depractedKeys[i].replace] = object[depractedKeys[i].old];
				}

				delete object[depractedKeys[i].old];
			}
		}

		return object;

	},

	/**
	 * Writes a message in the console.
	 *
	 * @method log
	 * @param {String} message The text that will be displayed in the console.
	 * @param {String} [type=log] The output type - info, error, warn or log.
	 * @static
	 */
	log : function(message, type) {

		if(typeof console === 'undefined') { return false; }

		if(type === 'info') {
			console.info(message);
		}
		else if (type === 'error') {
			console.error(message);
		}
		else if (type === 'warn') {
			console.warn(message);
		}
		else {
			console.log(message);
		}

	},

	/**
	 * Checks if a string is an URL.
	 *
	 * @method isUrl
	 * @param {String} s The string.
	 * @return {Boolean} Returns true if string is an URL.
	 * @static
	 */
	isUrl : function(s) {

		var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
		return regexp.test(s);

	},

	/**
	 * Removes an element from an array by value.
	 *
	 * @method removeFromArray
	 * @param {Array} array The target array.
	 * @param {String} element The element value.
	 * @return {Array} Returns the edited array.
	 * @static
	 */
	removeFromArray : function(array, element) {

	    var index = array.indexOf(element);
	    if (index > -1) {
		    array.splice(index, 1);
		}

		return array;

	},

	/**
	 * Checks if a string is XML formatted.
	 *
	 * @method isXML
	 * @param {String} string The target string.
	 * @return {Boolean} Returns true if string is XML formatted.
	 * @static
	 */
	isXML : function(string){

	    try {
	        xmlDoc = jQuery.parseXML(string); //is valid XML
	        return true;
	    } catch (err) {
	        // was not XML
	        return false;
	    }

	},

	/**
	 * Checks if an image can be colorized and returns the image type
	 *
	 * @method elementIsColorizable
	 * @param {fabric.Object} element The target element.
	 * @return {String | Boolean} Returns the element type(text, dataurl, png or svg) or false if the element can not be colorized.
	 * @static
	 */
	elementIsColorizable : function(element) {

		if(this.getType(element.type) === 'text') {
			return 'text';
		}

		//check if url is a png or base64 encoded
		var imageParts = element.source.split('.');
		//its base64 encoded
		if(imageParts.length == 1) {

			//check if dataurl is png
			if(imageParts[0].search('data:image/png;') == -1) {
				element.fill = element.colors = false;
				return false;
			}
			else {
				return 'dataurl';
			}

		}
		//its a url
		else {

			var source = element.source;
			source = source.split('?')[0];//remove all url parameters
			imageParts = source.split('.');

			//only png and svg are colorizable
			if($.inArray('png', imageParts) == -1 && $.inArray('svg', imageParts) == -1) {
				element.fill = element.colors = false;
				return false;
			}
			else {
				if($.inArray('svg', imageParts) == -1) {
					return 'png';
				}
				else {
					return 'svg';
				}
			}

		}

	},

	/**
	 * Returns a simpler type of a fabric object.
	 *
	 * @method getType
	 * @param {String} fabricType The fabricjs type.
	 * @return {String} This could be image or text.
	 * @static
	 */
	getType : function(fabricType) {

		if(fabricType === 'text' || fabricType === 'i-text' || fabricType === 'curvedText' || fabricType === 'textbox') {
			return 'text';
		}
		else {
			return 'image';
		}

	},

	/**
	 * Looks for the .fpd-tooltip classes and adds a nice tooltip to these elements (tooltipster).
	 *
	 * @method updateTooltip
	 * @param {jQuery} [$container] The container to look in. If not set, the whole document will be searched.
	 * @static
	 */
	updateTooltip : function($container) {

		$tooltips = $container ? $container.find('.fpd-tooltip') : $('.fpd-tooltip');

		$tooltips.each(function(i, tooltip) {

			var $tooltip = $(tooltip);
			if($tooltip.hasClass('tooltipstered')) {
				$tooltip.tooltipster('reposition');
			}
			else {
				$tooltip.tooltipster({
					offsetY: 0,
					position: 'bottom',
					theme: '.fpd-tooltip-theme',
					touchDevices: false
				});
			}

		});

	},

	/**
	 * Makes an unique array.
	 *
	 * @method arrayUnique
	 * @param {Array} array The target array.
	 * @return {Array} Returns the edited array.
	 * @static
	 */
	arrayUnique : function(array) {

	    var a = array.concat();
	    for(var i=0; i<a.length; ++i) {
	        for(var j=i+1; j<a.length; ++j) {
	            if(a[i] === a[j])
	                a.splice(j--, 1);
	        }
	    }

	    return a;
	},

	/**
	 * Creates a nice scrollbar for an element.
	 *
	 * @method createScrollbar
	 * @param {jQuery} target The target element.
	 * @static
	 */
	createScrollbar : function($target) {

		if($target.hasClass('mCustomScrollbar')) {
			$target.mCustomScrollbar('scrollTo', 0);
		}
		else {
			$target.mCustomScrollbar({
				scrollbarPosition: 'outside',
				autoExpandScrollbar: true,
				autoHideScrollbar: true,
				scrollInertia: 200,
				axis: 'y',
				callbacks: {
					onTotalScrollOffset: 100,
					onTotalScroll:function() {
						$(this).trigger('_sbOnTotalScroll');
						FPDUtil.refreshLazyLoad($(this).find('.fpd-grid'), true);
					}
				}
			});
		}

	},

	/**
	 * Checks if a value is not empty. 0 is allowed.
	 *
	 * @method notEmpty
	 * @param {NUmber | String} value The target value.
	 * @return {Array} Returns true if not empty.
	 * @static
	 */
	notEmpty : function(value) {

		if(value === undefined || value === false || value.length === 0) {
			return false;
		}
		return true;

	},

	/**
	 * Opens the modal box with an own message.
	 *
	 * @method showModal
	 * @param {String} message The message you would like to display in the modal box.
	 * @return {jQuery} Returns a jQuery object containing the modal.
	 * @static
	 */
	showModal : function(htmlMessage, fullscreen, type) {

		type = type === undefined ? '' : type;

		var $body = $('body').addClass('fpd-overflow-hidden'),
			fullscreenCSS = fullscreen ? 'fpd-fullscreen' : '';
			html = '<div class="fpd-modal-internal fpd-modal-overlay"><div class="fpd-modal-wrapper fpd-shadow-3"><div class="fpd-modal-close"><span class="fpd-icon-close"></span></div><div class="fpd-modal-content"></div></div></div>';

		if($('.fpd-modal-internal').length === 0) {

			$body.append(html)
			.children('.fpd-modal-internal:first').click(function(evt) {

				$target = $(evt.target);
				if($target.hasClass('fpd-modal-overlay')) {

					$target.find('.fpd-modal-close').click();

				}

			});

		}

		if(type === 'prompt') {
			htmlMessage = '<input placeholder="'+htmlMessage+'" /><span class="fpd-btn"></span>';
		}

		$body.children('.fpd-modal-internal').attr('data-type', type).removeClass('fpd-fullscreen').addClass(fullscreenCSS)
		.fadeIn(300).find('.fpd-modal-content').html(htmlMessage);

		return $body.children('.fpd-modal-internal');

	},

	/**
	 * Shows a message in the snackbar.
	 *
	 * @method showMessage
	 * @param {String} text The text for the message.
	 * @static
	 */
	showMessage : function(text) {

		var $body = $('body'),
			$snackbarWrapper;

		if($body.children('.fpd-snackbar-wrapper').length > 0) {
			$snackbarWrapper = $body.children('.fpd-snackbar-wrapper');
		}
		else {
			$snackbarWrapper = $body.append('<div class="fpd-snackbar-wrapper"></div>').children('.fpd-snackbar-wrapper');
		}

		var $snackbar = $('<div class="fpd-snackbar fpd-shadow-1"><p></p></div>');
		$snackbar.children('p').html(text);
		$snackbar.appendTo($snackbarWrapper);

		setTimeout(function() {

			$snackbar.addClass('fpd-show-up');

			setTimeout(function() {
				$snackbar.remove();
			}, 5000);

		}, 10);

	},

	/**
	 * Adds a preloader icon to loading picture and loads the image.
	 *
	 * @method loadGridImage
	 * @param {jQuery} picture The image container.
	 * @param {String} source The image URL.
	 * @static
	 */
	loadGridImage : function($picture, source) {

		if($picture.length > 0 && source) {

			$picture.addClass('fpd-on-loading');
			var image = new Image();
			image.src = source;
			image.onload = function() {
				$picture.attr('data-img', '')
				.data('originWidth', this.width).data('originHeight', this.height)
				.removeClass('fpd-on-loading').fadeOut(0)
				.stop().fadeIn(200).css('background-image', 'url("'+this.src+'")');
			};

		}

	},

	//
	/**
	 * Refreshs the items using lazy load.
	 *
	 * @method refreshLazyLoad
	 * @param {jQuery} container The container.
	 * @param {Boolean} loadByCounter If true 15 images will be loaded at once. If false all images will be loaded in the container.
	 * @static
	 */
	refreshLazyLoad : function($container, loadByCounter) {

		if($container && $container.length > 0 && $container.is(':visible')) {

			var $item = $container.children('.fpd-item.fpd-hidden:first'),
				counter = 0,
				amount = loadByCounter ? 15 : 0;
			while((counter < amount || $container.parent('.mCSB_container').height()-150 < $container.parents('.fpd-scroll-area:first').height()) && $item.length > 0) {
				var $pic = $item.children('picture');
				$item.removeClass('fpd-hidden');
				FPDUtil.loadGridImage($pic, $pic.data('img'));
				$item = $item.next('.fpd-item.fpd-hidden');
				counter++;
			}

		}

	},

	/**
	 * Parses the fabricjs options to a FPD options object.
	 *
	 * @method parseFabricObjectToFPDElement
	 * @param {Object} object The target fabricjs object.
	 * @return {Object} Returns the FPD object.
	 * @static
	 */
	parseFabricObjectToFPDElement : function(object) {

		if(!object) { return {}; }

		var options = new FancyProductDesignerOptions(),
			properties = Object.keys(options.defaults.elementParameters),
			additionalKeys  = FPDUtil.getType(object.type) === 'text' ? Object.keys(options.defaults.textParameters) : Object.keys(options.defaults.imageParameters);

		properties = $.merge(properties, additionalKeys);

		var parameters = {};
		for(var i=0; i < properties.length; ++i) {
			var prop = properties[i];
			if(object[prop] !== undefined) {
				parameters[prop] = object[prop];
			}

		}

		return {
			type: FPDUtil.getType(object.type), //type
			source: object.source, //source
			title: object.title,  //title
			parameters: parameters  //parameters
		};

	},

	/**
	 * If pop-up blocker is enabled, the user will get a notification modal.
	 *
	 * @method popupBlockerAlert
	 * @param {window} popup The target popup window.
	 * @static
	 */
	popupBlockerAlert : function(popup, fpdInstance) {

		if (popup == null || typeof(popup)=='undefined') {
			FPDUtil.showModal(fpdInstance.getTranslation('misc', 'popup_blocker_alert'));
		}

	},

	/**
	 * Returns the scale value calculated with the passed image dimensions and the defined "resize-to" dimensions.
	 *
	 * @method getScalingByDimesions
	 * @param {Number} imgW The width of the image.
	 * @param {Number} imgH The height of the image.
	 * @param {Number} resizeToW The maximum width for the image.
	 * @param {Number} resizeToH The maximum height for the image.
	 * @return {Number} The scale value to resize an image to a desired dimension.
	  * @static
	 */
	getScalingByDimesions : function(imgW, imgH, resizeToW, resizeToH, mode) {

		mode = typeof mode === 'undefined' ? 'fit' : mode;
		resizeToW = typeof resizeToW !== 'number' ? 0 : resizeToW;
		resizeToH = typeof resizeToH !== 'number' ? 0 : resizeToH;

		var scaling = 1,
			rwSet = resizeToW !== 0,
			rhSet = resizeToH !== 0;

		if(mode === 'cover') {

			if(imgW < imgH) {
				if(imgW > resizeToW) { scaling = rwSet ? resizeToW / imgW : 1; }
			}
			else if (imgW == imgH) {
			 	if(resizeToW > resizeToH) { scaling = rwSet ? resizeToW / imgW : 1}
			 	else { scaling = rhSet ? resizeToH / imgH : 1}
			}
			else {
				if(imgH > resizeToH) { scaling = rhSet ? resizeToH / imgH : 1; }
			}

		}
		else {

			if(imgW > imgH) {
				if(imgW > resizeToW) { scaling = rwSet ? resizeToW / imgW : 1; }
				if(scaling * imgH > resizeToH) { scaling = rhSet ? resizeToH / imgH : 1; }
			}
			else {
				if(imgH > resizeToH) { scaling = rhSet ? resizeToH / imgH : 1; }
				if(scaling * imgW > resizeToW) { scaling = rwSet ? resizeToW / imgW : 1; }
			}

		}


		return parseFloat(scaling.toFixed(2));

	},

	/**
	 * Checks if the browser local storage is available.
	 *
	 * @method localStorageAvailable
	 * @return {Boolean} Returns true if local storage is available.
	 * @static
	 */
	localStorageAvailable : function() {

		localStorageAvailable = true;
		//execute this because of a ff issue with localstorage
		try {
			window.localStorage.length;
			window.localStorage.setItem('fpd-storage', 'just-testing');
			//window.localStorage.clear();
		}
		catch(error) {
			localStorageAvailable = false;
			//In Safari, the most common cause of this is using "Private Browsing Mode". You are not able to save products in your browser.
		}

		return localStorageAvailable;

	},

	/**
	 * Checks if the dimensions of an image is within the allowed range set in the customImageParameters of the view options.
	 *
	 * @method checkImageDimensions
	 * @param {FancyProductDesigner} fpdInstance Instance of FancyProductDesigner.
	 * @param {Number} imageW The image width.
	 * @param {Number} imageH The image height.
	 * @return {Array} Returns true if image dimension is within allowed range(minW, minH, maxW, maxH).
	 * @static
	 */
	checkImageDimensions : function(fpdInstance, imageW, imageH) {

		var currentCustomImageParameters = fpdInstance.currentViewInstance.options.customImageParameters;

		if(imageW > currentCustomImageParameters.maxW ||
		imageW < currentCustomImageParameters.minW ||
		imageH > currentCustomImageParameters.maxH ||
		imageH < currentCustomImageParameters.minH) {

			if(fpdInstance.mainBar) {
				fpdInstance.mainBar.toggleDialog(false);
			}

			var msg = fpdInstance.getTranslation('misc', 'uploaded_image_size_alert')
					  .replace('%minW', currentCustomImageParameters.minW)
					  .replace('%minH', currentCustomImageParameters.minH)
					  .replace('%maxW', currentCustomImageParameters.maxW)
					  .replace('%maxH', currentCustomImageParameters.maxH);

			FPDUtil.showModal(msg);
			return false;

		}
		else {
			return true;
		}

	},

	/**
	 * Checks if an element has a color selection.
	 *
	 * @method elementHasColorSelection
	 * @param {fabric.Object} element The target element.
	 * @return {Boolean} Returns true if element has colors.
	 * @static
	 */
	elementHasColorSelection : function(element) {

		return (Array.isArray(element.colors) || Boolean(element.colors) || element.colorLinkGroup) && FPDUtil.elementIsColorizable(element) !== false;

	},

	/**
	 * Returns the available colors of an element.
	 *
	 * @method elementAvailableColors
	 * @param {fabric.Object} element The target element.
	 * @param {FancyProductDesigner} fpdInstance Instance of FancyProductDesigner.
	 * @return {Array} Available colors.
	 * @static
	 */
	elementAvailableColors : function(element, fpdInstance) {

		var availableColors = [];
		if(element.type == 'path-group') {

			availableColors = [];
			for(var i=0; i<element.paths.length; ++i) {
				var path = element.paths[i],
					color = tinycolor(path.fill);
				availableColors.push(color.toHexString());
			}

		}
		else if(element.colorLinkGroup) {
			availableColors = fpdInstance.colorLinkGroups[element.colorLinkGroup].colors;
		}
		else {
			availableColors = element.colors;
		}

		return availableColors;

	},

	/**
	 * Changes a single path color by index.
	 *
	 * @method changePathColor
	 * @param {fabric.Object} element The target element.
	 * @param {Number} index The path index.
	 * @param {String} color Hexadecimal color value.
	 * @return {Array} All colors used in the SVG.
	 * @static
	 */
	changePathColor : function(element, index, color) {

		var svgColors = [];

		for(var i=0; i<element.paths.length; ++i) {

			var path = element.paths[i],
				c = tinycolor(path.fill);

			svgColors.push(c.toHexString());
		}

		svgColors[index] = color.toHexString();

		return svgColors;

	},

	/**
	 * Checks if a string is a valid hexadecimal color value.
	 *
	 * @method isHex
	 * @param {String} value The target value.
	 * @return {Boolean} Returns true if value is a valid hexadecimal color.
	 * @static
	 */
	isHex : function(value) {
		return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
	},

	/**
	 * Adds a thousand separator and returns it.
	 *
	 * @method addThousandSep
	 * @param {Number} n A numeric value.
	 * @return {String} Returns a string.
	 * @static
	 */
	addThousandSep : function(n){

	    var rx=  /(\d+)(\d{3})/;
	    return String(n).replace(/^\d+/, function(w){
	        while(rx.test(w)){
	            w= w.replace(rx, '$1'+thousandSeparator+'$2');
	        }
	        return w;
	    });

	},

};

/**
 * The class defining the default options for Fancy Product Designer.
 *
 * @class FancyProductDesignerOptions
 */
var FancyProductDesignerOptions = function() {

	/**
	 * The default options. See: {{#crossLink "FancyProductDesignerOptions.defaults"}}{{/crossLink}}
	 *
	 * @property defaults
	 * @for FancyProductDesignerOptions
	 * @type {Object}
	 */
	this.defaults = {
		imageLoadTimestamp: false,
	    /**
		* The stage(canvas) width for the product designer.
		*
		* @property stageWidth
		* @for FancyProductDesignerOptions.defaults
		* @type {Number}
		* @default "900"
		*/
		stageWidth: 900,
		/**
		* The stage(canvas) height for the product designer.
		*
		* @property stageHeight
		* @for FancyProductDesignerOptions.defaults
		* @type {Number}
		* @default "600"
		*/
		stageHeight: 600,
		/**
		* Enables the editor mode, which will add a helper box underneath the product designer with some options of the current selected element.
		*
		* @property editorMode
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default false
		*/
		editorMode: false,
		/**
		* The properties that will be displayed in the editor box when an element is selected.
		*
		* @property editorBoxParameters
		* @for FancyProductDesignerOptions.defaults
		* @type {Array}
		* @default ['left', 'top', 'angle', 'fill', 'width', 'height', 'fontSize', 'price']
		*/
		editorBoxParameters: ['left', 'top', 'angle', 'fill', 'width', 'height', 'fontSize', 'price'],
		/**
		* An array containing all available fonts.<br/>Since V4.3 you can use TrueType fonts (ttf), which is also recommend. TrueType fonts are required to include the font in the PDF for Fancy Product Designer - Admin, see example.
		*
		* @property fonts
		* @for FancyProductDesignerOptions.defaults
		* @type {Aarray}
		* @default [{name: 'Arial'}, {name: 'Lobster', url: 'google'}]
		* @example since V4.3 set font like this<br />[{name: "Lobster", url: "google"}, {name: 'Custom', url: 'https://yourdomain.com/fonts/custom.ttf"}]
		*/
		fonts: [{name: 'Arial'}, {name: 'Lobster', url: 'google'}],
		/**
		* The directory path that contains the templates.
		*
		* @property templatesDirectory
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default 'templates/'
		*/
		templatesDirectory: 'html/',
		/**
		* To add photos from Facebook, you have to set your own Facebook API key.
		*
		* @property facebookAppId
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default ''
		*/
		facebookAppId: '',
		/**
		* To add photos from Instagram, you have to set an <a href="http://instagram.com/developer/" target="_blank">Instagram client ID</a>.
		*
		* @property instagramClientId
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default ''
		*/
		instagramClientId: '', //the instagram client ID -
		/**
		* This URI to the php/instagram-auth.php. You have to update this option if you are using a different folder structure.
		*
		* @property instagramRedirectUri
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default ''
		*/
		instagramRedirectUri: '',
		/**
		* The zoom step when using the UI slider to change the zoom level.
		*
		* @property zoomStep
		* @for FancyProductDesignerOptions.defaults
		* @type {Number}
		* @default 0.2
		*/
		zoomStep: 0.2,
		/**
		* The maximal zoom factor. Set it to 1 to hide the zoom feature in the user interface.
		*
		* @property maxZoom
		* @for FancyProductDesignerOptions.defaults
		* @type {Number}
		* @default 3
		*/
		maxZoom: 3,
		/**
		* Set custom names for your hexdecimal colors. key=hexcode without #, value: name of the color.
		*
		* @property hexNames
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		* @default {}
		* @example hexNames: {000000: 'dark',ffffff: 'white'}
		*/
		hexNames: {},
		/**
		* The border color of the selected element.
		*
		* @property selectedColor
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default '#d5d5d5'
		*/
		selectedColor: '#f5f5f5',
		/**
		* The border color of the bounding box.
		*
		* @property boundingBoxColor
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default '#005ede'
		*/
		boundingBoxColor: '#005ede',
		/**
		* The border color of the element when its outside of his bounding box.
		*
		* @property outOfBoundaryColor
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default '#990000'
		*/
		outOfBoundaryColor: '#990000',
		/**
		* If true only the initial elements will be replaced when changing the product. Custom added elements will not be removed.
		*
		* @property replaceInitialElements
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default false
		*/
		replaceInitialElements: false,
		/**
		* If true lazy load will be used for the images in the "Designs" module and "Change Product" module.
		*
		* @property lazyLoad
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default true
		*/
		lazyLoad: true,
		/**
		* Defines the file type used for the templates. E.g. if you want to convert all template files (productdesigner.html, instagram_auth.html and canvaserror.html) into PHP files, you need to change this option to 'php'.
		*
		* @property templatesType
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default 'html'
		*/
		templatesType: 'html',
		/**
		* An object that contains the settings for the AJAX post when a custom added image is added to the canvas (Uploaded Images, Facebook/Instagram Photos). This allows to send the URL of the image to a custom-built script, that returns the data URI of the image or uploads the image to your server and returns the new URL on your server. By default the URL is send to php/custom-image-handler.php. See the <a href="http://api.jquery.com/jquery.ajax/" target="_blank">official jQuery.ajax documentation</a> for more information. The data object has a reserved property called url, which is the image URL that will send to the script. The success function is also reserved.
		*
		* @property customImageAjaxSettings
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		* @example
		* <pre> customImageAjaxSettings: {<br />  url: 'src/php/custom-image-handler.php',<br />  data: {<br/>   saveOnServer: 1, //image is uploaded to your server <br/>   uploadsDir: '/path/to/uploads_dir', //into this directory <br/>   uploadsDirURL: 'http://yourdomain.com/uploads_dir' //and returns the new URL from this location <br />}}</pre>
		*/
		customImageAjaxSettings: {
			/**
			* The URL to the custom-image-handler.php
			*
			* @property url
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.customImageAjaxSettings
			* @default 'php/custom-image-handler.php'
			*/
			url: 'php/custom-image-handler.php',
			/**
			* The HTTP method to use for the request.
			*
			* @property method
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.customImageAjaxSettings
			* @default 'POST'
			*/
			method: 'POST',
			/**
			* The type of data that you're expecting back from the server.
			*
			* @property dataType
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.customImageAjaxSettings
			* @default 'json'
			*/
			dataType: 'json',
			/**
			* The data object sent to the server.
			*
			* @property data
			* @type {Object}
			* @for FancyProductDesignerOptions.defaults.customImageAjaxSettings
			* @default {
				saveOnServer: 0, - use integer as boolean value. 0=false, 1=true
				uploadsDir: './uploads', - if saveOnServer is 1, you need to specify the directory path where the images are saved
				uploadsDirURL: 'http://yourdomain.com/uploads' - if saveOnServer is 1, you need to specify the directory URL where the images are saved
			}
			*/
			data: {
				saveOnServer: 0, //use integer as boolean value. 0=false, 1=true
				uploadsDir: './uploads', //if saveOnServer is true, you need to specify the directory path where the images are saved
				uploadsDirURL: 'http://yourdomain.com/uploads' //if saveOnServer is true, you need to specify the directory URL where the images are saved
			}
		},
		/**
		* Enable an improved resize filter, that may improve the image quality when its resized.
		*
		* @property improvedResizeQuality
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default false
		*/
		improvedResizeQuality: false,
		/**
		* Make the canvas and the elements in the canvas responsive.
		*
		* @property responsive
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default true
		*/
		responsive: true,
		/**
		* Hex color value defining the color for the corner icon controls.
		*
		* @property cornerIconColor
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default '#000000'
		*/
		cornerIconColor: '#000000', //hex
		/**
		* The URL to the JSON file or an object containing all content from the JSON file. Set to false, if you do not need it.
		*
		* @property langJSON
		* @for FancyProductDesignerOptions.defaults
		* @type {String | Object | Boolean}
		* @default 'lang/default.json'
		*/
		langJSON: 'lang/default.json',
		/**
		* The color palette when the color wheel is displayed.
		*
		* @property colorPickerPalette
		* @for FancyProductDesignerOptions.defaults
		* @type {Array}
		* @default []
		* @example ['#000', '#fff']
		*/
		colorPickerPalette: [], //when colorpicker is enabled, you can define a default palette
		/**
		* An object defining the available actions in the different zones.
		*
		* @property actions
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		* @default {'top': [], 'right': [], 'bottom': [], 'left': []}
		* @example {'top': ['manage-layers'], 'right': ['info'], 'bottom': ['undo', 'redo'], 'left': []}
		*/
		actions:  {
			'top': [],
			'right': [],
			'bottom': [],
			'left': []
		},
		/**
		* An array defining the available modules in the main bar. Possible values: 'products', 'images', 'text', 'designs'. 'names-numbers', 'drawing' requires Fancy Product Designer Plus Add-On.
		*
		* @property mainBarModules
		* @for FancyProductDesignerOptions.defaults
		* @type {Array}
		* @default ['products', 'images', 'text', 'designs']
		*/
		mainBarModules: ['products', 'images', 'text', 'designs', 'manage-layers'],
		/**
		* Set the initial active module.
		*
		* @property initialActiveModule
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default ''
		*/
		initialActiveModule: '',
		/**
		* An object defining the maximum values for input elements in the toolbar.
		*
		* @property maxValues
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default {}
		*/
		maxValues: {},
		/**
		* Set a watermark image when the user downloads/prints the product via the actions. To pass a watermark, just enter a string with an image URL.
		*
		* @property watermark
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean | String}
		* @default false
		*/
		watermark: false,
		/**
		* The number of columns used for the grid images in the images and designs module.
		*
		* @property gridColumns
		* @for FancyProductDesignerOptions.defaults
		* @type {Number}
		* @default 2
		*/
		gridColumns: 2,
		/**
		* Define the price format. Use %d as placeholder for the price.
		*
		* @property priceFormat
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default '&#36;%d'
		*/
		priceFormat: '&#36;%d',
		/**
		* The ID of an element that will be used as container for the main bar.
		*
		* @property mainBarContainer
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean | String}
		* @default false
		* @example #customMainBarContainer
		*/
		mainBarContainer: false,
		/**
		* The ID of an element that will be used to open the modal, in which the designer is included.
		*
		* @property modalMode
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean | String}
		* @default false
		* @example #modalButton
		*/
		modalMode: false,
		/**
		* Enable keyboard control. Use arrow keys to move and backspace key to delete selected element.
		*
		* @property keyboardControl
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default true
		*/
		keyboardControl: true,
		/**
		* Deselect active element when clicking outside of the product designer.
		*
		* @property deselectActiveOnOutside
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default true
		*/
		deselectActiveOnOutside: true,
		/**
		* All upload zones will be always on top of all elements.
		*
		* @property uploadZonesTopped
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default true
		*/
		uploadZonesTopped: true,
		/**
		* Loads the first initial product into stage.
		*
		* @property loadFirstProductInStage
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default true
		*/
		loadFirstProductInStage: true,
		/**
		* If the user leaves the page without saving the product or the getProduct() method is not, a alert window will pop up.
		*
		* @property unsavedProductAlert
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default false
		*/
		unsavedProductAlert: false,
		/**
		* If the user adds something and off-canvas panel or dialog is opened, it will be closed.
		*
		* @property hideDialogOnAdd
		* @for FancyProductDesignerOptions.defaults
		* @type {Boolean}
		* @default false
		*/
		hideDialogOnAdd: false,
		/**
		* Set the placement of the toolbar. Possible values: 'dynamic', 'inside-bottom', 'inside-top'
		*
		* @property toolbarPlacement
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default 'dynamic'
		*/
		toolbarPlacement: 'dynamic',
		/**
		* The grid size for snap action. First value defines the width on the a-axis, the second on the y-axis.
		*
		* @property snapGridSize
		* @for FancyProductDesignerOptions.defaults
		* @type {Array}
		* @default [50, 50]
		*/
		snapGridSize: [50, 50],
		/**
		* An object containing <a href="http://fabricjs.com/docs/fabric.Canvas.html" target="_blank">options for the fabricjs canvas</a>.
		*
		* @property fabricCanvasOptions
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		* @default {}
		*/
		fabricCanvasOptions: {},
		/**
		* Defines the values for the select element in the names & numbers module. Requires Fancy Product Designer Plus Add-On.
		*
		* @property namesNumbersDropdown
		* @for FancyProductDesignerOptions.defaults
		* @type {Array}
		* @default []
		*/
		namesNumbersDropdown: [],
		/**
		* Sets price for any extra entry in the names & numbers module. Requires Fancy Product Designer Plus Add-On.
		*
		* @property namesNumbersEntryPrice
		* @for FancyProductDesignerOptions.defaults
		* @type {Number}
		* @default 0
		*/
		namesNumbersEntryPrice: 0,
		/**
		* Sets the placement for the color selection, possible values: 'inside-tl', 'inside-tc', 'inside-tr', 'inside-bl', 'inside-bc', 'inside-br' or ID of another element(#my-color-selection). You have to define a main element in data-mainelement for the fpd-product element. Requires Fancy Product Designer Plus Add-On.
		*
		* @property colorSelectionPlacement
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default ''
		*/
		colorSelectionPlacement: '',
		/**
		* Sets the placement for the Bulk-Add Variations Form. Just enter ID or class of another element(#my-color-selection). Requires Fancy Product Designer Plus Add-On.
		*
		* @property bulkVariationsPlacement
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default ''
		*/
		bulkVariationsPlacement: '',
		/**
		* The available variations for the Bulk-Add Variations Form, e.g.: {'Size': ['XL', 'L', 'M', 'S'], 'Color': ['Red', 'Blue']}. Requires Fancy Product Designer Plus Add-On.
		*
		* @property bulkVariations
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		* @default {}
		*/
		bulkVariations: {},
		/**
		* The element where the toolbar will be appended when toolbarPlacement='dynamic'.
		*
		* @property toolbarContext
		* @for FancyProductDesignerOptions.defaults
		* @type {String}
		* @default 'body'
		*/
		toolbarDynamicContext: 'body',
		/**
		* Addtional properties for the bounding box. Can be used to set the stroke width etc.. See http://fabricjs.com/docs/fabric.Rect.html
		*
		* @property boundingBoxProps
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		* @default {strokeWidth: 1}
		*/
		boundingBoxProps: {strokeWidth: 1},
		/**
		* An object containing the default element parameters in addition to the <a href="http://fabricjs.com/docs/fabric.Object.html" target="_blank">default Fabric Object properties</a>. See <a href="./FancyProductDesignerOptions.defaults.elementParameters.html">FancyProductDesignerOptions.defaults.elementParameters</a>.
		*
		* @property elementParameters
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		elementParameters: {
			/**
			* Allows to set the z-index of an element, -1 means it will be added on the stack of layers
			*
			* @property z
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default -1
			*/
			z: -1,
			/**
			* The price for the element.
			*
			* @property price
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default 0
			*/
			price: 0, //how much does the element cost
			/**
			* <ul><li>If false, no colorization for the element is possible.</li><li>One hexadecimal color will enable the colorpicker</li><li>Mulitple hexadecimal colors separated by commmas will show a range of colors the user can choose from.</li></ul>
			*
			* @property colors
			* @type {Boolean | String}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			* @example colors: "#000000" => Colorpicker, colors: "#000000,#ffffff" => Range of colors
			*/
			colors: false,
			/**
			* If true the user can remove the element.
			*
			* @property removable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			removable: false,
			/**
			* If true the user can drag the element.
			*
			* @property draggable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			draggable: false,
			/**
			* If true the user can rotate the element.
			*
			* @property rotatable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			rotatable: false,
			/**
			* If true the user can resize the element.
			*
			* @property resizable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			resizable: false,
			/**
			* If true the user can copy non-initial elements.
			*
			* @property copyable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			copyable: false,
			/**
			* If true the user can change the z-position the element.
			*
			* @property zChangeable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			zChangeable: false,
			/**
			* Defines a bounding box (printing area) for the element.<ul>If false no bounding box</li><li>The title of an element in the same view, then the boundary of the target element will be used as bounding box.</li><li>An object with x,y,width and height defines the bounding box</li></ul>
			*
			* @property boundingBox
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			boundingBox: false,
			/**
			* Set the mode for the bounding box. Possible values: 'none', 'clipping', 'limitModify', 'inside'
			*
			* @property boundingBoxMode
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default 'inside'
			*/
			boundingBoxMode: 'inside',
			/**
			* Centers the element in the canvas or when it has a bounding box in the bounding box.
			*
			* @property autoCenter
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			autoCenter: false,
			/**
			* Replaces an element with the same type and replace value.
			*
			* @property replace
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default ''
			*/
			replace: '',
			/**
			* If a replace value is set, you can decide if the element replaces the elements with the same replace value in all views or only in the current showing view.
			*
			* @property replaceInAllViews
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default ''
			*/
			replaceInAllViews: false,
			/**
			* Selects the element when its added to stage.
			*
			* @property autoSelect
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			autoSelect: false,
			/**
			* Sets the element always on top.
			*
			* @property topped
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			*/
			topped: false,
			/**
			* You can define different prices when using a range of colors, set through the colors option.
			*
			* @property colorPrices
			* @type {Object}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default {}
			* @example colorPrices: {"000000": 2, "ffffff: "3.5"}
			*/
			colorPrices: {},
			/**
			* Include the element in a color link group. So elements with the same color link group are changing to same color as soon as one element in the group is changing the color.
			*
			* @property colorLinkGroup
			* @type {Boolean | String}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default false
			* @example 'my-color-group'
			*/
			colorLinkGroup: false,
			/**
			* An array of URLs to pattern image - onyl for SVG images or text elements.
			*
			* @property patterns
			* @type {Array}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default []
			* @example patterns: ['patterns/pattern_1.png', 'patterns/pattern_2.png',]
			*/
			patterns: [],
			/**
			* An unique identifier for the element.
			*
			* @property sku
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.elementParameters
			* @default ''
			*/
			sku: '',
			originX: 'center',
			originY: 'center',
			cornerSize: 24,
			fill: false,
			lockUniScaling: true,
			pattern: false,
			top: 0,
			left: 0,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			scaleX: 1,
			scaleY: 1,
			excludeFromExport: false,
		},
		/**
		* An object containing the default text element parameters in addition to the <a href="http://fabricjs.com/docs/fabric.IText.html" target="_blank">default Fabric IText properties</a>. See <a href="./FancyProductDesignerOptions.defaults.textParameters.html">FancyProductDesignerOptions.defaults.textParameters</a>. The properties in the object will merge with the properties in the elementParameters.
		*
		* @property textParameters
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		textParameters: {
			/**
			* The maximal allowed characters. 0 means unlimited characters.
			*
			* @property maxLength
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default 0
			*/
			maxLength: 0,
			/**
			* If true the text will be curved.
			*
			* @property curved
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default false
			*/
			curved: false,
			/**
			* If true the the user can switch between curved and normal text.
			*
			* @property curvable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default false
			*/
			curvable: false,
			/**
			* The letter spacing when the text is curved.
			*
			* @property curveSpacing
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default 10
			*/
			curveSpacing: 10,
			/**
			* The radius when the text is curved.
			*
			* @property curveRadius
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default 80
			*/
			curveRadius: 80,
			/**
			* Reverses the curved text.
			*
			* @property curveReverse
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default false
			*/
			curveReverse: false,
			/**
			* The maximal allowed lines. 0 means unlimited characters.
			*
			* @property maxLines
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default 0
			*/
			maxLines: 0,
			/**
			* Enables the text element as a text box. A text box has a fixed width and not be resized.
			*
			* @property textBox
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default false
			*/
			textBox: false,
			/**
			* Enables the text element as a placeholder for the Names & Numbers module. You can enable this parameter for one text element in a view.
			*
			* @property textPlaceholder
			* @type {Boolean | Array}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default false
			*/
			textPlaceholder: false,
			/**
			* Enables the text element as a number placeholder for the Names & Numbers module. You can enable this parameter for one text element in a view. If you want to define a range of allowed numbers, just use an array. The first value in the array defines the minimum value, the second value defines the maximum value, e.g. [0, 10].
			*
			* @property numberPlaceholder
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default false
			*/
			numberPlaceholder: false,
			/**
			* Addtional space between letters.
			*
			* @property letterSpacing
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.textParameters
			* @default 0
			*/
			letterSpacing: 0,
			editable: true,
			fontFamily: "Arial",
			fontSize: 18,
			lineHeight: 1,
			fontWeight: 'normal', //set the font weight - bold or normal
			fontStyle: 'normal', //'normal', 'italic'
			textDecoration: 'normal', //'normal' or 'underline'
			padding: 10,
			textAlign: 'left',
			stroke: null,
			strokeWidth: 0,
			charSpacing: 0,
		},
		/**
		* An object containing the default image element parameters in addition to the <a href="http://fabricjs.com/docs/fabric.Image.html" target="_blank">default Fabric Image properties</a>. See <a href="./FancyProductDesignerOptions.defaults.imageParameters.html">FancyProductDesignerOptions.defaults.imageParameters</a>. The properties in the object will merge with the properties in the elementParameters.
		*
		* @property imageParameters
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		imageParameters: {
			/**
			* If true the image will be used as upload zone. That means the image is a clickable area in which the user can add different media types.
			*
			* @property uploadZone
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.imageParameters
			* @default false
			*/
			uploadZone: false,
			/**
			* Sets a filter on the image. Possible values: 'grayscale', 'sepia', 'sepia2'
			*
			* @property filter
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.imageParameters
			* @default false
			*/
			filter: false,
			/**
			* An array of filters the user can choose from.
			*
			* @property availableFilters
			* @type {Array}
			* @for FancyProductDesignerOptions.defaults.imageParameters
			* @default []
			* @example availableFilters: ['grayscale', 'sepia', 'sepia2']
			*/
			availableFilters: [],
			/**
			* Allow user to unlock proportional resizing in the toolbar.
			*
			* @property uniScalingUnlockable
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.imageParameters
			* @default false
			*/
			uniScalingUnlockable: false,
			/**
			* Set the scale mode when image is added in upload zone. Possible values: 'fit', 'cover'
			*
			* @property uploadZoneScaleMode
			* @type {String}
			* @for FancyProductDesignerOptions.defaults.imageParameters
			* @default 'fit'
			*/
			scaleMode: 'fit',
			/**
			* Resizes the uploaded image to this width.
			*
			* @property resizeToW
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 300
			*/
			resizeToW: 0,
			/**
			* Resizes the uploaded image to this height.
			*
			* @property resizeToH
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 300
			*/
			resizeToH: 0,
			padding: 0,
			minScaleLimit: 0.01
		},
		/**
		* An object containing the default parameters for custom added images. See <a href="./FancyProductDesignerOptions.defaults.customImageParameters.html">FancyProductDesignerOptions.defaults.customImageParameters</a>. The properties in the object will merge with the properties in the elementParameters and imageParameters.
		*
		* @property customImageParameters
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		customImageParameters: {
			/**
			* The minimum upload size width.
			*
			* @property minW
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 100
			*/
			minW: 100,
			/**
			* The minimum upload size height.
			*
			* @property minH
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 100
			*/
			minH: 100,
			/**
			* The maximum upload size width.
			*
			* @property maxW
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 1500
			*/
			maxW: 1500,
			/**
			* The maximum upload size height.
			*
			* @property maxH
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 1500
			*/
			maxH: 1500,
			/**
			* The minimum allowed DPI for uploaded images. Works only with JPEG images.
			*
			* @property minDPI
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 72
			*/
			minDPI: 72,
			/**
			* The maxiumum image size in MB.
			*
			* @property maxSize
			* @type {Number}
			* @for FancyProductDesignerOptions.defaults.customImageParameters
			* @default 10
			*/
			maxSize: 10
		},
		/**
		* An object containing additional parameters for custom added text.The properties in the object will merge with the properties in the elementParameters and textParameters.
		*
		* @property customTextParameters
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		customTextParameters: {

		},
		/**
		* An object containing the supported media types the user can add in the product designer.
		*
		* @property customAdds
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		customAdds: {
			/**
			* If true the user can add images from the designs library.
			*
			* @property designs
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.customAdds
			* @default true
			*/
			designs: true,
			/**
			* If true the user can add an own image.
			*
			* @property uploads
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.customAdds
			* @default true
			*/
			uploads: true,
			/**
			* If true the user can add own text.
			*
			* @property texts
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.customAdds
			* @default true
			*/
			texts: true,
			/**
			* If true the user can add own drawings.
			*
			* @property drawing
			* @type {Boolean}
			* @for FancyProductDesignerOptions.defaults.customAdds
			* @default true
			*/
			drawing: true
		},
		/**
		* An object containing the properties (parameters) for the QR code.
		*
		* @property qrCodeProps
		* @for FancyProductDesignerOptions.defaults
		* @type {Object}
		*/
		qrCodeProps: {
			autoCenter: true,
			draggable: true,
			removable: true,
			resizable: true
		}
	};

	/**
	 * Merges the default options with custom options.
	 *
	 * @method merge
	 * @for FancyProductDesignerOptions
	 * @param {Object} defaults The default object.
	 * @param {Object} [merge] The merged object, that will be merged into the defaults.
	 * @return {Object} The new options object.
	 */
	this.merge = function(defaults, merge) {

		typeof merge === 'undefined' ? {} : merge;

		var options = $.extend({}, defaults, merge);
		options.elementParameters = $.extend({}, defaults.elementParameters, options.elementParameters);
		options.textParameters = $.extend({}, defaults.textParameters, options.textParameters);
		options.imageParameters = $.extend({}, defaults.imageParameters, options.imageParameters);
		options.customTextParameters = $.extend({}, defaults.customTextParameters, options.customTextParameters);
		options.customImageParameters = $.extend({}, defaults.customImageParameters, options.customImageParameters);
		options.customAdds = $.extend({}, defaults.customAdds, options.customAdds);
		options.customImageAjaxSettings = $.extend({}, defaults.customImageAjaxSettings, options.customImageAjaxSettings);
		options.qrCodeProps = $.extend({}, defaults.qrCodeProps, options.qrCodeProps);

		return options;

	};

	/**
	 * Returns all element parameter keys.
	 *
	 * @method getParameterKeys
	 * @for FancyProductDesignerOptions
	 * @return {Array} An array containing all element parameter keys.
	 */
	this.getParameterKeys = function() {

		var elementParametersKeys = Object.keys(this.defaults.elementParameters),
			imageParametersKeys = Object.keys(this.defaults.imageParameters),
			textParametersKeys = Object.keys(this.defaults.textParameters);

		elementParametersKeys = elementParametersKeys.concat(imageParametersKeys);
		elementParametersKeys = elementParametersKeys.concat(textParametersKeys);

		return elementParametersKeys;

	};

};

/**
 * The class to create a view. A view contains the canvas. You need to call {{#crossLink "FancyProductDesignerView/setup:method"}}{{/crossLink}} to set up the canvas with all elements, after setting an instance of {{#crossLink "FancyProductDesignerView"}}{{/crossLink}}.
 *
 * @class FancyProductDesignerView
 * @constructor
 * @param {jQuery} elem - jQuery object holding the container.
 * @param {Object} view - The default options for the view.
 * @param {Function} callback - This function will be called as soon as the view and all initial elements are loaded.
 * @param {Object} fabricjsCanvasOptions - Options for the fabricjs canvas.
 */
var FancyProductDesignerView = function($productStage, view, callback, fabricCanvasOptions) {

	fabricCanvasOptions = typeof fabricCanvasOptions === 'undefined' ? {} : fabricCanvasOptions;

	var $this = $(this),
		instance = this,
		mouseDownStage = false,
		initialElementsLoaded = false,
		tempModifiedParameters = null,
		modifiedType = null,
		limitModifyParameters = {},
		fpdOptions = new FancyProductDesignerOptions();

	var _initialize = function() {

		/**
		 * The view title.
		 *
		 * @property title
		 * @type String
		 */
		instance.title = view.title;
		/**
		 * The view thumbnail.
		 *
		 * @property thumbnail
		 * @type String
		 */
		instance.thumbnail = view.thumbnail;
		/**
		 * The view elements.
		 *
		 * @property elements
		 * @type Object
		 */
		instance.elements = view.elements;
		/**
		 * The view options.
		 *
		 * @property options
		 * @type Object
		 */
		instance.options = view.options;
		/**
		 * The view undos.
		 *
		 * @property undos
		 * @type Array
		 * @default []
		 */
		instance.undos = [];
		/**
		 * The view redos.
		 *
		 * @property redos
		 * @type Array
		 * @default []
		 */
		instance.redos = [];
		/**
		 * The total price for the view.
		 *
		 * @property totalPrice
		 * @type Number
		 * @default 0
		 */
		instance.totalPrice = 0;
		/**
		 * The set zoom for the view.
		 *
		 * @property zoom
		 * @type Number
		 * @default 0
		 */
		instance.zoom = 1;
		/**
		 * The responsive scale.
		 *
		 * @property responsiveScale
		 * @type Number
		 * @default 1
		 */
		instance.responsiveScale = 1;
		/**
		 * The current selected element.
		 *
		 * @property currentElement
		 * @type fabric.Object
		 * @default null
		 */
		instance.currentElement = null;
		/**
		 * The current selected bounding box object.
		 *
		 * @property currentBoundingObject
		 * @type fabric.Object
		 * @default null
		 */
		instance.currentBoundingObject = null;
		/**
		 * The title of the current selected upload zone.
		 *
		 * @property currentUploadZone
		 * @type String
		 * @default null
		 */
		instance.currentUploadZone = null;
		/**
		 * An instance of fabricjs canvas class. <a href="http://fabricjs.com/docs/fabric.Canvas.html" target="_blank">It allows to interact with the fabricjs API.</a>
		 *
		 * @property stage
		 * @type fabric.Canvas
		 * @default null
		 */
		instance.stage = null;
		/**
		 * Properties to include when using the {{#crossLink "FancyProductDesignerView/getJSON:method"}}{{/crossLink}} or {{#crossLink "FancyProductDesignerView/getElementJSON:method"}}{{/crossLink}}.
		 *
		 * @property propertiesToInclude
		 * @type Array
		 * @default ['_isInitial', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'lockScalingFlip', 'lockUniScaling', 'resizeType', 'clipTo', 'clippingRect', 'boundingBox', 'boundingBoxMode', 'selectable', 'evented', 'title', 'editable', 'cornerColor', 'cornerIconColor', 'borderColor', 'isEditable', 'hasUploadZone']
		 */
		instance.propertiesToInclude = ['_isInitial', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY', 'lockScalingFlip', 'lockUniScaling', 'resizeType', 'clipTo', 'clippingRect', 'boundingBox', 'boundingBoxMode', 'selectable', 'evented', 'title', 'editable', 'cornerColor', 'cornerIconColor', 'borderColor', 'isEditable', 'hasUploadZone'];
		instance.dragStage = false;

		//PLUS
		instance.textPlaceholder = null;
		instance.numberPlaceholder = null;
		instance.names_numbers = view.names_numbers ? view.names_numbers : null;

		//replace old width option with stageWidth
		if(instance.options.width) {
			instance.options.stageWidth = instance.options.width;
			delete instance.options['width'];
		}

		//add new canvas
		$productStage.append('<canvas></canvas>');

		$this.on('elementAdd', function(evt, element){

			if(!element) {
				return;
			}

			//check for other topped elements
			_bringToppedElementsToFront();

			if(element.isCustom && !element.hasUploadZone && !element.replace) {
				element.copyable = element.originParams.copyable = true;
				instance.stage.renderAll();
			}

		});

		//create fabric stage
		var canvas = $productStage.children('canvas:last').get(0),
			canvasOptions = $.extend({}, {
				containerClass: 'fpd-view-stage fpd-hidden',
				selection: false,
				hoverCursor: 'pointer',
				controlsAboveOverlay: true,
				centeredScaling: true,
				allowTouchScrolling: true,
				preserveObjectStacking: true
			}, fabricCanvasOptions);

		instance.stage = new fabric.Canvas(canvas, canvasOptions).on({
			'object:added': function(opts) {

				var element = opts.target,
					price = element.price;

				//if element is addded into upload zone, use upload zone price if one is set
				if((instance.currentUploadZone && instance.currentUploadZone != '')) {

					var uploadZoneObj = instance.getElementByTitle(instance.currentUploadZone);
					price = uploadZoneObj.price ? uploadZoneObj.price : price;

				}

				if(price !== undefined && price !== 0 && !element.uploadZone && element.type !== 'rect') {

					element.setCoords();
					instance.changePrice(price, '+');

				}

			},
			'object:removed': function(opts) {

				var element = opts.target;

				if(element.price !== undefined && element.price !== 0 && !element.uploadZone) {
					instance.changePrice(element.price, '-');
				}

			}
		});

		instance.stage.setDimensions({width: instance.options.stageWidth, height: instance.options.stageHeight});

	};

	var _afterSetup = function() {

		callback.call(callback, instance);

		initialElementsLoaded = true;

		if(instance.options.keyboardControl) {

			$(document).on('keydown', function(evt) {

				var $target = $(evt.target);

				if(instance.currentElement && !$target.is('textarea,input[type="text"],input[type="number"]')) {

					switch(evt.which) {
						case 8:
							//remove element
							if(instance.currentElement.removable) {
								instance.removeElement(instance.currentElement);
							}

						break;
				        case 37: // left

					        if(instance.currentElement.draggable) {
						        instance.setElementParameters({left: instance.currentElement.left - 1});
					        }

				        break;
				        case 38: // up

				        	if(instance.currentElement.draggable) {
						        instance.setElementParameters({top: instance.currentElement.top - 1});
					        }

				        break;
				        case 39: // right

				        	if(instance.currentElement.draggable) {
						        instance.setElementParameters({left: instance.currentElement.left + 1});
					        }

				        break;
				        case 40: // down

				        	if(instance.currentElement.draggable) {
						        instance.setElementParameters({top: instance.currentElement.top + 1});
					        }

				        break;

				        default: return; //other keys
				    }

				    evt.preventDefault();

				}

			});

		}

		//attach handlers to stage
		instance.stage.on({
			'mouse:over': function(opts) {

				if(instance.currentElement && instance.currentElement.draggable && opts.target === instance.currentElement) {
					instance.stage.hoverCursor = 'move';
				}
				else {
					instance.stage.hoverCursor = 'pointer';
				}

			},
			'mouse:down': function(opts) {

				mouseDownStage = true;

				if(opts.target == undefined) {
					instance.deselectElement();
				}

			},
			'mouse:up': function(opts) {

				var targetCorner = false;
				if(opts.target) {
					targetCorner = opts.target.__corner;
				}

				tempModifiedParameters = instance.getElementJSON();

				//remove element
				if(targetCorner == 'bl' && instance.currentElement.removable) {
					instance.removeElement(instance.currentElement);
				}

				//copy element
				if(targetCorner == 'tl' && instance.currentElement.copyable && !instance.currentElement.hasUploadZone) {

					var newOpts = instance.getElementJSON();
					newOpts.autoCenter = true;

					instance.addElement(
						FPDUtil.getType(instance.currentElement.type),
						instance.currentElement.source,
						'Copy '+instance.currentElement.title,
						newOpts
					);

				}

				mouseDownStage = false;

			},
			'mouse:move': function(opts) {

				if(mouseDownStage && instance.dragStage) {

					instance.stage.relativePan(new fabric.Point(opts.e.movementX, opts.e.movementY));

				}

			},
			'text:changed': function(opts) {

				instance.setElementParameters({text: opts.target.text});

			},
			'object:moving': function(opts) {

				modifiedType = 'moving';
				_checkContainment(opts.target);

				/**
			     * Gets fired when an element is changing via drag, resize or rotate.
			     *
			     * @event FancyProductDesignerView#elementChange
			     * @param {Event} event
			     * @param {String} modifiedType - The modified type.
			     * @param {fabric.Object} element - The fabricJS object.
			     */
				$this.trigger('elementChange', [modifiedType, opts.target]);

			},
			'object:scaling': function(opts) {

				modifiedType = 'scaling';
				_checkContainment(opts.target);

				$this.trigger('elementChange', [modifiedType, opts.target]);

			},
			'object:rotating': function(opts) {

				modifiedType = 'rotating';
				_checkContainment(opts.target);

				$this.trigger('elementChange', [modifiedType, opts.target]);

			},
			'object:modified': function(opts) {

				if(tempModifiedParameters) {

					_setUndoRedo({element: opts.target, parameters: tempModifiedParameters, interaction: 'modify'});
					tempModifiedParameters = null;

				}

				if(FPDUtil.getType(opts.target.type) === 'text' && opts.target.type !== 'curvedText') {

					var newFontSize = opts.target.fontSize * opts.target.scaleX;
					newFontSize = parseFloat(Number(newFontSize).toFixed(0));
					//newFontSize = newFontSize < opts.target.minFontSize ? opts.target.minFontSize : newFontSize;
		            opts.target.scaleX = 1;
		            opts.target.scaleY = 1;
		            opts.target._clearCache();
		            opts.target.fontSize = newFontSize;

				}

				if(modifiedType !== null) {

					var modifiedParameters = {};

					switch(modifiedType) {
						case 'moving':
							modifiedParameters.left = Number(opts.target.left);
							modifiedParameters.top = Number(opts.target.top);
						break;
						case 'scaling':
							if(FPDUtil.getType(opts.target.type) === 'text' && opts.target.type !== 'curvedText') {
								modifiedParameters.fontSize = parseInt(opts.target.fontSize);
							}
							else {
								modifiedParameters.scaleX = parseFloat(opts.target.scaleX);
								modifiedParameters.scaleY = parseFloat(opts.target.scaleY);
							}
						break;
						case 'rotating':
							modifiedParameters.angle = opts.target.angle;
						break;
					}

					/**
				     * Gets fired when an element is modified.
				     *
				     * @event FancyProductDesignerView#elementModify
				     * @param {Event} event
				     * @param {fabric.Object} element - The fabricJS object.
				     * @param {Object} modifiedParameters - The modified parameters.
				     */
					$this.trigger('elementModify', [opts.target, modifiedParameters]);
				}

				modifiedType = null;

			},
			'object:selected': function(opts) {

				var selectedElement = opts.target;

				instance.deselectElement(false);

				//dont select anything when in dragging mode
				if(instance.dragStage) {
					instance.deselectElement();
					return false;
				}

				instance.currentElement = selectedElement;

				/**
			     * Gets fired as soon as an element is selected.
			     *
			     * @event FancyProductDesignerView#elementSelect
			     * @param {Event} event
			     * @param {fabric.Object} currentElement - The current selected element.
			     */
				$this.trigger('elementSelect', [selectedElement]);

				selectedElement.setControlVisible('tr', false);
				selectedElement.set({
					borderColor: instance.options.selectedColor,
					rotatingPointOffset: 0
				});

				//change cursor to move when element is draggable
				selectedElement.draggable ? instance.stage.hoverCursor = 'move' : instance.stage.hoverCursor = 'pointer';

				//check for a boundingbox
				if(selectedElement.boundingBox && !instance.options.editorMode) {

					var bbCoords = instance.getBoundingBoxCoords(opts.target);
					if(bbCoords) {

						var boundingBoxProps = {
							left: bbCoords.left,
							top: bbCoords.top,
							width: bbCoords.width,
							height: bbCoords.height,
							stroke: instance.options.boundingBoxColor,
							strokeWidth: 1,
							strokeLineCap: 'square',
							strokeDashArray: [5, 5],
							fill: false,
							selectable: false,
							evented: false,
							originX: 'left',
							originY: 'top',
							name: "bounding-box",
							excludeFromExport: true
						};

						boundingBoxProps = $.extend({}, boundingBoxProps, instance.options.boundingBoxProps);
						instance.currentBoundingObject = new fabric.Rect(boundingBoxProps);

						instance.stage.add(instance.currentBoundingObject);
						instance.currentBoundingObject.bringToFront();

						/**
					     * Gets fired when bounding box is toggling.
					     *
					     * @event FancyProductDesignerView#boundingBoxToggle
					     * @param {Event} event
					     * @param {fabric.Object} currentBoundingObject - The current bounding box object.
					     * @param {Boolean} state
					     */
						$this.trigger('boundingBoxToggle', [instance.currentBoundingObject, true]);

					}

					_checkContainment(opts.target);
				}

			}
		});

	};

	var _setUndoRedo = function(undo, redo, trigger) {

		trigger = typeof trigger === 'undefined' ? true : trigger;

		if(undo) {
			instance.undos.push(undo);

			if(instance.undos.length > 20) {
				instance.undos.shift();
			}
		}

		if(redo) {
			instance.redos.push(redo);
		}

		if(trigger) {

			/**
		     * Gets fired when the canvas has been saved in the undos or redos array.
		     *
		     * @event FancyProductDesignerView#undoRedoSet
		     * @param {Event} event
		     * @param {Array} undos - An array containing all undo objects.
		     * @param {Array} redos - An array containing all redos objects.
		    */

			$this.trigger('undoRedoSet', [instance.undos, instance.redos]);

		}

	};

	//brings all topped elements to front
	var _bringToppedElementsToFront = function() {

		var objects = instance.stage.getObjects(),
			bringToFrontObj = [];

		for(var i = 0; i < objects.length; ++i) {
			var object = objects[i];
			if(object.topped || (object.uploadZone && instance.options.uploadZonesTopped)) {
				bringToFrontObj.push(object);
			}
		}

		for(var i = 0; i < bringToFrontObj.length; ++i) {
			bringToFrontObj[i].bringToFront();
		}

		//bring all elements inside a upload zone to front
		/*for(var i = 0; i < objects.length; ++i) {
			var object = objects[i];
			if(object.hasUploadZone) {
				object.bringToFront().setCoords();
			}
		}*/

		if(instance.currentBoundingObject) {
			instance.currentBoundingObject.bringToFront();
		}

		var snapLinesGroup = instance.getElementByID('_snap_lines_group');
		if(snapLinesGroup) {
			snapLinesGroup.bringToFront();
		}

		instance.stage.renderAll();

	};

	//checks if an element is in its containment (bounding box)
	var _checkContainment = function(target) {

		if(instance.currentBoundingObject && !target.hasUploadZone) {

			target.setCoords();

			if(target.boundingBoxMode === 'limitModify') {

				var targetBoundingRect = target.getBoundingRect(),
					bbBoundingRect = instance.currentBoundingObject.getBoundingRect(),
					minX = bbBoundingRect.left,
					maxX = bbBoundingRect.left+bbBoundingRect.width-targetBoundingRect.width;
					minY = bbBoundingRect.top,
					maxY = bbBoundingRect.top+bbBoundingRect.height-targetBoundingRect.height;

				//check if target element is not contained within bb
			    if(!target.isContainedWithinObject(instance.currentBoundingObject)) {

					//check if no corner is used, 0 means its dragged
					if(target.__corner === 0) {
						if(targetBoundingRect.left > minX && targetBoundingRect.left < maxX) {
						   limitModifyParameters.left = target.left;
					    }

					    if(targetBoundingRect.top > minY && targetBoundingRect.top < maxY) {
						   limitModifyParameters.top = target.top;
					    }
					}

			        target.setOptions(limitModifyParameters);


			    } else {

				    limitModifyParameters = {left: target.left, top: target.top, angle: target.angle, scaleX: target.scaleX, scaleY: target.scaleY};

			    }

				/**
			     * Gets fired when the containment of an element is checked.
			     *
			     * @event FancyProductDesignerView#elementCheckContainemt
			     * @param {Event} event
			     * @param {fabric.Object} target
			     * @param {Boolean} boundingBoxMode
			     */
			    $this.trigger('elementCheckContainemt', [target, 'limitModify']);

			}
			else if(target.boundingBoxMode === 'inside' || target.boundingBoxMode === 'clipping') {

				var isOut = false,
					tempIsOut = target.isOut;

					isOut = !target.isContainedWithinObject(instance.currentBoundingObject);

				if(isOut) {

					if(target.boundingBoxMode === 'inside') {
						target.borderColor = instance.options.outOfBoundaryColor;
					}

					target.isOut = true;

				}
				else {

					if(target.boundingBoxMode === 'inside') {
						target.borderColor = instance.options.selectedColor;
					}

					target.isOut = false;

				}

				if(tempIsOut != target.isOut && tempIsOut != undefined) {
					if(isOut) {

						/**
					     * Gets fired as soon as an element is outside of its bounding box.
					     *
					     * @event FancyProductDesignerView#elementOut
					     * @param {Event} event
					     */
						$this.trigger('elementOut', [target]);
					}
					else {

						/**
					     * Gets fired as soon as an element is inside of its bounding box again.
					     *
					     * @event FancyProductDesignerView#elementIn
					     * @param {Event} event
					     */
						$this.trigger('elementIn', [target]);
					}
				}

				$this.trigger('elementCheckContainemt', [target, target.boundingBoxMode]);

			}

		}

		instance.stage.renderAll();

	};

	//center object
	var _centerObject = function(object, hCenter, vCenter, boundingBox) {

		var cp = object.getCenterPoint(),
			left = cp.x,
			top = cp.y;

		if(hCenter) {

			if(boundingBox) {
				left = boundingBox.left + boundingBox.width * 0.5;
			}
			else {
				left = instance.options.stageWidth * 0.5;
			}

		}

		if(vCenter) {
			if(boundingBox) {
				top = boundingBox.top + boundingBox.height * 0.5;
			}
			else {
				top = instance.options.stageHeight * 0.5;
			}

		}

		object.setPositionByOrigin(new fabric.Point(left, top), 'center', 'center');

		instance.stage.renderAll();
		object.setCoords();

		_checkContainment(object);

	};

	//loads custom fonts
	var _renderOnFontLoaded = function(fontName, element) {

		WebFont.load({
			custom: {
			  families: [fontName]
			},
			fontactive: function(familyName, fvd) {

				//$('body').mouseup();
				instance.stage.renderAll();

				if(element) {

					//fix: reset font size, otherwise custom font is not displaying
					if(element._tempFontSize !== null) {
						element.setFontSize(element._tempFontSize);
					}
					else {
						var correctFontSize = element.fontSize;
						element.setFontSize(correctFontSize - 1);
						element.setFontSize(correctFontSize);
					}

					element.setCoords();
					instance.stage.renderAll();

					element._tempFontSize = null;
				}

			}
		});

	};

	//sets the price for the element if it has color prices
	var _setColorPrice = function(element, hex) {

		if(element.colorPrices && typeof element.colors === 'object' && element.colors.length > 1) {

			if(element.currentColorPrice !== undefined) {
				element.price -= element.currentColorPrice;
				instance.changePrice(element.currentColorPrice, '-');
			}

			if(typeof hex === 'string') {

				var hexKey = hex.replace('#', '');
				if(element.colorPrices.hasOwnProperty(hexKey) || element.colorPrices.hasOwnProperty(hexKey.toUpperCase())) {

					var elementColorPrice = element.colorPrices[hexKey] === undefined ? element.colorPrices[hexKey.toUpperCase()] : element.colorPrices[hexKey];

					element.currentColorPrice = elementColorPrice;
					element.price += element.currentColorPrice;
					instance.changePrice(element.currentColorPrice, '+');

				}
				else {
					element.currentColorPrice = 0;
				}

			}
			else {
				element.currentColorPrice = 0;
			}

		}

	};

	//sets the pattern for a svg image or text
	var _setPattern = function(element, url) {

		if(element.type == 'path-group') {

			if(url) {
				fabric.util.loadImage(url, function(img) {

					for(var i=0; i < element.paths.length; ++i) {
						element.paths[i].setFill(new fabric.Pattern({
							source: img,
							repeat: 'repeat'
						}));
					}

					instance.stage.renderAll();
				});
			}

		}
		else if(FPDUtil.getType(element.type) === 'text') {

			if(url) {
				fabric.util.loadImage(url, function(img) {

					element.setFill(new fabric.Pattern({
						source: img,
						repeat: 'repeat'
					}));
					instance.stage.renderAll();
				});
			}
			else {
				var color = element.fill ? element.fill : element.colors[0];
				color = color ? color : '#000000';
				element.setFill(color);
			}

		}

	};

	//defines the clipping area
	var _clipElement = function(element) {

		var bbCoords = instance.getBoundingBoxCoords(element) || element.clippingRect;
		if(bbCoords) {

			element.clippingRect = bbCoords;
			element.setClipTo(function(ctx) {
				_clipById(ctx, this);
			});

		}

	};

	//draws the clipping
	var _clipById = function (ctx, _this, scale) {

		scale = scale === undefined ? 1 : scale;

		var centerPoint = _this.getCenterPoint(),
			clipRect = _this.clippingRect,
			scaleXTo1 = (1 / _this.scaleX),
			scaleYTo1 = (1 / _this.scaleY);

	    ctx.save();
	    ctx.translate(0,0);
	    ctx.rotate(fabric.util.degreesToRadians(_this.angle * -1));
	    ctx.scale(scaleXTo1, scaleYTo1);
	    ctx.beginPath();
	    ctx.rect(
	        (clipRect.left) - centerPoint.x,
	        (clipRect.top) - centerPoint.y,
	        clipRect.width * scale,
	        clipRect.height * scale
	    );
	    ctx.fillStyle = 'transparent';
	    ctx.fill();
	    ctx.closePath();
	    ctx.restore();

	};

	//returns the fabrich filter
	var _getFabircFilter = function(type) {

		switch(type) {
			case 'grayscale':
				return new fabric.Image.filters.Grayscale();
			break;
			case 'sepia':
				return new fabric.Image.filters.Sepia();
			break;
			case 'sepia2':
				return new fabric.Image.filters.Sepia2();
			break;
		}

		return null;

	};

	var _elementHasUploadZone = function(element) {

		if(element && element.hasUploadZone) {

			//check if upload zone contains objects
			var objects = instance.stage.getObjects(),
				uploadZoneEmpty = true;

			for(var i=0; i < objects.length; ++i) {

				var object = objects[i];
				if(object.replace == element.replace) {
					uploadZoneEmpty = false;
					break;
				}

			}

			var uploadZoneObject = instance.getUploadZone(element.replace);
			if(uploadZoneObject) {
				uploadZoneObject.opacity = uploadZoneEmpty ? 1 : 0;
				uploadZoneObject.evented = uploadZoneEmpty;
			}

			instance.stage.renderAll();
		}

	};

	var _maxTextboxLines = function(textbox, text) {

		textbox.setText(text); //render text

		//loop: remove chars as long as lineHeights = maxLines
		while(textbox.__lineHeights.length > textbox.maxLines) {
			text = textbox.text;
			text = text.slice(0, -1);
			textbox.setText(text);
			//if lineHeights are ok, exit editing
			if(textbox.__lineHeights.length <= textbox.maxLines) {
				textbox.exitEditing();
			}
		}

		return text;

	};

	//return an element by ID
	this.getElementByID = function(id) {

		var objects = instance.stage.getObjects();
		for(var i=0; i < objects.length; ++i) {
			if(objects[i].id == id) {
				return objects[i];
				break;
			}
		}

		return false;

	};

	/**
	 * Adds a new element to the view.
	 *
	 * @method addElement
	 * @param {string} type The type of an element you would like to add, 'image' or 'text'.
	 * @param {string} source For image the URL to the image and for text elements the default text.
	 * @param {string} title Only required for image elements.
	 * @param {object} [parameters] An object with the parameters, you would like to apply on the element.
	 */
	this.addElement = function(type, source, title, params) {

		if(type === undefined || source === undefined || title === undefined) {
			return;
		}

		params = typeof params !== 'undefined' ? params : {};
		if(type === 'text') {
			//strip HTML tags
			source = source.replace(/(<([^>]+)>)/ig,"");
			title = title.replace(/(<([^>]+)>)/ig,"");
		}

		if(typeof params != "object") {
			FPDUtil.showModal("The element "+title+" does not have a valid JSON object as parameters! Please check the syntax, maybe you set quotes wrong.");
			return false;
		}

		//check that fill is a string
		if(typeof params.fill !== 'string' && !$.isArray(params.fill)) {
			params.fill = false;
		}

		//replace depraceted keys
		params = FPDUtil.rekeyDeprecatedKeys(params);

		//merge default options
		if(FPDUtil.getType(type) === 'text') {
			params = $.extend({}, instance.options.elementParameters, instance.options.textParameters, params);
		}
		else {
			params = $.extend({}, instance.options.elementParameters, instance.options.imageParameters, params);
		}

		var pushTargetObject = false,
			targetObject = null;

		//store current color and convert colors in string to array
		if(params.colors && typeof params.colors == 'string') {

			//check if string contains hex color values
			if(params.colors.indexOf('#') == 0) {
				//convert string into array
				var colors = params.colors.replace(/\s+/g, '').split(',');
				params.colors = colors;
			}

		}

		params._isInitial = !initialElementsLoaded;

		if(FPDUtil.getType(type) === 'text') {
			var defaultTextColor = params.colors[0] ? params.colors[0] : '#000000';
			params.fill = params.fill ? params.fill : defaultTextColor;
		}

		var fabricParams = {
			source: source,
			title: title,
			id: String(new Date().getTime()),
			cornerColor: instance.options.cornerColor ? instance.options.cornerColor : instance.options.selectedColor,
			cornerIconColor: instance.options.cornerIconColor
		};

		params.__editorMode = instance.options.editorMode;
		if(instance.options.editorMode) {
			fabricParams.selectable = fabricParams.evented = fabricParams.draggable = fabricParams.removable = fabricParams.resizable = fabricParams.rotatable = fabricParams.zChangeable = fabricParams.copyable = fabricParams.lockUniScaling = true;

		}
		else {
			$.extend(fabricParams, {
				selectable: false,
				lockRotation: true,
				hasRotatingPoint: false,
				lockScalingX: true,
				lockScalingY: true,
				lockMovementX: true,
				lockMovementY: true,
				hasControls: false,
				evented: false,
			});
		}

		fabricParams = $.extend({}, params, fabricParams);

		if(type == 'image' || type == 'path' || type == 'path-group') {

			fabricParams.crossOrigin = '';
			fabricParams.lockUniScaling = instance.options.editorMode ? false : !fabricParams.uniScalingUnlockable;

			if(!FPDUtil.isXML(source)) {
				var splitURLParams = source.split('?'); //remove url parameters
				source = fabricParams.source = splitURLParams[0];
			}

			var _fabricImageLoaded = function(fabricImage, params, vectorImage, originParams) {

				if(fabricImage) {

					originParams = originParams === undefined ? {} : originParams;

					$.extend(params, {
						originParams: $.extend({}, params, originParams)
					});

					fabricImage.setOptions(params);
					instance.stage.add(fabricImage);
					instance.setElementParameters(params, fabricImage, false);

					fabricImage.originParams.angle = fabricImage.angle;
					fabricImage.originParams.z = instance.getZIndex(fabricImage);

					if(instance.options.improvedResizeQuality && !vectorImage) {

						fabricImage.resizeFilters.push(new fabric.Image.filters.Resize({
						    resizeType: 'hermite'
						}));

					}

					if(!fabricImage._isInitial) {
						_setUndoRedo({
							element: fabricImage,
							parameters: params,
							interaction: 'add'
						});
					}

				}
				else {
					FPDUtil.showModal("The image with the URL<br /><i style='font-size: 10px;'>"+params.source+"</i><br />can not be loaded into the canvas. <p><br />Troubleshooting<br/><ul><li>The URL is not correct!</li><li>The image has been blocked by <a href='https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS' target='_blank'>CORS policy</a>. You need to host the image under the same protocol and domain or enable 'Access-Control-Allow-Origin' on the server where you host the image. <a href='http://enable-cors.org/' target='_blank'>Read more about it here.</a></li></ul></p>");
				}

				/**
			     * Gets fired as soon as an element has beed added.
			     *
			     * @event FancyProductDesignerView#elementAdd
			     * @param {Event} event
			     * @param {fabric.Object} object - The fabric object.
			     */
				$this.trigger('elementAdd', [fabricImage]);

			};


			if(source === undefined || source.length === 0) {
				FPDUtil.log('No image source set for: '+ title);
				return;
			}

			//add SVG from XML document
			if(FPDUtil.isXML(source)) {

				fabric.loadSVGFromString(source, function(objects, options) {
					var svgGroup = fabric.util.groupSVGElements(objects, options);
					_fabricImageLoaded(svgGroup, fabricParams, true);
				});

			}
			//load svg from url
			else if($.inArray('svg', source.split('.')) != -1) {

				var timeStamp = Date.now().toString(),
					_loadFromScript = instance.options._loadFromScript ? instance.options._loadFromScript : '',
					url = _loadFromScript + source;

				if(instance.options.imageLoadTimestamp && !instance.options._loadFromScript) {
					url += '?'+timeStamp;
				}

				fabric.loadSVGFromURL(url, function(objects, options) {

					//if objects is null, svg is loaded from external server with cors disabled
					var svgGroup = objects ? fabric.util.groupSVGElements(objects, options) : null;

					if(objects && !params.fill) {
						params.colors = [];
						for(var i=0; i < objects.length; ++i) {
							var color = tinycolor(objects[i].fill);
							params.colors.push(color.toHexString());
						}
						params.svgFill = params.colors;
					}

					_fabricImageLoaded(svgGroup, fabricParams, true, {svgFill: params.svgFill});

				});

			}
			//load png/jpeg from url
			else {

				var timeStamp = Date.now().toString(),
					_loadFromScript = instance.options._loadFromScript ? instance.options._loadFromScript : '',
					url;

				if(source.indexOf('data:image/') == -1) {//do not add timestamp to data URI

					url = _loadFromScript + source;

					if(instance.options.imageLoadTimestamp && !instance.options._loadFromScript) {
						url += '?'+timeStamp;
					}

				}
				else {
					url = source;
				}

				new fabric.Image.fromURL(url, function(fabricImg, img) {

					//if src is empty, image is loaded from external server with cors disabled
					fabricImg = fabricImg.getSrc() === '' ? null : fabricImg;
					_fabricImageLoaded(fabricImg, fabricParams, false);

				}, {crossOrigin: 'anonymous'});

			}

		}
		else if(FPDUtil.getType(type) === 'text') {

			source = source.replace(/\\n/g, '\n');
			params.text = params.text ? params.text : source;

			$.extend(fabricParams, {
				spacing: params.curveSpacing,
				radius: params.curveRadius,
				reverse: params.curveReverse,
				originParams: $.extend({}, params)
			});


			//fix for correct boundary when using custom fonts
			var tempFontSize = fabricParams.fontSize;
			fabricParams._tempFontSize = tempFontSize;
			fabricParams.fontSize = tempFontSize + 0.01;

			//make text curved
			var fabricText;
			if(params.curved) {
				fabricText = new fabric.CurvedText(source, fabricParams);
			}
			//make text box
			else if(params.textBox) {
				fabricParams.lockUniScaling = !instance.options.editorMode;
				fabricText = new fabric.Textbox(source, fabricParams);
				fabricText.setControlVisible('bl', true);
			}
			//just interactive text
			else {
				fabricText = new fabric.IText(source, fabricParams);
			}

			if(fabricParams.textPlaceholder || fabricParams.numberPlaceholder) {

				if(fabricParams.textPlaceholder) {
					instance.textPlaceholder = fabricText;
					fabricParams.removable = false;
				}

				if(fabricParams.numberPlaceholder) {
					instance.numberPlaceholder = fabricText;
					fabricParams.removable = false;
				}

			}

			instance.stage.add(fabricText);
			instance.setElementParameters(fabricParams, fabricText, false);

			fabricText.originParams = $.extend({}, fabricText.toJSON(), fabricText.originParams);
			delete fabricText.originParams['clipTo'];
			fabricText.originParams.z = instance.getZIndex(fabricText);

			if(!fabricText._isInitial) {
				_setUndoRedo({
					element: fabricText,
					parameters: fabricParams,
					interaction: 'add'
				});
			}

			$this.trigger('elementAdd', [fabricText]);

		}
		else {

			FPDUtil.showModal('Sorry. This type of element is not allowed!');

		}

	};

	/**
	 * Returns an fabric object by title.
	 *
	 * @method getElementByTitle
	 * @param {string} title The title of an element.
	 * @return {Object} FabricJS Object.
	 */
	this.getElementByTitle = function(title) {

		var objects = instance.stage.getObjects();
		for(var i = 0; i < objects.length; ++i) {
			if(objects[i].title == title) {
				return objects[i];
				break;
			}
		}

	};

	/**
	 * Deselects the current selected element.
	 *
	 * @method deselectElement
	 * @param {boolean} [discardActiveObject=true] Discards the active element.
	 */
	this.deselectElement = function(discardActiveObject) {

		discardActiveObject = typeof discardActiveObject == 'undefined' ? true : discardActiveObject;

		if(instance.currentBoundingObject) {

			instance.currentBoundingObject.remove();
			$this.trigger('boundingBoxToggle', [instance.currentBoundingObject, false]);
			instance.currentBoundingObject = null;

		}

		if(discardActiveObject) {
			instance.stage.discardActiveObject();
		}

		instance.currentElement = null;
		instance.stage.renderAll().calcOffset();

		$this.trigger('elementSelect', [null]);

	};

	/**
	 * Removes an element using the fabric object or the title of an element.
	 *
	 * @method removeElement
	 * @param {object|string} element Needs to be a fabric object or the title of an element.
	 */
	this.removeElement = function(element) {

		if(typeof element === 'string') {
			element = instance.getElementByTitle(element);
		}

		_setUndoRedo({
			element: element,
			parameters: instance.getElementJSON(element),
			interaction: 'remove'
		});

		instance.stage.remove(element);

		_elementHasUploadZone(element);

		/**
	     * Gets fired as soon as an element has been removed.
	     *
	     * @event FancyProductDesignerView#elementRemove
	     * @param {Event} event
	     * @param {fabric.Object} element - The fabric object that has been removed.
	     */
		$this.trigger('elementRemove', [element]);

		this.deselectElement();

	};

	/**
	 * Sets the parameters for a specified element.
	 *
	 * @method setElementParameters
	 * @param {object} parameters An object with the parameters that should be applied to the element.
	 * @param {fabric.Object | string} [element] A fabric object or the title of an element. If no element is set, the parameters will be applied to the current selected element.
	 * @param {Boolean} [saveUndo=true] Save new parameters also in undos.
	 */
	this.setElementParameters = function(parameters, element, saveUndo) {

		element = typeof element === 'undefined' ? instance.stage.getActiveObject() : element;
		saveUndo = typeof saveUndo === 'undefined' ? true : saveUndo;

		if(!element || parameters === undefined) {
			return false;
		}

		//if element is string, get by title
		if(typeof element == 'string') {
			element = instance.getElementByTitle(element);
		}

		var elemType = FPDUtil.getType(element.type);

		//store undos
		if(saveUndo && initialElementsLoaded) {

			var undoParameters = instance.getElementJSON();

			if(element._tempFill) {
				undoParameters.fill = element._tempFill;
				element._tempFill = undefined;
			}

			_setUndoRedo({
				element: element,
				parameters: undoParameters,
				interaction: 'modify'
			});

		}

		//adds the element into a upload zone
		if((instance.currentUploadZone && instance.currentUploadZone != '')) {

			parameters.z = -1;
			var uploadZoneObj = instance.getElementByTitle(instance.currentUploadZone),
				scale = FPDUtil.getScalingByDimesions(
					element.width,
					element.height,
					uploadZoneObj.width * uploadZoneObj.scaleX,
					uploadZoneObj.height * uploadZoneObj.scaleY,
					uploadZoneObj.scaleMode
				);

			$.extend(parameters, {
					boundingBox: instance.currentUploadZone,
					boundingBoxMode: 'clipping',
					scaleX: scale,
					scaleY: scale,
					autoCenter: true,
					removable: true,
					zChangeable: false,
					autoSelect: false,
					rotatable: uploadZoneObj.rotatable,
					draggable: uploadZoneObj.draggable,
					resizable: uploadZoneObj.resizable,
					price: uploadZoneObj.price ? uploadZoneObj.price : parameters.price,
					replace: instance.currentUploadZone,
					hasUploadZone: true,
					z: instance.getZIndex(instance.getElementByTitle(instance.currentUploadZone))
				}
			);

		}

		//if topped, z-index can not be changed
		if(parameters.topped) {
			parameters.zChangeable = false;
		}

		//new element added
		if(	typeof parameters.colors === 'object' ||
			parameters.colors === true ||
			parameters.colors == 1 ||
			parameters.removable ||
			parameters.draggable ||
			parameters.resizable ||
			parameters.rotatable ||
			parameters.zChangeable ||
			parameters.editable
			|| parameters.uploadZone
			|| (parameters.colorLinkGroup && parameters.colorLinkGroup.length > 0)) {

			parameters.isEditable = parameters.evented = parameters.selectable = true;

		}

		//upload zones have no controls
		if(!parameters.uploadZone || instance.options.editorMode) {

			if(parameters.draggable) {
				parameters.lockMovementX = parameters.lockMovementY = false;
			}

			if(parameters.rotatable) {
				parameters.lockRotation = false;
				parameters.hasRotatingPoint = true;
			}

			if(parameters.resizable) {
				parameters.lockScalingX = parameters.lockScalingY = false;
			}

			if((parameters.resizable || parameters.rotatable || parameters.removable)) {
				parameters.hasControls = true;
			}

		}

		if(parameters.uploadZone) {
			parameters.lockRotation = true;
			parameters.hasRotatingPoint = false;
		}

		if(parameters.replace && parameters.replace != '') {

			var replacedElement = instance.getElementByReplace(parameters.replace);

			//element with replace in view found and replaced element is not the new element
			if(replacedElement !== null && replacedElement !== element ) {
				parameters.z = instance.getZIndex(replacedElement);
				parameters.left = replacedElement.left;
				parameters.top = replacedElement.top;
				parameters.autoCenter = false;
				instance.removeElement(replacedElement);
			}

		}

		//needs to before setOptions
		if(typeof parameters.text === 'string') {

			var text = parameters.text;
			if(element.maxLength != 0 && text.length > element.maxLength) {
				text = text.substr(0, element.maxLength);
				element.selectionStart = element.maxLength;
			}

			//check lines length
			if(element.maxLines != 0) {

				if(element.type == 'textbox' && element.__lineHeights) {
					text = _maxTextboxLines(element, text);
				}
				else if(text.split("\n").length > element.maxLines) {
					text = text.replace(/([\s\S]*)\n/, "$1");
					element.exitEditing(); //exit editing when max lines are reached
				}

			}

			element.setText(text);
			parameters.text = text;

		}

		if(elemType === 'text') {

			if(parameters.letterSpacing !== undefined) {
				parameters.charSpacing = parameters.letterSpacing * 100;
			}

		}

		delete parameters['paths']; //no paths in parameters
		element.setOptions(parameters);

		if(parameters.autoCenter) {
			instance.centerElement(true, true, element);
		}

		//change element color
		if(parameters.fill !== undefined || parameters.svgFill !== undefined) {
			var fill = parameters.svgFill !== undefined ? parameters.svgFill : parameters.fill;
			instance.changeColor(element, fill);
			element.pattern = undefined;
		}

		//set pattern
		if(parameters.pattern !== undefined) {
			_setPattern(element, parameters.pattern);
			_setColorPrice(element, parameters.pattern);
		}

		//set filter
		if(parameters.filter) {

			element.filters = [];
			var fabricFilter = _getFabircFilter(parameters.filter);
			if(fabricFilter != null) {
				element.filters.push(fabricFilter);
			}
			element.applyFilters(function() {
				instance.stage.renderAll();
			});

			/*element.filters = [];

			var fabricFilter = _getFabircFilter(parameters.filter);
			if(fabricFilter != null) {
				element.filters.push(fabricFilter);
				element.filters.push(new fabric.Image.filters.Resize({
		            resizeType: 'hermite', scaleX: element.scaleX, scaleY: element.scaleY
		        }));
			}
			element.applyFilters(function() {
				instance.stage.renderAll();
			});*/

		}

		//clip element
		if((parameters.boundingBox && parameters.boundingBoxMode === 'clipping') || parameters.hasUploadZone) {
			_clipElement(element);
		}

		//set z position
		if(parameters.z >= 0) {
			element.moveTo(parameters.z);
			_bringToppedElementsToFront();
		}

		if(parameters.fontFamily !== undefined) {
			_renderOnFontLoaded(parameters.fontFamily, element);
		}

		if(element.curved) {

			if(parameters.curveRadius) {
				element.set('radius', parameters.curveRadius);
			}

			if(parameters.curveSpacing) {
				element.set('spacing', parameters.curveSpacing);
			}

			if(parameters.curveReverse !== undefined) {
				element.set('reverse', parameters.curveReverse);
			}

		}

		if(element.uploadZone) {
			element.evented = element.opacity !== 0;
		}

		//check if a upload zone contains an object
		var objects = instance.stage.getObjects();
		for(var i=0; i < objects.length; ++i) {

			var object = objects[i];

			if(object.uploadZone && object.title == parameters.replace) {
				object.opacity = 0;
				object.evented = false;
			}

		}

		element.setCoords();
		instance.stage.renderAll().calcOffset();

		$this.trigger('elementModify', [element, parameters]);

		_checkContainment(element);

		//select element
		if(parameters.autoSelect && element.isEditable && !instance.options.editorMode && $(instance.stage.getElement()).is(':visible')) {

			setTimeout(function() {
				instance.stage.setActiveObject(element);
				instance.stage.renderAll();
			}, 1);

		}

	};

	/**
	 * Returns the bounding box of an element.
	 *
	 * @method getBoundingBoxCoords
	 * @param {fabric.Object} element A fabric object
	 * @return {Object | Boolean} The bounding box object with x,y,width and height or false.
	 */
	this.getBoundingBoxCoords = function(element) {

		if(element.boundingBox || element.uploadZone) {

			if(typeof element.boundingBox == "object") {

				return {
					left: element.boundingBox.x,
					top: element.boundingBox.y,
					width: element.boundingBox.width,
					height: element.boundingBox.height
				};

			}
			else {

				var objects = instance.stage.getObjects();

				for(var i=0; i < objects.length; ++i) {

					//get all layers from first view
					var object = objects[i];
					if(element.boundingBox == object.title) {

						var topLeftPoint = object.getPointByOrigin('left', 'top');

						return {
							left: topLeftPoint.x,
							top: topLeftPoint.y,
							width: object.getWidth(),
							height: object.getHeight()
						};

						break;
					}

				}

			}

		}

		return false;

	};

	/**
	 * Creates a data URL of the view.
	 *
	 * @method toDataURL
	 * @param {Function} callback A function that will be called when the data URL is created. The function receives the data URL.
	 * @param {String} [backgroundColor=transparent] The background color as hexadecimal value. For 'png' you can also use 'transparent'.
	 * @param {Object} [options] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toDataURL.
	 * @param {String} [options.onlyExportable=false] If true elements with excludeFromExport=true are not exported in the image.
	 * @param {String} [watermarkImg=false] URL to an imae that will be added as watermark.
	 */
	this.toDataURL = function(callback, backgroundColor, options, watermarkImg) {

		callback = typeof callback !== 'undefined' ? callback : function() {};
		backgroundColor = typeof backgroundColor !== 'undefined' ? backgroundColor : 'transparent';
		options = typeof options !== 'undefined' ? options : {};
		options.onlyExportable = typeof options.onlyExportable !== 'undefined' ? options.onlyExportable : false;
		watermarkImg = typeof watermarkImg !== 'undefined' ? watermarkImg : false;

		instance.stage.enableRetinaScaling = false;

		var invisibleObjs = ['_snap_lines_group', '_ruler_hor', '_ruler_ver'],
			hiddenObjs = [];

		instance.stage.getObjects().forEach(function(obj) {

				if(invisibleObjs.indexOf(obj.id) !== -1 || (obj.excludeFromExport && options.onlyExportable)) {

					obj.visible = false;
					hiddenObjs.push(obj);

				}

		});

		instance.deselectElement();
		instance.stage.setDimensions({width: instance.options.stageWidth, height: instance.options.stageHeight}).setZoom(1);

		instance.stage.setBackgroundColor(backgroundColor, function() {

			if(watermarkImg) {
				instance.stage.add(watermarkImg);
				watermarkImg.center();
				watermarkImg.bringToFront();
			}

			//get data url
			callback(instance.stage.toDataURL(options));

			instance.stage.enableRetinaScaling = true;

			if(watermarkImg) {
				instance.stage.remove(watermarkImg);
			}

			if($(instance.stage.wrapperEl).is(':visible')) {
				instance.resetCanvasSize();
			}

			instance.stage.setBackgroundColor('transparent', function() {
				instance.stage.renderAll();
			});

			for(var i=0; i<hiddenObjs.length; ++i) {
				hiddenObjs[i].visible = true;
			}

		});

	};

	/**
	 * Returns the view as SVG.
	 *
	 * @method toSVG
	 * @return {String} A XML representing a SVG.
	 */
	this.toSVG = function(options, reviver) {

		var svg;

		instance.deselectElement();
		instance.stage.setDimensions({width: instance.options.stageWidth, height: instance.options.stageHeight}).setZoom(1);

		//get data url

		svg = instance.stage.toSVG(options, reviver);

		if($(instance.stage.wrapperEl).is(':visible')) {
			instance.resetCanvasSize();
		}

		$svg = $(svg);

		$svg.children('rect').remove(); //remove bounding boxes
		$svg.children('g').children('[style*="visibility: hidden"]').parent('g').remove(); //remove hidden elements
		svg = $('<div>').append($svg.clone()).html().replace(/(?:\r\n|\r|\n)/g, ''); //replace all newlines

		return svg;

	};

	/**
	 * Removes the canvas and resets all relevant view properties.
	 *
	 * @method clear
	 */
	this.clear = function() {

		instance.undos = [];
		instance.redos = [];
		instance.elements = null;
		instance.totalPrice = 0;
		instance.stage.clear();
		instance.stage.wrapperEl.remove();

		$this.trigger('clear');
		$this.trigger('priceChange', [0, 0]);

	};

	/**
	 * Undo the last change.
	 *
	 * @method undo
	 */
	this.undo = function() {

		if(instance.undos.length > 0) {

			var last = instance.undos.pop();

			//check if element was removed
			if(last.interaction === 'remove') {

				instance.stage.add(last.element);
				last.interaction = 'add';
			}
			else if(last.interaction === 'add') {
				instance.stage.remove(last.element);
				last.interaction = 'remove';
			}

			_setUndoRedo(false, {
				element: last.element,
				parameters: instance.getElementJSON(last.element),
				interaction: last.interaction
			});

			instance.setElementParameters(last.parameters, last.element, false);

			this.deselectElement();
			_elementHasUploadZone(last.element);

		}

		return instance.undos;

	};

	/**
	 * Redo the last change.
	 *
	 * @method redo
	 */
	this.redo = function() {

		if(instance.redos.length > 0) {

			var last = instance.redos.pop();

			if(last.interaction === 'remove') {
				instance.stage.add(last.element);
				last.interaction = 'add';
			}
			else if(last.interaction === 'add') {
				instance.stage.remove(last.element);
				last.interaction = 'remove';
			}

			_setUndoRedo({
				element: last.element,
				parameters: instance.getElementJSON(last.element),
				interaction: last.interaction
			});

			instance.setElementParameters(last.parameters, last.element, false);

			this.deselectElement();
			_elementHasUploadZone(last.element);

		}

		return instance.redos;

	};

	/**
	 * Get the canvas(stage) JSON.
	 *
	 * @method getJSON
	 * @return {Object} An object with properties.
	 */
	this.getJSON = function() {

		var parameterKeys = fpdOptions.getParameterKeys();

		parameterKeys = parameterKeys.concat(instance.propertiesToInclude);

		return instance.stage.toJSON(parameterKeys);

	};

	/**
	 * Resizes the canvas responsive.
	 *
	 * @method resetCanvasSize
	 */
	this.resetCanvasSize = function() {

		instance.responsiveScale = $productStage.outerWidth() < instance.options.stageWidth ? $productStage.outerWidth() / instance.options.stageWidth : 1;
		instance.responsiveScale = parseFloat(Number(instance.responsiveScale.toFixed(2)));
		instance.responsiveScale = instance.responsiveScale > 1 ? 1 : instance.responsiveScale;

		if(!instance.options.responsive) {
			instance.responsiveScale = 1;
		}

		instance.stage
		.setDimensions({
			width: $productStage.width(),
			height: instance.options.stageHeight * instance.responsiveScale
		})
		.setZoom(instance.responsiveScale)
		.calcOffset()
		.renderAll();

		$productStage.height(instance.stage.height);

		var $container = $productStage.parents('.fpd-container:first');
		if($container.length > 0) {
			$container.height($container.hasClass('fpd-sidebar') ? instance.stage.height : 'auto');
			$container.width($container.hasClass('fpd-topbar') ? instance.options.stageWidth : 'auto');
		}

		return instance.responsiveScale;

	};

	/**
	 * Gets an elment by replace property.
	 *
	 * @method getElementByReplace
	 */
	this.getElementByReplace = function(replaceValue) {

		var objects = instance.stage.getObjects();
		for(var i = 0; i < objects.length; ++i) {
			var object = objects[i];
			if(object.replace === replaceValue) {
				return object;
				break;
			}
		}

		return null;

	};

	/**
	 * Gets the JSON of an element.
	 *
	 * @method getElementJSON
	 * @param {String} [element] The target element. If not set, it it will use the current selected.
	 * @param {Boolean} [includeFabricProperties=false] Include the properties from {{#crossLink "FancyProductDesignerView/propertiesToInclude:property"}}{{/crossLink}}.
	 * @return {Object} An object with properties.
	 */
	this.getElementJSON = function(element, includeFabricProperties) {

		element = typeof element === 'undefined' ? instance.stage.getActiveObject() : element;
		includeFabricProperties = typeof includeFabricProperties === 'undefined' ? false : includeFabricProperties;

		if(!element) { return {}; }

		var properties = Object.keys(instance.options.elementParameters),
			additionalKeys  = FPDUtil.getType(element.type) === 'text' ? Object.keys(instance.options.textParameters) : Object.keys(instance.options.imageParameters);

		properties = $.merge(properties, additionalKeys);

		if(includeFabricProperties) {
			properties = $.merge(properties, instance.propertiesToInclude);
		}

		if(element.uploadZone) {
			properties.push('customAdds');
		}

		if(FPDUtil.getType(element.type) === 'text') {
			properties.push('text');
		}

		if(element.type === 'path-group') {
			properties.push('svgFill');
		}

		properties.push('width');
		properties.push('height');
		properties.push('isEditable');
		properties.push('hasUploadZone');
		properties.push('clippingRect');
		properties.push('evented');
		properties.push('isCustom');
		properties = properties.sort();

		if(includeFabricProperties) {

			return element.toJSON(properties);

		}
		else {

			var json = {};
			for(var i=0; i < properties.length; ++i) {
				var prop = properties[i];
				if(element[prop] !== undefined) {
					json[prop] = element[prop];
				}

			}

			return json;
		}

	};

	/**
	 * Centers an element horizontal or/and vertical.
	 *
	 * @method centerElement
	 * @param {Boolean} h Center horizontal.
	 * @param {Boolean} v Center vertical.
	 * @param {fabric.Object} [element] The element to center. If not set, it centers the current selected element.
	 */
	this.centerElement = function(h, v, element) {

		element = typeof element === 'undefined' ? instance.stage.getActiveObject() : element;

		_centerObject(element, h, v, instance.getBoundingBoxCoords(element));
		element.autoCenter = false;

	};

	/**
	 * Aligns an element.
	 *
	 * @method alignElement
	 * @param {String} pos Allowed values: left, right, top or bottom.
	 * @param {fabric.Object} [element] The element to center. If not set, it centers the current selected element.
	 */
	this.alignElement = function(pos, element) {

		element = typeof element === 'undefined' ? instance.stage.getActiveObject() : element;

		var localPoint = element.getPointByOrigin('left', 'top'),
			boundingBox = instance.getBoundingBoxCoords(element),
			posOriginX = 'left',
			posOriginY = 'top';

		if(pos === 'left') {

			localPoint.x = boundingBox ? boundingBox.left : 0;
			localPoint.x += element.padding;
			localPoint.x += FPDUtil.getType(element.type) == 'text' ? 4 : 0;

		}
		else if(pos === 'top') {

			localPoint.y = boundingBox ? boundingBox.top : 0;
			localPoint.y += element.padding;
			localPoint.y += FPDUtil.getType(element.type) == 'text' ? 4 : 0;

		}
		else if(pos === 'right') {

			localPoint.x = boundingBox ? boundingBox.left + boundingBox.width - element.padding : instance.options.stageWidth - element.padding;
			localPoint.x -= FPDUtil.getType(element.type) == 'text' ? 4 : 0;
			posOriginX = 'right';

		}
		else {

			localPoint.y = boundingBox ? boundingBox.top + boundingBox.height - element.padding : instance.options.stageHeight;
			localPoint.y -= FPDUtil.getType(element.type) == 'text' ? 4 : 0;
			posOriginY = 'bottom';

		}

		element.setPositionByOrigin(localPoint, posOriginX, posOriginY);

		instance.stage.renderAll();
		element.setCoords();

		_checkContainment(element);

	};

	/**
	 * Gets the z-index of an element.
	 *
	 * @method getZIndex
	 * @param {fabric.Object} [element] The element to center. If not set, it centers the current selected element.
	 * @return {Number} The index.
	 */
	this.getZIndex = function(element) {

		element = typeof element === 'undefined' ? instance.stage.getActiveObject() : element;

		var objects = instance.stage.getObjects();
		return objects.indexOf(element);
	};

	/**
	 * Changes the color of an element.
	 *
	 * @method changeColor
	 * @param {fabric.Object} element The element to colorize.
	 * @param {String} hex The color.
	 * @param {Boolean} temp Only save color temporary.
	 * @param {Boolean} colorLinking Use color linking.
	 */
	this.changeColor = function(element, hex, temp, colorLinking) {

		temp = typeof temp === 'undefined' ? false : temp;
		colorLinking = typeof colorLinking === 'undefined' ? true : colorLinking;

		//check if hex color has only 4 digits, if yes, append 3 more
		if(typeof hex === 'string' && hex.length == 4) {
			hex += hex.substr(1, hex.length);
		}

		//text
		if(FPDUtil.getType(element.type) === 'text') {

			hex = hex === false ? '#000000' : hex;

			//set color of a text element
			element.setFill(hex);
			instance.stage.renderAll();

			if(temp == false) { element.pattern = null; element.fill = hex; }

		}
		//path groups (svg)
		else if(element.type == 'path-group' && typeof hex == 'object') {

			for(var i=0; i<hex.length; ++i) {
				element.paths[i].setFill(hex[i]);
			}

			instance.stage.renderAll();

			element.svgFill = hex;
			delete element['fill'];

		}
		//image
		else {

			var colorizable = FPDUtil.elementIsColorizable(element);
			//colorize png or dataurl image
			if(colorizable == 'png' || colorizable == 'dataurl') {

				element.filters = [];
				if(hex !== false) {
					element.filters.push(new fabric.Image.filters.Tint({color: hex}));
				}

				element.applyFilters(function() {
					instance.stage.renderAll();
				});

			}
			//colorize svg
			else if(colorizable == 'svg') {
				element.setFill(hex);
			}

			if(temp == false) { element.fill = hex; }

		}

		_setColorPrice(element, hex);

		/**
	     * Gets fired when the color of an element is changing.
	     *
	     * @event FancyProductDesignerView#elementColorChange
	     * @param {Event} event
	     * @param {fabric.Object} element
	     * @param {String} hex
	     * @param {Boolean} colorLinking
	     */
		$this.trigger('elementColorChange', [element, hex, colorLinking]);

	};

	/**
	 * Gets the index of the view.
	 *
	 * @method getIndex
	 * @return {Number} The index.
	 */
	this.getIndex = function() {

		return $productStage.children('.fpd-view-stage').index(instance.stage.wrapperEl);

	};

	/**
	 * Gets an upload zone by title.
	 *
	 * @method getUploadZone
	 * @param {String} title The target title of an element.
	 * @return {fabric.Object} A fabric object representing the upload zone.
	 */
	this.getUploadZone = function(title) {

		var objects = instance.stage.getObjects();

		for(var i=0; i < objects.length; ++i) {

			if(objects[i].uploadZone && objects[i].title == title) {
				return objects[i];
				break;
			}

		}

	};

	/**
	 * Changes the price by an operator, + or -.
	 *
	 * @method changePrice
	 * @param {Number} price Price as number.
	 * @param {String} operator "+" or "-".
	 * @return {Number} The total price of the view.
	 */
	this.changePrice = function(price, operator) {

		if(operator === '+') {
			instance.totalPrice += price;
		}
		else {
			instance.totalPrice -= price;
		}

		/**
	     * Gets fired as soon as the price has changed.
	     *
	     * @event FancyProductDesignerView#priceChange
	     * @param {Event} event
	     * @param {number} elementPrice - The price of the element.
	     * @param {number} totalPrice - The total price.
	     */
		$this.trigger('priceChange', [price, instance.totalPrice]);

		return instance.totalPrice;

	};

	/**
	 * This method needs to be called after the instance of {{#crossLink "FancyProductDesignerView"}}{{/crossLink}} is set.
	 *
	 * @method setup
	 */
	this.setup = function() {

		function _removeNotValidElementObj(element) {

			if(element.type === undefined || element.source === undefined || element.title === undefined) {

				var removeInd = instance.elements.indexOf(element)
				if(removeInd !== -1) {
					instance.elements.splice(removeInd, 1);
					FPDUtil.log('Element index '+removeInd+' from instance.elements removed, its not a valid element object!', 'info');
					_onElementAdded();
					return true;
				}

			}

			return false;

		};

		var element = instance.elements[0];

		//check if view contains at least one element
		if(element) {

			var countElements = 0;
			//iterative function when element is added, add next one
			function _onElementAdded() {

				countElements++;

				//add all elements of a view
				if(countElements < instance.elements.length) {
					var element = instance.elements[countElements];
					if(!_removeNotValidElementObj(element)) {
						instance.addElement( element.type, element.source, element.title, element.parameters);
					}

				}
				//all elements are added
				else {

					$this.off('elementAdd', _onElementAdded);
					_afterSetup();

				}

			};

			//listen when element is added
			$this.on('elementAdd', _onElementAdded);
			//add first element of view
			if(!_removeNotValidElementObj(element)) {
				instance.addElement( element.type, element.source, element.title, element.parameters);
			}


		}
		//no elements in view, view is created without elements
		else {
			_afterSetup();
		}

	};

	_initialize();

};

var FPDToolbar = function($uiElementToolbar, fpdInstance) {

	var instance = this,
		$body = $('body'),
		$uiToolbarSub = $uiElementToolbar.children('.fpd-sub-panel'),
		$colorPicker = $uiElementToolbar.find('.fpd-color-wrapper'),
		$fontFamilyDropdown = $uiElementToolbar.find('.fpd-tool-font-family'),
		colorDragging = false;

	this.isTransforming = false; //is true, while transforming via slider
	this.placement = fpdInstance.mainOptions.toolbarPlacement;

	var _initialize = function() {

		instance.setPlacement(instance.placement);

		$body.on('mousedown touchstart', function(evt) { //check when transforming via slider

			if($(evt.target).parents('.fpd-range-slider').length > 0) {
				$(evt.target).parents('.fpd-range-slider').prev('input').change();
				instance.isTransforming = true;
			}

		})
		.on('mouseup touchend', function() {
			instance.isTransforming = false;
		});

		//set max values
		var maxValuesKeys = Object.keys(fpdInstance.mainOptions.maxValues);
		for(var i=0; i < maxValuesKeys.length; ++i) {

			var maxValueProp = maxValuesKeys[i];
			$uiElementToolbar.find('[data-control="'+maxValueProp+'"]').attr('max', fpdInstance.mainOptions.maxValues[maxValueProp]);

		}

		//first-level tools
		$uiElementToolbar.find('.fpd-row > div').click(function() {

			var $this = $(this);

			$uiElementToolbar.find('.fpd-row > div').not($this).removeClass('fpd-active');

			if($this.data('panel')) { //has a sub a panel

				$this.tooltipster('hide');

				$this.toggleClass('fpd-active'); //activate panel opener
				$uiToolbarSub.toggle($this.hasClass('fpd-active')) //display sub wrapper, if opener is active
				.children().removeClass('fpd-active') //hide all panels in sub wrapper
				.filter('.fpd-panel-'+$this.data('panel')).addClass('fpd-active'); //display related panel

				var element = fpdInstance.currentElement;

				if($this.data('panel') == 'fill') {

					if(FPDUtil.elementHasColorSelection(element)) {
						if(element.colorLinkGroup) {
							var availableColors = fpdInstance.colorLinkGroups[element.colorLinkGroup].colors;
						}
						else {
							var availableColors = element.colors;
						}

						$colorPicker.children('input').spectrum('destroy');
						$colorPicker.empty().removeClass('fpd-colorpicker-group');

						//path (svg)
						if(element.type == 'path-group') {

							for(var i=0; i<element.paths.length; ++i) {
								var path = element.paths[i],
									color = tinycolor(path.fill);

								$colorPicker.append('<input type="text" value="'+color.toHexString()+'" />');
							}

							$colorPicker.addClass('fpd-colorpicker-group').children('input').spectrum('destroy').spectrum({
								showPaletteOnly: $.isArray(element.colors),
								preferredFormat: "hex",
								showInput: true,
								showInitial: true,
								showButtons: false,
								showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
								palette: $.isArray(element.colors) ? element.colors : fpdInstance.mainOptions.colorPickerPalette,
								show: function(color) {

									var svgColors = FPDUtil.changePathColor(
										fpdInstance.currentElement,
										$colorPicker.children('input').index(this),
										color
									);

									element._tempFill = svgColors;

								},
								move: function(color) {

									var svgColors = FPDUtil.changePathColor(
										element,
										$colorPicker.children('input').index(this),
										color
									);

									//fpdInstance.currentViewInstance.changeColor(element, svgColors);
									fpdInstance.currentViewInstance.setElementParameters({fill: svgColors}, element);

								},
								change: function(color) {

									var svgColors = FPDUtil.changePathColor(
										element,
										$colorPicker.children('input').index(this),
										color
									);

									$(document).unbind("click.spectrum"); //fix, otherwise change is fired on every click
									fpdInstance.currentViewInstance.setElementParameters({fill: svgColors}, element);

								}
							});

						}
						//color list
						else if(availableColors.length > 1) {

							$colorPicker.html('<div class="fpd-color-palette fpd-grid"></div>');

							for(var i=0; i<availableColors.length; ++i) {

								var color = availableColors[i];
									colorName = fpdInstance.mainOptions.hexNames[color.replace('#', '')];

								colorName = colorName ? colorName : color;
								$colorPicker.children('.fpd-grid').append('<div class="fpd-item fpd-tooltip" title="'+colorName+'" style="background-color: '+color+';"></div>')
								.children('.fpd-item:last').click(function() {
									var color = tinycolor($(this).css('backgroundColor'));
									fpdInstance.currentViewInstance.setElementParameters({fill: color.toHexString()});
								});

							}

							FPDUtil.updateTooltip();

						}
						//colorwheel
						else {

							$colorPicker.html('<input type="text" value="'+(element.fill ? element.fill : availableColors[0])+'" />');

							$colorPicker.children('input').spectrum({
								flat: true,
								preferredFormat: "hex",
								showInput: true,
								showInitial: true,
								showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
								palette: fpdInstance.mainOptions.colorPickerPalette,
								show: function(color) {
									element._tempFill = color.toHexString();
								},
								move: function(color) {

									//only non-png images are chaning while dragging
									if(colorDragging === false || FPDUtil.elementIsColorizable(element) !== 'png') {
										_setElementColor(color.toHexString());
									}

								},
								change: function(color) {

									$(document).unbind("click.spectrum"); //fix, otherwise change is fired on every click
									fpdInstance.currentViewInstance.setElementParameters({fill: color.toHexString()}, element);

								}
							})
							.on('dragstart.spectrum', function() {
								colorDragging = true;
							})
							.on('dragstop.spectrum', function(evt, color) {
								colorDragging = false;
								_setElementColor(color.toHexString());
							});

						}
					}

					//patterns
					if((element.type === 'path-group' || FPDUtil.getType(element.type) === 'text') && element.patterns && element.patterns.length) {

						$uiToolbarSub.find('.fpd-patterns > .fpd-grid').empty();
						for(var i=0; i < element.patterns.length; ++i) {

							var patternUrl = element.patterns[i];
							$uiToolbarSub.find('.fpd-patterns > .fpd-grid').append('<div class="fpd-item" data-pattern="'+patternUrl+'"><picture style="background-image: url('+patternUrl+');"></picture></div>')
							.children(':last').click(function() {

								var patternUrl = $(this).data('pattern');
								$uiElementToolbar.find('.fpd-current-fill').css('background', 'url('+patternUrl+')');
								fpdInstance.currentViewInstance.setElementParameters( {pattern: patternUrl} );


							});

						}

					}

				}
				else if($this.data('panel') == 'stroke') {

					//stroke color
					var strokeColor = fpdInstance.currentElement.stroke ? fpdInstance.currentElement.stroke : '#000';
				    $uiToolbarSub.find('.fpd-stroke-color-picker input').spectrum('destroy').spectrum({
					    color: strokeColor,
						flat: true,
						preferredFormat: "hex",
						showInput: true,
						showInitial: true,
						showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
						palette: fpdInstance.mainOptions.colorPickerPalette,
						move: function(color) {
							instance.isTransforming = true;
							fpdInstance.currentViewInstance.setElementParameters( {stroke: color.toHexString()} );

						}
					});

				}

				$uiToolbarSub.css({
					top: $this.parent('.fpd-row').position().top+$this.position().top+$this.outerHeight(true),
					left: $this.parent().position().left - 5
				});

				instance.updatePosition(fpdInstance.currentElement);

			}
			else {

				$uiToolbarSub.hide();

			}

		});

		//create range slider
		$uiToolbarSub.find('.fpd-slider-range').rangeslider({
			polyfill: false,
			rangeClass: 'fpd-range-slider',
			disabledClass: 'fpd-range-slider--disabled',
			horizontalClass: 'fpd-range-slider--horizontal',
		    verticalClass: 'fpd-range-slider--vertical',
		    fillClass: 'fpd-range-slider__fill',
		    handleClass: 'fpd-range-slider__handle',
		    onSlide: function(pos, value) {

			    if(instance.isTransforming) {

				    this.$element.parent().prev('.fpd-slider-number').val(value).change();

				    //proportional scaling
				    if(this.$element.data('control') === 'scaleX' && fpdInstance.currentElement && fpdInstance.currentElement.lockUniScaling) {
					    $uiToolbarSub.find('.fpd-slider-number[data-control="scaleY"]').val(value).change();
				    }

			    }

		    },
		    onSlideEnd: function() {

			    instance.isTransforming = false;
			    instance.updatePosition(fpdInstance.currentElement);

		    }
		});

		//filters
		$uiToolbarSub.find('.fpd-filters .fpd-item').click(function() {

			var $this = $(this);
			$uiElementToolbar.find('.fpd-current-fill').css('background', $this.children('picture').css('background-image'));
			fpdInstance.currentViewInstance.setElementParameters( {filter: $this.data('filter')} );

		});

		//position
		$uiToolbarSub.find('.fpd-panel-position .fpd-icon-button-group > span').click(function() {

			var $this = $(this);
			if($this.hasClass('fpd-align-left')) {
				fpdInstance.currentViewInstance.alignElement('left');
			}
			else if($this.hasClass('fpd-align-top')) {
				fpdInstance.currentViewInstance.alignElement('top');
			}
			else if($this.hasClass('fpd-align-right')) {
				fpdInstance.currentViewInstance.alignElement('right');
			}
			else if($this.hasClass('fpd-align-bottom')) {
				fpdInstance.currentViewInstance.alignElement('bottom');
			}
			else if($this.hasClass('fpd-align-center-h')) {
				fpdInstance.currentViewInstance.centerElement(true, false);
			}
			else if($this.hasClass('fpd-align-center-v')) {
				fpdInstance.currentViewInstance.centerElement(false, true);
			}
			else if($this.hasClass('fpd-flip-h')) {
				fpdInstance.currentViewInstance.setElementParameters({flipX: !fpdInstance.currentElement.getFlipX()});
			}
			else if($this.hasClass('fpd-flip-v')) {
				fpdInstance.currentViewInstance.setElementParameters({flipY: !fpdInstance.currentElement.getFlipY()});
			}

			instance.updatePosition(fpdInstance.currentElement);

		});

		//move layer position
		$uiElementToolbar.find('.fpd-tool-move-up, .fpd-tool-move-down').click(function() {

			var currentZ = fpdInstance.currentViewInstance.getZIndex();

			currentZ = $(this).hasClass('fpd-tool-move-up') ? currentZ+1 : currentZ-1;
			currentZ = currentZ < 0 ? 0 : currentZ;

			fpdInstance.currentViewInstance.setElementParameters( {z: currentZ} );

	    });

		//reset element
	    $uiElementToolbar.find('.fpd-tool-reset').click(function() {

			$uiElementToolbar.find('.tooltipstered').tooltipster('destroy');
		    fpdInstance.currentViewInstance.setElementParameters( fpdInstance.currentElement.originParams );
		    fpdInstance.currentViewInstance.deselectElement();
			//instance.update(fpdInstance.currentElement);

			FPDUtil.updateTooltip();

		});

		//append fonts to dropdown
		if(fpdInstance.mainOptions.fonts && fpdInstance.mainOptions.fonts.length > 0) {

			//fonts array has objects
			if(typeof fpdInstance.mainOptions.fonts[0] === 'object') {
				fpdInstance.mainOptions.fonts.sort(function(a, b) {
					var nameA = a.name.toUpperCase(), // ignore upper and lowercase
						nameB = b.name.toUpperCase(); // ignore upper and lowercase
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}

					//same
					return 0;
				});
			}
			else {
				fpdInstance.mainOptions.fonts.sort();
			}

			for(var i=0; i < fpdInstance.mainOptions.fonts.length; ++i) {

				var font = fpdInstance.mainOptions.fonts[i],
					fontName = font;

				if(typeof font == 'object') {
					fontName = font.name;
				}

				$fontFamilyDropdown.children('.fpd-dropdown-list')
				.append('<span class="fpd-item" data-value="'+fontName+'">'+fontName+'</span>')
				.children(':last').css('font-family', fontName);

			}

		}
		else {
			$fontFamilyDropdown.hide();
		}

		//edit text
		var tempFocusText = null;
	    $uiToolbarSub.find('.fpd-panel-edit-text textarea').keyup(function(evt) {

		    evt.stopPropagation;
		    evt.preventDefault();

		    var selectionStart = this.selectionStart,
			 	selectionEnd = this.selectionEnd;

			fpdInstance.currentViewInstance.currentElement.isEditing = true;
		    fpdInstance.currentViewInstance.setElementParameters( {text: this.value} );

		    this.selectionStart = selectionStart;
			this.selectionEnd = selectionEnd;

	    })
	    .focus(function() {
		    tempFocusText = fpdInstance.currentViewInstance.currentElement;
		    tempFocusText.isEditing = true;
	    })
	    .focusout(function() {
		    tempFocusText.isEditing = false;
		    tempFocusText = null;
	    });

		//call content in tab
		$uiToolbarSub.find('.fpd-panel-tabs > span').click(function() {

			var $this = $(this);

			$this.addClass('fpd-active').siblings().removeClass('fpd-active');
			$this.parent().nextAll('.fpd-panel-tabs-content').children('[data-id="'+this.id+'"]').addClass('fpd-active')
			.siblings().removeClass('fpd-active');

			$colorPicker.children('input').spectrum('hide');

		});


		$uiElementToolbar.find('.fpd-number').change(function() {

			var $this = $(this),
				numberParameters = {};

			if( this.value > Number($this.attr('max')) ) {
				this.value = Number($this.attr('max'));
			}

			if( this.value < Number($this.attr('min')) ) {
				this.value = Number($this.attr('min'));
			}

			var value = Number(this.value);

			if($this.hasClass('fpd-slider-number')) {

				$this.next('.fpd-range-wrapper').children('input').val(this.value)
				.rangeslider('update', true, false);

				if($this.data('control') === 'scaleX' && fpdInstance.currentElement && fpdInstance.currentElement.lockUniScaling) {
					$uiElementToolbar.find('[data-control="scaleY"]').val(value).change();
				}

			}

			numberParameters[$this.data('control')] = value;

			if(fpdInstance.currentViewInstance) {

				fpdInstance.currentViewInstance.setElementParameters(
					numberParameters,
					fpdInstance.currentViewInstance.currentElement,
					!instance.isTransforming
				);

			}

		});

		$uiElementToolbar.find('.fpd-toggle').click(function() {

			var $this = $(this).toggleClass('fpd-enabled'),
				toggleParameters = {};

			//ignore curved text switcher
			if(!$this.hasClass('fpd-curved-text-switcher')) {

				toggleParameters[$this.data('control')] = $this.hasClass('fpd-enabled') ? $this.data('enabled') : $this.data('disabled');

				if($this.hasClass('fpd-tool-uniscaling-locker')) {
					_lockUniScaling($this.hasClass('fpd-enabled'));
				}

				fpdInstance.currentViewInstance.setElementParameters(toggleParameters);

			}


		});

		$uiElementToolbar.find('.fpd-dropdown .fpd-item').click(function(evt) {

			evt.stopPropagation();

			var $this = $(this),
				$current = $this.parent().prevAll('.fpd-dropdown-current:first'),
				value = $this.data('value'),
				parameter = {};

			var control = $current.is('input') ? $current.val(value) : $current.html($this.clone()).data('value', value);

			parameter[$current.data('control')] = value;

			if($current.data('control') === 'fontFamily') {
				$current.css('font-family', value);
			}

			fpdInstance.currentViewInstance.setElementParameters(parameter);

			$this.siblings('.fpd-item').show();

		});

		$uiElementToolbar.find('.fpd-dropdown.fpd-search > input').keyup(function() {

			var $items = $(this).css('font-family', 'Helvetica').nextAll('.fpd-dropdown-list:first')
			.children('.fpd-item').hide();

			if(this.value.length === 0) {
				$items.show();
			}
			else {
				$items.filter(':containsCaseInsensitive("'+this.value+'")').show();
			}

		});

	};


	var _toggleUiTool = function(tool, showHide) {

		showHide = showHide === undefined ? true : showHide;

		var $tool = $uiElementToolbar.find('.fpd-tool-'+tool).toggle(showHide); //show tool
		$tool.parent('.fpd-row').toggle(Boolean($tool.parent('.fpd-row').children('div[style*="block"]').length > 0)); //show row if at least one visible tool in row

		return $tool;

	};

	var _toggleSubTool = function(panel, tool, showHide) {

		showHide = Boolean(showHide);

		return $uiToolbarSub.children('.fpd-panel-'+panel)
		.children('.fpd-tool-'+tool).toggle(showHide);
	};

	var _togglePanelTab = function(panel, tab, showHide) {

		$uiToolbarSub.children('.fpd-panel-'+panel)
		.find('.fpd-panel-tabs #'+tab).toggleClass('fpd-disabled', !showHide);

	};

	var _setElementColor = function(color) {

		$uiElementToolbar.find('.fpd-current-fill').css('background', color);
		fpdInstance.currentViewInstance.changeColor(fpdInstance.currentViewInstance.currentElement, color);

	};

	var _lockUniScaling = function(toggle) {

		 $uiToolbarSub.find('.fpd-tool-uniscaling-locker > span').removeClass().addClass(toggle ? 'fpd-icon-locked' : 'fpd-icon-unlocked');
		 $uiToolbarSub.find('.fpd-tool-scaleY').toggleClass('fpd-disabled', toggle);

	};

	this.update = function(element) {

		this.hideTools();

		_toggleUiTool('reset');

		if(element.availableFilters && element.availableFilters.length > 0 && element.type == 'image') {

			_toggleUiTool('fill');
			_togglePanelTab('fill', 'filter', true);

			$uiToolbarSub.find('.fpd-filters .fpd-item:not(.fpd-filter-none)').addClass('fpd-hidden');
			for(var i=0; i < element.availableFilters.length; ++i) {
				var filterName = element.availableFilters[i];
				$uiToolbarSub.find('.fpd-filter-'+filterName).removeClass('fpd-hidden');
			}

		}

		//colors array, true=svg colorization
		if(FPDUtil.elementHasColorSelection(element)) {

			_toggleUiTool('fill');
			_togglePanelTab('fill', 'color', true);

		}

		if((element.resizable && FPDUtil.getType(element.type) === 'image') || element.rotatable) {
			_toggleUiTool('transform');
			_toggleSubTool('transform', 'scale', (element.resizable && FPDUtil.getType(element.type) === 'image'));
			//uni scaling tools
			_lockUniScaling(element.lockUniScaling);
			_toggleSubTool('transform', 'uniscaling-locker', element.uniScalingUnlockable);
			_toggleSubTool('transform', 'angle', element.rotatable);
		}

		if(element.draggable || element.resizable) {
			_toggleUiTool('position');
		}

		if(element.zChangeable) {
			_toggleUiTool('move');
		}


		if((element.type === 'path-group' || FPDUtil.getType(element.type) === 'text') && element.patterns && element.patterns.length) {

			_toggleUiTool('fill');
			_togglePanelTab('fill', 'pattern', true);

		}

		//text options
		if(FPDUtil.getType(element.type) === 'text' && element.editable) {

			_toggleUiTool('font-family');
			_toggleUiTool('text-size', element.resizable);
			_toggleUiTool('text-line-height');
			_toggleUiTool('text-letter-spacing');
			_toggleUiTool('text-bold');
			_toggleUiTool('text-italic');
			_toggleUiTool('text-underline');
			_toggleUiTool('text-align');
			_toggleUiTool('text-stroke');
			if(element.curvable) {
				_toggleUiTool('curved-text');
			}

			$uiToolbarSub.find('.fpd-panel-edit-text textarea').val(element.getText());
			_toggleUiTool('edit-text', !element.textPlaceholder && !element.numberPlaceholder); //hide edit-text when element is used as placeholder for numbers&names

		}

		//display only enabled tabs and when tabs length > 1
		$uiToolbarSub.find('.fpd-panel-tabs').each(function(index, panelTabs) {

			var $panelTabs = $(panelTabs);
			$panelTabs.toggle($panelTabs.children(':not(.fpd-disabled)').length > 1);
			$panelTabs.children(':not(.fpd-disabled):first').addClass('fpd-active').click();

		});

		//set UI value by selected element
		$uiElementToolbar.find('[data-control]').each(function(index, uiElement) {

			var $uiElement = $(uiElement),
				parameter = $uiElement.data('control');

			if($uiElement.hasClass('fpd-number')) {

				if(element[parameter] !== undefined) {
					var numVal = $uiElement.attr('step') && $uiElement.attr('step').length > 1 ? parseFloat(element[parameter]).toFixed(2) : parseInt(element[parameter]);
					$uiElement.val(numVal);
				}

			}
			else if($uiElement.hasClass('fpd-toggle')) {

				$uiElement.toggleClass('fpd-enabled', element[parameter] === $uiElement.data('enabled'));

			}
			else if($uiElement.hasClass('fpd-current-fill')) {

				var currentFill = element[parameter];

				//fill: hex
				if(typeof currentFill === 'string') {
					$uiElement.css('background', currentFill);
				}
				//fill: pattern or svg fill
				else if(typeof currentFill === 'object') {

					if(currentFill.source) { //pattern
						currentFill = currentFill.source.src;
						$uiElement.css('background', 'url('+currentFill+')');
					}
					else { //svg has fill
						currentFill = currentFill[0];
						$uiElement.css('background', currentFill);
					}

				}
				//element: svg
				else if(element.colors === true && element.type === 'path-group') {
					currentFill = tinycolor(element.paths[0].fill);
					$uiElement.css('background', currentFill);
				}
				//no fill, only colors set
				else if(currentFill === false && element.colors && element.colors[0]) {
					currentFill = element.colors[0];

					$uiElement.css('background', currentFill);
				}
				//image that accepts only filters
				else if(element.filter) {
					$uiElement.css('background', $uiToolbarSub.find('.fpd-filter-'+element.filter+' picture').css('background-image'));
				}

			}
			else if($uiElement.hasClass('fpd-dropdown-current')) {

				if(element[parameter] !== undefined) {

					var value = $uiElement.nextAll('.fpd-dropdown-list:first').children('[data-value="'+element[parameter]+'"]').html();
					$uiElement.is('input') ? $uiElement.val(value) : $uiElement.html(value).data('value');

					if(parameter === 'fontFamily') {
						$uiElement.css('font-family', value);
					}
				}


			}


		});

		instance.updatePosition(element);
		/* maybe later
		setTimeout(function() {

		}, 10);*/

	};

	this.hideTools = function() {

		$uiElementToolbar.children('.fpd-row').hide() //hide row
		.children('div').hide().removeClass('fpd-active'); //hide tool in row

		$uiToolbarSub.hide()//hide sub toolbar
		.children().removeClass('fpd-active')//hide all sub panels in sub toolbar
		.find('.fpd-panel-tabs > span').addClass('fpd-disabled'); //disable all tabs

	};

	this.updatePosition = function(element, showHide) {

		showHide = typeof showHide === 'undefined' ? true : showHide;

		if(!element) {
			this.toggle(false);
			return;
		}

		var oCoords = element.oCoords,
			topOffset = oCoords.mb.y,
			designerOffset = fpdInstance.$productStage.offset(),
			mainWrapperOffset = fpdInstance.$mainWrapper.offset();

		if(instance.placement == 'inside-bottom' || instance.placement == 'inside-top') {

			var scrollTopOffset = fpdInstance.$container.parents('.fpd-modal-wrapper').length > 0 ? fpdInstance.$container.parents('.fpd-modal-wrapper').scrollTop() : document.body.scrollTop;

			if(instance.placement == 'inside-top') {

				if(fpdInstance.$container.parents('.fpd-modal-wrapper').length > 0) { //modal mode
					topOffset = scrollTopOffset ? Math.abs(mainWrapperOffset.top) : 0;
				}
				else {
					topOffset = scrollTopOffset > mainWrapperOffset.top ? scrollTopOffset - mainWrapperOffset.top : 0;
				}

			}
			else {

				if(fpdInstance.$container.parents('.fpd-modal-wrapper').length > 0) { //modal mode
					topOffset = scrollTopOffset ? Math.abs(mainWrapperOffset.top) : 0;
				}
				else {
					topOffset = scrollTopOffset > mainWrapperOffset.top ? scrollTopOffset - mainWrapperOffset.top : 0;
				}

			}

			$uiElementToolbar.css({
				top:topOffset
			});

		}
		else { //dynamic

			//set maximal width
			$uiElementToolbar.width(320);
			//calculate largest width of rows
			var maxWidth = Math.max.apply( null, $( $uiElementToolbar.children('.fpd-row') ).map( function () {
			    return $( this ).outerWidth( true );
			}).get() );
			//set new width
			$uiElementToolbar.width(maxWidth+2);

			topOffset = oCoords.tl.y > topOffset ? oCoords.tl.y : topOffset;
			topOffset = oCoords.tr.y > topOffset ? oCoords.tr.y : topOffset;
			topOffset = oCoords.bl.y > topOffset ? oCoords.bl.y : topOffset;
			topOffset = oCoords.br.y > topOffset ? oCoords.br.y : topOffset;
			topOffset = topOffset + element.padding + element.cornerSize + designerOffset.top;
			topOffset = topOffset > fpdInstance.$productStage.height() + designerOffset.top ? fpdInstance.$productStage.height() + designerOffset.top + 5 : topOffset;
			topOffset = topOffset + 400 > document.body.scrollHeight ? document.body.scrollHeight - 400 : topOffset;

			var posLeft = designerOffset.left + oCoords.mb.x,
				halfWidth =  $uiElementToolbar.outerWidth() * .5;

			posLeft = posLeft < halfWidth ? halfWidth : posLeft; //move toolbar not left outside of document
			posLeft = posLeft > $(window).width() - halfWidth ? $(window).width() - halfWidth : posLeft; //move toolbar not right outside of document

			$uiElementToolbar.css({
				left: posLeft,
				top: topOffset
			});

		}

		$uiElementToolbar.toggleClass('fpd-show', showHide);

	};

	this.updateUIValue = function(tool, value) {

		var $UIController = $uiElementToolbar.find('[data-control="'+tool+'"]');

		$UIController.val(value);
		$UIController.filter('.fpd-slider-range').rangeslider('update', true, false);

	};

	this.toggle = function(showHide) {

		$uiElementToolbar.toggleClass('fpd-show', showHide);

	};

	this.setPlacement = function(placement) {

		instance.placement = placement;

		//remove fpd-toolbar-placement-* class
		$uiElementToolbar.removeClass (function (index, css) {
		    return (css.match (/(^|\s)fpd-toolbar-placement-\S+/g) || []).join(' ');
		});

		$uiElementToolbar.addClass('fpd-toolbar-placement-'+placement);

		if(instance.placement == 'inside-bottom' || instance.placement == 'inside-top') {
			$uiElementToolbar.appendTo(fpdInstance.$mainWrapper);
		}
		else {
			$uiElementToolbar.appendTo(fpdInstance.mainOptions.toolbarDynamicContext);
		}



	}

	_initialize();

};

var FPDMainBar = function(fpdInstance, $mainBar, $modules, $draggableDialog) {

	var instance = this,
		$body = $('body'),
		$nav = $mainBar.children('.fpd-navigation'),
		$content;

	this.currentModules = fpdInstance.mainOptions.mainBarModules;
	this.$selectedModule = null;
	this.$container = $mainBar;
	this.mainBarShowing = true;

	var _initialize = function() {

		if(fpdInstance.$container.hasClass('fpd-topbar') && !fpdInstance.$container.hasClass('fpd-main-bar-container-enabled') && fpdInstance.$container.filter('[class*="fpd-off-canvas-"]').length === 0) { //draggable dialog

			$content = $draggableDialog.addClass('fpd-grid-columns-'+fpdInstance.mainOptions.gridColumns).append('<div class="fpd-content"></div>').children('.fpd-content');

		}
		else {
			$content = $mainBar.append('<div class="fpd-content"></div>').children('.fpd-content');
		}

		instance.$content = $content;

		if(fpdInstance.$container.filter('[class*="fpd-off-canvas-"]').length > 0) {

			var touchStart = 0,
				panX = 0,
				closeStartX = 0,
				$closeBtn = $mainBar.children('.fpd-close-off-canvas');

			$content.on('touchstart', function(evt) {

				touchStart = evt.originalEvent.touches[0].pageX;
				closeStartX = parseInt($closeBtn.css(fpdInstance.$container.hasClass('fpd-off-canvas-left') ? 'left' : 'right'));

			})
			.on('touchmove', function(evt) {

				evt.preventDefault();

				var moveX = evt.originalEvent.touches[0].pageX;
					panX = touchStart-moveX,
					targetPos = fpdInstance.$container.hasClass('fpd-off-canvas-left') ? 'left' : 'right';

				panX = Math.abs(panX) < 0 ? 0 : Math.abs(panX);
				$content.css(targetPos, -panX);
				$closeBtn.css(targetPos, closeStartX - panX);

			})
			.on('touchend', function(evt) {

				var targetPos = fpdInstance.$container.hasClass('fpd-off-canvas-left') ? 'left' : 'right';

				if(Math.abs(panX) > 100) {

					instance.toggleDialog(false);

				}
				else {
					$content.css(targetPos, 0);
					$closeBtn.css(targetPos, closeStartX);
				}

				panX = 0;

			});

		}

		//close off-canvas
		$mainBar.on('click', '.fpd-close-off-canvas', function(evt) {

			evt.stopPropagation();

			$nav.children('div').removeClass('fpd-active');
			instance.toggleDialog(false);

		});

		$body.append($draggableDialog);
		$draggableDialog.draggable({
			handle: $draggableDialog.find('.fpd-dialog-head'),
			containment: $body
		});

		//select module
		$nav.on('click', '> div', function(evt) {

			evt.stopPropagation();

			var $this = $(this);

			fpdInstance.deselectElement();

			if(fpdInstance.currentViewInstance) {
				fpdInstance.currentViewInstance.currentUploadZone = null;
			}

			$content.find('.fpd-manage-layers-panel')
			.find('.fpd-current-color, .fpd-path-colorpicker').spectrum('destroy');

			if(fpdInstance.$container.hasClass('fpd-topbar') && $this.hasClass('fpd-active')) {

				$this.removeClass('fpd-active');
				instance.toggleDialog(false);

			}
			else {

				instance.callModule($this.data('module'));

			}

		});

		//prevent document scrolling when in dialog content
		$body.on({
		    'mousewheel': function(evt) {

				var $target = $(evt.target);
		        if ($target.hasClass('fpd-draggable-dialog') || $target.parents('.fpd-draggable-dialog').length > 0) {
			    	evt.preventDefault();
				    evt.stopPropagation();
			    }

		    }
		});

		$content.on('click', '.fpd-bottom-nav > div', function() {

			var $this = $(this);

			$this.addClass('fpd-active').siblings().removeClass('fpd-active');

			var $selectedModule = $this.parent().next().children('[data-module="'+$this.data('module')+'"]').addClass('fpd-active');
			$selectedModule.siblings().removeClass('fpd-active');

			//short timeout, because fpd-grid must be visible
			setTimeout(function() {
				FPDUtil.refreshLazyLoad($selectedModule.find('.fpd-grid'), false);
			}, 10);


		});

		//close dialog
		$body.on('click', '.fpd-close-dialog', function() {

			instance.toggleDialog(false);

		});

		fpdInstance.$container.on('viewSelect', function() {

			if(instance.$selectedModule) {

				if(instance.$selectedModule.filter('[data-module="manage-layers"]').length > 0) {
					LayersModule.createList(fpdInstance, instance.$selectedModule);
				}
				//PLUS
				else if(typeof FPDNamesNumbersModule !== 'undefined' && instance.$selectedModule.filter('[data-module="names-numbers"]').length > 0) {
					FPDNamesNumbersModule.setup(fpdInstance, instance.$selectedModule);
				}

			}

		});

		fpdInstance.$container.on('elementAdd elementRemove', function() {

			if(fpdInstance.productCreated && instance.$selectedModule) {

				if(instance.$selectedModule.filter('[data-module="manage-layers"]').length > 0) {
					LayersModule.createList(fpdInstance, instance.$selectedModule);
				}

			}

		});

		instance.setup(instance.currentModules);

	}

	//call module by name
	this.callModule = function(name) {

		var $selectedNavItem = $nav.children('div').removeClass('fpd-active').filter('[data-module="'+name+'"]').addClass('fpd-active');
		instance.$selectedModule = $content.children('div').removeClass('fpd-active').filter('[data-module="'+name+'"]').addClass('fpd-active');

		if($content.parent('.fpd-draggable-dialog').length > 0) {

			if($draggableDialog.attr('style') === undefined || $draggableDialog.attr('style') === '') {
				$draggableDialog.css('top', $mainBar.offset().top + $mainBar.height());
			}
			$draggableDialog.addClass('fpd-active')
			.find('.fpd-dialog-title').text($selectedNavItem.find('.fpd-label').text());

		}

		if(name === 'text') {
			instance.$selectedModule.find('textarea').focus();
		}
		else if(name === 'manage-layers') {

			if(fpdInstance.productCreated) {
				LayersModule.createList(fpdInstance, instance.$selectedModule);
			}

		}
		else if(typeof FPDNamesNumbersModule !== 'undefined' && name === 'names-numbers') {

			if(fpdInstance.productCreated) {
				FPDNamesNumbersModule.setup(fpdInstance, instance.$selectedModule);
			}

		}

		instance.toggleDialog(true);

		FPDUtil.refreshLazyLoad(instance.$selectedModule.find('.fpd-grid'), false);

	};

	this.callSecondary = function(className) {

		instance.callModule('secondary');

		$content.children('.fpd-secondary-module').children('.'+className).addClass('fpd-active')
		.siblings().removeClass('fpd-active');


		if(className === 'fpd-upload-zone-adds-panel') {
			$content.find('.fpd-upload-zone-adds-panel .fpd-bottom-nav > :not(.fpd-hidden)').first().click();
		}

	};

	this.setContentWrapper = function(wrapper) {

		$draggableDialog.removeClass('fpd-active');

		if(wrapper === 'sidebar') {

			if($nav.children('.fpd-active').length === 0) {
				$nav.children().first().addClass('fpd-active');
			}

			$content.appendTo($mainBar);

		}
		else if(wrapper === 'draggable-dialog') {

			$content.appendTo($draggableDialog);

		}

		//toogle tooltips
		$nav.children().each(function(i, navItem) {

			var $navItem = $(navItem);
			$navItem.filter('.fpd-tooltip').tooltipster('destroy');
			if(fpdInstance.$container.hasClass('fpd-sidebar')) {
				$navItem.addClass('fpd-tooltip').attr('title', $navItem.children('.fpd-label').text());
			}
			else {
				$navItem.removeClass('fpd-tooltip').removeAttr('title');
			}

		});

		FPDUtil.updateTooltip($nav);

		$nav.children('.fpd-active').click();

	};

	this.toggleDialog = function(toggle) {

		toggle = typeof toggle === 'undefined' ? true : toggle;

		//top bar is enabled
		if(fpdInstance.$container.hasClass('fpd-topbar') && fpdInstance.$container.filter('[class*="fpd-off-canvas-"]').length === 0) {

			$draggableDialog.toggleClass('fpd-active', toggle);

			if(!toggle) {
				$nav.children('.fpd-active').removeClass('fpd-active');
			}

			//deselect element when main bar is showing
			if(!toggle && instance.mainBarShowing) {
				fpdInstance.deselectElement();
			}

		}

		//off-canvas is enabled
		if(fpdInstance.$container.filter('[class*="fpd-off-canvas-"]').length > 0) {

			instance.$container.toggleClass('fpd-show', toggle)
			.children('.fpd-close-off-canvas').removeAttr('style');
			instance.$content.removeAttr('style')
			.height(fpdInstance.$mainWrapper.height());

			if($nav.children('div').length === 0) {
				instance.$content.css('top', 0);
			}
			else {
				instance.$content.css('top', $nav.height());
			}

			//deselect element when main bar is showing
			if(!toggle && instance.mainBarShowing) {
				fpdInstance.deselectElement();
			}

		}

		instance.mainBarShowing = toggle;

	};

	this.toggleUploadZonePanel = function(toggle) {

		toggle = typeof toggle === 'undefined' ? true : toggle;

		//do nothing when custom image is loading
		if(fpdInstance._loadingCustomImage) {
			return;
		}

		if(toggle) {

			instance.callSecondary('fpd-upload-zone-adds-panel');

		}
		else {

			fpdInstance.currentViewInstance.currentUploadZone = null;

			if(fpdInstance.$container.hasClass('fpd-sidebar')) {
				instance.callModule(fpdInstance.mainBar.currentModules[0]);
			}

		}

	};

	this.toggleUploadZoneAdds = function(customAdds) {

		var $uploadZoneAddsPanel = $content.find('.fpd-upload-zone-adds-panel');

		$uploadZoneAddsPanel.find('.fpd-add-image').toggleClass('fpd-hidden', !Boolean(customAdds.uploads));
		$uploadZoneAddsPanel.find('.fpd-add-text').toggleClass('fpd-hidden', !Boolean(customAdds.texts));
		$uploadZoneAddsPanel.find('.fpd-add-design').toggleClass('fpd-hidden', !Boolean(customAdds.designs));

		if(fpdInstance.currentElement.price) {
			var price = fpdInstance.mainOptions.priceFormat.replace('%d', fpdInstance.currentElement.price);
			$uploadZoneAddsPanel.find('[data-module="text"] .fpd-btn > .fpd-price').html(' - '+price);
		}
		else {
			$uploadZoneAddsPanel.find('[data-module="text"] .fpd-btn > .fpd-price').html('');
		}


		//select first visible add panel
		$uploadZoneAddsPanel.find('.fpd-off-canvas-nav > :not(.fpd-hidden)').first().click();

	};

	this.setup = function(modules) {

		instance.currentModules = modules;

		var selectedModule = fpdInstance.mainOptions.initialActiveModule;

		//if only modules exist, select it and hide nav
		if(instance.currentModules.length <= 1 && !fpdInstance.$container.hasClass('fpd-topbar')) {
			selectedModule = instance.currentModules[0] ? instance.currentModules[0] : '';
			$nav.addClass('fpd-hidden');
		}
		else {
			$nav.removeClass('fpd-hidden');
		}

		$nav.empty();
		$content.empty();

		//add selected modules
		for(var i=0; i < modules.length; ++i) {

			var module = modules[i],
				$module = $modules.children('[data-module="'+module+'"]'),
				$moduleClone = $module.clone(),
				navItemClass = fpdInstance.$container.hasClass('fpd-sidebar') ? 'class="fpd-tooltip"' : '',
				navItemTitle = fpdInstance.$container.hasClass('fpd-sidebar') ? 'title="'+$module.data('title')+'"' : '';

			$nav.append('<div data-module="'+module+'" '+navItemClass+' '+navItemTitle+'><span class="'+$module.data('moduleicon')+'"></span><span class="fpd-label">'+$module.data('title')+'</span></div>');
			$content.append($moduleClone);

			if(module === 'products') {
				new ProductsModule(fpdInstance, $moduleClone);
			}
			else if(module === 'text') {
				new TextModule(fpdInstance, $moduleClone);
			}
			else if(module === 'designs') {
				new DesignsModule(fpdInstance, $moduleClone);
			}
			else if(module === 'images') {
				new ImagesModule(fpdInstance, $moduleClone);
			}
			//PLUS
			else if(typeof FPDDrawingModule !== 'undefined' && module === 'drawing') {
				new FPDDrawingModule(fpdInstance, $moduleClone);
			}

		}

		if($content.children('[data-module="manage-layers"]').length === 0) {
			$content.append($modules.children('[data-module="manage-layers"]').clone());
		}

		$content.append($modules.children('[data-module="secondary"]').clone());

		//add upload zone modules
		var uploadZoneModules = ['images', 'text', 'designs'];
		for(var i=0; i < uploadZoneModules.length; ++i) {

			var module = uploadZoneModules[i],
				$module = $modules.children('[data-module="'+module+'"]'),
				$moduleClone = $module.clone();

			$content.find('.fpd-upload-zone-content').append($moduleClone);

			if(module === 'text') {
				new TextModule(fpdInstance, $moduleClone);
			}
			else if(module === 'designs') {
				new DesignsModule(fpdInstance, $moduleClone);
			}
			else if(module === 'images') {
				new ImagesModule(fpdInstance, $moduleClone);
			}

		}

		if(fpdInstance.$container.hasClass('fpd-sidebar') && selectedModule == '') {
			selectedModule = $nav.children().first().data('module');
		}
		$nav.children('[data-module="'+selectedModule+'"]').click();

	};

	_initialize();

};

FPDMainBar.availableModules = [
	'products',
	'images',
	'text',
	'designs',
	'manage-layers'
];

var FPDActions = function(fpdInstance, $actions){

	var instance = this,
		snapLinesGroup;

	this.currentActions = fpdInstance.mainOptions.actions;

	var _initialize = function() {

		//add set action buttons
		if($actions) {
			instance.setup(instance.currentActions);

			//action click handler
			fpdInstance.$mainWrapper.on('click', '.fpd-actions-wrapper .fpd-action-btn', function() {

				var $this = $(this);

				if($this.hasClass('tooltipstered')) {
					$this.tooltipster('hide');
				}

				instance.doAction($this);

			});

		}

		fpdInstance.$container.on('viewSelect', function() {

			instance.resetAllActions();

		});

	};

	//set action button to specific position
	var _setActionButtons = function(pos) {

		fpdInstance.$mainWrapper.append('<div class="fpd-actions-wrapper fpd-pos-'+pos+'"></div>');

		var posActions = instance.currentActions[pos];

		for(var i=0; i < posActions.length; ++i) {

			var actionName = posActions[i],
				$action = $actions.children('[data-action="'+actionName+'"]');

			fpdInstance.$mainWrapper.children('.fpd-actions-wrapper.fpd-pos-'+pos).append($action.clone());
		}

	};

	//returns an object with the saved products for the current showing product
	var _getSavedProducts = function() {

		return  FPDUtil.localStorageAvailable() ? JSON.parse(window.localStorage.getItem(fpdInstance.$container.attr('id'))) : false;

	};

	//add a saved product to the load dialog
	var _addSavedProduct = function(thumbnail, product, title) {

		title = title ? title : '';

		//create new list item
		var $gridWrapper = fpdInstance.mainBar.$content.find('.fpd-saved-designs-panel .fpd-grid'),
			htmlTitle = title !== '' ? 'title="'+title+'"' : '';

		$gridWrapper.append('<div class="fpd-item fpd-tooltip" '+htmlTitle+'><picture style="background-image: url('+thumbnail+')" ></picture><div class="fpd-remove-design"><span class="fpd-icon-remove"></span></div></div>')
		.children('.fpd-item:last').click(function(evt) {

			fpdInstance.loadProduct($(this).data('product'));
			fpdInstance.currentProductIndex = -1;

		}).data('product', product)
		.children('.fpd-remove-design').click(function(evt) {

			evt.stopPropagation();

			var $item = $(this).parent('.fpd-item'),
				index = $item.parent('.fpd-grid').children('.fpd-item').index($item.remove()),
				savedProducts = _getSavedProducts();

				savedProducts.splice(index, 1);

			window.localStorage.setItem(fpdInstance.$container.attr('id'), JSON.stringify(savedProducts));

		});

		FPDUtil.updateTooltip($gridWrapper);

	};

	//download png, jpeg or pdf
	this.downloadFile = function(type) {

		if(type === 'jpeg' || type === 'png') {

			var a = document.createElement('a'),
				background = type === 'jpeg' ? '#fff' : 'transparent';

			if (typeof a.download !== 'undefined') {

				fpdInstance.getProductDataURL(function(dataURL) {

					fpdInstance.$container.find('.fpd-download-anchor').attr('href', dataURL)
					.attr('download', 'Product.'+type+'')[0].click();

				}, background, {format: type})

			}
			else {

				fpdInstance.createImage(true, true, background, {format: type});

			}
		}
		else {

			_createPDF = function(dataURLs) {

				var largestWidth = fpdInstance.viewInstances[0].options.stageWidth,
					largestHeight = fpdInstance.viewInstances[0].options.stageHeight;

				for(var i=1; i < fpdInstance.viewInstances.length; ++i) {

					var viewOptions = fpdInstance.viewInstances[i].options;
					if(viewOptions.stageWidth > largestWidth) {
						largestWidth = viewOptions.stageWidth;
					}

					if(viewOptions.stageHeight > largestHeight) {
						largestHeight = viewOptions.stageHeight;
					}

				}

				var orientation = fpdInstance.currentViewInstance.stage.getWidth() > fpdInstance.currentViewInstance.stage.getHeight() ? 'l' : 'p',
					doc = new jsPDF(orientation, 'mm', [largestWidth * 0.26, largestHeight * 0.26]);

				for(var i=0; i < dataURLs.length; ++i) {

					doc.addImage(dataURLs[i], 'JPEG', 0, 0);
					if(i < dataURLs.length-1) {
						doc.addPage();
					}

				}

				doc.save('Product.pdf');

			};

			fpdInstance.getViewsDataURL(_createPDF, '#ffffff', {format: 'jpeg'});

		}

	};

	this.setup = function(actions) {

		this.currentActions = actions;

		fpdInstance.$mainWrapper.children('.fpd-actions-wrapper').remove();

		var keys = Object.keys(actions);
		for(var i=0; i < keys.length; ++i) {

			var posActions = actions[keys[i]];
			if(typeof posActions === 'object' && posActions.length > 0) {
				_setActionButtons(keys[i]);
			}

		}

	};

	this.doAction = function($this) {

		var action = $this.data('action');

		fpdInstance.deselectElement();

		if(action === 'print') {

			fpdInstance.print();

		}
		else if(action === 'reset-product') {

			var confirmReset = confirm(fpdInstance.getTranslation('misc', 'reset_confirm'));
			if(confirmReset) {
				fpdInstance.loadProduct(fpdInstance.currentViews);
			}

		}
		else if(action === 'undo') {

			fpdInstance.currentViewInstance.undo();

		}
		else if(action === 'redo') {

			fpdInstance.currentViewInstance.redo();

		}
		else if(action === 'info') {

			FPDUtil.showModal($this.children('.fpd-info-content').text());

		}
		else if(action === 'preview-lightbox') {

			fpdInstance.getProductDataURL(function(dataURL) {

				var image = new Image();
				image.src = dataURL;

				image.onload = function() {
					FPDUtil.showModal('<img src="'+this.src+'" download="product.png" />', true);
				}

			});

		}
		else if(action === 'save') {

			var $prompt = FPDUtil.showModal(fpdInstance.getTranslation('actions', 'save_placeholder'), false, 'prompt');
			$prompt.find('.fpd-btn').text(fpdInstance.getTranslation('actions', 'save')).click(function() {

				fpdInstance.doUnsavedAlert = false;

				var title = $(this).siblings('input:first').val();

				//get key and value
				var product = fpdInstance.getProduct(),
					scaling = FPDUtil.getScalingByDimesions(fpdInstance.currentViewInstance.options.stageWidth, fpdInstance.currentViewInstance.options.stageHeight, 200, 200),
					thumbnail = fpdInstance.currentViewInstance.stage.toDataURL({multiplier: scaling, format: 'png'});

				//check if there is an existing products array
				var savedProducts = _getSavedProducts();
				if(!savedProducts) {
					//create new
					savedProducts = new Array();
				}

				savedProducts.push({thumbnail: thumbnail, product: product, title: title});
				window.localStorage.setItem(fpdInstance.$container.attr('id'), JSON.stringify(savedProducts));

				FPDUtil.showMessage(fpdInstance.getTranslation('misc', 'product_saved'));
				$prompt.find('.fpd-modal-close').click();

			});



		}
		else if(action === 'load') {

			//load all saved products into list
			var savedProducts = _getSavedProducts();

			fpdInstance.mainBar.$content.find('.fpd-saved-designs-panel .fpd-grid').empty();

			if(savedProducts) {

				for(var i=0; i < savedProducts.length; ++i) {

					var savedProduct = savedProducts[i];
					_addSavedProduct(savedProduct.thumbnail, savedProduct.product, savedProduct.title);

				}

				FPDUtil.createScrollbar(fpdInstance.mainBar.$content.find('.fpd-saved-designs-panel .fpd-scroll-area'));

			}

			fpdInstance.mainBar.callSecondary('fpd-saved-designs-panel');


		}
		else if(action === 'manage-layers') {

			fpdInstance.mainBar.callModule('manage-layers');


		}
		else if(action === 'snap') {

			$this.toggleClass('fpd-active');

			fpdInstance.$mainWrapper.children('.fpd-snap-line-h, .fpd-snap-line-v').hide();

			if($this.hasClass('fpd-active')) {

				var lines = [],
					gridX = fpdInstance.mainOptions.snapGridSize[0] ? fpdInstance.mainOptions.snapGridSize[0] : 50,
					gridY = fpdInstance.mainOptions.snapGridSize[1] ? fpdInstance.mainOptions.snapGridSize[1] : 50,
					linesXNum = Math.ceil(fpdInstance.currentViewInstance.options.stageWidth / gridX),
					linesYNum = Math.ceil(fpdInstance.currentViewInstance.options.stageHeight / gridY);

				//add x-lines
				for(var i=0; i < linesXNum; ++i) {

					var lineX = new fabric.Rect({
						width: 1,
						height: fpdInstance.currentViewInstance.options.stageHeight,
						fill: '#ccc',
						opacity: 0.6,
						left: i * gridX,
						top: 0
					});

					lines.push(lineX);

				}

				//add y-lines
				for(var i=0; i < linesYNum; ++i) {

					var lineY = new fabric.Rect({
						width: fpdInstance.currentViewInstance.options.stageWidth,
						height: 1,
						fill: '#ccc',
						opacity: 0.6,
						top: i * gridY,
						left: 0
					});

					lines.push(lineY);

				}

				snapLinesGroup = new fabric.Group(lines, {id: '_snap_lines_group', left: 0, top: 0, evented: false, selectable: false});
				fpdInstance.currentViewInstance.stage.add(snapLinesGroup);

			}
			else {

				if(snapLinesGroup) {
					fpdInstance.currentViewInstance.stage.remove(snapLinesGroup);
				}

			}

		}
		else if(action === 'qr-code') {

			var $internalModal = FPDUtil.showModal($this.children('.fpd-modal-qrcode').clone());

			$colorPickers = $internalModal.find('.fpd-qrcode-colors input').spectrum({
				preferredFormat: "hex",
				showInput: true,
				showInitial: true,
				showButtons: false,
				replacerClassName: 'fpd-spectrum-replacer'
			});

			$internalModal.find('.fpd-add-qr-code').click(function() {

				var text = $internalModal.find('.fpd-modal-qrcode > input').val();

				if(text && text.length !== 0) {

					var $qrcodeWrapper = $internalModal.find('.fpd-qrcode-wrapper').empty(),
						qrcode = new QRCode($qrcodeWrapper .get(0), {
					    text: text,
					    width: 256,
					    height: 256,
					    colorDark : $colorPickers.filter('.fpd-qrcode-color-dark').spectrum('get').toHexString(),
					    colorLight : $colorPickers.filter('.fpd-qrcode-color-light').spectrum('get').toHexString(),
					    correctLevel : QRCode.CorrectLevel.H
					});

					$qrcodeWrapper.find('img').load(function() {

						fpdInstance.addElement(
							'image',
							this.src,
							'QR-Code - '+text,
							fpdInstance.currentViewInstance.options.qrCodeProps
						);

						$internalModal.find('.fpd-modal-close').click();

					});

				}

			});

		}
		else if(action === 'zoom') {

			if(!$this.hasClass('fpd-active')) {

				if($this.hasClass('tooltipstered')) {
					$this.tooltipster('destroy');
				}

				$this.tooltipster({
					trigger: 'click',
					position: 'bottom',
					content: $this.find('.fpd-tooltip-content'),
					theme: 'fpd-sub-tooltip-theme fpd-zoom-tooltip',
					touchDevices: false,
					interactive: true,
					//autoClose: false,
					functionReady: function(origin, tooltip) {

						var startVal = fpdInstance.currentViewInstance.stage.getZoom() / fpdInstance.currentViewInstance.responsiveScale;

						tooltip.find('.fpd-zoom-slider').attr('step', fpdInstance.mainOptions.zoomStep).attr('max', fpdInstance.mainOptions.maxZoom)
						.val(startVal).rangeslider({
							polyfill: false,
							rangeClass: 'fpd-range-slider',
							disabledClass: 'fpd-range-slider--disabled',
							horizontalClass: 'fpd-range-slider--horizontal',
						    verticalClass: 'fpd-range-slider--vertical',
						    fillClass: 'fpd-range-slider__fill',
						    handleClass: 'fpd-range-slider__handle',
						    onSlide: function(pos, value) {
								fpdInstance.setZoom(value);
						    }
						});

						tooltip.find('.fpd-stage-pan').click(function() {

							fpdInstance.currentViewInstance.dragStage = fpdInstance.currentViewInstance.dragStage ? false : true;
							$(this).toggleClass('fpd-enabled');
							fpdInstance.$productStage.toggleClass('fpd-drag');

						}).toggleClass('fpd-enabled', fpdInstance.currentViewInstance.dragStage);

					},
					functionAfter: function(origin) {

						origin.removeClass('fpd-active')
						.tooltipster('destroy');

						origin.attr('title', origin.data('defaulttext'))
						.tooltipster({
							offsetY: 0,
							position: 'bottom',
							theme: '.fpd-tooltip-theme',
							touchDevices: false,
						});

					}
				});

				$this.tooltipster('show');

			}

			$this.toggleClass('fpd-active');

		}
		else if(action === 'download') {

			if(!$this.hasClass('fpd-active')) {

				if($this.hasClass('tooltipstered')) {
					$this.tooltipster('destroy');
				}

				$this.tooltipster({
					trigger: 'click',
					position: 'bottom',
					content: $this.find('.fpd-tooltip-content'),
					theme: 'fpd-sub-tooltip-theme',
					touchDevices: false,
					functionReady: function(origin, tooltip) {

						tooltip.find('.fpd-item').click(function() {
							instance.downloadFile($(this).data('value'))
						});

					},
					functionAfter: function(origin) {

						origin.removeClass('fpd-active')
						.tooltipster('destroy');

						origin.attr('title', origin.data('defaulttext'))
						.tooltipster({
							offsetY: 0,
							position: 'bottom',
							theme: '.fpd-tooltip-theme',
							touchDevices: false,
						});

					}
				});

				$this.tooltipster('show');

			}

			$this.toggleClass('fpd-active');

		}
		else if(action === 'magnify-glass') {

			fpdInstance.resetZoom();

			if($this.hasClass('fpd-active')) {

				$(".fpd-zoom-image,.zoomContainer").remove();
				fpdInstance.$productStage.children('.fpd-view-stage').eq(fpdInstance.currentViewIndex).removeClass('fpd-hidden');

			}
			else {

				fpdInstance.toggleSpinner();

				var scaling = Number(2000 / fpdInstance.currentViewInstance.options.stageWidth).toFixed(2);
					dataURL = fpdInstance.currentViewInstance.stage.toDataURL({multiplier: scaling, format: 'png'});

				fpdInstance.$productStage.append('<img src="'+dataURL+'" class="fpd-zoom-image" />')
				.children('.fpd-zoom-image').elevateZoom({
					scrollZoom: true,
					borderSize: 1,
					zoomType: "lens",
					lensShape: "round",
					lensSize: 200,
					responsive: true
				}).load(function() {
					fpdInstance.toggleSpinner(false);
				});

				fpdInstance.$productStage.children('.fpd-view-stage').addClass('fpd-hidden');

			}

			$this.toggleClass('fpd-active');

		}
		else if(action === 'ruler') {

			if($this.hasClass('fpd-active')) {

				var rulerHor = fpdInstance.currentViewInstance.getElementByID('_ruler_hor');
				if(rulerHor) {
					fpdInstance.currentViewInstance.stage.remove(rulerHor);
				}

				var rulerVer = fpdInstance.currentViewInstance.getElementByID('_ruler_ver');
				if(rulerVer) {
					fpdInstance.currentViewInstance.stage.remove(rulerVer);
				}

			}
			else {

				var pixelUnitsOptions = {
					fill: '#979797',
					fontSize: 10,
					fontFamily: 'Arial'
				};

				fabric.util.loadImage(FPDActions.rulerHorImg, function (img) {

					var groupRulerHor = new fabric.Group([], {
						left: 0,
						top: 0,
						originX: 'left',
						originY: 'top',
						evented: false,
						selectable: false,
						id: '_ruler_hor'
					});

					var rect = new fabric.Rect({
					    width: fpdInstance.currentViewInstance.options.stageWidth,
					    height: 30
					});

					rect.setPatternFill({
				        source: img,
				        repeat: 'repeat-x'
				    });

				    groupRulerHor.addWithUpdate(rect);

					var loopX = Math.ceil(fpdInstance.currentViewInstance.options.stageWidth / 100);
				    for(var i=1; i < loopX; ++i) {
					    var text = new fabric.Text(String(i*100), $.extend({}, pixelUnitsOptions, {top: 3, left: (i*100)+3}));
					    groupRulerHor.addWithUpdate(text);
					}

					fpdInstance.currentViewInstance.stage.add(groupRulerHor).renderAll();

				});

				fabric.util.loadImage(FPDActions.rulerVerImg, function (img) {

					var groupRulerVer = new fabric.Group([], {
						left: 0,
						top: 0,
						originX: 'left',
						originY: 'top',
						evented: false,
						selectable: false,
						id: '_ruler_ver'
					});

					var rect = new fabric.Rect({
					    width: 30,
					    height: fpdInstance.currentViewInstance.options.stageHeight
					});

					rect.setPatternFill({
				        source: img,
				        repeat: 'repeat-y'
				    });

				    groupRulerVer.addWithUpdate(rect);

					var loopX = Math.ceil(fpdInstance.currentViewInstance.options.stageWidth / 100);
				    for(var i=1; i < loopX; ++i) {
					    var text = new fabric.Text(String(i*100), $.extend({}, pixelUnitsOptions, {
						    top: (i*100)+3,
						    left: 12,
						    angle: 90,
						    originY: 'bottom'})
						);
					    groupRulerVer.addWithUpdate(text);
					}

					fpdInstance.currentViewInstance.stage.add(groupRulerVer).renderAll();

				});

			}

			$this.toggleClass('fpd-active');

		}

	};

	this.resetAllActions = function() {

		$(".fpd-zoom-image,.zoomContainer").remove();
		fpdInstance.$productStage.children('.fpd-view-stage').eq(fpdInstance.currentViewIndex).removeClass('fpd-hidden');

		fpdInstance.$mainWrapper.find('.fpd-action-btn').removeClass('fpd-active');

	};

	this.hideAllTooltips = function() {

		fpdInstance.$mainWrapper.find('.fpd-action-btn.tooltipstered').tooltipster('hide');

	};

	_initialize();

};

FPDActions.availableActions = [
	'print',
	'reset-product',
	'undo',
	'redo',
	'info',
	'save',
	'load',
	'manage-layers',
	'snap',
	'qr-code',
	'zoom',
	'download',
	'magnify-glass',
	'preview-lightbox',
	'ruler'
];

FPDActions.rulerHorImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAeCAYAAADaW7vzAAAAAXNSR0IArs4c6QAAAMtJREFUaAXt0bENAkEMBVGgJVranja5lq4myH50wUr+wQRDZCHWWPPee+/fdV33yw+iwAdxhUekgCBJwRgEYTjkCkGSgjEIwnDIFYIkBWMQhOGQKwRJCsYgCMMhVwiSFIxBEIZDrhAkKRiDIAyHXCFIUjAGQRgOuUKQpGAMgjAccoUgScEYjkHWWt+Tk/3dc6XTLscgz3/jt+0CgrSLDvcJMgzYfi5Iu+hwnyDDgO3ngrSLDvcJMgzYfi5Iu+hwnyDDgO3ngrSLDvf9ARH1Efg/D4CQAAAAAElFTkSuQmCC';

FPDActions.rulerVerImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABkCAYAAACRiYAFAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS40LjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgpMwidZAAAA40lEQVRoBe2UwQ3CUBTD+KzUYXvpSHQmECzgIlk8CbnXRonqvGZt2/a4DTz3gcxPZME/Ix/q/0e99n1/Xv3M4zjOq1rSrZaLEFnv+48tkugTakRkCVouiyT6dNWIyBKE2iKJPmOoWy7sxhKMdVywVSH6hBoRWYKWyyKJPl01IrIEobZIos8Y6pYLu7EEYx0XbFWIPqFGRJag5bJIok9XjYgsQagtkugzhrrlwm4swVjHBVsVok+oEZElaLkskujTVSMiSxBqiyT6jKFuubAbSzDWccFWhegTakRkCb5aLiv07fMCuAVB+Jp9DBgAAAAASUVORK5CYII=';


var DesignsModule = function(fpdInstance, $module) {

	var $head = $module.find('.fpd-head'),
		$scrollArea = $module.find('.fpd-scroll-area'),
		$designsGrid = $module.find('.fpd-grid'),
		lazyClass = fpdInstance.mainOptions.lazyLoad ? 'fpd-hidden' : '',
		$currentCategory = null,
		$lastCategory = null;

	var _initialize = function() {

		if(fpdInstance.$designs.length > 0) {

			//check if categories are used or first category also includes sub-cats
			if(fpdInstance.$designs.filter('.fpd-category').length > 1 || fpdInstance.$designs.filter('.fpd-category:first').children('.fpd-category').length > 0) {

				$currentCategory = fpdInstance.$designs;
				_displayCategories($currentCategory.filter('.fpd-category'));

			}
			else { //display single category or designs without categories
				_displayDesigns(fpdInstance.$designs);
			}

			fpdInstance.$designs.remove();
		}

		var searchInLabel = fpdInstance.getTranslation('modules', 'designs_search_in');
		$head.find('.fpd-toggle-search').click(function() {

			var $titleSearchCon = $(this).parent();

			$titleSearchCon.toggleClass('fpd-search-active')
			.children('.fpd-search').val('')
			.attr('placeholder', searchInLabel+' '+$titleSearchCon.children('.fpd-category-title').text());

			if($titleSearchCon.hasClass('fpd-search-active')) {
				$titleSearchCon.children('.fpd-search').focus();
			}
			else {
				$head.find('.fpd-search').val('').keyup();
			}

		});

		$head.find('.fpd-search').keyup(function() {

			if(this.value == '') { //no input, display all
				$designsGrid.children('.fpd-item').css('display', 'block');
			}
			else {
				//hide all items
				$designsGrid.children('.fpd-item').css('display', 'none');

				//only show by input value
			    var searchq = this.value.toLowerCase().trim().split(" ");

			    $designsGrid.children('.fpd-item').filter(function(){

			     	var fullsearchc = 0,
			     		self = this;

				 	$.each( searchq, function( index, value ){
					 	fullsearchc += $(self).is("[data-search*='"+value+"']");
					});

					if(fullsearchc==searchq.length) {return 1;}

			    }).css('display', 'block');
			}

		});

		$head.find('.fpd-back').click(function() {

			$head.find('.fpd-category-title-search').removeClass('fpd-search-active');

			if($lastCategory.parent('.fpd-category').length == 0) { //display first level categories

				$currentCategory = fpdInstance.$designs;
				$lastCategory = $currentCategory;
				$module.removeClass('fpd-head-visible');

			}
			else { //display parent categories

				$lastCategory = $lastCategory.parent('.fpd-category');
				$currentCategory = $lastCategory.children();

			}

			_displayCategories($currentCategory);

		});

	};

	var _displayCategories = function($categories) {

		$scrollArea.find('.fpd-grid').empty();
		$module.removeClass('fpd-designs-active').addClass('fpd-categories-active');

		$categories.each(function(i, cat) {

			var $cat = $(cat),
				catThumbnail = $cat.data('thumbnail');

			var catObj = {
				title: $cat.attr('title'),
				thumbnail: catThumbnail
			};

			_addDesignCategory(catObj);

		});

		FPDUtil.refreshLazyLoad($designsGrid, false);
		FPDUtil.createScrollbar($scrollArea);

	};

	var _addDesignCategory = function(category) {

		var thumbnailHTML = category.thumbnail ? '<picture data-img="'+category.thumbnail+'"></picture>' : '',
			itemClass = category.thumbnail ? lazyClass : lazyClass+' fpd-title-centered',
			$lastItem = $designsGrid.append('<div class="fpd-category fpd-item '+itemClass+'">'+thumbnailHTML+'<span>'+category.title+'</span></div>')
		.children('.fpd-item:last').click(function(evt) {

			var $this = $(this),
				index = $this.parent().children('.fpd-item').index($this),
				$children = $currentCategory.eq(index).children();

			$lastCategory = $currentCategory.eq(index);

			if($children.filter('.fpd-category').length > 0) {

				$currentCategory = $children;
				_displayCategories($children);

			}
			else {

				_displayDesigns($currentCategory.eq(index));
			}

			$module.addClass('fpd-head-visible');
			$head.find('.fpd-category-title').text($this.children('span').text());

		});

		if(lazyClass === '' && category.thumbnail) {
			FPDUtil.loadGridImage($lastItem.children('picture'), category.thumbnail);
		}

	};

	var _displayDesigns = function($designs) {

		$scrollArea.find('.fpd-grid').empty();
		$module.removeClass('fpd-categories-active').addClass('fpd-designs-active');

		var categoryParameters = {};

		if($designs.hasClass('fpd-category')) {

			categoryParameters = $designs.data('parameters') ? $designs.data('parameters') : {};
			$designs = $designs.children('img');

		}

		$designs.each(function(i, design) {

			var $design = $(design),
				designObj = {
					source: $design.data('src') === undefined ? $design.attr('src') : $design.data('src'),
					title: $design.attr('title'),
					parameters: $.extend({}, categoryParameters, $design.data('parameters')),
					thumbnail: $design.data('thumbnail')
				};

			_addGridDesign(designObj);

		});

		FPDUtil.refreshLazyLoad($designsGrid, false);
		FPDUtil.createScrollbar($scrollArea);
		FPDUtil.updateTooltip();


	};

	//adds a new design to the designs grid
	var _addGridDesign = function(design) {

		design.thumbnail = design.thumbnail === undefined ? design.source : design.thumbnail;

		var $lastItem = $designsGrid.append('<div class="fpd-item '+lazyClass+'" data-source="'+design.source+'" data-search="'+design.title.toLowerCase()+'" data-title="'+design.title+'"><picture data-img="'+design.thumbnail+'"></picture></div>')
		.children('.fpd-item:last').click(function(evt) {

			var $this = $(this),
				designParams = $this.data('parameters'),
				currentImageParameters = fpdInstance.currentViewInstance.options.imageParameters,
				params = $.extend({}, currentImageParameters, designParams);

			if(params.resizeToW || params.resizeToH) {

				var scaling = FPDUtil.getScalingByDimesions(
					$this.children('picture').data('originWidth'),
					$this.children('picture').data('originHeight'),
					params.resizeToW,
					params.resizeToH
				);
				designParams.scaleX = scaling;
				designParams.scaleY = scaling;

			}

			designParams.isCustom = true;

			fpdInstance.addElement('image', $this.data('source'), $this.data('title'), designParams);

		}).data('parameters', design.parameters);

		if(lazyClass === '') {
			FPDUtil.loadGridImage($lastItem.children('picture'), design.thumbnail);
		}

	};

	this.selectCategory = function(index) {

		$categoriesDropdown.children('input').val(fpdInstance.products[index].name);

		var obj = fpdInstance.products[index];
		for(var i=0; i <obj.products.length; ++i) {
			var views = obj.products[i];
			_addGridProduct(views);
		}

	};

	_initialize();

};

var ProductsModule = function(fpdInstance, $module) {

	var instance = this,
		currentCategoryIndex = 0,
		$categoriesDropdown = $module.find('.fpd-product-categories'),
		$scrollArea = $module.find('.fpd-scroll-area'),
		$gridWrapper = $module.find('.fpd-grid'),
		lazyClass = fpdInstance.mainOptions.lazyLoad ? 'fpd-hidden' : '';

	var _initialize = function() {

		if(fpdInstance.products.length === 0) {
			return;
		}

		if(fpdInstance.products.length > 1) { //categories are used
			$module.addClass('fpd-categories-enabled');

			for(var i=0; i < fpdInstance.products.length; ++i) {
				$categoriesDropdown.find('.fpd-dropdown-list').append('<span class="fpd-item" data-value="'+i+'">'+fpdInstance.products[i].name+'</span>');
			}
		}

		var $categoryItems = $categoriesDropdown.find('.fpd-dropdown-list .fpd-item');

		$categoriesDropdown.children('input').keyup(function() {

			$categoryItems.hide();

			if(this.value.length === 0) {
				$categoryItems.show();
			}
			else {
				$categoryItems.filter(':containsCaseInsensitive("'+this.value+'")').show();
			}

		});

		$categoriesDropdown.find('.fpd-dropdown-list .fpd-item').click(function() {

			var $this = $(this);

			currentCategoryIndex = $this.data('value');

			$this.parent().prevAll('.fpd-dropdown-current:first').val($this.text());
			instance.selectCategory(currentCategoryIndex);

			$this.siblings('.fpd-item').show();

			FPDUtil.refreshLazyLoad($scrollArea.find('.fpd-grid'), false);

		});

		instance.selectCategory(currentCategoryIndex);

	};

	//adds a new product to the products grid
	var _addGridProduct = function(views) {

		//load product by click
		var thumbnail = views[0].productThumbnail ? views[0].productThumbnail : views[0].thumbnail,
			productTitle = views[0].productTitle ? views[0].productTitle : views[0].title;

		var $lastItem = $gridWrapper.append('<div class="fpd-item fpd-tooltip '+lazyClass+'" title="'+productTitle+'"><picture data-img="'+thumbnail+'"></picture></div>')
		.children('.fpd-item:last').click(function(evt) {

			var $this = $(this),
				index = $gridWrapper.children('.fpd-item').index($this);

			fpdInstance.selectProduct(index, currentCategoryIndex);

			evt.preventDefault();

		}).data('views', views);


		if(lazyClass === '') {
			FPDUtil.loadGridImage($lastItem.children('picture'), thumbnail);
		}

	};

	this.selectCategory = function(index) {

		$scrollArea.find('.fpd-grid').empty();

		$categoriesDropdown.children('input').val(fpdInstance.products[index].name);

		var obj = fpdInstance.products[index];
		for(var i=0; i <obj.products.length; ++i) {
			var views = obj.products[i];
			_addGridProduct(views);
		}

		FPDUtil.createScrollbar($scrollArea);
		FPDUtil.updateTooltip();

	};

	_initialize();

};

var TextModule = function(fpdInstance, $module) {

	var currentViewOptions;

	var _initialize = function() {

		fpdInstance.$container.on('viewSelect', function(evt, index, viewInstance) {

			currentViewOptions = viewInstance.options;

			if(currentViewOptions.customTextParameters && currentViewOptions.customTextParameters.price) {
				var price = fpdInstance.mainOptions.priceFormat.replace('%d', currentViewOptions.customTextParameters.price);
				$module.find('.fpd-btn > .fpd-price').html(' - '+price);
			}
			else {
				$module.find('.fpd-btn > .fpd-price').html('');
			}

		});

		$module.on('click', '.fpd-btn', function() {

			var $input = $(this).prevAll('textarea:first'),
				text = $input.val();

			if(text && text.length > 0) {

				var textParams = $.extend({}, currentViewOptions.customTextParameters, {isCustom: true});
				fpdInstance.addElement(
					'text',
					text,
					text,
					textParams
				);
			}

			$input.val('');

		});

		$module.on('keyup', 'textarea', function() {

			var text = this.value,
				maxLength = currentViewOptions ? currentViewOptions.customTextParameters.maxLength : 0,
				maxLines = currentViewOptions ? currentViewOptions.customTextParameters.maxLines : 0;

			if(maxLength != 0 && text.length > maxLength) {
				text = text.substr(0, maxLength);
			}

			if(maxLines != 0 && text.split("\n").length > maxLines) {
				text = text.replace(/([\s\S]*)\n/, "$1");
			}

			this.value = text;

		});

	};

	_initialize();

};

var LayersModule = {

	createList : function(fpdInstance, $container) {

		var $currentColorList,
			colorDragging = false;

		$container.off();

		//append a list item to the layers list
		var _appendLayerItem = function(element) {

			var colorHtml = '<span></span>';
			if(FPDUtil.elementHasColorSelection(element)) {

				var availableColors = FPDUtil.elementAvailableColors(element, fpdInstance);

				var currentColor = '';
				if(element.uploadZone) {
					colorHtml = '<span></span>';
				}
				else if(element.type == 'path-group') {
					currentColor = availableColors[0];
					colorHtml = '<span class="fpd-current-color" style="background: '+currentColor+'"></span>';
				}
				else if(availableColors.length > 1) {
					currentColor = element.fill ? element.fill : availableColors[0];
					colorHtml = '<span class="fpd-current-color" style="background: '+currentColor+'" data-colors=""></span>';
				}
				else {
					currentColor = element.fill ? element.fill : availableColors[0];
					colorHtml = '<input class="fpd-current-color" type="text" value="'+currentColor+'" />'
				}

			}

			$container.find('.fpd-list').append('<div class="fpd-list-row" id="'+element.id+'"><div class="fpd-cell-0">'+colorHtml+'</div><div class="fpd-cell-1">'+element.title+'</div><div class="fpd-cell-2"></div></div>');

			var $lastItem = $container.find('.fpd-list-row:last')
				.data('element', element)
				.data('colors', availableColors);

			if(element.uploadZone) {
				$lastItem.addClass('fpd-add-layer')
				.find('.fpd-cell-2').append('<span><span class="fpd-icon-add"></span></span>');
			}
			else {

				var lockIcon = !element.evented ? 'fpd-icon-locked-full' : 'fpd-icon-unlocked',
					reorderHtml = element.zChangeable ? '<span class="fpd-icon-reorder"></span>' : '';

				$lastItem.find('.fpd-cell-2').append(reorderHtml+'<span class="fpd-lock-element"><span class="'+lockIcon+'"></span></span>');

				if(element.removable) {
					$lastItem.find('.fpd-lock-element').after('<span class="fpd-remove-element"><span class="fpd-icon-remove"></span></span>');
				}

				$lastItem.toggleClass('fpd-locked', !element.evented);

			}

		};

		//destroy all color pickers and empty list
		$container.find('.fpd-current-color').spectrum('destroy');
		$container.find('.fpd-list').empty();

		var viewElements = fpdInstance.getElements(fpdInstance.currentViewIndex);
		for(var i=0; i < viewElements.length; ++i) {

			var element = viewElements[i];

			if(element.isEditable) {
				_appendLayerItem(element);
			}

		}

		FPDUtil.createScrollbar($container.find('.fpd-scroll-area'));

		//sortable layers list
		var sortDir = 0;
		$container.find('.fpd-list').sortable({
			handle: '.fpd-icon-reorder',
			placeholder: 'fpd-list-row fpd-sortable-placeholder',
			scroll: false,
			axis: 'y',
			containment: 'parent',
			items: '.fpd-list-row:not(.fpd-locked)',
			start: function(evt, ui) {
				sortDir = ui.originalPosition.top;
			},
			change: function(evt, ui) {

				var targetElement = fpdInstance.getElementByID(ui.item.attr('id')),
					relatedItem;

				if(ui.position.top > sortDir) { //down
					relatedItem = ui.placeholder.prevAll(".fpd-list-row:not(.ui-sortable-helper)").first();
				}
				else { //up
					relatedItem = ui.placeholder.nextAll(".fpd-list-row:not(.ui-sortable-helper)").first();
				}

				var fabricElem = fpdInstance.currentViewInstance.getElementByID(relatedItem.attr('id')),
					index = fpdInstance.currentViewInstance.getZIndex(fabricElem);

				fpdInstance.setElementParameters({z: index}, targetElement);

				sortDir = ui.position.top;

			}
		});

		$container.find('input.fpd-current-color').spectrum('destroy').spectrum({
			flat: false,
			preferredFormat: "hex",
			showInput: true,
			showInitial: true,
			showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
			palette: fpdInstance.mainOptions.colorPickerPalette,
			showButtons: false,
			show: function(color) {
				var element = $(this).parents('.fpd-list-row:first').data('element');
				element._tempFill = color.toHexString();
			},
			move: function(color) {

				var element = $(this).parents('.fpd-list-row:first').data('element');
				//only non-png images are chaning while dragging
				if(colorDragging === false || FPDUtil.elementIsColorizable(element) !== 'png') {
					fpdInstance.currentViewInstance.changeColor(element, color.toHexString());
				}

			},
			change: function(color) {

				$(document).unbind("click.spectrum"); //fix, otherwise change is fired on every click
				var element = $(this).parents('.fpd-list-row:first').data('element');
				fpdInstance.currentViewInstance.setElementParameters({fill: color.toHexString()}, element);

			}
		})
		.on('beforeShow.spectrum', function(e, tinycolor) {
			if($currentColorList) {
				$currentColorList.remove();
				$currentColorList = null;
			}
		})
		.on('dragstart.spectrum', function() {
			colorDragging = true;
		})
		.on('dragstop.spectrum', function(evt, color) {
			colorDragging = false;
			var element = $(this).parents('.fpd-list-row:first').data('element');
			fpdInstance.currentViewInstance.changeColor(element, color.toHexString());
		});

		$container.off('click', '.fpd-current-color') //unregister click, otherwise triggers multi-times when changing view
		.on('click', '.fpd-current-color', function(evt) { //open sub

			evt.stopPropagation();

			$container.find('.fpd-path-colorpicker').spectrum('destroy');
			$container.find('input.fpd-current-color').spectrum('hide');

			var $listItem = $(this).parents('.fpd-list-row'),
				element = $listItem.data('element'),
				availableColors = $listItem.data('colors');

			//clicked on opened sub colors, just close it
			if($currentColorList && $listItem.children('.fpd-scroll-area').length > 0) {
				$currentColorList.slideUp(200, function(){ $(this).remove(); });
				$currentColorList = null;
				return;
			}

			//close another sub colors
			if($currentColorList) {
				$currentColorList.slideUp(200, function(){ $(this).remove(); });
				$currentColorList = null;
			}

			if(availableColors.length > 0) {

				$listItem.append('<div class="fpd-scroll-area"><div class="fpd-color-palette fpd-grid"></div></div>');

				for(var i=0; i < availableColors.length; ++i) {

					var item;
					if(element.type === 'path-group') {

						item = '<input class="fpd-path-colorpicker" type="text" value="'+availableColors[i]+'" />';

					}
					else {

						var tooltipTitle = fpdInstance.mainOptions.hexNames[availableColors[i].replace('#', '')];
						tooltipTitle = tooltipTitle ? tooltipTitle : availableColors[i];

						item = '<div class="fpd-item fpd-tooltip" title="'+tooltipTitle+'" style="background-color: '+availableColors[i]+'" data-color="'+availableColors[i]+'"></div>';

					}

					$listItem.find('.fpd-color-palette').append(item);
				}

				FPDUtil.updateTooltip($listItem);

				if(element.type === 'path-group') {

					$listItem.find('.fpd-path-colorpicker').spectrum({
						showPaletteOnly: $.isArray(element.colors),
						preferredFormat: "hex",
						showInput: true,
						showInitial: true,
						showButtons: false,
						showPalette: fpdInstance.mainOptions.colorPickerPalette && fpdInstance.mainOptions.colorPickerPalette.length > 0,
						palette: $.isArray(element.colors) ? element.colors : fpdInstance.mainOptions.colorPickerPalette,
						show: function(color) {

							var $listItem = $(this).parents('.fpd-list-row'),
								element = $listItem.data('element');

							var svgColors = FPDUtil.changePathColor(
								element,
								$listItem.find('.fpd-path-colorpicker').index(this),
								color
							);

							element._tempFill = svgColors;

						},
						move: function(color) {

							var $listItem = $(this).parents('.fpd-list-row'),
								element = $listItem.data('element');

							var svgColors = FPDUtil.changePathColor(
								element,
								$listItem.find('.fpd-path-colorpicker').index(this),
								color
							);

							fpdInstance.currentViewInstance.changeColor(element, svgColors);

						},
						change: function(color) {

							var $listItem = $(this).parents('.fpd-list-row'),
								element = $listItem.data('element');

							var svgColors = FPDUtil.changePathColor(
								element,
								$listItem.find('.fpd-path-colorpicker').index(this),
								color
							);

							$(document).unbind("click.spectrum"); //fix, otherwise change is fired on every click
							fpdInstance.currentViewInstance.setElementParameters({fill: svgColors}, element);

						}
					});

				}

				$currentColorList = $listItem.children('.fpd-scroll-area').slideDown(300);

			}

		});

		//select color from color palette
		$container.on('click', '.fpd-color-palette .fpd-item', function(evt) {

			evt.stopPropagation();

			var $this = $(this),
				$listItem = $this.parents('.fpd-list-row'),
				element = $listItem.data('element'),
				newColor = $this.data('color');

			$listItem.find('.fpd-current-color').css('background', newColor);
			fpdInstance.currentViewInstance.setElementParameters({fill: newColor}, element);

		});

		//select associated element on stage when choosing one from the layers list
		$container.on('click', '.fpd-list-row', function() {

			if($(this).hasClass('fpd-locked')) {
				return;
			}

			var targetElement = fpdInstance.getElementByID(this.id);
			if(targetElement) {
				targetElement.canvas.setActiveObject(targetElement).renderAll();
			}

		});

		//lock element
		$container.on('click', '.fpd-lock-element',function(evt) {

			evt.stopPropagation();

			var $this = $(this),
				element = $this.parents('.fpd-list-row').data('element');

			if($currentColorList) {
				$currentColorList.slideUp(200, function(){ $(this).remove(); });
				$currentColorList = null;
			}

			element.evented = !element.evented;

			$this.children('span').toggleClass('fpd-icon-unlocked', element.evented)
			.toggleClass('fpd-icon-locked-full', !element.evented);

			$this.parents('.fpd-list-row').toggleClass('fpd-locked', !element.evented);
			$this.parents('.fpd-list:first').sortable( 'refresh' );

		});

		//remove element
		$container.on('click', '.fpd-remove-element',function(evt) {

			evt.stopPropagation();

			var $listItem = $(this).parents('.fpd-list-row');

			fpdInstance.currentViewInstance.removeElement($listItem.data('element'));

		});

	},

};

var ImagesModule = function(fpdInstance, $module) {

	var lazyClass = fpdInstance.mainOptions.lazyLoad ? 'fpd-hidden' : '',
		$imageInput = $module.find('.fpd-input-image'),
		$uploadScrollArea = $module.find('[data-context="upload"] .fpd-scroll-area'),
		$uploadGrid = $uploadScrollArea.find('.fpd-grid'),
		$fbAlbumDropdown = $module.find('.fpd-facebook-albums'),
		$fbScrollArea = $module.find('[data-context="facebook"] .fpd-scroll-area'),
		$fbGrid = $fbScrollArea.find('.fpd-grid'),
		$instaScrollArea = $module.find('[data-context="instagram"] .fpd-scroll-area'),
		$instaGrid = $instaScrollArea.find('.fpd-grid')
		facebookAppId = fpdInstance.mainOptions.facebookAppId,
		instagramClientId = fpdInstance.mainOptions.instagramClientId,
		instagramRedirectUri = fpdInstance.mainOptions.instagramRedirectUri,
		instaAccessToken = null,
		instaLoadingStack = false,
		instaNextStack = null,
		localStorageAvailable = FPDUtil.localStorageAvailable(),
		loadingImageLabel = fpdInstance.getTranslation('misc', 'loading_image'),
		ajaxSettings = fpdInstance.mainOptions.customImageAjaxSettings,
		saveOnServer = ajaxSettings.data && ajaxSettings.data.saveOnServer ? 1 : 0,
		uploadsDir = (ajaxSettings.data && ajaxSettings.data.uploadsDir) ? ajaxSettings.data.uploadsDir : '',
		uploadsDirURL = (ajaxSettings.data && ajaxSettings.data.uploadsDirURL) ? ajaxSettings.data.uploadsDirURL : '';

	var _initialize = function() {

		var $uploadZone = $module.find('.fpd-upload-zone');

		$uploadZone.click(function(evt) {

			evt.preventDefault();
			$imageInput.click();

		})
		.on('dragover dragleave', function(evt) {

			evt.stopPropagation();
			evt.preventDefault();

			$(this).toggleClass('fpd-hover', evt.type === 'dragover');

		});

		var _parseFiles = function(evt) {

			evt.stopPropagation();
			evt.preventDefault();

			if(window.FileReader) {

				var files = evt.target.files || evt.dataTransfer.files,
					addFirstToStage = true;
					fileTypes = ['jpg', 'jpeg', 'png', 'svg'];

				for(var i=0; i < files.length; ++i) {

					var extension = files[i].name.split('.').pop().toLowerCase();

					if(fileTypes.indexOf(extension) > -1) {
						_addUploadedImage(files[i], addFirstToStage);
						addFirstToStage = false;
					}

				}

			}

			$uploadZone.removeClass('fpd-hover');
			$imageInput.val('');

		};

		if($uploadZone.get(0)) {
			$uploadZone.get(0).addEventListener('drop', _parseFiles, false);
		}

		$module.find('.fpd-upload-form').on('change', _parseFiles);


		if(facebookAppId && facebookAppId.length > 5) {

			$module.find('.fpd-module-tabs [data-context="facebook"]').removeClass('fpd-hidden');

			_initFacebook();

		}

		if(instagramClientId && instagramClientId.length > 5) {

			$module.find('.fpd-module-tabs [data-context="instagram"]').removeClass('fpd-hidden');

			$module.find('.fpd-module-tabs [data-context="instagram"]').on('click', function() {

				if($instaGrid.children('.fpd-item').length > 0) {
					return;
				}

				//check if access token is stored in browser
				//window.localStorage.removeItem('fpd_instagram_access_token')
				instaAccessToken = window.localStorage.getItem('fpd_instagram_access_token');

				var endpoint = 'recent';
				if(!localStorageAvailable || instaAccessToken == null) {

					_authenticateInstagram(function() {
						_loadInstaImages(endpoint);
					});

				}
				//load images by requested endpoint
				else {

					_loadInstaImages(endpoint);

				}

			});

			$module.find('.fpd-insta-recent-images, .fpd-insta-liked-images').click(function() {

				var $this = $(this).addClass('fpd-active'),
					endpoint = $this.hasClass('fpd-insta-recent-images') ? 'recent' : 'liked';

				$this.siblings().removeClass('fpd-active');

			});

			$instaScrollArea.on('_sbOnTotalScroll', function() {

				if(instaNextStack !== null && !instaLoadingStack) {

					_loadInstaImages(instaNextStack, false);

				}

			});

		}

		$module.children('.fpd-module-tabs').children('div:not(.fpd-hidden):first').click();

	};

	var _addUploadedImage = function(file, addToStage) {

		//check maximum allowed size
		var maxSizeBytes = fpdInstance.mainOptions.customImageParameters.maxSize * 1024 * 1024;
		if(file.size > maxSizeBytes) {
			FPDUtil.showMessage(fpdInstance.getTranslation('misc', 'maximum_size_info').replace('%filename', file.name).replace('%mb', fpdInstance.mainOptions.customImageParameters.maxSize));
			return;
		}

		//load image with FileReader
		var reader = new FileReader();
    	reader.onload = function (evt) {

			//check image resolution of jpeg
	    	if(file.type === 'image/jpeg') {

		    	var jpeg = new JpegMeta.JpegFile(atob(this.result.replace(/^.*?,/,'')), file.name);

		    	if(jpeg.tiff && jpeg.tiff.XResolution && jpeg.tiff.XResolution.value) {

			    	var xResDen = jpeg.tiff.XResolution.value.den,
			    		xResNum = jpeg.tiff.XResolution.value.num,
			    		realRes = xResNum / xResDen;

					FPDUtil.log(file.name+', Density: '+ xResDen + ' Number: '+ xResNum + ' Real Resolution: '+ realRes, 'info');

					if(realRes < fpdInstance.mainOptions.customImageParameters.minDPI) {
						FPDUtil.showModal(fpdInstance.getTranslation('misc', 'minimum_dpi_info').replace('%dpi', fpdInstance.mainOptions.customImageParameters.minDPI));
						return false;
					}

		    	}
		    	else {
			    	FPDUtil.log(file.name + ': Resolution is not accessible.', 'info');
		    	}

	    	}

	    	var image = this.result,
				$lastItem = $uploadGrid.append('<div class="fpd-item" data-title="'+file.name+'"><picture data-img="'+image+'"></picture></div>')
			.children('.fpd-item:last').data('file', file).click(function(evt) {

				var $this = $(this);

				fpdInstance._loadingCustomImage = true;

				//save custom image on server
				if(saveOnServer) {

					fpdInstance.toggleSpinner(true, loadingImageLabel);

					var formDataAjaxSettings = $.extend({}, ajaxSettings),
						formdata = new FormData();
					formdata.append('uploadsDir', uploadsDir);
					formdata.append('uploadsDirURL', uploadsDirURL);
					formdata.append('images[]', $this.data('file'));

					formDataAjaxSettings.data = formdata;
					formDataAjaxSettings.processData = false;
					formDataAjaxSettings.contentType = false;
					formDataAjaxSettings.success = function(data) {

						if(data && data.error == undefined) {

							fpdInstance.addCustomImage( data.image_src, data.filename );

						}
						else {

							fpdInstance.toggleSpinner(false);
							FPDUtil.showModal(data.error);

						}

					};

					//ajax post
					$.ajax(formDataAjaxSettings)
					.fail(function(evt) {

						fpdInstance.toggleSpinner(false);
						FPDUtil.showModal(evt.statusText);

					});

				}
				//add data uri to canvas
				else {
					fpdInstance.addCustomImage( $this.data('source'), $this.data('title') );
				}

			});

			//check image dimensions
			var checkDimImage = new Image();
			checkDimImage.onload = function() {

				var imageH = this.height,
					imageW = this.width,
					currentCustomImageParameters = fpdInstance.currentViewInstance.options.customImageParameters;

				if(FPDUtil.checkImageDimensions(fpdInstance, imageW, imageH)) {
					$lastItem.data('source', image);
					FPDUtil.loadGridImage($lastItem.children('picture'), this.src);
					FPDUtil.createScrollbar($uploadScrollArea);

					if(addToStage) {
						$lastItem.click();
					}

				}
				else {
					$lastItem.remove();
				}

			};
			checkDimImage.src = image;

		}

		//add file to start loading
		reader.readAsDataURL(file);

	};

	var _initFacebook = function() {

		var $albumItems = $fbAlbumDropdown.find('.fpd-dropdown-list .fpd-item');

		$fbAlbumDropdown.children('input').keyup(function() {

			$albumItems.hide();

			if(this.value.length === 0) {
				$albumItems.show();
			}
			else {
				$albumItems.filter(':containsCaseInsensitive("'+this.value+'")').show();
			}

		});

		$fbAlbumDropdown.on('click', '.fpd-dropdown-list .fpd-item', function() {

			var $this = $(this);

			albumID = $this.data('value');

			$this.parent().prevAll('.fpd-dropdown-current:first').val($this.text());
			$this.siblings('.fpd-item').show();

			_selectAlbum(albumID);

		});

		var _selectAlbum = function(albumID) {

			$fbGrid.empty();
			$fbAlbumDropdown.addClass('fpd-on-loading');

			FB.api('/'+albumID+'?fields=count', function(response) {

				var albumCount = response.count;

				FB.api('/'+albumID+'?fields=photos.limit('+albumCount+').fields(source,images)', function(response) {

					$fbAlbumDropdown.removeClass('fpd-on-loading');

					if(!response.error) {

						var photos = response.photos.data;

						for(var i=0; i < photos.length; ++i) {
							var photo = photos[i],
								photoLargest = photo.images[0] ? photo.images[0].source : photo.source;
								photoThumbnail = photo.images[photo.images.length-1] ? photo.images[photo.images.length-1].source : photo.source;
							var $lastItem = $fbGrid.append('<div class="fpd-item '+lazyClass+'" data-title="'+photo.id+'" data-source="'+photo.source+'"><picture data-img="'+photoLargest+'"></picture></div>')
							.children('.fpd-item:last').click(function(evt) {

								fpdInstance.toggleSpinner(true, loadingImageLabel);

								var $this = $(this);

								fpdInstance._loadingCustomImage = true;

								ajaxSettings.data = {url: $this.data('source'), uploadsDir: uploadsDir, uploadsDirURL: uploadsDirURL, saveOnServer: saveOnServer};
								ajaxSettings.success = function(data) {

									if(data && data.error == undefined) {

										var picture = new Image();
										picture.src = data.image_src;
										picture.onload = function() {

											fpdInstance.addCustomImage( this.src, $this.data('title') );
										};

									}
									else {

										fpdInstance.toggleSpinner(false);
										FPDUtil.showModal(data.error);

									}

								};

								//ajax post
								$.ajax(ajaxSettings)
								.fail(function(evt) {

									fpdInstance.toggleSpinner(false);
									FPDUtil.showModal(evt.statusText);

								});

							});

							if(lazyClass === '') {
								FPDUtil.loadGridImage($lastItem.children('picture'), photoThumbnail);
							}

						}


						FPDUtil.createScrollbar($fbScrollArea);
						FPDUtil.refreshLazyLoad($fbGrid, false);

					}

					fpdInstance.toggleSpinner(false);

				});

			});

		};

		$.ajaxSetup({ cache: true });
		$.getScript('//connect.facebook.com/en_US/sdk.js', function(){

			//init facebook
			FB.init({
				appId: facebookAppId,
				status: true,
				cookie: true,
				xfbml: true,
				version: 'v2.5'
			});

			FB.Event.subscribe('auth.statusChange', function(response) {

				if (response.status === 'connected') {
					// the user is logged in and has authenticated your app

					$module.addClass('fpd-facebook-logged-in');

					FB.api('/me/albums?fields=name,count,id', function(response) {

						var albums = response.data;
						//add all albums to select
						for(var i=0; i < albums.length; ++i) {

							var album = albums[i];
							if(album.count > 0) {
								$fbAlbumDropdown.find('.fpd-dropdown-list').append('<span class="fpd-item" data-value="'+album.id+'">'+album.name+'</span>');
							}

						}

						$albumItems = $fbAlbumDropdown.find('.fpd-dropdown-list .fpd-item');

						$fbAlbumDropdown.removeClass('fpd-on-loading');

					});

				}

			});

		});

	};

	//log into instagram via a popup
	var _authenticateInstagram = function(callback) {

		var popupLeft = (window.screen.width - 700) / 2,
			popupTop = (window.screen.height - 500) / 2;

		var popup = window.open(fpdInstance.mainOptions.templatesDirectory+'/instagram_auth.'+fpdInstance.mainOptions.templatesType, '', 'width=700,height=500,left='+popupLeft+',top='+popupTop+'');
		FPDUtil.popupBlockerAlert(popup, fpdInstance);

		popup.onload = new function() {

			if(window.location.hash.length == 0) {

				popup.open('https://instagram.com/oauth/authorize/?client_id='+instagramClientId+'&redirect_uri='+instagramRedirectUri+'&response_type=token', '_self');

			}

			var interval = setInterval(function() {

				try {
					if(popup.location.hash.length) {

						clearInterval(interval);
						instaAccessToken = popup.location.hash.slice(14);
						if(localStorageAvailable) {
							window.localStorage.setItem('fpd_instagram_access_token', instaAccessToken);
						}
						popup.close();
						if(callback != undefined && typeof callback == 'function') callback();

					}
				}
				catch(evt) {
					//permission denied
				}

			}, 100);
		}

	};

	//load photos from instagram using an endpoint
	var _loadInstaImages = function(endpoint, emptyGrid) {

		emptyGrid = typeof emptyGrid === 'undefined' ? true : emptyGrid;

		instaLoadingStack = true;

		var endpointUrl;

		switch(endpoint) {
			case 'liked':
				endpointUrl = 'https://api.instagram.com/v1/users/self/media/liked?access_token='+instaAccessToken;
			break;
			case 'recent':
				endpointUrl = 'https://api.instagram.com/v1/users/self/media/recent?access_token='+instaAccessToken;
			break;
			default:
				endpointUrl = endpoint;
		}

		if(emptyGrid) {
			$instaGrid.empty();
		}

		$.ajax({
	        method: 'GET',
	        url: endpointUrl,
	        dataType: 'jsonp',
	        jsonp: 'callback',
	        jsonpCallback: 'jsonpcallback',
	        cache: false,
	        success: function(data) {

	        	if(data.data) {

		        	instaNextStack = (data.pagination && data.pagination.next_url) ? data.pagination.next_url : null;

		        	$.each(data.data, function(i, item) {

		        		if(item.type == 'image') {

			        		var imageWidth = String(item.images.standard_resolution.width),
			        			imageHeight = item.images.standard_resolution.height,
			        			//get high-resolution image by replacing /s640x640 in url
			        			regexImageSize = new RegExp('/s'+imageWidth+'x'+imageHeight, 'g'),
			        			image = item.images.standard_resolution.url.replace(regexImageSize,''),
			        			$lastItem = $instaGrid.append('<div class="fpd-item '+lazyClass+'" data-title="'+item.id+'" data-source="'+image+'"><picture data-img="'+image+'"></picture></div>')
			        		.children('.fpd-item:last').click(function(evt) {

								fpdInstance.toggleSpinner(true, loadingImageLabel);

								var $this = $(this);
								fpdInstance._loadingCustomImage = true;

								ajaxSettings.data = {url: $this.data('source'), uploadsDir: uploadsDir, uploadsDirURL: uploadsDirURL, saveOnServer: saveOnServer};
								ajaxSettings.success = function(data) {

									if(data && data.error == undefined) {

										var picture = new Image();
										picture.src = data.image_src;
										picture.onload = function() {

											fpdInstance.addCustomImage( this.src, $this.data('title') );
										};

									}
									else {

										fpdInstance.toggleSpinner(false);
										FPDUtil.showModal(data.error);

									}

								};

								//ajax post
								$.ajax(ajaxSettings)
								.fail(function(evt) {

									fpdInstance.toggleSpinner(false);
									FPDUtil.showModal(evt.statusText);

								});

							});

		        		}

		        		if(lazyClass === '') {
							FPDUtil.loadGridImage($lastItem.children('picture'), image);
						}

		            });

					if(emptyGrid) {
						FPDUtil.createScrollbar($instaScrollArea);
						FPDUtil.refreshLazyLoad($instaGrid, false);
					}



	        	}
	        	else {

		        	window.localStorage.removeItem('fpd_instagram_access_token');
		        	if(data.meta && data.meta.error_message) {
			        	FPDUtil.showModal('<strong>Instagram Error</strong><p>'+data.meta.error_message+'</p>');
		        	}

	        	}

	        	instaLoadingStack = false;

	        },
	        error: function(jqXHR, textStatus, errorThrown) {

		        instaLoadingStack = false;
	            FPDUtil.showModal("Could not load data from instagram. Please try again!");

	        }
	    });

	};

	_initialize();

};

/**
 * The main Fancy Product Designer class. It creates all views and the main UI.
 *
 * @class FancyProductDesigner
 * @constructor
 * @param {HTMLElement | jQuery} elem - A HTML element with an unique ID.
 * @param {Object} [opts] - The default options - {{#crossLink "FancyProductDesignerOptions"}}{{/crossLink}}.
 */
var FancyProductDesigner = function(elem, opts) {

	$ = jQuery;

	var instance = this,
		$window = $(window),
		$body = $('body'),
		$products,
		$elem,
		$mainBar,
		$stageLoader,
		$uiElements,
		$modules,
		$editorBox = null,
		$thumbnailPreview = null,
		nonInitials = [],
		_viewInstances = [];
		stageCleared = false;
		productIsCustomized = false,
		zoomReseted = false,
		initCSSClasses = '',
		anonymFuncs = {};

	/**
	 * Array containing all added products categorized.
	 *
	 * @property products
	 * @type Array
	 */
	this.products = [];
	/**
	 * Array containing all added products uncategorized.
	 *
	 * @property products
	 * @type Array
	 */
	this.plainProducts = [];
	/**
	 * The current selected product category index.
	 *
	 * @property currentCategoryIndex
	 * @type Number
	 * @default 0
	 */
	this.currentCategoryIndex = 0;
	/**
	 * The current selected product index.
	 *
	 * @property currentProductIndex
	 * @type Number
	 * @default 0
	 */
	this.currentProductIndex = 0;
	/**
	 * The current selected view index.
	 *
	 * @property currentViewIndex
	 * @type Number
	 * @default 0
	 */
	this.currentViewIndex = 0;
	/**
	 * The current price.
	 *
	 * @property currentPrice
	 * @type Number
	 * @default 0
	 */
	this.currentPrice = 0;
	/**
	 * The current views.
	 *
	 * @property currentViews
	 * @type Array
	 * @default null
	 */
	this.currentViews = null;
	/**
	 * The current view instance.
	 *
	 * @property currentViewInstance
	 * @type FancyProductDesignerView
	 * @default null
	 */
	this.currentViewInstance = null;
	/**
	 * The current selected element.
	 *
	 * @property currentElement
	 * @type fabric.Object
	 * @default null
	 */
	this.currentElement = null;
	/**
	 * JSON Object containing all translations.
	 *
	 * @property langJson
	 * @type Object
	 * @default null
	 */
	this.langJson = null;
	/**
	 * The main options set for this Product Designer.
	 *
	 * @property mainOptions
	 * @type Object
	 */
	this.mainOptions;
	/**
	 * jQuery object pointing on the product stage.
	 *
	 * @property $productStage
	 * @type jQuery
	 */
	this.$productStage = null;
	/**
	 * jQuery object pointing on the tooltip for the current selected element.
	 *
	 * @property $elementTooltip
	 * @type jQuery
	 */
	this.$elementTooltip = null;
	/**
	 * URL to the watermark image if one is set via options.
	 *
	 * @property watermarkImg
	 * @type String
	 * @default null
	 */
	this.watermarkImg = null;
	/**
	 * Indicates if the product is created or not.
	 *
	 * @property watermarkImg
	 * @type Boolean
	 * @default false
	 */
	this.productCreated = false;
	/**
	 * Indicates if the product was saved.
	 *
	 * @property doUnsavedAlert
	 * @type Boolean
	 * @default false
	 */
	this.doUnsavedAlert = false;
	/**
	 * Array containing all FancyProductDesignerView instances of the current showing product.
	 *
	 * @property viewInstances
	 * @type Array
	 * @default []
	 */
	this.viewInstances = [];
	/**
	 * Object containing all color link groups.
	 *
	 * @property colorLinkGroups
	 * @type Object
	 * @default {}
	 */
	this.colorLinkGroups = {};
	/**
	 * The price for a single product without quantity.
	 *
	 * @property colorLinkGroups
	 * @type Number
	 * @default 0
	 */
	this.singleProductPrice = 0;
	this.languageJSON = {
		"toolbar": {},
		"actions": {},
		"modules": {},
		"misc": {},
		"plus": {}
	};

	this.mainElement = null;
	//PLUS
	/**
	 * The order quantity.
	 *
	 * @property orderQuantity
	 * @type Number
	 * @default 1
	 */
	this.orderQuantity = 1;

	this._order = {};
	this._loadingCustomImage = false;

	var fpdOptions = new FancyProductDesignerOptions(),
		options = fpdOptions.merge(fpdOptions.defaults, opts);

	this.mainOptions = options;

	var _initialize = function() {

		// @@include('../envato/evilDomain.js')

		//create custom jquery expression to ignore case when filtering
		$.expr[":"].containsCaseInsensitive = $.expr.createPseudo(function(arg) {
		    return function( elem ) {
		        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		    };
		});

		//check if element is a jquery object
		if(elem instanceof jQuery) {
			$elem = elem;
		}
		else {
			$elem = $(elem);
		}

		initCSSClasses = $elem.attr('class');
		options.mainBarContainer = options.modalMode !== false ? false : options.mainBarContainer;

		//force sidebar when main bar container is set
		if(options.mainBarContainer) {
			$elem.removeClass('fpd-topbar').addClass('fpd-sidebar');
		}

		instance.$container = $elem.data('instance', instance);

		//save products and designs HTML
		$products = $elem.children('.fpd-category').length > 0 ? $elem.children('.fpd-category').remove() : $elem.children('.fpd-product').remove();
		instance.$designs = $elem.find('.fpd-design > .fpd-category').length > 0 ? $elem.find('.fpd-design > .fpd-category') : $elem.find('.fpd-design > img');
		$elem.children('.fpd-design').remove();

		//add product designer into modal
		if(options.modalMode) {

			$elem.removeClass('fpd-hidden');
			$body.addClass('fpd-modal-mode-active');

			var $modalProductDesigner = $elem.wrap('<div class="fpd-modal-product-designer fpd-modal-overlay fpd-fullscreen"><div class="fpd-modal-wrapper"></div></div>').parents('.fpd-modal-overlay:first'),
				modalProductDesignerOnceOpened = false;

			$modalProductDesigner.children()
			.append('<div class="fpd-done fpd-btn" data-defaulttext="Done">misc.modal_done</div><div class="fpd-modal-close"><span class="fpd-icon-close"></span></div>');

			$(options.modalMode).addClass('fpd-modal-mode-btn').click(function(evt) {

				evt.preventDefault();

				$body.addClass('fpd-overflow-hidden').removeClass('fpd-modal-mode-active');

				$modalProductDesigner.addClass('fpd-fullscreen').fadeIn(300);
				if(instance.currentViewInstance) {
					instance.currentViewInstance.resetCanvasSize();
				}

				var $selectedModule = $mainBar.children('.fpd-navigation').children('.fpd-active');
				if($selectedModule.length > 0) {
					instance.mainBar.callModule($selectedModule.data('module'));
				}

				//auto-select
				var autoSelectElement = null;
				if(!modalProductDesignerOnceOpened && !instance.mainOptions.editorMode && instance.currentViewInstance) {
					var viewElements = instance.currentViewInstance.stage.getObjects();
					for(var i=0; i < viewElements.length; ++i) {
						var obj = viewElements[i];

						 if(obj.autoSelect && !obj.hasUploadZone) {
							 autoSelectElement = obj;

						 }

					}
				}

				setTimeout(function() {

					if(autoSelectElement) {
						instance.currentViewInstance.stage.setActiveObject(autoSelectElement);
						instance.currentViewInstance.stage.renderAll();
					}

				}, 300);

				modalProductDesignerOnceOpened = true;

			});

			$modalProductDesigner.find('.fpd-done').click(function() {

				$modalProductDesigner.find('.fpd-modal-close').click();

			});

		}

		//test if browser is supported (safari, chrome, opera, firefox IE>9)
		var canvasTest = document.createElement('canvas'),
			canvasIsSupported = Boolean(canvasTest.getContext && canvasTest.getContext('2d')),
			minIE = options.templatesDirectory ? 9 : 8;

		if(!canvasIsSupported || (FPDUtil.isIE() && Number(FPDUtil.isIE()) <= minIE)) {

			anonymFuncs.loadCanvasError = function(html) {

				$elem.append($.parseHTML(html)).fadeIn(300);

				/**
			     * Gets fired as soon as a template has been loaded.
			     *
			     * @event FancyProductDesigner#templateLoad
			     * @param {Event} event
			     * @param {string} URL - The URL of the loaded template.
			     */
				$elem.trigger('templateLoad', [this.url]);

			};
			$.get(options.templatesDirectory+'canvaserror.'+options.templatesType, anonymFuncs.loadCanvasError);

			/**
		     * Gets fired when the browser does not support HTML5 canvas.
		     *
		     * @event FancyProductDesigner#canvasFail
		     * @param {Event} event
		     */
			$elem.trigger('canvasFail');

			return false;
		}

		//lowercase all keys in hexNames
		var key,
			keys = Object.keys(options.hexNames),
			n = keys.length,
			newHexNames = {};

		while (n--) {
		  key = keys[n];
		  newHexNames[key.toLowerCase()] = options.hexNames[key];
		}
		options.hexNames = newHexNames;

		//PLUS
		if(typeof FancyProductDesignerPlus !== 'undefined') {
			FancyProductDesignerPlus.setup($elem, instance);
		}


		//load language JSON
		if(options.langJSON !== false) {

			if(typeof options.langJSON === 'object') {

				instance.langJson = options.langJSON;

				$elem.trigger('langJSONLoad', [instance.langJson]);

				_initProductStage();

			}
			else {

				$.getJSON(options.langJSON).done(function(data) {

					instance.langJson = data;

					/**
				     * Gets fired when the language JSON is loaded.
				     *
				     * @event FancyProductDesigner#langJSONLoad
				     * @param {Event} event
				     * @param {Object} langJSON - A JSON containing the translation.
				     */
					$elem.trigger('langJSONLoad', [instance.langJson]);

					_initProductStage();

				})
				.fail(function(data) {

					FPDUtil.showModal('Language JSON "'+options.langJSON+'" could not be loaded or is not valid. Make sure you set the correct URL in the options and the JSON is valid!');

					$elem.trigger('langJSONLoad', [instance.langJson]);
				});

			}


		}
		else {
			_initProductStage();
		}


	}; //init end

	//init the product stage
	var _initProductStage = function() {

		var loaderHTML = '<div class="fpd-loader-wrapper"><div class="fpd-loader"><div class="fpd-loader-circle"></div><span class="fpd-loader-text" data-defaulttext="Initializing Product Designer">misc.initializing</span></div></div>',
			tooltipHtml = '<div class="fpd-element-tooltip" style="display: none;">misc.out_of_bounding_box</div>';

		//add init loader
		instance.$mainWrapper = $elem.addClass('fpd-container fpd-clearfix fpd-grid-columns-'+options.gridColumns).html(loaderHTML+'<div class="fpd-main-wrapper">'+tooltipHtml+'<div class="fpd-snap-line-h"></div><div class="fpd-snap-line-v"></div><div class="fpd-product-stage" style="width:'+options.stageWidth+'px;height: '+options.stageHeight+'px;"></div></div>').children('.fpd-main-wrapper');

		$elem.after('<div class="fpd-device-info">'+instance.getTranslation('misc', 'not_supported_device_info')+'</div>');


		instance.$productStage  = instance.$mainWrapper.children('.fpd-product-stage')
		instance.$elementTooltip = instance.$mainWrapper.children('.fpd-element-tooltip');
		$stageLoader = $elem.children('.fpd-loader-wrapper');

		_translateElement($stageLoader.find('.fpd-loader-text'));
		_translateElement(instance.$elementTooltip);
		if(options.modalMode) {
			_translateElement($body.find('.fpd-modal-overlay .fpd-done'));
		}

		//load editor box if requested
		if(typeof options.editorMode === 'string') {

			$editorBox = $('<div class="fpd-editor-box"><h5></h5><div class="fpd-clearfix"></div></div>');
			$(options.editorMode).append($editorBox);

		}

		//window resize handler
		var device = 'desktop';
		$window.resize(function() {

			if(instance.currentElement && instance.currentElement.isEditing) {
				return;
			}

			if(instance.actions) {
				instance.actions.hideAllTooltips();
				if(!zoomReseted) {
					instance.resetZoom();
				}
			}

			//deselect element if one is selected and active element is not input (FB browser fix)
			if(instance.currentElement && $(document.activeElement).is(':not(input)')) {
				instance.deselectElement();
			}

			if($window.width() < 568 && !instance.$container.hasClass('fpd-topbar')) {
				instance.$container.removeClass('fpd-sidebar').addClass('fpd-topbar');
				if(instance.mainBar && !options.mainBarContainer) {
					instance.mainBar.setContentWrapper('draggable-dialog');
				}

				device = 'smartphone';
			}
			else if(device === 'smartphone' && $window.width() > 568 && initCSSClasses.search('fpd-topbar') === -1 && instance.$container.hasClass('fpd-topbar')) {
				instance.$container.removeClass('fpd-topbar').addClass('fpd-sidebar');
				if(instance.mainBar && !options.mainBarContainer) {
					instance.mainBar.setContentWrapper('sidebar');
				}

				device = 'monitor';
			}

			if(instance.currentViewInstance) {
				instance.currentViewInstance.resetCanvasSize();
			}

			if(instance.$container.filter('[class*="fpd-off-canvas-"]').length > 0) {
				instance.mainBar.$content.height(instance.$mainWrapper.height());
			}



		});

		//check if categories are used
		if($products.is('.fpd-category') && $products.filter('.fpd-category').length > 1) {

			//loop through all categories
			$products.each(function(i, cat) {
				var $cat = $(cat);
				_createProductsFromHTML($cat.children('.fpd-product'), $cat.attr('title'));
			});

		}
		else {

			//no categories are used
			$products = $products.filter('.fpd-category').length === 0 ? $products : $products.children('.fpd-product');
			_createProductsFromHTML($products, false);

		}

		options.templatesDirectory ? _loadUIElements() : _ready();

	};

	//now load UI elements from external HTML file
	var _loadUIElements = function() {

		_checkProductsLength();

		anonymFuncs.loadProductDesignerTemplate = function(html) {

			/**
		     * Gets fired as soon as a template has been loaded.
		     *
		     * @event FancyProductDesigner#templateLoad
		     * @param {Event} event
		     * @param {string} URL - The URL of the loaded template.
		     */
			$elem.trigger('templateLoad', [this.url]);

			$uiElements = $(html);

			$uiElements.find('[data-defaulttext]').each(function(index, uiElement) {

				_translateElement($(uiElement));

			});

			if(options.mainBarContainer) {

				$elem.addClass('fpd-main-bar-container-enabled');
				$mainBar = $(options.mainBarContainer).addClass('fpd-container fpd-main-bar-container fpd-tabs fpd-tabs-top fpd-sidebar fpd-grid-columns-'+options.gridColumns).html($uiElements.children('.fpd-mainbar')).children('.fpd-mainbar');

			}
			else {
				$mainBar = $elem.prepend($uiElements.children('.fpd-mainbar')).children('.fpd-mainbar');
			}

			$modules = $uiElements.children('.fpd-modules');

			if($elem.hasClass('fpd-sidebar')) {
				$elem.height(options.stageHeight);
			}
			else {
				$elem.width(options.stageWidth);
			}

			//show tabs content
			$body.on('click', '.fpd-module-tabs > div', function() {

				var $this = $(this),
					context = $(this).data('context');

				$this.addClass('fpd-active').siblings().removeClass('fpd-active');
				$this.parent().next('.fpd-module-tabs-content').children().hide().filter('[data-context="'+context+'"]').show();

			});

			//add modules
			if(options.mainBarModules) {

				instance.mainBar = new FPDMainBar(
					instance,
					$mainBar,
					$modules,
					$uiElements.children('.fpd-draggable-dialog')
				);

			}

			//init Actions
			if(options.actions) {

				instance.actions = new FPDActions(instance, $uiElements.children('.fpd-actions'));

			}

			//init Toolbar
			instance.toolbar = new FPDToolbar($uiElements.children('.fpd-element-toolbar'), instance);

			$elem.on('elementSelect', function(evt, element) {

				if(element && instance.currentViewInstance) {

					//upload zone is selected
					if(element.uploadZone && !instance.mainOptions.editorMode) {

						element.set('borderColor', 'transparent');

						var customAdds = $.extend({}, instance.currentViewInstance.options.customAdds, element.customAdds ? element.customAdds : {});

						instance.mainBar.toggleUploadZoneAdds(customAdds);
						instance.mainBar.toggleUploadZonePanel();
						instance.currentViewInstance.currentUploadZone = element.title;

						return;
					}
					//if element has no upload zone and an upload zone is selected, close dialogs and call first module
					else if(instance.currentViewInstance.currentUploadZone) {

						instance.mainBar.toggleDialog(false);
						instance.mainBar.toggleUploadZonePanel(false);

					}

					instance.toolbar.update(element);
					_updateEditorBox(element);

				}
				else {

					instance.toolbar.toggle(false);
					$body.children('.fpd-element-toolbar').find('input').spectrum('destroy');

				}

			})
			.on('elementChange', function(evt, type, element) {

				instance.toolbar.toggle(false);

			})
			.on('elementModify', function(evt, element, parameters) {

				if(instance.productCreated && !instance.toolbar.isTransforming) {

					if(parameters.fontSize !== undefined) {
						instance.toolbar.updateUIValue('fontSize', Number(parameters.fontSize));
					}
					if(parameters.scaleX !== undefined) {
						instance.toolbar.updateUIValue('scaleX', parseFloat(Number(parameters.scaleX).toFixed(2)));
					}
					if(parameters.scaleY !== undefined) {
						instance.toolbar.updateUIValue('scaleY', parseFloat(Number(parameters.scaleY).toFixed(2)));
					}
					if(parameters.angle !== undefined) {
						instance.toolbar.updateUIValue('angle', parseInt(parameters.angle));
					}
					if(parameters.text !== undefined) {
						instance.toolbar.updateUIValue('text', parameters.text);
					}

					if(instance.currentElement && !instance.currentElement.uploadZone) {
						instance.toolbar.updatePosition(instance.currentElement);
					}

				}

			});

			//switchers
			$('.fpd-switch-container').click(function() {

				var $this = $(this);

				if($this.hasClass('fpd-curved-text-switcher')) {

					var z = instance.currentViewInstance.getZIndex(instance.currentElement),
						defaultText = instance.currentElement.getText(),
						parameters = instance.currentViewInstance.getElementJSON(instance.currentElement);

					parameters.z = z;
					parameters.curved = instance.currentElement.type == 'i-text';
					parameters.textAlign = 'center';

					function _onTextModeChanged(evt, textElement) {
						instance.currentViewInstance.stage.setActiveObject(textElement);
						$elem.off('elementAdd', _onTextModeChanged);

						setTimeout(function() {
							$('.fpd-tool-curved-text').click();
						}, 100);

					};
					$elem.on('elementAdd', _onTextModeChanged);

					instance.currentViewInstance.removeElement(instance.currentElement);
					instance.currentViewInstance.addElement('text', defaultText, defaultText, parameters);

				}
			});

			$('.fpd-dropdown').click(function() {

				$(this).toggleClass('fpd-active');

			});

			_ready();

		};

		$.get(options.templatesDirectory+'productdesigner.'+options.templatesType, anonymFuncs.loadProductDesignerTemplate);

	};

	var _ready = function() {

		if(instance.mainOptions.fonts && instance.mainOptions.fonts.length > 0 && typeof instance.mainOptions.fonts[0] === 'object') {

			var googleFonts = [];

			var $customFontsStyle = $('<style type="text/css" id="fpd-custom-fonts"></style>');
			instance.$container.before($customFontsStyle);

			instance.mainOptions.fonts.forEach(function(fontItem) {

				if(fontItem.hasOwnProperty('url')) {

					if(fontItem.url == 'google') { //from google fonts
						googleFonts.push(fontItem.name);
					}
					else { //custom fonts

						var fontFormat = fontItem.url.search('.woff') !== -1 ? 'woff' : 'TrueType';

						$customFontsStyle.append('@font-face {font-family:"'+fontItem.name+'"; src:url("'+fontItem.url+'") format("'+fontFormat+'");}');

					}

				}

			});

			if(googleFonts.length > 0) {

				WebFont.load({
					google: {
				    	families: googleFonts
				    }
				});

			}

		}

		//load watermark image
		if(instance.mainOptions.watermark && instance.mainOptions.watermark.length > 3) {

			fabric.Image.fromURL(instance.mainOptions.watermark, function(oImg) {
				instance.watermarkImg = oImg;
			});

		}

		if(instance.mainOptions.unsavedProductAlert) {

			window.onbeforeunload = function () {

				if(instance.doUnsavedAlert) {
					return '';
				}

			};

		}

		//store a boolean to detect if the text in textarea (toolbar) was selected, then dont deselect
		var _fixSelectionTextarea = false;

		//general close handler for modal
		$body.on('click', '.fpd-modal-close', function(evt) {

			var $this = $(this);

			if($this.parents('.fpd-modal-product-designer').length) {
				$body.addClass('fpd-modal-mode-active');
			}

			$this.parents('.fpd-modal-overlay').fadeOut(200, function() {
				$this.removeClass('fpd-fullscreen');
			});

			$body.removeClass('fpd-overflow-hidden');

			//modal product designer is closing
			if($this.parents('.fpd-modal-product-designer:first').length > 0) {
				instance.deselectElement();
			}

		})
		.on('mouseup touchend', function(evt) {

			var $target = $(evt.target);

			//deselect element if click outside of a fpd-container
			if($target.closest('.fpd-container, .fpd-element-toolbar, .sp-container').length === 0 &&
			   instance.mainOptions.deselectActiveOnOutside && !_fixSelectionTextarea) {
				   instance.deselectElement();
			}

			//close upload zone panel if click outside of fpd-container, needed otherwise elements can be added to upload zone e.g. mspc
			if($target.closest('.fpd-container').length === 0 && instance.currentViewInstance && instance.currentViewInstance.currentUploadZone && $stageLoader.is(':hidden')) {
				instance.mainBar.toggleUploadZonePanel(false);
			}

			_fixSelectionTextarea = false;

		})
		//thumbnail preview effect
		.on('mouseover mouseout mousemove', '[data-module="designs"] .fpd-item, [data-module="images"] .fpd-item', function(evt) {

			var $this = $(this),
				price = null;

			if(instance.currentViewInstance && instance.currentViewInstance.currentUploadZone && $(evt.target).parents('.fpd-upload-zone-adds-panel').length > 0) {
				var uploadZone = instance.currentViewInstance.getUploadZone(instance.currentViewInstance.currentUploadZone);
				if(uploadZone && uploadZone.price) {
					price = uploadZone.price;
				}
			}

			if(evt.type === 'mouseover' && $this.data('source')) {

				$thumbnailPreview = $('<div class="fpd-thumbnail-preview")"><picture></picture></div>');
				FPDUtil.loadGridImage($thumbnailPreview.children('picture'), $this.data('source'));

				//thumbnails in images module
				if($this.parents('[data-module="images"]:first').length > 0 && price === null) {

					if(instance.currentViewInstance && instance.currentViewInstance.options.customImageParameters.price) {
						price = instance.currentViewInstance.options.customImageParameters.price;
					}

				}
				//thumbnails in designs module
				else {

					if($this.data('title')) {
						$thumbnailPreview.addClass('fpd-title-enabled');
						$thumbnailPreview.append('<div class="fpd-preview-title">'+$this.data('title')+'</div>');
					}

					if($this.data('parameters') && $this.data('parameters').price && price === null) {
						price = $this.data('parameters').price;
					}

				}

				if(price) {
					var priceFormatted = instance.mainOptions.priceFormat.replace('%d', price);
					$thumbnailPreview.append('<div class="fpd-preview-price">'+priceFormatted+'</div>');
				}

				$body.append($thumbnailPreview);

			}
			else if($thumbnailPreview !== null && evt.type === 'mousemove') {

				var leftPos = evt.pageX + 10 + $thumbnailPreview.outerWidth() > $window.width() ? $window.width() - $thumbnailPreview.outerWidth() : evt.pageX + 10;
				$thumbnailPreview.css({left: leftPos, top: evt.pageY + 10})

			}
			else if($thumbnailPreview !== null && evt.type === 'mouseout') {

				$thumbnailPreview.siblings('.fpd-thumbnail-preview').remove();
				$thumbnailPreview.remove();

			}

		}).
		on('mousedown', function(evt) {

			var $target = $(evt.target);

			_fixSelectionTextarea = $target.is('textarea') && $target.data('control') ? true : false;

		});

		//load first product
		if(instance.mainOptions.loadFirstProductInStage && instance.products.length > 0 && !stageCleared) {
			instance.selectProduct(0);
		}
		else {
			instance.toggleSpinner(false);
		}

		/**
	     * Gets fired as soon as the product designer is ready to receive API calls.
	     *
	     * @event FancyProductDesigner#ready
	     * @param {Event} event
	     */
		$elem.trigger('ready');
		$window.resize();

	};

	//creates all products from HTML markup
	var _createProductsFromHTML = function($products, category) {

		var views = [];
		for(var i=0; i < $products.length; ++i) {

			//get other views
			views = $($products.get(i)).children('.fpd-product');
			//get first view
			views.splice(0,0,$products.get(i));

			var viewsArr = [];
			views.each(function(j, view) {

				var $view = $(view);
				var viewObj = {
					title: view.title,
					thumbnail: $view.data('thumbnail'),
					elements: [],
					options: $view.data('options') === undefined && typeof $view.data('options') !== 'object' ? options : fpdOptions.merge(options, $view.data('options'))
				};

				if(j === 0) {

					//get product thumbnail from first view
					if($view.data('producttitle')) {
						viewObj.productTitle = $view.data('producttitle');
					}

					//get product thumbnail from first view
					if($view.data('productthumbnail')) {
						viewObj.productThumbnail = $view.data('productthumbnail');
					}

					//PLUS: Store main element of the product
					viewObj.mainElement = $view.data('mainelement') ? $view.data('mainelement') : null;

				}

				$view.children('img,span').each(function(k, element) {

					var $element = $(element),
						source;

					if($element.is('img')) {
						source = $element.data('src') == undefined ? $element.attr('src') : $element.data('src');
					}
					else {
						source = $element.text()
					}

					var elementObj = {
						type: $element.is('img') ? 'image' : 'text', //type
						source: source, //source
						title: $element.attr('title'),  //title
						parameters: $element.data('parameters') == undefined || $element.data('parameters').length <= 2 ? {} : $element.data('parameters')  //parameters
					};

					viewObj.elements.push(elementObj);

				});

				viewsArr.push(viewObj);

			});

			instance.addProduct(viewsArr, category);

		}

	};

	var _snapToGrid = function(element) {

		if($('[data-action="snap"]').hasClass('fpd-active')) {

			var gridX = instance.mainOptions.snapGridSize[0] ? instance.mainOptions.snapGridSize[0] : 50,
				gridY = instance.mainOptions.snapGridSize[1] ? instance.mainOptions.snapGridSize[1] : 50,
				currentPosPoint = element.getPointByOrigin('left', 'top');
				point = new fabric.Point(element.padding + (Math.round(currentPosPoint.x / gridX) * gridX), element.padding + (Math.round(currentPosPoint.y / gridY) * gridY));

				element.setPositionByOrigin(point, 'left', 'top');

		}

	};

	//snap element to center
	var _snapToCenter = function(element) {

		if($('[data-action="snap"]').hasClass('fpd-active')) {

			var edgeDetectionX = instance.mainOptions.snapGridSize[0] ? instance.mainOptions.snapGridSize[0] : 50,
				edgeDetectionY = instance.mainOptions.snapGridSize[1] ? instance.mainOptions.snapGridSize[1] : 50,
				elementCenter = element.getCenterPoint(),
				stageCenter = {x: instance.currentViewInstance.options.stageWidth * .5, y: instance.currentViewInstance.options.stageHeight * .5};

			if(Math.abs(elementCenter.x - stageCenter.x) < edgeDetectionX) {

				element.setPositionByOrigin(new fabric.Point(stageCenter.x, elementCenter.y), 'center', 'center');
		       	instance.$mainWrapper.children('.fpd-snap-line-v').css('left', '50%' ).show();

		    }
		    else {
			     instance.$mainWrapper.children('.fpd-snap-line-v').hide();
		    }
		    if (Math.abs(elementCenter.y - stageCenter.y) < edgeDetectionY) {

			    elementCenter = element.getCenterPoint();
				element.setPositionByOrigin(new fabric.Point(elementCenter.x, stageCenter.y), 'center', 'center');
		        instance.$mainWrapper.children('.fpd-snap-line-h').css('top', '50%' ).show();

		    }
		    else {
			    instance.$mainWrapper.children('.fpd-snap-line-h').hide();
		    }

		}

	};

	//get category index by category name
	var _getCategoryIndexInTemplates = function(catName) {

		for(var i=0; i < instance.products.length; ++i) {

			if(instance.products[i].name === catName) {
				return i;
				break;
			}

		}

		return false;

	};

	//translates a HTML element
	var _translateElement = function($tag) {

		if(instance.langJson) {

			var objString = '';

			if($tag.attr('placeholder') !== undefined) {
				objString = $tag.attr('placeholder');
			}
			else if($tag.attr('title') !== undefined) {
				objString = $tag.attr('title');
			}
			else if($tag.data('title') !== undefined) {
				objString = $tag.data('title');
			}
			else {
				objString = $tag.text();
			}

			var keys = objString.split('.'),
				firstObject = instance.langJson[keys[0]],
				label = '';

			if(firstObject) { //check if object exists

				label = firstObject[keys[1]];

				if(label === undefined) { //if label does not exist in JSON, take default text
					label = $tag.data('defaulttext');
				}

			}
			else {
				label = $tag.data('defaulttext');
			}

			//store all translatable labels in json
			var sectionObj = instance.languageJSON[keys[0]];
			sectionObj[keys[1]] = label;

		}
		else {
			label = $tag.data('defaulttext');
		}

		if($tag.attr('placeholder') !== undefined) {
			$tag.attr('placeholder', label).text('');
		}
		else if($tag.attr('title') !== undefined) {
			$tag.attr('title', label);
		}
		else if($tag.data('title') !== undefined) {
			$tag.data('title', label);
		}
		else {
			$tag.text(label);
		}

	};

	var _toggleUndoRedoBtn = function(undos, redos) {

		if(undos.length === 0) {
		  	instance.$mainWrapper.find('[data-action="undo"]').addClass('fpd-disabled');
  		}
  		else {
	  		instance.$mainWrapper.find('[data-action="undo"]').removeClass('fpd-disabled');
  		}

  		if(redos.length === 0) {
	  		instance.$mainWrapper.find('[data-action="redo"]').addClass('fpd-disabled');
  		}
  		else {
	  		instance.$mainWrapper.find('[data-action="redo"]').removeClass('fpd-disabled');
  		}

	};

	var _updateEditorBox = function(element) {

		if($editorBox === null) {
			return;
		}

		$editorBox.children('div').empty();
		$editorBox.children('h5').text(element.title);

		for(var i=0; i < instance.mainOptions.editorBoxParameters.length; ++i) {

			var parameter = instance.mainOptions.editorBoxParameters[i],
				value = element[parameter];

			if(value !== undefined) {

				value = typeof value === 'number' ? value.toFixed(2) : value;
				value = (typeof value === 'object' && value.source) ? value.source.src : value;
				if(parameter === 'fill' && element.type === 'path-group') {
					value = element.svgFill;
				}

				$editorBox.children('div').append('<p><i>'+parameter+'</i>: <input type="text" value="'+value+'" readonly /></p>');

			}

		}

	};

	var _checkProductsLength = function() {

		if(instance.mainOptions.editorMode) { return; }

		if(instance.plainProducts.length === 0 || instance.plainProducts.length === 1) {
			instance.$container.addClass('fpd-products-module-hidden');
		}
		else {
			instance.$container.removeClass('fpd-products-module-hidden');
		}

	};

	var _onViewCreated = function() {

		//add all views of product till views end is reached
		if(instance.viewInstances.length < instance.currentViews.length) {
			instance.addView(instance.currentViews[instance.viewInstances.length]);

		}
		//all views added
		else {

			$elem.off('viewCreate', _onViewCreated);

			instance.toggleSpinner(false);
			instance.selectView(0);

			//search for object with auto-select
			if(!instance.mainOptions.editorMode && instance.currentViewInstance && $(instance.currentViewInstance.stage.getElement()).is(':visible')) {
				var viewElements = instance.currentViewInstance.stage.getObjects(),
					selectElement = null;

				for(var i=0; i < viewElements.length; ++i) {
					var obj = viewElements[i];

					 if(obj.autoSelect && !obj.hasUploadZone) {
					 	selectElement = obj;
					 }

				}
			}

			if(selectElement && instance.currentViewInstance) {
				setTimeout(function() {

					instance.currentViewInstance.stage.setActiveObject(selectElement);
					selectElement.setCoords();
					instance.currentViewInstance.stage.renderAll();

				}, 10);
			}


			instance.productCreated = true;

			/**
		     * Gets fired as soon as a product has been fully added to the designer.
		     *
		     * @event FancyProductDesigner#productCreate
		     * @param {Event} event
		     * @param {array} currentViews - An array containing all views of the product.
		     */
			$elem.trigger('productCreate', [instance.currentViews]);

		}

	};

	/**
	 * Adds a new product to the product designer.
	 *
	 * @method addProduct
	 * @param {array} views An array containing the views for a product. A view is an object with a title, thumbnail and elements property. The elements property is an array containing one or more objects with source, title, parameters and type.
	 * @param {string} [category] If categories are used, you need to define the category title.
	 */
	this.addProduct = function(views, category) {

		var catIndex = _getCategoryIndexInTemplates(category);

		if(catIndex === false) {

			catIndex = instance.products.length;
			instance.products[catIndex] = {name: category, products: []};
			instance.products[catIndex].products.push(views);

		}
		else {

			instance.products[catIndex].products.push(views);

		}

		this.plainProducts.push(views);

		_checkProductsLength();

	};

	/**
	 * Selects a product by index and category index.
	 *
	 * @method selectProduct
	 * @param {number} index The requested product by an index value. 0 will load the first product.
	 * @param {number} categoryIndex The requested category by an index value. 0 will load the first category.
	 * @example fpd.selectProduct( 1, 2 ); //will load the second product from the third category
	 */
	this.selectProduct = function(index, categoryIndex) {

		instance.currentCategoryIndex = typeof categoryIndex === 'undefined' ? instance.currentCategoryIndex : categoryIndex;

		var category = instance.products[instance.currentCategoryIndex];

		instance.currentProductIndex = index;
		if(index < 0) { currentProductIndex = 0; }
		else if(index > category.products.length-1) { instance.currentProductIndex = category.products.length-1; }

		var product = category.products[instance.currentProductIndex];

		/**
		 * Gets fired when a product is selected.
		 *
		 * @event FancyProductDesigner#productSelect
		 * @param {Event} event
		 * @param {Number} index - The index of the product in the category.
		 * @param {Number} categoryIndex - The index of the category.
		 * @param {Object} product - An object containing the product (views).
		 */
		$elem.trigger('productSelect', [index, categoryIndex, product]);

		instance.loadProduct(product, options.replaceInitialElements);

	};

	/**
	 * Loads a new product to the product designer.
	 *
	 * @method loadProduct
	 * @param {array} views An array containing the views for the product.
	 * @param {Boolean} [onlyReplaceInitialElements=false] If true, the initial elements will be replaced. Custom added elements will stay on the canvas.
	 */
	this.loadProduct = function(views, replaceInitialElements) {

		replaceInitialElements = typeof replaceInitialElements !== 'undefined' ? replaceInitialElements : false;

		if($stageLoader.is(':hidden')) {
			instance.toggleSpinner(true);
		}

		//reset when loading a product
		instance.productCreated = productIsCustomized = false;
		instance.colorLinkGroups = {};

		if(replaceInitialElements) {

			nonInitials = [];
			nonInitials = instance.getCustomElements();

		}
		else {
			instance.doUnsavedAlert = false;
		}

		instance.clear();
		instance.currentViews = views;

		var viewSelectionHtml = '<div class="fpd-views-selection fpd-grid-contain fpd-clearfix"></div>';

		if($elem.hasClass('fpd-views-outside')) {
			instance.$viewSelectionWrapper = $elem.after(viewSelectionHtml).nextAll('.fpd-views-selection:first');
		}
		else {
			instance.$viewSelectionWrapper = instance.$mainWrapper.append(viewSelectionHtml).children('.fpd-views-selection:first');
		}

		$elem.on('viewCreate', _onViewCreated);

		if(instance.currentViews) {
			instance.addView(instance.currentViews[0]);
		}

	};

	/**
	 * Adds a view to the current visible product.
	 *
	 * @method addView
	 * @param {object} view An object with title, thumbnail and elements properties.
	 */
	this.addView = function(view) {

		instance.$viewSelectionWrapper.append('<div class="fpd-shadow-1 fpd-item fpd-tooltip" title="'+view.title+'"><picture style="background-image: url('+view.thumbnail+');"></picture></div>')
		.children('div:last').click(function(evt) {

			instance.selectView(instance.$viewSelectionWrapper.children('div').index($(this)));

		});

		view.options = $.extend({}, instance.mainOptions, view.options);
		var viewInstance = new FancyProductDesignerView(instance.$productStage, view, function(viewInstance) {

			//remove view instance if not added to product container
			if($(viewInstance.stage.wrapperEl).parent().length === 0) {
				viewInstance.clear();
				return;
			}

			if(instance.viewInstances.length == 0) {
				viewInstance.resetCanvasSize();
			}

			if(nonInitials.length > 0) {

				for(var i=0; i < nonInitials.length; ++i) {
					var object = nonInitials[i];
					if(object.viewIndex === instance.viewInstances.length) {

						var fpdElement = object.element;
						viewInstance.addElement(
							FPDUtil.getType(fpdElement.type),
							fpdElement.source,
							fpdElement.title,
							viewInstance.getElementJSON(fpdElement)
						);

					}

				}

			}

			instance.viewInstances.push(viewInstance);
			/**
			 * Gets fired when a view is created.
			 *
			 * @event FancyProductDesigner#viewCreate
			 * @param {Event} event
			 * @param {FancyProductDesignerView} viewInstance
			 */
			$elem.trigger('viewCreate', [viewInstance]);

		}, instance.mainOptions.fabricCanvasOptions);

		viewInstance.stage.on({

			'object:moving': function(opts) {

				var element = opts.target;

				if(!element.lockMovementX || !element.lockMovementY) {
					_snapToGrid(element);
					_snapToCenter(element);
				}

			}

		});

		_viewInstances.push(viewInstance);

		$(viewInstance)
		.on('elementAdd', function(evt, element) {

			if(!element) {
				return;
			}

			//check if element has a color linking group
			if(element.colorLinkGroup && element.colorLinkGroup.length > 0) {

				var viewIndex = this.getIndex();

				if(instance.colorLinkGroups.hasOwnProperty(element.colorLinkGroup)) { //check if color link object exists for the link group

					//add new element with id and view index of it
					instance.colorLinkGroups[element.colorLinkGroup].elements.push({id: element.id, viewIndex: viewIndex});

					if(typeof element.colors === 'object') {

						//concat colors
						var concatArray = instance.colorLinkGroups[element.colorLinkGroup].colors.concat(element.colors);
						//remove duplicate colors
						instance.colorLinkGroups[element.colorLinkGroup].colors = FPDUtil.arrayUnique(concatArray);

					}

				}
				else {

					//create initial color link object
					instance.colorLinkGroups[element.colorLinkGroup] = {elements: [{id:element.id, viewIndex: viewIndex}], colors: []};

					if(typeof element.colors === 'object') {

						instance.colorLinkGroups[element.colorLinkGroup].colors = element.colors;

					}

				}

			}

			//close dialog and off-canvas on element add
			if(instance.productCreated && instance.mainOptions.hideDialogOnAdd && instance.$container.hasClass('fpd-topbar') && instance.mainBar) {

				instance.mainBar.toggleDialog(false);

			}

			/**
			 * Gets fired when an element is added.
			 *
			 * @event FancyProductDesigner#elementAdd
			 * @param {Event} event
			 * @param {fabric.Object} element
			 */
			$elem.trigger('elementAdd', [element]);

		})
		.on('boundingBoxToggle', function(evt, currentBoundingObject, addRemove) {

			/**
		     * Gets fired as soon as the bounding box is added to or removed from the stage.
		     *
		     * @event FancyProductDesigner#boundingBoxToggle
		     * @param {Event} event
		     * @param {fabric.Object} currentBoundingObject - A fabricJS rectangle representing the bounding box.
		     * @param {Boolean} addRemove - True=added, false=removed.
		     */
			$elem.trigger('boundingBoxToggle', [currentBoundingObject, addRemove]);

		})
		.on('elementSelect', function(evt, element) {

			instance.currentElement = element;

			if(element) {

			}
			else {

				if(instance.$elementTooltip) {
					instance.$elementTooltip.hide();
				}

				instance.$mainWrapper.children('.fpd-snap-line-h, .fpd-snap-line-v').hide();

			}
			/**
			 * Gets fired when an element is selected.
			 *
			 * @event FancyProductDesigner#elementSelect
			 * @param {Event} event
			 * @param {fabric.Object} element
			 */
			$elem.trigger('elementSelect', [element]);

		})
		.on('elementChange', function(evt, type, element) {

			_updateEditorBox(element.getBoundingRect());
			/**
			 * Gets fired when an element is changed.
			 *
			 * @event FancyProductDesigner#elementChange
			 * @param {Event} event
			 * @param {fabric.Object} element
			 */
			$elem.trigger('elementChange', [type, element]);

		})
		.on('elementModify', function(evt, element, parameters) {

			/**
			 * Gets fired when an element is modified.
			 *
			 * @event FancyProductDesigner#elementModify
			 * @param {Event} event
			 * @param {fabric.Object} element
			 * @param {Object} parameters
			 */
			$elem.trigger('elementModify', [element, parameters]);

		})
		.on('undoRedoSet', function(evt, undos, redos) {

			instance.doUnsavedAlert = productIsCustomized = true;
			_toggleUndoRedoBtn(undos, redos);

			/**
			 * Gets fired when an undo or redo state is set.
			 *
			 * @event FancyProductDesigner#undoRedoSet
			 * @param {Event} event
			 * @param {Array} undos - Array containing all undo objects.
			 * @param {Array} redos - Array containing all redo objects.
			 */
			$elem.trigger('undoRedoSet', [undos, redos]);

		})
		.on('priceChange', function(evt, price, viewPrice) {

			instance.currentPrice = instance.singleProductPrice = 0;
			//calulate total price of all views
			for(var i=0; i < _viewInstances.length; ++i) {

				instance.singleProductPrice += _viewInstances[i].totalPrice;

			}

			instance.currentPrice = instance.singleProductPrice * instance.orderQuantity;

			/**
		     * Gets fired as soon as the price changes in a view.
		     *
		     * @event FancyProductDesigner#priceChange
		     * @param {Event} event
		     * @param {number} elementPrice - The price of the element.
		     * @param {number} totalPrice - The total price of all views with quantity.
		     * @param {number} singleProductPrice - The total price of all views without quantity.
		     */
			$elem.trigger('priceChange', [price, instance.currentPrice, instance.singleProductPrice]);

		})
		.on('elementCheckContainemt', function(evt, element, boundingBoxMode) {

			if(boundingBoxMode === 'inside') {

				if(element.isOut) {

					instance.$elementTooltip.css({
						left: element.oCoords.mb.x,
						top: element.oCoords.tl.y - instance.$elementTooltip.outerHeight() - 20 + instance.$productStage.position().top
					}).show();

				}
				else {
					instance.$elementTooltip.hide();
				}

			}


		})
		.on('elementColorChange', function(evt, element, hex, colorLinking) {

			if(instance.productCreated && colorLinking && element.colorLinkGroup && element.colorLinkGroup.length > 0 && element.type !== 'path-group') {

				var group = instance.colorLinkGroups[element.colorLinkGroup];
				if(group && group.elements) {
					for(var i=0; i < group.elements.length; ++i) {

						var id = group.elements[i].id,
							viewIndex = group.elements[i].viewIndex,
							target = instance.getElementByID(id, viewIndex);

						if(target && target !== element && hex) {
							instance.viewInstances[viewIndex].changeColor(target, hex, false, false);
						}

					}
				}

			}

		})
		.on('elementRemove', function(evt, element) {

			/**
		     * Gets fired as soon as an element has been removed.
		     *
		     * @event FancyProductDesigner#elementRemove
		     * @param {Event} event
		     * @param {fabric.Object} element - The fabric object that has been removed.
		     */
			$elem.trigger('elementRemove', [element]);

		});

		viewInstance.setup();

		FPDUtil.updateTooltip();

		instance.$viewSelectionWrapper.children().length > 1 ? instance.$viewSelectionWrapper.show() : instance.$viewSelectionWrapper.hide();

	};

	/**
	 * Selects a view from the current visible views.
	 *
	 * @method selectView
	 * @param {number} index The requested view by an index value. 0 will load the first view.
	 */
	this.selectView = function(index) {

		if(instance.currentViews === null) {return;}

		instance.currentViewIndex = index;
		if(index < 0) { instance.currentViewIndex = 0; }
		else if(index > instance.currentViews.length-1) { instance.currentViewIndex = instance.currentViews.length-1; }

		instance.$viewSelectionWrapper.children('div').removeClass('fpd-view-active')
		.eq(index).addClass('fpd-view-active');

		instance.$mainWrapper.children('.fpd-ruler').remove();

		if(instance.currentViewInstance) {
			//delete all undos/redos
			instance.currentViewInstance.undos = [];
			instance.currentViewInstance.redos = [];

			//remove some objects
			var removeObjs = ['_snap_lines_group', '_ruler_hor', '_ruler_ver'];
			for(var i=0; i<removeObjs.length; ++i) {
				var removeObj = instance.currentViewInstance.getElementByID(removeObjs[i]);
				if(removeObj) {
					instance.currentViewInstance.stage.remove(removeObj);
				}
			}

		}

		instance.currentViewInstance = instance.viewInstances[instance.currentViewIndex];

		instance.deselectElement();

		//select view wrapper and render stage of view
		instance.$productStage.children('.fpd-view-stage').addClass('fpd-hidden').eq(instance.currentViewIndex).removeClass('fpd-hidden');
		instance.currentViewInstance.stage.renderAll();

		//toggle custom adds
		if($mainBar && $mainBar.find('.fpd-navigation').length) {
			var viewOpts = instance.currentViewInstance.options,
				$nav = $mainBar.find('.fpd-navigation');

			$nav.children('[data-module="designs"]').toggleClass('fpd-disabled', !viewOpts.customAdds.designs);
			$nav.children('[data-module="images"]').toggleClass('fpd-disabled', !viewOpts.customAdds.uploads);
			$nav.children('[data-module="text"]').toggleClass('fpd-disabled', !viewOpts.customAdds.texts);

			//PLUS
			if(typeof FPDNamesNumbersModule !== 'undefined') {
				$nav.children('[data-module="names-numbers"]').toggleClass('fpd-disabled', !instance.currentViewInstance.textPlaceholder && !instance.currentViewInstance.numberPlaceholder);
			}
			$nav.children('[data-module="drawing"]').toggleClass('fpd-disabled', !viewOpts.customAdds.drawing);


			//select nav item, if topbar layout is not used, no active item is set and active item is not disabled
			if((!$elem.hasClass('fpd-topbar') && $nav.children('.fpd-active').length === 0) || $nav.children('.fpd-active').hasClass('fpd-disabled')) {
				$nav.children(':not(.fpd-disabled)').first().click();
			}

			//if products module is hidden and selected, select next
			if(instance.$container.hasClass('fpd-products-module-hidden') && $nav.children('.fpd-active').filter('[data-module="products"]').length > 0) {
				$nav.children(':not(.fpd-disabled)').eq(1).click();
			}

		}

		//reset view canvas size
		instance.$productStage.width(instance.currentViewInstance.options.stageWidth);
		instance.currentViewInstance.resetCanvasSize();

		if(instance.$container.filter('[class*="fpd-off-canvas-"]').length > 0) {
			instance.mainBar.$content.height(instance.$mainWrapper.height());
		}

		_toggleUndoRedoBtn(instance.currentViewInstance.undos, instance.currentViewInstance.redos);

		/**
	     * Gets fired as soon as a view has been selected.
	     *
	     * @event FancyProductDesigner#viewSelect
	     * @param {Event} event
	     * @param {Number} viewIndex
	     * @param {Object} viewInstance
	     */
		$elem.trigger('viewSelect', [instance.currentViewIndex, instance.currentViewInstance]);

	};

	/**
	 * Adds a new element to the product designer.
	 *
	 * @method addElement
	 * @param {string} type The type of an element you would like to add, 'image' or 'text'.
	 * @param {string} source For image the URL to the image and for text elements the default text.
	 * @param {string} title Only required for image elements.
	 * @param {object} [parameters] An object with the parameters, you would like to apply on the element.
	 * @param {number} [viewIndex] The index of the view where the element needs to be added to. If no index is set, it will be added to current showing view.
	 */
	this.addElement = function(type, source, title, parameters, viewIndex) {

		viewIndex = typeof viewIndex !== 'undefined' ? viewIndex : instance.currentViewIndex;
		parameters = typeof parameters !== 'undefined' ? parameters : {};

		instance.viewInstances[viewIndex].addElement(type, source, title, parameters);

		//element should be replaced in all views
		if(parameters.replace && parameters.replaceInAllViews) {

			for(var i=0; i < instance.viewInstances.length; ++i) {

				var viewInstance = instance.viewInstances[i];
				//check if not current view and view has at least one element with the replace value
				if(viewIndex !== i && viewInstance.getElementByReplace(parameters.replace) !== null) {
					viewInstance.addElement(type, source, title, parameters, i);
				}

			}

		}

	};

	/**
	 * Sets the parameters for a specified element.
	 *
	 * @method setElementParameters
	 * @param {object} parameters An object with the parameters that should be applied to the element.
	 * @param {fabric.Object | string} element A fabric object or the title of an element.
	 * @param {Number} viewIndex The index of the view you would like target. If not set, the current showing view will be used.
	 */
	this.setElementParameters = function(parameters, element, viewIndex) {

		element = typeof element === 'undefined' ? instance.stage.getActiveObject() : element;

		if(!element || parameters === undefined) {
			return false;
		}

		viewIndex = typeof viewIndex === 'undefined' ? instance.currentViewIndex : viewIndex;

		instance.viewInstances[viewIndex].setElementParameters(parameters, element);

	};

	/**
	 * Clears the product stage and resets everything.
	 *
	 * @method clear
	 */
	this.clear = function() {

		if(instance.currentViews === null) { return; }

		$elem.off('viewCreate', _onViewCreated);

		instance.deselectElement();
		instance.resetZoom();
		instance.currentViewIndex = instance.currentPrice = instance.singleProductPrice = 0;
		instance.currentViewInstance = instance.currentViews = instance.currentElement = null;

		instance.$mainWrapper.find('.fpd-view-stage').remove();
		$body.find('.fpd-views-selection').remove();

		instance.viewInstances = [];
		_viewInstances = [];

		/**
	     * Gets fired as soon as the stage has been cleared.
	     *
	     * @event FancyProductDesigner#clear
	     * @param {Event} event
	     */
		$elem.trigger('clear');
		$elem.trigger('priceChange', [0, 0, 0]);
		stageCleared = true;

	};

	/**
	 * Deselects the selected element of the current showing view.
	 *
	 * @method deselectElement
	 */
	this.deselectElement = function() {

		if(instance.currentViewInstance) {

			instance.currentViewInstance.deselectElement();

		}

	};

	/**
	 * Creates all views in one data URL. The different views will be positioned below each other.
	 *
	 * @method getProductDataURL
	 * @param {Function} callback A function that will be called when the data URL is created. The function receives the data URL.
	 * @param {String} [backgroundColor=transparent] The background color as hexadecimal value. For 'png' you can also use 'transparent'.
	 * @param {Object} [options] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toDataURL.
	 * @param {String} [options.onlyExportable=false] If true elements with excludeFromExport=true are not exported in the image.
	 * @example fpd.getProductDataURL( function(dataURL){} );
	 */
	this.getProductDataURL = function(callback, backgroundColor, options) {

		callback = typeof callback !== 'undefined' ? callback : function() {};
		backgroundColor = typeof backgroundColor !== 'undefined' ? backgroundColor : 'transparent';
		options = typeof options !== 'undefined' ? options : {};
		options.onlyExportable = typeof options.onlyExportable !== 'undefined' ? options.onlyExportable : false;

		//check
		if(instance.viewInstances.length === 0) { callback('') }

		$body.append('<canvas id="fpd-hidden-canvas"></canvas>');

		var printCanvas = new fabric.Canvas('fpd-hidden-canvas', {
				containerClass: 'fpd-hidden fpd-hidden-canvas',
				enableRetinaScaling: false
			}),
			viewCount = 0;

		function _addCanvasImage(viewInstance) {

			if(viewInstance.options.stageWidth > printCanvas.getWidth()) {
				printCanvas.setDimensions({width: viewInstance.options.stageWidth});
			}

			viewInstance.toDataURL(function(dataURL) {

				fabric.Image.fromURL(dataURL, function(img) {

					printCanvas.add(img);

					if(viewCount > 0) {
						img.setTop(printCanvas.getHeight());
						printCanvas.setDimensions({height: (printCanvas.getHeight() + viewInstance.options.stageHeight)});
					}

					viewCount++;
					if(viewCount < instance.viewInstances.length) {
						_addCanvasImage(instance.viewInstances[viewCount]);
					}
					else {
						callback(printCanvas.toDataURL(options));
						/*printCanvas.dispose();
						$body.children('.fpd-hidden-canvas, #fpd-hidden-canvas').remove();

						if(instance.currentViewInstance) {
							instance.currentViewInstance.resetCanvasSize();
						}*/

					}

				});

			}, backgroundColor, {onlyExportable: options.onlyExportable}, instance.watermarkImg);

		};

		var firstView = instance.viewInstances[0];
		printCanvas.setDimensions({width: firstView.options.stageWidth, height: firstView.options.stageHeight});
		_addCanvasImage(firstView);

	};

	/**
	 * Gets the views as data URL.
	 *
	 * @method getViewsDataURL
	 * @param {Function} callback A function that will be called when the data URL is created. The function receives the data URL.
	 * @param {string} [backgroundColor=transparent] The background color as hexadecimal value. For 'png' you can also use 'transparent'.
	 * @param {string} [options] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toDataURL.
	 * @param {String} [options.onlyExportable=false] If true elements with excludeFromExport=true are not exported in the image.
	 * @return {array} An array with all views as data URLs.
	 */
	this.getViewsDataURL = function(callback, backgroundColor, options) {

		callback = typeof callback !== 'undefined' ? callback : function() {};
		backgroundColor = typeof backgroundColor !== 'undefined' ? backgroundColor : 'transparent';
		options = typeof options !== 'undefined' ? options : {};

		var dataURLs = [];

		for(var i=0; i < instance.viewInstances.length; ++i) {

			instance.viewInstances[i].toDataURL(function(dataURL) {

				dataURLs.push(dataURL);

				if(dataURLs.length === instance.viewInstances.length) {
					callback(dataURLs);
				}

			}, backgroundColor, options, instance.watermarkImg);

		}

	};

	/**
	 * Returns the views as SVG.
	 *
	 * @method getViewsSVG
	 * @param {Object} options See http://fabricjs.com/docs/fabric.StaticCanvas.html#toSVG.
	 * @param {Function} reviver See http://fabricjs.com/docs/fabric.StaticCanvas.html#toSVG.
	 * @return {array} An array with all views as SVG.
	 */
	this.getViewsSVG = function(options, reviver) {

		var SVGs = [];

		for(var i=0; i < instance.viewInstances.length; ++i) {
			SVGs.push(instance.viewInstances[i].toSVG(options, reviver));
		}

		return SVGs;

	};

	/**
	 * Shows or hides the spinner with an optional message.
	 *
	 * @method toggleSpinner
	 * @param {String} state The state can be "show" or "hide".
	 * @param {Boolean} msg The message that will be displayed underneath the spinner.
	 */
	this.toggleSpinner = function(state, msg) {

		state = typeof state === 'undefined' ? true : state;
		msg = typeof msg === 'undefined' ? '' : msg;

		if(state) {

			$stageLoader.fadeIn(300).find('.fpd-loader-text').text(msg);

		}
		else {

			$stageLoader.stop().fadeOut(300);

		}

	};

	/**
	 * Returns an fabric object by title.
	 *
	 * @method getElementByTitle
	 * @param {String} title The title of an element.
	 * @param {Number} viewIndex The index of the target view.
	 * @return {fabric.Object} FabricJS Object.
	 */
	this.getElementByTitle = function(title, viewIndex) {

		if(typeof viewIndex === 'undefined') {
			//scans all view instances
			for(var i=0; i < instance.viewInstances.length; ++i) {
				var objects = instance.viewInstances[i].stage.getObjects();
				for(var j = 0; j < objects.length; ++j) {
					if(objects[j].title == title) {
						return objects[j];
						break;
					}
				}
			}

		}
		else {
			//scans the view instance by index
			var objects = instance.viewInstances[viewIndex].stage.getObjects();
			for(var i = 0; i < objects.length; ++i) {
				if(objects[i].title == title) {
					return objects[i];
					break;
				}
			}

		}

	};

	/**
	 * Returns an array view all elements or only the elements of a specific view.
	 *
	 * @method getElements
	 * @param {Number} viewIndex The index of the target view.
	 * @return {Array} An array containg the elements.
	 */
	this.getElements = function(viewIndex) {

		this.deselectElement();

		if(typeof viewIndex === 'undefined') {

			var allElements = [];

			for(var i=0; i < instance.viewInstances.length; ++i) {
				allElements.push(instance.viewInstances[i].stage.getObjects());
			}

			return allElements;

		}
		else {

			return instance.viewInstances[viewIndex].stage.getObjects();

		}

	};

	/**
	 * Opens the current showing product in a Pop-up window and shows the print dialog.
	 *
	 * @method print
	 */
	this.print = function() {

		_createPopupImage = function(dataURLs) {

			var images = new Array(),
				imageLoop = 0;

			//load all images first
			for(var i=0; i < dataURLs.length; ++i) {

				var image = new Image();
				image.src = dataURLs[i];
				image.onload = function() {

					images.push(this);
					imageLoop++;

					//add images to popup and print popup
					if(imageLoop == dataURLs.length) {

						var popup = window.open('','','width='+images[0].width+',height='+(images[0].height*dataURLs.length)+',location=no,menubar=no,scrollbars=yes,status=no,toolbar=no');
						FPDUtil.popupBlockerAlert(popup, instance);

						popup.document.title = "Print Image";
						for(var j=0; j < images.length; ++j) {
							$(popup.document.body).append('<img src="'+images[j].src+'" />');
						}

						setTimeout(function() {
							popup.print();
						}, 1000);

					}
				}

			}

		};

		instance.getViewsDataURL(_createPopupImage);

	};

	/**
	 * Creates an image of the current showing product.
	 *
	 * @method createImage
	 * @param {boolean} [openInBlankPage= true] Opens the image in a Pop-up window.
	 * @param {boolean} [forceDownload=false] Downloads the image to the user's computer.
	 * @param {string} [backgroundColor=transparent] The background color as hexadecimal value. For 'png' you can also use 'transparent'.
	 * @param {string} [options] See fabricjs documentation http://fabricjs.com/docs/fabric.Canvas.html#toDataURL.
	 * @param {String} [options.onlyExportable=false] If true elements with excludeFromExport=true are not exported in the image.
	 */
	this.createImage = function(openInBlankPage, forceDownload, backgroundColor, options) {

		if(typeof(openInBlankPage)==='undefined') openInBlankPage = true;
		if(typeof(forceDownload)==='undefined') forceDownload = false;
		backgroundColor = typeof backgroundColor !== 'undefined' ? backgroundColor : 'transparent';
		options = typeof options !== 'undefined' ? options : {};
		format = options.format === undefined ? 'png' : options.format;

		instance.getProductDataURL(function(dataURL) {

			var image = new Image();
			image.src = dataURL;

			image.onload = function() {

				if(openInBlankPage) {

					var popup = window.open('','_blank');
					FPDUtil.popupBlockerAlert(popup, instance);

					popup.document.title = "Product Image";
					$(popup.document.body).append('<img src="'+this.src+'" download="product.'+format+'" />');

					if(forceDownload) {
						window.location.href = popup.document.getElementsByTagName('img')[0].src.replace('image/'+format+'', 'image/octet-stream');
					}
				}

			}

		}, backgroundColor, options);


	};

	/**
	 * Sets the zoom of the stage. 1 is equal to no zoom.
	 *
	 * @method setZoom
	 * @param {number} value The zoom value.
	 */
	this.setZoom = function(value) {

		zoomReseted = false;
		this.deselectElement();

		if(instance.currentViewInstance) {

			var responsiveScale = instance.currentViewInstance.responsiveScale;

			var point = new fabric.Point(instance.currentViewInstance.stage.getWidth() * 0.5, instance.currentViewInstance.stage.getHeight() * 0.5);

			instance.currentViewInstance.stage.zoomToPoint(point, value * responsiveScale);

			if(value == 1) {
				instance.resetZoom();
			}

		}


	};

	/**
	 * Resets the zoom.
	 *
	 * @method resetZoom
	 */
	this.resetZoom = function() {

		zoomReseted = true;
		this.deselectElement();

		if(instance.currentViewInstance) {

			var responsiveScale = instance.currentViewInstance.responsiveScale;

			instance.currentViewInstance.stage.zoomToPoint(new fabric.Point(0, 0), responsiveScale);
			instance.currentViewInstance.stage.absolutePan(new fabric.Point(0, 0));

		}

	};

	/**
	 * Get an elment by ID.
	 *
	 * @method getElementByID
	 * @param {Number} id The id of an element.
	 * @param {Number} [viewIndex] The view index you want to search in. If no index is set, it will use the current showing view.
	 */
	this.getElementByID = function(id, viewIndex) {

		viewIndex = typeof viewIndex === 'undefined' ? instance.currentViewIndex : viewIndex;

		return instance.viewInstances[viewIndex].getElementByID(id);

	};

	/**
	 * Returns the current showing product with all views and elements in the views.
	 *
	 * @method getProduct
	 * @param {boolean} [onlyEditableElements=false] If true, only the editable elements will be returned.
	 * @param {boolean} [customizationRequired=false] To receive the product the user needs to customize the initial elements.
	 * @return {array} An array with all views. A view is an object containing the title, thumbnail, custom options and elements. An element object contains the title, source, parameters and type.
	 */
	this.getProduct = function(onlyEditableElements, customizationRequired) {

		onlyEditableElements = typeof onlyEditableElements !== 'undefined' ? onlyEditableElements : false;
		customizationRequired = typeof customizationRequired !== 'undefined' ? customizationRequired : false;

		if(customizationRequired && !productIsCustomized) {
			FPDUtil.showModal(instance.getTranslation('misc', 'customization_required_info'));
			return false;
		}

		this.deselectElement();
		this.resetZoom();

		instance.doUnsavedAlert = false;

		//check if an element is out of his containment
		var viewElements = this.getElements();
		for(var i=0; i < viewElements.length; ++i) {

			for(var j=0; j < viewElements[i].length; ++j) {

				var element = viewElements[i][j];
				if(element.isOut && element.boundingBoxMode === 'inside') {
					FPDUtil.showModal(element.title+': '+instance.getTranslation('misc', 'out_of_bounding_box'));
					return false;
				}

			}

		}

		var product = [];
		//add views
		for(var i=0; i < instance.viewInstances.length; ++i) {
			var viewInstance = instance.viewInstances[i],
				relevantViewOpts = {
					stageWidth: viewInstance.options.stageWidth,
					stageHeight: viewInstance.options.stageHeight,
					customAdds: viewInstance.options.customAdds
				};

			product.push({
				title: viewInstance.title,
				thumbnail: viewInstance.thumbnail,
				elements: [],
				options: relevantViewOpts,
				names_numbers: viewInstance.names_numbers
			});
		}

		for(var i=0; i < viewElements.length; ++i) {

			for(var j=0; j < viewElements[i].length; ++j) {
				var element = viewElements[i][j];

				if(element.title !== undefined && element.source !== undefined) {
					var jsonItem = {
						title: element.title,
						source: element.source,
						parameters: instance.viewInstances[i].getElementJSON(element),
						type: FPDUtil.getType(element.type)
					};

					if(onlyEditableElements) {
						if(element.isEditable) {
							product[i].elements.push(jsonItem);
						}
					}
					else {
						product[i].elements.push(jsonItem);
					}
				}
			}
		}

		//returns an array with all views
		return product;

	};

	/**
	 * Get the translation of a label.
	 *
	 * @method getTranslation
	 * @param {String} section The section key you want - toolbar, actions, modules or misc.
	 * @param {String} label The label key.
	 */
	this.getTranslation = function(section, label) {

		if(instance.langJson) {

			section = instance.langJson[section];

			if(section) {
				return section[label];
			}

		}

		return '';

	};

	/**
	 * Returns an array with all custom added elements.
	 *
	 * @method getCustomElements
	 * @param {string} [type='all'] The type of elements. Possible values: 'all', 'image', 'text'
	 * @return {array} An array with objects with the fabric object and the view index.
	 */
	this.getCustomElements = function(type) {

		type = typeof type === 'undefined' ? 'all' : type;

		var views = this.getElements(),
			customElements = [];

		for(var i=0; i< views.length; ++i) {
			var elements = views[i];

			for(var j=0; j < elements.length; ++j) {
				var element = elements[j],
					fpdElement = null;

				if(element.isCustom) {

					if(type === 'image' || type === 'text') { //only image or text elements

						if(FPDUtil.getType(element.type) === type) {
							customElements.push({element: element, viewIndex: i});
						}

					}
					else { //get all custom added elements
						customElements.push({element: element, viewIndex: i});
					}

				}

			}


		}

		return customElements;

	};

	/**
	 * Adds a new custom image to the product stage. This method should be used if you are using an own image uploader for the product designer. The customImageParameters option will be applied on the images that are added via this method.
	 *
	 * @method addCustomImage
	 * @param {string} source The URL of the image.
	 * @param {string} title The title for the design.
	 */
	this.addCustomImage = function(source, title) {

		var image = new Image;
    		image.src = source;

    	this.toggleSpinner();

		image.onload = function() {

			instance._loadingCustomImage = false;

			var imageH = this.height,
				imageW = this.width,
				currentCustomImageParameters = instance.currentViewInstance.options.customImageParameters,
				imageParts = this.src.split('.'),
				scaling = 1;

			if(!FPDUtil.checkImageDimensions(instance, imageW, imageH)) {
				instance.toggleSpinner(false);
    			return false;
			}

			scaling = FPDUtil.getScalingByDimesions(
				imageW,
				imageH,
				currentCustomImageParameters.resizeToW,
				currentCustomImageParameters.resizeToH
			);

			var fixedParams = {
				scaleX: scaling,
				scaleY: scaling,
				isCustom: true
			};

			if($.inArray('svg', imageParts) != -1) {
				fixedParams.colors = true;
			}

			instance.addElement(
    			'image',
    			source,
    			title,
	    		$.extend({}, currentCustomImageParameters, fixedParams)
    		);


    		instance.toggleSpinner(false);
    		FPDUtil.showMessage(instance.getTranslation('misc', 'image_added'));

		}

		image.onerror = function(evt) {
			FPDUtil.showModal('Image could not be loaded!');
		}

	};

	/**
	 * Sets the dimensions of all views.
	 *
	 * @method setDimensions
	 * @param {Number} width The width in pixel.
	 * @param {Number} height The height in pixel.
	 */
	this.setDimensions = function(width, height) {

		options.stageWidth = instance.mainOptions.stageWidth = width;
		options.stageHeight = instance.mainOptions.stageHeight = height;

		instance.$container.find('.fpd-product-stage').width(width);
		for(var i=0; i < instance.viewInstances.length; ++i) {

			instance.viewInstances[i].options.stageWidth = width;
			instance.viewInstances[i].options.stageHeight = height;
			instance.viewInstances[i].resetCanvasSize();

		}

		if(instance.$container.filter('[class*="fpd-off-canvas-"]').length > 0) {
			instance.mainBar.$content.height(instance.$mainWrapper.height());
		}

	};

	/**
	 * Sets the order quantity.
	 *
	 * @method setOrderQuantity
	 * @param {Number} quantity The width in pixel.
	 */
	this.setOrderQuantity = function(quantity) {

		quantity = quantity == '' || quantity < 0 ? 1 : quantity;
		instance.orderQuantity = quantity;
		instance.currentPrice = instance.singleProductPrice * instance.orderQuantity;

		$elem.trigger('priceChange', [null, instance.currentPrice, instance.singleProductPrice]);

	};

	/**
	 * Returns an order object containing the product from the getProduct() method. If using plus add-on and bulk variations, the variations will be added into the object.
	 *
	 * @method getOrder
	 * @param {Object} options Options for the methods that are called inside this mehtod, e.g. getProduct() can receive two parameters.
	 * @return {object} An object containing different objects representing important order data.
	 * @example fpd.getOrder( {onlyEditableElements: true, customizationRequired: true} );
	 */
	this.getOrder = function(options) {

		options = typeof options === 'undefined' ? {} : options;

		instance._order.product = instance.getProduct(
			options.onlyEditableElements || false,
			options.customizationRequired || false
		);

		instance._order.usedFonts = instance.getUsedFonts();

		$elem.trigger('getOrder');

		return instance._order;

	};

	/**
	 * Get all fonts used in the product.
	 *
	 * @method setOrderQuantity
	 * @return {array} An array with objects containing the font name and optional the URL to the font.
	 */
	this.getUsedFonts = function() {

		var views = this.getElements(),
			_usedFonts = [], //temp to check if already included
			usedFonts = [];

		for(var i=0; i< views.length; ++i) {
			var elements = views[i];

			for(var j=0; j < elements.length; ++j) {
				var element = elements[j];

				if(FPDUtil.getType(element.type) === 'text') {

					if(_usedFonts.indexOf(element.fontFamily) === -1) {

						var fontObj = {name: element.fontFamily},
							//grep font entry
							result = $.grep(instance.mainOptions.fonts, function(e){
								return e.name == element.fontFamily;
							});

						//check if result contains props and url prop
						if(result.length > 0 && result[0].url) {
							fontObj.url = result[0].url;
						}

						_usedFonts.push(element.fontFamily);
						usedFonts.push(fontObj);


					}

				}

			}


		}

		return usedFonts;

	};

	_initialize();

};

