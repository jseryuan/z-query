function ZQuery(arg){
	this.elements = [];//用来存放选取出来的元素
	this.domString = '';//用存 要创建节点字符串
	switch(typeof arg){
		case 'function'://onload
			domReady(arg);
		break;
		case 'string'://选择器  $('<li></li>')
		
			if(arg.indexOf('>')!=-1){
				this.domString = arg;
			}else{
				this.elements = getEle(arg);
			}
		break;
		
		case 'object':
			if(arg instanceof Array){
				this.elements = this.elements.concat(arg);
			}else{
				this.elements.push(arg);	
			}
			
		break;
	}
}
//DOM Ready onload
function domReady(fn){
	//FF chrome
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',fn,false);
	//IE	
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState == 'complete'){
				fn();
			}
		});
	}
}

// 选择器
function getByClass(oParent,sClass){
	//支持的浏览器
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
	//不支持
		var res = [];
		var aAll = oParent.getElementsByTagName('*');
		for(var i = 0;i<aAll.length;i++){
			//str = 'red on on2 active' ==aAll[i].className
			//var reg = /\bsClass\b/g;
			var reg = new RegExp('\\b'+sClass+'\\b','g');
			if(reg.test(aAll[i].className)){
				res.push(aAll[i]);
			}
		}
		return res;	
	}
}
function getByStr(str,aParent){//.red  #div1
	var aChild = [];
	for(var i = 0;i<aParent.length;i++){
		switch(str.charAt(0)){
			case '#':
			//id //#div1
			var obj = document.getElementById(str.substring(1));
			aChild.push(obj);
			break;
			//className .box
			case '.':
			// getByClass('li','active')
			var aRes = getByClass(aParent[i],str.substring(1));
			for(var j = 0;j<aRes.length;j++){
				aChild.push(aRes[j]);
			}
			break;
			default:
				//标签
			//li.red
			if(/\w+\.\w+/g.test(str)){
				var aStr = str.split('.');
				var aRes = aParent[i].getElementsByTagName(aStr[0]);
			var reg = new RegExp('\\b'+aStr[1]+'\\b','g');
				for(var j = 0;j<aRes.length;j++){
					if(reg.test(aRes[j].className)){
						aChild.push(aRes[j]);	
						
					}
				}
			// li:eq(2)	li:first
			}else if(/\w+\:\w+(\(\d+\))?/g.test(str)){
				var aStr = str.split(/\:|\(|\)/);
				//aStr[0]->li
				//aStr[1] ->eq
				//aStr[2] - > 3
				var n = aStr[2];
				var aRes = aParent[i].getElementsByTagName(aStr[0]);
				switch(aStr[1]){
					case 'eq':
					aChild.push(aRes[n]);
					break;
					case 'lt':
						for(var j = 0;j<n;j++){
							aChild.push(aRes[j]);
						}
					break;
					case 'gt':
						for(var j = n;j<aRes.length;j++){
							aChild.push(aRes[j]);
						}
					break;
					case 'even':
						for(var j = 0;j<aRes.length;j+=2){
							aChild.push(aRes[j]);
						}
					break;
					case 'odd':
						for(var j = 1;j<aRes.length;j+=2){
							aChild.push(aRes[j]);
						}
					break;
					
					case 'first':
						aChild.push(aRes[0]);
					break;
					case 'last':
						aChild.push(aRes[aRes.length-1]);
					break;
					
				}
				//input[type=btton]
			}else if(/\w+\[\w+\=\w+\]/g.test(str)){
				var aStr = str.split(/\[|\=|\]/g);
				//aStr[0] input
				//aStr[1] type
				//aStr[2] button
				var aRes = aParent[i].getElementsByTagName(aStr[0]);
				for(var j = 0;j<aRes.length;j++){
					//oBtn.getAttribute('type') == button
					if(aRes[j].getAttribute(aStr[1])==aStr[2]){
						aChild.push(aRes[j]);	
					}
				}
				
			}else{
				//标签选择器
				var aRes = aParent[i].getElementsByTagName(str);
				for(var j = 0;j<aRes.length;j++){
					aChild.push(aRes[j]);
				}
			}	
			break;
		}
	}
	
	return aChild;
}
function getEle(str,aParent){
	//?????
	
	var arr = str.replace(/^\s+|\s+$/g,'').split(/\s+/g);
	var aChild = [];
	var aParent = aParent||[document];
	for(var i = 0;i<arr.length;i++){
		aChild = getByStr(arr[i],aParent);
		aParent = aChild;
	}
	return aChild;
}
function $(arg){
	return new ZQuery(arg);
}
//css
ZQuery.prototype.css = function(name,value){
	//单个设置样式 background red
	if(arguments.length==2){
		for(var i = 0;i<this.elements.length;i++){
			this.elements[i].style[name] = value;
		}
	}else{
		switch(typeof name){
			case 'string':
			//读取
			return this.elements[0].style[name];
			break;
			case 'object':	
			var json = name;
			for(var i = 0;i<this.elements.length;i++){
				for(var name in json){
					this.elements[i].style[name] = json[name];
				}
			}
			
			break;
		}
		
	}
	return this;
};
//
ZQuery.prototype.attr = function(name,value){
	//单个设置属性
	if(arguments.length==2){
		for(var i = 0;i<this.elements.length;i++){
			this.elements[i].setAttribute(name,value);
		}
	}else{
		switch(typeof name){
			case 'string':
			//读取
			return this.elements[0].getAttribute(name);
			break;
			case 'object':	
			var json = name;
			for(var i = 0;i<this.elements.length;i++){
				for(var name in json){
					this.elements[i].setAttribute(name,json[name]);
				}
			}
			
			break;
		}
		
	}

};

