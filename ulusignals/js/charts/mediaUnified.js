// js/charts/mediaUnified.js
(function(){
  window.signalChartModules = window.signalChartModules || {};

  function makeChart(id, registry){
    if(!window.echarts) return null;
    var el = document.getElementById(id);
    if(!el) return null;
    var chart = registry && registry.get(id);
    if(!chart){
      chart = window.echarts.init(el, null, { renderer: 'canvas' });
      if(registry) registry.set(id, chart);
    }
    return chart;
  }

  var palette = {
    tiktok: '#e84d67', instagram: '#f29a36', youtube: '#e9473f', email: '#79c96a', website: '#4f8ee8',
    blueSoft: '#5fb0f4', purple: '#7353e7', teal: '#5ec8cf', grid: 'rgba(255,255,255,.10)',
    text: 'rgba(255,255,255,.82)', muted: 'rgba(255,255,255,.58)'
  };

  function platformIcon(name){
    var map = { TikTok: '♪', Instagram: '◎', YouTube: '▶', Email: '✉', Website: '◎' };
    return map[name] || '';
  }

  function initResonance(registry){
    var chart = makeChart('chart-media-resonance', registry);
    if(!chart) return;
    var platforms = ['TikTok','Instagram','YouTube','Email','Website'];
    var values = [92,84,78,64,56];
    var colors = [palette.tiktok,palette.instagram,palette.youtube,palette.email,palette.website];
    chart.setOption({
      grid:{left:92,right:30,top:8,bottom:44},
      tooltip:{trigger:'axis',axisPointer:{type:'none'},confine:true},
      xAxis:{type:'value',min:0,max:100,splitNumber:4,axisLabel:{color:palette.muted},axisLine:{lineStyle:{color:palette.grid}},axisTick:{show:false},splitLine:{lineStyle:{color:'rgba(255,255,255,.08)'}}},
      yAxis:{type:'category',inverse:true,data:platforms.map(function(p){return platformIcon(p)+'  '+p;}),axisLabel:{color:'#fff',fontSize:14,margin:14},axisLine:{show:false},axisTick:{show:false}},
      series:[{ type:'bar',barWidth:16,showBackground:false,data:values.map(function(v,i){return {value:v,itemStyle:{color:colors[i],borderRadius:4}};}), label:{show:true,position:'right',formatter:'{c}',color:function(p){return colors[p.dataIndex];},fontSize:16,fontWeight:800} }]
    }, true);
  }

  function defaultJourneyTheme(){
    return {
      assetBase: 'assets/audience-journey-svg-components/',
      platforms: {
        youtube:   { label:'YouTube',   type:'Video Content',        icon:'▶',  color:'#ff4242', rgb:'255,66,66' },
        instagram: { label:'Instagram', type:'Social Platform',      icon:'◎',  color:'#ff9f2e', rgb:'255,159,46' },
        tiktok:    { label:'TikTok',    type:'Short-Form Video',     icon:'♪',  color:'#ff426d', rgb:'255,66,109' },
        facebook:  { label:'Facebook',  type:'Social Platform',      icon:'f',  color:'#5fc3ff', rgb:'95,195,255' },
        linkedin:  { label:'LinkedIn',  type:'Professional Network', icon:'in', color:'#5fc3ff', rgb:'95,195,255' }
      },
      stageIcons: {
        'views':'views.svg','view':'views.svg','watch time':'watch-time.svg','subscribers':'subscribers.svg',
        'website visits':'website-visits.svg','purchases':'purchases.svg','reach':'reach.svg','engagement':'engagement.svg',
        'profile visits':'profile-visits.svg','website clicks':'website-clicks.svg','conversions':'conversions.svg','video views':'video-views.svg',
        'profile views':'profile-views.svg','followers':'followers.svg','link clicks':'link-clicks.svg','page visits':'page-visits.svg',
        'impressions':'impressions.svg','leads generated':'leads-generated.svg'
      },
      pedestal:'pedestal.svg'
    };
  }

  function loadScriptOnce(src){
    window.__signalOSLoadedScripts = window.__signalOSLoadedScripts || new Set();
    if(window.__signalOSLoadedScripts.has(src)) return Promise.resolve();
    if(Array.prototype.some.call(document.scripts || [], function(s){ return s.src && s.src.indexOf(src) !== -1; })){
      window.__signalOSLoadedScripts.add(src); return Promise.resolve();
    }
    return new Promise(function(resolve){
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function(){ window.__signalOSLoadedScripts.add(src); resolve(); };
      s.onerror = function(){ resolve(); };
      document.head.appendChild(s);
    });
  }

  function normMetric(metric){ return String(metric || '').toLowerCase().replace(/\s+/g,' ').trim(); }
  function esc(str){ return String(str == null ? '' : str).replace(/[&<>"']/g,function(ch){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]; }); }

  var svgCache = new Map();
  async function fetchSvg(url){
    if(svgCache.has(url)) return svgCache.get(url);
    var promise = fetch(url, { cache:'force-cache' }).then(function(r){ if(!r.ok) throw new Error('SVG not found: '+url); return r.text(); });
    svgCache.set(url, promise);
    return promise;
  }

  function ensureJourneyDomStyles(){
    if(document.getElementById('mediaJourneySvgComponentStyles')) return;
    var style = document.createElement('style');
    style.id = 'mediaJourneySvgComponentStyles';
    style.textContent = `
      #chart-media-journey{height:auto!important;min-height:0!important;margin-top:12px;width:100%;max-width:100%;box-sizing:border-box;}
      .aj-card{display:grid;gap:12px;max-width:100%;overflow:hidden;box-sizing:border-box;}
      .aj-topline{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:8px;margin-bottom:4px;max-width:100%;}
      .aj-platforms{display:flex;align-items:center;gap:10px;flex-wrap:wrap;min-width:0;}
      .aj-platform-btn{height:38px;padding:0 14px;border-radius:12px;border:1px solid rgba(255,255,255,.13);background:rgba(255,255,255,.045);color:rgba(255,255,255,.82);font-size:13px;font-weight:850;display:inline-flex;align-items:center;gap:8px;cursor:pointer;transition:background .16s ease,border-color .16s ease,box-shadow .16s ease;}
      .aj-platform-btn:hover{background:rgba(255,255,255,.075);border-color:rgba(120,190,255,.26);}
      .aj-platform-btn.is-active{color:#fff;border-color:var(--aj-color);background:linear-gradient(180deg,rgba(255,255,255,.085),rgba(255,255,255,.035));box-shadow:0 0 12px rgba(var(--aj-rgb),.22);}
      .aj-icon{width:22px;height:22px;border-radius:7px;display:grid;place-items:center;background:var(--aj-color);color:#fff;font-size:12px;font-weight:950;line-height:1;}
      .aj-date-wrap{display:flex;align-items:center;gap:10px;border:1px solid rgba(120,180,255,.18);background:rgba(255,255,255,.045);border-radius:16px;padding:9px 14px;box-shadow:inset 0 1px 0 rgba(255,255,255,.04);}
      .aj-date-label{color:rgba(255,255,255,.66);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;}.aj-date-select{appearance:none;border:0;background:transparent;color:#fff;font-size:13px;font-weight:900;outline:none;padding-right:8px;}.aj-date-select option{background:#081f40;color:#fff;}
      .aj-stage-panel{border:1px solid rgba(120,180,255,.16);border-radius:18px;background:radial-gradient(circle at 12% 0%, rgba(var(--aj-rgb),.10), transparent 34%),rgba(2,13,31,.30);padding:18px;overflow:hidden;max-width:100%;box-sizing:border-box;}
      .aj-platform-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin-bottom:16px;}.aj-platform-title{display:flex;align-items:center;gap:12px;min-width:0;}.aj-logo{width:48px;height:48px;border-radius:12px;display:grid;place-items:center;background:var(--aj-color);color:#fff;font-size:19px;font-weight:950;box-shadow:0 0 14px rgba(var(--aj-rgb),.22);flex:0 0 auto;}.aj-platform-title strong{display:block;color:#fff;font-size:24px;font-weight:950;line-height:1.05;}.aj-platform-title small{display:block;color:rgba(255,255,255,.66);font-size:14px;margin-top:4px;}
      .aj-score{min-width:170px;border:1px solid rgba(255,255,255,.13);border-radius:14px;background:rgba(255,255,255,.035);padding:11px 14px;text-align:right;flex:0 0 auto;}.aj-score small{display:block;color:rgba(255,255,255,.64);font-size:12px;font-weight:850;}.aj-score strong{display:block;color:#fff;font-size:26px;line-height:1.08;font-weight:950;}.aj-score-delta{display:inline-flex!important;align-items:center;justify-content:flex-end;gap:5px;color:rgba(255,255,255,.60);font-weight:850;}.aj-score-delta.is-up{color:#67e586!important;}.aj-score-delta.is-down{color:#ff6b7a!important;}
      .aj-move{display:inline-flex;align-items:center;justify-content:center;gap:4px;white-space:nowrap;}.aj-move-arrow{font-size:13px;font-weight:950;line-height:1;}.aj-move.is-up{color:#67e586!important;}.aj-move.is-down{color:#ff6b7a!important;}
      .aj-timeline{--aj-count:5;display:grid;grid-template-columns:repeat(var(--aj-count),minmax(0,1fr));align-items:start;gap:0;width:100%;max-width:100%;overflow:visible;box-sizing:border-box;margin-top:8px;}
      .aj-step{position:relative;text-align:center;min-width:0;padding:0 clamp(3px,.45vw,8px);box-sizing:border-box;}.aj-step:not(:last-child):after{content:'';position:absolute;left:calc(50% + clamp(34px,3vw,42px));right:calc(-50% + clamp(34px,3vw,42px));top:clamp(29px,2.8vw,35px);height:2px;background:repeating-linear-gradient(90deg,var(--aj-color) 0 6px,transparent 6px 13px);border-radius:999px;opacity:.62;}.aj-step:not(:last-child):before{content:'›';position:absolute;left:calc(100% - clamp(17px,1.25vw,23px));top:clamp(18px,1.9vw,25px);color:var(--aj-color);font-size:clamp(22px,1.9vw,28px);font-weight:900;z-index:4;text-shadow:0 0 4px rgba(var(--aj-rgb),.20);opacity:.88;}
      .aj-node{position:relative;z-index:3;width:clamp(50px,4.7vw,64px);height:clamp(63px,5.9vw,77px);margin:0 auto 8px;display:grid;place-items:start center;color:var(--aj-color);overflow:visible;filter:none;}.aj-node-svg{width:clamp(39px,3.75vw,50px);height:clamp(39px,3.75vw,50px);display:block;overflow:visible;position:relative;z-index:3;margin-top:0;}.aj-node-svg svg{width:100%;height:100%;overflow:visible;display:block;}.aj-pedestal{position:absolute;left:50%;bottom:7px;transform:translateX(-50%);width:92%;height:22px;overflow:visible;z-index:1;opacity:.88;}.aj-pedestal svg{width:100%;height:100%;overflow:visible;display:block;}
      .aj-line{fill:none;stroke:currentColor;stroke-width:3.0;stroke-linecap:round;stroke-linejoin:round;}.aj-thin{fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;}.aj-white{fill:none;stroke:rgba(255,255,255,.96);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;}.aj-white-thin{fill:none;stroke:rgba(255,255,255,.92);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;}.aj-fill{fill:currentColor;opacity:.34;stroke:rgba(255,255,255,.34);stroke-width:1.55;stroke-linejoin:round;}.aj-soft{fill:currentColor;opacity:.22;}.aj-accent{fill:currentColor;opacity:.46;}.aj-dot,.aj-white-fill{fill:rgba(255,255,255,.94);}.aj-shine{fill:none;stroke:rgba(255,255,255,.75);stroke-width:1.25;stroke-linecap:round;opacity:.75;}
      .aj-glass{fill:currentColor;opacity:.34;stroke:rgba(255,255,255,.48);stroke-width:1.35;stroke-linejoin:round;}.aj-grad{fill:url(#ajIconGradient);stroke:rgba(255,255,255,.44);stroke-width:1.25;}.aj-inner-glow{fill:rgba(255,255,255,.16);stroke:rgba(255,255,255,.48);stroke-width:1.1;}.aj-fine{fill:none;stroke:rgba(255,255,255,.86);stroke-width:1.25;stroke-linecap:round;stroke-linejoin:round;}.aj-color-fine{fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round;opacity:.9;}
      .aj-ped-shadow{fill:rgba(0,0,0,.22);}.aj-ped-body{fill:rgba(var(--aj-rgb),.26);stroke:rgba(var(--aj-rgb),.76);stroke-width:1.45;}.aj-ped-top{fill:rgba(255,255,255,.16);stroke:rgba(255,255,255,.48);stroke-width:1.05;}.aj-ped-rim{fill:none;stroke:rgba(var(--aj-rgb),.82);stroke-width:1.05;}.aj-ped-highlight{fill:none;stroke:rgba(255,255,255,.56);stroke-width:1.15;stroke-linecap:round;opacity:.72;}
      .aj-value{font-size:clamp(21px,2.2vw,27px);font-weight:820;color:#fff;line-height:.98;letter-spacing:-.025em;}.aj-label{margin-top:6px;color:#fff;font-size:clamp(11px,1vw,14px);font-weight:800;line-height:1.08;overflow-wrap:normal;word-break:normal;hyphens:none;}.aj-sub{margin-top:3px;color:rgba(255,255,255,.62);font-size:clamp(9px,.82vw,11px);font-weight:720;line-height:1.12;}.aj-rate{margin-top:6px;color:var(--aj-color);font-size:clamp(10px,.92vw,12px);font-weight:850;line-height:1.16;}.aj-rate small{display:block;margin-top:3px;color:rgba(255,255,255,.55);font-weight:760;}
      @media (max-width:1120px){.aj-stage-panel{padding:16px 14px;}.aj-platform-title strong{font-size:21px;}.aj-value{font-size:24px;}.aj-label{font-size:13px;}}
      @media (max-width:820px){.aj-platform-head{flex-direction:column;}.aj-score{text-align:left;min-width:0;width:100%;}.aj-timeline{display:flex;flex-direction:column;align-items:center;gap:8px;max-width:360px;margin:10px auto 0;}.aj-step{display:grid;grid-template-columns:72px minmax(0,190px);gap:12px;align-items:center;text-align:left;width:100%;padding:0;}.aj-step:before,.aj-step:after{display:none!important;}.aj-node{margin:0;width:62px;height:68px;}.aj-node-svg{width:46px;height:46px;}.aj-pedestal{width:56px;height:18px;bottom:6px;}.aj-value{font-size:23px;}.aj-label{font-size:14px;}.aj-sub{font-size:11px;}.aj-topline{align-items:flex-start;}.aj-platforms{justify-content:center;width:100%;}.aj-date-wrap{margin:0 auto;}}
    `;
    document.head.appendChild(style);
  }

  function journeyData(theme){
    var p = theme.platforms;
    return {
      youtube: { label:p.youtube.label, type:p.youtube.type, icon:p.youtube.icon, color:p.youtube.color, rgb:p.youtube.rgb, score:84, scoreDir:'up', delta:'+12% vs prior 30 days', steps:[
        {label:'Views', value:'394', metric:'views', rate:'Starting Point'},
        {label:'Watch Time', value:'286', sub:'Minutes', metric:'watch time', dir:'up', rate:'72.6%', rateSub:'of prior step'},
        {label:'Subscribers', value:'43', metric:'subscribers', dir:'up', rate:'15.0%', rateSub:'of prior step'},
        {label:'Website Visits', value:'25', metric:'website visits', dir:'down', rate:'58.1%', rateSub:'of prior step'},
        {label:'Purchases', value:'12', metric:'purchases', dir:'down', rate:'46.0%', rateSub:'of prior step'}
      ], interpretation:'Strong initial views and watch time are driving subscriber growth. However, website visits and purchases are significantly below the previous step.', recommendation:'Optimize video descriptions and end screens with stronger CTAs to drive more website traffic and improve conversion to purchases.'},
      instagram: { label:p.instagram.label, type:p.instagram.type, icon:p.instagram.icon, color:p.instagram.color, rgb:p.instagram.rgb, score:88, scoreDir:'up', delta:'+9% vs prior 30 days', steps:[
        {label:'Reach', value:'394', metric:'reach', rate:'Starting Point'},
        {label:'Engagement', value:'385', sub:'Reactions + Comments', metric:'engagement', dir:'up', rate:'97.7%', rateSub:'of prior step'},
        {label:'Profile Visits', value:'172', metric:'profile visits', dir:'up', rate:'44.7%', rateSub:'of prior step'},
        {label:'Website Clicks', value:'60', metric:'website clicks', dir:'down', rate:'34.9%', rateSub:'of prior step'},
        {label:'Conversions', value:'18', metric:'conversions', dir:'down', rate:'30.0%', rateSub:'of prior step'}
      ], interpretation:'Instagram shows exceptionally strong engagement and healthy profile interest.', recommendation:'Improve the transition from profile visits to website clicks with clearer link prompts and stronger offer framing.'},
      tiktok: { label:p.tiktok.label, type:p.tiktok.type, icon:p.tiktok.icon, color:p.tiktok.color, rgb:p.tiktok.rgb, score:82, scoreDir:'up', delta:'+14% vs prior 30 days', steps:[
        {label:'Video Views', value:'386', metric:'video views', rate:'Starting Point'},
        {label:'Profile Views', value:'221', metric:'profile views', dir:'up', rate:'57.3%', rateSub:'of prior step'},
        {label:'Followers', value:'120', metric:'followers', dir:'up', rate:'54.3%', rateSub:'of prior step'}
      ], interpretation:'TikTok is driving efficient audience discovery and follow-through from viewers into profile visits and followers.', recommendation:'Keep hooks fast and story-driven, then add creator-style profile prompts to convert more viewers into followers.'},
      facebook: { label:p.facebook.label, type:p.facebook.type, icon:p.facebook.icon, color:p.facebook.color, rgb:p.facebook.rgb, score:76, scoreDir:'up', delta:'+5% vs prior 30 days', steps:[
        {label:'Reach', value:'394', metric:'reach', rate:'Starting Point'},
        {label:'Engagement', value:'312', sub:'Reactions + Comments', metric:'engagement', dir:'up', rate:'79.2%', rateSub:'of prior step'},
        {label:'Link Clicks', value:'108', metric:'link clicks', dir:'down', rate:'34.6%', rateSub:'of prior step'},
        {label:'Page Visits', value:'38', metric:'page visits', dir:'down', rate:'35.2%', rateSub:'of prior step'},
        {label:'Conversions', value:'15', metric:'conversions', dir:'down', rate:'39.5%', rateSub:'of prior step'}
      ], interpretation:'Facebook maintains a strong engagement base, but click-to-visit behavior is the main constraint.', recommendation:'Use more direct post CTAs and stronger preview copy to improve link click quality.'},
      linkedin: { label:p.linkedin.label, type:p.linkedin.type, icon:p.linkedin.icon, color:p.linkedin.color, rgb:p.linkedin.rgb, score:79, scoreDir:'up', delta:'+7% vs prior 30 days', steps:[
        {label:'Impressions', value:'280', metric:'impressions', rate:'Starting Point'},
        {label:'Engagement', value:'148', sub:'Likes + Comments', metric:'engagement', dir:'up', rate:'52.9%', rateSub:'of prior step'},
        {label:'Profile Views', value:'72', metric:'profile visits', dir:'up', rate:'48.6%', rateSub:'of prior step'},
        {label:'Website Clicks', value:'28', metric:'website clicks', dir:'up', rate:'38.9%', rateSub:'of prior step'},
        {label:'Leads Generated', value:'11', metric:'leads generated', dir:'up', rate:'39.3%', rateSub:'of prior step'}
      ], interpretation:'LinkedIn is producing qualified relationship movement, especially from engagement into profile interest.', recommendation:'Add sharper professional proof points and a lead magnet to improve click-to-lead conversion.'}
    };
  }

  async function initJourney(registry){
    var el = document.getElementById('chart-media-journey');
    if(!el) return;
    if(window.echarts && registry && registry.get('chart-media-journey')){
      try{ registry.get('chart-media-journey').dispose(); }catch(e){}
      registry.delete('chart-media-journey');
    }
    await loadScriptOnce('js/charts/audienceJourneyTheme.js');
    ensureJourneyDomStyles();
    var theme = window.AudienceJourneyThemes || defaultJourneyTheme();
    var data = journeyData(theme);
    var active = el.dataset.ajActive || 'youtube';
    if(!data[active]) active = 'youtube';

    function assetUrl(file){ return String(theme.assetBase || 'assets/audience-journey-svg-components/').replace(/\/$/,'') + '/' + file; }
    var pedestalUrl = assetUrl(theme.pedestal || 'pedestal.svg');

    async function componentForStep(step){
      var file = theme.stageIcons[normMetric(step.metric)] || theme.stageIcons[normMetric(step.label)] || 'views.svg';
      var icon = await fetchSvg(assetUrl(file)).catch(function(){ return '<svg viewBox="0 0 100 100"><circle class="aj-line" cx="50" cy="50" r="32"/></svg>'; });
      var ped = await fetchSvg(pedestalUrl).catch(function(){ return '<svg viewBox="0 0 160 42"><ellipse class="aj-ped-body" cx="80" cy="21" rx="60" ry="13"/></svg>'; });
      return '<div class="aj-node"><span class="aj-node-svg">'+icon+'</span><span class="aj-pedestal">'+ped+'</span></div>';
    }

    function rateHtml(step){
      if(!step.dir) return '<div class="aj-rate">'+esc(step.rate || '')+'</div>';
      var arrow = step.dir === 'down' ? '▼' : '▲';
      return '<div class="aj-rate"><span class="aj-move '+(step.dir === 'down' ? 'is-down':'is-up')+'"><span class="aj-move-arrow">'+arrow+'</span> '+esc(step.rate || '')+'</span><small>'+esc(step.rateSub || '')+'</small></div>';
    }

    async function render(platformKey){
      var item = data[platformKey];
      el.dataset.ajActive = platformKey;
      el.style.setProperty('--aj-color', item.color);
      el.style.setProperty('--aj-rgb', item.rgb);
      var stepNodes = await Promise.all(item.steps.map(componentForStep));
      el.innerHTML = '<div class="aj-card" style="--aj-color:'+esc(item.color)+';--aj-rgb:'+esc(item.rgb)+'">' +
        '<div class="aj-topline"><div class="aj-platforms">' +
          Object.keys(data).map(function(k){ var d=data[k]; return '<button type="button" class="aj-platform-btn '+(k===platformKey?'is-active':'')+'" data-aj-platform="'+esc(k)+'" style="--aj-color:'+esc(d.color)+';--aj-rgb:'+esc(d.rgb)+'"><span class="aj-icon">'+esc(d.icon)+'</span>'+esc(d.label)+'</button>'; }).join('') +
        '</div><label class="aj-date-wrap"><span class="aj-date-label">Time Range</span><select class="aj-date-select" aria-label="Audience Journey time range"><option selected>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option></select></label></div>' +
        '<section class="aj-stage-panel"><div class="aj-platform-head"><div class="aj-platform-title"><div class="aj-logo">'+esc(item.icon)+'</div><div><strong>'+esc(item.label)+'</strong><small>'+esc(item.type)+'</small></div></div><div class="aj-score"><small>Overall Journey Score</small><strong>'+esc(item.score)+' / 100</strong><span class="aj-score-delta '+(item.scoreDir==='down'?'is-down':'is-up')+'">▲ '+esc(item.delta)+'</span></div></div>' +
        '<div class="aj-timeline" style="--aj-count:'+item.steps.length+'">' +
          item.steps.map(function(step, i){ return '<div class="aj-step">'+stepNodes[i]+'<div><div class="aj-value">'+esc(step.value)+'</div><div class="aj-label">'+esc(step.label)+'</div>'+(step.sub ? '<div class="aj-sub">'+esc(step.sub)+'</div>' : '')+rateHtml(step)+'</div></div>'; }).join('') +
        '</div></section></div>';
      el.querySelectorAll('[data-aj-platform]').forEach(function(btn){ btn.addEventListener('click', function(){ render(btn.getAttribute('data-aj-platform')); }); });
      // Put the removed footnote into the panel tooltip when the existing tooltip system is present.
      var panel = el.closest('.card, .media-card, .chart-card, section') || el.parentElement;
      var info = panel ? panel.querySelector('.panel-info-btn,.info-icon') : null;
      if(info){
        info.setAttribute('data-tooltip-title','Audience Journey');
        info.setAttribute('data-tooltip-body','Shows the measurable progression for the selected platform. Journey steps and metrics are specific to the selected platform and only include available data.');
      }
    }
    await render(active);
  }

  function initAlignment(registry){
    var chart = makeChart('chart-media-alignment', registry);
    if(!chart) return;
    var platforms = ['TikTok','Instagram','YouTube','Email','Website'];
    var themes = ['Emotional','Educational','Story-Driven','Promotional','Inspirational'];
    var data = [[0,0,92],[1,0,65],[2,0,89],[3,0,28],[4,0,78],[0,1,88],[1,1,72],[2,1,81],[3,1,32],[4,1,74],[0,2,74],[1,2,91],[2,2,87],[3,2,26],[4,2,82],[0,3,58],[1,3,82],[2,3,61],[3,3,22],[4,3,63],[0,4,42],[1,4,63],[2,4,55],[3,4,18],[4,4,47]];
    chart.setOption({
      grid:{left:88,right:10,top:34,bottom:24},
      tooltip:{position:'top',confine:true,formatter:function(p){return platforms[p.value[1]]+'<br>'+themes[p.value[0]]+': <b>'+p.value[2]+'</b>'; }},
      xAxis:{type:'category',data:themes,axisLabel:{color:'#fff',fontSize:11,interval:0},axisLine:{show:false},axisTick:{show:false},splitArea:{show:false}},
      yAxis:{type:'category',data:platforms.map(function(p){return platformIcon(p)+'  '+p;}),axisLabel:{color:'#fff',fontSize:12},axisLine:{show:false},axisTick:{show:false}},
      visualMap:{show:false,min:0,max:100,inRange:{color:['#b64045','#f0a84b','#72c96b']}},
      series:[{type:'heatmap',data:data,label:{show:true,color:'#fff',fontWeight:800},emphasis:{itemStyle:{shadowBlur:10,shadowColor:'rgba(0,0,0,.4)'}}}]
    }, true);
  }

  function initContentTypes(registry){
    var chart = makeChart('chart-media-content-types', registry);
    if(!chart) return;
    chart.setOption({
      tooltip:{trigger:'item',confine:true},
      series:[{type:'pie',radius:['44%','82%'],center:['50%','50%'],avoidLabelOverlap:true,label:{show:false},labelLine:{show:false},data:[
        {name:'Short-Form Video',value:38,itemStyle:{color:'#e64b63'}},{name:'Stories',value:22,itemStyle:{color:'#f29c3d'}},{name:'Long-Form Video',value:16,itemStyle:{color:'#4f8ee8'}},{name:'Live / Webinars',value:10,itemStyle:{color:'#78c467'}},{name:'Blog / Articles',value:7,itemStyle:{color:'#7055db'}},{name:'Other',value:7,itemStyle:{color:'#64758a'}}
      ]}],
      graphic:[{type:'group',left:'center',top:'middle',bounding:'raw',children:[
        {type:'text',left:'center',top:-30,style:{text:'Total',fill:'#fff',align:'center',textAlign:'center',font:'700 14px sans-serif'}},
        {type:'text',left:'center',top:-8,style:{text:'Engagements',fill:'#fff',align:'center',textAlign:'center',font:'700 14px sans-serif'}},
        {type:'text',left:'center',top:16,style:{text:'125.4K',fill:'#fff',align:'center',textAlign:'center',font:'800 17px sans-serif'}}
      ]}]
    }, true);
  }

  window.signalChartModules['media/Dashboard'] = async function(ctx){
    var registry = ctx && ctx.registry;
    initResonance(registry);
    await initJourney(registry);
    initAlignment(registry);
    initContentTypes(registry);
  };
})();
