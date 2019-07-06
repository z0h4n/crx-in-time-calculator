import Vue from 'vue';
import App from 'Components/App.vue';
import SevenSegmentDisplay from 'vue-seven-segment-display';
import Buefy from 'buefy';
import store from 'Services/store';
import styleLoader from 'Services/styleLoader';

let shadowRootPrivate = new WeakMap();

/**
 * Define ITC Element Class
 */
class InTimeCalculator extends HTMLElement {
  constructor() {
    super();

    const style = {
      position: 'fixed',
      minWidth: '100%',
      top: '0px',
      zIndex: '1'
    };

    Object.keys(style).forEach(prop => this.style[prop] = style[prop]);

    shadowRootPrivate.set(this, this.attachShadow({ mode: 'closed' }));
  }

  /**
   * Kickstart itc
   */
  static bootstrap() {
    const greythrTopNav = document.body.children[0];
    const greythrContainer = document.body.children[1];
    greythrTopNav.style.position = 'fixed';

    const itcElement = document.createElement('in-time-calculator');
    document.body.prepend(itcElement);

    const shadowRoot = shadowRootPrivate.get(itcElement);

    const outerMaterialIconCSS = styleLoader(chrome.runtime.getURL('css/materialdesignicons.css'), document.head);

    const innerCSSList = [
      'css/materialdesignicons.css',
      'css/buefy.min.css',
      'css/override.css',
      'css/global.css',
      'css/scoped.css'
    ].map(css => styleLoader(chrome.runtime.getURL(css), shadowRoot));

    return new Promise(resolve => {
      Promise.all([outerMaterialIconCSS, ...innerCSSList]).then(() => {
        const appRoot = document.createElement('div');
        shadowRoot.appendChild(appRoot);

        Vue.use(Buefy);
        Vue.use(SevenSegmentDisplay);

        new Vue({
          store,
          el: appRoot,

          data() {
            return { greythrTopNav, greythrContainer }
          },

          render(createElement) {
            return createElement(App);
          }
        });

        resolve();
      });
    });
  }
}

// Register ITC Element Class
window.customElements.define('in-time-calculator', InTimeCalculator, { extends: 'div' });

export default InTimeCalculator;
