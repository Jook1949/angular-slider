// Generated by CoffeeScript 1.9.2
(function() {
  var MODULE_NAME, SLIDER_TAG, angularize, contain, events, gap, halfWidth, hide, module, offset, offsetLeft, pixelize, qualifiedDirectiveDefinition, roundStep, show, sliderDirective, width;

  MODULE_NAME = 'ui.slider';

  SLIDER_TAG = 'slider';

  angularize = function(element) {
    return angular.element(element);
  };

  pixelize = function(position) {
    return position + "px";
  };

  hide = function(element) {
    return element.css({
      opacity: 0
    });
  };

  show = function(element) {
    return element.css({
      opacity: 1
    });
  };

  offset = function(element, position) {
    return element.css({
      left: position
    });
  };

  halfWidth = function(element) {
    return element[0].offsetWidth / 2;
  };

  offsetLeft = function(element) {
    return element[0].offsetLeft;
  };

  width = function(element) {
    return element[0].offsetWidth;
  };

  gap = function(element1, element2) {
    return offsetLeft(element2) - offsetLeft(element1) - width(element1);
  };

  contain = function(value) {
    if (isNaN(value)) {
      return value;
    }
    return Math.min(Math.max(0, value), 100);
  };

  roundStep = function(value, precision, step, floor) {
    var decimals, remainder, roundedValue, steppedValue;
    if (floor == null) {
      floor = 0;
    }
    if (step == null) {
      step = 1 / Math.pow(10, precision);
    }
    remainder = (value - floor) % step;
    steppedValue = remainder > (step / 2) ? value + step - remainder : value - remainder;
    decimals = Math.pow(10, precision);
    roundedValue = steppedValue * decimals / decimals;
    return parseFloat(roundedValue.toFixed(precision));
  };

  events = {
    mouse: {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    touch: {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend'
    }
  };

  sliderDirective = function($timeout) {
    return {
      restrict: 'E',
      scope: {
        floor: '@',
        ceiling: '@',
        values: '=?',
        step: '@',
        highlight: '@',
        precision: '@',
        buffer: '@',
        dragstop: '@',
        ngModel: '=?',
        ngModelLow: '=?',
        ngModelHigh: '=?',
        prefix: '@',
        suffix: '@'
      },
      template: '<div class="slider-range"><div class="slider-bar selection"></div></div>\n<div class="slider-handle low"></div>\n<div class="slider-handle high"></div>\n<div class="filter-ui-slider-value">\n  <span class="filter-ui-slider-value-min">\n    {{ prefix }}{{ values.length ? values[local.ngModelLow || local.ngModel || 0] : local.ngModelLow || local.ngModel || 0 }}\n  </span> - <span class="filter-ui-slider-value-max">\n    {{ prefix }}{{ values.length ? values[local.ngModelHigh] : local.ngModelHigh }}\n    {{ suffix }}\n  </span>\n</div>',
      compile: function(element, attributes) {
        var high, low, range, watchables;
        range = (attributes.ngModel == null) && (attributes.ngModelLow != null) && (attributes.ngModelHigh != null);
        low = range ? 'ngModelLow' : 'ngModel';
        high = 'ngModelHigh';
        watchables = ['floor', 'ceiling', 'values', low];
        if (range) {
          watchables.push(high);
        }
        return {
          post: function(scope, element, attributes) {
            var bar, barWidth, bound, dimensions, e, handleHalfWidth, highBub, i, j, len, len1, lowBub, maxOffset, maxPtr, maxValue, minOffset, minPtr, minValue, ngDocument, offsetRange, ref1, ref2, ref3, selection, updateDOM, upper, valText, valueRange, w;
            ref1 = (function() {
              var i, len, ref1, results;
              ref1 = element.children();
              results = [];
              for (i = 0, len = ref1.length; i < len; i++) {
                e = ref1[i];
                results.push(angularize(e));
              }
              return results;
            })(), bar = ref1[0], minPtr = ref1[1], maxPtr = ref1[2], valText = ref1[3];
            selection = angularize(bar.children()[0]);
            ref2 = (function() {
              var i, len, ref2, results;
              ref2 = valText.children();
              results = [];
              for (i = 0, len = ref2.length; i < len; i++) {
                e = ref2[i];
                results.push(angularize(e));
              }
              return results;
            })(), lowBub = ref2[0], highBub = ref2[1];
            if (!range) {
              ref3 = [maxPtr, highBub];
              for (i = 0, len = ref3.length; i < len; i++) {
                upper = ref3[i];
                upper.remove();
              }
              if (!attributes.highlight) {
                selection.remove();
              }
            }
            scope.local = {};
            scope.local[low] = scope[low];
            scope.local[high] = scope[high];
            bound = false;
            ngDocument = angularize(document);
            handleHalfWidth = barWidth = minOffset = maxOffset = minValue = maxValue = valueRange = offsetRange = void 0;
            dimensions = function() {
              var j, len1, ref4, value;
              if (scope.step == null) {
                scope.step = 1;
              }
              if (scope.floor == null) {
                scope.floor = 0;
              }
              if (scope.precision == null) {
                scope.precision = 0;
              }
              if (!range) {
                scope.ngModelLow = scope.ngModel;
              }
              if ((ref4 = scope.values) != null ? ref4.length : void 0) {
                if (scope.ceiling == null) {
                  scope.ceiling = scope.values.length - 1;
                }
              }
              scope.local[low] = scope[low];
              scope.local[high] = scope[high];
              for (j = 0, len1 = watchables.length; j < len1; j++) {
                value = watchables[j];
                if (typeof value === 'number') {
                  scope[value] = roundStep(parseFloat(scope[value]), parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
                }
              }
              handleHalfWidth = halfWidth(minPtr);
              barWidth = width(bar);
              minOffset = 0;
              maxOffset = barWidth - width(minPtr);
              minValue = parseFloat(scope.floor);
              maxValue = parseFloat(scope.ceiling);
              valueRange = maxValue - minValue;
              return offsetRange = maxOffset - minOffset;
            };
            updateDOM = function() {
              var bind, percentOffset, percentValue, pixelsToOffset, setBindings, setPointers;
              dimensions();
              percentOffset = function(offset) {
                return contain(((offset - minOffset) / offsetRange) * 100);
              };
              percentValue = function(value) {
                return contain(((value - minValue) / valueRange) * 100);
              };
              pixelsToOffset = function(percent) {
                return pixelize(percent * offsetRange / 100);
              };
              setPointers = function() {
                var newHighValue, newLowValue;
                newLowValue = percentValue(scope.local[low]);
                offset(minPtr, pixelsToOffset(newLowValue));
                offset(lowBub, pixelize(offsetLeft(minPtr) - (halfWidth(lowBub)) + handleHalfWidth));
                offset(selection, pixelize(offsetLeft(minPtr) + handleHalfWidth));
                switch (true) {
                  case range:
                    newHighValue = percentValue(scope.local[high]);
                    offset(maxPtr, pixelsToOffset(newHighValue));
                    offset(highBub, pixelize(offsetLeft(maxPtr) - (halfWidth(highBub)) + handleHalfWidth));
                    return selection.css({
                      width: pixelsToOffset(newHighValue - newLowValue)
                    });
                  case attributes.highlight === 'right':
                    return selection.css({
                      width: pixelsToOffset(110 - newLowValue)
                    });
                  case attributes.highlight === 'left':
                    selection.css({
                      width: pixelsToOffset(newLowValue)
                    });
                    return offset(selection, 0);
                }
              };
              bind = function(handle, bubble, ref, events) {
                var currentRef, onEnd, onMove, onStart;
                currentRef = ref;
                onEnd = function() {
                  bubble.removeClass('active');
                  handle.removeClass('active');
                  ngDocument.unbind(events.move);
                  ngDocument.unbind(events.end);
                  if (scope.dragstop) {
                    scope[high] = scope.local[high];
                    scope[low] = scope.local[low];
                  }
                  currentRef = ref;
                  return scope.$apply();
                };
                onMove = function(event) {
                  var eventX, newOffset, newPercent, newValue, ref4, ref5, ref6;
                  eventX = event.clientX || ((ref4 = event.touches) != null ? ref4[0].clientX : void 0) || ((ref5 = event.originalEvent) != null ? (ref6 = ref5.changedTouches) != null ? ref6[0].clientX : void 0 : void 0) || 0;
                  newOffset = eventX - element[0].getBoundingClientRect().left - handleHalfWidth;
                  newOffset = Math.max(Math.min(newOffset, maxOffset), minOffset);
                  newPercent = percentOffset(newOffset);
                  newValue = minValue + (valueRange * newPercent / 100.0);
                  if (range) {
                    switch (currentRef) {
                      case low:
                        if (newValue > scope.local[high]) {
                          currentRef = high;
                          minPtr.removeClass('active');
                          lowBub.removeClass('active');
                          maxPtr.addClass('active');
                          highBub.addClass('active');
                          setPointers();
                        } else if (scope.buffer > 0) {
                          newValue = Math.min(newValue, scope.local[high] - scope.buffer);
                        }
                        break;
                      case high:
                        if (newValue < scope.local[low]) {
                          currentRef = low;
                          maxPtr.removeClass('active');
                          highBub.removeClass('active');
                          minPtr.addClass('active');
                          lowBub.addClass('active');
                          setPointers();
                        } else if (scope.buffer > 0) {
                          newValue = Math.max(newValue, parseInt(scope.local[low]) + parseInt(scope.buffer));
                        }
                    }
                  }
                  newValue = roundStep(newValue, parseInt(scope.precision), parseFloat(scope.step), parseFloat(scope.floor));
                  scope.local[currentRef] = newValue;
                  if (!scope.dragstop) {
                    scope[currentRef] = newValue;
                  }
                  setPointers();
                  return scope.$apply();
                };
                onStart = function(event) {
                  dimensions();
                  bubble.addClass('active');
                  handle.addClass('active');
                  setPointers();
                  event.stopPropagation();
                  event.preventDefault();
                  ngDocument.bind(events.move, onMove);
                  return ngDocument.bind(events.end, onEnd);
                };
                return handle.bind(events.start, onStart);
              };
              setBindings = function() {
                var j, len1, method, ref4;
                ref4 = ['touch', 'mouse'];
                for (j = 0, len1 = ref4.length; j < len1; j++) {
                  method = ref4[j];
                  bind(minPtr, lowBub, low, events[method]);
                  bind(maxPtr, highBub, high, events[method]);
                }
                return bound = true;
              };
              if (!bound) {
                setBindings();
              }
              return setPointers();
            };
            $timeout(updateDOM);
            for (j = 0, len1 = watchables.length; j < len1; j++) {
              w = watchables[j];
              scope.$watch(w, updateDOM, true);
            }
            return window.addEventListener('resize', updateDOM);
          }
        };
      }
    };
  };

  qualifiedDirectiveDefinition = ['$timeout', sliderDirective];

  module = function(window, angular) {
    return angular.module(MODULE_NAME, []).directive(SLIDER_TAG, qualifiedDirectiveDefinition);
  };

  module(window, window.angular);

}).call(this);
