# Database Seeding Guide for Gestura

This guide explains how to populate your Gestura application with sample data for development and testing purposes.

## Overview

The seeding system creates:
- **6 sample users** with realistic profiles and profile photos
- **10 sample posts** with captions, video URLs, and sign language translations
- **Follow relationships** between users to create a social network

## Quick Start

### 1. Set up your Convex URL

Make sure your `CONVEX_URL` is set in your environment. You can find this in:
- Your `.env.local` file
- Your Convex dashboard

### 2. Seed the database

```bash
# Navigate to the client directory
cd client

# Populate with sample data
npm run seed

# Check the status
npm run seed:status

# Clear sample data (if needed)
npm run seed:clear
```

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run seed` | Populate database with sample data |
| `npm run seed:status` | Show current data counts |
| `npm run seed:clear` | Remove all sample data |

## Sample Data Details

### Users Created

The seeding script creates 6 diverse users:

1. **Sarah Johnson** (`@sarah_signs`) - Learning enthusiast
2. **Michael Chen** (`@mike_gestures`) - Nature lover
3. **Emma Williams** (`@emma_hands`) - Cooking enthusiast
4. **David Brown** (`@david_signing`) - Technology advocate
5. **Lisa Garcia** (`@lisa_communicates`) - Lifestyle blogger
6. **James Wilson** (`@james_gestures`) - Artist and musician

### Posts Created

10 sample posts covering various topics:
- Learning sign language
- Nature and outdoor activities
- Cooking and recipes
- Technology and accessibility
- Lifestyle and wellness
- Art and creativity
- Fitness and health
- Travel experiences
- Family moments
- Music and hobbies

### Social Network

The script creates a realistic social network with follow relationships:
- Each user follows 3-4 other users
- Creates a connected community
- Simulates real social media interactions

## Manual Seeding (Advanced)

If you prefer to seed data manually or customize the sample data:

### Using Convex Dashboard

1. Go to your Convex dashboard
2. Navigate to the Functions tab
3. Run the following mutations:

```javascript
// Seed the database
await ctx.runMutation("seed:seedDatabasePublic");

// Clear sample data
await ctx.runMutation("seed:clearAllDataPublic");
```

### Using the Convex CLI

```bash
# Seed the database
npx convex run seed:seedDatabasePublic

# Clear sample data
npx convex run seed:clearAllDataPublic
```

## Customizing Sample Data

To modify the sample data, edit `client/convex/seed.ts`:

### Adding More Users

```typescript
const sampleUsers = [
  // ... existing users
  {
    firstName: "Your",
    lastName: "Name",
    username: "your_username",
    email: "your.email@example.com",
    profilePhoto: "https://your-photo-url.com/image.jpg",
    externalId: "sample_user_7",
  },
];
```

### Adding More Posts

```typescript
const samplePosts = [
  // ... existing posts
  {
    caption: "Your custom post caption here!",
    postVideo: "https://your-video-url.com/video.mp4",
    signVideo: "https://your-sign-video-url.com/sign.mp4",
    tag: "your-tag",
  },
];
```

### Modifying Follow Relationships

```typescript
const relationships = [
  [0, 1], [0, 2], // User 0 follows users 1 and 2
  [1, 0], [1, 3], // User 1 follows users 0 and 3
  // Add more relationships as needed
];
```

## Troubleshooting

### Common Issues

1. **"Please set your CONVEX_URL" error**
   - Make sure your Convex URL is set in `.env.local`
   - Check that your Convex deployment is active

2. **"User already exists" messages**
   - This is normal if you've run the seed script before
   - The script skips existing users to avoid duplicates

3. **Permission errors**
   - Make sure you're using the correct Convex deployment
   - Check that your authentication is working

### Resetting Everything

If you want to start fresh:

```bash
# Clear all sample data
npm run seed:clear

# Wait a moment, then seed again
npm run seed
```

## Data Structure

### User Schema
```typescript
{
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePhoto: string;
  externalId: string;
  posts: string[];
  savedPosts: string[];
  likedPosts: string[];
  followers: string[];
  following: string[];
}
```

### Post Schema
```typescript
{
  creatorId: string;
  caption: string;
  postVideo: string;
  signVideo?: string;
  tag: string;
}
```

### Relationship Schema
```typescript
{
  followerUserId: string;
  followedUserId: string;
}
```

## Best Practices

1. **Development Only**: Only use this seeding in development environments
2. **Backup Data**: Always backup important data before clearing
3. **Customize**: Modify the sample data to match your testing needs
4. **Clean Up**: Clear sample data before deploying to production

## Support

If you encounter any issues with the seeding process:

1. Check the console output for error messages
2. Verify your Convex URL and authentication
3. Ensure all dependencies are installed
4. Check the Convex dashboard for any deployment issues

For more help, refer to the [Convex documentation](https://docs.convex.dev) or the main project README.



