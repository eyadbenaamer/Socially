import mongoose from "mongoose";
import User from "../models/user.js";
import Profile from "../models/profile.js";
import Post from "../models/post.js";
import { Types } from "mongoose";

// Configuration
const TOTAL_USERS = 1000; // Reduce to 10 for testing, increase for production seed
const MAX_POSTS_PER_USER = 100;
const MAX_FOLLOWERS = 100;
const PASSWORD = "password";

const FIRST_NAMES = [
  "Emma",
  "Liam",
  "Olivia",
  "Noah",
  "Ava",
  "William",
  "Sophia",
  "James",
  "Isabella",
  "Oliver",
  "Charlotte",
  "Elijah",
  "Amelia",
  "Benjamin",
  "Mia",
  "Lucas",
  "Harper",
  "Mason",
  "Evelyn",
  "Logan",
  "Abigail",
  "Alexander",
  "Emily",
  "Ethan",
  "Elizabeth",
  "Jacob",
  "Mila",
  "Michael",
  "Ella",
  "Daniel",
  "Avery",
  "Henry",
  "Sofia",
  "Jackson",
  "Camila",
  "Sebastian",
  "Aria",
  "Aiden",
  "Scarlett",
  "Matthew",
  "Victoria",
  "Samuel",
  "Madison",
  "David",
  "Luna",
  "Joseph",
  "Grace",
  "Carter",
  "Chloe",
  "Owen",
  "Penelope",
  "Wyatt",
  "Layla",
  "John",
  "Riley",
  "Jack",
  "Zoey",
  "Luke",
  "Nora",
  "Jayden",
  "Lily",
  "Dylan",
  "Eleanor",
  "Grayson",
  "Hannah",
  "Levi",
  "Lillian",
  "Isaac",
  "Addison",
  "Gabriel",
  "Aubrey",
  "Julian",
  "Ellie",
  "Mateo",
  "Stella",
  "Anthony",
  "Natalie",
  "Jaxon",
  "Zoe",
  "Lincoln",
  "Leah",
  "Joshua",
  "Hazel",
  "Christopher",
  "Violet",
  "Andrew",
  "Aurora",
  "Theodore",
  "Savannah",
  "Caleb",
  "Audrey",
  "Ryan",
  "Brooklyn",
  "Asher",
  "Bella",
  "Nathan",
  "Claire",
  "Thomas",
  "Skylar",
  "Leo",
];

const LAST_NAMES = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
  "Carter",
  "Roberts",
  "Phillips",
  "Evans",
  "Turner",
  "Parker",
  "Collins",
  "Edwards",
  "Stewart",
  "Morris",
  "Murphy",
  "Cook",
  "Rogers",
  "Morgan",
  "Peterson",
  "Cooper",
  "Reed",
  "Bailey",
  "Bell",
  "Gomez",
  "Kelly",
  "Howard",
  "Ward",
  "Cox",
  "Diaz",
  "Richardson",
  "Wood",
  "Watson",
  "Brooks",
  "Bennett",
  "Gray",
  "James",
  "Reyes",
  "Cruz",
  "Hughes",
  "Price",
  "Myers",
  "Long",
  "Foster",
  "Sanders",
  "Ross",
  "Morales",
  "Powell",
  "Sullivan",
  "Russell",
  "Ortiz",
  "Jenkins",
  "Gutierrez",
  "Perry",
  "Butler",
  "Barnes",
  "Fisher",
];

