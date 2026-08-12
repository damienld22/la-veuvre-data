import { HeightData } from "./types";

const API_DATA_HEIGHT =
  "https://www.vigicrues.gouv.fr/services/observations.json/index.php?CdStationHydro=J708311001&FormatDate=iso";
const STATIC_DATA_HEIGHT = `${import.meta.env.BASE_URL}data/height.json`;

export async function fetchHeightData(): Promise<HeightData[]> {
  const url = import.meta.env.DEV ? API_DATA_HEIGHT : STATIC_DATA_HEIGHT;
  const data = await (await fetch(url)).json();

  return data.Serie.ObssHydro.map((elt: any) => ({
    value: elt.ResObsHydro,
    date: elt.DtObsHydro,
  })).reverse() as HeightData[];
}
