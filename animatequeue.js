/*
*@author wshp
*version:0.0.2
*需要依赖animate.css库，地址：http://daneden.github.io/animate.css/
*
*/

(function (window) {

	function AnimateQueue (element) {
		this.init(element);
	}
		
	AnimateQueue.prototype = {

		//动画队列
		queue : [],

		//动画队列的长度
		len : 0,

		//动画锁
		locked : false,

		init : function (element) {
			element = (typeof element === 'string') ? document.querySelector(element) : element;
			this.el = element || document;

			return this;
		},

		run : function () {
			this.fire();
		},

		//添加动画
		add : function (element, animateName) {
			if( !element || !animateName ) return;

			element = (typeof element === 'string') ? this.el.querySelector(element) : element;
			this._addAnimate(element, animateName);

			return this;
		},

		//触发动画的执行
		fire : function () {
			if(this.len > 0){
				this._fire();
			}else{
				return;
			}
		},

		_fire : function () {
			var locked = this.locked,
				queue = this.queue,
				that = this,
				executeAnimateTimer;
			if(!locked){
				var nowAnimate = queue.shift();

				if(nowAnimate){
					locked = true;
					nowAnimate();
					//每个动画的时间是1s,因此延迟1000ms执行下一个动画
					//仅支持animate动画
					clearTimeout(executeAnimateTimer);
					executeAnimateTimer =setTimeout(function () {
						locked = false;
						that.fire();
					}, 1000);
				}else{
					locked = false;
				}
			}
		},

		//添加动画	
		_addAnimate : function (element, animateName) {
			var that = this,
				func = that.fire;

			this.queue.push(function () {
				that._executeAnimate( element, animateName);
			});
			this.len++;
		},

		//执行动画
		_executeAnimate : function (element, animateName ) {
			var that = this;

			addClass(element, animateName);
			// console.log('执行动画' +animateName+ (Math.random().toString().substring(2,15)) );
			//animate的每一个动画是有几个动画组成的，会触发多次webkitAnimationEnd
			//事件，造成有的动画无法执行的bug，放弃这种方法
			/*element.addEventListener('webkitAnimationEnd', function () {
				that.locked = false;
				that.fire();
				console.log('执行动画' +animateName+ (Math.random().toString().substring(2,15)) );
			}, false);*/
		}
	};


	window.AnimateQueue = AnimateQueue;


	//本组件专用的添加动画的方法
	//必需的class样式：animated
	function addClass ( element, animateName ) {
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
