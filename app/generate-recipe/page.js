import RecipeForm from "./RecipeForm";

export const metadata = {
  title: "Create Recipe — Foodi",
  description:
    "Create your signature recipe with an AI-powered kitchen studio. Generate recipes, craft ingredients and steps, and publish to the community.",
};

export default function GenerateRecipePage() {
  return (
    <main className="min-h-screen bg-[#FFF9F3] py-10 lg:py-14">
      <RecipeForm />
    </main>
  );
}