// Sample data pools
const TOPICS = [
  "technology",
  "travel",
  "food",
  "sports",
  "music",
  "art",
  "fashion",
  "science",
];
const FIRST_WORDS = [
  "Enjoying",
  "Learning",
  "Exploring",
  "Adoring",
  "Mastering",
  "Creating",
];
const NOUNS = ["life", "code", "nature", "art", "music", "food", "travel"];
const POST_TEXTS = [
  "Just had an amazing experience! ✨",
  "Check out this cool thing I found 🔍",
  "Working on something exciting... 🛠️",
  "Anyone else love this as much as I do? ❤️",
  "Weekend vibes 🌟",
  "New project alert 🚨",
  "Throwback to this amazing moment 📸",
  "Can't wait to share what's coming next! 👀",
  "Daily dose of inspiration 💡",
  "Behind the scenes of... 🎬",
  "Living my best life 🌈",
  "When in doubt, coffee it out ☕",
  "Good vibes only ✌️",
  "Sunshine and good times ☀️",
  "Another day, another adventure 🗺️",
  "Food coma achieved �",
  "Just because I can 🌸",
  "Making memories every day 📅",
  "Do what makes your soul shine ✨",
  "Self-care isn't selfish 💆‍♀️",
  "Friday feels 🎉",
  "Morning motivation 💪",
  "Little things make big days 🌼",
  "Currently obsessed with this 🥰",
  "Sweat now, shine later 🏋️‍♀️",
  "Sunday funday 🎈",
  "Views and brews 🍺",
  "Bookworm life 📚",
  "Tech enthusiast in the wild 💻",
  "Art is where the heart is 🎨",
  "Music feeds my soul 🎵",
  "Fitness journey continues 🏃‍♂️",
  "Recipe testing in progress 👩‍🍳",
  "Wanderlust activated ✈️",
  "Pet love is the best love 🐾",
  "Game night success 🎲",
  "DIY mode activated 🔨",
  "Plant parent proud 🌱",
  "Beach please 🏖️",
  "Mountain high ⛰️",
  "City lights, city nights 🌃",
  "Country roads take me home 🚜",
  "Snow day magic ❄️",
  "Autumn leaves and cozy sleeves 🍂",
  "Spring has sprung 🌷",
  "Summer state of mind 🏄‍♀️",
  "Winter is coming... ☃️",
  "Festival ready 🎪",
  "Concert vibes 🎤",
  "Movie night essentials 🍿",
  "Binge-watching like a pro 📺",
  "Pajama party 🛌",
  "Lazy Sunday approved 🛋️",
  "Productivity level: expert 📊",
  "Work hard, play harder 🏆",
  "Hustle with heart 💼",
  "Creative juices flowing 🧠",
  "Ideas worth spreading 💭",
  "Dream big, work hard 💫",
  "Goals on goals on goals 🎯",
  "Progress over perfection 📈",
  "Small steps, big dreams 👣",
  "Challenge accepted 🥋",
  "Pushing my limits 🚀",
  "Out of comfort zone ➡️ growth",
  "New skill unlocked 🔓",
  "Learning never stops 🧠",
  "Knowledge is power 📖",
  "Thoughts become things 💭➡️✨",
  "Manifesting greatness 🌠",
  "Positive vibes only 🌞",
  "Gratitude attitude 🙏",
  "Counting my blessings 💝",
  "Kindness is free 💗",
  "Spread love everywhere 🌍",
  "Be the change 🌱",
  "Community matters 👥",
  "Support local 🛍️",
  "Small business love 💕",
  "Sustainable living 🌎",
  "Eco-friendly choices ♻️",
  "Minimalist mindset 🧘‍♀️",
  "Less is more ✂️",
  "Decluttering my life 🗑️",
  "Organized and thriving 🗂️",
  "Clean space, clear mind 🧹",
  "Home sweet home 🏡",
  "Interior design obsessed 🛋️",
  "DIY home improvements 🔧",
  "Garden therapy 🌻",
  "Fresh cut flowers 💐",
  "Sunrise chaser 🌅",
  "Sunset admirer 🌇",
  "Stargazing tonight 🌠",
  "Moonchild vibes 🌙",
  "Rainy day thoughts ☔",
  "Storm watching ⚡",
  "Ocean soul 🌊",
  "Desert dreams 🏜️",
  "Forest bathing 🌲",
  "Nature heals 🍃",
  "Outdoor enthusiast 🏕️",
  "Campfire stories 🔥",
  "Road trip ready 🚗",
  "Wanderer at heart 🧭",
  "Travel bug bitten ✈️",
  "Passport full of stories 🛂",
  "Cultural immersion 🌏",
  "Foodie adventures 🍽️",
  "Culinary experiments 👩‍🍳",
  "Baking therapy 🧁",
  "Coffee connoisseur ☕",
  "Wine not? 🍷",
  "Cocktail hour 🍹",
  "Brunch life 🥑",
  "Dessert first 🍰",
];
await mongoose.connect("mongodb://localhost:27017/Socially");

// Clean existing data
await Promise.all([User.deleteMany(), Profile.deleteMany(), Post.deleteMany()]);

