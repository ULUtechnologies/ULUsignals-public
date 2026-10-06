// js/charts/mediaMarketIntelligence.js
(function(){
  window.signalChartModules = window.signalChartModules || {};

  async function loadScriptOnce(src){
    if (!src) return;
    window.__signalOSLoadedScripts = window.__signalOSLoadedScripts || new Set();
    if (window.__signalOSLoadedScripts.has(src)) return;

    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    }).catch((err) => {
      console.warn('[signalOS] script load failed:', err);
    });

    window.__signalOSLoadedScripts.add(src);
  }

  window.signalChartModules['media/Market Intelligence'] = async function(ctx){
    // Load each mini-chart module (kept separate per competitor card)
    await Promise.all([
      loadScriptOnce('js/charts/mediaMI_competitorGroup.js'),
      loadScriptOnce('js/charts/mediaMI_competitorA.js'),
      loadScriptOnce('js/charts/mediaMI_competitorB.js'),
      loadScriptOnce('js/charts/mediaMI_competitorC.js'),
      loadScriptOnce('js/charts/mediaMI_competitorD.js')
    ]);

    const mods = window.signalChartModules || {};
    const fns = [
      mods['media/Market Intelligence/competitorGroup'],
      mods['media/Market Intelligence/competitorA'],
      mods['media/Market Intelligence/competitorB'],
      mods['media/Market Intelligence/competitorC'],
      mods['media/Market Intelligence/competitorD']
    ].filter(fn => typeof fn === 'function');

    for (const fn of fns){
      await fn(ctx || {});
    }
  };
})();
