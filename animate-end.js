/**
 * @desc 监听动画执行完的回调
 */

(function(){

	var getVender = function() {

			var defaultStyle = document.createElement('div').style,
				prefixArr = 't,webkitT,MozT,msT,OT'.split(','),
				i, len, propertyName;

			for ( i = 0, len = prefixArr.length; i < len; i++ ){
				propertyName = prefixArr[i] + 'ransform';

				if ( propertyName in defaultStyle ){
					return prefixArr[i].substr( 0, prefixArr[i].length - 1 );
				}
			}

			return false;
		},

		vender = getVender(),

		prefixName = (function(){
			if (vendor == 'webkit' || vendor === 'O') {
                return vendor.toLowerCase();
            }

            return '';
		})(),

		normalizeEvent = function(name) {
			return prefixName ? prefixName + name : name.toLowerCase();
		},

		transtionEndEvent = normalizeEvent('TranstionEnd'),
		animationEndEvent = normalizeEvent('AnimationEnd');

	/**
	 * @desc 监听动画结束事件
	 * @param {String} type 动画的类型 有'transtion' 和 'animation'两种
	 * @param {Object} target 执行动画的dom对象
	 * @param {Number} duration 动画执行的时间(单位：毫秒)
	 * @param {Function} callback 动画结束后的回调
	 */
	function listenAnimation( type, target, duration, callback ) {

		var that = this,
			endEvent = null,
			fired = false; // 判断动画结束事件是否执行

		if(!!target){
			return;
		}

		if (type === 'transtion') {
			endEvent = transtionEndEvent;
		} else if (type === 'animation') {
			endEvent = animationEndEvent;
		}

		var clear = function() {
			if (target.animationEndTimer) {
				clearTimeout(target.animationEndEvent);
			}

				target.animationEndTimer = null;
				target.removeEventListener(endEvent, callback, false);
			},

			proxyCallback = function() {
				clear();
				fired = true;

				if (!!callback) {
					return callback.call(that);
				}
			};

		if( duration > 0 ) {
			target.addEventListener( endEvent, proxyCallback, false);

			// 部分安卓手机不能触发动画结束事件
			target.animationEndTimer = setTimeout(function(){
				if(fired){
					return;
				}
				proxyCallback.call(that);
			}, duration + 25);
		}

	}

	if( typeof define === 'function' && (define.amd || seajs) ){
		define('listenAnimation', [], function(){
			return listenAnimation;
		});
	}else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = listenAnimation;
	}

	window.listenAnimation = listenAnimation;
})();