//click 事件都是绑定的
/*
ZQuery.prototype.click = function(fn){
	for(var i = 0;i<this.elements.length;i++){
		addEvent(this.elements[i],'click',fn);
	}
};
*/
//批量加事件
'contextmenu mouseover mouseout click keydown keyup resize scroll load change'.replace(/\w+/g,function(sEv){
	ZQuery.prototype[sEv] = function(fn){
		for(var i = 0;i<this.elements.length;i++){
			addEvent(this.elements[i],sEv,fn);
		}
	};
});
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,function(ev){
			var ev = ev||event;
			if(fn.apply(obj,arguments)==false){
				ev.cancelBubble = true;
				ev.preventDefault();	
			}
		},false);
	}else{
		obj.attachEvent('on'+sEv,function(ev){
			//矫正this
			var ev = ev||event;
			if(fn.apply(obj,arguments)==false){
				ev.cancelBubble = true;
				return false;	
			}
		});	
	}
	return this;
}
ZQuery.prototype.mouseenter = function(fn){
	
	for(var i = 0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',function(ev){
			var ev = ev||event;
			var oFrom = ev.fromElement||ev.relatedTarget;
			if(this.contains(oFrom)){
				return;
			}
			fn&&fn.apply(this,arguments);
		});
	}
};

ZQuery.prototype.bind = function(sEv,fn){
	for(var i = 0;i<this.elements.length;i++){
		addEvent(this.elements[i],sEv,fn);
	}
};
ZQuery.prototype.toggle = function(){
	var args = arguments;
	var _this = this;	
	for(var i = 0;i<this.elements.length;i++){
		(function(count){
			addEvent(_this.elements[i],'click',function(){
				var fn = args[count%args.length];
				
				fn&&fn.apply(this,arguments);
				count++;
			});
		})(0);
	}
	return this;
};
ZQuery.prototype.appendTo = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		//this.domString
		//aParent[i].appendChild(obj);
		aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
	}
	return this;
	
};
ZQuery.prototype.insertBefore = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
	}
	
};
ZQuery.prototype.insertAfter = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		//this.domString
		//aParent[i].appendChild(obj);
		aParent[i].insertAdjacentHTML('afterEnd',this.domString);
	}
	return this;
};
ZQuery.prototype.prependTo = function(str){
	var aParent = getEle(str);
	for(var i = 0;i<aParent.length;i++){
		//this.domString
		//aParent[i].appendChild(obj);
		aParent[i].insertAdjacentHTML('afterBegin',this.domString);
	}
	
};
ZQuery.prototype.remove = function(){
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
};
ZQuery.prototype.val = function(str){
	if(str||str==''){
		//设置
		for(var i = 0;i<this.elements.length;i++){
			this.elements[i].value=str;
		}
		
	}else{
		//读取
		return this.elements[0].value;
	}
	
};
ZQuery.prototype.html = function(str){
	if(str||str==''){
		//设置
		for(var i = 0;i<this.elements.length;i++){
			this.elements[i].innerHTML=str;
		}
		
	}else{
		//读取
		return this.elements[0].innerHTML;
	}
	
};
ZQuery.prototype.addClass = function(sClass){
	var reg = new RegExp('\\b'+sClass+'\\b','g');
	for(var i = 0;i<this.elements.length;i++){
		if(this.elements[i].className){
			//看存在的class是不是要添加的
			if(reg.test(this.elements[i].className)==false){
				obj.className += ' '+ sClass;
			}
			
		}else{
			this.elements[i].className = sClass;
		}
		
	}
};
ZQuery.prototype.removeClass = function(sClass){
	var reg = new RegExp('\\b'+sClass+'\\b','g');
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].className = this.elements[i].className.replace(reg,'').replace(/^\s+/,'').replace(/\s+$/,'').replace(/\s+/g,' ');
		
	}
};
ZQuery.prototype.animate = function(json,options){
	for(var i = 0;i<this.elements.length;i++){
		move(this.elements[i],json,options);
	}
	
};
//运动
//t  当前时间
//b  初始值
//c  现在位置
//d  总时间
//var cur=fx(t,b,c,d)
var Tween={Linear:function(t,b,c,d){return c*t/d+b},Quad:{easeIn:function(t,b,c,d){return c*(t/=d)*t+b},easeOut:function(t,b,c,d){return -c*(t/=d)*(t-2)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t+b}return -c/2*((--t)*(t-2)-1)+b}},Cubic:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t+b}return c/2*((t-=2)*t*t+2)+b}},Quart:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t+b},easeOut:function(t,b,c,d){return -c*((t=t/d-1)*t*t*t-1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t+b}return -c/2*((t-=2)*t*t*t-2)+b}},Quint:{easeIn:function(t,b,c,d){return c*(t/=d)*t*t*t*t+b},easeOut:function(t,b,c,d){return c*((t=t/d-1)*t*t*t*t+1)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return c/2*t*t*t*t*t+b}return c/2*((t-=2)*t*t*t*t+2)+b}},Sine:{easeIn:function(t,b,c,d){return -c*Math.cos(t/d*(Math.PI/2))+c+b},easeOut:function(t,b,c,d){return c*Math.sin(t/d*(Math.PI/2))+b},easeInOut:function(t,b,c,d){return -c/2*(Math.cos(Math.PI*t/d)-1)+b}},Expo:{easeIn:function(t,b,c,d){return(t==0)?b:c*Math.pow(2,10*(t/d-1))+b},easeOut:function(t,b,c,d){return(t==d)?b+c:c*(-Math.pow(2,-10*t/d)+1)+b},easeInOut:function(t,b,c,d){if(t==0){return b}if(t==d){return b+c}if((t/=d/2)<1){return c/2*Math.pow(2,10*(t-1))+b}return c/2*(-Math.pow(2,-10*--t)+2)+b}},Circ:{easeIn:function(t,b,c,d){return -c*(Math.sqrt(1-(t/=d)*t)-1)+b},easeOut:function(t,b,c,d){return c*Math.sqrt(1-(t=t/d-1)*t)+b},easeInOut:function(t,b,c,d){if((t/=d/2)<1){return -c/2*(Math.sqrt(1-t*t)-1)+b}return c/2*(Math.sqrt(1-(t-=2)*t)+1)+b}},Elastic:{easeIn:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return -(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b},easeOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d)==1){return b+c}if(!p){p=d*0.3}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}return(a*Math.pow(2,-10*t)*Math.sin((t*d-s)*(2*Math.PI)/p)+c+b)},easeInOut:function(t,b,c,d,a,p){if(t==0){return b}if((t/=d/2)==2){return b+c}if(!p){p=d*(0.3*1.5)}if(!a||a<Math.abs(c)){a=c;var s=p/4}else{var s=p/(2*Math.PI)*Math.asin(c/a)}if(t<1){return -0.5*(a*Math.pow(2,10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p))+b}return a*Math.pow(2,-10*(t-=1))*Math.sin((t*d-s)*(2*Math.PI)/p)*0.5+c+b}},Back:{easeIn:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*(t/=d)*t*((s+1)*t-s)+b},easeOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b},easeInOut:function(t,b,c,d,s){if(s==undefined){s=1.70158}if((t/=d/2)<1){return c/2*(t*t*(((s*=(1.525))+1)*t-s))+b}return c/2*((t-=2)*t*(((s*=(1.525))+1)*t+s)+2)+b}},Bounce:{easeIn:function(t,b,c,d){return c-Tween.Bounce.easeOut(d-t,0,c,d)+b},easeOut:function(t,b,c,d){if((t/=d)<(1/2.75)){return c*(7.5625*t*t)+b}else{if(t<(2/2.75)){return c*(7.5625*(t-=(1.5/2.75))*t+0.75)+b}else{if(t<(2.5/2.75)){return c*(7.5625*(t-=(2.25/2.75))*t+0.9375)+b}else{return c*(7.5625*(t-=(2.625/2.75))*t+0.984375)+b}}}},easeInOut:function(t,b,c,d){if(t<d/2){return Tween.Bounce.easeIn(t*2,0,c,d)*0.5+b}else{return Tween.Bounce.easeOut(t*2-d,0,c,d)*0.5+c*0.5+b}}}};
function getStyle(obj,name){
	return obj.currentStyle?obj.currentStyle[name]:getComputedStyle(obj,false)[name];
}

