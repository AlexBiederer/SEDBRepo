/**
 * @author Felix Schwarzmeier
 * utile functions and constants for S3
 * @export @default {object} util
 */
import _throw from './msgBanner'; // Message-Banner for showing error/warning-messages

const util = {
  selector: {
    ID: 'id',
    CLASS: 'class',
    OUTER_SVG: 'outerSVG',
    INNER_SVG: 'innerSVG',
    BUTTON_BAR: '.buttonBar',
    DELETE_BTN: '.ms-Icon--Delete',
    INFO_BTN: '.ms-Icon--Info',
  },
  style: {
    WIDTH: 'width',
    HEIGHT: 'height',
    VISIBILITY: 'visibility',
    TRANSFORM: 'transform',
    MARGIN_LEFT: 'margin-left',
    FILL: 'fill',
    HIDDEN: 'hidden'
  },
  tag: {
    DIV: 'div',
    ICON: 'i',
    SVG: 'svg',
    GROUP: 'g',
    TEXT: 'text'
  },
  event: {
    START: 'start',
    END: 'end',
    INTERRUPT: 'interrupt',
    ZOOM: 'zoom',
    CONTEXTMENU: 'contextmenu',
    DOUBLETAP: 'doubletap'
  },
  mouseEvent: {
    CLICK: 'click',
    DBLCLICK: 'dblclick',
    MOUSEOVER: 'mouseover',
    MOUSEMOVE: 'mousemove',
    MOUSEDOWN: 'mousedown',
    MOUSEOUT: 'mouseout'
  },
  touchEvent: {
    TOUCHSTART: 'touchstart',
    TOUCHMOVE: 'touchmove',
    TOUCHEND: 'touchend',
    TOUCHCANCEL: 'touchcancel'
  },
  show: function() {
    this.style("visibility", "visible");
    return this;
  },
  hide: function() {
    this.style("visibility", "hidden");
    return this;
  },
  isHidden: function() {
    return this.style("visibility") === "hidden" ? 1 : 0;
  },
  warn: msg => _throw(msg, "Warning"),
  createLine: function() {
    let chart = this;
    return d3.line()
      .x(function(d) {
        return chart.scaleFunc.cx.scalePixel(chart.scaleFunc.cx.scale(d.x));
      })
      .y(function(d) {
        return chart.scaleFunc.cy.scalePixel(chart.scaleFunc.cy.scale(d.y));
      });
  },
  computePoints: (limit,maxX) => {
    let points = [];
    for (var i = limit; i <= maxX; i++) {
      points.push({
        "x": i,
        "y": limit / i
      });
    }
    return points;
  },
  htmlTemplate: {
    TOOLTIP_WELCOME_TEXT: `<h3 style='text-align:center'>Welcome to S3! <br> (Alpha)</h3>
                    <p style='text-align:center'> A D3-based library
                    for visual collaboration with SharePoint</p>
                    <div class="acidjs-rating-stars">`,
    CALLOUT_DESCRIPTION: `<div class="ms-Callout ms-Callout--arrowLeft  ms-Callout--close is-hidden">
          <div class="ms-Callout-main">
            <button title="Close" class="ms-Callout-close">
              <i class="ms-Icon ms-Icon--Clear"></i>
            </button>
            <div class="ms-Callout-header">
              <p class="ms-Callout-title">Description</p>
            </div>
            <div class="ms-Callout-inner">
              <div class="ms-Callout-content">
                <p class="ms-Callout-subText"></p>
              </div>
            </div>
          </div>
        </div>`,
    PROGRESS_BAR: `<div class="ms-ProgressIndicator">
          <div class="ms-ProgressIndicator-itemName">GutFeeling</div>
          <div class="ms-ProgressIndicator-itemProgress">
              <div class="ms-ProgressIndicator-progressTrack"></div>
              <div class="ms-ProgressIndicator-progressBar"></div>
          </div>
          <div class="ms-ProgressIndicator-itemDescription"></div>
            </div>`,
    HELP_SECTION: `<div class="ms-Panel ms-Panel--lg">
              <button class="ms-Panel-closeButton ms-PanelAction-close">
                <i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>
              </button>
              <div class="ms-Panel-contentInner">
                <p class="ms-Panel-headerText">Help Section</p>
                <div class="ms-Panel-content">
                  <ul class="ms-font-m" id="helpList">
                  </ul>
                    <p>
                        <button class="ms-Button ms-Dialog-action ms-Button--secondary">
                          <span class="ms-Button-label">Close</span>
                        </button>
                   </p>
                        </div>
                      </div>
                    </div>  `,
    START_DIALOG: `
      <h3 style="margin:0 5px;">Information</h3>
      <ul style="text-align:left; padding-left:20px; margin-top:5px;">
      <p style="margin:0px">
        This application (S3) is still in an alpha state, meaning many features are not yet implemented or will change during future development.</li>
      <p/>`,
  },
  errorMsgs: {
    INVALID_CHART_CONFIG: `Index.js: Invalid Chart configuration. You must specify a list name, chart data and a chart type!
            Supported types are:`,
    ZOOM_GESTURE: "zoom.js: Zoom gesture can only be assigned to one single property!",
    UNKNOWN_ZOOM_LEVEL: "zoom.js: Zoom error: Unknown zoom level!"
  }

};

export default util;
