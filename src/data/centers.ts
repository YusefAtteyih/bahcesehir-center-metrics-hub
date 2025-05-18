
import { Center } from '@/types/center';

export const centers: Center[] = [
  {
    id: "betam",
    name: "Economic & Social Research Center",
    shortName: "BETAM",
    description: "BETAM produces timely, data-driven analyses of Türkiye's economy and social policy. Through peer-reviewed articles, rapid-response policy briefs and widely attended round-tables it informs government, media and the public.",
    headlineKPIs: ["annual journal articles", "policy briefs", "media citations", "stakeholder events", "external research income", "average downloads per publication"],
    kpis: [
      {
        name: "Peer-reviewed journal articles",
        value: 7,
        target: 10,
        whyItMatters: "Demonstrates scholarly quality & visibility",
        measurement: "Scopus/WoS count • Annual"
      },
      {
        name: "Policy briefs / reports",
        value: 18,
        target: 24,
        whyItMatters: "Signals policy outreach",
        measurement: "BETAM website log • Quarterly"
      },
      {
        name: "Media citations",
        value: 150,
        target: 200,
        whyItMatters: "Captures public influence",
        measurement: "Meltwater media tracking • Quarterly"
      },
      {
        name: "Stakeholder events hosted",
        value: 8,
        target: 12,
        whyItMatters: "Tracks knowledge-transfer activity",
        measurement: "Event registry • Quarterly"
      },
      {
        name: "External research funding",
        value: 3500000,
        target: 5000000,
        unit: "₺",
        whyItMatters: "Indicates competitiveness & sustainability",
        measurement: "Grants Office ledger • Annual"
      },
      {
        name: "Average downloads / publication",
        value: 1200,
        target: 1500,
        whyItMatters: "Shows uptake of research outputs",
        measurement: "Server analytics • Quarterly"
      }
    ]
  },
  {
    id: "otam",
    name: "Ottoman History Research & Application Center",
    shortName: "OTAM",
    description: "OTAM curates Ottoman archival materials, advances graduate training and brings historical scholarship to wider audiences via exhibitions and digital repositories. Activities span editing monographs, digitising sources, and hosting international symposia.",
    headlineKPIs: ["edited volumes", "journal articles", "archival items digitised", "graduate theses completed", "conferences hosted", "grant income", "public-engagement events"],
    kpis: [
      {
        name: "Edited volumes / monographs",
        value: 3,
        target: 4,
        whyItMatters: "High-impact scholarly contribution",
        measurement: "University Press records • Annual"
      },
      {
        name: "Peer-reviewed journal articles",
        value: 9,
        target: 12,
        whyItMatters: "Core research productivity",
        measurement: "Scopus/WoS • Annual"
      },
      {
        name: "Archival items digitised",
        value: 8000,
        target: 10000,
        whyItMatters: "Progress of digital-heritage mission",
        measurement: "Repository log • Quarterly"
      },
      {
        name: "Graduate theses supervised",
        value: 4,
        target: 6,
        whyItMatters: "Capacity-building for MA/PhD",
        measurement: "Grad School database • Annual"
      },
      {
        name: "Conferences / symposia",
        value: 1,
        target: 2,
        whyItMatters: "Visibility & academic exchange",
        measurement: "Event office • Quarterly"
      },
      {
        name: "External grant income",
        value: 2000000,
        target: 3000000,
        unit: "₺",
        whyItMatters: "Financial strength",
        measurement: "Grants Office • Annual"
      },
      {
        name: "Public-engagement events",
        value: 4,
        target: 6,
        whyItMatters: "Societal outreach",
        measurement: "Event office • Quarterly"
      }
    ]
  },
  {
    id: "clt",
    name: "Learning & Teaching Application & Research Center",
    shortName: "CLT",
    description: "CLT elevates teaching quality across BAU by running faculty-development workshops, launching tech-enhanced courses and generating learning-analytics insights. Research in pedagogy fuels publications and external service contracts.",
    headlineKPIs: ["workshops delivered", "satisfaction score", "unique instructors trained", "new blended/online courses", "analytics reports", "pedagogical papers", "external revenue"],
    kpis: [
      {
        name: "Workshops delivered",
        value: 22,
        target: 30,
        whyItMatters: "Scale of faculty development",
        measurement: "Registration logs • Quarterly"
      },
      {
        name: "Avg. satisfaction score",
        value: 85,
        target: 90,
        unit: "%",
        whyItMatters: "Training quality perception",
        measurement: "Post-event survey • Quarterly"
      },
      {
        name: "Unique instructors trained",
        value: 180,
        target: 250,
        whyItMatters: "Breadth of reach",
        measurement: "LMS roster • Annual"
      },
      {
        name: "Tech-enhanced courses launched",
        value: 30,
        target: 40,
        whyItMatters: "Curriculum innovation",
        measurement: "Curriculum system • Quarterly"
      },
      {
        name: "Learning-analytics reports",
        value: 8,
        target: 12,
        whyItMatters: "Data-driven support to depts.",
        measurement: "Analytics platform • Quarterly"
      }
    ]
  }
];