function move(obj,json,options){
		options = options||{};
		options.easing = options.easing||Tween.Elastic.easeOut;
		options.duration = options.duration||700;
	
		var start = {};
		var dis = {};
	
		//初始化
		for(var name in json){
			start[name] = parseFloat(getStyle(obj,name)); 
			if(isNaN(start[name])){
				
				switch(name){
					case 'width':
					start[name] = obj.offsetWidth;
					break;
					case 'height':
					start[name] = obj.offsetHeight;
					break;
					case 'left':
					start[name] = obj.offsetLeft;
					break;
					case 'top':
					start[name] = obj.offsetTop;
					break;
					case 'opacity':
					start[name] = 1;
					break;
					case 'borderWidth':
					start[name] = 0;
					break;
				}
			}
			dis[name] = json[name] - start[name];
		}
        var count = Math.round(options.duration/16);
        var n = 0;
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            n++;
			for(var name in json){
//t  当前时间
//b  初始值
//c  现在位置
//d  总时间
				var cur = options.easing(n*options.duration/count,start[name],dis[name],options.duration);			
				if(name == 'opacity'){
					obj.style.opacity = cur;
					obj.style.filter = 'alpha(opacity:'+cur*100+')';
				}else{
					obj.style[name] = cur+'px';
				}
			}
            if(n==count){
                clearInterval(obj.timer);
				options.complete&&options.complete();
            }
        },16);
	
}
ZQuery.ajax=$.ajax = function(json){
	ajax(json);
};
function json2url(json){
	json.t = Math.random();
	var arr = [];
	for(var name in json){
		arr.push(name+'='+encodeURIComponent(json[name]));
	}
	return arr.join('&');
}
//url,data,type,success,error
function ajax(json){
	if(!json.url){return;}
	json = json||{};
	json.type = json.type||'GET';
	json.data = json.data||{};
	json.timeout = json.timeout||10000;
	//1.创建对象
	if(window.XMLHttpRequest){
		//chrome FF
		var oAjax = new XMLHttpRequest();
	}else{
		//IE低版本	
		var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
	}
	switch(json.type.toLowerCase()){
		case 'get':
		//2.建立连接  //是否异步
		oAjax.open('GET',json.url+'?'+json2url(json.data),true);
		//3.发送
		oAjax.send();
		break;
		case 'post': 
		oAjax.open('POST',json.url,true);
		oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
		oAjax.send(json2url(json.data));
		break;
	}
	json.loading&&json.loading();
	//超过json.timeout 后认为失败 不在请求
	var timer = setTimeout(function(){
		json.error&&json.error();
		json.complete&&json.complete();
		oAjax.onreadystatechange = null;
	},json.timeout);
	
	//4.接收 
	//当网络状态改变的时候
	oAjax.onreadystatechange = function(){
		//网络状态
		if(oAjax.readyState == 4){
			//http状态
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				//服务器返回的数据
				clearTimeout(timer);
				json.success&&json.success(oAjax.responseText);	
				json.complete&&json.complete();
			}else{
				clearTimeout(timer);
				json.error&&json.error(oAjax.status);
				json.complete&&json.complete();
			}
		}
	}; 
}

