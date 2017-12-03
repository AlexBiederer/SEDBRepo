/* jshint ignore:start */
 /**
  * Extended by @author Felix Schwarzmeier
  * @copyright Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
  */

/**
* @export {default}
* Spinner Init
*
*/
export default function init(spinnerSelector) {
  const SpinnerElement = document.querySelector(spinnerSelector);
  const spinner = new fabric['Spinner'](SpinnerElement);
  return spinner;
}


 (function(fabric) {
   var CircleObject = (function() {
     function CircleObject(element, j) {
       this.element = element;
       this.j = j;
     }
     return CircleObject;
   }());
   /**
    * Spinner Component
    *
    * An animating activity indicator.
    *
    */
   var Spinner = (function() {
     /**
      * @param {HTMLDOMElement} target - The element the Spinner will attach itself to.
      */
     function Spinner(container) {
       this.eightSize = 0.2;
       this.animationSpeed = 90;
       this.parentSize = 20;
       this.fadeIncrement = 0;
       this.circleObjects = [];
       this._target = container;
       this._init();
     }
     /**
      * @function start - starts or restarts the animation sequence
      * @memberOf fabric.Spinner
      */
     Spinner.prototype.start = function() {
       var _this = this;
       this.stop();
       this.interval = setInterval(function() {
         var i = _this.circleObjects.length;
         while (i--) {
           _this._fade(_this.circleObjects[i]);
         }
       }, this.animationSpeed);
       return this;
     };
     /**
      * @function stop - stops the animation sequence
      * @memberOf fabric.Spinner
      */
     Spinner.prototype.stop = function() {
       clearInterval(this.interval);
       return this;
     };

     /**
     * @function show - shows the Spinner
     *
     */
     Spinner.prototype.show = function() {
       this._target.style.visibility = 'visible';
       return this;
     };


     /**
     * @function hide - hides the Spinner
     *
     */
     Spinner.prototype.hide = function() {
       this._target.style.visibility = 'hidden';
       return this;
     };
     // private methods
     Spinner.prototype._init = function() {
       this._setTargetElement();
       this._setPropertiesForSize();
       this._createCirclesAndArrange();
       this._initializeOpacities();
     };
     Spinner.prototype._setPropertiesForSize = function() {
       if (this.spinner.className.indexOf("large") > -1) {
         this.parentSize = 28;
         this.eightSize = 0.179;
       }
       this.offsetSize = this.eightSize;
       this.numCircles = 8;
     };
     Spinner.prototype._setTargetElement = function() {
       // for backwards compatibility
       if (this._target.className.indexOf("ms-Spinner") === -1) {
         this.spinner = document.createElement("div");
         this.spinner.className = "ms-Spinner";
         this._target.appendChild(this.spinner);
       } else {
         this.spinner = this._target;
       }
     };
     Spinner.prototype._initializeOpacities = function() {
       var i = 0;
       var j = 1;
       var opacity;
       this.fadeIncrement = 1 / this.numCircles;
       for (i; i < this.numCircles; i++) {
         var circleObject = this.circleObjects[i];
         opacity = (this.fadeIncrement * j++);
         this._setOpacity(circleObject.element, opacity);
       }
     };
     Spinner.prototype._fade = function(circleObject) {
       var opacity = this._getOpacity(circleObject.element) - this.fadeIncrement;
       if (opacity <= 0) {
         opacity = 1;
       }
       this._setOpacity(circleObject.element, opacity);
     };
     Spinner.prototype._getOpacity = function(element) {
       return parseFloat(window.getComputedStyle(element).getPropertyValue("opacity"));
     };
     Spinner.prototype._setOpacity = function(element, opacity) {
       element.style.opacity = opacity.toString();
     };
     Spinner.prototype._createCircle = function() {
       var circle = document.createElement("div");
       circle.className = "ms-Spinner-circle";
       circle.style.width = circle.style.height = this.parentSize * this.offsetSize + "px";
       return circle;
     };
     Spinner.prototype._createCirclesAndArrange = function() {
       var angle = 0;
       var offset = this.parentSize * this.offsetSize;
       var step = (2 * Math.PI) / this.numCircles;
       var i = this.numCircles;
       var circleObject;
       var radius = (this.parentSize - offset) * 0.5;
       while (i--) {
         var circle = this._createCircle();
         var x = Math.round(this.parentSize * 0.5 + radius * Math.cos(angle) - circle.clientWidth * 0.5) - offset * 0.5;
         var y = Math.round(this.parentSize * 0.5 + radius * Math.sin(angle) - circle.clientHeight * 0.5) - offset * 0.5;
         this.spinner.appendChild(circle);
         circle.style.left = x + "px";
         circle.style.top = y + "px";
         angle += step;
         circleObject = new CircleObject(circle, i);
         this.circleObjects.push(circleObject);
       }
     };
     return Spinner;
   }());
   fabric.Spinner = Spinner;
 })(fabric);
