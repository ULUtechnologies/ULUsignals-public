// js/charts/mediaPatterns_riskFactors.js
// Media / Patterns chart (ECharts) — split from mediaPatterns.js
// This file registers a chart initializer on window.signalChartModules
// and is loaded by apptwo.js when Media / Patterns is first opened.

(function () {
  window.signalChartModules = window.signalChartModules || {};

  const MQ_MOBILE = '(max-width: 520px)';
  const LOGO_BASE = 'logos/'; // IMPORTANT: relative to /js/charts/
  const LOGO_SIZE_DESKTOP = 32;
  const LOGO_SIZE_MOBILE = 22;

  const LOGOS = {
    tiktok: 'tiktok-logo.png',
    youtube: 'YouTube-logo.png',
    linkedin: 'linkedin-logo.png',
    roku: 'roku-logo.png',
    hulu: 'hulu-logo.png',
    reddit: 'reddit-logo.png',
    website: 'website-logo.png',
    landing_page: 'landing-page-logo.png'
  };

  function isMobile() {
    return !!(window.matchMedia && window.matchMedia(MQ_MOBILE).matches);
  }

  // ---------- robust init helpers ----------
  function ensureContainerHeight(el, kind) {
    if (!el) return;
    const mobile = isMobile();
    const minH =
      kind === 'short'
        ? (mobile ? 230 : 220)
        : (kind === 'normal'
            ? (mobile ? 320 : 280)
            : (mobile ? 300 : 280));

    const h = parseFloat(getComputedStyle(el).height || '0') || 0;
    if (h < minH) el.style.height = `${minH}px`;
  }

  function waitForBox(el, { tries = 30 } = {}) {
    return new Promise((resolve) => {
      if (!el) return resolve(false);
      let n = 0;
      const tick = () => {
        const w = el.clientWidth || 0;
        const h = el.clientHeight || 0;
        const ok = w > 20 && h > 20;
        if (ok) return resolve(true);
        n += 1;
        if (n >= tries) return resolve(false);
        requestAnimationFrame(tick);
      };
      tick();
    });
  }

  function preloadImages(srcs, timeoutMs = 1500) {
    const uniq = Array.from(new Set(srcs.filter(Boolean)));
    if (!uniq.length) return Promise.resolve();
    const loaders = uniq.map((src) => new Promise((resolve) => {
      const img = new Image();
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      img.onload = finish;
      img.onerror = finish;
      setTimeout(finish, timeoutMs);
      img.src = src;
    }));
    return Promise.allSettled(loaders).then(() => void 0);
  }


function waitForEcharts(timeoutMs = 2500) {
  if (window.echarts) return Promise.resolve(true);
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = () => {
      if (window.echarts) return resolve(true);
      if (performance.now() - start > timeoutMs) return resolve(false);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

  function ensureChart(el, elementId, registry) {
    if (!el) return null;
    if (!window.echarts) {
      console.warn('[signalOS] ECharts not found yet for', elementId);
      return null;
    }
    let chart = registry.get(elementId);
    if (chart) return chart;
    chart = echarts.init(el, null, { renderer: 'canvas' });
    registry.set(elementId, chart);
    return chart;
  }

  function safeResize(chart) {
    try { chart && chart.resize(); } catch (e) {}
  }

  // ---------- shared chart option helpers ----------
  function baseGrid({ withLogos = false } = {}) {
    // Give mobile a bit more room so the icon + 2-line label doesn't clip.
    // Mobile: keep enough room for the logo + 2-line label row, but avoid
    // reserving excessive blank space beneath it.
    const bottom = withLogos ? (isMobile() ? 52 : 126) : (isMobile() ? 24 : 34);
    return isMobile()
      ? { left: 28, right: 12, top: 22, bottom, containLabel: true }
      : { left: 56, right: 28, top: 30, bottom, containLabel: true };
  }

  function baseTooltip() {
    return {
      trigger: 'axis',
      confine: true,
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(15,23,42,.94)',
      borderColor: 'rgba(255,255,255,.10)',
      textStyle: { color: 'rgba(255,255,255,.92)' }
    };
  }

  function splitLine() {
    return { lineStyle: { color: 'rgba(255,255,255,.07)' } };
  }

  function axisLabelPlain() {
    // Keep labels consistent across viewports; never auto-skip.
    return {
      interval: 0,
      hideOverlap: false,
      hideOverlap: false,
      color: 'rgba(255,255,255,.60)',
      fontSize: 11,
      margin: 8,
      align: 'center'
    };
  }

  function axisLabelWithPlatformLogos() {
    function pickKey(label) {
      const v = String(label || '').toLowerCase();
      if (v.includes('tiktok')) return 'tiktok';
      if (v.includes('youtube')) return 'youtube';
      if (v.includes('linkedin')) return 'linkedin';
      if (v.includes('roku')) return 'roku';
      if (v.includes('hulu')) return 'hulu';
      if (v.includes('reddit')) return 'reddit';
      if (v.includes('landing')) return 'landing_page';
      if (v.includes('website')) return 'website';
      return null;
    }

    function wrapLabel(label) {
      const v = String(label || '');
      if (!isMobile()) return v;

      if (/youtube/i.test(v) && /long\s*form/i.test(v)) return 'YouTube\nLong Form';
      if (/youtube/i.test(v) && /form/i.test(v)) return 'YouTube\nForm';
      if (/landing/i.test(v) && /page/i.test(v)) return 'Landing\nPage';

      const parts = v.split(/\s+/).filter(Boolean);
      if (parts.length <= 1) return v;
      return parts[0] + '\n' + parts.slice(1).join(' ');
    }

    const mobileLabelWidth = 72;
    const logoSize = isMobile() ? LOGO_SIZE_MOBILE : LOGO_SIZE_DESKTOP;

    return {
      interval: 0,
      hideOverlap: false,
      // ECharts may hide overlapping labels automatically. We want every
      // platform label to show in this chart (even if tight), so disable that.
      hideOverlap: false,
      margin: isMobile() ? 6 : 16,
      formatter: function (value) {
        const key = pickKey(value);
        const label = wrapLabel(value);
        if (!key) return label;
        return `{logo_${key}|}\n{name|${label}}`;
      },
      rich: {
        name: {
          color: 'rgba(255,255,255,.60)',
          fontSize: isMobile() ? 10 : 11,
          lineHeight: isMobile() ? 11 : 16,
          align: 'center'
        },
        logo_tiktok: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.tiktok } },
        logo_youtube: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.youtube } },
        logo_linkedin: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.linkedin } },
        logo_roku: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.roku } },
        logo_hulu: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.hulu } },
        logo_reddit: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.reddit } },
        logo_website: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.website } },
        logo_landing_page: { height: logoSize, width: logoSize, align: 'center', backgroundColor: { image: LOGO_BASE + LOGOS.landing_page } }
      }
    };
  }

  function makeGroupedBars({ categories, series, yMax, withLogos = false }) {
    const mobile = isMobile();
    const catGap = mobile ? '44%' : '14%';
    const innerGap = mobile ? '35%' : '18%';

    return {
      backgroundColor: 'transparent',
      grid: baseGrid({ withLogos }),
      tooltip: baseTooltip(),
      legend: { top: 0, left: 6, textStyle: { color: 'rgba(255,255,255,.65)', fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
      xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: 'rgba(255,255,255,.12)' } }, axisTick: { show: false, interval: 0 }, axisLabel: withLogos ? axisLabelWithPlatformLogos() : axisLabelPlain() },
      yAxis: { type: 'value', max: yMax, axisLine: { show: false }, axisTick: { show: false, interval: 0 }, axisLabel: axisLabelPlain(), splitLine: splitLine() },
      series: series.map(s => {
        const item = {
          name: s.name,
          type: 'bar',
          data: s.data,
          barCategoryGap: catGap,
          barGap: innerGap,
          itemStyle: { color: s.color, borderRadius: 0 }
        };
        if (mobile) item.barMaxWidth = 10;
        else { item.barWidth = 22; item.barMaxWidth = 26; }
        return item;
      })
    };
  }

  function makeStackedRiskBars({ categories, series, yMax, withLogos = false }) {
    const mobile = isMobile();
    const barW = mobile ? 12 : 24;
    const catGap = mobile ? '42%' : '16%';

    return {
      backgroundColor: 'transparent',
      grid: baseGrid({ withLogos }),
      tooltip: baseTooltip(),
      legend: { top: 0, left: 6, textStyle: { color: 'rgba(255,255,255,.65)', fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
      xAxis: { type: 'category', data: categories, axisLine: { lineStyle: { color: 'rgba(255,255,255,.12)' } }, axisTick: { show: false, interval: 0 }, axisLabel: withLogos ? axisLabelWithPlatformLogos() : axisLabelPlain() },
      yAxis: { type: 'value', max: yMax, axisLine: { show: false }, axisTick: { show: false, interval: 0 }, axisLabel: axisLabelPlain(), splitLine: splitLine() },
      series: series.map(s => ({
        name: s.name,
        type: 'bar',
        stack: 'risk',
        data: s.data,
        barWidth: barW,
        barCategoryGap: catGap,
        itemStyle: { color: s.color, borderRadius: 0 }
      }))
    };
  }

  function makeMessageLengthStacked({ categories, series }) {
    const grid = isMobile()
      ? { left: 44, right: 16, top: 26, bottom: 86, containLabel: true }
      : { left: 88, right: 28, top: 26, bottom: 30, containLabel: true };

    return {
      backgroundColor: 'transparent',
      grid,
      tooltip: baseTooltip(),
      legend: { bottom: 0, left: 'center', textStyle: { color: 'rgba(255,255,255,.65)', fontSize: 11 }, itemWidth: 10, itemHeight: 10 },
      xAxis: { type: 'value', max: 100, axisLine: { show: false }, axisTick: { show: false, interval: 0 }, axisLabel: { ...axisLabelPlain(), formatter: v => `${v}%` }, splitLine: splitLine() },
      yAxis: { type: 'category', data: categories, axisLine: { show: false }, axisTick: { show: false, interval: 0 }, axisLabel: { color: 'rgba(255,255,255,.70)', fontSize: 11 } },
      series: series.map(s => ({
        name: s.name,
        type: 'bar',
        stack: 'len',
        data: s.data,
        barWidth: isMobile() ? 14 : 18,
        itemStyle: { color: s.color, borderRadius: 0 }
      }))
    };
  }


  async function init({ registry }) {
    await waitForEcharts();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));


    // Preload logos once (helps mobile browsers avoid first-paint hiccups)
    if (!window.__signalOSMediaPatternsLogosPreloaded) {
      window.__signalOSMediaPatternsLogosPreloaded = true;
      await preloadImages(Object.values(LOGOS).map(f => LOGO_BASE + f));
    }

    const el = document.getElementById('chart-media-patterns-riskFactors');
    ensureContainerHeight(el, 'normal');
    const okBox = await waitForBox(el);
    if (!okBox) {
      // If the panel is still laying out (common on mobile), give it another beat.
      await new Promise(r => setTimeout(r, 80));
    }

    const chart = ensureChart(el, 'chart-media-patterns-riskFactors', registry);
    if (!chart) return;

    // Build option (logos on by default); if a mobile browser chokes on rich-image axis labels,
// fall back to plain text labels so the chart still renders.
    const optWithLogos = makeStackedRiskBars({
      categories: ['TikTok', 'YouTube Long Form', 'LinkedIn', 'Website', 'Landing Page', 'Reddit'],
      yMax: 300,
      withLogos: true,
      series: [
        { name: 'Drop-off',   color: 'rgba(85,140,255,.55)',  data: [ 80, 120,  60, 110,  95,  85] },
        { name: 'Low CTR',    color: 'rgba(142,106,255,.55)', data: [110,  80,  70,  95, 120, 100] },
        { name: 'Neg. Sent.', color: 'rgba(126,197,142,.45)', data: [ 60,  40,  85,  70,  55,  65] }
      ]
    });

    try {
      chart.setOption(optWithLogos, true);
    } catch (e) {
      console.warn('[signalOS] riskFactors setOption failed; falling back to plain labels', e);
      const optPlain = makeStackedRiskBars({
        categories: ['TikTok', 'YouTube Long Form', 'LinkedIn', 'Website', 'Landing Page', 'Reddit'],
        yMax: 300,
        withLogos: false,
        series: [
          { name: 'Drop-off',   color: 'rgba(85,140,255,.55)',  data: [ 80, 120,  60, 110,  95,  85] },
          { name: 'Low CTR',    color: 'rgba(142,106,255,.55)', data: [110,  80,  70,  95, 120, 100] },
          { name: 'Neg. Sent.', color: 'rgba(126,197,142,.45)', data: [ 60,  40,  85,  70,  55,  65] }
        ]
      });
      try { chart.setOption(optPlain, true); } catch (_) {}
    }

    requestAnimationFrame(() => safeResize(chart));
  }

  window.signalChartModules['media/Patterns/riskFactors'] = init;

})();
