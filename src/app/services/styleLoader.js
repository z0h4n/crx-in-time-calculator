export default function (url, parentNode) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.onerror = reject;
    link.onload = resolve;
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', url);
    parentNode.appendChild(link);
  });
}