ZQuery.getScript=$.getScript = function(json){
	jsonp(json);
};
//url,data,cbName,success
function jsonp(options){
	options = options||{};
	if(!options.url) {return;}
	options.data = options.data||{};
	options.cbName = options.cbName||'cb';
	options.timeout = options.timeout||10000;
	var fnName = 'jsonp_'+Math.random();
	var timer = null;
	fnName = fnName.replace('.','');
	//定义show
	window[fnName] = function(json){
		clearTimeout(timer);
		options.success&&options.success(json);
		document.head.removeChild(oS);
	} 
	//{cb:'show'}
	options.data[options.cbName] = fnName;
	clearTimeout(timer);
	timer = setTimeout(function(){
		options.error&&options.error();
		window[fnName] = null;
	},options.timeout);
	
	var arr = [];
	for(var name in options.data){
		arr.push(name+'='+options.data[name]);
	}
	var oS = document.createElement('script');
	//wd=aaa&cb=show
	//调用
	oS.src = options.url+'?'+arr.join('&');
	document.head.appendChild(oS);
}

ZQuery.prototype.get = function(n){
	return this.elements[n];	
};
ZQuery.prototype.eq = function(n){
	return $(this.elements[n]);	
};
ZQuery.prototype.index = function(){
	var obj = this.elements[this.elements.length-1];
	var aSiblings = obj.parentNode.children;
	for(var i = 0;i<aSiblings.length;i++){
		if(aSiblings[i]==obj){
			return i;
		}
	}
	return -1;
};
ZQuery.prototype.each = function(fn){
	for(var i = 0;i<this.elements.length;i++){
		fn&&fn.call(this.elements[i],i,this.elements[i]);	
	}
};
$.fn = $.prototype = ZQuery.prototype;
$.fn.extend = ZQuery.prototype.extend = $.prototype.extend = function(json){
	for(var name in json){
		ZQuery.prototype[name] = json[name];
	}
};
ZQuery.prototype.find = function(str){
	var aParent = this.elements;
	var aChild = getEle(str,aParent);
	return $(aChild);
};
ZQuery.prototype.show = function(){
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].style.display = 'block';	
		
	}
};


ZQuery.prototype.hide = function(){
	for(var i = 0;i<this.elements.length;i++){
		this.elements[i].style.display = 'none';	
		
	}
};




	





