(function(){
  window.signalChartModules = window.signalChartModules || {};

  const COLORS = {
    purple:'#7f4ce6',
    blue:'#5aa7ff',
    green:'#79c96b',
    yellow:'#ffc83d',
    pink:'#e0529e',
    orange:'#ff7a3c',
    grid:'rgba(255,255,255,.12)',
    text:'rgba(255,255,255,.86)'
  };

  const CHART_IDS = [
    'chart-brand-communication-score',
    'chart-brand-identity-profile',
    'chart-brand-tone-distribution'
  ];

  function ready(){
    return !!(window.echarts && CHART_IDS.every(id => document.getElementById(id)));
  }

  function initChart(registry, id){
    const el = document.getElementById(id);
    if(!el || !window.echarts) return null;

    let chart = registry.get(id) || echarts.getInstanceByDom(el) || echarts.init(el, null, { renderer:'canvas' });
    registry.set(id, chart);
    return chart;
  }

  function gauge(registry){
    const ch = initChart(registry, 'chart-brand-communication-score');
    if(!ch) return false;

    ch.setOption({
      backgroundColor:'transparent',
      series:[{
        type:'gauge',
        startAngle:210,
        endAngle:-30,
        min:0,
        max:100,
        radius:'88%',
        center:['50%','55%'],
        progress:{
          show:true,
          width:18,
          itemStyle:{
            color:{
              type:'linear', x:0, y:0, x2:1, y2:0,
              colorStops:[
                { offset:0, color:COLORS.purple },
                { offset:.65, color:COLORS.blue },
                { offset:1, color:COLORS.green }
              ]
            }
          }
        },
        axisLine:{ lineStyle:{ width:18, color:[[1,'rgba(255,255,255,.16)']] } },
        pointer:{ show:false },
        axisTick:{ show:false },
        splitLine:{ show:false },
        axisLabel:{ show:false },
        data:[{ value:89 }],
        detail:{
          valueAnimation:false,
          formatter:'{value}\n/100',
          color:'#fff',
          fontSize:30,
          fontWeight:900,
          lineHeight:32,
          offsetCenter:[0,'7%']
        }
      }]
    }, true);
    return true;
  }

  function radar(registry){
    const ch = initChart(registry, 'chart-brand-identity-profile');
    if(!ch) return false;

    ch.setOption({
      backgroundColor:'transparent',
      tooltip:{ show:false },
      grid:{ top:0, bottom:0, left:0, right:0 },
      radar:{
        center:['50%','52%'],
        radius:'42%',
        splitNumber:5,
        axisName:{
          color:COLORS.text,
          fontSize:10,
          lineHeight:12,
          padding:[3,4,3,4]
        },
        splitLine:{ lineStyle:{ color:'rgba(150,110,255,.25)' } },
        splitArea:{ areaStyle:{ color:['rgba(120,70,220,.10)','rgba(120,70,220,.04)'] } },
        axisLine:{ lineStyle:{ color:'rgba(150,110,255,.28)' } },
        indicator:[
          { name:'Conversational\n86', max:100 },
          { name:'Educational\n72', max:100 },
          { name:'Reflective\n86', max:100 },
          { name:'Story-Driven\n88', max:100 },
          { name:'Emotional\n77', max:100 },
          { name:'Authoritative\n62', max:100 }
        ]
      },
      legend:{
        bottom:2,
        left:'center',
        textStyle:{ color:COLORS.text, fontSize:10 },
        itemWidth:10,
        itemHeight:10,
        itemGap:18,
        data:['Your Score','Platform Avg.']
      },
      series:[{
        type:'radar',
        symbolSize:6,
        data:[
          {
            value:[86,72,86,88,77,62],
            name:'Your Score',
            areaStyle:{ color:'rgba(126,76,230,.48)' },
            lineStyle:{ color:COLORS.purple, width:3 },
            itemStyle:{ color:'#b26bff' }
          },
          {
            value:[70,66,72,70,64,58],
            name:'Platform Avg.',
            symbol:'none',
            lineStyle:{ color:'rgba(255,255,255,.55)', type:'dashed' },
            areaStyle:{ color:'rgba(255,255,255,0)' }
          }
        ]
      }]
    }, true);
    return true;
  }

  function tone(registry){
    const ch = initChart(registry, 'chart-brand-tone-distribution');
    if(!ch) return false;

    const data = [32,24,17,12,9,6];
    const names = ['Trust','Curiosity','Inspiration','Vulnerability','Humor','Urgency'];

    ch.setOption({
      backgroundColor:'transparent',
      grid:{ left:104, right:24, top:12, bottom:32, containLabel:false },
      xAxis:{
        type:'value',
        max:40,
        axisLabel:{ color:COLORS.text, formatter:'{value}%' },
        splitLine:{ lineStyle:{ color:COLORS.grid } },
        axisLine:{ lineStyle:{ color:'rgba(255,255,255,.18)' } }
      },
      yAxis:{
        type:'category',
        data:names,
        inverse:true,
        axisLabel:{ color:'#fff', fontSize:12, margin:14 },
        axisTick:{ show:false },
        axisLine:{ show:false }
      },
      series:[{
        type:'bar',
        data:data.map((v,i) => ({
          value:v,
          itemStyle:{ color:[COLORS.green,COLORS.blue,COLORS.purple,COLORS.pink,COLORS.yellow,COLORS.orange][i] }
        })),
        barWidth:15,
        label:{ show:true, position:'right', formatter:'{c}%', color:'#fff', fontSize:12 },
        showBackground:true,
        backgroundStyle:{ color:'rgba(255,255,255,.07)', borderRadius:4 },
        itemStyle:{ borderRadius:4 }
      }]
    }, true);
    return true;
  }

  function renderAll(registry){
    const ok = [gauge(registry), radar(registry), tone(registry)].every(Boolean);
    requestAnimationFrame(() => {
      CHART_IDS.forEach(id => {
        const el = document.getElementById(id);
        const chart = el && window.echarts ? echarts.getInstanceByDom(el) : null;
        if(chart) chart.resize();
      });
    });
    return ok;
  }

  window.signalChartModules['brand/Dashboard'] = async function({ registry }){
    let tries = 0;
    const maxTries = 30;

    function attempt(){
      tries += 1;
      if(ready()){
        if(renderAll(registry)) return;
      }
      if(tries < maxTries){
        setTimeout(attempt, 100);
      }else{
        console.warn('[signalOS] Brand dashboard charts could not initialize. Check ECharts and chart container IDs.');
      }
    }

    attempt();
  };
})();
