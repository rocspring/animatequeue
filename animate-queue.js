/**
 * @desc 一个持续动画的功能函数 需要依赖animate.css库，地址：http://daneden.github.io/animate.css/
 * @author wshp
 * @e-mail wshp000000@gmail.com
 *
 * @version 0.0.4 修改监听动画执行完成的方法
 */

(function (window) {

	var listenAnimation = window.listenAnimation;

	function AnimateQueue (element) {
		this.init(element);
	}
		
	AnimateQueue.prototype = {

		//动画队列
		//里面的参数是一个对象
		//对象规则是：
		//{
		//	func : fuction(){},
		//  duration : 1000
		//}
		queue : [],


		//动画队列的长度
		len : 0,

		//动画锁
		locked : false,

		//默认的动画执行时间
		defaultTime: 1000,

		init : function (element) {
			element = (typeof element === 'string') ? document.querySelector(element) : element;
			this.el = element || document;

			return this;
		},

		run : function () {
			this.fire();
		},

		//添加动画
		//使用默认的动画添加方法，可以不添加动画执行时间
		add : function (element, animateName, time) {
			if( !element || !animateName ) return;

			element = (typeof element === 'string') ? this.el.querySelector(element) : element;
			this._addAnimate(element, animateName, time);

			return this;
		},

		//停止动画
		stop: function () {
			this._clear();
		},

		//触发动画的执行
		fire : function () {
			if(this.len > 0){
				this._fire();
			}else{
				return;
			}
		},


		_clear: function () {
			this.queue.length = 0;
			this.len = 0;
		},

		_fire : function () {
			var locked = this.locked,
				queue = this.queue,
				that = this,
				executeAnimateTimer;
			if(!locked){
				var nowAnimateObj = queue.shift(),
					nowAnimate = nowAnimateObj.func,
					animateTime = nowAnimateObj.time;
				this.len--;
				if(nowAnimate){
					locked = true;
					listenAnimation( that.el, animateTime, function () {
						locked = false;
						that.fire();
					});
					nowAnimate();
				}else{
					locked = false;
				}
			}
		},

		//添加动画	
		_addAnimate : function (element, animateName, time) {
			var that = this;

			time = !time ? 1000 : that.defaultTime;
			this.queue.push({
				func : function () {
						that._executeAnimate( element, animateName);
					},
				time : time
			});
			this.len++;
		},

		//执行动画
		_executeAnimate : function (element, animateName ) {
			var that = this;
			if (typeof animateName === 'string') {
				addAnimateClass(element, animateName);
			}else if( typeof animateName === 'function'){
				animateName();
			}
			
		}
	};


	window.AnimateQueue = AnimateQueue;


	//本组件默认的添加动画的方法
	//必需的class样式：animated
	function addAnimateClass ( element, animateName ) {
		var classNames,
			classArr,
			classStr;
		if (element) {
			
			classNames = element.className;
			classNames.replace(/\s+/, ' ');
			classArr = classNames.split(' ');

			//已有动画
			if (classArr.indexOf('animated') > -1) {
				classArr[classArr.indexOf('animated') + 1] = animateName;
			}else{
				classArr[classArr.length] = 'animated';
				classArr[classArr.length] = animateName;
			}

			classStr = classArr.join(' ');

			element.className = classStr;
		}
	}

})(window);
