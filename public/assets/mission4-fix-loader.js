(() => {
  const src = '../../assets/mission4-fix-v2.js?v=2';
  if(!document.querySelector(`script[src*="mission4-fix-v2.js"]`)){
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  }
})();
