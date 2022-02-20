export class Entry {
  id: number;
  country: string;
  province: string;
  confCases: number;
  deaths: number;
  recovereds: number;
  actCases: number;

  constructor(
    id: number,
    country: string,
    province: string,
    confCases: number,
    deaths: number,
    recovereds: number,
    actCases: number
  ) {
    this.id = id;
    this.country = country;
    this.province = province;
    this.confCases = confCases;
    this.deaths = deaths;
    this.recovereds = recovereds;
    this.actCases = actCases;
  }
}
