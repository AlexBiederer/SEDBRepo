/* jshint ignore:start */
/**
 * Extended by @author Felix Schwarzmeier
 * @copyright Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
 *
 */

/**
 * @export {default}
 * Toggle init
 */
export default function toggleInit(toggleSelector, selected, toggleResponse) {
  const chart = this;
  const ToggleElement = document.querySelector(toggleSelector);
  const toggle = new fabric['Toggle'](chart, ToggleElement, selected, toggleResponse);
  return toggle;
}

(function(fabric) {
  /**
   * Toggle Plugin
   *
   * Adds basic demonstration functionality to .ms-Toggle components.
   *
   */
  var Toggle = (function() {
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Toggle
     * @constructor
     */
    function Toggle(chart, container, selected = false, toggleResponse = null) {
      this._chart = chart;
      this._container = container;
      if(toggleResponse) this._toggleResponse = toggleResponse;
      this._toggleField = this._container.querySelector(".ms-Toggle-field");
      this.setSelect(selected);
      this._addListeners();
    }
    Toggle.prototype.removeListeners = function() {
      this._toggleField.removeEventListener("click", this._toggleHandler.bind(this));
    };
    Toggle.prototype.isSelected = function() {
      return this._toggleField.classList.contains("is-selected") ? true : false;
    };
    Toggle.prototype.setSelect = function(selected) {
      if(selected) this._toggleField.classList.add("is-selected");
      else this._toggleField.classList.remove("is-selected");
    };
    Toggle.prototype.disable = function() {
       this._container.classList.add("is-disabled");
    };
    Toggle.prototype.enable = function() {
       this._container.classList.remove("is-disabled");
    };
    /**
    * To be overwritten by user
    */
    Toggle.prototype._toggleResponse = function () {
      return false;
    };
    Toggle.prototype._addListeners = function() {
      var _this = this;
      this._toggleField.addEventListener("click", this._toggleHandler.bind(this), false);
      this._toggleField.addEventListener("keyup", function(e) {
        return (e.keyCode === 32) ? _this._toggleHandler() : null;
      }, false);
    };
    Toggle.prototype._toggleHandler = function() {
      this._toggleField.classList.toggle("is-selected");
      this._toggleResponse();
    };
    return Toggle;
  }());
  fabric.Toggle = Toggle;
})(fabric);
