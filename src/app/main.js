import Vue from 'vue';
import App from 'Components/App.vue';
import store from 'Services/store';
import Buefy from 'buefy';
import SevenSegmentDisplay from 'vue-seven-segment-display';

if (typeof document.head.attachShadow !== 'function') {
  alert('ITC Extension now uses Shadow DOM. Please update your Google Chrome Browser to latest version.');
  throw new Error('Shadow dom is not supported');
}

// Make top nav of webpage unsticky
const topNav = document.body.children[0];
topNav.style.position = 'relative';
topNav.style.zIndex = 0;

// Material Design Icon CSS
const materialIconCSS = document.createElement('link');
materialIconCSS.setAttribute('rel', 'stylesheet');
materialIconCSS.setAttribute('href', chrome.runtime.getURL('css/materialdesignicons.css'));
document.head.appendChild(materialIconCSS);

// Extension template
const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="${materialIconCSS.getAttribute('href')}">
  <link rel="stylesheet" href="${chrome.runtime.getURL('css/buefy.min.css')}">
  <link rel="stylesheet" href="${chrome.runtime.getURL('css/override.css')}">
  <link rel="stylesheet" href="${chrome.runtime.getURL('css/global.css')}">
  <link rel="stylesheet" href="${chrome.runtime.getURL('css/scoped.css')}">
  <div id="appRoot"></div>
`;

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
shadowRoot.append(template.content);

// Setup Vue
Vue.use(Buefy);
Vue.use(SevenSegmentDisplay);

// Load our app in app root
new Vue({
  store,
  el: shadowRoot.querySelector('#appRoot'),

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

chrome.runtime.sendMessage('activate extension');