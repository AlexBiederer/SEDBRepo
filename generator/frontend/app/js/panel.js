/* jshint ignore:start */
/**
 * Extended by @author Felix Schwarzmeier
 * @copyright Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
 */

/**
 * Panel Init
 */
export default function init(bodyHTML, buttonClass, panelDIV, anchor = this.actionBarButtons, updateBody = null) {
  anchor.append("div").html(bodyHTML).classed(panelDIV, true);
  var PanelExample = document.querySelector("." + panelDIV);
  var PanelExampleButtonCancel = PanelExample.querySelector(".ms-Button--secondary");
  var PanelExampleButton = document.querySelector(buttonClass);
  var PanelExamplePanel = PanelExample.querySelector(".ms-Panel");
  PanelExampleButton.addEventListener("click", function(i) {
    new fabric['Panel'](PanelExamplePanel, "right", true, PanelExampleButtonCancel, updateBody);
  });
}

/**
 * Override of default fabric Panel
 * @author Felix Schwarzmeier
 * @copyright Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
 */
// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
/// <reference path="../PanelHost/PanelHost.ts"/>
(function(fabric) {
  /**
   * Panel Host
   *
   * A host for the panel control
   *
   */
  var ANIMATE_IN_STATE = "animate-in";
  var ANIMATE_OUT_STATE = "animate-out";
  var ANIMATION_END = 400;
  var Panel = (function() {
    /**
     *
     * @param {HTMLElement} container - the target container for an instance of Panel
     * @constructor
     */
    function Panel(panel, direction, animateOverlay, PanelExampleButtonCancel, updateBody) {
      this._panel = panel;
      /* TODO Remove after UT */
      if(updateBody){
        this._panel.querySelector("#helpList").innerHTML = updateBody.helpList;
      }
      /* End of removing */
      this._direction = direction || "right";
      this._animateOverlay = animateOverlay || true;
      this.panelHost = new fabric.PanelHost(this._panel, this._animateInPanel);
      this._closeButton = this._panel.querySelector(".ms-PanelAction-close");
      this._cancelButton = PanelExampleButtonCancel;
      this._clickHandler = this.dismiss.bind(this, null);
      this._setEvents();
      // Set body height to 100% and overflow hidden while panel is open
      document.body.setAttribute("style", "height: 100%; overflow: hidden;");
    }
    Panel.prototype.dismiss = function(callBack) {
      var _this = this;
      this._panel.classList.add(ANIMATE_OUT_STATE);
      setTimeout(function() {
        _this._panel.classList.remove(ANIMATE_OUT_STATE);
        _this._panel.classList.remove("is-open");
        _this.panelHost.dismiss();
        if (callBack) {
          callBack();
        }
        // Remove temporary body styles
        document.body.setAttribute("style", "");
      }, ANIMATION_END);
      if (this._closeButton !== null) {
        this._closeButton.removeEventListener("click", this._clickHandler);
      }
      if (this._cancelButton !== null) {
        this._cancelButton.removeEventListener("click", this._clickHandler);
      }
    };
    Panel.prototype._setEvents = function() {
      this.panelHost.overlay.overlayElement.addEventListener("click", this._clickHandler);
      if (this._closeButton !== null) {
        this._closeButton.addEventListener("click", this._clickHandler);
      }
      if (this._cancelButton !== null) {
        this._cancelButton.addEventListener("click", this._clickHandler);
      }
    };
    Panel.prototype._animateInPanel = function(layer) {
      layer.classList.add(ANIMATE_IN_STATE);
      layer.classList.add("is-open");
      setTimeout(function() {
        layer.classList.remove(ANIMATE_IN_STATE);
      }, ANIMATION_END);
    };
    return Panel;
  }());
  fabric.Panel = Panel;
})(fabric);
