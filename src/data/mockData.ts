// Historical reference only — the app now reads/writes through
// dataProvider.ts against Supabase (see src/data/supabaseClient.ts), which
// was seeded with this exact data via a migration. Nothing in the app
// imports this file anymore; kept around as a record of the original seed
// and as a fallback dataset if the app is ever run without a backend again.
import type { Restaurant, DrinkEntry } from "../types";

export const restaurants: Restaurant[] = [
  { id: "r1", name: "Roadside Diner", neighborhood: "Lincoln Park", city: "Chicago", cuisineType: "American" },
  { id: "r2", name: "Corner Café", neighborhood: "River North", city: "Chicago", cuisineType: "Café" },
  { id: "r3", name: "Sakura Sushi", neighborhood: "West Loop", city: "Chicago", cuisineType: "Japanese" },
  { id: "r4", name: "Green Leaf Bistro", neighborhood: "Logan Square", city: "Chicago", cuisineType: "New American" },
  { id: "r5", name: "The Botanist", neighborhood: "Wicker Park", city: "Chicago", cuisineType: "Cocktail Bar" },
  { id: "r6", name: "Nightjar Lounge", neighborhood: "River North", city: "Chicago", cuisineType: "Cocktail Bar" },
];

export const drinkEntries: DrinkEntry[] = [
  {
    id: "d1", restaurantId: "r1", name: "Fountain Coke", category: "basic", rating: 1.5,
    flavorTags: ["sweet"], tastingNotes: "Just standard soda. Only other options were Sprite and lemonade.",
    ingredients: ["carbonated water", "high fructose corn syrup", "caramel color"], naProducts: [], isShared: false,
  },
  {
    id: "d2", restaurantId: "r2", name: "House Lemonade", category: "basic", rating: 2,
    flavorTags: ["sweet", "tart"], tastingNotes: "Fine but generic — tastes like a bottled mix, not fresh-squeezed.",
    ingredients: ["lemonade mix", "water", "ice"], naProducts: [], isShared: false,
  },
  {
    id: "d3", restaurantId: "r3", name: "Heineken 0.0", category: "alcohol-free-beer-wine", rating: 3.5,
    flavorTags: ["crisp", "malty"], tastingNotes: "Tastes close to the real thing, pairs well with sushi.",
    ingredients: ["NA beer"], naProducts: [{ brand: "Heineken", product: "0.0" }], isShared: false,
  },
  {
    id: "d4", restaurantId: "r3", name: "NA Sake Spritz", category: "alcohol-free-beer-wine", rating: 3,
    flavorTags: ["floral", "light"], tastingNotes: "A little thin, but refreshing with the meal.",
    ingredients: ["NA sake alternative", "soda water", "yuzu"],
    naProducts: [{ brand: "Sober Carpenter", product: "NA Sake" }],
    isShared: false,
  },
  {
    id: "d5", restaurantId: "r4", name: "Ginger Turmeric Fizz", category: "house-specialty", rating: 4,
    flavorTags: ["spicy", "citrus", "herbal"], tastingNotes: "Real ginger kick, not too sweet, nicely balanced.",
    ingredients: ["fresh ginger", "turmeric", "lime", "soda water", "honey"], naProducts: [], isShared: false,
  },
  {
    id: "d6", restaurantId: "r4", name: "Cucumber Mint Cooler", category: "house-specialty", rating: 3.5,
    flavorTags: ["herbal", "fresh"], tastingNotes: "Refreshing but a bit one-note by the second glass.",
    ingredients: ["cucumber", "mint", "lime", "soda water"], naProducts: [], isShared: false,
  },
  {
    id: "d7", restaurantId: "r5", name: "Smoked Rosemary No. 5", category: "mocktail-program", rating: 5,
    flavorTags: ["smoky", "herbal", "bitter"], isOffMenu: true,
    tastingNotes: "Incredible depth — smoked rosemary syrup with a real bitter finish. Tastes like an actual cocktail.",
    ingredients: ["smoked rosemary syrup", "grapefruit", "soda water", "NA bitters"],
    naProducts: [
      { brand: "Pathfinder", product: "Hemp & Root" },
      { brand: "Roots", product: "Divino" },
    ],
    notes: "Not on the printed menu — ask the bartender for it by name.",
    isShared: false,
  },
  {
    id: "d8", restaurantId: "r5", name: "Botanist Garden Spritz", category: "mocktail-program", rating: 4.5,
    flavorTags: ["floral", "citrus", "fruity"], tastingNotes: "Beautifully balanced, looks and tastes like a real spritz.",
    ingredients: ["NA elderflower cordial", "grapefruit", "soda water", "dried flowers"],
    naProducts: [{ brand: "Ghia", product: "Le Spritz" }],
    isShared: false,
  },
  {
    id: "d9", restaurantId: "r6", name: "Midnight Zero", category: "mocktail-program", rating: 5,
    flavorTags: ["bitter", "herbal", "smoky"], tastingNotes: "The best NA cocktail I've had anywhere — complex, not sweet, clearly real bartender effort.",
    ingredients: ["NA amaro alternative", "espresso", "NA orange bitters", "demerara syrup"],
    naProducts: [
      { brand: "Kin Euphorics", product: "High Rhode" },
      { brand: "Three Spirit", product: "Nightcap" },
    ],
    isShared: false,
  },
  {
    id: "d10", restaurantId: "r6", name: "Sparkling Yuzu", category: "mocktail-program", rating: 4,
    flavorTags: ["citrus", "tart", "fizzy"], tastingNotes: "Bright and clean, great palate cleanser between courses.",
    ingredients: ["yuzu juice", "soda water", "simple syrup"], naProducts: [], isShared: false,
  },
];
