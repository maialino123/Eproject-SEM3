(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery'], factory);
	} else if (typeof module === 'object' && module.exports) {
		// Node/CommonJS
		module.exports = function( root, jQuery ) {
			if ( jQuery === undefined ) {
				// require('jQuery') returns a factory that requires window to
				// build a jQuery instance, we normalize how we use modules
				// that require this pattern but the window provided is a noop
				// if it's defined (how jquery works)
				if ( typeof window !== 'undefined' ) {
					jQuery = require('jquery');
				}
				else {
					jQuery = require('jquery')(root);
				}
			}
			factory(jQuery);
			return jQuery;
		};
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {
	'use strict'
	$.fn.numbercontrol = function (methodOrProps) {
		if (methodOrProps === 'destory') {
			this.each(function () {
				$(this).parent().children().each(function (index, value) {
					var thisSelector = $(value);

					if (options.onBeforeDestoryInitialize !== undefined)
						options.onBeforeDestoryInitialize(this);

					if (!thisSelector.is('input'))
						thisSelector.remove();

					if (options.onAfterDestoryInitialize !== undefined)
						options.onAfterDestoryInitialize(this);
				});

				$(this).parent().removeClass().addClass('numberControlDestoryed');
			})
			return this;
		}

		// Allow customizing the options.
		var options = {
			debug: false,
			separator: '.',
			type: 'number',
			prependHtml: '<div class="input-group-prepend"><button class="btn btn-decrease btn-outline-secondary px-1"><span class="oi oi-minus" /></button></div>',
			appendHtml: '<div class="input-group-append"><button class="btn btn-increase btn-outline-secondary px-1"><span class="oi oi-plus" /></button></div>',
			inputParentCss: 'input-group numberControl',
			inputParent: 'div',
			inputCss: 'numberControlInput form-control px-1',
			bindButtonEvents: 'click tap touch touchstart focus',
			keyboardLanguage: {
				'UP' : '<span class="oi oi-chevron-top" />',
				'DOWN' : '<span class="oi oi-chevron-bottom" />',
				'INVERSE' : '<span class="oi oi-transfer" />',
				'SEP' : '<span class="oi oi-media-record" />',
			},
			keyboardControl: {
			},
			buttons: [...Array(10).keys(), 'DELETE', 'CLEAR', 'DONE', 'CANCEL', 'UP', 'DOWN', 'SEP', 'INVERSE']
		}
		for (var option in methodOrProps) {
			options[option] = methodOrProps[option]
		}

		function setNewValue(container, value)
		{
			if (options.onBeforeSetNewvalue !== undefined)
				options.onBeforeSetNewvalue(this, event, container, value);

			if (options.type === 'number')
				$(container).val(parseInt(value));
			else
				$(container).val(parseFloat(value));

			if (options.onAfterSetNewvalue !== undefined)
				options.onAfterSetNewvalue(this, event, container, value);
		}

		// https://stackoverflow.com/questions/9553354/how-do-i-get-the-decimal-places-of-a-floating-point-number-in-javascript
		function precision(a)
		{
			if (!isFinite(a))
				return 0;

			var e = 1, p = 0;
			while (Math.round(a * e) / e !== a)
			{
				e *= 10;
				p++;
			}

			return parseInt(p);
		}

		function FindPercision(v, p)
		{
			if (!isFinite(v))
				return 0;
			return parseInt(v).toString().length + p;
		}

		function findMinMaxValue()
		{
			var testValue;
			for (var i=0; i < arguments.length; i++) {
				testValue = arguments[i];
				if (typeof testValue !== 'undefined' && !isNaN(testValue))
				{
					if (options.type === 'number' && parseInt(testValue) !== null)
						return parseInt(testValue);
					else if (parseFloat(testValue) !== null)
						return parseFloat(testValue);
					continue;
				}
			}
			return 0;
		}

		// Bind to each input selector
		this.each(function () {
			if (options.onBeforeInitialized !== undefined)
				options.onBeforeInitialized(this);

			var $base = $(this);

			// Some settings we either can pull in from a options, from standard attributes or defaults.
			var $step = findMinMaxValue(parseFloat(options.step), parseFloat($base.attr('step')), 1);
			var $percision = precision($step) + 1;
			var $minValue = findMinMaxValue(options.min, $base.attr('min'), Number.MIN_VALUE);
			var $maxValue = findMinMaxValue(options.max, $base.attr('max'), Number.MAX_VALUE);

			// Build the parent up. 
			if (!$($base).parent().is('div') || !$($base).parent().hasClass('numberControlDestoryed')) {
				$base.wrap('<' + options.inputParent + '></' + options.inputParent + '>');
			}
			var $parent = $base.parent(options.parentSelector);
			$parent.removeClass().addClass(options.inputParentCss);

			// Set the base.
			$base.attr('type', options.type);
			$base.addClass(options.inputCss);

			// Wrap the buttons around.			
			$base.before(options.prependHtml);
			$base.after(options.appendHtml);

			// Add the style to the body to cleanup input controls for number.
			if (options.type == 'number' && !options.DisableNumberSpinStyleFix)
				$('body').append('<style>' +
							'.numberControlInput::-webkit-outer-spin-button,.numberControlInput::-webkit-inner-spin-button {' + 
								'-webkit-appearance: none;' +
							'}</style>'
				);

			// The decrease event.
			var $decreaseButton = $parent.find('.btn-decrease');
			$decreaseButton.on(options.bindButtonEvents, function (event) {
				event.preventDefault();

				if (options.onBeforeClickDecrease !== undefined)
					options.onBeforeClickDecrease(this, event);
				if ($base.val() > $minValue)
					setNewValue($base, parseFloat(parseFloat($base.val()) - parseFloat($step)).toPrecision(FindPercision($base.val(), $percision)));
				if (options.onAfterClickDecrease !== undefined)
					options.onAfterClickDecrease(this, event);
				if (options.debug)
					console.log('numbercontrl: decreaseButton: Click', event, parseFloat($base.val()), $minValue, parseFloat($step));
			});

			// The increase event.
			var $increaseButton = $parent.find('.btn-increase');
			$increaseButton.on(options.bindButtonEvents, function (event) {
				event.preventDefault();

				if (options.onBeforeClickIncrease !== undefined)
					options.onBeforeClickIncrease(this, event);
				if ($base.val() < $maxValue)
					setNewValue($base, parseFloat(parseFloat($base.val()) + parseFloat($step)).toPrecision(FindPercision($base.val(), $percision)));
				if (options.onAfterClickIncrease !== undefined)
					options.onAfterClickIncrease(this, event);
				if (options.debug)
					console.log('numbercontrl: increaseButton: Click', event, parseFloat($base.val()), $maxValue, parseFloat($step));
			});

			// The Popup Numberpad
			if (!options.disableVirtualKeyboard)
			{
				var $KeyboardLayout;

				if (options.onBeforeVirtualKeyboardInitalized !== undefined)
					options.onBeforeVirtualKeyboardInitalized(this);

				$base.on(options.bindButtonEvents, function (event) {
					event.stopPropagation();

					if (options.onBeforeVirtualKeyboardOpen !== undefined)
						options.onBeforeVirtualKeyboardOpen(this);

					var $location = options.virtualKeyboardAttachSelector ? $(options.virtualKeyboardAttachSelector) : $base;

					if (options.keyboardLayout)
						$KeyboardLayout = options.keyboardLayout;
					else
						$KeyboardLayout = 
							'<div class="modal-dialog modal-dialog-centered" style="width: 250px;">' +
								'<div class="modal-content">' +
									'<table>' +
										'<tr>' +
											'<td colspan="4">{INPUTBOX}</td>' +
										'</tr><tr>' +
											'<td>{7}</td>' +
											'<td>{8}</td>' +
											'<td>{9}</td>' +
											'<td>{DELETE}</td>' +
										'</tr><tr>' +
											'<td>{4}</td>' +
											'<td>{5}</td>' +
											'<td>{6}</td>' +
											'<td>{CLEAR}</td>' +
										'</tr><tr>' +
											'<td>{1}</td>' +
											'<td>{2}</td>' +
											'<td>{3}</td>' +
											'<td>{DONE}</td>' +
										'</tr><tr>' +
											'<td>{UP}</td>' +
											'<td>{0}</td>' +
											'<td>{DOWN}</td>' +
											'<td>{CANCEL}</td>' +
										'</tr>' +
									'</table>' +
								'</div>' +
							'</div>'
						;

					// Fill out the input.
					if (typeof options.keyboardControl['INPUTBOX'] === 'undefined')
						options.keyboardControl['INPUTBOX'] = '<input class="numberControlVirtualNumPad numberControlVirtualNumPadINPUT form-control" type="text" readonly value="{VAL}"/>';
					$KeyboardLayout = $KeyboardLayout.replace('{INPUTBOX}', options.keyboardControl['INPUTBOX'].replace('{VAL}', $base.val()).toString());

					// Fill out all buttons.
					$.each(options.buttons, function(i, v){
						var LanguageBox = options.keyboardLanguage[v] ? options.keyboardLanguage[v] : v;

						if (typeof options.keyboardControl[v] === 'undefined')
							options.keyboardControl[v] = '<button class="numberControlVirtualNumPad numberControlVirtualNumPad' + v + ' btn btn-outline-secondary w-100" data-function="' + v + '">{' + v + '_LANG}</button>';
						$KeyboardLayout = $KeyboardLayout.replace('{' + v + '}', options.keyboardControl[v].replace('{' + v + '_LANG}', LanguageBox));
					});

					// Attach the keyboard to the container.
					$location.after('<div class="numberControlVirtualNumPad modal d-block">' + $KeyboardLayout + '</div>');
					var $VirtualKeyboard = $parent.find('.numberControlVirtualNumPad');
					var $VirtualKeyboardInput = $VirtualKeyboard.find('.numberControlVirtualNumPadINPUT');

					// Bind the virtual Keyboard action.
					$VirtualKeyboard.find('.numberControlVirtualNumPad').on(options.bindButtonEvents, function(event){						
						event.preventDefault();

						if (options.debug) console.log('numbercontrl: numberControlVirtualNumPad: Click', event, $base.val(), $VirtualKeyboardInput.val().toString(), $(this).attr('data-function'));

						var thisFunction = $(this).attr('data-function');

						if (options.onBeforeVirtualKeyboardButton !== undefined)
							options.onBeforeVirtualKeyboardButton(this, event, thisFunction);

						switch (thisFunction)
						{
							case 'DELETE':
								$VirtualKeyboardInput.val($VirtualKeyboardInput.val().toString().slice(0, -1));
								break;
							
							case 'CLEAR':
								$VirtualKeyboardInput.val('');
								break;
							
							case 'DONE':
								if ($VirtualKeyboardInput.val() > $maxValue)
									setNewValue($base, $maxValue);
								else if ($VirtualKeyboardInput.val() < $minValue)
									setNewValue($base, $minValue);
								else
									setNewValue($base, $VirtualKeyboardInput.val());
								
								$VirtualKeyboard.remove();
								break;

							case 'CANCEL':
								$VirtualKeyboard.remove();
								break;
							
							case 'UP':
								if ($VirtualKeyboardInput.val() < $maxValue)
									setNewValue($VirtualKeyboardInput, parseFloat($VirtualKeyboardInput.val()) + parseFloat($step));
								break;
							
							case 'DOWN':
								if ($VirtualKeyboardInput.val() > $minValue)
									setNewValue($VirtualKeyboardInput, parseFloat($VirtualKeyboardInput.val()) - parseFloat($step));
								break;

							case 'SEP':
								if ($VirtualKeyboardInput.val().toString().indexOf(options.separator) === -1)
									$VirtualKeyboardInput.val($VirtualKeyboardInput.val().toString() + options.separator);
								break;

							case 'INVERSE':
								setNewValue($VirtualKeyboardInput, parseFloat($VirtualKeyboardInput.val()) * -1);
								break;
														
							// Default to assume its numbers.
							default:
								if ($(this).attr('data-custom-function'))
									$(this).attr('data-custom-function')(this, event, thisFunction);
								else
									setNewValue($VirtualKeyboardInput, $VirtualKeyboardInput.val().toString() + $(this).attr('data-function'));
						}

						if (options.onAfterVirtualKeyboardButton !== undefined)
							options.onAfterVirtualKeyboardButton(this, event, thisFunction);
					});

					if (options.onAfterVirtualKeyboardOpen !== undefined)
						options.onAfterVirtualKeyboardOpen(this);
				});

				if (options.onAfterVirtualKeyboardInitalized !== undefined)
					options.onAfterVirtualKeyboardInitalized(this);
			}

			if (options.onAfterInitialized !== undefined)
				options.onAfterInitialized(this);
			if (options.debug) console.log($base.parent());
		});
	}
}));