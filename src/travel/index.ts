export type TravelMetadata = {
  id: number;
  continent: string;
  country: string;
  city: string;
  date: string;
};

const travelModules = import.meta.glob<TravelMetadata[]>("./metadata.json", {
  eager: true,
  import: "default",
});

export const locations = Object.values(travelModules).flat().reverse();

export const locationPhotos: Record<number, string[]> = {};

const allTravelPhotoPaths = Object.keys(
  import.meta.glob("../../public/travel/**/*.{jpg,jpeg,png,webp,avif}"),
);

for (const location of locations) {
  const locationFolder = `../../public/travel/${location.city} ${location.country} ${location.date}/`;

  locationPhotos[location.id] = allTravelPhotoPaths
    .filter((path) => path.startsWith(locationFolder))
    .map((path) => path.replace(locationFolder, ""));
}
