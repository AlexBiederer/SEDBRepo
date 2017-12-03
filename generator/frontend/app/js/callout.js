/* jshint ignore:start */
/**
 * Override of default fabric Callout
 * Extended by @author Felix Schwarzmeier
 * @copyright Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
 */
import util from './util';
/**
 * Callout
 *
 * Add callouts to things and stuff
 *
 */
/// <reference path="../ContextualHost/ContextualHost.ts"/>
const calloutHTML = data => `<div class="ms-Callout ms-Callout--arrowLeft  ms-Callout--close is-hidden">
    <div class="ms-Callout-main">
      <button title="Close" class="ms-Callout-close">
        <i class="ms-Icon ms-Icon--Clear"></i>
      </button>
      <div class="ms-Callout-header">
        <p class="ms-Callout-title">Description</p>
      </div>
      <div class="ms-Callout-inner">
        <div class="ms-Callout-content">
          <p class="ms-Callout-subText">${data.Description.val}</p>
        </div>
      </div>
    </div>
  </div>`;


export default function init(anchor, bodyHTML, buttonClass, calloutDivClass) {
    let calloutComponent;
    anchor.append(util.tag.DIV).html(bodyHTML).classed(calloutDivClass, true);
    var CalloutExample = document.querySelector("."+calloutDivClass);
    var Example = CalloutExample;
    var ExampleButtonElement = document.querySelector(buttonClass);
    var CalloutElement = Example.querySelector(".ms-Callout");
    calloutComponent = new fabric['Callout'](
        CalloutElement,
        ExampleButtonElement,
        "right"
    );
    return calloutComponent;
}


/// <reference path="../ContextualHost/ContextualHost.ts"/>
var STATE_HIDDEN = "is-hidden";
var CLOSE_BUTTON_CLASS = ".ms-Callout-close";
var MODIFIER_OOBE_CLASS = "ms-Callout--OOBE";
(function(fabric) {
    "use strict";
    var Callout = (function() {
        function Callout(container, addTarget, position) {
            this._container = container;
            this._addTarget = addTarget;
            this._position = position;
            this._closeButton = this._container.querySelector(CLOSE_BUTTON_CLASS);
            this._setOpener();
        }
        Callout.prototype._setOpener = function() {
            this._addTarget.addEventListener("click", this._clickHandler.bind(this), true);
        };
        Callout.prototype._openContextMenu = function() {
            var modifiers = [];
            if (this._hasModifier(MODIFIER_OOBE_CLASS)) {
                modifiers.push("primaryArrow");
            }
            this._container.classList.remove(STATE_HIDDEN);
            this._contextualHost = new fabric.ContextualHost(this._container, this._position, this._addTarget, true, modifiers);
            if (this._closeButton) {
                this._closeButton.addEventListener("click", this._closeHandler.bind(this), false);
            }
        };
        Callout.prototype._hasModifier = function(modifierClass) {
            return this._container.classList.contains(modifierClass);
        };
        Callout.prototype._closeHandler = function(e) {
            this._contextualHost.disposeModal();
            this._closeButton.removeEventListener("click", this._closeHandler.bind(this), false);
            this._addTarget.removeEventListener("click", this._clickHandler.bind(this), true);
        };
        Callout.prototype._clickHandler = function(e) {
            this._openContextMenu();
        };
        // new added update function
        Callout.prototype.updateBody = function(data) {
            if (this._container.querySelector(".ms-Callout-subText")) this._container.querySelector(".ms-Callout-subText").innerHTML = data;
            return this;
        };
        Callout.prototype.updateTitle = function(data) {
            if (this._container.querySelector(".ms-Callout-title")) this._container.querySelector(".ms-Callout-title").innerHTML = data;
            return this;
        };
        return Callout;
    }());
    fabric.Callout = Callout;
})(fabric);