// User creation function
async function createMockUser(index) {
  const userId = new Types.ObjectId();
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

  // Create User
  const user = await User.create({
    _id: userId,
    email: `user${index}@email.com`,
    password: PASSWORD,
    verificationStatus: {
      isVerified: true,
      verificationToken: null,
    },
    favoriteTopics: generateFavoriteTopics(),
  });

  // Create Profile
  const profile = await Profile.create({
    _id: userId,
    firstName,
    lastName,
    username: `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(
      Math.random() * 100
    )}`,
    profilePicPath: `https://picsum.photos/200?random=${index}`,
    followers: [],
    following: [],
  });

  return { user, profile };
}

// Generate random favorite topics
function generateFavoriteTopics() {
  const topics = new Map();
  const numTopics = Math.floor(Math.random() * 4) + 2; // 2-5 topics

  Array.from({ length: numTopics }).forEach(() => {
    const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    topics.set(topic, { count: Math.floor(Math.random() * 10) + 1 });
  });

  return topics;
}

// Generate posts for a user
async function createUserPosts(userId, allUserIds) {
  const numPosts = Math.floor(Math.random() * MAX_POSTS_PER_USER) + 1;
  const posts = [];
  for (let i = 0; i < numPosts; i++) {
    const post = await Post.create({
      creatorId: userId.toString(),
      text: `${POST_TEXTS[Math.floor(Math.random() * POST_TEXTS.length)]} ${
        FIRST_WORDS[Math.floor(Math.random() * FIRST_WORDS.length)]
      } ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}!`,
      keywords: Array.from(
        { length: 2 },
        () => TOPICS[Math.floor(Math.random() * TOPICS.length)]
      ),
      likes: Array.from({ length: Math.floor(Math.random() * 1000) }, () => ({
        _id: allUserIds[Math.floor(Math.random() * allUserIds.length)],
        notificationId: new Types.ObjectId().toString(),
      })),
      files: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () => ({
        path: getRandomImageUrl(),
        fileType: "photo",
      })),
      createdAt:
        Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7),
    });
  }
  // Helper function to generate random image URLs
  function getRandomImageUrl() {
    const imageCategories = [
      "nature",
      "city",
      "people",
      "food",
      "animals",
      "fashion",
      "sports",
      "technology",
      "art",
    ];
    const category =
      imageCategories[Math.floor(Math.random() * imageCategories.length)];
    const width = 800 + Math.floor(Math.random() * 400); // 800-1200px width
    const height = 600 + Math.floor(Math.random() * 400); // 600-1000px height

    // Using different image services for variety
    const services = [
      `https://source.unsplash.com/random/${width}x${height}/?${category}`,
      `https://picsum.photos/${width}/${height}/?${category}`,
      `https://loremflickr.com/${width}/${height}/${category}`,
    ];

    return services[Math.floor(Math.random() * services.length)];
  }

  return posts;
}

// Main seeding function
async function seedDatabase() {
  // Create users and profiles
  const users = [];
  for (let i = 0; i < TOTAL_USERS; i++) {
    const { user, profile } = await createMockUser(i);
    users.push({ user, profile });
    console.log(`Created user ${i + 1}/${TOTAL_USERS}`);
  }

  // Create follow relationships
  const allUserIds = users.map((u) => u.user._id.toString());
  for (const currentUser of users) {
    const followersCount = Math.floor(Math.random() * MAX_FOLLOWERS);
    const followers = [];

    // Get random followers (excluding self)
    const potentialFollowers = allUserIds.filter(
      (id) => id !== currentUser.user._id.toString()
    );
    const selectedFollowers = potentialFollowers
      .sort(() => 0.5 - Math.random())
      .slice(0, followersCount);

    // Update follower's following and current user's followers
    for (const followerId of selectedFollowers) {
      // Add to current user's followers
      currentUser.profile.followers.push({
        _id: followerId,
        notificationId: new Types.ObjectId().toString(),
      });

      // Add to follower's following
      const followerProfile = await Profile.findOne({ _id: followerId });
      followerProfile.following.push({ _id: currentUser.user._id.toString() });
      await followerProfile.save();
    }

    await currentUser.profile.save();
  }

  // Create posts for all users
  for (const user of users) {
    await createUserPosts(user.user._id, allUserIds);
    console.log(`Created posts for user ${user.profile.username}`);
  }

  console.log("Database seeding completed!");
  process.exit(0);
}

// Run the seeder
seedDatabase().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
