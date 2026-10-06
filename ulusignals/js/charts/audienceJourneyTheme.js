// js/charts/audienceJourneyTheme.js
// Central theme and asset map for the reusable Audience Journey component.
(function(){
  window.AudienceJourneyThemes = {
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
})();
