/** * @fileoverview Fzxa Javascript framework 1.0 * * @author 新郎微薄:<a href="http://weibo.com/fzxa" target="_blank">@fzxa</a> 博客:<a href="http://www.nonb.cn" target="_blank">写点寂寞</a> * @link <a href="http://www.fzxa.com/">http://www.fzxa.com</a> * @copyright Copyright (c) 2012-2013, FzxzJS! Inc. All rights reserved. * @version 1.0.1 $Id: fzxa.source.js 52 2013-01-24 02:38:03Z zhenwang $ */void (function( window, document, undefined ) {		if (!(typeof fzxa != 'undefined' && fzxa)) {		/**		 * @name $		 * @constructor		 * @description $符号是Fzxa的别名，与jQuery方法类似，提供常用的选择器tagName、className 以及 id 就能完成 95% 以上的工作		 * @param {String} selector 选择器名称		 * @param {Elements} context 选择器范围,默认为document		 * @example		 * 		 * Fzxa('#test');		 * 支持以下选择器类型：		 * div		 * .example		 * body div		 * div,p		 * div,p,.example		 * div p		 * div > p		 * div.example		 * ul .example		 * #title		 * h1#title		 * div #title		 * ul.foo > * span		 */		var fzxaSelect = (function(){					var snack = /(?:[\w\-\\.#]+)+(?:\[\w+?=([\'"])?(?:\\\1|.)+?\1\])?|\*|>/ig,				//regexp class				exprClassName = /^(?:[\w\-_]+)?\.([\w\-_]+)/,				//regexp id				exprId = /^(?:[\w\-_]+)?#([\w\-_]+)/,				//regexp node				exprNodeName = /^([\w\*\-_]+)/,				na = [null,null];						function _find(selector, context) {								context = context || document;								var simple = /^[\w\-_#]+$/.test(selector);				//判断是不是只是选择id。这里看起来，只是选择id的话不能使用querySelectorAll				if (!simple && context.querySelectorAll) {					return realArray(context.querySelectorAll(selector));				}				//首先如果查询语句包含了逗号，就把用逗号分开的各段查询分离，				//调用本身_find查找各分段的结果，显然此时传入_find的查询字符串已经不包含逗号了				if (selector.indexOf(',') > -1) {					var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;					for(; sIndex < len; ++sIndex) {						ret = ret.concat( _find(split[sIndex], context) );					}					return unique(ret);				}				//"#id div > p"变成数组["#s2", "b", ">", "p"]，空格和">"作为分隔符				var parts = selector.match(snack),					part = parts.pop(),					id = (part.match(exprId) || na)[1],					className = !id && (part.match(exprClassName) || na)[1],					nodeName = !id && (part.match(exprNodeName) || na)[1],					collection;									if (className && !nodeName && context.getElementsByClassName) {										collection = realArray(context.getElementsByClassName(className));									} else {										collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));										if (className) {						collection = filterByAttr(collection, 'className', RegExp('(^|\\s)' + className + '(\\s|$)'));					}										if (id) {						var byId = context.getElementById(id);						return byId?[byId]:[];					}				}								return parts[0] && collection[0] ? filterParents(parts, collection) : collection;							}						/**			 * 把元素集合转换成数组			 */			function realArray(c) {								try {					return Array.prototype.slice.call(c);				} catch(e) {					var ret = [], i = 0, len = c.length;					for (; i < len; ++i) {						ret[i] = c[i];					}					return ret;				}							}						function filterParents(selectorParts, collection, direct) {				////继续把最后一个查询片段取出来，跟_find里的part = parts.pop()一样							var parentSelector = selectorParts.pop();								if (parentSelector === '>') {					return filterParents(selectorParts, collection, true);				}								var ret = [],					r = -1,					id = (parentSelector.match(exprId) || na)[1],					className = !id && (parentSelector.match(exprClassName) || na)[1],					nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],					cIndex = -1,					node, parent,					matches;									nodeName = nodeName && nodeName.toLowerCase();									while ( (node = collection[++cIndex]) ) {										parent = node.parentNode;										do {												matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();						matches = matches && (!id || parent.id === id);						matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));												if (direct || matches) { break; }											} while ( (parent = parent.parentNode) );										if (matches) {						ret[++r] = node;					}				}								return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;			}									var unique = (function(){				//为了保存变量uid和方法data，使用了一个闭包环境					var uid = +new Date();									var data = (function(){				 					var n = 1;					//如果elem是第一次进来检验，cacheIndex=elem[uid]=false，赋给elem[uid]一个值并返回true					return function(elem) {				 						var cacheIndex = elem[uid],							nextCacheIndex = n++;				 						if(!cacheIndex) {							elem[uid] = nextCacheIndex;							return true;						}						return false;					};				 				})();								return function(arr) {									var length = arr.length,						ret = [],						r = -1,						i = 0,						item;											for (; i < length; ++i) {						item = arr[i];						if (data(item)) {							ret[++r] = item;						}					}										uid += 1;										return ret;							};						})();						/**			 * 通过属性名筛选元素			 */			function filterByAttr(collection, attr, regex) {				var i = -1, node, r = -1, ret = [];								while ( (node = collection[++i]) ) {					if (regex.test(node[attr])) {						ret[++r] = node;					}				}								return ret;			}						return _find;					})();		var fzxa = function(data,context){			this.data = data || [];			this.context = context || document;			if (fzxa.getType(data) == 'string') {				var selector = fzxaSelect(this.data,this.context);				return new fzxa.fn.init(selector);			}else if(typeof data == 'object'){				this.data[0] = data;				return new fzxa.fn.init(data);			}else if(fzxa.getType(data) == 'global'){					//todo global			}else{				fzxa.ready(data);			};		};		fzxa.fn = fzxa.prototype = {			init: function(selector,context){				if(selector) this.data = selector;				return this;			},			/**			 * @name size			 * @description 返回当前数量			 * @static			 * @return {Object}			 * @example			 * Fzxa('img').size();			 */			size: function(){				return this.data.length;			}		}		fzxa.fn.init.prototype = fzxa.fn;		/**		 * @name browser		 * @constructor		 * @description 检测浏览器类型及版本		 * @example		 * //console.log(Fzxa.Brower);		 * //chrome: true		 * //firefox: false		 * //ie: false		 * //opera: false		 * //safari: false		 * //version: "537.17"		 */		(function(){			var agent = navigator.userAgent.toLowerCase();		    fzxa.Browser = {		        version: (agent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],				safari: /webkit/i.test(agent) && !this.chrome,				opera: /opera/i.test(agent),		        firefox:/firefox/i.test(agent),				ie: /msie/i.test(agent) && !/opera/.test(agent),		        chrome: /chrome/i.test(agent) && /webkit/i.test(agent) && /mozilla/i.test(agent)		    };		    //@todo 解决ie下默认不缓存背景图片			if (fzxa.Browser.ie && fzxa.Browser.version == 6) {				try {					document.execCommand("BackgroundImageCache", false, true);				} catch (e) {}			}		})();		/**		 * @name tmpl		 * @constructor		 * @param {String} str 		 * @param {Object|Function} data		 * @description JS模板引擎		 * @see for  http://ejohn.org/  by:John Resig		 * @example		 * &lt;script type="text/javascript" &gt;		 * var results = document.getElementById("results");		 * results.innerHTML = tmpl("item_tmpl", dataObject);		 * &lt;script&gt;		 * &lt;script type="text/html" id="item_tmpl"&gt;		 * &lt;div id="&lt;%=id%&gt;" class="&lt;%=(i % 2 == 1 ? " even" : "")%&gt;"&gt;		 * 		&lt;div class="grid_1 alpha right"&gt;		 * 			&lt;img class="righted" src="&lt;%=profile_image_url%&gt;"/&gt;		 * 		&lt;/div&gt;		 * 		&lt;div class="grid_6 omega contents"&gt;		 * 			&lt;p&gt;&lt;b&gt;&lt;a href="/&lt;%=from_user%&gt;"&gt;&lt;%=from_user%&gt;&lt;/a&gt;:&lt;/b&gt; &lt;%=text%&gt;&lt;/p&gt;		 * 		&lt;/div&gt;		 * 	&lt;/div&gt;		 * 	&lt;/script&gt;		 */		(function(){			var cache = {};			fzxa.tmpl = function(str, data){			    var fn = !/\W/.test(str) ?			      	cache[str] = cache[str] ||			        fzxa.tmpl(document.getElementById(str).innerHTML) :			      					new Function("obj",					"var p=[],print=function(){p.push.apply(p,arguments);};" +					"with(obj){p.push('" +					str					  .replace(/[\r\t\n]/g, " ")					  .split("<%").join("\t")					  .replace(/((^|%>)[^\t]*)'/g, "$1\r")					  .replace(/\t=(.*?)%>/g, "',$1,'")					  .split("\t").join("');")					  .split("%>").join("p.push('")					  .split("\r").join("\\'")					+ "');}return p.join('');");			    				return data ? fn( data ) : fn;			};		})();		/**		 * @name ready		 * @namespace fzxa         * @constructor         * @description 当DOM载入就绪可以查询及操纵时绑定一个要执行的函数		 * @param {Function} func 回调函数		 * @return {Object}         * @example         * Fzxa.ready(function(){         * 		alert('Hello FzxaJS!');         * });		 */		fzxa.ready  = fzxa.fn.ready = function(func){				if(fzxa.Browser.ie){					(function(){						try{							document.documentElement.doScroll('left');						} catch (error){							setTimeout(arguments.callee, 0);							return;						};						func && func();					})();				}else{					document.addEventListener('DOMContentLoaded', func, false);				}		}		/**         * @name each         * @static		 * @description 以每一个匹配的元素作为上下文来执行一个函数。		 * @param  {Object|Function}   obj  遍历数据		 * @param  {Function} fn  回调函数		 * @param  {Arugments}   args		 * @return {Object} 		 * @example		 * Fzxa.each(['a','b'],function(k,v){		 * 		console.log(k,v);		 * });		 *		 * //选择器each		 * Fzxa('img').each(function(k,v){		 * 		console.log(k,v);		 * });		 */		fzxa.each = fzxa.fn.each = function( obj, fn, args ) {			if(fzxa.getType(obj) == 'function' && fzxa.getType(fn) == 'undefined'){				fn = obj;				obj = this.data;			}			if ( obj.length == undefined ) {			    for ( var i in obj ) 			       fn.call( obj, i, obj ); 			}else{ 			  for ( var i = 0, ol = obj.length, val = obj[0]; i < ol && fn.call(val,i,val) !== false; val = obj[++i] ){} 			}			return this;		}		        /**         * @name extend         * @namespace fzxa         * @constructor         * @description 用来在Fzxa命名空间上增加新函数。 查看 'Fzxa.fn.extend' 获取更多添加插件的信息         * @example         * //添加Fzxa方法         * Fzxa.extend({         *      min: function(a, b) { return a < b ? a : b; },         *      max: function(a, b) { return a > b ? a : b; }         * });         *          * //添加fzxa.prototype方法         * Fzxa.fn.extend({         * 		add :function(a, b){ return a+b}         * });         * @return {Object}         */		fzxa.extend = fzxa.fn.extend = function(){						var i = 0,				target = this,				deep = false,				obj, empty, item, x;			if (typeof arguments[0] === 'boolean') {				deep = true;				i = 1;				if (arguments.length > 2){					i = 2;					target = arguments[1];				}			} else if (arguments.length > 1){				i = 1;				target = arguments[0];			}			for (x = i; x < arguments.length; x++) {				obj = arguments[x];				for (item in obj){					if (obj[item] === target){						continue;					}					if (deep && typeof obj[item] == 'object' && obj[item] !== null) {						empty = fzxa.isArray(obj[item]) ? [] : {};						target[item] = fzxa.extend(deep, target[item] || empty, obj[item]);					} else {						target[item] = obj[item];					}				}			}			return target;		}		fzxa.extend({			/**			 * @name trim			 * @description 			 * @static			 * @param  {String} str 字符串			 * @return {String}			 * @example			 * Fzxa.trim('    test    ');//test			 */			trim :function(str){				return str.replace(/^\s+/, '').replace(/\s+$/, '');			}		});		/**		 * @name getType		 * @namespace fzxa		 * @constructor		 * @param  {object} obj 精确判断数据类型		 * @return {String}		 * @example		 * Fzxa.getType(window); //object		 * Fzxa.isFunction(window) //false		 */		fzxa.getType = function(obj){				return obj === null ? "null"						: obj == null ? "undefined"						: Object.prototype.toString.call(obj).slice(8,-1).toLowerCase(); 		}		/**		 * @name getType.isFunction		 * @description 判断是否为函数		 * @return {Boolean}		 */		/**		 * @name getType.isArray		 * @description 判断是否为数组		 * @return {Boolean}		 */		/**		 * @name getType.isObject		 * @description 判断是否为对象		 * @return {Boolean}		 */		/**		 * @name getType.isDate		 * @description 判断是否为日期		 * @return {Boolean}		 */		/**		 * @name getType.isRegexp		 * @description 判断是否为正则表达式		 * @return {Boolean}		 */		/**		 * @name getType.isString		 * @description 判断是否为字符串		 * @return {Boolean}		 */		/**		 * @name getType.isNumber		 * @description 判断是否为数字		 * @return {Boolean}		 */		/**		 * @name getType.isBoolean		 * @description 判断是否为布尔		 * @return {Boolean}		 */		var typeExtend = 'isFunction isArray isObject isDate isRegexp isString isNumber isBoolean';		fzxa.each(typeExtend.split(' '),function(key,val){			var typeName = val.slice(2).toLowerCase().toString();						fzxa[val] = function(obj){				return fzxa.getType(obj) === typeName ? true : false;			}		});		/**		 * @name ajax		 * @constructor		 * @namespace fzxa		 * @description 通过 HTTP 请求加载远程数据。		 * @example		 * Fzxa.ajax.call({		 * 		url : '/test.php',		 * 		success: function(data){		 * 			console.log(data);		 * 		}		 * });		 */		(function(){			fzxa.ajax = {				xhr: null,				/**				 * @name ajax.settings				 * @param {Object} url sdf				 * @description 请求参数				 */				settings: {					url: '',					type: 'GET',					dataType: 'text',//text html json or xml					async: true,					cache: true,					data: null,					contentType: 'application/x-www-form-urlencoded',					success: null,					error: null,					complete: null,					accepts: {						text: 'text/plain',						html: 'text/html',						xml: 'application/xml, text/xml',						json: 'application/json, text/javascript'					}				},				/**				 * @name ajax.call				 * @description 发送ajax请求				 * @param {Object} [options] 看考ajaxSettings				 */				call: function (options) {					var self = this,						xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'),						opts = (function (s, o) {							var opts = {};							for (var key in s)								opts[key] = (typeof o[key] == 'undefined') ? s[key] : o[key];							return opts;						})(this.settings, options),						ready = function () {							if(xhr.readyState == 4){								if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {									var data = (opts.dataType == 'xml') ? xhr.responseXML : xhr.responseText;									if (opts.dataType == 'json')										data = self.parseJSON(data);									if (fzxa.isFunction(opts.success))										opts.success.call(opts, data, xhr.status, xhr);								} else {									if (fzxa.isFunction(opts.error))										opts.error.call(opts, xhr, xhr.status);								}								if (fzxa.isFunction(opts.complete))									opts.complete.call(opts, xhr, xhr.status);							}						};					this.xhr = xhr;										if (!opts.cache)						opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + '_nocache='+ (new Date()).getTime();					if (opts.data) {						if (opts.type == 'GET') {							opts.url += ((opts.url.indexOf('?') > -1) ? '&' : '?') + this.param(opts.data);							opts.data = null;						} else {							opts.data = this.param(opts.data);						}					}										xhr.open(opts.type, opts.url, opts.async);					xhr.setRequestHeader('Content-type', opts.contentType);					if (opts.dataType && opts.accepts[opts.dataType])						xhr.setRequestHeader('Accept', opts.accepts[opts.dataType]);					if (opts.async) {						xhr.onreadystatechange = ready;						xhr.send(opts.data);					} else {						xhr.send(opts.data);						ready();					}					return this;				},				/**				 * @name ajax.get				 * @description get方式发送ajax请求				 * @param {String} url 发送URL				 * @param {String|Object|Json} data 传送数据				 * @param {Function} success 成功回调函数				 */				get: function (url, data, success) {					if (fzxa.isFunction(data)) {						success = data;						data = null;					}					return this.call({						url: url,						type: 'GET',						data: data,						success: success					});				},				/**				 * @name ajax.post				 * @description post方式发送ajax请求				 * @param {String} url 发送URL				 * @param {String|Object|Json} data 传送数据				 * @param {Function} success 成功回调函数				 */				post: function (url, data, success) {					if (fzxa.isFunction(data)) {						success = data;						data = null;					}					return this.call({						url: url,						type: 'POST',						data: data,						success: success					});				},				/**				 * @name ajax.load				 * @param {DOMElement|String} 				 * @param {String} 				 * @param {String} 				 * @param {Function} [complete] Callback  completed				 * @return {This}				 */				load: function (el, url, data, complete) {					if (typeof el == 'string')						el = document.getElementById(el);					return this.call({						url: url,						type: data ? 'POST' : 'GET',						data: data || null,						complete: complete || null,						success: function (html) {							try {								el.innerHTML = html;							} catch (e) {								var ph = document.createElement('div');								ph.innerHTML = html;								// empty element content								while (el.firstChild)									el.removeChild(el.firstChild);								// set new html content								for(var x = 0, max = ph.childNodes.length; x < max; x++)									el.appendChild(ph.childNodes[x]);							}						}					});				},				/**				 * URL编码				 * @param {Object|Array} obj Keys/values				 * @return {String} The querystring				 */				param: function (obj) {					var s = [];					for (var key in obj) {						s.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));					}					return s.join('&');				},				/**				 * 解析JSON字符串				 * @param {String} data				 * @return {Object} JSON object				 */				parseJSON: function (data) {					if (typeof data !== 'string' || !data)						return null;					return eval('('+ fzxa.trim(data) +')');				}			};		})();				/**		 * @name event		 * @constructor		 * @namespace fzxa		 * @description 元素事件绑定		 */		(function(){			/**			 * @name event.getEvent			 * @private			 * @param {EventObject} evt			 * @return {EventObject} Made cross-browser compatible			 */			function getEvent(evt) {				if (!evt){					evt = window.event || {};				}				var e = fzxa.extend({}, evt);				e.originalEvent = evt;				e.target = evt.target || evt.srcElement;				if (evt.charCode) {					e.keyCode = evt.charCode;					e.which = evt.charCode;				} else if (evt.keyCode) {					e.charCode = evt.keyCode;					e.which = evt.keyCode;				} else if (evt.which) {					e.keyCode = evt.which;					e.charCode = evt.which;				}				/**				 * @name event.preventDefault				 * @description 阻止事件默认行为				 * @private				 */				e.preventDefault = function () {					evt.returnValue = false;					if (evt.preventDefault){						evt.preventDefault();					}					e.isDefaultPrevented = true;				};				e.isDefaultPrevented = false;				/**				 * @name event.stopPropagation				 * @description 阻止事件冒泡				 * @private				 */				e.stopPropagation = function () {					evt.cancelBubble = true;					if (evt.stopPropagation){						evt.stopPropagation();					}					e.isPropagationStopped = true;				};				e.isPropagationStopped = false;				return e;			};			/**			 * @name event解析器			 * @private			 * @param {DOMElement} target			 * @param {String} eventName			 * @param {Function} [fn] Set function as event handler			 * @param {Number} [insertIndex] Insert function at given index			 */			function eventHandlers(target, eventName, fn, insertIndex) {								var name = fzxa.trim((eventName || '').replace(':', '.')),					eName = name.substr(0, name.indexOf('.') > -1 ? name.indexOf('.') : name.length),					nameSpace = name.substr(eName.length + 1) || '__default',					handlers = target.__jLimEventHandlers || {},					wrapFunc = function (event) {						if (fzxa.isFunction(curFunc))							curFunc.call(target);						triggerEvent(target, eName, [getEvent(event)]);					},					curFunc;				if (!fn) {					if (!handlers || !handlers[eName]){						return null;					}					return fzxa.trim(eventName) == eName || nameSpace == '__default' ? handlers[eName] : handlers[eName][nameSpace];				}				if (!handlers){					handlers = {};				}				if (!handlers[eName]) {					curFunc = target['on'+ eName];					target['on'+ eName] = wrapFunc;				}				if (!handlers[eName]){					handlers[eName] = {};				}				if (!handlers[eName][nameSpace]){					handlers[eName][nameSpace] = [];				}				if (typeof insertIndex == 'undefined') {					handlers[eName][nameSpace].push(fn);				} else {					handlers[eName][nameSpace].splice(insertIndex, 0, fn);				}				// set prop				target.__jLimEventHandlers = handlers;			}									/**			 * @private			 * @param {DOMElement} target			 * @param {String} eventName			 * @param {Array} args			 */			function triggerEvent(target, eventName, args) {				var handlers = eventHandlers(target, eventName),					fns;				// loop through handlers				for (var k in handlers) {					fns = handlers[k];					if (fzxa.isArray(fns)) {						for(var i in fns) {							fns[i].apply(target, args);						}					} else {						fns.apply(target, args);					}				}			};						//@todo FzxaJS简单事件封装			fzxa.fn.extend({								/**				 * @name event.bind				 * @public				 * @param {String} eventName				 * @param {Function} fn				 * @param {Number} insertIndex				 * @example				 * Fzxa('#test').bind('click',function(e){				 * 		alert('event start');				 * });				 */				bind: function(eventName,fn,insertIndex){					var events = eventName.split(' ');					return this.each(function (k,elem) {						for (var key in events){							eventHandlers(elem, events[key], fn);						}					});				},								/**				 * @name event.unbind				 * @public				 * @param {String} eventName				 * @param {Function} fn				 * @example				 * Fzxa('#test').unbind('click');				 */				unbind: function(eventName,fn){					var events = eventName.split(' ');					return this.each(function (k,elem) {						for (var name in events) {							var handlers = eventHandlers(elem, events[name]) || [],								fns, x, k;							if (fzxa.isArray(handlers)) {								for (x = 0; x < handlers.length; x++) {									if (handlers[x] === fn || !fn)										handlers.splice(x--, 1);								}							} else {								for (k in handlers) {									fns = handlers[k];									for (x = 0; x < fns.length; x++) {										if (fns[x] === fn || !fn)											fns.splice(x--, 1);									}								}							}						}					});				}							});						/**			 * @name event.blur			 */			/**			 * @name event.focus			 */			/**			 * @name event.focusin			 */			/**			 * @name event.load			 */			/**			 * @name event.resize			 */			/**			 * @name event.scroll			 */			/**			 * @name event.unload			 */			/**			 * @name event.click			 */			/**			 * @name event.dblclick			 */			/**			 * @name event.mousedown			 */			/**			 * @name event.mouseup			 */			/**			 * @name event.mousemove			 */			/**			 * @name event.mouseover			 */			/**			 * @name event.mouseout			 */			/**			 * @name event.mouseenter			 */			/**			 * @name event.mouseleave			 */			/**			 * @name event.change			 */			/**			 * @name event.select			 */			/**			 * @name event.submit			 */			/**			 * @name event.keydown			 */			/**			 * @name event.keypress			 */			/**			 * @name event.keyup			 */			/**			 * @name event.error			 */			/**			 * @name event.contextmenu			 */			var EventName = 'blur focus focusin focusout load resize scroll unload click dblclick ';			EventName += 'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ';			EventName += 'change select submit keydown keypress keyup error contextmenu';						fzxa.each(EventName.split(' '), function( data, fn){				if ( fn == null ) {					fn = data;					data = null;				}				fzxa.fn[fn] = function(f){					return this.bind(fn,f);				}			});		})();		/**		 * @name css		 * @namespace fzxa		 * @constructor		 */		fzxa.fn.extend({			/**			 * @name css.css			 * @description 添加css属性			 * @param  {Object|String} prop css属性或者对象			 * @param  {String} val  css属性名称			 * @return {This}			 */			css: function(prop, val){				var self = this;								if(fzxa.getType(prop) == 'string'){					this.each(this.data, function(no,el){						el.style[prop] = val;					});				}else{					this.each(prop, function(k,key){						self.css(k,key[k]);					});				}								return this;			},			/**			 * @name css.hasClass			 * @description 对象是否包含class			 * @param  {Elements} obj  元素对象			 * @param  {String} cls  class名称			 * @return {This}			 */			hasClass: function(obj,cls){				return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));			},						/**			 * @name css.addClass			 * @description 对象添加class			 * @param  {String} cls  class名称			 * @return {This}			 */			addClass: function(cls){				var self = this;				return this.each(this.data, function(no,el){					if (!self.hasClass(el, cls)) {						el.className = el.className.length > 0 ? el.className +' '+ cls : cls;					}				});			},			/**			 * @name css.removeClass			 * @description 对象移除class			 * @param  {String} cls  class名称			 * @return {This}			 */			removeClass: function(cls){				var self = this;				return this.each(this.data, function(no,el){					if (self.hasClass(el, cls)) {			            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');			            el.className = el.className.replace(reg, ' ');		            }				});            }		});				/**		 * @name attr		 * @constructor		 * @namespace fzxa		 * @description 设置元素属性		 */		fzxa.fn.extend({			/**			 * @name attr.attr			 * @description 设置元素属性			 * @param  {String} key  属性名称			 * @param  {String} value 属性值			 * @return {This}			 */			attr: function(key,value){				//Select ID				if(fzxa.getType(value) == 'undefined'){					return this.data[0].getAttribute(key);				}else{					return this.each(function(k,v){						v.setAttribute(key,value);					});				}							},			/**			 * @name attr.removeAttr			 * @description 移除元素属性			 * @param  {String} key  属性名称			 * @return {This}			 */			removeAttr: function(key){				return this.each(function(k,v){					v.removeAttribute(key)				});			}		});		/**		 * @name html		 * @constructor		 * @description HTML相关操作		 */		fzxa.fn.extend({			/**			 * @name html.text			 * @param  {String} text 设置text			 * @return {This}			 */			text: function(text){				if( fzxa.getType(text) == 'undefined' ){					if(this.data[0].hasOwnProperty('innerText')){						return this.data[0].innerText;					}else{						return this.data[0].textContent;					}				}else{					if(this.data[0].innerText){						return this.each(function(k,v){							v.innerText = text;						});					}else{						return this.each(function(k,v){							v.textContent = text;						});					}				}			},			/**			 * @name html.html			 * @param  {String} html 设置HTML			 * @return {This}			 */			html: function(html){				if( fzxa.getType(html) == 'undefined' ){					return this.data[0].innerHTML;				}else{					return this.each(function(k,v){						v.innerHTML = html;					});				}			},			/**			 * @name html.val			 * @param  {String} val 获取或者设置value			 * @return {This}			 */			val: function(val){				if( fzxa.getType(val) == 'undefined' ){					return this.data[0].value;				}else{					return this.each(function(k,v){						v.value = val;					});				}			}		});		fzxa.fn.extend({			/**			 * @name html.height			 * @param  {String} value 设置或获取高度			 * @return {This} 			 */			height: function(value){		        if(fzxa.getType(value) == 'undefined'){					var el = this.data[0];					if(el == window){						return document.documentElement.clientHeight;					}					return el.offsetHeight || (el.style.height ? parseInt(el.style.height.replace('px', '')) : 0);		        } else {		        	return this.each(function(k,v){		        		fzxa(v).css('height', value + 'px');		        	});		        }		    },		    /**		     * @name html.width		     * @param  {String} value 设置或获取宽度			 * @return {This} 		     */		    width: function(value){		    	if(fzxa.getType(value) == 'undefined'){					var el = this.data[0];					if(el == window){						return document.documentElement.clientWidth;					}					return el.offsetWidth || (el.style.width ? parseInt(el.style.width.replace('px', '')) : 0);		        } else {		            return this.each(function(k,v){		        		fzxa(v).css('width', value + 'px');		        	});		        }		    }		});		/**		 * @name cookie		 * @namespace fzxa		 * @constructor		 * @description cookie操作方法		 */		fzxa.extend({			cookie:{				/**				 * @name cookie.get				 * @description 读取cookie				 * @param {String} name 名称				 * @example				 * Fzxa.cookie.get('name');				 */				get: function(name){					var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');					return v ? decodeURIComponent(v[1]) : null;			    }, 							    /**			     * @name cookie.set			     * @description 设置cookie			     * @param {String} name    名称			     * @param {String} value   设置值			     * @param {String} expires 过期事件			     * @param {String} path    路径			     * @param {String} domain  域名			     * @example			     * Fzxa.cookie.set('name','112345');				 * Fzxa.cookie.set('name','sdf','','/','');			     */			    set: function(name, value ,expires, path, domain){			        var str = name + "=" + encodeURIComponent(value);					if (expires != null || expires != '') {						if (expires == 0) {expires = 100*365*24*60;}						var exp = new Date();						exp.setTime(exp.getTime() + expires*60*1000);						str += "; expires=" + exp.toGMTString();					}					if (path) {str += "; path=" + path;}					if (domain) {str += "; domain=" + domain;}					document.cookie = str;			    },			    /**			     * @name cookie.del			     * @description 删除cookie			     * @param {String} name    名称			     * @param {String} value   设置值			     * @param {String} domain  域名			     * @example			     * Fzxa.cookie.del('name');			     */			    del: function(name, path, domain){			        document.cookie = name + "=" +						((path) ? "; path=" + path : "") +						((domain) ? "; domain=" + domain : "") +						"; expires=Thu, 01-Jan-70 00:00:01 GMT";			    }			}		});		fzxa.fn.extend({			/**			 * @name animate			 * @constructor			 * @description 动画效果函数			 * @param  {Array}   css      设置css样式			 * @param  {Function} callback 回调函数			 * @param  {Number}   duration 动画执行时间			 * @return {This}			 * @example			 * Fzxa('#test').bind('click',function(){             *		Fzxa('#test').animate([             *			[0, 200, 'left', 'px'],			 * 			[1,0,'opacity','']             *			],function(){             *				alert('success');             *		},1000);             * });			 */			animate:function (css, callback, duration) {				var elem = this.data[0],				duration = duration || 1000;				var fx = function (ontween, onend, duration) {				        var pos, runTime,				            startTime = + new Date,				            timer = setInterval(function () {				                    runTime = + new Date - startTime;				                    pos = runTime / duration;				                    if (pos >= 1) {				                            clearInterval(timer);				                            onend(pos);				                    } else {				                            ontween(pos);				                    };				            }, 16);				};				/**				 * @name animate.ontween				 * @description 动画执行参数计算				 * @param  {Array} pos css参数				 * @private				 */				function ontween (pos) {				        var obj, val, form, to, name, unit,				            i = 0, len = css.length;				        for (; i < len; i++) {				            obj = css[i];				            from = obj[0];				            to = obj[1];				            name = obj[2];				            unit = obj[3];														if(fzxa.Browser.ie &&  name == 'opacity'){								name = 'filter';								val = from + (to - from) * pos;								elem.style.filter = "Alpha(Opacity="+val.toString().substr(0,4) * 100+")";							}else{								val = from + (to - from) * pos;								elem.style[name] = val + unit;							}				        };				};				/**				 * @name animate.onend				 * @description 动画执行结束				 * @param  {Array} pos css参数				 * @private				 */				function onend (pos) {			        ontween(pos);			        callback && callback.call(elem);				};				fx(ontween, onend, duration);				return this;			}		});		/**		 * @name require		 * @constructor		 * @param {String} js JS载入路径		 * @param {Callback} func 回调函数		 * @description 异步载入资源		 * @return {Object}		 * @example		 * Fzxa.require('./test.js',function(){		 * 		alert('success');		 * });		 */		fzxa.extend({					require :function(js,func){				var script = document.createElement('script');				script.type='text/javascript';    								if (script.readyState){ 				script.onreadystatechange = function(){   					if(script.readyState == "loaded" || script.readyState == "complete"){     						script.onreadystatechange = null; 															 func&&func();  		           						  }					 };				 }else {					  script.onload = function(){							func&&func(); 					  }				 }  				 script.src = js; 				 document.getElementsByTagName('head')[0].appendChild(script);			}		});		var _$ = window.$;		/**		 * @name noConflict		 * @static		 * @description 使用 noConflict() 方法为 $ 变量规定新的名称		 * @return {Object}		 * @example		 * var F = Fzxa.noConflict();		 */	    fzxa.noConflict = function() {			if (window.$ === fzxa) {				window.$ = _$;			}			return fzxa;		};		window.fzxa = window.Fzxa= window.$ = fzxa;			}})(this, this.document);//end fzxa.js