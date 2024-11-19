import { HeightData } from "./types";

const API_DATA_HEIGHT =
  "https://www.vigicrues.gouv.fr/services/observations.json/index.php?CdStationHydro=J708311001&FormatDate=iso";

export async function fetchHeightData(): Promise<HeightData[]> {
  const data = await (await fetch(API_DATA_HEIGHT)).json();

  return data.Serie.ObssHydro.map((elt: any) => ({
    value: elt.ResObsHydro,
    date: elt.DtObsHydro,
  })).reverse() as HeightData[];
}
