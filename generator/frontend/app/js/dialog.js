/* jshint ignore:start */
/**
 * Override of default fabric Overlay & Dialog
 * @author Felix Schwarzmeier
 * @copyright Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
 */
const dialogHTML = `<div class="docs-DialogExample-close">
    <div class="ms-Dialog ms-Dialog--close">
        <button title="Cancel" class="ms-Dialog-button ms-Dialog-buttonClose">
<i class="ms-Icon ms-Icon--Cancel"></i>
</button>
        <div class="ms-Dialog-title"></div>
        <div class="ms-Dialog-content">
          <p class="ms-Dialog-subText"></p>
        <div class="ms-Dialog-actions">
            <button title="OK" class="ms-Button ms-Button--primary">
  <span class="ms-Button-label">OK</span>
</button>
            <button title="Cancel" class="ms-Button ms-Dialog-action ms-Button--secondary">
  <span class="ms-Button-label">Cancel</span>
</button>
        </div>
    </div>
</div>
`;


const errorLabel = function(id = '') {
  const label = document.createElement("label");
  label.setAttribute("for", id);
  label.classList.add("ms-Label");
  label.classList.add("errorLabel", "display-none");
  label.innerText = "Required Field!";
  return label;
};

const dialogModesToStyle = {
  info: "ms-Dialog--lgHeader--info",
  alert: "ms-Dialog--lgHeader--alert"
};

export default function init() {
  document.querySelector(this.config.root).appendChild(document.createElement("DIV")).innerHTML = dialogHTML;
  var example = document.querySelector(".docs-DialogExample-close");
  var dialog = example.querySelector(".ms-Dialog");
  // Wire up the dialog
  var dialogComponent = new fabric['Dialog'](dialog);

  return dialogComponent;

};

(function(fabric) {
  var Overlay = (function() {
    function Overlay(overlayElement) {
      if (overlayElement) {
        this.overlayElement = overlayElement;
      } else {
        var overlayContainer = document.createElement("div");
        overlayContainer.setAttribute("class", "ms-Overlay ms-Overlay--dark");
        this.overlayElement = overlayContainer;
      }
      // this.overlayElement.addEventListener("click", this.hide.bind(this), false);
    }
    Overlay.prototype = {
      remove: function() {
        this.overlayElement.parentElement.removeChild(this.overlayElement);
      },
      show: function() {
        this.overlayElement.classList.add("is-visible");
        document.body.classList.add("ms-u-overflowHidden");
      },
      hide: function() {
        this.overlayElement.classList.remove("is-visible");
        document.body.classList.remove("ms-u-overflowHidden");
      }
    };
    return Overlay;
  }());
  fabric.Overlay = Overlay;
})(fabric);

// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See LICENSE in the project root for license information.
// @TODO - we can add this once jquery is removed
/// <reference path="../Overlay/Overlay.ts"/>
(function(fabric) {
  var Dialog = (function() {
    function Dialog(dialog) {
      this._dialog = dialog;
      this._hasErrors = false;
      this._closeButtonElement = this._dialog.querySelector(".ms-Dialog-buttonClose");
      this._actionButtonRow = this._dialog.querySelector(".ms-Dialog-actions");
      this._cancelButtonElement = this._dialog.querySelector(".ms-Dialog-action");
      this._primaryButtonElement = this._dialog.querySelector(".ms-Button--primary");
      this._dialogTitle = this._dialog.querySelector(".ms-Dialog-title");
      this._dialogDescription = this._dialog.querySelector(".ms-Dialog-subText");
      this._currentPrimaryCallback = null;
      this._onKeyUp = this._onKeyUp.bind(this);
      if (this._closeButtonElement) {
        this._closeButtonElement.addEventListener("click", this.close.bind(this), false);
      }
      this._cancelButtonElement.addEventListener("click", this.close.bind(this), false);
      this._primaryButtonElement.addEventListener("click", this.saveClose.bind(this), false);
      this.isOpen = false;
    }
    Dialog.prototype = {
      close: function() {
        this.isOpen = false;
        this._overlay.remove();
        this._dialog.classList.remove("is-open");
        document.body.classList.remove("ms-u-overflowHidden");
        this._overlay.overlayElement.removeEventListener("click", this.close.bind(this));
        this._dialog.removeEventListener("keyup", this._onKeyUp);
      },
      saveClose: function() {
        this._hasErrors = false; // reset error counter
        const requiredFields = this._dialog.querySelectorAll(".required");
        for (let i = 0; i < requiredFields.length; i++) {
          // query the associated error-label
          const currentErrorLabel = this._dialog.querySelector(`[for='${requiredFields[i].id}']`) || errorLabel(requiredFields[i].id);
          if (requiredFields[i].value === "") {
            requiredFields[i].classList.add("requiredWarning");
            requiredFields[i].parentElement.parentElement.insertBefore(currentErrorLabel, requiredFields[i].parentElement.nextElementSibling);
            currentErrorLabel.classList.remove('display-none');
            this._hasErrors = true;
          } else {
            requiredFields[i].classList.remove("requiredWarning");
            currentErrorLabel.classList.add('display-none');
          }
        }
        if (!this._hasErrors) {
          this.close();
        }
      },
      open: function() {
        this.isOpen = true;
        this._dialog.classList.add("is-open");
        this._overlay = new fabric.Overlay();
        if (!this._dialog.classList.contains("ms-Dialog--blocking")) {
          //this._overlay.overlayElement.addEventListener("click", this.close.bind(this), false);
          this._overlay.show();
          document.body.classList.add("ms-u-overflowHidden");
        }
        this._dialog.parentElement.appendChild(this._overlay.overlayElement);
        // focus on first field, if available
        if (this._dialog.querySelector('#field_0')) this._dialog.querySelector('#field_0').focus();
        else this._dialog.querySelector(".ms-Button--primary").focus(); // focus on primary dialog
      },
      set: function(settings) {
        this.setTitle(settings.title)
          .setDescription(settings.description)
          .setMode(settings.mode)
          .setCallback(settings.callBack)
          .removePrimaryButton(settings.removePrimaryButton)
          .removeCloseButton(settings.removeCloseButton)
          .removeCancelButton(settings.removeCancelButton)
          .setPrimaryButtonText(settings.primaryButtonText)
          .setBody(settings.body);
        return this;
      },
      setTitle: function(newTitle = "") {
        this._dialogTitle.innerHTML = newTitle;
        return this;
      },
      setDescription: function(newDescription = "") {
        this._dialogDescription.innerHTML = newDescription;
        return this;
      },
      setMode: function(mode = dialogModes.INFO) {
        // remove all mode-styles from the dialog
        this._dialog.className = this._dialog.className.replace(/ms-Dialog--lgHeader(--)?\w*/g, '');

        if (dialogModesToStyle[mode]) this._dialog.classList.add(dialogModesToStyle[mode]);
        else throw new Error("dialog.js: Unknown dialog mode!");
        return this;
      },
      setCallback: function(callBack) {
        this._primaryButtonElement.removeEventListener("click", this._currentPrimaryCallback);
        if (callBack) {
          this._currentPrimaryCallback = callBack;
          this._primaryButtonElement.addEventListener("click", callBack);
        }
        return this;
      },
      setPrimaryButtonText: function(text = "OK") {
        this._primaryButtonElement.title = text;
        this._primaryButtonElement.firstElementChild.innerText = text;
        return this;
      },
      removePrimaryButton: function(flag = false) {
        if (flag) {
          this._primaryButtonElement.style.display = "none";
        } else {
          let primaryButton = this._primaryButtonElement;
          primaryButton.style.display = "inline";
          this._dialog.addEventListener("keyup", this._onKeyUp);
        }
        return this;
      },
      removeCloseButton: function(flag = false) {
        if (flag) {
          this._closeButtonElement.style.display = "none";
        } else {
          this._closeButtonElement.style.display = "initial";
        }
        return this;
      },
      removeCancelButton: function(flag = false) {
        if (flag) {
          this._cancelButtonElement.style.display = "none";
          this._actionButtonRow.style.textAlign = "center";
        } else {
          this._cancelButtonElement.style.display = "inline-block";
          this._actionButtonRow.style.textAlign = "right";
        }
        return this;
      },
      setBody: function(html = "") {
        this._dialogDescription.innerHTML += html;
        var TextFieldElements = document.querySelectorAll(".ms-TextField");
        for (var i = 0; i < TextFieldElements.length; i++) {
          new fabric['TextField'](TextFieldElements[i]);
        }
        return this;
      },
      _onKeyUp: function _onKeyUp(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
          this._primaryButtonElement.click();
        }
      }
    }
    return Dialog;
  }());
  fabric.Dialog = Dialog;
})(fabric);
