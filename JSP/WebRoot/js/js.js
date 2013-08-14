var homeArray = [];
var missionPensieroArray = [];
var missionGiocoArray = [];
var missionSoluzioniArray = [];
var slide = [];
var preLoading = [];
var preLoadingCount = 0;
var missionPensieroCheck = true;
var missionGiocoCheck = true;
var missionSoluzioniCheck = true;
var loadAn = 0;
var loadAnCheck = true;
var loadTimer = "";
var queryAjax = true;
var queryAjaxClose = true;
var cscrf = false;
var browser_ff = /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
var browser_ie = /MSIE[\/\s](\d+\.\d+)/.test(navigator.userAgent);
var scrollCheck = 'body';
if (browser_ff || browser_ie) scrollCheck = 'html';
var debug = false;;
(function($) {
	var ver = '2.73';
	if ($.support == undefined) {
		$.support = {
			opacity: !($.browser.msie)
		};
	}

	function debug(s) {
		if ($.fn.cycle.debug)
			log(s);
	}

	function log() {
		if (window.console && window.console.log)
			window.console.log('[cycle] ' + Array.prototype.join.call(arguments, ' '));
	};
	$.fn.cycle = function(options, arg2) {
		var o = {
			s: this.selector,
			c: this.context
		};
		if (this.length === 0 && options != 'stop') {
			if (!$.isReady && o.s) {
				log('DOM not ready, queuing slideshow');
				$(function() {
					$(o.s, o.c).cycle(options, arg2);
				});
				return this;
			}
			log('terminating; zero elements found by selector' + ($.isReady ? '' : ' (DOM not ready)'));
			return this;
		}
		return this.each(function() {
			var opts = handleArguments(this, options, arg2);
			if (opts === false)
				return;
			if (this.cycleTimeout)
				clearTimeout(this.cycleTimeout);
			this.cycleTimeout = this.cyclePause = 0;
			var $cont = $(this);
			var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
			var els = $slides.get();
			if (els.length < 2) {
				log('terminating; too few slides: ' + els.length);
				return;
			}
			var opts2 = buildOptions($cont, $slides, els, opts, o);
			if (opts2 === false)
				return;
			var startTime = opts2.continuous ? 10 : getTimeout(opts2.currSlide, opts2.nextSlide, opts2, !opts2.rev);
			if (startTime) {
				startTime += (opts2.delay || 0);
				if (startTime < 10)
					startTime = 10;
				debug('first timeout: ' + startTime);
				this.cycleTimeout = setTimeout(function() {
					go(els, opts2, 0, !opts2.rev)
				}, startTime);
			}
		});
	};

	function handleArguments(cont, options, arg2) {
		if (cont.cycleStop == undefined)
			cont.cycleStop = 0;
		if (options === undefined || options === null)
			options = {};
		if (options.constructor == String) {
			switch (options) {
				case 'stop':
					cont.cycleStop++;
					if (cont.cycleTimeout)
						clearTimeout(cont.cycleTimeout);
					cont.cycleTimeout = 0;
					$(cont).removeData('cycle.opts');
					return false;
				case 'pause':
					cont.cyclePause = 1;
					return false;
				case 'resume':
					cont.cyclePause = 0;
					if (arg2 === true) {
						options = $(cont).data('cycle.opts');
						if (!options) {
							log('options not found, can not resume');
							return false;
						}
						if (cont.cycleTimeout) {
							clearTimeout(cont.cycleTimeout);
							cont.cycleTimeout = 0;
						}
						go(options.elements, options, 1, 1);
					}
					return false;
				case 'prev':
				case 'next':
					var opts = $(cont).data('cycle.opts');
					if (!opts) {
						log('options not found, "prev/next" ignored');
						return false;
					}
					$.fn.cycle[options](opts);
					return false;
				default:
					options = {
						fx: options
					};
			};
			return options;
		} else if (options.constructor == Number) {
			var num = options;
			options = $(cont).data('cycle.opts');
			if (!options) {
				log('options not found, can not advance slide');
				return false;
			}
			if (num < 0 || num >= options.elements.length) {
				log('invalid slide index: ' + num);
				return false;
			}
			options.nextSlide = num;
			if (cont.cycleTimeout) {
				clearTimeout(cont.cycleTimeout);
				cont.cycleTimeout = 0;
			}
			if (typeof arg2 == 'string')
				options.oneTimeFx = arg2;
			go(options.elements, options, 1, num >= options.currSlide);
			return false;
		}
		return options;
	};

	function removeFilter(el, opts) {
		if (!$.support.opacity && opts.cleartype && el.style.filter) {
			try {
				el.style.removeAttribute('filter');
			} catch (smother) {}
		}
	};

	function buildOptions($cont, $slides, els, options, o) {
		var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
		if (opts.autostop)
			opts.countdown = opts.autostopCount || els.length;
		var cont = $cont[0];
		$cont.data('cycle.opts', opts);
		opts.$cont = $cont;
		opts.stopCount = cont.cycleStop;
		opts.elements = els;
		opts.before = opts.before ? [opts.before] : [];
		opts.after = opts.after ? [opts.after] : [];
		opts.after.unshift(function() {
			opts.busy = 0;
		});
		if (!$.support.opacity && opts.cleartype)
			opts.after.push(function() {
				removeFilter(this, opts);
			});
		if (opts.continuous)
			opts.after.push(function() {
				go(els, opts, 0, !opts.rev);
			});
		saveOriginalOpts(opts);
		if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
			clearTypeFix($slides);
		if ($cont.css('position') == 'static')
			$cont.css('position', 'relative');
		if (opts.width)
			$cont.width(opts.width);
		if (opts.height && opts.height != 'auto')
			$cont.height(opts.height);
		if (opts.startingSlide)
			opts.startingSlide = parseInt(opts.startingSlide);
		if (opts.random) {
			opts.randomMap = [];
			for (var i = 0; i < els.length; i++)
				opts.randomMap.push(i);
			opts.randomMap.sort(function(a, b) {
				return Math.random() - 0.5;
			});
			opts.randomIndex = 0;
			opts.startingSlide = opts.randomMap[0];
		} else if (opts.startingSlide >= els.length)
			opts.startingSlide = 0;
		opts.currSlide = opts.startingSlide = opts.startingSlide || 0;
		var first = opts.startingSlide;
		$slides.css({
			position: 'absolute',
			top: 0,
			left: 0
		}).hide().each(function(i) {
			var z = first ? i >= first ? els.length - (i - first) : first - i : els.length - i;
			$(this).css('z-index', z)
		});
		$(els[first]).css('opacity', 1).show();
		removeFilter(els[first], opts);
		if (opts.fit && opts.width)
			$slides.width(opts.width);
		if (opts.fit && opts.height && opts.height != 'auto')
			$slides.height(opts.height);
		var reshape = opts.containerResize && !$cont.innerHeight();
		if (reshape) {
			var maxw = 0,
				maxh = 0;
			for (var j = 0; j < els.length; j++) {
				var $e = $(els[j]),
					e = $e[0],
					w = $e.outerWidth(),
					h = $e.outerHeight();
				if (!w) w = e.offsetWidth;
				if (!h) h = e.offsetHeight;
				maxw = w > maxw ? w : maxw;
				maxh = h > maxh ? h : maxh;
			}
			if (maxw > 0 && maxh > 0)
				$cont.css({
					width: maxw + 'px',
					height: maxh + 'px'
				});
		}
		if (opts.pause)
			$cont.hover(function() {
				this.cyclePause++;
			}, function() {
				this.cyclePause--;
			});
		if (supportMultiTransitions(opts) === false)
			return false;
		var requeue = false;
		options.requeueAttempts = options.requeueAttempts || 0;
		$slides.each(function() {
			var $el = $(this);
			this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
			this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();
			if ($el.is('img')) {
				var loadingIE = ($.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
				var loadingFF = ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
				var loadingOp = ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
				var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
				if (loadingIE || loadingFF || loadingOp || loadingOther) {
					if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) {
						log(options.requeueAttempts, ' - img slide not loaded, requeuing slideshow: ', this.src, this.cycleW, this.cycleH);
						setTimeout(function() {
							$(o.s, o.c).cycle(options)
						}, opts.requeueTimeout);
						requeue = true;
						return false;
					} else {
						log('could not determine size of image: ' + this.src, this.cycleW, this.cycleH);
					}
				}
			}
			return true;
		});
		if (requeue)
			return false;
		opts.cssBefore = opts.cssBefore || {};
		opts.animIn = opts.animIn || {};
		opts.animOut = opts.animOut || {};
		$slides.not(':eq(' + first + ')').css(opts.cssBefore);
		if (opts.cssFirst)
			$($slides[first]).css(opts.cssFirst);
		if (opts.timeout) {
			opts.timeout = parseInt(opts.timeout);
			if (opts.speed.constructor == String)
				opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
			if (!opts.sync)
				opts.speed = opts.speed / 2;
			while ((opts.timeout - opts.speed) < 250)
				opts.timeout += opts.speed;
		}
		if (opts.easing)
			opts.easeIn = opts.easeOut = opts.easing;
		if (!opts.speedIn)
			opts.speedIn = opts.speed;
		if (!opts.speedOut)
			opts.speedOut = opts.speed;
		opts.slideCount = els.length;
		opts.currSlide = opts.lastSlide = first;
		if (opts.random) {
			opts.nextSlide = opts.currSlide;
			if (++opts.randomIndex == els.length)
				opts.randomIndex = 0;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		} else
			opts.nextSlide = opts.startingSlide >= (els.length - 1) ? 0 : opts.startingSlide + 1; if (!opts.multiFx) {
			var init = $.fn.cycle.transitions[opts.fx];
			if ($.isFunction(init))
				init($cont, $slides, opts);
			else if (opts.fx != 'custom' && !opts.multiFx) {
				log('unknown transition: ' + opts.fx, '; slideshow terminating');
				return false;
			}
		}
		var e0 = $slides[first];
		if (opts.before.length)
			opts.before[0].apply(e0, [e0, e0, opts, true]);
		if (opts.after.length > 1)
			opts.after[1].apply(e0, [e0, e0, opts, true]);
		if (opts.next)
			$(opts.next).bind(opts.prevNextEvent, function() {
				return advance(opts, opts.rev ? -1 : 1)
			});
		if (opts.prev)
			$(opts.prev).bind(opts.prevNextEvent, function() {
				return advance(opts, opts.rev ? 1 : -1)
			});
		if (opts.pager)
			buildPager(els, opts);
		exposeAddSlide(opts, els);
		return opts;
	};

	function saveOriginalOpts(opts) {
		opts.original = {
			before: [],
			after: []
		};
		opts.original.cssBefore = $.extend({}, opts.cssBefore);
		opts.original.cssAfter = $.extend({}, opts.cssAfter);
		opts.original.animIn = $.extend({}, opts.animIn);
		opts.original.animOut = $.extend({}, opts.animOut);
		$.each(opts.before, function() {
			opts.original.before.push(this);
		});
		$.each(opts.after, function() {
			opts.original.after.push(this);
		});
	};

	function supportMultiTransitions(opts) {
		var i, tx, txs = $.fn.cycle.transitions;
		if (opts.fx.indexOf(',') > 0) {
			opts.multiFx = true;
			opts.fxs = opts.fx.replace(/\s*/g, '').split(',');
			for (i = 0; i < opts.fxs.length; i++) {
				var fx = opts.fxs[i];
				tx = txs[fx];
				if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
					log('discarding unknown transition: ', fx);
					opts.fxs.splice(i, 1);
					i--;
				}
			}
			if (!opts.fxs.length) {
				log('No valid transitions named; slideshow terminating.');
				return false;
			}
		} else if (opts.fx == 'all') {
			opts.multiFx = true;
			opts.fxs = [];
			for (p in txs) {
				tx = txs[p];
				if (txs.hasOwnProperty(p) && $.isFunction(tx))
					opts.fxs.push(p);
			}
		}
		if (opts.multiFx && opts.randomizeEffects) {
			var r1 = Math.floor(Math.random() * 20) + 30;
			for (i = 0; i < r1; i++) {
				var r2 = Math.floor(Math.random() * opts.fxs.length);
				opts.fxs.push(opts.fxs.splice(r2, 1)[0]);
			}
			debug('randomized fx sequence: ', opts.fxs);
		}
		return true;
	};

	function exposeAddSlide(opts, els) {
		opts.addSlide = function(newSlide, prepend) {
			var $s = $(newSlide),
				s = $s[0];
			if (!opts.autostopCount)
				opts.countdown++;
			els[prepend ? 'unshift' : 'push'](s);
			if (opts.els)
				opts.els[prepend ? 'unshift' : 'push'](s);
			opts.slideCount = els.length;
			$s.css('position', 'absolute');
			$s[prepend ? 'prependTo' : 'appendTo'](opts.$cont);
			if (prepend) {
				opts.currSlide++;
				opts.nextSlide++;
			}
			if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg)
				clearTypeFix($s);
			if (opts.fit && opts.width)
				$s.width(opts.width);
			if (opts.fit && opts.height && opts.height != 'auto')
				$slides.height(opts.height);
			s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
			s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();
			$s.css(opts.cssBefore);
			if (opts.pager)
				$.fn.cycle.createPagerAnchor(els.length - 1, s, $(opts.pager), els, opts);
			if ($.isFunction(opts.onAddSlide))
				opts.onAddSlide($s);
			else
				$s.hide();
		};
	}
	$.fn.cycle.resetState = function(opts, fx) {
		fx = fx || opts.fx;
		opts.before = [];
		opts.after = [];
		opts.cssBefore = $.extend({}, opts.original.cssBefore);
		opts.cssAfter = $.extend({}, opts.original.cssAfter);
		opts.animIn = $.extend({}, opts.original.animIn);
		opts.animOut = $.extend({}, opts.original.animOut);
		opts.fxFn = null;
		$.each(opts.original.before, function() {
			opts.before.push(this);
		});
		$.each(opts.original.after, function() {
			opts.after.push(this);
		});
		var init = $.fn.cycle.transitions[fx];
		if ($.isFunction(init))
			init(opts.$cont, $(opts.elements), opts);
	};

	function go(els, opts, manual, fwd) {
		if (manual && opts.busy && opts.manualTrump) {
			$(els).stop(true, true);
			opts.busy = false;
		}
		if (opts.busy)
			return;
		var p = opts.$cont[0],
			curr = els[opts.currSlide],
			next = els[opts.nextSlide];
		if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual)
			return;
		if (!manual && !p.cyclePause && ((opts.autostop && (--opts.countdown <= 0)) || (opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
			if (opts.end)
				opts.end(opts);
			return;
		}
		if (manual || !p.cyclePause) {
			var fx = opts.fx;
			curr.cycleH = curr.cycleH || $(curr).height();
			curr.cycleW = curr.cycleW || $(curr).width();
			next.cycleH = next.cycleH || $(next).height();
			next.cycleW = next.cycleW || $(next).width();
			if (opts.multiFx) {
				if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length)
					opts.lastFx = 0;
				fx = opts.fxs[opts.lastFx];
				opts.currFx = fx;
			}
			if (opts.oneTimeFx) {
				fx = opts.oneTimeFx;
				opts.oneTimeFx = null;
			}
			$.fn.cycle.resetState(opts, fx);
			if (opts.before.length)
				$.each(opts.before, function(i, o) {
					if (p.cycleStop != opts.stopCount) return;
					o.apply(next, [curr, next, opts, fwd]);
				});
			var after = function() {
				$.each(opts.after, function(i, o) {
					if (p.cycleStop != opts.stopCount) return;
					o.apply(next, [curr, next, opts, fwd]);
				});
			};
			if (opts.nextSlide != opts.currSlide) {
				opts.busy = 1;
				if (opts.fxFn)
					opts.fxFn(curr, next, opts, after, fwd);
				else if ($.isFunction($.fn.cycle[opts.fx]))
					$.fn.cycle[opts.fx](curr, next, opts, after);
				else
					$.fn.cycle.custom(curr, next, opts, after, manual && opts.fastOnEvent);
			}
			opts.lastSlide = opts.currSlide;
			if (opts.random) {
				opts.currSlide = opts.nextSlide;
				if (++opts.randomIndex == els.length)
					opts.randomIndex = 0;
				opts.nextSlide = opts.randomMap[opts.randomIndex];
			} else {
				var roll = (opts.nextSlide + 1) == els.length;
				opts.nextSlide = roll ? 0 : opts.nextSlide + 1;
				opts.currSlide = roll ? els.length - 1 : opts.nextSlide - 1;
			}
			if (opts.pager)
				$.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
		}
		var ms = 0;
		if (opts.timeout && !opts.continuous)
			ms = getTimeout(curr, next, opts, fwd);
		else if (opts.continuous && p.cyclePause)
			ms = 10;
		if (ms > 0)
			p.cycleTimeout = setTimeout(function() {
				go(els, opts, 0, !opts.rev)
			}, ms);
	};
	$.fn.cycle.updateActivePagerLink = function(pager, currSlide) {
		$(pager).each(function() {
			$(this).find('a').removeClass('activeSlide').filter('a:eq(' + currSlide + ')').addClass('activeSlide');
		});
	};

	function getTimeout(curr, next, opts, fwd) {
		if (opts.timeoutFn) {
			var t = opts.timeoutFn(curr, next, opts, fwd);
			while ((t - opts.speed) < 250)
				t += opts.speed;
			debug('calculated timeout: ' + t + '; speed: ' + opts.speed);
			if (t !== false)
				return t;
		}
		return opts.timeout;
	};
	$.fn.cycle.next = function(opts) {
		advance(opts, opts.rev ? -1 : 1);
	};
	$.fn.cycle.prev = function(opts) {
		advance(opts, opts.rev ? 1 : -1);
	};

	function advance(opts, val) {
		var els = opts.elements;
		var p = opts.$cont[0],
			timeout = p.cycleTimeout;
		if (timeout) {
			clearTimeout(timeout);
			p.cycleTimeout = 0;
		}
		if (opts.random && val < 0) {
			opts.randomIndex--;
			if (--opts.randomIndex == -2)
				opts.randomIndex = els.length - 2;
			else if (opts.randomIndex == -1)
				opts.randomIndex = els.length - 1;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		} else if (opts.random) {
			if (++opts.randomIndex == els.length)
				opts.randomIndex = 0;
			opts.nextSlide = opts.randomMap[opts.randomIndex];
		} else {
			opts.nextSlide = opts.currSlide + val;
			if (opts.nextSlide < 0) {
				if (opts.nowrap) return false;
				opts.nextSlide = els.length - 1;
			} else if (opts.nextSlide >= els.length) {
				if (opts.nowrap) return false;
				opts.nextSlide = 0;
			}
		}
		if ($.isFunction(opts.prevNextClick))
			opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
		go(els, opts, 1, val >= 0);
		return false;
	};

	function buildPager(els, opts) {
		var $p = $(opts.pager);
		$.each(els, function(i, o) {
			$.fn.cycle.createPagerAnchor(i, o, $p, els, opts);
		});
		$.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
	};
	$.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
		var a;
		if ($.isFunction(opts.pagerAnchorBuilder))
			a = opts.pagerAnchorBuilder(i, el);
		else
			a = '<a href="#">' + (i + 1) + '</a>'; if (!a)
			return;
		var $a = $(a);
		if ($a.parents('body').length === 0) {
			var arr = [];
			if ($p.length > 1) {
				$p.each(function() {
					var $clone = $a.clone(true);
					$(this).append($clone);
					arr.push($clone[0]);
				});
				$a = $(arr);
			} else {
				$a.appendTo($p);
			}
		}
		$a.bind(opts.pagerEvent, function(e) {
			e.preventDefault();
			opts.nextSlide = i;
			var p = opts.$cont[0],
				timeout = p.cycleTimeout;
			if (timeout) {
				clearTimeout(timeout);
				p.cycleTimeout = 0;
			}
			if ($.isFunction(opts.pagerClick))
				opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
			go(els, opts, 1, opts.currSlide < i);
			return false;
		});
		if (opts.pagerEvent != 'click')
			$a.click(function() {
				return false;
			});
		if (opts.pauseOnPagerHover)
			$a.hover(function() {
				opts.$cont[0].cyclePause++;
			}, function() {
				opts.$cont[0].cyclePause--;
			});
	};
	$.fn.cycle.hopsFromLast = function(opts, fwd) {
		var hops, l = opts.lastSlide,
			c = opts.currSlide;
		if (fwd)
			hops = c > l ? c - l : opts.slideCount - l;
		else
			hops = c < l ? l - c : l + opts.slideCount - c;
		return hops;
	};

	function clearTypeFix($slides) {
		function hex(s) {
			s = parseInt(s).toString(16);
			return s.length < 2 ? '0' + s : s;
		};

		function getBg(e) {
			for (; e && e.nodeName.toLowerCase() != 'html'; e = e.parentNode) {
				var v = $.css(e, 'background-color');
				if (v.indexOf('rgb') >= 0) {
					var rgb = v.match(/\d+/g);
					return '#' + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
				}
				if (v && v != 'transparent')
					return v;
			}
			return '#ffffff';
		};
		$slides.each(function() {
			$(this).css('background-color', getBg(this));
		});
	};
	$.fn.cycle.commonReset = function(curr, next, opts, w, h, rev) {
		$(opts.elements).not(curr).hide();
		opts.cssBefore.opacity = 1;
		opts.cssBefore.display = 'block';
		if (w !== false && next.cycleW > 0)
			opts.cssBefore.width = next.cycleW;
		if (h !== false && next.cycleH > 0)
			opts.cssBefore.height = next.cycleH;
		opts.cssAfter = opts.cssAfter || {};
		opts.cssAfter.display = 'none';
		$(curr).css('zIndex', opts.slideCount + (rev === true ? 1 : 0));
		$(next).css('zIndex', opts.slideCount + (rev === true ? 0 : 1));
	};
	$.fn.cycle.custom = function(curr, next, opts, cb, speedOverride) {
		var $l = $(curr),
			$n = $(next);
		var speedIn = opts.speedIn,
			speedOut = opts.speedOut,
			easeIn = opts.easeIn,
			easeOut = opts.easeOut;
		$n.css(opts.cssBefore);
		if (speedOverride) {
			if (typeof speedOverride == 'number')
				speedIn = speedOut = speedOverride;
			else
				speedIn = speedOut = 1;
			easeIn = easeOut = null;
		}
		var fn = function() {
			$n.animate(opts.animIn, speedIn, easeIn, cb)
		};
		$l.animate(opts.animOut, speedOut, easeOut, function() {
			if (opts.cssAfter) $l.css(opts.cssAfter);
			if (!opts.sync) fn();
		});
		if (opts.sync) fn();
	};
	$.fn.cycle.transitions = {
		fade: function($cont, $slides, opts) {
			$slides.not(':eq(' + opts.currSlide + ')').css('opacity', 0);
			opts.before.push(function(curr, next, opts) {
				$.fn.cycle.commonReset(curr, next, opts);
				opts.cssBefore.opacity = 0;
			});
			opts.animIn = {
				opacity: 1
			};
			opts.animOut = {
				opacity: 0
			};
			opts.cssBefore = {
				top: 0,
				left: 0
			};
		}
	};
	$.fn.cycle.ver = function() {
		return ver;
	};
	$.fn.cycle.defaults = {
		fx: 'fade',
		timeout: 6000,
		timeoutFn: null,
		continuous: 0,
		speed: 1000,
		speedIn: null,
		speedOut: null,
		next: null,
		prev: null,
		prevNextClick: null,
		prevNextEvent: 'click',
		pager: null,
		pagerClick: null,
		pagerEvent: 'click',
		pagerAnchorBuilder: null,
		before: null,
		after: null,
		end: null,
		easing: null,
		easeIn: null,
		easeOut: null,
		shuffle: null,
		animIn: null,
		animOut: null,
		cssBefore: null,
		cssAfter: null,
		fxFn: null,
		height: 'auto',
		startingSlide: 0,
		sync: 1,
		random: 0,
		fit: 1,
		containerResize: 1,
		pause: 0,
		pauseOnPagerHover: 0,
		autostop: 0,
		autostopCount: 0,
		delay: 0,
		slideExpr: null,
		cleartype: !$.support.opacity,
		cleartypeNoBg: false,
		nowrap: 0,
		fastOnEvent: 0,
		randomizeEffects: 1,
		rev: 0,
		manualTrump: true,
		requeueOnImageNotLoaded: true,
		requeueTimeout: 250
	};
})(jQuery);
(function($) {
	$.fn.cycle.transitions.none = function($cont, $slides, opts) {
		opts.fxFn = function(curr, next, opts, after) {
			$(next).show();
			$(curr).hide();
			after();
		};
	}
	$.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
		$cont.css('overflow', 'hidden');
		opts.before.push($.fn.cycle.commonReset);
		var h = $cont.height();
		opts.cssBefore = {
			top: h,
			left: 0
		};
		opts.cssFirst = {
			top: 0
		};
		opts.animIn = {
			top: 0
		};
		opts.animOut = {
			top: -h
		};
	};
	$.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
		$cont.css('overflow', 'hidden');
		opts.before.push($.fn.cycle.commonReset);
		var h = $cont.height();
		opts.cssFirst = {
			top: 0
		};
		opts.cssBefore = {
			top: -h,
			left: 0
		};
		opts.animIn = {
			top: 0
		};
		opts.animOut = {
			top: h
		};
	};
	$.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
		$cont.css('overflow', 'hidden');
		opts.before.push($.fn.cycle.commonReset);
		var w = $cont.width();
		opts.cssFirst = {
			left: 0
		};
		opts.cssBefore = {
			left: w,
			top: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			left: 0 - w
		};
	};
	$.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
		$cont.css('overflow', 'hidden');
		opts.before.push($.fn.cycle.commonReset);
		var w = $cont.width();
		opts.cssFirst = {
			left: 0
		};
		opts.cssBefore = {
			left: -w,
			top: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			left: w
		};
	};
	$.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
		$cont.css('overflow', 'hidden').width();
		opts.before.push(function(curr, next, opts, fwd) {
			$.fn.cycle.commonReset(curr, next, opts);
			opts.cssBefore.left = fwd ? (next.cycleW - 1) : (1 - next.cycleW);
			opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
		});
		opts.cssFirst = {
			left: 0
		};
		opts.cssBefore = {
			top: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			top: 0
		};
	};
	$.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
		$cont.css('overflow', 'hidden');
		opts.before.push(function(curr, next, opts, fwd) {
			$.fn.cycle.commonReset(curr, next, opts);
			opts.cssBefore.top = fwd ? (1 - next.cycleH) : (next.cycleH - 1);
			opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
		});
		opts.cssFirst = {
			top: 0
		};
		opts.cssBefore = {
			left: 0
		};
		opts.animIn = {
			top: 0
		};
		opts.animOut = {
			left: 0
		};
	};
	$.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$(opts.elements).not(curr).hide();
			$.fn.cycle.commonReset(curr, next, opts, false, true);
			opts.animIn.width = next.cycleW;
		});
		opts.cssBefore = {
			left: 0,
			top: 0,
			width: 0
		};
		opts.animIn = {
			width: 'show'
		};
		opts.animOut = {
			width: 0
		};
	};
	$.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$(opts.elements).not(curr).hide();
			$.fn.cycle.commonReset(curr, next, opts, true, false);
			opts.animIn.height = next.cycleH;
		});
		opts.cssBefore = {
			left: 0,
			top: 0,
			height: 0
		};
		opts.animIn = {
			height: 'show'
		};
		opts.animOut = {
			height: 0
		};
	};
	$.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
		var i, w = $cont.css('overflow', 'visible').width();
		$slides.css({
			left: 0,
			top: 0
		});
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, true, true);
		});
		if (!opts.speedAdjusted) {
			opts.speed = opts.speed / 2;
			opts.speedAdjusted = true;
		}
		opts.random = 0;
		opts.shuffle = opts.shuffle || {
			left: -w,
			top: 15
		};
		opts.els = [];
		for (i = 0; i < $slides.length; i++)
			opts.els.push($slides[i]);
		for (i = 0; i < opts.currSlide; i++)
			opts.els.push(opts.els.shift());
		opts.fxFn = function(curr, next, opts, cb, fwd) {
			var $el = fwd ? $(curr) : $(next);
			$(next).css(opts.cssBefore);
			var count = opts.slideCount;
			$el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
				var hops = $.fn.cycle.hopsFromLast(opts, fwd);
				for (var k = 0; k < hops; k++)
					fwd ? opts.els.push(opts.els.shift()) : opts.els.unshift(opts.els.pop());
				if (fwd) {
					for (var i = 0, len = opts.els.length; i < len; i++)
						$(opts.els[i]).css('z-index', len - i + count);
				} else {
					var z = $(curr).css('z-index');
					$el.css('z-index', parseInt(z) + 1 + count);
				}
				$el.animate({
					left: 0,
					top: 0
				}, opts.speedOut, opts.easeOut, function() {
					$(fwd ? this : curr).hide();
					if (cb) cb();
				});
			});
		};
		opts.cssBefore = {
			display: 'block',
			opacity: 1,
			top: 0,
			left: 0
		};
	};
	$.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, false);
			opts.cssBefore.top = next.cycleH;
			opts.animIn.height = next.cycleH;
		});
		opts.cssFirst = {
			top: 0
		};
		opts.cssBefore = {
			left: 0,
			height: 0
		};
		opts.animIn = {
			top: 0
		};
		opts.animOut = {
			height: 0
		};
	};
	$.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, false);
			opts.animIn.height = next.cycleH;
			opts.animOut.top = curr.cycleH;
		});
		opts.cssFirst = {
			top: 0
		};
		opts.cssBefore = {
			left: 0,
			top: 0,
			height: 0
		};
		opts.animOut = {
			height: 0
		};
	};
	$.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, false, true);
			opts.cssBefore.left = next.cycleW;
			opts.animIn.width = next.cycleW;
		});
		opts.cssBefore = {
			top: 0,
			width: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			width: 0
		};
	};
	$.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, false, true);
			opts.animIn.width = next.cycleW;
			opts.animOut.left = curr.cycleW;
		});
		opts.cssBefore = {
			top: 0,
			left: 0,
			width: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			width: 0
		};
	};
	$.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, false, false, true);
			opts.cssBefore.top = next.cycleH / 2;
			opts.cssBefore.left = next.cycleW / 2;
			opts.animIn = {
				top: 0,
				left: 0,
				width: next.cycleW,
				height: next.cycleH
			};
			opts.animOut = {
				width: 0,
				height: 0,
				top: curr.cycleH / 2,
				left: curr.cycleW / 2
			};
		});
		opts.cssFirst = {
			top: 0,
			left: 0
		};
		opts.cssBefore = {
			width: 0,
			height: 0
		};
	};
	$.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, false, false);
			opts.cssBefore.left = next.cycleW / 2;
			opts.cssBefore.top = next.cycleH / 2;
			opts.animIn = {
				top: 0,
				left: 0,
				width: next.cycleW,
				height: next.cycleH
			};
		});
		opts.cssBefore = {
			width: 0,
			height: 0
		};
		opts.animOut = {
			opacity: 0
		};
	};
	$.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
		var w = $cont.css('overflow', 'hidden').width();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts);
			opts.animIn.width = next.cycleW;
			opts.animOut.left = curr.cycleW;
		});
		opts.cssBefore = {
			left: w,
			top: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			left: w
		};
	};
	$.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
		var h = $cont.css('overflow', 'hidden').height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts);
			opts.animIn.height = next.cycleH;
			opts.animOut.top = curr.cycleH;
		});
		opts.cssBefore = {
			top: h,
			left: 0
		};
		opts.animIn = {
			top: 0
		};
		opts.animOut = {
			top: h
		};
	};
	$.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
		var h = $cont.css('overflow', 'hidden').height();
		var w = $cont.width();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts);
			opts.animIn.height = next.cycleH;
			opts.animOut.top = curr.cycleH;
		});
		opts.cssBefore = {
			top: h,
			left: w
		};
		opts.animIn = {
			top: 0,
			left: 0
		};
		opts.animOut = {
			top: h,
			left: w
		};
	};
	$.fn.cycle.transitions.growX = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, false, true);
			opts.cssBefore.left = this.cycleW / 2;
			opts.animIn = {
				left: 0,
				width: this.cycleW
			};
			opts.animOut = {
				left: 0
			};
		});
		opts.cssBefore = {
			width: 0,
			top: 0
		};
	};
	$.fn.cycle.transitions.growY = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, false);
			opts.cssBefore.top = this.cycleH / 2;
			opts.animIn = {
				top: 0,
				height: this.cycleH
			};
			opts.animOut = {
				top: 0
			};
		});
		opts.cssBefore = {
			height: 0,
			left: 0
		};
	};
	$.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, false, true, true);
			opts.cssBefore.left = next.cycleW / 2;
			opts.animIn = {
				left: 0,
				width: this.cycleW
			};
			opts.animOut = {
				left: curr.cycleW / 2,
				width: 0
			};
		});
		opts.cssBefore = {
			top: 0,
			width: 0
		};
	};
	$.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, false, true);
			opts.cssBefore.top = next.cycleH / 2;
			opts.animIn = {
				top: 0,
				height: next.cycleH
			};
			opts.animOut = {
				top: curr.cycleH / 2,
				height: 0
			};
		});
		opts.cssBefore = {
			left: 0,
			height: 0
		};
	};
	$.fn.cycle.transitions.cover = function($cont, $slides, opts) {
		var d = opts.direction || 'left';
		var w = $cont.css('overflow', 'hidden').width();
		var h = $cont.height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts);
			if (d == 'right')
				opts.cssBefore.left = -w;
			else if (d == 'up')
				opts.cssBefore.top = h;
			else if (d == 'down')
				opts.cssBefore.top = -h;
			else
				opts.cssBefore.left = w;
		});
		opts.animIn = {
			left: 0,
			top: 0
		};
		opts.animOut = {
			opacity: 1
		};
		opts.cssBefore = {
			top: 0,
			left: 0
		};
	};
	$.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
		var d = opts.direction || 'left';
		var w = $cont.css('overflow', 'hidden').width();
		var h = $cont.height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, true, true);
			if (d == 'right')
				opts.animOut.left = w;
			else if (d == 'up')
				opts.animOut.top = -h;
			else if (d == 'down')
				opts.animOut.top = h;
			else
				opts.animOut.left = -w;
		});
		opts.animIn = {
			left: 0,
			top: 0
		};
		opts.animOut = {
			opacity: 1
		};
		opts.cssBefore = {
			top: 0,
			left: 0
		};
	};
	$.fn.cycle.transitions.toss = function($cont, $slides, opts) {
		var w = $cont.css('overflow', 'visible').width();
		var h = $cont.height();
		opts.before.push(function(curr, next, opts) {
			$.fn.cycle.commonReset(curr, next, opts, true, true, true);
			if (!opts.animOut.left && !opts.animOut.top)
				opts.animOut = {
					left: w * 2,
					top: -h / 2,
					opacity: 0
			};
			else
				opts.animOut.opacity = 0;
		});
		opts.cssBefore = {
			left: 0,
			top: 0
		};
		opts.animIn = {
			left: 0
		};
	};
	$.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
		var w = $cont.css('overflow', 'hidden').width();
		var h = $cont.height();
		opts.cssBefore = opts.cssBefore || {};
		var clip;
		if (opts.clip) {
			if (/l2r/.test(opts.clip))
				clip = 'rect(0px 0px ' + h + 'px 0px)';
			else if (/r2l/.test(opts.clip))
				clip = 'rect(0px ' + w + 'px ' + h + 'px ' + w + 'px)';
			else if (/t2b/.test(opts.clip))
				clip = 'rect(0px ' + w + 'px 0px 0px)';
			else if (/b2t/.test(opts.clip))
				clip = 'rect(' + h + 'px ' + w + 'px ' + h + 'px 0px)';
			else if (/zoom/.test(opts.clip)) {
				var top = parseInt(h / 2);
				var left = parseInt(w / 2);
				clip = 'rect(' + top + 'px ' + left + 'px ' + top + 'px ' + left + 'px)';
			}
		}
		opts.cssBefore.clip = opts.cssBefore.clip || clip || 'rect(0px 0px 0px 0px)';
		var d = opts.cssBefore.clip.match(/(\d+)/g);
		var t = parseInt(d[0]),
			r = parseInt(d[1]),
			b = parseInt(d[2]),
			l = parseInt(d[3]);
		opts.before.push(function(curr, next, opts) {
			if (curr == next) return;
			var $curr = $(curr),
				$next = $(next);
			$.fn.cycle.commonReset(curr, next, opts, true, true, false);
			opts.cssAfter.display = 'block';
			var step = 1,
				count = parseInt((opts.speedIn / 13)) - 1;
			(function f() {
				var tt = t ? t - parseInt(step * (t / count)) : 0;
				var ll = l ? l - parseInt(step * (l / count)) : 0;
				var bb = b < h ? b + parseInt(step * ((h - b) / count || 1)) : h;
				var rr = r < w ? r + parseInt(step * ((w - r) / count || 1)) : w;
				$next.css({
					clip: 'rect(' + tt + 'px ' + rr + 'px ' + bb + 'px ' + ll + 'px)'
				});
				(step++ <= count) ? setTimeout(f, 13) : $curr.css('display', 'none');
			})();
		});
		opts.cssBefore = {
			display: 'block',
			opacity: 1,
			top: 0,
			left: 0
		};
		opts.animIn = {
			left: 0
		};
		opts.animOut = {
			left: 0
		};
	};
})(jQuery);
jQuery.easing['jswing'] = jQuery.easing['swing'];
jQuery.extend(jQuery.easing, {
	def: 'easeOutQuad',
	swing: function(x, t, b, c, d) {
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function(x, t, b, c, d) {
		return c * (t /= d) * t + b;
	},
	easeOutQuad: function(x, t, b, c, d) {
		return -c * (t /= d) * (t - 2) + b;
	},
	easeInOutQuad: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t + b;
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInCubic: function(x, t, b, c, d) {
		return c * (t /= d) * t * t + b;
	},
	easeOutCubic: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	easeInOutCubic: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	easeInQuart: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t + b;
	},
	easeOutQuart: function(x, t, b, c, d) {
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeInOutQuart: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	easeInQuint: function(x, t, b, c, d) {
		return c * (t /= d) * t * t * t * t + b;
	},
	easeOutQuint: function(x, t, b, c, d) {
		return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	easeInOutQuint: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
		return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	easeInSine: function(x, t, b, c, d) {
		return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	easeOutSine: function(x, t, b, c, d) {
		return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	easeInOutSine: function(x, t, b, c, d) {
		return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	easeInExpo: function(x, t, b, c, d) {
		return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	easeOutExpo: function(x, t, b, c, d) {
		return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	easeInOutExpo: function(x, t, b, c, d) {
		if (t == 0) return b;
		if (t == d) return b + c;
		if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
		return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function(x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	easeOutCirc: function(x, t, b, c, d) {
		return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	easeInOutCirc: function(x, t, b, c, d) {
		if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
		return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	easeInElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	easeOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d) == 1) return b + c;
		if (!p) p = d * .3;
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a);
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	easeInOutElastic: function(x, t, b, c, d) {
		var s = 1.70158;
		var p = 0;
		var a = c;
		if (t == 0) return b;
		if ((t /= d / 2) == 2) return b + c;
		if (!p) p = d * (.3 * 1.5);
		if (a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else var s = p / (2 * Math.PI) * Math.asin(c / a); if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	easeInBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	easeOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	easeInOutBack: function(x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	easeInBounce: function(x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b;
	},
	easeOutBounce: function(x, t, b, c, d) {
		if ((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if (t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
		} else if (t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
		} else {
			return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
		}
	},
	easeInOutBounce: function(x, t, b, c, d) {
		if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
});

function loading() {
	$('#logo').stop().delay(150).fadeOut(150, function() {
		$('#ball').stop().delay(150).animate({
			width: 0,
			height: 0,
			marginTop: 0,
			marginLeft: 0,
		}, {
			duration: 250,
			easing: 'easeInOutExpo',
			complete: function() {
				/*
				if (url != '#/') {
					var lUrl = url.split("/");
					if (lUrl[1] == 'line') cscrf = true;
					else if (url == '#/realizzazione-siti-web-milano/') {
						_gaq.push(['_trackPageview', 'realizzazione-siti-web-milano/']);
						location.hash = '/';
					} else if (lUrl.length == 4) portfolio(url);
				}
				*/
				$('.bg_black:first').css('overflow-y', 'hidden');
				$('body').css('overflow', 'auto');
				$('#loading').stop().delay(150).fadeOut(500, function() {
					$('#home').fadeIn(250, function() {
						$('#home_nav_1').fadeIn(100, function() {
							$('#home_nav_2').fadeIn(100, function() {
								$('#home_nav_3').fadeIn(100, function() {
									$('#awwwards').delay(100).fadeIn(100);
									$('#awwwards a').attr('target', '_blank');
									$('#layout > header').show();
									var scale = 3;
									var counter = 0;
									$('#home_text').find('img').each(function() {
										var obj = homeArray[counter];
										$(this).css({
											'height': (obj.h / scale) + 'px',
											'width': (obj.w / scale) + 'px',
											'margin-top': (obj.mT / scale) + 'px',
											'margin-left': (obj.mL / scale) + 'px',
										});
										counter++;
									});
									var counter = 0;
									$('#mission_pensiero_text').find('img').each(function() {
										var obj = missionPensieroArray[counter];
										$(this).css({
											'height': (obj.h / scale) + 'px',
											'width': (obj.w / scale) + 'px',
											'margin-top': (obj.mT / scale) + 'px',
											'margin-left': (obj.mL / scale) + 'px',
										});
										counter++;
									});
									var counter = 0;
									$('#mission_gioco_text').find('img').each(function() {
										var obj = missionGiocoArray[counter];
										$(this).css({
											'height': (obj.h / scale) + 'px',
											'width': (obj.w / scale) + 'px',
											'margin-top': (obj.mT / scale) + 'px',
											'margin-left': (obj.mL / scale) + 'px',
										});
										counter++;
									});
									var counter = 0;
									$('#mission_soluzioni_text').find('img').each(function() {
										var obj = missionSoluzioniArray[counter];
										$(this).css({
											'height': (obj.h / scale) + 'px',
											'width': (obj.w / scale) + 'px',
											'margin-top': (obj.mT / scale) + 'px',
											'margin-left': (obj.mL / scale) + 'px',
										});
										counter++;
									});
									scale = 1;
									if ($(window).height() < 800 && $(window).height() > 400) {
										scale = (800 / $(window).height());
									} else if ($(window).height() <= 400) {
										scale = 2;
									}
									var timeDuration = 750;
									var timeOut = 75;
									var counter = 0;
									$('#home_text').find('img').each(function() {
										var obj = homeArray[counter];
										$(this).delay(timeOut * (1 + counter)).animate({
											opacity: 1,
											height: (obj.h / scale) + 'px',
											width: (obj.w / scale) + 'px',
											marginTop: (obj.mT / scale) + 'px',
											marginLeft: (obj.mL / scale) + 'px',
										}, {
											duration: timeDuration,
											easing: 'easeInOutExpo'
										});
										counter++;
									});
								});
							});
						});
					});
				});
			}
		});
	});
}
var qLimageContainer = "";
(function($) {
	var check = 0;
	var qLimages = new Array;
	var qLdone = 0;
	var qLimageContainer = "";
	var qLpercentage = "";
	var qLimageCounter = 0;
	var createPreloadContainer = function() {
		qLimageContainer = $("<div></div>").appendTo("body").css({
			display: "none",
			width: 0,
			height: 0,
			overflow: "hidden"
		});
		for (var i = 0; qLimages.length > i; i++) {
			$.ajax({
				url: qLimages[i],
				type: 'HEAD',
				success: function(data) {
					qLimageCounter++;
					addImageForPreload(this['url']);
				}
			});
		}
	}
	var addImageForPreload = function(url) {
		if (loadAnCheck == true) {
			var image = $("<img />").attr("src", url).bind("load", function() {
				completeImageLoading();
			}).appendTo(qLimageContainer);
		}
	}
	var completeImageLoading = function() {
		qLdone++;
		if (qLdone == qLimageCounter) check++;
		var percentage = parseInt((qLdone / qLimages.length) * 100);
		if (check > 75 || percentage >= 90) percentage = (qLdone / qLimageCounter) * 100;
		if (percentage > loadAn && percentage <= 100) {
			loadAn = percentage;
			$(qLpercentage).text(Math.ceil(loadAn) + "%");
			clearTimeout(loadTimer);
			loadTimer = setTimeout('$(qLpercentage).text("100%"); loadAnCheck = false; loading(); $(qLimageContainer).remove();', 7000);
		}
		if (loadAn == 100 && loadAnCheck == true) {
			loadAnCheck = false;
			clearTimeout(loadTimer);
			$(qLimageContainer).remove();
			loading();
		}
	}
	var createOverlayLoader = function() {
		if ($('#qLpercentage').css('color') == undefined) {
			loadTimer = setTimeout('$(qLpercentage).text("100%"); loadAnCheck = false; loading(); $(qLimageContainer).remove();', 7000);
			qLpercentage = $("<div id='qLpercentage'></div>").text("0%").appendTo("#logo");
		}
	}
	var findImageInElement = function(element) {
		if (loadAnCheck == true) {
			var url = "";
			if ($(element).css("background-image") != "none") {
				var url = $(element).css("background-image");
			} else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
				var url = $(element).attr("src");
			}
			if (url.indexOf("gradient") == -1) {
				url = url.replace(/url\(\"/g, "");
				url = url.replace(/url\(/g, "");
				url = url.replace(/\"\)/g, "");
				url = url.replace(/\)/g, "");
				var urls = url.split(", ");
				for (var i = 0; i < urls.length; i++) {
					if (urls[i].length > 0) {
						var extra = "";
						if ($.browser.msie && $.browser.version < 9) {
							extra = "?" + Math.floor(Math.random() * 3000);
						}
						qLimages.push(urls[i] + extra);
					}
				}
			}
		}
	}
	$.fn.queryLoader2 = function() {
		$('#layout .bg_black:first').css('height', 'auto');
		$('.glare' + ',#layout > header' + ', #home' + ', #home_nav_1' + ', #home_nav_2' + ', #home_nav_3').css('opacity', 1);
		$('.glare, #layout > header, #home, #home_nav_1, #home_nav_2, #home_nav_3').hide();
		$('#loading, #layout .bg_black:first a.next').show();
		$('.glare').fadeIn(500, function() {
			$('#ball').stop().delay(250).animate({
				width: '240px',
				height: '240px',
				marginTop: '-' + 120 + 'px',
				marginLeft: '-' + 120 + 'px',
			}, {
				duration: 250,
				easing: 'easeInOutExpo',
				complete: function() {
					$('#logo').stop().delay(250).fadeIn(250, function() {
						$('body').each(function() {
							$(this).find("*:not(script)").each(function() {
								findImageInElement(this);
							});
						});
						createPreloadContainer();
						createOverlayLoader();
					});
				}
			});
		});
		return this;
	};
})(jQuery);

function portfolioClose() {
	if ($('body').css('overflow') == 'auto' || !queryAjaxClose) return false;
	queryAjaxClose = false;
	$('body').css('overflow-y', 'scroll');
	$('#portfolio_box').css('overflow-y', 'hidden');
	location.hash = '/';
	$('#portfolio_box').animate({
		marginTop: '-' + $(window).height() + 'px'
	}, {
		queue: false,
		duration: 1000,
		easing: 'easeInOutExpo',
		complete: function() {
			$('body').css('overflow', 'auto');
			slide = [];
			$('#portfolio_box').hide();
			$('#portfolio_box content').remove();
			queryAjax = true;
			queryAjaxClose = true;
		}
	});
}

function portfolio(x) {
	if (x == '#' || !queryAjax) return false;
	queryAjax = false;
	x = x.replace('#/', '');
	var h = x.split("/");

	var xId = h[1];
	var xTitle = h[0];
	$('#portfolio_box').show();
	$('#portfolio_box').animate({
		marginTop: 0
	}, {
		queue: false,
		duration: 1000,
		easing: 'easeInOutExpo',
		complete: function() {
			$('body').css('overflow', 'hidden');
			$('#portfolio_box').css('overflow-y', 'scroll');
			$.ajax({
				beforeSend: function() {
					$('<div id="load"></div>').hide().appendTo('#portfolio_box .glare');
					$('#load').stop().fadeIn(250);
				},
				complete: function() {
					//_gaq.push(['_trackPageview', x]);
					$('#load').stop().fadeOut(250);
				},
				type: "post",
				url: 'portfolio.php',
				data: {
					id: xId
				},
				async: true,
				success: function(text) {
					$(text).hide().appendTo('#portfolio_box .glare');
					$('#portfolio_slide').css({
						'height': $(window).height() - 140 + 'px'
					});
					$('#portfolio_box').height($(window).height());
					$('#portfolio_box h2, #portfolio_close, #portfolio_prev, #portfolio_next, #portfolio_slide').hide();
					$('#portfolio_close span, #portfolio_prev span, #portfolio_next span').hide();
					$('#portfolio_slide').find('img').each(function() {
						slide.push($(this).attr('src'));
						$(this).remove();
					});
					$('#portfolio_slide .slide').css({
						'height': $(window).height() - 140 + 'px'
					});
					$('#portfolio_box content').show();
					var counter = 0;
					$('#portfolio_slide').find('.slide').each(function() {
						var img = '<img src="' + slide[counter] + '" alt="" />';
						var divSlide = $(this);
						$(img).load(function() {
							$(this).hide().appendTo(divSlide);
							portfolioImg($(this));
							$(this).stop().fadeIn(250);
						});
						counter++;
					});
					$('#portfolio_box h2').fadeIn(250, function() {
						$('#portfolio_close').fadeIn(50, function() {
							$('#portfolio_slide').fadeIn(250, function() {
								$('#portfolio_next, #portfolio_prev').fadeIn(50);
								$('#portfolio_close').click(function(e) {
									e.preventDefault();
									portfolioClose();
								});
								if ($('#portfolio_prev').css('background') != undefined) {
									$(document).keydown(function(e) {
										if (e.which == 27 || e.which == 32) {
											portfolioClose();
										}
										if (e.which == 37 && $('#portfolio_prev_t').css('z-index') == undefined) $('#portfolio_slide').cycle('prev');
										if (e.which == 39 && $('#portfolio_prev_t').css('z-index') == undefined) $('#portfolio_slide').cycle('next');
									});
								}
							})
						})
					});
					$('a.url, .blank').attr('target', '_blank');
					$("#portfolio_close, #portfolio_prev, #portfolio_next").hover(function() {
						$("span", this).stop(true, true).fadeIn("fast");
					}, function() {
						$("span", this).stop(true, true).fadeOut('slow');
					});
					if ($('#portfolio_prev').css('background') != undefined) {
						$('#portfolio_slide').cycle({
							fx: 'scrollHorz',
							easing: 'easeInOutExpo',
							timeout: 0,
							speed: 750,
							next: '#portfolio_next, #portfolio_slide img',
							prev: '#portfolio_prev',
							prevNextClick: function(isNext, zeroBasedSlideIndex, slideElement) {
								$('<div id="portfolio_prev_t"></div>').appendTo('#portfolio_box content');
								$('<div id="portfolio_next_t"></div>').appendTo('#portfolio_box content');
								$('#portfolio_box footer div span').text(zeroBasedSlideIndex + 1);
							},
							after: function(currSlideElement, nextSlideElement, options, forwardFlag) {
								$('#portfolio_prev_t, #portfolio_next_t').remove();
							}
						});
					}
				},
				error: function() {
					portfolioClose();
				},
				timeout: 10000
			});
		}
	});
}
$.fn.parallasseHome = function(y) {
	var element = $(this);
	var marginTop = parseInt(element.css("margin-top"));
	return this.each(function() {
		$(window).bind('scroll', function() {
			var scrollTop = $(window).scrollTop();
			var height = $('#home').height();
			if ((scrollTop <= height)) {
				element.css({
					"margin-top": (marginTop - (scrollTop * y)) + "px"
				});
			}
		});
	});
};
$.fn.parallasseContatti = function(y) {
	var element = $(this);
	return this.each(function() {
		$(window).bind('scroll', function() {
			var scrollTop = $(window).scrollTop();
			var height = $('#contatti').offset().top - $(window).height();
			if ((scrollTop > height)) {
				element.css({
					"margin-top": "-" + ((Math.floor($(window).height() * y) - Math.floor((scrollTop - height) * y))) + "px"
				});
			} else {
				element.css({
					"margin-top": "-" + Math.floor($(window).height() * y) + "px"
				});
			}
		});
	});
};

function resizeContatti() {
	if ($(window).height() < 920) {
		$('#contatti_text').css({
			'top': '460px',
		});
		$('#map').css({
			'height': ($(window).height() - 300) + 'px',
		});
		if ($('#map').height() <= 280) {
			$('#map').css({
				'height': 280 + 'px',
			});
		}
	} else {
		$('#contatti_text').css({
			'top': '50%',
		});
		$('#map').css({
			'height': 620 + 'px',
		});
	}
}
$(window).scroll(function() {
	if ($('#loading').is(':visible')) {
		$(scrollCheck).animate({
			scrollTop: 0
		}, 0);
	}
	var scrollTop = $(window).scrollTop();
	var windowHeight = $(window).height();
	var timeDuration = 750;
	var timeOut = 75;
	var op = 0.05;
	var home = $('#home').offset().top;
	var mission = $('#mission').offset().top;
	var missionPensiero = $('#mission_pensiero_text').offset().top;
	var missionGioco = $('#mission_gioco_text').offset().top;
	var missionSoluzioni = $('#mission_soluzioni_text').offset().top;
	var portfolio = $('#portfolio').offset().top;
	var contatti = $('#contatti').offset().top;
	if (!missionPensieroCheck && !missionGiocoCheck && !missionSoluzioniCheck && (scrollTop >= (portfolio - 100))) {
		$('#mission img').stop().animate({
			opacity: op
		}, 100);
	}
	if (scrollTop <= $('#home').height()) {
		if ($('#home_text').is(":hidden")) {
			$('#home_text').show();
		}
	} else {
		$('#home_text').hide();
	}
	if (!loadAnCheck && !debug) {
		if (missionPensieroCheck && scrollTop >= (missionPensiero - windowHeight / 2)) {
			var counter = 0;
			$('#mission_pensiero_text').find('img').each(function() {
				var obj = missionPensieroArray[counter];
				$(this).delay(timeOut * (1 + counter)).animate({
					opacity: 1,
					height: obj.h + 'px',
					width: obj.w + 'px',
					marginTop: obj.mT + 'px',
					marginLeft: obj.mL + 'px',
				}, {
					duration: timeDuration,
					easing: 'easeInOutExpo'
				});
				counter++;
			});
			setTimeout(function() {
				missionPensieroCheck = false;
			}, (missionPensieroArray.length * timeOut) + timeDuration);
		}
		if (!missionPensieroCheck && scrollTop >= (missionPensiero - windowHeight / 2) && scrollTop <= (missionGioco + windowHeight / 2)) {
			$('#mission_pensiero_text').find('img').each(function() {
				if (scrollTop <= ($(this).offset().top - 80)) {
					$(this).stop().animate({
						opacity: 1
					}, 250);
				} else {
					$(this).stop().animate({
						opacity: op
					}, 100);
				}
			});
		}
		if (missionGiocoCheck && scrollTop >= (missionGioco - windowHeight / 2)) {
			var counter = 0;
			$('#mission_gioco_text').find('img').each(function() {
				var obj = missionGiocoArray[counter];
				$(this).delay(timeOut * (1 + counter)).animate({
					opacity: 1,
					height: obj.h + 'px',
					width: obj.w + 'px',
					marginTop: obj.mT + 'px',
					marginLeft: obj.mL + 'px',
				}, {
					duration: timeDuration,
					easing: 'easeInOutExpo'
				});
				counter++;
			});
			setTimeout(function() {
				missionGiocoCheck = false;
			}, (missionGiocoArray.length * timeOut) + timeDuration);
		}
		if (!missionGiocoCheck && scrollTop >= (missionGioco - windowHeight / 2) && scrollTop <= (missionSoluzioni + windowHeight / 2)) {
			$('#mission_gioco_text').find('img').each(function() {
				if (scrollTop <= ($(this).offset().top - 80)) {
					$(this).stop().animate({
						opacity: 1
					}, 250);
				} else {
					$(this).stop().animate({
						opacity: op
					}, 100);
				}
			});
		}
		if (scrollTop >= (missionSoluzioni - windowHeight / 2) && $('#mission_soluzioni_text img:last-child').css('opacity') == 0) {
			var counter = 0;
			$('#mission_soluzioni_text').find('img').each(function() {
				var obj = missionSoluzioniArray[counter];
				$(this).delay(timeOut * (1 + counter)).animate({
					opacity: 1,
					height: obj.h + 'px',
					width: obj.w + 'px',
					marginTop: obj.mT + 'px',
					marginLeft: obj.mL + 'px',
				}, {
					duration: timeDuration,
					easing: 'easeInOutExpo'
				});
				counter++;
			});
			setTimeout(function() {
				missionSoluzioniCheck = false;
			}, (missionSoluzioniArray.length * timeOut) + timeDuration);
		}
		if (!missionSoluzioniCheck && scrollTop >= (missionSoluzioni - windowHeight / 2) && scrollTop <= (portfolio + windowHeight / 2)) {
			$('#mission_soluzioni_text').find('img').each(function() {
				if (scrollTop <= ($(this).offset().top - 80)) {
					$(this).stop().animate({
						opacity: 1
					}, 250);
				} else {
					$(this).stop().animate({
						opacity: op
					}, 100);
				}
			});
		}
	}
	if (scrollTop >= (portfolio - windowHeight / 4) && scrollTop <= (portfolio + $('#portfolio').height() + windowHeight / 2)) {
		if (scrollTop <= ($('#portfolio h2').offset().top - 100)) {
			$('#portfolio h2').stop().fadeTo(350, 1);
		} else {
			$('#portfolio h2').stop().fadeTo(175, op);
		}
		var counterFade = 0;
		$('.box').each(function() {
			if (scrollTop <= ($(this).offset().top - 100)) {
				$(this).stop().delay(timeOut * (1 + counterFade)).fadeTo(350, 1);
				$(this).find('a').css('cursor', 'pointer');
			} else {
				$(this).stop().delay(timeOut * (1 + counterFade)).fadeTo(175, op);
				$(this).find('a').css('cursor', 'default');
			}
			counterFade++;
		});
	} else {
		$('#portfolio h2, .box').stop().fadeTo(175, op);
	}
	if (scrollTop > (contatti - windowHeight * 1.5)) {
		if ($('#contatti_text').is(":hidden")) {
			$('#contatti_text').fadeIn(100);
			resizeContatti();
		}
	} else {
		$('#contatti_text').hide();
	}
	if (cscrf) {
		if (scrollTop > 0 && scrollTop < portfolio) {
			$('#mission_line').css("background", "url(img/mission_line.png) center " + (scrollTop * -2.0) + "px repeat-y");
		}
	}
});
$(function() {
	$('a[href*=#]').click(function() {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[id=' + this.hash.slice(1) + ']');
			if ($target.length) {
				var targetOffset = $target.offset().top;
				$(scrollCheck).animate({
					scrollTop: targetOffset,
				}, {
					duration: 1500,
					easing: 'easeInOutExpo',
					queue: false
				});
				return false;
			}
		}
	});
});

function portfolioImg(x) {
	var elem = x;
	var imgWidth = 1440;
	var imgHeight = 900;
	var minWidth = 520;
	var targetHeight = $(window).height() - 140;
	var targetWidth = $(window).width();
	var winH = targetHeight;
	var winW = targetWidth;
	var ratio = 0;
	var targetImgHeight;
	var targetImgWidth;
	if (targetWidth < minWidth) {
		targetWidth = minWidth;
	}
	if ((targetHeight > targetWidth)) {
		ratio = imgWidth / imgHeight;
		targetImgHeight = targetHeight;
		targetImgWidth = targetImgHeight * ratio;
		if (targetImgWidth > winW) {
			ratio = imgHeight / imgWidth;
			targetImgWidth = winW;
			targetImgHeight = targetImgWidth * ratio;
		}
	} else {
		ratio = imgHeight / imgWidth;
		targetImgWidth = targetWidth;
		targetImgHeight = targetImgWidth * ratio;
		if (targetImgHeight > winH) {
			ratio = imgWidth / imgHeight;
			targetImgHeight = winH;
			targetImgWidth = targetImgHeight * ratio;
		}
	}
	var imgMarginTop = -(targetImgHeight - targetHeight) / 2
	var imgMarginLeft = -(targetImgWidth - targetWidth) / 2;
	console.log(targetImgWidth);
	elem.css({
		'height': targetImgHeight,
		'width': targetImgWidth,
		'marginTop': imgMarginTop,
		'marginLeft': imgMarginLeft
	});
}

function layoutResize() {
	$('#portfolio_box, #loading, #home, #home_nav_1, #home_nav_2, #home_nav_3, #contatti').height($(window).height());
	$('#mission_pensiero_text, #mission_gioco_text, #mission_soluzioni_text, #portfolio').css('min-height', $(window).height() - 160 + 'px');
	if ($('#portfolio_box').is(':hidden')) {
		$('#portfolio_box').css('marginTop', '-' + $(window).height() + 'px');
	} else {
		portfolioImg($('#portfolio_slide img'));
	}
	$('#portfolio_slide, #portfolio_slide .slide').css({
		'height': $(window).height() - 140 + 'px'
	});
	if ($(window).width() < 1120) {
		$('#layout > header').css({
			'left': '0',
			'margin-left': '10px',
		});
		$('#loading, #home, #home_nav_1, #home_nav_2, #home_nav_3, #mission, #portfolio, #contatti').css({
			'background-position': 'left top',
		});
	} else {
		$('#layout > header').css({
			'left': '50%',
			'margin-left': '-550px',
		});
		$('#loading, #home, #home_nav_1, #home_nav_2, #home_nav_3, #mission, #portfolio, #contatti').css({
			'background-position': 'center top',
		});
	}
	var scale = 1;
	if ($(window).height() < 800 && $(window).height() > 400) {
		scale = (800 / $(window).height());
		$('#home_text').css({
			'top': '50%',
		});
	} else if ($(window).height() <= 400) {
		scale = 2;
		$('#home_text').css({
			'top': '200px',
		});
	}
	var counter = 0;
	$('#home_text').find('img').each(function() {
		var obj = homeArray[counter];
		$(this).css({
			'height': (obj.h / scale) + 'px',
			'width': (obj.w / scale) + 'px',
			'margin-top': (obj.mT / scale) + 'px',
			'margin-left': (obj.mL / scale) + 'px',
		});
		counter++;
	})
	$('#home_thats').parallasseHome(0.10 / scale);
	$('#home_the').parallasseHome(0.20 / scale);
	$('#home_way').parallasseHome(0.15 / scale);
	$('#home_we').parallasseHome(0.25 / scale);
	$('#home_like').parallasseHome(0.30 / scale);
	$('#home_it').parallasseHome(0.30 / scale);
	$('#home_brand').parallasseHome(0.35 / scale);
	resizeContatti();
	$('#contatti_text h2').parallasseContatti(0.15);
	$('#map').parallasseContatti(0.20);
	$('#contatti_text .box').parallasseContatti(0.30);
}

function magnetEffect() {
	var scrollTop = $(window).scrollTop();
	var bodyHeight = $('#contatti').offset().top + $(window).height();
	var nav = new Array($('#home').offset().top, $('#mission').offset().top, $('#portfolio').offset().top, $('#contatti').offset().top);
	var differenceWinner = bodyHeight;
	var result = 0;
	for (var i = 0; i < nav.length; i++) {
		var difference = nav[i] - scrollTop;
		if (difference < 0) difference = difference * -1;
		if (difference < differenceWinner) {
			differenceWinner = difference;
			result = nav[i];
		};
	}
	$(scrollCheck).animate({
		scrollTop: result,
	}, {
		duration: 1500,
		easing: 'easeInOutExpo',
		queue: false
	});
}
$(window).resize(function() {
	layoutResize();
	magnetEffect();
});
$(window).bind('hashchange', function(e) {
	url = location.hash;
	var lUrl = url.split("/");
	if (url == '#/') {
		portfolioClose()
	}
	if (lUrl.length == 4) {
		portfolio(url);
	}
});
$(document).keydown(function(e) {
	if (e.which == 32) {
		return false;
	}
});
$(document).ready(function() {
	$(scrollCheck).stop().animate({
		scrollTop: 0
	}, {
		complete: function() {
			if (!debug) {
				$('img').attr('alt', '');
				$('body').css('overflow', 'hidden');
				$('.bg_black:first').css('overflow-y', 'scroll');
			}
			$('#layout').show();
			$('#home_text').find('img').each(function() {
				var obj = {};
				obj.h = $(this).height();
				obj.w = $(this).width();
				obj.mL = parseInt($(this).css('marginLeft'));
				obj.mT = parseInt($(this).css('marginTop'));
				homeArray.push(obj);
			});
			$('#mission_pensiero_text').find('img').each(function() {
				var obj = {};
				obj.h = $(this).height();
				obj.w = $(this).width();
				obj.mL = parseInt($(this).css('marginLeft'));
				obj.mT = parseInt($(this).css('marginTop'));
				missionPensieroArray.push(obj);
			});
			$('#mission_gioco_text').find('img').each(function() {
				var obj = {};
				obj.h = $(this).height();
				obj.w = $(this).width();
				obj.mL = parseInt($(this).css('marginLeft'));
				obj.mT = parseInt($(this).css('marginTop'));
				missionGiocoArray.push(obj);
			});
			$('#mission_soluzioni_text').find('img').each(function() {
				var obj = {};
				obj.h = $(this).height();
				obj.w = $(this).width();
				obj.mL = parseInt($(this).css('marginLeft'));
				obj.mT = parseInt($(this).css('marginTop'));
				missionSoluzioniArray.push(obj);
			});
			if (!debug) {
				$('#home_text img' + ', #mission_pensiero_text img' + ', #mission_gioco_text img' + ', #mission_soluzioni_text img').css('opacity', 0);
				$('.glare' + ',#layout > header' + ', #home' + ', #home_nav_1' + ', #home_nav_2' + ', #home_nav_3').css('opacity', 0);
				$('#layout .bg_black:first').height($(window).height());
				$('#layout, #layout .bg_black:first a.next').hide();
			}
			$('#loading .none').find('img').each(function() {
				preLoading.push($(this).attr('src'));
				$(this).remove();
			});
			for (var i = 0; i < preLoading.length; i++) {
				var img = '<img src="' + preLoading[i] + '" alt="" />';
				$(img).load(function() {
					preLoadingCount++;
					if (preLoadingCount == preLoading.length) {
						$('#layout').fadeIn(500, function() {
							$('nav li a, #contatti_text h2').css('color', 'transparent');
							$('#portfolio_box').css('marginTop', '-' + $(window).height() + 'px')
							$('#portfolio_box').hide();
							$('#comics a' + ', a.url' + ', .blank' + ', a.facebook' + ', a.twitter' + ', a.flickr').attr('target', '_blank');
							if (!debug) {
								$("body").queryLoader2();
							}
							$("#portfolio .box a.p").hover(function() {
								$("span", this).stop(true, true).fadeIn("fast");
							}, function() {
								$("span", this).stop(true, true).fadeOut('slow');
							});
							$("#home_brand").hover(function() {
								$(this).stop().fadeTo(250, 0.5);
							}, function() {
								$(this).stop().fadeTo(250, 1);
							});
							layoutResize();
							$('#portfolio .box a').click(function(e) {
								if ($(this).parent().css('opacity') != 1) {
									e.preventDefault();
									return false;
								} else if ($(this).attr('class') == 'p') {
									e.preventDefault();
									if ($(this).attr('href') != '#') location.hash = '/' + $(this).attr('href');
									portfolio($(this).attr('href'));
								}
							});
						})
					}
				});
			}
		}
	}, 0);
});