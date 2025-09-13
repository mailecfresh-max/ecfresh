import { PinCode } from '../types';

export const kochiPinCodes: PinCode[] = [
  {"pin":"682011","area":"Ernakulam North","region":"Central Kochi"},
  {"pin":"682016","area":"Ernakulam College","region":"Central Kochi"},
  {"pin":"682018","area":"Ernakulam South / Kadavanthra","region":"Central Kochi"},
  {"pin":"682020","area":"Boat Jetty","region":"Central Kochi"},
  {"pin":"682031","area":"High Court","region":"Central Kochi"},
  {"pin":"682035","area":"Ernakulam Market","region":"Central Kochi"},
  {"pin":"682036","area":"Ernakulam Central","region":"Central Kochi"},
  {"pin":"682017","area":"Kaloor","region":"Kaloor/Kadavanthra"},
  {"pin":"682013","area":"Kathrikadavu","region":"Kaloor/Kadavanthra"},
  {"pin":"682019","area":"Palarivattom","region":"Kaloor/Kadavanthra"},
  {"pin":"682001","area":"Fort Kochi","region":"Fort Kochi/Mattancherry"},
  {"pin":"682002","area":"Mattancherry","region":"Fort Kochi/Mattancherry"},
  {"pin":"682005","area":"Thoppumpady","region":"Fort Kochi/Mattancherry"},
  {"pin":"682006","area":"Mundamveli","region":"Fort Kochi/Mattancherry"},
  {"pin":"682007","area":"Palluruthy","region":"Fort Kochi/Mattancherry"},
  {"pin":"682008","area":"Willingdon Island","region":"Fort Kochi/Mattancherry"},
  {"pin":"682024","area":"Edappally","region":"Edappally/Vyttila"},
  {"pin":"682025","area":"Vyttila","region":"Edappally/Vyttila"},
  {"pin":"682026","area":"Elamakkara","region":"Edappally/Vyttila"},
  {"pin":"682032","area":"Thammanam","region":"Edappally/Vyttila"},
  {"pin":"682033","area":"Changampuzha Nagar","region":"Edappally/Vyttila"},
  {"pin":"682021","area":"Thrikkakara / Vazhakkala","region":"Kakkanad/Thrikkakara"},
  {"pin":"682022","area":"Thrikkakara North","region":"Kakkanad/Thrikkakara"},
  {"pin":"682028","area":"Vennala","region":"Kakkanad/Thrikkakara"},
  {"pin":"682030","area":"Kakkanad","region":"Kakkanad/Thrikkakara"},
  {"pin":"682037","area":"CSEZ","region":"Kakkanad/Thrikkakara"},
  {"pin":"682009","area":"Kumbalangi","region":"Coastal Kochi"},
  {"pin":"682010","area":"Perumpadappu","region":"Coastal Kochi"},
  {"pin":"682012","area":"Chellanam","region":"Coastal Kochi"},
  {"pin":"682014","area":"Tripunithura","region":"Suburban Kochi"},
  {"pin":"682015","area":"Maradu","region":"Suburban Kochi"},
  {"pin":"682027","area":"Chittoor","region":"Suburban Kochi"},
  {"pin":"682034","area":"Cheranalloor","region":"Suburban Kochi"},
  {"pin":"683101","area":"Aluva Town","region":"Aluva Corridor"},
  {"pin":"683102","area":"Aluva East","region":"Aluva Corridor"},
  {"pin":"683103","area":"Aluva West","region":"Aluva Corridor"},
  {"pin":"683511","area":"Alangad","region":"Aluva Corridor"}
];

export const groupedPinCodes = kochiPinCodes.reduce((acc, pin) => {
  if (!acc[pin.region]) {
    acc[pin.region] = [];
  }
  acc[pin.region].push(pin);
  return acc;
}, {} as Record<string, PinCode[]>);