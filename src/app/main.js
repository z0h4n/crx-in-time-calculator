import Vue from 'vue';
import App from 'Components/App.vue';
import store from 'Services/store';
import Buefy from 'buefy';
import SevenSegmentDisplay from 'vue-seven-segment-display';
import styleLoader from 'Services/styleLoader';

if (typeof document.head.attachShadow !== 'function') {
  alert('ITC Extension now uses Shadow DOM. Please update your Google Chrome Browser to latest version.');
  throw new Error('Shadow dom is not supported');
}

// Make top nav of webpage unsticky
const topNav = document.body.children[0];
topNav.style.position = 'relative';
topNav.style.zIndex = 0;

// Create and prepend our shadow host
const shadowHost = document.createElement('div');
shadowHost.style.backgroundColor = 'white';
shadowHost.style.marginBottom = '10px';
shadowHost.style.position = 'relative';
shadowHost.style.zIndex = '9999';
shadowHost.style.minWidth = '600px';
document.body.prepend(shadowHost);

// Add shadow dom to our shadow host and append template content
const shadowRoot = shadowHost.attachShadow({ mode: 'closed' });

// Create App Root
const appRoot = document.createElement('div');
appRoot.innerText = 'Loading...';
shadowRoot.appendChild(appRoot);

// Preload All CSS
const outerMaterialIconCSS = styleLoader(chrome.runtime.getURL('css/materialdesignicons.css'), document.head);

const innerCSSList = [
  'css/materialdesignicons.css',
  'css/buefy.min.css',
  'css/override.css',
  'css/global.css',
  'css/scoped.css'
].map(css => styleLoader(chrome.runtime.getURL(css), shadowRoot));

Promise.all([outerMaterialIconCSS, ...innerCSSList]).then(() => {
  // Setup Vue
  Vue.use(Buefy);
  Vue.use(SevenSegmentDisplay);

  // Render our App
  new Vue({
    store,
    el: appRoot,

    data() {
      return {
        shadowHost,
        shadowRoot
      }
    },

    render: function (createElement) {
      return createElement(App);
    }
  });
}).catch(() => {
  appRoot.innerText = 'Error loading styles';
});

chrome.runtime.sendMessage('activate extension');