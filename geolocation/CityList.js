  1 /**
  2  * @fileoverview 百度地图的城市列表类，对外开放。
  3  * 帮助用户直接生成城市列表，并自定义点击城市的操作。
  4  * 使用者可以通过接口直接获取城市数据。
  5  * 主入口类是<a href="symbols/BMapLib.CityList.html">CityList</a>，
  6  * 基于Baidu Map API 1.5。
  7  *
  8  * @author Baidu Map Api Group 
  9  * @version 1.5
 10  */
 11 
 12 /** 
 13  * @namespace BMap的所有library类均放在BMapLib命名空间下
 14  */
 15 var BMapLib = window.BMapLib = BMapLib || {};
 16 
 17 (function() {
 18     /**
 19      * 声明baidu包
 20      */
 21     var baidu = baidu || {guid : "$BAIDU$"};
 22     (function() {
 23         // 一些页面级别唯一的属性，需要挂载在window[baidu.guid]上
 24         window[baidu.guid] = {};
 25 
 26         /**
 27          * 将源对象的所有属性拷贝到目标对象中
 28          * @name baidu.extend
 29          * @function
 30          * @grammar baidu.extend(target, source)
 31          * @param {Object} target 目标对象
 32          * @param {Object} source 源对象
 33          * @returns {Object} 目标对象
 34          */
 35         baidu.extend = function (target, source) {
 36             for (var p in source) {
 37                 if (source.hasOwnProperty(p)) {
 38                     target[p] = source[p];
 39                 }
 40             }    
 41             return target;
 42         };
 43 
 44         /**
 45          * @ignore
 46          * @namespace
 47          * @baidu.lang 对语言层面的封装，包括类型判断、模块扩展、继承基类以及对象自定义事件的支持。
 48          * @property guid 对象的唯一标识
 49         */
 50         baidu.lang = baidu.lang || {};
 51 
 52         /**
 53          * 返回一个当前页面的唯一标识字符串。
 54          * @function
 55          * @grammar baidu.lang.guid()
 56          * @returns {String} 当前页面的唯一标识字符串
 57          */
 58         baidu.lang.guid = function() {
 59             return "TANGRAM__" + (window[baidu.guid]._counter ++).toString(36);
 60         };
 61 
 62         window[baidu.guid]._counter = window[baidu.guid]._counter || 1;
 63 
 64         /**
 65          * 所有类的实例的容器
 66          * key为每个实例的guid
 67          */
 68         window[baidu.guid]._instances = window[baidu.guid]._instances || {};
 69 
 70         /**
 71          * Tangram继承机制提供的一个基类，用户可以通过继承baidu.lang.Class来获取它的属性及方法。
 72          * @function
 73          * @name baidu.lang.Class
 74          * @grammar baidu.lang.Class(guid)
 75          * @param {string} guid	对象的唯一标识
 76          * @meta standard
 77          * @remark baidu.lang.Class和它的子类的实例均包含一个全局唯一的标识guid。
 78          * guid是在构造函数中生成的，因此，继承自baidu.lang.Class的类应该直接或者间接调用它的构造函数。<br>
 79          * baidu.lang.Class的构造函数中产生guid的方式可以保证guid的唯一性，及每个实例都有一个全局唯一的guid。
 80          */
 81         baidu.lang.Class = function(guid) {
 82             this.guid = guid || baidu.lang.guid();
 83             window[baidu.guid]._instances[this.guid] = this;
 84         };
 85 
 86         window[baidu.guid]._instances = window[baidu.guid]._instances || {};
 87 
 88         /**
 89          * 判断目标参数是否string类型或String对象
 90          * @name baidu.lang.isString
 91          * @function
 92          * @grammar baidu.lang.isString(source)
 93          * @param {Any} source 目标参数
 94          * @shortcut isString
 95          * @meta standard
 96          *             
 97          * @returns {boolean} 类型判断结果
 98          */
 99         baidu.lang.isString = function (source) {
100             return '[object String]' == Object.prototype.toString.call(source);
101         };
102 
103         /**
104          * 判断目标参数是否为function或Function实例
105          * @name baidu.lang.isFunction
106          * @function
107          * @grammar baidu.lang.isFunction(source)
108          * @param {Any} source 目标参数
109          * @returns {boolean} 类型判断结果
110          */
111         baidu.lang.isFunction = function (source) {
112             return '[object Function]' == Object.prototype.toString.call(source);
113         };
114 
115         /**
116          * 重载了默认的toString方法，使得返回信息更加准确一些。
117          * @return {string} 对象的String表示形式
118          */
119         baidu.lang.Class.prototype.toString = function(){
120             return "[object " + (this._className || "Object" ) + "]";
121         };
122 
123         /**
124          * 自定义的事件对象。
125          * @function
126          * @name baidu.lang.Event
127          * @grammar baidu.lang.Event(type[, target])
128          * @param {string} type	 事件类型名称。为了方便区分事件和一个普通的方法，事件类型名称必须以"on"(小写)开头。
129          * @param {Object} [target]触发事件的对象
130          * @meta standard
131          * @remark 引入该模块，会自动为Class引入3个事件扩展方法：addEventListener、removeEventListener和dispatchEvent。
132          * @see baidu.lang.Class
133          */
134         baidu.lang.Event = function (type, target) {
135             this.type = type;
136             this.returnValue = true;
137             this.target = target || null;
138             this.currentTarget = null;
139         };
140 
141         /**
142          * 注册对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
143          * @grammar obj.addEventListener(type, handler[, key])
144          * @param 	{string}   type         自定义事件的名称
145          * @param 	{Function} handler      自定义事件被触发时应该调用的回调函数
146          * @param 	{string}   [key]		为事件监听函数指定的名称，可在移除时使用。如果不提供，方法会默认为它生成一个全局唯一的key。
147          * @remark 	事件类型区分大小写。如果自定义事件名称不是以小写"on"开头，该方法会给它加上"on"再进行判断，即"click"和"onclick"会被认为是同一种事件。 
148          */
149         baidu.lang.Class.prototype.addEventListener = function (type, handler, key) {
150             if (!baidu.lang.isFunction(handler)) {
151                 return;
152             }
153             !this.__listeners && (this.__listeners = {});
154             var t = this.__listeners, id;
155             if (typeof key == "string" && key) {
156                 if (/[^\w\-]/.test(key)) {
157                     throw("nonstandard key:" + key);
158                 } else {
159                     handler.hashCode = key; 
160                     id = key;
161                 }
162             }
163             type.indexOf("on") != 0 && (type = "on" + type);
164             typeof t[type] != "object" && (t[type] = {});
165             id = id || baidu.lang.guid();
166             handler.hashCode = id;
167             t[type][id] = handler;
168         };
169          
170         /**
171          * 移除对象的事件监听器。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
172          * @grammar obj.removeEventListener(type, handler)
173          * @param {string}   type     事件类型
174          * @param {Function|string} handler  要移除的事件监听函数或者监听函数的key
175          * @remark 	如果第二个参数handler没有被绑定到对应的自定义事件中，什么也不做。
176          */
177         baidu.lang.Class.prototype.removeEventListener = function (type, handler) {
178             if (baidu.lang.isFunction(handler)) {
179                 handler = handler.hashCode;
180             } else if (!baidu.lang.isString(handler)) {
181                 return;
182             }
183             !this.__listeners && (this.__listeners = {});
184             type.indexOf("on") != 0 && (type = "on" + type);
185             var t = this.__listeners;
186             if (!t[type]) {
187                 return;
188             }
189             t[type][handler] && delete t[type][handler];
190         };
191 
192         /**
193          * 派发自定义事件，使得绑定到自定义事件上面的函数都会被执行。引入baidu.lang.Event后，Class的子类实例才会获得该方法。
194          * @grammar obj.dispatchEvent(event, options)
195          * @param {baidu.lang.Event|String} event 	Event对象，或事件名称(1.1.1起支持)
196          * @param {Object} options 扩展参数,所含属性键值会扩展到Event对象上(1.2起支持)
197          * @remark 处理会调用通过addEventListenr绑定的自定义事件回调函数之外，还会调用直接绑定到对象上面的自定义事件。
198          * 例如：<br>
199          * myobj.onMyEvent = function(){}<br>
200          * myobj.addEventListener("onMyEvent", function(){});
201          */
202         baidu.lang.Class.prototype.dispatchEvent = function (event, options) {
203             if (baidu.lang.isString(event)) {
204                 event = new baidu.lang.Event(event);
205             }
206             !this.__listeners && (this.__listeners = {});
207             options = options || {};
208             for (var i in options) {
209                 event[i] = options[i];
210             }
211             var i, t = this.__listeners, p = event.type;
212             event.target = event.target || this;
213             event.currentTarget = this;
214             p.indexOf("on") != 0 && (p = "on" + p);
215             baidu.lang.isFunction(this[p]) && this[p].apply(this, arguments);
216             if (typeof t[p] == "object") {
217                 for (i in t[p]) {
218                     t[p][i].apply(this, arguments);
219                 }
220             }
221             return event.returnValue;
222         };
223 
224         /**
225          * 为类型构造器建立继承关系
226          * @name baidu.lang.inherits
227          * @function
228          * @grammar baidu.lang.inherits(subClass, superClass[, className])
229          * @param {Function} subClass 子类构造器
230          * @param {Function} superClass 父类构造器
231          * @param {string} className 类名标识
232          * @remark 使subClass继承superClass的prototype，
233          * 因此subClass的实例能够使用superClass的prototype中定义的所有属性和方法。<br>
234          * 这个函数实际上是建立了subClass和superClass的原型链集成，并对subClass进行了constructor修正。<br>
235          * <strong>注意：如果要继承构造函数，需要在subClass里面call一下，具体见下面的demo例子</strong>
236          * @shortcut inherits
237          * @meta standard
238          * @see baidu.lang.Class
239          */
240         baidu.lang.inherits = function (subClass, superClass, className) {
241             var key, proto, 
242                 selfProps = subClass.prototype, 
243                 clazz = new Function();        
244             clazz.prototype = superClass.prototype;
245             proto = subClass.prototype = new clazz();
246             for (key in selfProps) {
247                 proto[key] = selfProps[key];
248             }
249             subClass.prototype.constructor = subClass;
250             subClass.superClass = superClass.prototype;
251 
252             if ("string" == typeof className) {
253                 proto._className = className;
254             }
255         };
256 
257         /**
258          * @ignore
259          * @namespace baidu.dom 操作dom的方法。
260          */
261         baidu.dom = baidu.dom || {};
262 
263         /**
264          * 从文档中获取指定的DOM元素
265          * @name baidu.dom.g
266          * @function
267          * @grammar baidu.dom.g(id)
268          * @param {string|HTMLElement} id 元素的id或DOM元素
269          * @meta standard
270          *             
271          * @returns {HTMLElement|null} 获取的元素，查找不到时返回null,如果参数不合法，直接返回参数
272          */
273         baidu.g = baidu.dom.g = function (id) {
274             if ('string' == typeof id || id instanceof String) {
275                 return document.getElementById(id);
276             } else if (id && id.nodeName && (id.nodeType == 1 || id.nodeType == 9)) {
277                 return id;
278             }
279             return null;
280         };
281         
282         /**
283          * @ignore
284          * @namespace baidu.browser 判断浏览器类型和特性的属性。
285          */
286         baidu.browser = baidu.browser || {};
287 
288         if (/msie (\d+\.\d)/i.test(navigator.userAgent)) {
289             //IE 8下，以documentMode为准
290             /**
291              * 判断是否为ie浏览器
292              * @property ie ie版本号
293              * @grammar baidu.browser.ie
294              * @meta standard
295              * @shortcut ie
296              * @see baidu.browser.firefox,baidu.browser.safari,baidu.browser.opera,baidu.browser.chrome,baidu.browser.maxthon 
297              */
298             baidu.browser.ie = baidu.ie = document.documentMode || + RegExp['\x241'];
299         }
300 
301         /**
302          * 提供给setAttr与getAttr方法作名称转换使用
303          * ie6,7下class要转换成className
304          * @meta standard
305          */
306 
307         baidu.dom._NAME_ATTRS = (function () {
308             var result = {
309                 'cellpadding': 'cellPadding',
310                 'cellspacing': 'cellSpacing',
311                 'colspan': 'colSpan',
312                 'rowspan': 'rowSpan',
313                 'valign': 'vAlign',
314                 'usemap': 'useMap',
315                 'frameborder': 'frameBorder'
316             };
317             
318             if (baidu.browser.ie < 8) {
319                 result['for'] = 'htmlFor';
320                 result['class'] = 'className';
321             } else {
322                 result['htmlFor'] = 'for';
323                 result['className'] = 'class';
324             }
325             
326             return result;
327         })();
328 
329         /**
330          * 获取目标元素的属性值
331          * @name baidu.dom.getAttr
332          * @function
333          * @grammar baidu.dom.getAttr(element, key)
334          * @param {HTMLElement|string} element 目标元素或目标元素的id
335          * @param {string} key 要获取的attribute键名
336          * @shortcut getAttr
337          * @meta standard
338          * @see baidu.dom.setAttr,baidu.dom.setAttrs
339          *             
340          * @returns {string|null} 目标元素的attribute值，获取不到时返回null
341          */
342         baidu.getAttr = baidu.dom.getAttr = function (element, key) {
343             element = baidu.dom.g(element);
344 
345             if ('style' == key){
346                 return element.style.cssText;
347             }
348 
349             key = baidu.dom._NAME_ATTRS[key] || key;
350             return element.getAttribute(key);
351         };
352 
353         /**
354          * @ignore
355          * @namespace baidu.event 屏蔽浏览器差异性的事件封装。
356          * @property target 	事件的触发元素
357          * @property pageX 		鼠标事件的鼠标x坐标
358          * @property pageY 		鼠标事件的鼠标y坐标
359          * @property keyCode 	键盘事件的键值
360          */
361         baidu.event = baidu.event || {};
362 
363         /**
364          * 事件监听器的存储表
365          * @private
366          * @meta standard
367          */
368         baidu.event._listeners = baidu.event._listeners || [];
369 
370         /**
371          * 为目标元素添加事件监听器
372          * @name baidu.event.on
373          * @function
374          * @grammar baidu.event.on(element, type, listener)
375          * @param {HTMLElement|string|window} element 目标元素或目标元素id
376          * @param {string} type 事件类型
377          * @param {Function} listener 需要添加的监听器
378          * @remark
379          *  1. 不支持跨浏览器的鼠标滚轮事件监听器添加<br>
380          *  2. 改方法不为监听器灌入事件对象，以防止跨iframe事件挂载的事件对象获取失败            
381          * @shortcut on
382          * @meta standard
383          * @see baidu.event.un
384          *             
385          * @returns {HTMLElement|window} 目标元素
386          */
387         baidu.on = baidu.event.on = function (element, type, listener) {
388             type = type.replace(/^on/i, '');
389             element = baidu.g(element);
390             var realListener = function (ev) {
391                 // 1. 这里不支持EventArgument,  原因是跨frame的事件挂载
392                 // 2. element是为了修正this
393                 listener.call(element, ev);
394             },
395             lis = baidu.event._listeners,
396             filter = baidu.event._eventFilter,
397             afterFilter,
398             realType = type;
399             type = type.toLowerCase();
400             // filter过滤
401             if(filter && filter[type]){
402                 afterFilter = filter[type](element, type, realListener);
403                 realType = afterFilter.type;
404                 realListener = afterFilter.listener;
405             }
406             // 事件监听器挂载
407             if (element.addEventListener) {
408                 element.addEventListener(realType, realListener, false);
409             } else if (element.attachEvent) {
410                 element.attachEvent('on' + realType, realListener);
411             }
412           
413             // 将监听器存储到数组中
414             lis[lis.length] = [element, type, listener, realListener, realType];
415             return element;
416         };
417     })();
418 
419     /**
420      * @fileoverview 数据管理模块.
421      */
422     var DataMgr = {
423       /**
424        * 请求函数
425        * @param String 地址.
426        * @param Function 回调函数.
427        */
428       request: function(url, cbk) {
429         if (cbk) {
430             // 生成随机数
431             var timeStamp = (Math.random() * 100000).toFixed(0);
432             // 全局回调函数
433             BMap["_rd"]["_cbk" + timeStamp] = function(json){
434               cbk && cbk(json);
435               delete BMap["_rd"]["_cbk" + timeStamp];
436             };
437             url += "&callback=BMap._rd._cbk" + timeStamp;
438         }
439 
440         var script = document.createElement('script');
441         script.setAttribute('src', url);
442         document.body.appendChild(script);
443         // 脚本加载完成后进行移除
444         if (script.addEventListener) {
445           script.addEventListener('load', function(e) {
446             var t = e.target;
447             t.parentNode.removeChild(t);
448           }, false);
449         }
450         else if (script.attachEvent) {
451           script.attachEvent('onreadystatechange', function(e) {
452             var t = window.event.srcElement;
453             if (t && (t.readyState == 'loaded' || t.readyState == 'complete')) {
454               t.parentNode.removeChild(t);
455             }
456           });
457         }
458         // 使用setTimeout解决ie6无法发送问题
459         setTimeout(function() {
460           document.getElementsByTagName('head')[0].appendChild(script);
461           script = null;
462         }, 1);
463       }
464     };
465 
466     var config = {
467         serviceUrl : "http://cq01-rdqa-pool179.cq01.baidu.com:8800"
468     }
469 
470     function geoToPoint(geo) {
471         var projection = BMAP_NORMAL_MAP.getProjection();
472         var point = null;
473         geo = geo.split('|')[2];
474         geo = geo.substr(0, geo.length - 1);
475         geo = geo.split(',');
476         var point = projection.pointToLngLat(new BMap.Pixel(geo[0], geo[1]));
477         return point;
478     }
479 
480     function coordinateToPoints(coordinate) {
481         var projection = BMAP_NORMAL_MAP.getProjection();
482         var points = [];
483         coordinate = coordinate.split(';');
484         for (var i = 0, len = coordinate.length; i < len; i++) {
485             var pos = coordinate[i].split(',');
486             var point = projection.pointToLngLat(new BMap.Pixel(pos[0], pos[1]));
487             points.push(point);
488         }
489         return points;
490     }
491 
492     /** 
493      * @exports CityList as BMapLib.CityList 
494      */
495     var CityList =
496         /**
497          * CityList类的构造函数
498          * @class 城市列表类，
499          * 实例化该类后，可以帮助用户直接生成城市列表，
500          * 也可以通过接口获取城市数据。
501          * 
502          * @constructor
503          * @param {Json Object} opts 可选的输入参数，非必填项。可输入选项包括：<br />
504          * {"<b>container</b>" : {String|HTMLElement} 需要提供界面方式展现的容器。如果此参数为空，则不提供界面方式，也没有cityclick的事件派发
505          * <br />"<b>map</b>" : {BMap} 实例化的map对象，如果传入此参数，则用户点击界面中的城市时，可以直接帮助用户定位到地图的相关城市位置}
506          *
507          * @example <b>参考示例：</b><br />
508          * var myCityListObject = new BMapLib.CityList({container : "container"});
509          */
510         BMapLib.CityList = function(opts){
511 
512             opts = opts || {};
513             /**
514              * _opts是默认参数赋值。
515              * 下面通过用户输入的opts，对默认参数赋值
516              * @private
517              * @type {Json}
518              */
519             this._opts = baidu.extend(
520                 baidu.extend(this._opts || {}, {
521 
522                     /**
523                      * 提供界面方式展现的容器
524                      * @private
525                      * @type {String|HTMLElement}
526                      */
527                     container : null,
528 
529                     /**
530                      * 实例化的BMap对象
531                      * @private
532                      * @type {BMap}
533                      */
534                      map : null
535                 })
536             , opts);
537 
538             /**
539              * 城市数据的存储
540              * @private
541              * @type {Json}
542              */
543              this._data = null;
544 
545              this._init();
546 
547         }
548     
549     // 通过baidu.lang下的inherits方法，让CityList继承baidu.lang.Class
550     baidu.lang.inherits(CityList, baidu.lang.Class, "CityList");
551 
552     CityList.prototype._init = function () {
553         if (this._opts.container) {
554             this._initContainer();
555         }
556     }
557 
558     /**
559      * 获取商圈数据
560      * @param {String} 商圈名称
561      * @param {Function} 回调函数,结果在回调函数中回传
562      * [<br/>
563      *     {<br/>
564      *         city: "北京市",      //商圈所在城市名<br/>
565      *         coordinate: {Array}, //商圈所在的坐标范围，Point数组<br/>
566      *         district: "海淀区",  //商圈所在的区域<br/>
567      *         type: "4-优质商圈"   //商圈的类型<br/>
568      *     }<br/>
569      * ]<br/>
570      *
571      */
572     CityList.prototype.getBusiness = function (business, cbk) {
573         var url = config.serviceUrl + "/shangquan/reverse/?wd=" + business;
574         DataMgr.request(url,function(json){
575             var result = null;
576             if (json && json['error'] && json['error']['errno'] == "0") {
577                 result = json['content'];
578             }
579 
580             for (var i = 0, len = result.length; i < len; i++) {
581                 result[i]['coordinate'] = coordinateToPoints(result[i]['coordinate']);
582             }
583 
584             if (cbk) {
585                 cbk(result);
586             }
587         });
588     }
589 
590     /**
591      * 获取下级的区域列表
592      * @param {String} 城市代码(cityCode)，参考百度地图城市名称-城市代码（cityCode）关系对照：http://developer.baidu.com/map/devRes.htm
593      * @param {Function} 回调函数,结果在回调函数中回传<br/>
594      * 返回的json结果代表的意思<br/>
595      * {<br/>
596      *     area_code: 131, //城市区域code<br/>
597      *     area_name: "北京市", //城市区域名称<br/>
598      *     area_type: 2, //城市区域类型<br/>
599      *     geo: {Point}, //城市区域中心点<br/>
600      *     sup_business_area: 0 ,//是否存在商圈，仅在区的级别（area_type=3）才会有此字段<br/>
601      *     sub: {Array} //下级区域列表, 里面内容同上面的那些字段<br/>
602      * }<br/>
603      */
604     CityList.prototype.getSubAreaList = function (areaCode, cbk) {
605         var url = config.serviceUrl + "/shangquan/forward/?qt=sub_area_list&ext=1&level=1&areacode=" + areaCode + "&business_flag=0";
606         DataMgr.request(url,function(json){
607             var result = null;
608             if (json && json['result'] && json['result']['error'] == "0") {
609                 result = json['content'];
610             }
611 
612             result.geo = geoToPoint(result.geo);
613 
614             for (var i = 0, len = result.sub.length; i < len; i++) {
615                 result.sub[i]['geo'] = geoToPoint(result.sub[i]['geo']);
616             }
617 
618             if (cbk) {
619                 cbk(result);
620             }
621         });
622     }
623 
624     CityList.prototype._initContainer = function () {
625         
626         var me = this;
627 
628         /*请城市地区*/
629         function selectArea(areacode, id, level, isbusiness){
630             selectArea.id = id;
631             selectArea.level = level;
632             var t= new Date().getTime();
633             var url = AreaUrl + "&areacode=" + areacode;
634             if (isbusiness) {
635                 url += "&business_flag=1";
636             } else {
637                 url += "&business_flag=0";
638             }
639             DataMgr.request(url,getAreaData);
640         }
641 
642         function getAreaData(data){
643             var subList = "";//城区列表
644             if(data.content){
645                 var c = data.content;
646                 var html = [];
647                 var geo = execGeo(c.geo);
648                 var mp = new BMap.MercatorProjection();
649                 var po = mp.pointToLngLat(new BMap.Pixel(geo.x, geo.y))
650                 if(data.content.area_code == 1){
651                     var point = new BMap.Point(116.403119,39.92069);
652                     map.centerAndZoom(point, 12);
653                 }else{
654                     var point = new BMap.Point(po.lng, po.lat);
655                     map.centerAndZoom(point, selectArea.level);
656                 }
657                 /*渲染城市*/
658                 if(data.content.sub){
659                     subList = c.sub;
660                     subList.splice(0,0,{area_name:'请选择', area_code:''});
661                     var fragment = document.createDocumentFragment();
662                     var o;
663                     var citycode = {131: 1, 289: 2, 332: 3, 132: 4};
664                     for(var i=0; i<subList.length;i++){
665                         subList[i].sort = subList[i].area_code ? citycode[subList[i].area_code] || 5 : 0 ;
666                     }
667                     subList.sort(function(a, b){
668                         return a.sort - b.sort;
669                     });
670                     for(var i=0; i<subList.length;i++){
671                         o = document.createElement("option");
672                         o.innerHTML = subList[i].area_name;
673                         o.area_type = subList[i].area_type;
674                         o.geo = subList[i].geo;
675                         if (subList[i].business_geo) {
676                             o.business_geo = subList[i].business_geo;
677                         }
678                         o.value = subList[i].area_code;
679                         o.title = subList[i].area_name;
680                         fragment.appendChild(o);
681                     }
682                     subList.shift();
683                     if(selectArea.id){
684                         selectArea.id.innerHTML = '';
685                         selectArea.id.appendChild(fragment);
686                     }
687                 }
688             }		
689         }
690 
691         function execGeo(str){
692            var reg = /([^\|;]*)(?=;)/;
693            var myStr = reg.exec(str);
694            var myArr_x = myStr[0].split(",")[0]*1
695            var myArr_y = myStr[0].split(",")[1]*1
696            var geo = {"x":myArr_x,"y":myArr_y}
697            return geo;
698         }
699 
700 
701         var AreaUrl = config.serviceUrl + "/shangquan/forward/?qt=sub_area_list&ext=1&level=1"
702 
703         var cssText = "width:70px;margin:0 5px;";
704         var container = baidu.g(this._opts.container),
705             provinceDom = document.createElement('select'),
706             cityDom = document.createElement('select'),
707             boroughDom = document.createElement('select'),
708             businessDom = document.createElement('select');
709         provinceDom.style.cssText = cssText;
710         cityDom.style.cssText = cssText;
711         boroughDom.style.cssText = cssText;
712         businessDom.style.cssText = cssText;
713         container.appendChild(provinceDom);
714         container.appendChild(document.createTextNode('省'));
715         container.appendChild(cityDom);
716         container.appendChild(document.createTextNode('市'));
717         container.appendChild(boroughDom);
718         container.appendChild(document.createTextNode('区'));
719         container.appendChild(businessDom);
720         container.appendChild(document.createTextNode('商圈'));
721 
722         /*第一步 表单操作*/
723         baidu.on(provinceDom, "change", function(){
724             var s_value = provinceDom.value;
725             cityDom.innerHTML = boroughDom.innerHTML = businessDom.innerHTML = "";
726             if( s_value == 131 || s_value == 289 || s_value == 332 || s_value == 132){
727                 var cityName = ""
728                 switch(s_value){
729                     case "131" : cityName = "北京市";
730                     break;
731                     case "289" : cityName = "上海市";
732                     break;
733                     case "332" : cityName = "天津市";
734                     break;
735                     case "132" : cityName = "重庆市";
736                     break;
737                 }
738                 var fragment = document.createDocumentFragment();
739                     var o;
740                     o = document.createElement("option");
741                     o.innerHTML = cityName;
742                     o.value = s_value;
743                     o.title = cityName;
744                     fragment.appendChild(o);
745                 cityDom.appendChild(fragment)
746                 selectArea(s_value, boroughDom, 12); 
747             }else{
748                 selectArea(s_value, cityDom, 12); 
749             }
750             dispatchCityClick(this.options[this.selectedIndex]);
751         });
752         baidu.on(cityDom, "change", function(){
753             var s_value = cityDom.value;
754             selectArea(s_value, boroughDom, 12); 
755             boroughDom.innerHTML = "";
756             dispatchCityClick(this.options[this.selectedIndex]);
757         });
758 
759         baidu.on(boroughDom, "change", function(){
760             var s_value = boroughDom.value;
761             selectArea(s_value, businessDom, 12, 1) 
762             businessDom.innerHTML = "";
763             dispatchCityClick(this.options[this.selectedIndex]);
764         });
765 
766         function dispatchCityClick(option){
767             /**
768              * 点击城市名时，派发事件的接口
769              * @name CityList#oncityclick
770              * @event
771              * @param {Event Object} e 回调函数会返回event参数，包括以下返回值：
772              * <br />{"<b>area_name</b> : {String} 点击的区域名称,
773              * <br />{"<b>area_code</b> : {String} 点击的区域代码,
774              * <br />"<b>geo</b>：{BMap.Point} 点击区域合适显示的中心点位置,
775              * <br />"<b>area_type</b>：{Number} 该区域的类型(全国0、省1、城市2)
776              *
777              * @example <b>参考示例：</b><br />
778              * myCityListObject.addEventListener("cityclick", function(e) {  alert(e.area_name);  });
779              */
780             me.dispatchEvent('cityclick', {
781                 area_code: option.value,
782                 area_type: option.area_type,
783                 geo: geoToPoint(option.geo),
784                 area_name: option.title
785             });
786         }
787 
788         var polygon = new BMap.Polygon();
789         map.addOverlay(polygon);
790         polygon.hide();
791         baidu.on(businessDom, "change", function(e){
792             var s_value = businessDom.value;
793             var option = this.options[this.selectedIndex];
794             var geo = execGeo(option.geo);
795             var mp = new BMap.MercatorProjection();
796             var po = mp.pointToLngLat(new BMap.Pixel(geo.x, geo.y));
797 
798             var business_geo = option.business_geo;
799             business_geo = business_geo.split(';');
800             for (var i = 0,len = business_geo.length; i < len; i++) {
801                 var business_p = business_geo[i].split(',');
802                 business_geo[i] = mp.pointToLngLat(new BMap.Pixel(business_p[0], business_p[1]))
803             }
804             polygon.show();
805             polygon.setPath(business_geo);
806             map.setViewport(business_geo);
807 
808             dispatchCityClick(this.options[this.selectedIndex]);
809 
810             //var point = new BMap.Point(po.lng, po.lat);
811             //map.centerAndZoom(point, 14);
812         });
813 
814         selectArea(1, provinceDom, 12); 
815     }
816 
817 })();
818 