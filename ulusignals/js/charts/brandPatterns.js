// js/charts/brandPatterns.js
(function(){
  window.signalChartModules = window.signalChartModules || {};

  window.signalChartModules["brand/Patterns"] = async function({ registry }){
    // Guard: ECharts must be loaded
    if (!window.echarts) return;

    // Init each chart (each returns an echarts instance)
    const a = window.brandPatternsCharts?.initSharedThemes?.(registry);
    const b = window.brandPatternsCharts?.initRiskFactors?.(registry);
    const c = window.brandPatternsCharts?.initStyleBreakdown?.(registry);
    const d = window.brandPatternsCharts?.initMessageLength?.(registry);

    // optional: force resize after init
    requestAnimationFrame(() => {
      try { a?.resize(); } catch(e){}
      try { b?.resize(); } catch(e){}
      try { c?.resize(); } catch(e){}
      try { d?.resize(); } catch(e){}
    });
  };
})();
