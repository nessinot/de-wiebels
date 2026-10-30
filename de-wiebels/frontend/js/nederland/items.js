// Plaatsen, streken, eilanden en water van Nederland, met de zinnen voor de stem.
// Gemaakt door tools/maak-kaart.py uit open data (zie de README); niet met de hand wijzigen.
// Gebieden verwijzen naar een pad in kaart.js; plaatsen hebben een stip in kaarteenheden.

export const ITEMS = [
  {
    id: 'pv-groningen', naam: 'Groningen', noem: 'Groningen', soort: 'provincie', provincies: ['pv-groningen'], gebied: 'pv-groningen', hoofdstad: 'pl-groningen',
    zinnen: {
      waar: { id: 'nl-waar-pv-groningen', tekst: 'Waar ligt Groningen?' },
      dat: { id: 'nl-dat-pv-groningen', tekst: 'Het goede antwoord is Groningen.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-groningen', tekst: 'Wat is de hoofdstad van Groningen?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-groningen', tekst: 'Waar ligt de hoofdstad van Groningen?' },
    },
  },
  {
    id: 'pv-friesland', naam: 'Friesland', noem: 'Friesland', soort: 'provincie', provincies: ['pv-friesland'], gebied: 'pv-friesland', hoofdstad: 'pl-leeuwarden',
    zinnen: {
      waar: { id: 'nl-waar-pv-friesland', tekst: 'Waar ligt Friesland?' },
      dat: { id: 'nl-dat-pv-friesland', tekst: 'Het goede antwoord is Friesland.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-friesland', tekst: 'Wat is de hoofdstad van Friesland?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-friesland', tekst: 'Waar ligt de hoofdstad van Friesland?' },
    },
  },
  {
    id: 'pv-drenthe', naam: 'Drenthe', noem: 'Drenthe', soort: 'provincie', provincies: ['pv-drenthe'], gebied: 'pv-drenthe', hoofdstad: 'pl-assen',
    zinnen: {
      waar: { id: 'nl-waar-pv-drenthe', tekst: 'Waar ligt Drenthe?' },
      dat: { id: 'nl-dat-pv-drenthe', tekst: 'Het goede antwoord is Drenthe.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-drenthe', tekst: 'Wat is de hoofdstad van Drenthe?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-drenthe', tekst: 'Waar ligt de hoofdstad van Drenthe?' },
    },
  },
  {
    id: 'pv-overijssel', naam: 'Overijssel', noem: 'Overijssel', soort: 'provincie', provincies: ['pv-overijssel'], gebied: 'pv-overijssel', hoofdstad: 'pl-zwolle',
    zinnen: {
      waar: { id: 'nl-waar-pv-overijssel', tekst: 'Waar ligt Overijssel?' },
      dat: { id: 'nl-dat-pv-overijssel', tekst: 'Het goede antwoord is Overijssel.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-overijssel', tekst: 'Wat is de hoofdstad van Overijssel?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-overijssel', tekst: 'Waar ligt de hoofdstad van Overijssel?' },
    },
  },
  {
    id: 'pv-flevoland', naam: 'Flevoland', noem: 'Flevoland', soort: 'provincie', provincies: ['pv-flevoland'], gebied: 'pv-flevoland', hoofdstad: 'pl-lelystad',
    zinnen: {
      waar: { id: 'nl-waar-pv-flevoland', tekst: 'Waar ligt Flevoland?' },
      dat: { id: 'nl-dat-pv-flevoland', tekst: 'Het goede antwoord is Flevoland.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-flevoland', tekst: 'Wat is de hoofdstad van Flevoland?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-flevoland', tekst: 'Waar ligt de hoofdstad van Flevoland?' },
    },
  },
  {
    id: 'pv-gelderland', naam: 'Gelderland', noem: 'Gelderland', soort: 'provincie', provincies: ['pv-gelderland'], gebied: 'pv-gelderland', hoofdstad: 'pl-arnhem',
    zinnen: {
      waar: { id: 'nl-waar-pv-gelderland', tekst: 'Waar ligt Gelderland?' },
      dat: { id: 'nl-dat-pv-gelderland', tekst: 'Het goede antwoord is Gelderland.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-gelderland', tekst: 'Wat is de hoofdstad van Gelderland?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-gelderland', tekst: 'Waar ligt de hoofdstad van Gelderland?' },
    },
  },
  {
    id: 'pv-utrecht', naam: 'Utrecht', noem: 'Utrecht', soort: 'provincie', provincies: ['pv-utrecht'], gebied: 'pv-utrecht', hoofdstad: 'pl-utrecht',
    zinnen: {
      waar: { id: 'nl-waar-pv-utrecht', tekst: 'Waar ligt Utrecht?' },
      dat: { id: 'nl-dat-pv-utrecht', tekst: 'Het goede antwoord is Utrecht.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-utrecht', tekst: 'Wat is de hoofdstad van Utrecht?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-utrecht', tekst: 'Waar ligt de hoofdstad van Utrecht?' },
    },
  },
  {
    id: 'pv-noord-holland', naam: 'Noord-Holland', noem: 'Noord-Holland', soort: 'provincie', provincies: ['pv-noord-holland'], gebied: 'pv-noord-holland', hoofdstad: 'pl-haarlem',
    zinnen: {
      waar: { id: 'nl-waar-pv-noord-holland', tekst: 'Waar ligt Noord-Holland?' },
      dat: { id: 'nl-dat-pv-noord-holland', tekst: 'Het goede antwoord is Noord-Holland.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-noord-holland', tekst: 'Wat is de hoofdstad van Noord-Holland?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-noord-holland', tekst: 'Waar ligt de hoofdstad van Noord-Holland?' },
    },
  },
  {
    id: 'pv-zuid-holland', naam: 'Zuid-Holland', noem: 'Zuid-Holland', soort: 'provincie', provincies: ['pv-zuid-holland'], gebied: 'pv-zuid-holland', hoofdstad: 'pl-den-haag',
    zinnen: {
      waar: { id: 'nl-waar-pv-zuid-holland', tekst: 'Waar ligt Zuid-Holland?' },
      dat: { id: 'nl-dat-pv-zuid-holland', tekst: 'Het goede antwoord is Zuid-Holland.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-zuid-holland', tekst: 'Wat is de hoofdstad van Zuid-Holland?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-zuid-holland', tekst: 'Waar ligt de hoofdstad van Zuid-Holland?' },
    },
  },
  {
    id: 'pv-zeeland', naam: 'Zeeland', noem: 'Zeeland', soort: 'provincie', provincies: ['pv-zeeland'], gebied: 'pv-zeeland', hoofdstad: 'pl-middelburg',
    zinnen: {
      waar: { id: 'nl-waar-pv-zeeland', tekst: 'Waar ligt Zeeland?' },
      dat: { id: 'nl-dat-pv-zeeland', tekst: 'Het goede antwoord is Zeeland.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-zeeland', tekst: 'Wat is de hoofdstad van Zeeland?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-zeeland', tekst: 'Waar ligt de hoofdstad van Zeeland?' },
    },
  },
  {
    id: 'pv-noord-brabant', naam: 'Noord-Brabant', noem: 'Noord-Brabant', soort: 'provincie', provincies: ['pv-noord-brabant'], gebied: 'pv-noord-brabant', hoofdstad: 'pl-s-hertogenbosch',
    zinnen: {
      waar: { id: 'nl-waar-pv-noord-brabant', tekst: 'Waar ligt Noord-Brabant?' },
      dat: { id: 'nl-dat-pv-noord-brabant', tekst: 'Het goede antwoord is Noord-Brabant.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-noord-brabant', tekst: 'Wat is de hoofdstad van Noord-Brabant?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-noord-brabant', tekst: 'Waar ligt de hoofdstad van Noord-Brabant?' },
    },
  },
  {
    id: 'pv-limburg', naam: 'Limburg', noem: 'Limburg', soort: 'provincie', provincies: ['pv-limburg'], gebied: 'pv-limburg', hoofdstad: 'pl-maastricht',
    zinnen: {
      waar: { id: 'nl-waar-pv-limburg', tekst: 'Waar ligt Limburg?' },
      dat: { id: 'nl-dat-pv-limburg', tekst: 'Het goede antwoord is Limburg.' },
      hoofdstad: { id: 'nl-hoofdstad-pv-limburg', tekst: 'Wat is de hoofdstad van Limburg?' },
      hoofdstadWaar: { id: 'nl-hoofdstad-waar-pv-limburg', tekst: 'Waar ligt de hoofdstad van Limburg?' },
    },
  },
  {
    id: 'pl-groningen', naam: 'Groningen', noem: 'Groningen', soort: 'plaats', provincies: ['pv-groningen'], stip: [4441, 780],
    zinnen: {
      waar: { id: 'nl-waar-pl-groningen', tekst: 'Waar ligt Groningen?' },
      dat: { id: 'nl-dat-pl-groningen', tekst: 'Het goede antwoord is Groningen.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-groningen', tekst: 'Van welke provincie is Groningen de hoofdstad?' },
    },
  },
  {
    id: 'pl-hoogezand', naam: 'Hoogezand', noem: 'Hoogezand', soort: 'plaats', provincies: ['pv-groningen'], stip: [4697, 919],
    zinnen: {
      waar: { id: 'nl-waar-pl-hoogezand', tekst: 'Waar ligt Hoogezand?' },
      dat: { id: 'nl-dat-pl-hoogezand', tekst: 'Het goede antwoord is Hoogezand.' },
    },
  },
  {
    id: 'pl-veendam', naam: 'Veendam', noem: 'Veendam', soort: 'plaats', provincies: ['pv-groningen'], stip: [4851, 1030],
    zinnen: {
      waar: { id: 'nl-waar-pl-veendam', tekst: 'Waar ligt Veendam?' },
      dat: { id: 'nl-dat-pl-veendam', tekst: 'Het goede antwoord is Veendam.' },
    },
  },
  {
    id: 'st-hogeland', naam: 'Hogeland', noem: 'het Hogeland', soort: 'streek', provincies: ['pv-groningen'], gebied: 'st-hogeland',
    zinnen: {
      waar: { id: 'nl-waar-st-hogeland', tekst: 'Waar ligt het Hogeland?' },
      dat: { id: 'nl-dat-st-hogeland', tekst: 'Het goede antwoord is het Hogeland.' },
    },
  },
  {
    id: 'st-westerkwartier', naam: 'Westerkwartier', noem: 'het Westerkwartier', soort: 'streek', provincies: ['pv-groningen'], gebied: 'st-westerkwartier',
    zinnen: {
      waar: { id: 'nl-waar-st-westerkwartier', tekst: 'Waar ligt het Westerkwartier?' },
      dat: { id: 'nl-dat-st-westerkwartier', tekst: 'Het goede antwoord is het Westerkwartier.' },
    },
  },
  {
    id: 'st-oldambt', naam: 'Oldambt', noem: 'het Oldambt', soort: 'streek', provincies: ['pv-groningen'], gebied: 'st-oldambt',
    zinnen: {
      waar: { id: 'nl-waar-st-oldambt', tekst: 'Waar ligt het Oldambt?' },
      dat: { id: 'nl-dat-st-oldambt', tekst: 'Het goede antwoord is het Oldambt.' },
    },
  },
  {
    id: 'st-westerwolde', naam: 'Westerwolde', noem: 'Westerwolde', soort: 'streek', provincies: ['pv-groningen'], gebied: 'st-westerwolde',
    zinnen: {
      waar: { id: 'nl-waar-st-westerwolde', tekst: 'Waar ligt Westerwolde?' },
      dat: { id: 'nl-dat-st-westerwolde', tekst: 'Het goede antwoord is Westerwolde.' },
    },
  },
  {
    id: 'pl-leeuwarden', naam: 'Leeuwarden', noem: 'Leeuwarden', soort: 'plaats', provincies: ['pv-friesland'], stip: [3429, 837],
    zinnen: {
      waar: { id: 'nl-waar-pl-leeuwarden', tekst: 'Waar ligt Leeuwarden?' },
      dat: { id: 'nl-dat-pl-leeuwarden', tekst: 'Het goede antwoord is Leeuwarden.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-leeuwarden', tekst: 'Van welke provincie is Leeuwarden de hoofdstad?' },
    },
  },
  {
    id: 'pl-drachten', naam: 'Drachten', noem: 'Drachten', soort: 'plaats', provincies: ['pv-friesland'], stip: [3811, 1043],
    zinnen: {
      waar: { id: 'nl-waar-pl-drachten', tekst: 'Waar ligt Drachten?' },
      dat: { id: 'nl-dat-pl-drachten', tekst: 'Het goede antwoord is Drachten.' },
    },
  },
  {
    id: 'pl-sneek', naam: 'Sneek', noem: 'Sneek', soort: 'plaats', provincies: ['pv-friesland'], stip: [3242, 1217],
    zinnen: {
      waar: { id: 'nl-waar-pl-sneek', tekst: 'Waar ligt Sneek?' },
      dat: { id: 'nl-dat-pl-sneek', tekst: 'Het goede antwoord is Sneek.' },
    },
  },
  {
    id: 'pl-heerenveen', naam: 'Heerenveen', noem: 'Heerenveen', soort: 'plaats', provincies: ['pv-friesland'], stip: [3593, 1379],
    zinnen: {
      waar: { id: 'nl-waar-pl-heerenveen', tekst: 'Waar ligt Heerenveen?' },
      dat: { id: 'nl-dat-pl-heerenveen', tekst: 'Het goede antwoord is Heerenveen.' },
    },
  },
  {
    id: 'ei-vlieland', naam: 'Vlieland', noem: 'Vlieland', soort: 'eiland', provincies: ['pv-friesland'], gebied: 'ei-vlieland',
    zinnen: {
      waar: { id: 'nl-waar-ei-vlieland', tekst: 'Waar ligt Vlieland?' },
      dat: { id: 'nl-dat-ei-vlieland', tekst: 'Het goede antwoord is Vlieland.' },
    },
  },
  {
    id: 'ei-terschelling', naam: 'Terschelling', noem: 'Terschelling', soort: 'eiland', provincies: ['pv-friesland'], gebied: 'ei-terschelling',
    zinnen: {
      waar: { id: 'nl-waar-ei-terschelling', tekst: 'Waar ligt Terschelling?' },
      dat: { id: 'nl-dat-ei-terschelling', tekst: 'Het goede antwoord is Terschelling.' },
    },
  },
  {
    id: 'ei-ameland', naam: 'Ameland', noem: 'Ameland', soort: 'eiland', provincies: ['pv-friesland'], gebied: 'ei-ameland',
    zinnen: {
      waar: { id: 'nl-waar-ei-ameland', tekst: 'Waar ligt Ameland?' },
      dat: { id: 'nl-dat-ei-ameland', tekst: 'Het goede antwoord is Ameland.' },
    },
  },
  {
    id: 'ei-schiermonnikoog', naam: 'Schiermonnikoog', noem: 'Schiermonnikoog', soort: 'eiland', provincies: ['pv-friesland'], gebied: 'ei-schiermonnikoog',
    zinnen: {
      waar: { id: 'nl-waar-ei-schiermonnikoog', tekst: 'Waar ligt Schiermonnikoog?' },
      dat: { id: 'nl-dat-ei-schiermonnikoog', tekst: 'Het goede antwoord is Schiermonnikoog.' },
    },
  },
  {
    id: 'pl-assen', naam: 'Assen', noem: 'Assen', soort: 'plaats', provincies: ['pv-drenthe'], stip: [4438, 1266],
    zinnen: {
      waar: { id: 'nl-waar-pl-assen', tekst: 'Waar ligt Assen?' },
      dat: { id: 'nl-dat-pl-assen', tekst: 'Het goede antwoord is Assen.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-assen', tekst: 'Van welke provincie is Assen de hoofdstad?' },
    },
  },
  {
    id: 'pl-emmen', naam: 'Emmen', noem: 'Emmen', soort: 'plaats', provincies: ['pv-drenthe'], stip: [4919, 1768],
    zinnen: {
      waar: { id: 'nl-waar-pl-emmen', tekst: 'Waar ligt Emmen?' },
      dat: { id: 'nl-dat-pl-emmen', tekst: 'Het goede antwoord is Emmen.' },
    },
  },
  {
    id: 'pl-hoogeveen', naam: 'Hoogeveen', noem: 'Hoogeveen', soort: 'plaats', provincies: ['pv-drenthe'], stip: [4340, 1898],
    zinnen: {
      waar: { id: 'nl-waar-pl-hoogeveen', tekst: 'Waar ligt Hoogeveen?' },
      dat: { id: 'nl-dat-pl-hoogeveen', tekst: 'Het goede antwoord is Hoogeveen.' },
    },
  },
  {
    id: 'pl-meppel', naam: 'Meppel', noem: 'Meppel', soort: 'plaats', provincies: ['pv-drenthe'], stip: [3960, 1961],
    zinnen: {
      waar: { id: 'nl-waar-pl-meppel', tekst: 'Waar ligt Meppel?' },
      dat: { id: 'nl-dat-pl-meppel', tekst: 'Het goede antwoord is Meppel.' },
    },
  },
  {
    id: 'pl-enschede', naam: 'Enschede', noem: 'Enschede', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4928, 3011],
    zinnen: {
      waar: { id: 'nl-waar-pl-enschede', tekst: 'Waar ligt Enschede?' },
      dat: { id: 'nl-dat-pl-enschede', tekst: 'Het goede antwoord is Enschede.' },
    },
  },
  {
    id: 'pl-zwolle', naam: 'Zwolle', noem: 'Zwolle', soort: 'plaats', provincies: ['pv-overijssel'], stip: [3825, 2360],
    zinnen: {
      waar: { id: 'nl-waar-pl-zwolle', tekst: 'Waar ligt Zwolle?' },
      dat: { id: 'nl-dat-pl-zwolle', tekst: 'Het goede antwoord is Zwolle.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-zwolle', tekst: 'Van welke provincie is Zwolle de hoofdstad?' },
    },
  },
  {
    id: 'pl-hengelo', naam: 'Hengelo', noem: 'Hengelo', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4801, 2886],
    zinnen: {
      waar: { id: 'nl-waar-pl-hengelo', tekst: 'Waar ligt Hengelo?' },
      dat: { id: 'nl-dat-pl-hengelo', tekst: 'Het goede antwoord is Hengelo.' },
    },
  },
  {
    id: 'pl-deventer', naam: 'Deventer', noem: 'Deventer', soort: 'plaats', provincies: ['pv-overijssel'], stip: [3949, 2926],
    zinnen: {
      waar: { id: 'nl-waar-pl-deventer', tekst: 'Waar ligt Deventer?' },
      dat: { id: 'nl-dat-pl-deventer', tekst: 'Het goede antwoord is Deventer.' },
    },
  },
  {
    id: 'pl-almelo', naam: 'Almelo', noem: 'Almelo', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4606, 2705],
    zinnen: {
      waar: { id: 'nl-waar-pl-almelo', tekst: 'Waar ligt Almelo?' },
      dat: { id: 'nl-dat-pl-almelo', tekst: 'Het goede antwoord is Almelo.' },
    },
  },
  {
    id: 'pl-kampen', naam: 'Kampen', noem: 'Kampen', soort: 'plaats', provincies: ['pv-overijssel'], stip: [3579, 2283],
    zinnen: {
      waar: { id: 'nl-waar-pl-kampen', tekst: 'Waar ligt Kampen?' },
      dat: { id: 'nl-dat-pl-kampen', tekst: 'Het goede antwoord is Kampen.' },
    },
  },
  {
    id: 'pl-oldenzaal', naam: 'Oldenzaal', noem: 'Oldenzaal', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4960, 2786],
    zinnen: {
      waar: { id: 'nl-waar-pl-oldenzaal', tekst: 'Waar ligt Oldenzaal?' },
      dat: { id: 'nl-dat-pl-oldenzaal', tekst: 'Het goede antwoord is Oldenzaal.' },
    },
  },
  {
    id: 'pl-rijssen', naam: 'Rijssen', noem: 'Rijssen', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4402, 2819],
    zinnen: {
      waar: { id: 'nl-waar-pl-rijssen', tekst: 'Waar ligt Rijssen?' },
      dat: { id: 'nl-dat-pl-rijssen', tekst: 'Het goede antwoord is Rijssen.' },
    },
  },
  {
    id: 'pl-nijverdal', naam: 'Nijverdal', noem: 'Nijverdal', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4348, 2688],
    zinnen: {
      waar: { id: 'nl-waar-pl-nijverdal', tekst: 'Waar ligt Nijverdal?' },
      dat: { id: 'nl-dat-pl-nijverdal', tekst: 'Het goede antwoord is Nijverdal.' },
    },
  },
  {
    id: 'pl-borne', naam: 'Borne', noem: 'Borne', soort: 'plaats', provincies: ['pv-overijssel'], stip: [4736, 2824],
    zinnen: {
      waar: { id: 'nl-waar-pl-borne', tekst: 'Waar ligt Borne?' },
      dat: { id: 'nl-dat-pl-borne', tekst: 'Het goede antwoord is Borne.' },
    },
  },
  {
    id: 'st-twente', naam: 'Twente', noem: 'Twente', soort: 'streek', provincies: ['pv-overijssel'], gebied: 'st-twente',
    zinnen: {
      waar: { id: 'nl-waar-st-twente', tekst: 'Waar ligt Twente?' },
      dat: { id: 'nl-dat-st-twente', tekst: 'Het goede antwoord is Twente.' },
    },
  },
  {
    id: 'st-salland', naam: 'Salland', noem: 'Salland', soort: 'streek', provincies: ['pv-overijssel'], gebied: 'st-salland',
    zinnen: {
      waar: { id: 'nl-waar-st-salland', tekst: 'Waar ligt Salland?' },
      dat: { id: 'nl-dat-st-salland', tekst: 'Het goede antwoord is Salland.' },
    },
  },
  {
    id: 'pl-almere', naam: 'Almere', noem: 'Almere', soort: 'plaats', provincies: ['pv-flevoland'], stip: [2661, 2681],
    zinnen: {
      waar: { id: 'nl-waar-pl-almere', tekst: 'Waar ligt Almere?' },
      dat: { id: 'nl-dat-pl-almere', tekst: 'Het goede antwoord is Almere.' },
    },
  },
  {
    id: 'pl-lelystad', naam: 'Lelystad', noem: 'Lelystad', soort: 'plaats', provincies: ['pv-flevoland'], stip: [2986, 2381],
    zinnen: {
      waar: { id: 'nl-waar-pl-lelystad', tekst: 'Waar ligt Lelystad?' },
      dat: { id: 'nl-dat-pl-lelystad', tekst: 'Het goede antwoord is Lelystad.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-lelystad', tekst: 'Van welke provincie is Lelystad de hoofdstad?' },
    },
  },
  {
    id: 'pl-dronten', naam: 'Dronten', noem: 'Dronten', soort: 'plaats', provincies: ['pv-flevoland'], stip: [3308, 2341],
    zinnen: {
      waar: { id: 'nl-waar-pl-dronten', tekst: 'Waar ligt Dronten?' },
      dat: { id: 'nl-dat-pl-dronten', tekst: 'Het goede antwoord is Dronten.' },
    },
  },
  {
    id: 'pl-emmeloord', naam: 'Emmeloord', noem: 'Emmeloord', soort: 'plaats', provincies: ['pv-flevoland'], stip: [3350, 1922],
    zinnen: {
      waar: { id: 'nl-waar-pl-emmeloord', tekst: 'Waar ligt Emmeloord?' },
      dat: { id: 'nl-dat-pl-emmeloord', tekst: 'Het goede antwoord is Emmeloord.' },
    },
  },
  {
    id: 'pl-zeewolde', naam: 'Zeewolde', noem: 'Zeewolde', soort: 'plaats', provincies: ['pv-flevoland'], stip: [3064, 2766],
    zinnen: {
      waar: { id: 'nl-waar-pl-zeewolde', tekst: 'Waar ligt Zeewolde?' },
      dat: { id: 'nl-dat-pl-zeewolde', tekst: 'Het goede antwoord is Zeewolde.' },
    },
  },
  {
    id: 'pl-urk', naam: 'Urk', noem: 'Urk', soort: 'plaats', provincies: ['pv-flevoland'], stip: [3177, 2032],
    zinnen: {
      waar: { id: 'nl-waar-pl-urk', tekst: 'Waar ligt Urk?' },
      dat: { id: 'nl-dat-pl-urk', tekst: 'Het goede antwoord is Urk.' },
    },
  },
  {
    id: 'st-noordoostpolder', naam: 'Noordoostpolder', noem: 'de Noordoostpolder', soort: 'streek', provincies: ['pv-flevoland'], gebied: 'st-noordoostpolder',
    zinnen: {
      waar: { id: 'nl-waar-st-noordoostpolder', tekst: 'Waar ligt de Noordoostpolder?' },
      dat: { id: 'nl-dat-st-noordoostpolder', tekst: 'Het goede antwoord is de Noordoostpolder.' },
    },
  },
  {
    id: 'ei-flevopolder', naam: 'Flevopolder', noem: 'de Flevopolder', soort: 'eiland', provincies: ['pv-flevoland'], gebied: 'ei-flevopolder',
    zinnen: {
      waar: { id: 'nl-waar-ei-flevopolder', tekst: 'Waar ligt de Flevopolder?' },
      dat: { id: 'nl-dat-ei-flevopolder', tekst: 'Het goede antwoord is de Flevopolder.' },
    },
  },
  {
    id: 'pl-nijmegen', naam: 'Nijmegen', noem: 'Nijmegen', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3492, 3885],
    zinnen: {
      waar: { id: 'nl-waar-pl-nijmegen', tekst: 'Waar ligt Nijmegen?' },
      dat: { id: 'nl-dat-pl-nijmegen', tekst: 'Het goede antwoord is Nijmegen.' },
    },
  },
  {
    id: 'pl-arnhem', naam: 'Arnhem', noem: 'Arnhem', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3578, 3569],
    zinnen: {
      waar: { id: 'nl-waar-pl-arnhem', tekst: 'Waar ligt Arnhem?' },
      dat: { id: 'nl-dat-pl-arnhem', tekst: 'Het goede antwoord is Arnhem.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-arnhem', tekst: 'Van welke provincie is Arnhem de hoofdstad?' },
    },
  },
  {
    id: 'pl-apeldoorn', naam: 'Apeldoorn', noem: 'Apeldoorn', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3675, 3039],
    zinnen: {
      waar: { id: 'nl-waar-pl-apeldoorn', tekst: 'Waar ligt Apeldoorn?' },
      dat: { id: 'nl-dat-pl-apeldoorn', tekst: 'Het goede antwoord is Apeldoorn.' },
    },
  },
  {
    id: 'pl-ede', naam: 'Ede', noem: 'Ede', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3236, 3431],
    zinnen: {
      waar: { id: 'nl-waar-pl-ede', tekst: 'Waar ligt Ede?' },
      dat: { id: 'nl-dat-pl-ede', tekst: 'Het goede antwoord is Ede.' },
    },
  },
  {
    id: 'pl-harderwijk', naam: 'Harderwijk', noem: 'Harderwijk', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3187, 2757],
    zinnen: {
      waar: { id: 'nl-waar-pl-harderwijk', tekst: 'Waar ligt Harderwijk?' },
      dat: { id: 'nl-dat-pl-harderwijk', tekst: 'Het goede antwoord is Harderwijk.' },
    },
  },
  {
    id: 'pl-doetinchem', naam: 'Doetinchem', noem: 'Doetinchem', soort: 'plaats', provincies: ['pv-gelderland'], stip: [4103, 3582],
    zinnen: {
      waar: { id: 'nl-waar-pl-doetinchem', tekst: 'Waar ligt Doetinchem?' },
      dat: { id: 'nl-dat-pl-doetinchem', tekst: 'Het goede antwoord is Doetinchem.' },
    },
  },
  {
    id: 'pl-tiel', naam: 'Tiel', noem: 'Tiel', soort: 'plaats', provincies: ['pv-gelderland'], stip: [2915, 3766],
    zinnen: {
      waar: { id: 'nl-waar-pl-tiel', tekst: 'Waar ligt Tiel?' },
      dat: { id: 'nl-dat-pl-tiel', tekst: 'Het goede antwoord is Tiel.' },
    },
  },
  {
    id: 'pl-wageningen', naam: 'Wageningen', noem: 'Wageningen', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3248, 3567],
    zinnen: {
      waar: { id: 'nl-waar-pl-wageningen', tekst: 'Waar ligt Wageningen?' },
      dat: { id: 'nl-dat-pl-wageningen', tekst: 'Het goede antwoord is Wageningen.' },
    },
  },
  {
    id: 'pl-wijchen', naam: 'Wijchen', noem: 'Wijchen', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3339, 3938],
    zinnen: {
      waar: { id: 'nl-waar-pl-wijchen', tekst: 'Waar ligt Wijchen?' },
      dat: { id: 'nl-dat-pl-wijchen', tekst: 'Het goede antwoord is Wijchen.' },
    },
  },
  {
    id: 'pl-zutphen', naam: 'Zutphen', noem: 'Zutphen', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3999, 3202],
    zinnen: {
      waar: { id: 'nl-waar-pl-zutphen', tekst: 'Waar ligt Zutphen?' },
      dat: { id: 'nl-dat-pl-zutphen', tekst: 'Het goede antwoord is Zutphen.' },
    },
  },
  {
    id: 'pl-barneveld', naam: 'Barneveld', noem: 'Barneveld', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3140, 3208],
    zinnen: {
      waar: { id: 'nl-waar-pl-barneveld', tekst: 'Waar ligt Barneveld?' },
      dat: { id: 'nl-dat-pl-barneveld', tekst: 'Het goede antwoord is Barneveld.' },
    },
  },
  {
    id: 'pl-culemborg', naam: 'Culemborg', noem: 'Culemborg', soort: 'plaats', provincies: ['pv-gelderland'], stip: [2645, 3617],
    zinnen: {
      waar: { id: 'nl-waar-pl-culemborg', tekst: 'Waar ligt Culemborg?' },
      dat: { id: 'nl-dat-pl-culemborg', tekst: 'Het goede antwoord is Culemborg.' },
    },
  },
  {
    id: 'pl-nijkerk', naam: 'Nijkerk', noem: 'Nijkerk', soort: 'plaats', provincies: ['pv-gelderland'], stip: [2994, 3022],
    zinnen: {
      waar: { id: 'nl-waar-pl-nijkerk', tekst: 'Waar ligt Nijkerk?' },
      dat: { id: 'nl-dat-pl-nijkerk', tekst: 'Het goede antwoord is Nijkerk.' },
    },
  },
  {
    id: 'pl-zevenaar', naam: 'Zevenaar', noem: 'Zevenaar', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3813, 3660],
    zinnen: {
      waar: { id: 'nl-waar-pl-zevenaar', tekst: 'Waar ligt Zevenaar?' },
      dat: { id: 'nl-dat-pl-zevenaar', tekst: 'Het goede antwoord is Zevenaar.' },
    },
  },
  {
    id: 'pl-ermelo', naam: 'Ermelo', noem: 'Ermelo', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3183, 2847],
    zinnen: {
      waar: { id: 'nl-waar-pl-ermelo', tekst: 'Waar ligt Ermelo?' },
      dat: { id: 'nl-dat-pl-ermelo', tekst: 'Het goede antwoord is Ermelo.' },
    },
  },
  {
    id: 'pl-winterswijk', naam: 'Winterswijk', noem: 'Winterswijk', soort: 'plaats', provincies: ['pv-gelderland'], stip: [4702, 3553],
    zinnen: {
      waar: { id: 'nl-waar-pl-winterswijk', tekst: 'Waar ligt Winterswijk?' },
      dat: { id: 'nl-dat-pl-winterswijk', tekst: 'Het goede antwoord is Winterswijk.' },
    },
  },
  {
    id: 'pl-elst', naam: 'Elst', noem: 'Elst', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3502, 3688],
    zinnen: {
      waar: { id: 'nl-waar-pl-elst', tekst: 'Waar ligt Elst?' },
      dat: { id: 'nl-dat-pl-elst', tekst: 'Het goede antwoord is Elst.' },
    },
  },
  {
    id: 'pl-duiven', naam: 'Duiven', noem: 'Duiven', soort: 'plaats', provincies: ['pv-gelderland'], stip: [3731, 3626],
    zinnen: {
      waar: { id: 'nl-waar-pl-duiven', tekst: 'Waar ligt Duiven?' },
      dat: { id: 'nl-dat-pl-duiven', tekst: 'Het goede antwoord is Duiven.' },
    },
  },
  {
    id: 'st-veluwe', naam: 'Veluwe', noem: 'de Veluwe', soort: 'streek', provincies: ['pv-gelderland'], gebied: 'st-veluwe',
    zinnen: {
      waar: { id: 'nl-waar-st-veluwe', tekst: 'Waar ligt de Veluwe?' },
      dat: { id: 'nl-dat-st-veluwe', tekst: 'Het goede antwoord is de Veluwe.' },
    },
  },
  {
    id: 'st-achterhoek', naam: 'Achterhoek', noem: 'de Achterhoek', soort: 'streek', provincies: ['pv-gelderland'], gebied: 'st-achterhoek',
    zinnen: {
      waar: { id: 'nl-waar-st-achterhoek', tekst: 'Waar ligt de Achterhoek?' },
      dat: { id: 'nl-dat-st-achterhoek', tekst: 'Het goede antwoord is de Achterhoek.' },
    },
  },
  {
    id: 'st-betuwe', naam: 'Betuwe', noem: 'de Betuwe', soort: 'streek', provincies: ['pv-gelderland'], gebied: 'st-betuwe',
    zinnen: {
      waar: { id: 'nl-waar-st-betuwe', tekst: 'Waar ligt de Betuwe?' },
      dat: { id: 'nl-dat-st-betuwe', tekst: 'Het goede antwoord is de Betuwe.' },
    },
  },
  {
    id: 'st-bommelerwaard', naam: 'Bommelerwaard', noem: 'de Bommelerwaard', soort: 'streek', provincies: ['pv-gelderland'], gebied: 'st-bommelerwaard',
    zinnen: {
      waar: { id: 'nl-waar-st-bommelerwaard', tekst: 'Waar ligt de Bommelerwaard?' },
      dat: { id: 'nl-dat-st-bommelerwaard', tekst: 'Het goede antwoord is de Bommelerwaard.' },
    },
  },
  {
    id: 'st-maas-en-waal', naam: 'Land van Maas en Waal', noem: 'het Land van Maas en Waal', soort: 'streek', provincies: ['pv-gelderland'], gebied: 'st-maas-en-waal',
    zinnen: {
      waar: { id: 'nl-waar-st-maas-en-waal', tekst: 'Waar ligt het Land van Maas en Waal?' },
      dat: { id: 'nl-dat-st-maas-en-waal', tekst: 'Het goede antwoord is het Land van Maas en Waal.' },
    },
  },
  {
    id: 'pl-utrecht', naam: 'Utrecht', noem: 'Utrecht', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2482, 3302],
    zinnen: {
      waar: { id: 'nl-waar-pl-utrecht', tekst: 'Waar ligt Utrecht?' },
      dat: { id: 'nl-dat-pl-utrecht', tekst: 'Het goede antwoord is Utrecht.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-utrecht', tekst: 'Van welke provincie is Utrecht de hoofdstad?' },
    },
  },
  {
    id: 'pl-amersfoort', naam: 'Amersfoort', noem: 'Amersfoort', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2878, 3127],
    zinnen: {
      waar: { id: 'nl-waar-pl-amersfoort', tekst: 'Waar ligt Amersfoort?' },
      dat: { id: 'nl-dat-pl-amersfoort', tekst: 'Het goede antwoord is Amersfoort.' },
    },
  },
  {
    id: 'pl-veenendaal', naam: 'Veenendaal', noem: 'Veenendaal', soort: 'plaats', provincies: ['pv-utrecht'], stip: [3097, 3457],
    zinnen: {
      waar: { id: 'nl-waar-pl-veenendaal', tekst: 'Waar ligt Veenendaal?' },
      dat: { id: 'nl-dat-pl-veenendaal', tekst: 'Het goede antwoord is Veenendaal.' },
    },
  },
  {
    id: 'pl-nieuwegein', naam: 'Nieuwegein', noem: 'Nieuwegein', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2452, 3439],
    zinnen: {
      waar: { id: 'nl-waar-pl-nieuwegein', tekst: 'Waar ligt Nieuwegein?' },
      dat: { id: 'nl-dat-pl-nieuwegein', tekst: 'Het goede antwoord is Nieuwegein.' },
    },
  },
  {
    id: 'pl-zeist', naam: 'Zeist', noem: 'Zeist', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2663, 3311],
    zinnen: {
      waar: { id: 'nl-waar-pl-zeist', tekst: 'Waar ligt Zeist?' },
      dat: { id: 'nl-dat-pl-zeist', tekst: 'Het goede antwoord is Zeist.' },
    },
  },
  {
    id: 'pl-houten', naam: 'Houten', noem: 'Houten', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2573, 3452],
    zinnen: {
      waar: { id: 'nl-waar-pl-houten', tekst: 'Waar ligt Houten?' },
      dat: { id: 'nl-dat-pl-houten', tekst: 'Het goede antwoord is Houten.' },
    },
  },
  {
    id: 'pl-maarssen', naam: 'Maarssen', noem: 'Maarssen', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2382, 3206],
    zinnen: {
      waar: { id: 'nl-waar-pl-maarssen', tekst: 'Waar ligt Maarssen?' },
      dat: { id: 'nl-dat-pl-maarssen', tekst: 'Het goede antwoord is Maarssen.' },
    },
  },
  {
    id: 'pl-woerden', naam: 'Woerden', noem: 'Woerden', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2178, 3320],
    zinnen: {
      waar: { id: 'nl-waar-pl-woerden', tekst: 'Waar ligt Woerden?' },
      dat: { id: 'nl-dat-pl-woerden', tekst: 'Het goede antwoord is Woerden.' },
    },
  },
  {
    id: 'pl-soest', naam: 'Soest', noem: 'Soest', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2739, 3120],
    zinnen: {
      waar: { id: 'nl-waar-pl-soest', tekst: 'Waar ligt Soest?' },
      dat: { id: 'nl-dat-pl-soest', tekst: 'Het goede antwoord is Soest.' },
    },
  },
  {
    id: 'pl-ijsselstein', naam: 'IJsselstein', noem: 'IJsselstein', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2395, 3464],
    zinnen: {
      waar: { id: 'nl-waar-pl-ijsselstein', tekst: 'Waar ligt IJsselstein?' },
      dat: { id: 'nl-dat-pl-ijsselstein', tekst: 'Het goede antwoord is IJsselstein.' },
    },
  },
  {
    id: 'pl-leusden', naam: 'Leusden', noem: 'Leusden', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2924, 3219],
    zinnen: {
      waar: { id: 'nl-waar-pl-leusden', tekst: 'Waar ligt Leusden?' },
      dat: { id: 'nl-dat-pl-leusden', tekst: 'Het goede antwoord is Leusden.' },
    },
  },
  {
    id: 'pl-baarn', naam: 'Baarn', noem: 'Baarn', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2736, 3038],
    zinnen: {
      waar: { id: 'nl-waar-pl-baarn', tekst: 'Waar ligt Baarn?' },
      dat: { id: 'nl-dat-pl-baarn', tekst: 'Het goede antwoord is Baarn.' },
    },
  },
  {
    id: 'pl-bilthoven', naam: 'Bilthoven', noem: 'Bilthoven', soort: 'plaats', provincies: ['pv-utrecht'], stip: [2610, 3225],
    zinnen: {
      waar: { id: 'nl-waar-pl-bilthoven', tekst: 'Waar ligt Bilthoven?' },
      dat: { id: 'nl-dat-pl-bilthoven', tekst: 'Het goede antwoord is Bilthoven.' },
    },
  },
  {
    id: 'st-vijfheerenlanden', naam: 'Vijfheerenlanden', noem: 'de Vijfheerenlanden', soort: 'streek', provincies: ['pv-utrecht'], gebied: 'st-vijfheerenlanden',
    zinnen: {
      waar: { id: 'nl-waar-st-vijfheerenlanden', tekst: 'Waar ligt de Vijfheerenlanden?' },
      dat: { id: 'nl-dat-st-vijfheerenlanden', tekst: 'Het goede antwoord is de Vijfheerenlanden.' },
    },
  },
  {
    id: 'pl-amsterdam', naam: 'Amsterdam', noem: 'Amsterdam', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2193, 2704],
    zinnen: {
      waar: { id: 'nl-waar-pl-amsterdam', tekst: 'Waar ligt Amsterdam?' },
      dat: { id: 'nl-dat-pl-amsterdam', tekst: 'Het goede antwoord is Amsterdam.' },
    },
  },
  {
    id: 'pl-haarlem', naam: 'Haarlem', noem: 'Haarlem', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1854, 2654],
    zinnen: {
      waar: { id: 'nl-waar-pl-haarlem', tekst: 'Waar ligt Haarlem?' },
      dat: { id: 'nl-dat-pl-haarlem', tekst: 'Het goede antwoord is Haarlem.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-haarlem', tekst: 'Van welke provincie is Haarlem de hoofdstad?' },
    },
  },
  {
    id: 'pl-alkmaar', naam: 'Alkmaar', noem: 'Alkmaar', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2008, 2080],
    zinnen: {
      waar: { id: 'nl-waar-pl-alkmaar', tekst: 'Waar ligt Alkmaar?' },
      dat: { id: 'nl-dat-pl-alkmaar', tekst: 'Het goede antwoord is Alkmaar.' },
    },
  },
  {
    id: 'pl-hilversum', naam: 'Hilversum', noem: 'Hilversum', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2577, 3008],
    zinnen: {
      waar: { id: 'nl-waar-pl-hilversum', tekst: 'Waar ligt Hilversum?' },
      dat: { id: 'nl-dat-pl-hilversum', tekst: 'Het goede antwoord is Hilversum.' },
    },
  },
  {
    id: 'pl-amstelveen', naam: 'Amstelveen', noem: 'Amstelveen', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2144, 2848],
    zinnen: {
      waar: { id: 'nl-waar-pl-amstelveen', tekst: 'Waar ligt Amstelveen?' },
      dat: { id: 'nl-dat-pl-amstelveen', tekst: 'Het goede antwoord is Amstelveen.' },
    },
  },
  {
    id: 'pl-purmerend', naam: 'Purmerend', noem: 'Purmerend', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2289, 2389],
    zinnen: {
      waar: { id: 'nl-waar-pl-purmerend', tekst: 'Waar ligt Purmerend?' },
      dat: { id: 'nl-dat-pl-purmerend', tekst: 'Het goede antwoord is Purmerend.' },
    },
  },
  {
    id: 'pl-zaandam', naam: 'Zaandam', noem: 'Zaandam', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2108, 2519],
    zinnen: {
      waar: { id: 'nl-waar-pl-zaandam', tekst: 'Waar ligt Zaandam?' },
      dat: { id: 'nl-dat-pl-zaandam', tekst: 'Het goede antwoord is Zaandam.' },
    },
  },
  {
    id: 'pl-hoofddorp', naam: 'Hoofddorp', noem: 'Hoofddorp', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1886, 2825],
    zinnen: {
      waar: { id: 'nl-waar-pl-hoofddorp', tekst: 'Waar ligt Hoofddorp?' },
      dat: { id: 'nl-dat-pl-hoofddorp', tekst: 'Het goede antwoord is Hoofddorp.' },
    },
  },
  {
    id: 'pl-hoorn', naam: 'Hoorn', noem: 'Hoorn', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2439, 2065],
    zinnen: {
      waar: { id: 'nl-waar-pl-hoorn', tekst: 'Waar ligt Hoorn?' },
      dat: { id: 'nl-dat-pl-hoorn', tekst: 'Het goede antwoord is Hoorn.' },
    },
  },
  {
    id: 'pl-heerhugowaard', naam: 'Heerhugowaard', noem: 'Heerhugowaard', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2117, 2038],
    zinnen: {
      waar: { id: 'nl-waar-pl-heerhugowaard', tekst: 'Waar ligt Heerhugowaard?' },
      dat: { id: 'nl-dat-pl-heerhugowaard', tekst: 'Het goede antwoord is Heerhugowaard.' },
    },
  },
  {
    id: 'pl-huizen', naam: 'Huizen', noem: 'Huizen', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2683, 2850],
    zinnen: {
      waar: { id: 'nl-waar-pl-huizen', tekst: 'Waar ligt Huizen?' },
      dat: { id: 'nl-dat-pl-huizen', tekst: 'Het goede antwoord is Huizen.' },
    },
  },
  {
    id: 'pl-den-helder', naam: 'Den Helder', noem: 'Den Helder', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2023, 1399],
    zinnen: {
      waar: { id: 'nl-waar-pl-den-helder', tekst: 'Waar ligt Den Helder?' },
      dat: { id: 'nl-dat-pl-den-helder', tekst: 'Het goede antwoord is Den Helder.' },
    },
  },
  {
    id: 'pl-beverwijk', naam: 'Beverwijk', noem: 'Beverwijk', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1885, 2416],
    zinnen: {
      waar: { id: 'nl-waar-pl-beverwijk', tekst: 'Waar ligt Beverwijk?' },
      dat: { id: 'nl-dat-pl-beverwijk', tekst: 'Het goede antwoord is Beverwijk.' },
    },
  },
  {
    id: 'pl-heemskerk', naam: 'Heemskerk', noem: 'Heemskerk', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1904, 2378],
    zinnen: {
      waar: { id: 'nl-waar-pl-heemskerk', tekst: 'Waar ligt Heemskerk?' },
      dat: { id: 'nl-dat-pl-heemskerk', tekst: 'Het goede antwoord is Heemskerk.' },
    },
  },
  {
    id: 'pl-bussum', naam: 'Bussum', noem: 'Bussum', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2573, 2904],
    zinnen: {
      waar: { id: 'nl-waar-pl-bussum', tekst: 'Waar ligt Bussum?' },
      dat: { id: 'nl-dat-pl-bussum', tekst: 'Het goede antwoord is Bussum.' },
    },
  },
  {
    id: 'pl-diemen', naam: 'Diemen', noem: 'Diemen', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2293, 2754],
    zinnen: {
      waar: { id: 'nl-waar-pl-diemen', tekst: 'Waar ligt Diemen?' },
      dat: { id: 'nl-dat-pl-diemen', tekst: 'Het goede antwoord is Diemen.' },
    },
  },
  {
    id: 'pl-nieuw-vennep', naam: 'Nieuw-Vennep', noem: 'Nieuw-Vennep', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1825, 2904],
    zinnen: {
      waar: { id: 'nl-waar-pl-nieuw-vennep', tekst: 'Waar ligt Nieuw-Vennep?' },
      dat: { id: 'nl-dat-pl-nieuw-vennep', tekst: 'Het goede antwoord is Nieuw-Vennep.' },
    },
  },
  {
    id: 'pl-ijmuiden', naam: 'IJmuiden', noem: 'IJmuiden', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1816, 2486],
    zinnen: {
      waar: { id: 'nl-waar-pl-ijmuiden', tekst: 'Waar ligt IJmuiden?' },
      dat: { id: 'nl-dat-pl-ijmuiden', tekst: 'Het goede antwoord is IJmuiden.' },
    },
  },
  {
    id: 'pl-heemstede', naam: 'Heemstede', noem: 'Heemstede', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1823, 2727],
    zinnen: {
      waar: { id: 'nl-waar-pl-heemstede', tekst: 'Waar ligt Heemstede?' },
      dat: { id: 'nl-dat-pl-heemstede', tekst: 'Het goede antwoord is Heemstede.' },
    },
  },
  {
    id: 'pl-uithoorn', naam: 'Uithoorn', noem: 'Uithoorn', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2096, 2967],
    zinnen: {
      waar: { id: 'nl-waar-pl-uithoorn', tekst: 'Waar ligt Uithoorn?' },
      dat: { id: 'nl-dat-pl-uithoorn', tekst: 'Het goede antwoord is Uithoorn.' },
    },
  },
  {
    id: 'pl-assendelft', naam: 'Assendelft', noem: 'Assendelft', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1998, 2434],
    zinnen: {
      waar: { id: 'nl-waar-pl-assendelft', tekst: 'Waar ligt Assendelft?' },
      dat: { id: 'nl-dat-pl-assendelft', tekst: 'Het goede antwoord is Assendelft.' },
    },
  },
  {
    id: 'pl-heiloo', naam: 'Heiloo', noem: 'Heiloo', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1940, 2174],
    zinnen: {
      waar: { id: 'nl-waar-pl-heiloo', tekst: 'Waar ligt Heiloo?' },
      dat: { id: 'nl-dat-pl-heiloo', tekst: 'Het goede antwoord is Heiloo.' },
    },
  },
  {
    id: 'pl-castricum', naam: 'Castricum', noem: 'Castricum', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [1897, 2279],
    zinnen: {
      waar: { id: 'nl-waar-pl-castricum', tekst: 'Waar ligt Castricum?' },
      dat: { id: 'nl-dat-pl-castricum', tekst: 'Het goede antwoord is Castricum.' },
    },
  },
  {
    id: 'pl-volendam', naam: 'Volendam', noem: 'Volendam', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2428, 2396],
    zinnen: {
      waar: { id: 'nl-waar-pl-volendam', tekst: 'Waar ligt Volendam?' },
      dat: { id: 'nl-dat-pl-volendam', tekst: 'Het goede antwoord is Volendam.' },
    },
  },
  {
    id: 'pl-weesp', naam: 'Weesp', noem: 'Weesp', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2392, 2821],
    zinnen: {
      waar: { id: 'nl-waar-pl-weesp', tekst: 'Waar ligt Weesp?' },
      dat: { id: 'nl-dat-pl-weesp', tekst: 'Het goede antwoord is Weesp.' },
    },
  },
  {
    id: 'pl-aalsmeer', naam: 'Aalsmeer', noem: 'Aalsmeer', soort: 'plaats', provincies: ['pv-noord-holland'], stip: [2039, 2905],
    zinnen: {
      waar: { id: 'nl-waar-pl-aalsmeer', tekst: 'Waar ligt Aalsmeer?' },
      dat: { id: 'nl-dat-pl-aalsmeer', tekst: 'Het goede antwoord is Aalsmeer.' },
    },
  },
  {
    id: 'st-kop-van-noord-holland', naam: 'Kop van Noord-Holland', noem: 'de Kop van Noord-Holland', soort: 'streek', provincies: ['pv-noord-holland'], gebied: 'st-kop-van-noord-holland',
    zinnen: {
      waar: { id: 'nl-waar-st-kop-van-noord-holland', tekst: 'Waar ligt de Kop van Noord-Holland?' },
      dat: { id: 'nl-dat-st-kop-van-noord-holland', tekst: 'Het goede antwoord is de Kop van Noord-Holland.' },
    },
  },
  {
    id: 'st-west-friesland', naam: 'West-Friesland', noem: 'West-Friesland', soort: 'streek', provincies: ['pv-noord-holland'], gebied: 'st-west-friesland',
    zinnen: {
      waar: { id: 'nl-waar-st-west-friesland', tekst: 'Waar ligt West-Friesland?' },
      dat: { id: 'nl-dat-st-west-friesland', tekst: 'Het goede antwoord is West-Friesland.' },
    },
  },
  {
    id: 'st-zaanstreek', naam: 'Zaanstreek', noem: 'de Zaanstreek', soort: 'streek', provincies: ['pv-noord-holland'], gebied: 'st-zaanstreek',
    zinnen: {
      waar: { id: 'nl-waar-st-zaanstreek', tekst: 'Waar ligt de Zaanstreek?' },
      dat: { id: 'nl-dat-st-zaanstreek', tekst: 'Het goede antwoord is de Zaanstreek.' },
    },
  },
  {
    id: 'st-kennemerland', naam: 'Kennemerland', noem: 'Kennemerland', soort: 'streek', provincies: ['pv-noord-holland'], gebied: 'st-kennemerland',
    zinnen: {
      waar: { id: 'nl-waar-st-kennemerland', tekst: 'Waar ligt Kennemerland?' },
      dat: { id: 'nl-dat-st-kennemerland', tekst: 'Het goede antwoord is Kennemerland.' },
    },
  },
  {
    id: 'st-haarlemmermeer', naam: 'Haarlemmermeer', noem: 'de Haarlemmermeer', soort: 'streek', provincies: ['pv-noord-holland'], gebied: 'st-haarlemmermeer',
    zinnen: {
      waar: { id: 'nl-waar-st-haarlemmermeer', tekst: 'Waar ligt de Haarlemmermeer?' },
      dat: { id: 'nl-dat-st-haarlemmermeer', tekst: 'Het goede antwoord is de Haarlemmermeer.' },
    },
  },
  {
    id: 'st-gooi', naam: 'Het Gooi', noem: 'het Gooi', soort: 'streek', provincies: ['pv-noord-holland'], gebied: 'st-gooi',
    zinnen: {
      waar: { id: 'nl-waar-st-gooi', tekst: 'Waar ligt het Gooi?' },
      dat: { id: 'nl-dat-st-gooi', tekst: 'Het goede antwoord is het Gooi.' },
    },
  },
  {
    id: 'ei-texel', naam: 'Texel', noem: 'Texel', soort: 'eiland', provincies: ['pv-noord-holland'], gebied: 'ei-texel',
    zinnen: {
      waar: { id: 'nl-waar-ei-texel', tekst: 'Waar ligt Texel?' },
      dat: { id: 'nl-dat-ei-texel', tekst: 'Het goede antwoord is Texel.' },
    },
  },
  {
    id: 'pl-rotterdam', naam: 'Rotterdam', noem: 'Rotterdam', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1645, 3683],
    zinnen: {
      waar: { id: 'nl-waar-pl-rotterdam', tekst: 'Waar ligt Rotterdam?' },
      dat: { id: 'nl-dat-pl-rotterdam', tekst: 'Het goede antwoord is Rotterdam.' },
    },
  },
  {
    id: 'pl-den-haag', naam: 'Den Haag', noem: 'Den Haag', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1374, 3350],
    zinnen: {
      waar: { id: 'nl-waar-pl-den-haag', tekst: 'Waar ligt Den Haag?' },
      dat: { id: 'nl-dat-pl-den-haag', tekst: 'Het goede antwoord is Den Haag.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-den-haag', tekst: 'Van welke provincie is Den Haag de hoofdstad?' },
    },
  },
  {
    id: 'pl-leiden', naam: 'Leiden', noem: 'Leiden', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1638, 3149],
    zinnen: {
      waar: { id: 'nl-waar-pl-leiden', tekst: 'Waar ligt Leiden?' },
      dat: { id: 'nl-dat-pl-leiden', tekst: 'Het goede antwoord is Leiden.' },
    },
  },
  {
    id: 'pl-zoetermeer', naam: 'Zoetermeer', noem: 'Zoetermeer', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1652, 3373],
    zinnen: {
      waar: { id: 'nl-waar-pl-zoetermeer', tekst: 'Waar ligt Zoetermeer?' },
      dat: { id: 'nl-dat-pl-zoetermeer', tekst: 'Het goede antwoord is Zoetermeer.' },
    },
  },
  {
    id: 'pl-dordrecht', naam: 'Dordrecht', noem: 'Dordrecht', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1898, 3954],
    zinnen: {
      waar: { id: 'nl-waar-pl-dordrecht', tekst: 'Waar ligt Dordrecht?' },
      dat: { id: 'nl-dat-pl-dordrecht', tekst: 'Het goede antwoord is Dordrecht.' },
    },
  },
  {
    id: 'pl-delft', naam: 'Delft', noem: 'Delft', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1450, 3496],
    zinnen: {
      waar: { id: 'nl-waar-pl-delft', tekst: 'Waar ligt Delft?' },
      dat: { id: 'nl-dat-pl-delft', tekst: 'Het goede antwoord is Delft.' },
    },
  },
  {
    id: 'pl-schiedam', naam: 'Schiedam', noem: 'Schiedam', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1495, 3671],
    zinnen: {
      waar: { id: 'nl-waar-pl-schiedam', tekst: 'Waar ligt Schiedam?' },
      dat: { id: 'nl-dat-pl-schiedam', tekst: 'Het goede antwoord is Schiedam.' },
    },
  },
  {
    id: 'pl-vlaardingen', naam: 'Vlaardingen', noem: 'Vlaardingen', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1432, 3681],
    zinnen: {
      waar: { id: 'nl-waar-pl-vlaardingen', tekst: 'Waar ligt Vlaardingen?' },
      dat: { id: 'nl-dat-pl-vlaardingen', tekst: 'Het goede antwoord is Vlaardingen.' },
    },
  },
  {
    id: 'pl-gouda', naam: 'Gouda', noem: 'Gouda', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1944, 3468],
    zinnen: {
      waar: { id: 'nl-waar-pl-gouda', tekst: 'Waar ligt Gouda?' },
      dat: { id: 'nl-dat-pl-gouda', tekst: 'Het goede antwoord is Gouda.' },
    },
  },
  {
    id: 'pl-alphen-aan-den-rijn', naam: 'Alphen aan den Rijn', noem: 'Alphen aan den Rijn', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1875, 3203],
    zinnen: {
      waar: { id: 'nl-waar-pl-alphen-aan-den-rijn', tekst: 'Waar ligt Alphen aan den Rijn?' },
      dat: { id: 'nl-dat-pl-alphen-aan-den-rijn', tekst: 'Het goede antwoord is Alphen aan den Rijn.' },
    },
  },
  {
    id: 'pl-spijkenisse', naam: 'Spijkenisse', noem: 'Spijkenisse', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1418, 3856],
    zinnen: {
      waar: { id: 'nl-waar-pl-spijkenisse', tekst: 'Waar ligt Spijkenisse?' },
      dat: { id: 'nl-dat-pl-spijkenisse', tekst: 'Het goede antwoord is Spijkenisse.' },
    },
  },
  {
    id: 'pl-capelle-aan-den-ijssel', naam: 'Capelle aan den IJssel', noem: 'Capelle aan den IJssel', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1762, 3650],
    zinnen: {
      waar: { id: 'nl-waar-pl-capelle-aan-den-ijssel', tekst: 'Waar ligt Capelle aan den IJssel?' },
      dat: { id: 'nl-dat-pl-capelle-aan-den-ijssel', tekst: 'Het goede antwoord is Capelle aan den IJssel.' },
    },
  },
  {
    id: 'pl-rijswijk', naam: 'Rijswijk', noem: 'Rijswijk', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1409, 3413],
    zinnen: {
      waar: { id: 'nl-waar-pl-rijswijk', tekst: 'Waar ligt Rijswijk?' },
      dat: { id: 'nl-dat-pl-rijswijk', tekst: 'Het goede antwoord is Rijswijk.' },
    },
  },
  {
    id: 'pl-barendrecht', naam: 'Barendrecht', noem: 'Barendrecht', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1674, 3830],
    zinnen: {
      waar: { id: 'nl-waar-pl-barendrecht', tekst: 'Waar ligt Barendrecht?' },
      dat: { id: 'nl-dat-pl-barendrecht', tekst: 'Het goede antwoord is Barendrecht.' },
    },
  },
  {
    id: 'pl-ridderkerk', naam: 'Ridderkerk', noem: 'Ridderkerk', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1784, 3784],
    zinnen: {
      waar: { id: 'nl-waar-pl-ridderkerk', tekst: 'Waar ligt Ridderkerk?' },
      dat: { id: 'nl-dat-pl-ridderkerk', tekst: 'Het goede antwoord is Ridderkerk.' },
    },
  },
  {
    id: 'pl-voorburg', naam: 'Voorburg', noem: 'Voorburg', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1461, 3331],
    zinnen: {
      waar: { id: 'nl-waar-pl-voorburg', tekst: 'Waar ligt Voorburg?' },
      dat: { id: 'nl-dat-pl-voorburg', tekst: 'Het goede antwoord is Voorburg.' },
    },
  },
  {
    id: 'pl-katwijk', naam: 'Katwijk', noem: 'Katwijk', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1537, 3052],
    zinnen: {
      waar: { id: 'nl-waar-pl-katwijk', tekst: 'Waar ligt Katwijk?' },
      dat: { id: 'nl-dat-pl-katwijk', tekst: 'Het goede antwoord is Katwijk.' },
    },
  },
  {
    id: 'pl-zwijndrecht', naam: 'Zwijndrecht', noem: 'Zwijndrecht', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1830, 3909],
    zinnen: {
      waar: { id: 'nl-waar-pl-zwijndrecht', tekst: 'Waar ligt Zwijndrecht?' },
      dat: { id: 'nl-dat-pl-zwijndrecht', tekst: 'Het goede antwoord is Zwijndrecht.' },
    },
  },
  {
    id: 'pl-hellevoetsluis', naam: 'Hellevoetsluis', noem: 'Hellevoetsluis', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1161, 3862],
    zinnen: {
      waar: { id: 'nl-waar-pl-hellevoetsluis', tekst: 'Waar ligt Hellevoetsluis?' },
      dat: { id: 'nl-dat-pl-hellevoetsluis', tekst: 'Het goede antwoord is Hellevoetsluis.' },
    },
  },
  {
    id: 'pl-gorinchem', naam: 'Gorinchem', noem: 'Gorinchem', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [2306, 3873],
    zinnen: {
      waar: { id: 'nl-waar-pl-gorinchem', tekst: 'Waar ligt Gorinchem?' },
      dat: { id: 'nl-dat-pl-gorinchem', tekst: 'Het goede antwoord is Gorinchem.' },
    },
  },
  {
    id: 'pl-maassluis', naam: 'Maassluis', noem: 'Maassluis', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1296, 3660],
    zinnen: {
      waar: { id: 'nl-waar-pl-maassluis', tekst: 'Waar ligt Maassluis?' },
      dat: { id: 'nl-dat-pl-maassluis', tekst: 'Het goede antwoord is Maassluis.' },
    },
  },
  {
    id: 'pl-papendrecht', naam: 'Papendrecht', noem: 'Papendrecht', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1916, 3878],
    zinnen: {
      waar: { id: 'nl-waar-pl-papendrecht', tekst: 'Waar ligt Papendrecht?' },
      dat: { id: 'nl-dat-pl-papendrecht', tekst: 'Het goede antwoord is Papendrecht.' },
    },
  },
  {
    id: 'pl-hendrik-ido-ambacht', naam: 'Hendrik-Ido-Ambacht', noem: 'Hendrik-Ido-Ambacht', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1840, 3862],
    zinnen: {
      waar: { id: 'nl-waar-pl-hendrik-ido-ambacht', tekst: 'Waar ligt Hendrik-Ido-Ambacht?' },
      dat: { id: 'nl-dat-pl-hendrik-ido-ambacht', tekst: 'Het goede antwoord is Hendrik-Ido-Ambacht.' },
    },
  },
  {
    id: 'pl-berkel-en-rodenrijs', naam: 'Berkel en Rodenrijs', noem: 'Berkel en Rodenrijs', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1609, 3518],
    zinnen: {
      waar: { id: 'nl-waar-pl-berkel-en-rodenrijs', tekst: 'Waar ligt Berkel en Rodenrijs?' },
      dat: { id: 'nl-dat-pl-berkel-en-rodenrijs', tekst: 'Het goede antwoord is Berkel en Rodenrijs.' },
    },
  },
  {
    id: 'pl-leidschendam', naam: 'Leidschendam', noem: 'Leidschendam', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1514, 3300],
    zinnen: {
      waar: { id: 'nl-waar-pl-leidschendam', tekst: 'Waar ligt Leidschendam?' },
      dat: { id: 'nl-dat-pl-leidschendam', tekst: 'Het goede antwoord is Leidschendam.' },
    },
  },
  {
    id: 'pl-waddinxveen', naam: 'Waddinxveen', noem: 'Waddinxveen', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1852, 3412],
    zinnen: {
      waar: { id: 'nl-waar-pl-waddinxveen', tekst: 'Waar ligt Waddinxveen?' },
      dat: { id: 'nl-dat-pl-waddinxveen', tekst: 'Het goede antwoord is Waddinxveen.' },
    },
  },
  {
    id: 'pl-krimpen-aan-den-ijssel', naam: 'Krimpen aan den IJssel', noem: 'Krimpen aan den IJssel', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1794, 3690],
    zinnen: {
      waar: { id: 'nl-waar-pl-krimpen-aan-den-ijssel', tekst: 'Waar ligt Krimpen aan den IJssel?' },
      dat: { id: 'nl-dat-pl-krimpen-aan-den-ijssel', tekst: 'Het goede antwoord is Krimpen aan den IJssel.' },
    },
  },
  {
    id: 'pl-pijnacker', naam: 'Pijnacker', noem: 'Pijnacker', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1569, 3472],
    zinnen: {
      waar: { id: 'nl-waar-pl-pijnacker', tekst: 'Waar ligt Pijnacker?' },
      dat: { id: 'nl-dat-pl-pijnacker', tekst: 'Het goede antwoord is Pijnacker.' },
    },
  },
  {
    id: 'pl-leiderdorp', naam: 'Leiderdorp', noem: 'Leiderdorp', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1696, 3145],
    zinnen: {
      waar: { id: 'nl-waar-pl-leiderdorp', tekst: 'Waar ligt Leiderdorp?' },
      dat: { id: 'nl-dat-pl-leiderdorp', tekst: 'Het goede antwoord is Leiderdorp.' },
    },
  },
  {
    id: 'pl-noordwijk', naam: 'Noordwijk', noem: 'Noordwijk', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1581, 2970],
    zinnen: {
      waar: { id: 'nl-waar-pl-noordwijk', tekst: 'Waar ligt Noordwijk?' },
      dat: { id: 'nl-dat-pl-noordwijk', tekst: 'Het goede antwoord is Noordwijk.' },
    },
  },
  {
    id: 'pl-sliedrecht', naam: 'Sliedrecht', noem: 'Sliedrecht', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [2022, 3900],
    zinnen: {
      waar: { id: 'nl-waar-pl-sliedrecht', tekst: 'Waar ligt Sliedrecht?' },
      dat: { id: 'nl-dat-pl-sliedrecht', tekst: 'Het goede antwoord is Sliedrecht.' },
    },
  },
  {
    id: 'pl-wassenaar', naam: 'Wassenaar', noem: 'Wassenaar', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1509, 3192],
    zinnen: {
      waar: { id: 'nl-waar-pl-wassenaar', tekst: 'Waar ligt Wassenaar?' },
      dat: { id: 'nl-dat-pl-wassenaar', tekst: 'Het goede antwoord is Wassenaar.' },
    },
  },
  {
    id: 'pl-oegstgeest', naam: 'Oegstgeest', noem: 'Oegstgeest', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1618, 3093],
    zinnen: {
      waar: { id: 'nl-waar-pl-oegstgeest', tekst: 'Waar ligt Oegstgeest?' },
      dat: { id: 'nl-dat-pl-oegstgeest', tekst: 'Het goede antwoord is Oegstgeest.' },
    },
  },
  {
    id: 'pl-voorschoten', naam: 'Voorschoten', noem: 'Voorschoten', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1587, 3214],
    zinnen: {
      waar: { id: 'nl-waar-pl-voorschoten', tekst: 'Waar ligt Voorschoten?' },
      dat: { id: 'nl-dat-pl-voorschoten', tekst: 'Het goede antwoord is Voorschoten.' },
    },
  },
  {
    id: 'pl-oud-beijerland', naam: 'Oud-Beijerland', noem: 'Oud-Beijerland', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1527, 3898],
    zinnen: {
      waar: { id: 'nl-waar-pl-oud-beijerland', tekst: 'Waar ligt Oud-Beijerland?' },
      dat: { id: 'nl-dat-pl-oud-beijerland', tekst: 'Het goede antwoord is Oud-Beijerland.' },
    },
  },
  {
    id: 'pl-lisse', naam: 'Lisse', noem: 'Lisse', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1737, 2937],
    zinnen: {
      waar: { id: 'nl-waar-pl-lisse', tekst: 'Waar ligt Lisse?' },
      dat: { id: 'nl-dat-pl-lisse', tekst: 'Het goede antwoord is Lisse.' },
    },
  },
  {
    id: 'pl-nieuwerkerk-aan-den-ijssel', naam: 'Nieuwerkerk aan den IJssel', noem: 'Nieuwerkerk aan den IJssel', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1804, 3581],
    zinnen: {
      waar: { id: 'nl-waar-pl-nieuwerkerk-aan-den-ijssel', tekst: 'Waar ligt Nieuwerkerk aan den IJssel?' },
      dat: { id: 'nl-dat-pl-nieuwerkerk-aan-den-ijssel', tekst: 'Het goede antwoord is Nieuwerkerk aan den IJssel.' },
    },
  },
  {
    id: 'pl-naaldwijk', naam: 'Naaldwijk', noem: 'Naaldwijk', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1250, 3511],
    zinnen: {
      waar: { id: 'nl-waar-pl-naaldwijk', tekst: 'Waar ligt Naaldwijk?' },
      dat: { id: 'nl-dat-pl-naaldwijk', tekst: 'Het goede antwoord is Naaldwijk.' },
    },
  },
  {
    id: 'pl-hillegom', naam: 'Hillegom', noem: 'Hillegom', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1773, 2856],
    zinnen: {
      waar: { id: 'nl-waar-pl-hillegom', tekst: 'Waar ligt Hillegom?' },
      dat: { id: 'nl-dat-pl-hillegom', tekst: 'Het goede antwoord is Hillegom.' },
    },
  },
  {
    id: 'pl-alblasserdam', naam: 'Alblasserdam', noem: 'Alblasserdam', soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1865, 3800],
    zinnen: {
      waar: { id: 'nl-waar-pl-alblasserdam', tekst: 'Waar ligt Alblasserdam?' },
      dat: { id: 'nl-dat-pl-alblasserdam', tekst: 'Het goede antwoord is Alblasserdam.' },
    },
  },
  {
    id: 'pl-s-gravenzande', naam: "'s-Gravenzande", noem: "'s-Gravenzande", soort: 'plaats', provincies: ['pv-zuid-holland'], stip: [1195, 3496],
    zinnen: {
      waar: { id: 'nl-waar-pl-s-gravenzande', tekst: "Waar ligt 's-Gravenzande?" },
      dat: { id: 'nl-dat-pl-s-gravenzande', tekst: "Het goede antwoord is 's-Gravenzande." },
    },
  },
  {
    id: 'st-westland', naam: 'Westland', noem: 'het Westland', soort: 'streek', provincies: ['pv-zuid-holland'], gebied: 'st-westland',
    zinnen: {
      waar: { id: 'nl-waar-st-westland', tekst: 'Waar ligt het Westland?' },
      dat: { id: 'nl-dat-st-westland', tekst: 'Het goede antwoord is het Westland.' },
    },
  },
  {
    id: 'st-bollenstreek', naam: 'Bollenstreek', noem: 'de Bollenstreek', soort: 'streek', provincies: ['pv-zuid-holland'], gebied: 'st-bollenstreek',
    zinnen: {
      waar: { id: 'nl-waar-st-bollenstreek', tekst: 'Waar ligt de Bollenstreek?' },
      dat: { id: 'nl-dat-st-bollenstreek', tekst: 'Het goede antwoord is de Bollenstreek.' },
    },
  },
  {
    id: 'st-alblasserwaard', naam: 'Alblasserwaard', noem: 'de Alblasserwaard', soort: 'streek', provincies: ['pv-zuid-holland'], gebied: 'st-alblasserwaard',
    zinnen: {
      waar: { id: 'nl-waar-st-alblasserwaard', tekst: 'Waar ligt de Alblasserwaard?' },
      dat: { id: 'nl-dat-st-alblasserwaard', tekst: 'Het goede antwoord is de Alblasserwaard.' },
    },
  },
  {
    id: 'st-krimpenerwaard', naam: 'Krimpenerwaard', noem: 'de Krimpenerwaard', soort: 'streek', provincies: ['pv-zuid-holland'], gebied: 'st-krimpenerwaard',
    zinnen: {
      waar: { id: 'nl-waar-st-krimpenerwaard', tekst: 'Waar ligt de Krimpenerwaard?' },
      dat: { id: 'nl-dat-st-krimpenerwaard', tekst: 'Het goede antwoord is de Krimpenerwaard.' },
    },
  },
  {
    id: 'ei-goeree-overflakkee', naam: 'Goeree-Overflakkee', noem: 'Goeree-Overflakkee', soort: 'eiland', provincies: ['pv-zuid-holland'], gebied: 'ei-goeree-overflakkee',
    zinnen: {
      waar: { id: 'nl-waar-ei-goeree-overflakkee', tekst: 'Waar ligt Goeree-Overflakkee?' },
      dat: { id: 'nl-dat-ei-goeree-overflakkee', tekst: 'Het goede antwoord is Goeree-Overflakkee.' },
    },
  },
  {
    id: 'ei-voorne-putten', naam: 'Voorne-Putten', noem: 'Voorne-Putten', soort: 'eiland', provincies: ['pv-zuid-holland'], gebied: 'ei-voorne-putten',
    zinnen: {
      waar: { id: 'nl-waar-ei-voorne-putten', tekst: 'Waar ligt Voorne-Putten?' },
      dat: { id: 'nl-dat-ei-voorne-putten', tekst: 'Het goede antwoord is Voorne-Putten.' },
    },
  },
  {
    id: 'ei-hoeksche-waard', naam: 'Hoeksche Waard', noem: 'de Hoeksche Waard', soort: 'eiland', provincies: ['pv-zuid-holland'], gebied: 'ei-hoeksche-waard',
    zinnen: {
      waar: { id: 'nl-waar-ei-hoeksche-waard', tekst: 'Waar ligt de Hoeksche Waard?' },
      dat: { id: 'nl-dat-ei-hoeksche-waard', tekst: 'Het goede antwoord is de Hoeksche Waard.' },
    },
  },
  {
    id: 'ei-dordrecht', naam: 'Eiland van Dordrecht', noem: 'het Eiland van Dordrecht', soort: 'eiland', provincies: ['pv-zuid-holland'], gebied: 'ei-dordrecht',
    zinnen: {
      waar: { id: 'nl-waar-ei-dordrecht', tekst: 'Waar ligt het Eiland van Dordrecht?' },
      dat: { id: 'nl-dat-ei-dordrecht', tekst: 'Het goede antwoord is het Eiland van Dordrecht.' },
    },
  },
  {
    id: 'pl-middelburg', naam: 'Middelburg', noem: 'Middelburg', soort: 'plaats', provincies: ['pv-zeeland'], stip: [408, 4602],
    zinnen: {
      waar: { id: 'nl-waar-pl-middelburg', tekst: 'Waar ligt Middelburg?' },
      dat: { id: 'nl-dat-pl-middelburg', tekst: 'Het goede antwoord is Middelburg.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-middelburg', tekst: 'Van welke provincie is Middelburg de hoofdstad?' },
    },
  },
  {
    id: 'pl-vlissingen', naam: 'Vlissingen', noem: 'Vlissingen', soort: 'plaats', provincies: ['pv-zeeland'], stip: [345, 4689],
    zinnen: {
      waar: { id: 'nl-waar-pl-vlissingen', tekst: 'Waar ligt Vlissingen?' },
      dat: { id: 'nl-dat-pl-vlissingen', tekst: 'Het goede antwoord is Vlissingen.' },
    },
  },
  {
    id: 'pl-goes', naam: 'Goes', noem: 'Goes', soort: 'plaats', provincies: ['pv-zeeland'], stip: [794, 4590],
    zinnen: {
      waar: { id: 'nl-waar-pl-goes', tekst: 'Waar ligt Goes?' },
      dat: { id: 'nl-dat-pl-goes', tekst: 'Het goede antwoord is Goes.' },
    },
  },
  {
    id: 'pl-terneuzen', naam: 'Terneuzen', noem: 'Terneuzen', soort: 'plaats', provincies: ['pv-zeeland'], stip: [722, 4988],
    zinnen: {
      waar: { id: 'nl-waar-pl-terneuzen', tekst: 'Waar ligt Terneuzen?' },
      dat: { id: 'nl-dat-pl-terneuzen', tekst: 'Het goede antwoord is Terneuzen.' },
    },
  },
  {
    id: 'pl-zierikzee', naam: 'Zierikzee', noem: 'Zierikzee', soort: 'plaats', provincies: ['pv-zeeland'], stip: [832, 4269],
    zinnen: {
      waar: { id: 'nl-waar-pl-zierikzee', tekst: 'Waar ligt Zierikzee?' },
      dat: { id: 'nl-dat-pl-zierikzee', tekst: 'Het goede antwoord is Zierikzee.' },
    },
  },
  {
    id: 'pl-hulst', naam: 'Hulst', noem: 'Hulst', soort: 'plaats', provincies: ['pv-zeeland'], stip: [1014, 5086],
    zinnen: {
      waar: { id: 'nl-waar-pl-hulst', tekst: 'Waar ligt Hulst?' },
      dat: { id: 'nl-dat-pl-hulst', tekst: 'Het goede antwoord is Hulst.' },
    },
  },
  {
    id: 'pl-yerseke', naam: 'Yerseke', noem: 'Yerseke', soort: 'plaats', provincies: ['pv-zeeland'], stip: [1005, 4620],
    zinnen: {
      waar: { id: 'nl-waar-pl-yerseke', tekst: 'Waar ligt Yerseke?' },
      dat: { id: 'nl-dat-pl-yerseke', tekst: 'Het goede antwoord is Yerseke.' },
    },
  },
  {
    id: 'pl-breskens', naam: 'Breskens', noem: 'Breskens', soort: 'plaats', provincies: ['pv-zeeland'], stip: [322, 4824],
    zinnen: {
      waar: { id: 'nl-waar-pl-breskens', tekst: 'Waar ligt Breskens?' },
      dat: { id: 'nl-dat-pl-breskens', tekst: 'Het goede antwoord is Breskens.' },
    },
  },
  {
    id: 'pl-sluis', naam: 'Sluis', noem: 'Sluis', soort: 'plaats', provincies: ['pv-zeeland'], stip: [78, 5009],
    zinnen: {
      waar: { id: 'nl-waar-pl-sluis', tekst: 'Waar ligt Sluis?' },
      dat: { id: 'nl-dat-pl-sluis', tekst: 'Het goede antwoord is Sluis.' },
    },
  },
  {
    id: 'pl-domburg', naam: 'Domburg', noem: 'Domburg', soort: 'plaats', provincies: ['pv-zeeland'], stip: [251, 4450],
    zinnen: {
      waar: { id: 'nl-waar-pl-domburg', tekst: 'Waar ligt Domburg?' },
      dat: { id: 'nl-dat-pl-domburg', tekst: 'Het goede antwoord is Domburg.' },
    },
  },
  {
    id: 'pl-veere', naam: 'Veere', noem: 'Veere', soort: 'plaats', provincies: ['pv-zeeland'], stip: [474, 4497],
    zinnen: {
      waar: { id: 'nl-waar-pl-veere', tekst: 'Waar ligt Veere?' },
      dat: { id: 'nl-dat-pl-veere', tekst: 'Het goede antwoord is Veere.' },
    },
  },
  {
    id: 'st-zeeuws-vlaanderen', naam: 'Zeeuws-Vlaanderen', noem: 'Zeeuws-Vlaanderen', soort: 'streek', provincies: ['pv-zeeland'], gebied: 'st-zeeuws-vlaanderen',
    zinnen: {
      waar: { id: 'nl-waar-st-zeeuws-vlaanderen', tekst: 'Waar ligt Zeeuws-Vlaanderen?' },
      dat: { id: 'nl-dat-st-zeeuws-vlaanderen', tekst: 'Het goede antwoord is Zeeuws-Vlaanderen.' },
    },
  },
  {
    id: 'ei-walcheren', naam: 'Walcheren', noem: 'Walcheren', soort: 'eiland', provincies: ['pv-zeeland'], gebied: 'ei-walcheren',
    zinnen: {
      waar: { id: 'nl-waar-ei-walcheren', tekst: 'Waar ligt Walcheren?' },
      dat: { id: 'nl-dat-ei-walcheren', tekst: 'Het goede antwoord is Walcheren.' },
    },
  },
  {
    id: 'ei-noord-beveland', naam: 'Noord-Beveland', noem: 'Noord-Beveland', soort: 'eiland', provincies: ['pv-zeeland'], gebied: 'ei-noord-beveland',
    zinnen: {
      waar: { id: 'nl-waar-ei-noord-beveland', tekst: 'Waar ligt Noord-Beveland?' },
      dat: { id: 'nl-dat-ei-noord-beveland', tekst: 'Het goede antwoord is Noord-Beveland.' },
    },
  },
  {
    id: 'ei-zuid-beveland', naam: 'Zuid-Beveland', noem: 'Zuid-Beveland', soort: 'eiland', provincies: ['pv-zeeland'], gebied: 'ei-zuid-beveland',
    zinnen: {
      waar: { id: 'nl-waar-ei-zuid-beveland', tekst: 'Waar ligt Zuid-Beveland?' },
      dat: { id: 'nl-dat-ei-zuid-beveland', tekst: 'Het goede antwoord is Zuid-Beveland.' },
    },
  },
  {
    id: 'ei-schouwen-duiveland', naam: 'Schouwen-Duiveland', noem: 'Schouwen-Duiveland', soort: 'eiland', provincies: ['pv-zeeland'], gebied: 'ei-schouwen-duiveland',
    zinnen: {
      waar: { id: 'nl-waar-ei-schouwen-duiveland', tekst: 'Waar ligt Schouwen-Duiveland?' },
      dat: { id: 'nl-dat-ei-schouwen-duiveland', tekst: 'Het goede antwoord is Schouwen-Duiveland.' },
    },
  },
  {
    id: 'ei-tholen', naam: 'Tholen', noem: 'Tholen', soort: 'eiland', provincies: ['pv-zeeland'], gebied: 'ei-tholen',
    zinnen: {
      waar: { id: 'nl-waar-ei-tholen', tekst: 'Waar ligt Tholen?' },
      dat: { id: 'nl-dat-ei-tholen', tekst: 'Het goede antwoord is Tholen.' },
    },
  },
  {
    id: 'ei-neeltje-jans', naam: 'Neeltje Jans', noem: 'Neeltje Jans', soort: 'eiland', provincies: ['pv-zeeland'], gebied: 'ei-neeltje-jans',
    zinnen: {
      waar: { id: 'nl-waar-ei-neeltje-jans', tekst: 'Waar ligt Neeltje Jans?' },
      dat: { id: 'nl-dat-ei-neeltje-jans', tekst: 'Het goede antwoord is Neeltje Jans.' },
    },
  },
  {
    id: 'pl-eindhoven', naam: 'Eindhoven', noem: 'Eindhoven', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2986, 4736],
    zinnen: {
      waar: { id: 'nl-waar-pl-eindhoven', tekst: 'Waar ligt Eindhoven?' },
      dat: { id: 'nl-dat-pl-eindhoven', tekst: 'Het goede antwoord is Eindhoven.' },
    },
  },
  {
    id: 'pl-tilburg', naam: 'Tilburg', noem: 'Tilburg', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2413, 4472],
    zinnen: {
      waar: { id: 'nl-waar-pl-tilburg', tekst: 'Waar ligt Tilburg?' },
      dat: { id: 'nl-dat-pl-tilburg', tekst: 'Het goede antwoord is Tilburg.' },
    },
  },
  {
    id: 'pl-breda', naam: 'Breda', noem: 'Breda', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2017, 4418],
    zinnen: {
      waar: { id: 'nl-waar-pl-breda', tekst: 'Waar ligt Breda?' },
      dat: { id: 'nl-dat-pl-breda', tekst: 'Het goede antwoord is Breda.' },
    },
  },
  {
    id: 'pl-s-hertogenbosch', naam: "'s-Hertogenbosch", noem: "'s-Hertogenbosch", soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2752, 4168],
    zinnen: {
      waar: { id: 'nl-waar-pl-s-hertogenbosch', tekst: "Waar ligt 's-Hertogenbosch?" },
      dat: { id: 'nl-dat-pl-s-hertogenbosch', tekst: "Het goede antwoord is 's-Hertogenbosch." },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-s-hertogenbosch', tekst: "Van welke provincie is 's-Hertogenbosch de hoofdstad?" },
    },
  },
  {
    id: 'pl-helmond', naam: 'Helmond', noem: 'Helmond', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3248, 4675],
    zinnen: {
      waar: { id: 'nl-waar-pl-helmond', tekst: 'Waar ligt Helmond?' },
      dat: { id: 'nl-dat-pl-helmond', tekst: 'Het goede antwoord is Helmond.' },
    },
  },
  {
    id: 'pl-roosendaal', naam: 'Roosendaal', noem: 'Roosendaal', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [1585, 4555],
    zinnen: {
      waar: { id: 'nl-waar-pl-roosendaal', tekst: 'Waar ligt Roosendaal?' },
      dat: { id: 'nl-dat-pl-roosendaal', tekst: 'Het goede antwoord is Roosendaal.' },
    },
  },
  {
    id: 'pl-oss', naam: 'Oss', noem: 'Oss', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3049, 4034],
    zinnen: {
      waar: { id: 'nl-waar-pl-oss', tekst: 'Waar ligt Oss?' },
      dat: { id: 'nl-dat-pl-oss', tekst: 'Het goede antwoord is Oss.' },
    },
  },
  {
    id: 'pl-bergen-op-zoom', naam: 'Bergen op Zoom', noem: 'Bergen op Zoom', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [1347, 4631],
    zinnen: {
      waar: { id: 'nl-waar-pl-bergen-op-zoom', tekst: 'Waar ligt Bergen op Zoom?' },
      dat: { id: 'nl-dat-pl-bergen-op-zoom', tekst: 'Het goede antwoord is Bergen op Zoom.' },
    },
  },
  {
    id: 'pl-oosterhout', naam: 'Oosterhout', noem: 'Oosterhout', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2136, 4299],
    zinnen: {
      waar: { id: 'nl-waar-pl-oosterhout', tekst: 'Waar ligt Oosterhout?' },
      dat: { id: 'nl-dat-pl-oosterhout', tekst: 'Het goede antwoord is Oosterhout.' },
    },
  },
  {
    id: 'pl-veldhoven', naam: 'Veldhoven', noem: 'Veldhoven', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2883, 4803],
    zinnen: {
      waar: { id: 'nl-waar-pl-veldhoven', tekst: 'Waar ligt Veldhoven?' },
      dat: { id: 'nl-dat-pl-veldhoven', tekst: 'Het goede antwoord is Veldhoven.' },
    },
  },
  {
    id: 'pl-etten-leur', naam: 'Etten-Leur', noem: 'Etten-Leur', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [1841, 4449],
    zinnen: {
      waar: { id: 'nl-waar-pl-etten-leur', tekst: 'Waar ligt Etten-Leur?' },
      dat: { id: 'nl-dat-pl-etten-leur', tekst: 'Het goede antwoord is Etten-Leur.' },
    },
  },
  {
    id: 'pl-rosmalen', naam: 'Rosmalen', noem: 'Rosmalen', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2833, 4137],
    zinnen: {
      waar: { id: 'nl-waar-pl-rosmalen', tekst: 'Waar ligt Rosmalen?' },
      dat: { id: 'nl-dat-pl-rosmalen', tekst: 'Het goede antwoord is Rosmalen.' },
    },
  },
  {
    id: 'pl-uden', naam: 'Uden', noem: 'Uden', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3194, 4267],
    zinnen: {
      waar: { id: 'nl-waar-pl-uden', tekst: 'Waar ligt Uden?' },
      dat: { id: 'nl-dat-pl-uden', tekst: 'Het goede antwoord is Uden.' },
    },
  },
  {
    id: 'pl-waalwijk', naam: 'Waalwijk', noem: 'Waalwijk', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2427, 4213],
    zinnen: {
      waar: { id: 'nl-waar-pl-waalwijk', tekst: 'Waar ligt Waalwijk?' },
      dat: { id: 'nl-dat-pl-waalwijk', tekst: 'Het goede antwoord is Waalwijk.' },
    },
  },
  {
    id: 'pl-veghel', naam: 'Veghel', noem: 'Veghel', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3093, 4360],
    zinnen: {
      waar: { id: 'nl-waar-pl-veghel', tekst: 'Waar ligt Veghel?' },
      dat: { id: 'nl-dat-pl-veghel', tekst: 'Het goede antwoord is Veghel.' },
    },
  },
  {
    id: 'pl-valkenswaard', naam: 'Valkenswaard', noem: 'Valkenswaard', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2956, 4949],
    zinnen: {
      waar: { id: 'nl-waar-pl-valkenswaard', tekst: 'Waar ligt Valkenswaard?' },
      dat: { id: 'nl-dat-pl-valkenswaard', tekst: 'Het goede antwoord is Valkenswaard.' },
    },
  },
  {
    id: 'pl-best', naam: 'Best', noem: 'Best', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2869, 4610],
    zinnen: {
      waar: { id: 'nl-waar-pl-best', tekst: 'Waar ligt Best?' },
      dat: { id: 'nl-dat-pl-best', tekst: 'Het goede antwoord is Best.' },
    },
  },
  {
    id: 'pl-geldrop', naam: 'Geldrop', noem: 'Geldrop', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3110, 4796],
    zinnen: {
      waar: { id: 'nl-waar-pl-geldrop', tekst: 'Waar ligt Geldrop?' },
      dat: { id: 'nl-dat-pl-geldrop', tekst: 'Het goede antwoord is Geldrop.' },
    },
  },
  {
    id: 'pl-boxtel', naam: 'Boxtel', noem: 'Boxtel', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2787, 4421],
    zinnen: {
      waar: { id: 'nl-waar-pl-boxtel', tekst: 'Waar ligt Boxtel?' },
      dat: { id: 'nl-dat-pl-boxtel', tekst: 'Het goede antwoord is Boxtel.' },
    },
  },
  {
    id: 'pl-vught', naam: 'Vught', noem: 'Vught', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2730, 4287],
    zinnen: {
      waar: { id: 'nl-waar-pl-vught', tekst: 'Waar ligt Vught?' },
      dat: { id: 'nl-dat-pl-vught', tekst: 'Het goede antwoord is Vught.' },
    },
  },
  {
    id: 'pl-nuenen', naam: 'Nuenen', noem: 'Nuenen', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3096, 4685],
    zinnen: {
      waar: { id: 'nl-waar-pl-nuenen', tekst: 'Waar ligt Nuenen?' },
      dat: { id: 'nl-dat-pl-nuenen', tekst: 'Het goede antwoord is Nuenen.' },
    },
  },
  {
    id: 'pl-dongen', naam: 'Dongen', noem: 'Dongen', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2249, 4336],
    zinnen: {
      waar: { id: 'nl-waar-pl-dongen', tekst: 'Waar ligt Dongen?' },
      dat: { id: 'nl-dat-pl-dongen', tekst: 'Het goede antwoord is Dongen.' },
    },
  },
  {
    id: 'pl-deurne', naam: 'Deurne', noem: 'Deurne', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [3441, 4708],
    zinnen: {
      waar: { id: 'nl-waar-pl-deurne', tekst: 'Waar ligt Deurne?' },
      dat: { id: 'nl-dat-pl-deurne', tekst: 'Het goede antwoord is Deurne.' },
    },
  },
  {
    id: 'pl-schijndel', naam: 'Schijndel', noem: 'Schijndel', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2939, 4357],
    zinnen: {
      waar: { id: 'nl-waar-pl-schijndel', tekst: 'Waar ligt Schijndel?' },
      dat: { id: 'nl-dat-pl-schijndel', tekst: 'Het goede antwoord is Schijndel.' },
    },
  },
  {
    id: 'pl-goirle', naam: 'Goirle', noem: 'Goirle', soort: 'plaats', provincies: ['pv-noord-brabant'], stip: [2419, 4567],
    zinnen: {
      waar: { id: 'nl-waar-pl-goirle', tekst: 'Waar ligt Goirle?' },
      dat: { id: 'nl-dat-pl-goirle', tekst: 'Het goede antwoord is Goirle.' },
    },
  },
  {
    id: 'st-kempen', naam: 'Kempen', noem: 'de Kempen', soort: 'streek', provincies: ['pv-noord-brabant'], gebied: 'st-kempen',
    zinnen: {
      waar: { id: 'nl-waar-st-kempen', tekst: 'Waar ligt de Kempen?' },
      dat: { id: 'nl-dat-st-kempen', tekst: 'Het goede antwoord is de Kempen.' },
    },
  },
  {
    id: 'st-land-van-cuijk', naam: 'Land van Cuijk', noem: 'het Land van Cuijk', soort: 'streek', provincies: ['pv-noord-brabant'], gebied: 'st-land-van-cuijk',
    zinnen: {
      waar: { id: 'nl-waar-st-land-van-cuijk', tekst: 'Waar ligt het Land van Cuijk?' },
      dat: { id: 'nl-dat-st-land-van-cuijk', tekst: 'Het goede antwoord is het Land van Cuijk.' },
    },
  },
  {
    id: 'pl-maastricht', naam: 'Maastricht', noem: 'Maastricht', soort: 'plaats', provincies: ['pv-limburg'], stip: [3303, 6072],
    zinnen: {
      waar: { id: 'nl-waar-pl-maastricht', tekst: 'Waar ligt Maastricht?' },
      dat: { id: 'nl-dat-pl-maastricht', tekst: 'Het goede antwoord is Maastricht.' },
      hoofdstadVan: { id: 'nl-hoofdstad-van-pl-maastricht', tekst: 'Van welke provincie is Maastricht de hoofdstad?' },
    },
  },
  {
    id: 'pl-heerlen', naam: 'Heerlen', noem: 'Heerlen', soort: 'plaats', provincies: ['pv-limburg'], stip: [3700, 5969],
    zinnen: {
      waar: { id: 'nl-waar-pl-heerlen', tekst: 'Waar ligt Heerlen?' },
      dat: { id: 'nl-dat-pl-heerlen', tekst: 'Het goede antwoord is Heerlen.' },
    },
  },
  {
    id: 'pl-venlo', naam: 'Venlo', noem: 'Venlo', soort: 'plaats', provincies: ['pv-limburg'], stip: [3948, 4910],
    zinnen: {
      waar: { id: 'nl-waar-pl-venlo', tekst: 'Waar ligt Venlo?' },
      dat: { id: 'nl-dat-pl-venlo', tekst: 'Het goede antwoord is Venlo.' },
    },
  },
  {
    id: 'pl-weert', naam: 'Weert', noem: 'Weert', soort: 'plaats', provincies: ['pv-limburg'], stip: [3317, 5174],
    zinnen: {
      waar: { id: 'nl-waar-pl-weert', tekst: 'Waar ligt Weert?' },
      dat: { id: 'nl-dat-pl-weert', tekst: 'Het goede antwoord is Weert.' },
    },
  },
  {
    id: 'pl-roermond', naam: 'Roermond', noem: 'Roermond', soort: 'plaats', provincies: ['pv-limburg'], stip: [3730, 5309],
    zinnen: {
      waar: { id: 'nl-waar-pl-roermond', tekst: 'Waar ligt Roermond?' },
      dat: { id: 'nl-dat-pl-roermond', tekst: 'Het goede antwoord is Roermond.' },
    },
  },
  {
    id: 'pl-kerkrade', naam: 'Kerkrade', noem: 'Kerkrade', soort: 'plaats', provincies: ['pv-limburg'], stip: [3807, 6030],
    zinnen: {
      waar: { id: 'nl-waar-pl-kerkrade', tekst: 'Waar ligt Kerkrade?' },
      dat: { id: 'nl-dat-pl-kerkrade', tekst: 'Het goede antwoord is Kerkrade.' },
    },
  },
  {
    id: 'pl-sittard', naam: 'Sittard', noem: 'Sittard', soort: 'plaats', provincies: ['pv-limburg'], stip: [3549, 5733],
    zinnen: {
      waar: { id: 'nl-waar-pl-sittard', tekst: 'Waar ligt Sittard?' },
      dat: { id: 'nl-dat-pl-sittard', tekst: 'Het goede antwoord is Sittard.' },
    },
  },
  {
    id: 'pl-landgraaf', naam: 'Landgraaf', noem: 'Landgraaf', soort: 'plaats', provincies: ['pv-limburg'], stip: [3769, 5949],
    zinnen: {
      waar: { id: 'nl-waar-pl-landgraaf', tekst: 'Waar ligt Landgraaf?' },
      dat: { id: 'nl-dat-pl-landgraaf', tekst: 'Het goede antwoord is Landgraaf.' },
    },
  },
  {
    id: 'pl-geleen', naam: 'Geleen', noem: 'Geleen', soort: 'plaats', provincies: ['pv-limburg'], stip: [3490, 5798],
    zinnen: {
      waar: { id: 'nl-waar-pl-geleen', tekst: 'Waar ligt Geleen?' },
      dat: { id: 'nl-dat-pl-geleen', tekst: 'Het goede antwoord is Geleen.' },
    },
  },
  {
    id: 'pl-brunssum', naam: 'Brunssum', noem: 'Brunssum', soort: 'plaats', provincies: ['pv-limburg'], stip: [3680, 5860],
    zinnen: {
      waar: { id: 'nl-waar-pl-brunssum', tekst: 'Waar ligt Brunssum?' },
      dat: { id: 'nl-dat-pl-brunssum', tekst: 'Het goede antwoord is Brunssum.' },
    },
  },
  {
    id: 'pl-venray', naam: 'Venray', noem: 'Venray', soort: 'plaats', provincies: ['pv-limburg'], stip: [3692, 4561],
    zinnen: {
      waar: { id: 'nl-waar-pl-venray', tekst: 'Waar ligt Venray?' },
      dat: { id: 'nl-dat-pl-venray', tekst: 'Het goede antwoord is Venray.' },
    },
  },
  {
    id: 'st-zuid-limburg', naam: 'Zuid-Limburg', noem: 'Zuid-Limburg', soort: 'streek', provincies: ['pv-limburg'], gebied: 'st-zuid-limburg',
    zinnen: {
      waar: { id: 'nl-waar-st-zuid-limburg', tekst: 'Waar ligt Zuid-Limburg?' },
      dat: { id: 'nl-dat-st-zuid-limburg', tekst: 'Het goede antwoord is Zuid-Limburg.' },
    },
  },
  {
    id: 'wa-noordzee', naam: 'Noordzee', noem: 'de Noordzee', soort: 'water', provincies: ['pv-friesland', 'pv-noord-holland', 'pv-zuid-holland', 'pv-zeeland'], gebied: 'wa-noordzee',
    zinnen: {
      waar: { id: 'nl-waar-wa-noordzee', tekst: 'Waar ligt de Noordzee?' },
      dat: { id: 'nl-dat-wa-noordzee', tekst: 'Het goede antwoord is de Noordzee.' },
    },
  },
  {
    id: 'wa-waddenzee', naam: 'Waddenzee', noem: 'de Waddenzee', soort: 'water', provincies: ['pv-groningen', 'pv-friesland', 'pv-noord-holland'], gebied: 'wa-waddenzee',
    zinnen: {
      waar: { id: 'nl-waar-wa-waddenzee', tekst: 'Waar ligt de Waddenzee?' },
      dat: { id: 'nl-dat-wa-waddenzee', tekst: 'Het goede antwoord is de Waddenzee.' },
    },
  },
  {
    id: 'wa-eems-dollard', naam: 'Eems-Dollard', noem: 'de Eems-Dollard', soort: 'water', provincies: ['pv-groningen'], gebied: 'wa-eems-dollard',
    zinnen: {
      waar: { id: 'nl-waar-wa-eems-dollard', tekst: 'Waar ligt de Eems-Dollard?' },
      dat: { id: 'nl-dat-wa-eems-dollard', tekst: 'Het goede antwoord is de Eems-Dollard.' },
    },
  },
  {
    id: 'wa-ijsselmeer', naam: 'IJsselmeer', noem: 'het IJsselmeer', soort: 'water', provincies: ['pv-friesland', 'pv-flevoland', 'pv-noord-holland'], gebied: 'wa-ijsselmeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-ijsselmeer', tekst: 'Waar ligt het IJsselmeer?' },
      dat: { id: 'nl-dat-wa-ijsselmeer', tekst: 'Het goede antwoord is het IJsselmeer.' },
    },
  },
  {
    id: 'wa-markermeer', naam: 'Markermeer', noem: 'het Markermeer', soort: 'water', provincies: ['pv-flevoland', 'pv-noord-holland'], gebied: 'wa-markermeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-markermeer', tekst: 'Waar ligt het Markermeer?' },
      dat: { id: 'nl-dat-wa-markermeer', tekst: 'Het goede antwoord is het Markermeer.' },
    },
  },
  {
    id: 'wa-ketelmeer', naam: 'Ketelmeer', noem: 'het Ketelmeer', soort: 'water', provincies: ['pv-overijssel', 'pv-flevoland'], gebied: 'wa-ketelmeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-ketelmeer', tekst: 'Waar ligt het Ketelmeer?' },
      dat: { id: 'nl-dat-wa-ketelmeer', tekst: 'Het goede antwoord is het Ketelmeer.' },
    },
  },
  {
    id: 'wa-zwarte-meer', naam: 'Zwarte Meer', noem: 'het Zwarte Meer', soort: 'water', provincies: ['pv-overijssel', 'pv-flevoland'], gebied: 'wa-zwarte-meer',
    zinnen: {
      waar: { id: 'nl-waar-wa-zwarte-meer', tekst: 'Waar ligt het Zwarte Meer?' },
      dat: { id: 'nl-dat-wa-zwarte-meer', tekst: 'Het goede antwoord is het Zwarte Meer.' },
    },
  },
  {
    id: 'wa-randmeren', naam: 'Randmeren', noem: 'de Randmeren', soort: 'water', provincies: ['pv-flevoland', 'pv-gelderland', 'pv-utrecht', 'pv-noord-holland'], gebied: 'wa-randmeren',
    zinnen: {
      waar: { id: 'nl-waar-wa-randmeren', tekst: 'Waar ligt de Randmeren?' },
      dat: { id: 'nl-dat-wa-randmeren', tekst: 'Het goede antwoord is de Randmeren.' },
    },
  },
  {
    id: 'wa-lauwersmeer', naam: 'Lauwersmeer', noem: 'het Lauwersmeer', soort: 'water', provincies: ['pv-groningen', 'pv-friesland'], gebied: 'wa-lauwersmeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-lauwersmeer', tekst: 'Waar ligt het Lauwersmeer?' },
      dat: { id: 'nl-dat-wa-lauwersmeer', tekst: 'Het goede antwoord is het Lauwersmeer.' },
    },
  },
  {
    id: 'wa-zuidlaardermeer', naam: 'Zuidlaardermeer', noem: 'het Zuidlaardermeer', soort: 'water', provincies: ['pv-groningen', 'pv-drenthe'], gebied: 'wa-zuidlaardermeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-zuidlaardermeer', tekst: 'Waar ligt het Zuidlaardermeer?' },
      dat: { id: 'nl-dat-wa-zuidlaardermeer', tekst: 'Het goede antwoord is het Zuidlaardermeer.' },
    },
  },
  {
    id: 'wa-paterswoldsemeer', naam: 'Paterswoldsemeer', noem: 'het Paterswoldsemeer', soort: 'water', provincies: ['pv-groningen', 'pv-drenthe'], gebied: 'wa-paterswoldsemeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-paterswoldsemeer', tekst: 'Waar ligt het Paterswoldsemeer?' },
      dat: { id: 'nl-dat-wa-paterswoldsemeer', tekst: 'Het goede antwoord is het Paterswoldsemeer.' },
    },
  },
  {
    id: 'wa-schildmeer', naam: 'Schildmeer', noem: 'het Schildmeer', soort: 'water', provincies: ['pv-groningen'], gebied: 'wa-schildmeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-schildmeer', tekst: 'Waar ligt het Schildmeer?' },
      dat: { id: 'nl-dat-wa-schildmeer', tekst: 'Het goede antwoord is het Schildmeer.' },
    },
  },
  {
    id: 'wa-oldambtmeer', naam: 'Oldambtmeer', noem: 'het Oldambtmeer', soort: 'water', provincies: ['pv-groningen'], gebied: 'wa-oldambtmeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-oldambtmeer', tekst: 'Waar ligt het Oldambtmeer?' },
      dat: { id: 'nl-dat-wa-oldambtmeer', tekst: 'Het goede antwoord is het Oldambtmeer.' },
    },
  },
  {
    id: 'wa-alkmaardermeer', naam: 'Alkmaardermeer', noem: 'het Alkmaardermeer', soort: 'water', provincies: ['pv-noord-holland'], gebied: 'wa-alkmaardermeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-alkmaardermeer', tekst: 'Waar ligt het Alkmaardermeer?' },
      dat: { id: 'nl-dat-wa-alkmaardermeer', tekst: 'Het goede antwoord is het Alkmaardermeer.' },
    },
  },
  {
    id: 'wa-loosdrechtse-plassen', naam: 'Loosdrechtse Plassen', noem: 'de Loosdrechtse Plassen', soort: 'water', provincies: ['pv-utrecht', 'pv-noord-holland'], gebied: 'wa-loosdrechtse-plassen',
    zinnen: {
      waar: { id: 'nl-waar-wa-loosdrechtse-plassen', tekst: 'Waar ligt de Loosdrechtse Plassen?' },
      dat: { id: 'nl-dat-wa-loosdrechtse-plassen', tekst: 'Het goede antwoord is de Loosdrechtse Plassen.' },
    },
  },
  {
    id: 'wa-vinkeveense-plassen', naam: 'Vinkeveense Plassen', noem: 'de Vinkeveense Plassen', soort: 'water', provincies: ['pv-utrecht'], gebied: 'wa-vinkeveense-plassen',
    zinnen: {
      waar: { id: 'nl-waar-wa-vinkeveense-plassen', tekst: 'Waar ligt de Vinkeveense Plassen?' },
      dat: { id: 'nl-dat-wa-vinkeveense-plassen', tekst: 'Het goede antwoord is de Vinkeveense Plassen.' },
    },
  },
  {
    id: 'wa-westeinderplassen', naam: 'Westeinderplassen', noem: 'de Westeinderplassen', soort: 'water', provincies: ['pv-noord-holland', 'pv-zuid-holland'], gebied: 'wa-westeinderplassen',
    zinnen: {
      waar: { id: 'nl-waar-wa-westeinderplassen', tekst: 'Waar ligt de Westeinderplassen?' },
      dat: { id: 'nl-dat-wa-westeinderplassen', tekst: 'Het goede antwoord is de Westeinderplassen.' },
    },
  },
  {
    id: 'wa-kagerplassen', naam: 'Kagerplassen', noem: 'de Kagerplassen', soort: 'water', provincies: ['pv-noord-holland', 'pv-zuid-holland'], gebied: 'wa-kagerplassen',
    zinnen: {
      waar: { id: 'nl-waar-wa-kagerplassen', tekst: 'Waar ligt de Kagerplassen?' },
      dat: { id: 'nl-dat-wa-kagerplassen', tekst: 'Het goede antwoord is de Kagerplassen.' },
    },
  },
  {
    id: 'wa-nieuwkoopse-plassen', naam: 'Nieuwkoopse Plassen', noem: 'de Nieuwkoopse Plassen', soort: 'water', provincies: ['pv-utrecht', 'pv-zuid-holland'], gebied: 'wa-nieuwkoopse-plassen',
    zinnen: {
      waar: { id: 'nl-waar-wa-nieuwkoopse-plassen', tekst: 'Waar ligt de Nieuwkoopse Plassen?' },
      dat: { id: 'nl-dat-wa-nieuwkoopse-plassen', tekst: 'Het goede antwoord is de Nieuwkoopse Plassen.' },
    },
  },
  {
    id: 'wa-reeuwijkse-plassen', naam: 'Reeuwijkse Plassen', noem: 'de Reeuwijkse Plassen', soort: 'water', provincies: ['pv-zuid-holland'], gebied: 'wa-reeuwijkse-plassen',
    zinnen: {
      waar: { id: 'nl-waar-wa-reeuwijkse-plassen', tekst: 'Waar ligt de Reeuwijkse Plassen?' },
      dat: { id: 'nl-dat-wa-reeuwijkse-plassen', tekst: 'Het goede antwoord is de Reeuwijkse Plassen.' },
    },
  },
  {
    id: 'wa-brielse-meer', naam: 'Brielse Meer', noem: 'het Brielse Meer', soort: 'water', provincies: ['pv-zuid-holland'], gebied: 'wa-brielse-meer',
    zinnen: {
      waar: { id: 'nl-waar-wa-brielse-meer', tekst: 'Waar ligt het Brielse Meer?' },
      dat: { id: 'nl-dat-wa-brielse-meer', tekst: 'Het goede antwoord is het Brielse Meer.' },
    },
  },
  {
    id: 'wa-haringvliet', naam: 'Haringvliet', noem: 'het Haringvliet', soort: 'water', provincies: ['pv-zuid-holland'], gebied: 'wa-haringvliet',
    zinnen: {
      waar: { id: 'nl-waar-wa-haringvliet', tekst: 'Waar ligt het Haringvliet?' },
      dat: { id: 'nl-dat-wa-haringvliet', tekst: 'Het goede antwoord is het Haringvliet.' },
    },
  },
  {
    id: 'wa-grevelingenmeer', naam: 'Grevelingenmeer', noem: 'het Grevelingenmeer', soort: 'water', provincies: ['pv-zuid-holland', 'pv-zeeland'], gebied: 'wa-grevelingenmeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-grevelingenmeer', tekst: 'Waar ligt het Grevelingenmeer?' },
      dat: { id: 'nl-dat-wa-grevelingenmeer', tekst: 'Het goede antwoord is het Grevelingenmeer.' },
    },
  },
  {
    id: 'wa-volkerak', naam: 'Volkerak', noem: 'het Volkerak', soort: 'water', provincies: ['pv-zuid-holland', 'pv-zeeland', 'pv-noord-brabant'], gebied: 'wa-volkerak',
    zinnen: {
      waar: { id: 'nl-waar-wa-volkerak', tekst: 'Waar ligt het Volkerak?' },
      dat: { id: 'nl-dat-wa-volkerak', tekst: 'Het goede antwoord is het Volkerak.' },
    },
  },
  {
    id: 'wa-zoommeer', naam: 'Zoommeer', noem: 'het Zoommeer', soort: 'water', provincies: ['pv-zeeland', 'pv-noord-brabant'], gebied: 'wa-zoommeer',
    zinnen: {
      waar: { id: 'nl-waar-wa-zoommeer', tekst: 'Waar ligt het Zoommeer?' },
      dat: { id: 'nl-dat-wa-zoommeer', tekst: 'Het goede antwoord is het Zoommeer.' },
    },
  },
  {
    id: 'wa-oosterschelde', naam: 'Oosterschelde', noem: 'de Oosterschelde', soort: 'water', provincies: ['pv-zeeland'], gebied: 'wa-oosterschelde',
    zinnen: {
      waar: { id: 'nl-waar-wa-oosterschelde', tekst: 'Waar ligt de Oosterschelde?' },
      dat: { id: 'nl-dat-wa-oosterschelde', tekst: 'Het goede antwoord is de Oosterschelde.' },
    },
  },
  {
    id: 'wa-veerse-meer', naam: 'Veerse Meer', noem: 'het Veerse Meer', soort: 'water', provincies: ['pv-zeeland'], gebied: 'wa-veerse-meer',
    zinnen: {
      waar: { id: 'nl-waar-wa-veerse-meer', tekst: 'Waar ligt het Veerse Meer?' },
      dat: { id: 'nl-dat-wa-veerse-meer', tekst: 'Het goede antwoord is het Veerse Meer.' },
    },
  },
  {
    id: 'wa-westerschelde', naam: 'Westerschelde', noem: 'de Westerschelde', soort: 'water', provincies: ['pv-zeeland'], gebied: 'wa-westerschelde',
    zinnen: {
      waar: { id: 'nl-waar-wa-westerschelde', tekst: 'Waar ligt de Westerschelde?' },
      dat: { id: 'nl-dat-wa-westerschelde', tekst: 'Het goede antwoord is de Westerschelde.' },
    },
  },
];
