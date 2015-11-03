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
			if (vender == 'webkit' || vender === 'O') {
                return vender.toLowerCase();
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
	 * @param {Object} target 执行动画的dom对象
	 * @param {Number} duration 动画执行的时间(单位：毫秒)
	 * @param {Function} callback 动画结束后的回调
	 */
	function listenAnimation( target, duration, callback ) {

		var that = this,
			fired = false; // 判断动画结束事件是否执行

		if(!target){
			return;
		}

		var clear = function() {
			if (target.endTimer) {
				clearTimeout(target.endTimer);
			}

				target.endTimer = null;
				target.removeEventListener(transtionEndEvent, proxyCallback, false);
				target.removeEventListener(animationEndEvent, proxyCallback, false);
			},

			proxyCallback = function() {
				clear();
				fired = true;

				if (!!callback) {
					// 延迟25ms执行回调，使得动画可以完美的执行
					setTimeout(function(){
						return callback.call(that);
					}, 25);
				}
			};

		if( duration > 0 ) {
			target.addEventListener( transtionEndEvent, proxyCallback, false);
			target.addEventListener( animationEndEvent, proxyCallback, false);

			// 部分安卓手机不能触发动画结束事件
			target.endTimer = setTimeout(function(){
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