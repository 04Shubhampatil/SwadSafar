# SwadSafar - Next Generation Recipe Sharing Platform

Welcome to **Foodi**, a modern web application built with Next.js that enables users to discover, share, and manage recipes in an interactive community environment.

## 🚀 Features

### Core Features
- **Recipe Discovery**: Browse and search through a diverse collection of recipes
- **Community Sharing**: Share your own recipes with the community
- **Favorites Management**: Save your favorite recipes for quick access
- **Saved Recipes**: Build your personal collection of recipes to try
- **User Profiles**: Customize your profile and track your recipe contributions
- **AI-Powered Features**: Generate recipes using AI (Mistral integration)
- **Real-time Notifications**: Stay updated with community activities
- **Recipe Reviews & Ratings**: Rate and review recipes from other users
- **Recipe Stats**: Track recipe popularity and engagement metrics

### User Experience
- **Responsive Design**: Fully responsive UI that works on all devices
- **Dark/Light Theme Support**: Customizable theme settings
- **Loading States**: Smooth loading skeletons for better UX
- **Error Handling**: Graceful error boundaries and error pages
- **Authentication**: Secure user authentication via Supabase

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2.9 with React 19
- **Styling**: Tailwind CSS 4 with PostCSS
- **UI Components**: Lucide React (icons), Framer Motion (animations)
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner toast notifications

### Backend & Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with SSR support
- **AI Integration**: Mistral AI for recipe generation
- **Image Processing**: AI-powered image generation capabilities

### Development Tools
- **Linting**: ESLint 9
- **Type Safety**: TypeScript
- **Build Optimization**: Babel React Compiler

## 📁 Project Structure

```
foodi-next/
├── app/
│   ├── (auth)/                 # Authentication pages and components
│   │   ├── sign-in/           # Sign in page
│   │   ├── sign-up/           # Sign up page
│   │   └── _components/       # Auth-specific components
│   ├── api/                   # API routes
│   │   ├── community/         # Community endpoints
│   │   ├── favorites/         # Favorites management
│   │   ├── notifications/     # Notification endpoints
│   │   ├── profile/           # Profile endpoints
│   │   ├── recipes/           # Recipe endpoints
│   │   └── saved-recipes/     # Saved recipes endpoints
│   ├── community/             # Community page
│   ├── favorites/             # Favorites page
│   ├── generate-recipe/       # AI recipe generation
│   ├── my-recipes/            # User's recipes page
│   ├── notifications/         # Notifications page
│   ├── profile/               # User profile page
│   ├── recipes/               # Recipe listing and details
│   ├── saved-recipes/         # Saved recipes page
│   └── about-us/              # About page
├── components/                # Reusable components
│   ├── ui/                    # Base UI components
│   └── home/                  # Home-specific components
├── lib/                       # Utility functions and hooks
│   ├── supabase/             # Supabase integration
│   ├── ai/                   # AI integration (Mistral, image generation)
│   ├── validations/          # Schema validations
│   └── hooks/                # Custom React hooks
├── public/                    # Static assets
├── supabase/                  # Database migrations and schema
├── json/                      # JSON data files
└── config files               # tsconfig, tailwind, eslint, etc.
```

## 🔄 Key Routes & Pages

| Route | Purpose |
|-------|---------|
| `/` | Home page with trending recipes |
| `/recipes` | All recipes listing |
| `/recipes/[id]` | Recipe detail page |
| `/generate-recipe` | AI-powered recipe generation |
| `/my-recipes` | User's personal recipes |
| `/favorites` | User's favorite recipes |
| `/saved-recipes` | User's saved recipes |
| `/community` | Community feed and interactions |
| `/profile` | User profile management |
| `/notifications` | User notifications |
| `/about-us` | About the platform |
| `/sign-in` | Authentication login |
| `/sign-up` | User registration |

## 🔐 Security Features

- **Rate Limiting**: API rate limiting to prevent abuse
- **Input Validation**: Comprehensive validation for all user inputs using Zod
- **Authentication Middleware**: Secure route protection with Supabase SSR
- **Environment Variables**: Sensitive data stored in environment configuration

## 📊 Database Schema

The application includes comprehensive database migrations:
- **Recipe Management**: Recipe details, ingredients, instructions
- **User Management**: Profile information, preferences
- **Community Features**: Recipe reviews, ratings, and statistics
- **Notifications**: User activity tracking and notifications
- **Relationships**: Many-to-many relationships for recipes and user interactions

See `supabase/schema.sql` and migrations in `supabase/migrations/` for full schema details.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd foodi-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_key
   NEXT_PUBLIC_MISTRAL_API_KEY=your_mistral_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Database Setup**
   - Initialize Supabase migrations using the files in `supabase/migrations/`
   - Run the schema setup from `supabase/schema.sql`

## 📸 Application Screenshots

### Home Page & Recipe Discovery
![Home Page](./appScrenshoot/Screenshot%202026-08-14%20110923.png)

### Recipe Browsing & Details
![Recipe Page 1](./appScrenshoot/Screenshot%202026-08-14%20110940.png)

### Community & User Interaction
![Community Page](./appScrenshoot/Screenshot%202026-08-14%20111140.png)

### User Dashboard & Profile
![Profile Page](./appScrenshoot/Screenshot%202026-08-14%20111218.png)

## 📝 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 🎨 Customization

### Theme Configuration
The app supports light/dark themes. Theme configuration is managed in:
- `components/ThemeInitializer.jsx` - Theme initialization logic
- `app/globals.css` - Global styles and theme variables

### Styling
- Tailwind CSS classes are used throughout
- PostCSS for CSS processing
- Responsive breakpoints for mobile-first design

## 🧪 Testing & Quality

- ESLint for code quality
- TypeScript for type safety
- React Hook Form for form validation
- Zod for schema validation

## 📚 API Endpoints

The application provides REST API endpoints for:
- **Recipes**: CRUD operations for recipes
- **Favorites**: Add/remove favorite recipes
- **Saved Recipes**: Manage saved recipe collections
- **Community**: Community feed and interactions
- **Notifications**: Notification management
- **Profile**: User profile operations

## 🔄 Middleware

The application includes Next.js middleware (`middleware.js`) for:
- Authentication and authorization checks
- Request routing
- Session management via Supabase SSR

## 🐛 Error Handling

- Error boundaries on key pages (favorites, my-recipes, notifications, profile)
- Loading states with skeletons during data fetching
- User-friendly error messages
- Graceful fallbacks for failed operations

## 📦 Dependencies

### Production Dependencies
- `@supabase/ssr` - Server-side rendering support for Supabase
- `@supabase/supabase-js` - Supabase JavaScript client
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `sonner` - Toast notifications

### Development Dependencies
- `@tailwindcss/postcss` - Tailwind CSS PostCSS plugin
- `typescript` - Type checking
- `babel-plugin-react-compiler` - React compiler optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or support, please reach out to the development team.

---

**Happy Cooking! 🍳**

*Foodi - Where Food Lovers Share Recipes*
