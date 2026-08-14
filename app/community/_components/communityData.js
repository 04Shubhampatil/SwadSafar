export const HERO_STATS = [
  { label: "Members", value: 48200, suffix: "+", icon: "Users", sub: "chefs & food lovers" },
  { label: "Recipes Shared", value: 126400, suffix: "+", icon: "BookOpen", sub: "from home kitchens" },
  { label: "Cook-alongs Today", value: 1340, suffix: "", icon: "Flame", sub: "live & replay" },
  { label: "Recipe Collections", value: 8900, suffix: "+", icon: "LayoutGrid", sub: "curated by members" },
];

export const TRENDING_HASHTAGS = [
  { tag: "#biryaninational", posts: "12.4k", hot: true },
  { tag: "#sundaybrunch", posts: "8.1k" },
  { tag: "#30minutemeals", posts: "6.7k" },
  { tag: "#sourdoughchronicles", posts: "4.9k" },
  { tag: "#streetfoodatHome", posts: "3.2k" },
  { tag: "#meatfreefriday", posts: "2.8k" },
];

export const ACTIVE_MEMBERS = [
  { name: "Priya", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80" },
  { name: "Tom", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
  { name: "Aisha", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" },
  { name: "Diego", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80" },
  { name: "Mei", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" },
  { name: "Ravi", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80" },
  { name: "Sofia", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80" },
  { name: "Kenji", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
];

export const ACHIEVEMENTS = [
  { icon: "Flame", label: "Biryani Binge", progress: 82, color: "text-orange-600 bg-orange-100" },
  { icon: "Croissant", label: "Sourdough Starter", progress: 45, color: "text-amber-600 bg-amber-100" },
  { icon: "Sparkles", label: "Spice Master", progress: 68, color: "text-rose-600 bg-rose-100" },
  { icon: "Star", label: "Top Reviewer", progress: 91, color: "text-yellow-600 bg-yellow-100" },
  { icon: "Trophy", label: "Recipe Royale", progress: 30, color: "text-indigo-600 bg-indigo-100" },
];

export const CATEGORIES = [
  { label: "Breakfast", icon: "Sunrise" },
  { label: "Lunch", icon: "Sun" },
  { label: "Dinner", icon: "MoonStar" },
  { label: "Dessert", icon: "CakeSlice" },
  { label: "Snack", icon: "Popcorn" },
  { label: "Vegan", icon: "Leaf" },
  { label: "Quick", icon: "Zap" },
];

export const TOP_CHEFS = [
  {
    name: "Chef Maria",
    handle: "@chefmaria",
    avatar: "/cardImage/chef_maria.webp",
    bio: "Homestyle comfort, global soul",
    followers: "48.2k",
    verified: true,
  },
  {
    name: "Chef Rahul",
    handle: "@spiceroute",
    avatar: "/cardImage/1.webp",
    bio: "Street food to fine dining",
    followers: "36.7k",
    verified: true,
  },
  {
    name: "Linh Nguyen",
    handle: "@linhcooks",
    avatar: "/cardImage/2.webp",
    bio: "Fresh, fast, beautiful bowls",
    followers: "22.4k",
    verified: false,
  },
];

export const EVENTS = [
  { title: "Live · Dosa Masterclass", host: "Chef Meenakshi", date: "Sat", time: "7:00 PM", viewers: 2400, image: "/cardImage/avocado_toast.webp", live: false },
  { title: "Kombucha & Fermentation", host: "Foodie Labs", date: "Sun", time: "4:00 PM", viewers: 830, image: "/cardImage/tomato_pasta.webp", live: false },
  { title: "Midnight Biryani Cook-Off", host: "Spice Route", date: "Fri", time: "9:00 PM", viewers: 5100, image: "/cardImage/chicken_tikka.webp", live: true },
];

export const LEADERBOARD = [
  { rank: 1, name: "Chef Maria", avatar: "/cardImage/chef_maria.webp", points: 28400, streak: 48, color: "text-amber-500" },
  { rank: 2, name: "Arjun Mehta", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", points: 25120, streak: 36, color: "text-slate-400" },
  { rank: 3, name: "Sofia Reyes", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80", points: 22380, streak: 29, color: "text-orange-700" },
  { rank: 4, name: "Kenji Tanaka", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", points: 19840, streak: 21, color: "text-slate-500" },
  { rank: 5, name: "Amara Osei", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80", points: 17010, streak: 15, color: "text-slate-500" },
];

export const POPULAR_TAGS = ["#tiffin", "#airfryer", "#mealprep", "#pasta", "#dessert", "#indian", "#italian", "#one-pot"];

export const TRENDING_RECIPES = [
  { title: "Chicken Tikka Skewers", category: "Dinner", time: "35 min", difficulty: "Easy", image: "/cardImage/chicken_tikka.webp", likes: 8400, author: "Chef Maria" },
  { title: "Lava Cake duet", category: "Dessert", time: "20 min", difficulty: "Medium", image: "/cardImage/lava_cake.webp", likes: 6200, author: "Coco Kitchen" },
  { title: "Tomato Basil Pasta", category: "Lunch", time: "25 min", difficulty: "Easy", image: "/tomato_pasta.webp", likes: 5800, author: "Linh Cooks" },
  { title: "Avocado Toast Fiesta", category: "Breakfast", time: "10 min", difficulty: "Easy", image: "/cardImage/avocado_toast.webp", likes: 4100, author: "Priya Eats" },
  { title: "Herb Garden Plate", category: "Vegan", time: "30 min", difficulty: "Medium", image: "/cardImage/0.webp", likes: 3900, author: "Green Bowl" },
];

export const COLLECTIONS = [
  { title: "Sunday Brunch", cover: "/cardImage/avocado_toast.webp", recipes: 42, members: "1.2k" },
  { title: "30-Min Weeknight", cover: "/cardImage/tomato_pasta.webp", recipes: 68, members: "2.1k" },
  { title: "Festive Feast", cover: "/cardImage/chicken_tikka.webp", recipes: 55, members: "980" },
  { title: "Decadent Desserts", cover: "/cardImage/lava_cake.webp", recipes: 31, members: "1.6k" },
  { title: "Healthy Bowls", cover: "/cardImage/0.webp", recipes: 47, members: "1.4k" },
];

export const RECIPE_ATTACHMENTS = [
  { title: "Chicken Tikka Skewers", image: "/cardImage/chicken_tikka.webp", time: "35 min" },
  { title: "Lava Cake", image: "/cardImage/lava_cake.webp", time: "20 min" },
  { title: "Tomato Basil Pasta", image: "/cardImage/tomato_pasta.webp", time: "25 min" },
  { title: "Avocado Toast", image: "/cardImage/avocado_toast.webp", time: "10 min" },
];

export const GIF_OPTIONS = [
  "/cardImage/chicken_tikka.webp",
  "/cardImage/lava_cake.webp",
  "/cardImage/tomato_pasta.webp",
  "/cardImage/avocado_toast.webp",
  "/cardImage/0.webp",
  "/cardImage/1.webp",
  "/cardImage/2.webp",
  "/cardImage/3.webp",
];

export const EMOJIS = [
  "🔥", "😋", "🤤", "❤️", "👨‍🍳", "🍳", "🥘", "🍜", "🍕", "🥗", "🍰", "🧁",
  "☕", "🍷", "🥂", "✨", "😍", "🙌", "👍", "🎉", "🍽️", "🥄", "🍤", "🧀",
];

export const SAMPLE_USERNAMES = ["@chefmaria", "@linhcooks", "@spiceroute", "@greenbowl", "@cocokitchen"];

export const WEEKLY_CHALLENGE = {
  title: "One-Pot Wonder",
  subtitle: "Cook an entire meal in a single pot or pan.",
  endsIn: "3 days left",
  entries: 1240,
  prize: "Featured chef spot + premium spice box",
  image: "/cardImage/tomato_pasta.webp",
  hashtag: "#OnePotWonder",
};

export const ACTIVITY = [
  { type: "recipe", text: "Chef Maria posted a new recipe", time: "2m ago", avatar: "/cardImage/chef_maria.webp" },
  { type: "like", text: "Arjun loved your biryani post", time: "14m ago", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80" },
  { type: "follow", text: "Sofia started following you", time: "1h ago", avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80" },
  { type: "comment", text: "Mei commented: “Saving this!”", time: "2h ago", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80" },
  { type: "recipe", text: "Kenji shared a fermentation tip", time: "3h ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80" },
];

const people = [
  {
    name: "Emily Chen",
    handle: "@emilycooks",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    verified: true,
    level: 12,
    levelName: "Master Chef",
    followers: "12.4k",
    timeAgo: "2h ago",
    category: "Dinner",
    content:
      "Just tried making this Moroccan tagine for the first time and it blew my mind! The combination of spices with dried apricots is absolutely incredible. Highly recommend serving over fluffy couscous with a squeeze of lemon.\n\nPro tip: let the tagine rest 10 minutes before serving — the sauce thickens and everything gets 10x better. I used preserved lemons this time and wow.",
    tags: ["#tagine", "#moroccan", "#one-pot"],
    images: ["/cardImage/chicken_tikka.webp", "/cardImage/tomato_pasta.webp", "/vegies.webp"],
    recipe: {
      title: "Moroccan Chicken Tagine",
      image: "/cardImage/chicken_tikka.webp",
      time: "75 min",
      difficulty: "Medium",
      servings: 4,
      calories: 620,
      ingredients: ["Chicken thighs", "Dried apricots", "Preserved lemon", "Cumin & cinnamon", "Fresh coriander"],
    },
    stats: { likes: 1284, comments: 86, shares: 210, saves: 743, views: 18400 },
    featured: true,
  },
  {
    name: "Marco Rossi",
    handle: "@marcobakes",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    verified: false,
    level: 9,
    levelName: "Pastry Pro",
    followers: "8.2k",
    timeAgo: "5h ago",
    category: "Breakfast",
    content:
      "My secret to the fluffiest pancakes: substitute buttermilk for regular milk and let the batter rest 5 minutes before cooking. No buttermilk? Add a splash of lemon juice to regular milk — 95% there.\n\nWhat are your pancake secrets? Drop them below 👇",
    tags: ["#pancakes", "#breakfast", "#fluffypancakes"],
    images: ["/cardImage/0.webp", "/cardImage/avocado_toast.webp"],
    recipe: {
      title: "Fluffy Buttermilk Pancakes",
      image: "/cardImage/0.webp",
      time: "20 min",
      difficulty: "Easy",
      servings: 3,
      calories: 480,
      ingredients: ["Buttermilk", "Self-raising flour", "Free-range eggs", "Vanilla", "Maple syrup"],
    },
    stats: { likes: 947, comments: 132, shares: 58, saves: 411, views: 12300 },
  }
];

export const SEED_POSTS = people.map(
  ({ name, handle, avatar, verified, level, levelName, followers, timeAgo, ...rest }) => ({
    author: { name, handle, avatar, verified, level, levelName, followers, timeAgo },
    ...rest,
  })
);
