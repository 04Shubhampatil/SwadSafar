import {
  Apple,
  Carrot,
  Cherry,
  Coffee,
  Croissant,
  Egg,
  IceCreamBowl,
  Pizza,
  Salad,
  Soup,
  Wheat,
} from "lucide-react";

/* ── Small helpers ─────────────────────────────────────── */

export const uid = () =>
  Math.random().toString(36).slice(2, 9) + Date.now().toString(36);

const QUANTITY_RE =
  /^([\d/.,\s]+\s*(?:cups?|tbsp|teaspoons?|tablespoons?|grams?|kgs?|ml|liters?|oz|pounds?|lb|lbs|cloves?|slices?|pcs?|pinch(?:es)?|dash(?:es)?|whole|handful(?:s)?)?)\s+(.+)$/i;

export function parseQuantity(text) {
  const match = text.trim().match(QUANTITY_RE);
  if (match) {
    return {
      quantity: match[1].trim().replace(/\s+/g, " "),
      name: match[2].trim(),
    };
  }
  return { quantity: "", name: text.trim() };
}

export function qualityOf(bytes) {
  if (bytes > 2 * 1024 * 1024) return "High";
  if (bytes > 600 * 1024) return "Medium";
  return "Low";
}

export const QUALITY_LABEL = {
  High: "High Quality",
  Medium: "Good Quality",
  Low: "Low Quality",
};

export const QUALITY_DOT = {
  High: "#22c55e",
  Medium: "#f59e0b",
  Low: "#ef4444",
};

export const estimatedCalories = (ingredientCount, totalMinutes) =>
  Math.max(160, 140 + ingredientCount * 46 + totalMinutes * 2);

/* ── Options ───────────────────────────────────────────── */

export const CUISINES = [
  "Italian",
  "Indian",
  "Mexican",
  "Chinese",
  "Thai",
  "Japanese",
  "French",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Korean",
  "Spanish",
  "Greek",
  "Vietnamese",
  "Brazilian",
];

export const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Keto",
  "High Protein",
  "Low Carb",
  "Gluten Free",
  "Dairy Free",
];

export const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];

export const INGREDIENT_SUGGESTIONS = [
  "Eggs",
  "Tomatoes",
  "Cheese",
  "Bread",
  "Butter",
  "Olive Oil",
  "Onion",
  "Garlic",
  "Chicken Breast",
  "Rice",
  "Pasta",
  "Potatoes",
  "Milk",
  "Flour",
  "Sugar",
  "Salt",
  "Black Pepper",
  "Basil",
  "Mushrooms",
  "Bell Pepper",
  "Carrot",
  "Spinach",
  "Yogurt",
  "Chili Flakes",
  "Lemon",
  "Honey",
  "Coconut Milk",
  "Soy Sauce",
  "Beef",
  "Shrimp",
  "Tofu",
  "Cilantro",
  "Paprika",
  "Cumin",
  "Ginger",
  "Broccoli",
  "Zucchini",
];

export const KNOWN_RECIPES = [
  "Creamy Tomato Pasta",
  "Chicken Tikka Masala",
  "Avocado Toast",
  "Chocolate Lava Cake",
  "Pasta",
  "Biryani",
  "Pancakes",
  "Omelette",
];

export const AI_MODES = [
  {
    id: "ingredients",
    label: "Generate from Ingredients",
    placeholder: "What ingredients do you have?",
  },
  {
    id: "dish",
    label: "Generate from Dish Name",
    placeholder: "Enter a dish name…",
  },
  {
    id: "healthy",
    label: "Generate Healthy Version",
    placeholder: "What would you like to make healthier?",
  },
  {
    id: "suggest",
    label: "Suggest Ingredients",
    placeholder: "What do you already have on hand?",
  },
  {
    id: "improve",
    label: "Improve Instructions",
    placeholder: "Select improve from any step, or let AI rewrite all",
  },
  {
    id: "nutrition",
    label: "Estimate Nutrition",
    placeholder: "Estimate calories & macros for your dish",
  },
];

export const AI_EXAMPLES = ["🥚 Eggs", "🍅 Tomatoes", "🧀 Cheese", "🍞 Bread"];

export const TIPS = [
  {
    title: "Clear titles get more saves",
    body: "Name dishes by their hero ingredient, like “Creamy Tomato Pasta”.",
  },
  {
    title: "Aim for 4–8 ingredients",
    body: "Simple lists are easier to shop for and cook on busy nights.",
  },
  {
    title: "Step by step wins",
    body: "Break instructions into short, numbered steps under 2 lines each.",
  },
];

/* ── Floating hero food icons ──────────────────────────── */

export const FOOD_FLOATERS = [
  { Icon: Pizza, className: "left-[4%] top-[16%]", size: 26, delay: 0 },
  { Icon: Apple, className: "left-[12%] top-[72%]", size: 22, delay: 1.2 },
  { Icon: Carrot, className: "left-[22%] top-[8%]", size: 24, delay: 2.1 },
  { Icon: Cherry, className: "right-[18%] top-[12%]", size: 22, delay: 0.6 },
  { Icon: Croissant, className: "right-[8%] top-[64%]", size: 26, delay: 1.8 },
  { Icon: Egg, className: "right-[26%] top-[78%]", size: 22, delay: 2.6 },
  { Icon: Coffee, className: "left-[38%] top-[88%]", size: 20, delay: 0.9 },
  { Icon: Soup, className: "right-[42%] top-[6%]", size: 22, delay: 1.5 },
  { Icon: Salad, className: "right-[4%] top-[38%]", size: 24, delay: 2.2 },
  { Icon: Wheat, className: "left-[6%] top-[42%]", size: 20, delay: 3.0 },
  { Icon: IceCreamBowl, className: "left-[46%] top-[10%]", size: 22, delay: 0.4 },
];
