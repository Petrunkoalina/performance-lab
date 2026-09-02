// Deterministic pseudo-random simulation helpers — same inputs always produce the same
// "results" within a session, so the tool feels stable rather than randomly flickering.
function hashStr(s){ let h=1779033703; for(let i=0;i<s.length;i++){ h=Math.imul(h^s.charCodeAt(i),3432918353); h=h<<13|h>>>19; } return ()=>{ h=Math.imul(h^h>>>16,2246822507); h=Math.imul(h^h>>>13,3266489909); h^=h>>>16; return (h>>>0)/4294967296; }; }

export function seededRandom(seed){ return hashStr(String(seed)); }

import { scoreContextHint, scoreAdCopy } from './heuristics.js';

export function simulateCampaignReport(campaign){
  const rand = seededRandom(campaign.id + '_' + (campaign.adGroups||[]).length);
  const days = 7;
  const budgetDaily = campaign.budgetType==='daily' ? Number(campaign.budgetAmount)||0 : (Number(campaign.budgetAmount)||0)/days;
  let totalImpr=0, totalClicks=0, totalSpend=0, totalConv=0;

  const adGroups = campaign.adGroups||[];
  if (!adGroups.length || !budgetDaily){
    return { impressions:0, clicks:0, spend:0, conversions:0, ctr:NaN, cpc:NaN, cpm:NaN, cpa:NaN, byGroup:[] };
  }

  const byGroup = adGroups.map(ag=>{
    const hintScores = (ag.contextHints||[]).map(h=>scoreContextHint(h).overall);
    const avgHint = hintScores.length ? hintScores.reduce((a,b)=>a+b,0)/hintScores.length : 30;
    const adScores = (ag.ads||[]).map(a=>scoreAdCopy(a).overall);
    const avgAd = adScores.length ? adScores.reduce((a,b)=>a+b,0)/adScores.length : 30;
    const qualityFactor = (avgHint*0.5 + avgAd*0.5)/100; // 0..1

    const bid = Number(ag.maxBid)||0;
    const recBid = campaign.objective==='CPM' ? 8 : 4;
    const bidStrength = Math.max(0.15, Math.min(1.3, bid/recBid));

    const groupBudget = budgetDaily/adGroups.length*days;
    let impressions, clicks, spend, conv;

    if (campaign.objective==='CPM'){
      const effCpm = Math.max(2, (recBid*1.6) / bidStrength) ;
      impressions = Math.round((groupBudget/effCpm)*1000 * (0.7+0.6*rand()));
      spend = groupBudget;
      const ctr = (0.4 + qualityFactor*2.2) * (0.8+0.4*rand()); // %
      clicks = Math.round(impressions*(ctr/100));
      conv = Math.round(clicks * (0.01 + qualityFactor*0.05));
    } else {
      const effCpc = Math.max(0.3, (recBid*1.1) / bidStrength) * (0.85+0.3*rand());
      clicks = Math.round(groupBudget/effCpc);
      spend = Math.round(clicks*effCpc*100)/100;
      impressions = Math.round(clicks / (0.008 + qualityFactor*0.03));
      const cvr = campaign.objective==='oCPC' ? (0.02+qualityFactor*0.09) : (0.01+qualityFactor*0.05);
      conv = Math.round(clicks*cvr);
    }

    totalImpr+=impressions; totalClicks+=clicks; totalSpend+=spend; totalConv+=conv;
    return { id:ag.id, title:ag.title, impressions, clicks, spend:Math.round(spend*100)/100, conversions:conv, qualityFactor, bidStrength };
  });

  return {
    impressions: totalImpr, clicks: totalClicks, spend: Math.round(totalSpend*100)/100, conversions: totalConv,
    ctr: totalImpr? (totalClicks/totalImpr*100) : NaN,
    cpc: totalClicks? (totalSpend/totalClicks) : NaN,
    cpm: totalImpr? (totalSpend/totalImpr*1000) : NaN,
    cpa: totalConv? (totalSpend/totalConv) : NaN,
    byGroup,
  };
}
