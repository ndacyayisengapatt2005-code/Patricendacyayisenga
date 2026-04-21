import { Species } from "./types";

export const RWANDA_PARKS = {
  VOLCANOES: {
    name: "Volcanoes National Park",
    center: [29.5, -1.47] as [number, number],
    description: "Home to the rare mountain gorillas and rich montane ecosystems."
  },
  AKAGERA: {
    name: "Akagera National Park",
    center: [30.7, -1.8] as [number, number],
    description: "Central Africa's largest protected wetland and the last refuge for savannah species in Rwanda."
  },
  NYUNGWE: {
    name: "Nyungwe Forest National Park",
    center: [29.2, -2.48] as [number, number],
    description: "One of the oldest rainforests in Africa, home to chimps and spectacular biodiversity."
  }
};

export const INITIAL_SPECIES_DATA: Species[] = [
  {
    id: "gorilla-1",
    name: "Mountain Gorilla",
    scientificName: "Gorilla beringei beringei",
    description: "Majestic primates living in the high altitudes of the Virunga Mountains.",
    habitat: "Montane Rainforest",
    behavior: "Highly social, living in troops led by a silverback.",
    characteristics: ["Large size", "Broad chest", "Silver back hair in adult males"],
    imageUrl: "https://picsum.photos/seed/gorilla/800/600",
    status: "Endangered",
    location: {
      lat: -1.48,
      lng: 29.54,
      park: "Volcanoes National Park",
      district: "Musanze"
    }
  },
  {
    id: "elephant-1",
    name: "African Savannah Elephant",
    scientificName: "Loxodonta africana",
    description: "The largest land mammal on earth, roaming the plains of Akagera.",
    habitat: "Savannah & Wetlands",
    behavior: "Intelligent, emotional, and matriarchal family structures.",
    characteristics: ["Long trunk", "Large ears", "Tusks"],
    imageUrl: "https://picsum.photos/seed/elephant/800/600",
    status: "Vulnerable",
    location: {
      lat: -1.75,
      lng: 30.75,
      park: "Akagera National Park",
      district: "Kayonza"
    }
  },
  {
    id: "chimp-1",
    name: "Chimpanzee",
    scientificName: "Pan troglodytes",
    description: "Our closest living relatives, thriving in the dense canopy of Nyungwe.",
    habitat: "Tropical Rainforest",
    behavior: "Omnivorous, tool-using, and complex social interactions.",
    characteristics: ["Agile climbers", "Expressive faces", "Social groups"],
    imageUrl: "https://picsum.photos/seed/chimp/800/600",
    status: "Endangered",
    location: {
      lat: -2.45,
      lng: 29.25,
      park: "Nyungwe Forest National Park",
      district: "Nyamagabe"
    }
  }
];
