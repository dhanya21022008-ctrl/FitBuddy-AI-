import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

app.use(express.json({ limit: '10mb' }));

// Ensure data directory and users.json exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoredUser {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activity: string;
  workout_preference?: string;
  dietary_preference?: string;
  available_time?: string;
  plan: any;
  is_demo?: boolean;
  created_at: string;
}

function loadUsers(): StoredUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data) || [];
  } catch (error) {
    console.error('Error loading users from file:', error);
    return [];
  }
}

function saveUsers(users: StoredUser[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing users to file:', error);
  }
}

// Fallback intelligent plan generator in case AI service is busy or offline
function generateFallbackPlan(userData: {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activity: string;
  workout_preference?: string;
  dietary_preference?: string;
  available_time?: string;
}) {
  const { name, goal, workout_preference = 'General', dietary_preference = 'Balanced', available_time = '30-45 minutes' } = userData;

  let goalFocus = 'balance and sustained vitality';
  let targetFrequency = '3 to 4 days per week';
  let warmUpExercises = [
    { name: 'Arm Circles & Shoulder Rolls', duration: '2 minutes', notes: 'Gradual increase in range of motion' },
    { name: 'Cat-Cow & Torso Twists', duration: '3 minutes', notes: 'Mobilize spinal column and hip flexors' },
    { name: 'Light Jumping Jacks or Brisk Step-touches', duration: '3 minutes', notes: 'Elevate core body temperature safely' },
  ];

  let mainExercises = [
    { name: 'Bodyweight Squats or Goblet Squats', sets: '3', reps: '10-12', notes: 'Drive through heels, maintain neutral spine' },
    { name: 'Push-ups or Incline Push-ups', sets: '3', reps: '8-12', notes: 'Engage core, keep elbows at 45 degrees' },
    { name: 'Glute Bridges', sets: '3', reps: '12-15', notes: 'Squeeze glutes at top for 2 seconds' },
    { name: 'Dumbbell or Resistance Band Rows', sets: '3', reps: '10-12', notes: 'Retract shoulder blades fully' },
    { name: 'Plank Hold', sets: '3', duration: '30-45 seconds', notes: 'Maintain tight abdominal brace' },
  ];

  let coolDownExercises = [
    { name: 'Standing Quad & Hamstring Stretch', duration: '3 minutes', notes: 'Breathe deeply into each hold' },
    { name: 'Child Pose & Cobra Stretch', duration: '3 minutes', notes: 'Decompress lower back and chest' },
  ];

  if (goal === 'Weight Loss') {
    goalFocus = 'caloric deficit management, metabolic conditioning, and lean tissue preservation';
    targetFrequency = '4 to 5 days per week';
    mainExercises = [
      { name: 'Interval Circuit: Bodyweight Squats to Jumps', sets: '3', reps: '12-15', notes: 'Keep dynamic pace, moderate rest' },
      { name: 'Dumbbell Thrusters or Overhead Press', sets: '3', reps: '10-12', notes: 'Compound movement to maximize burn' },
      { name: 'Mountain Climbers & Step-ups', sets: '3', duration: '40 seconds', notes: 'High cadence with steady breathing' },
      { name: 'Renegade Rows or Bent-over Rows', sets: '3', reps: '10 per side', notes: 'Anti-rotational core stability' },
      { name: 'Brisk Walking or Cardio Finisher', sets: '1', duration: '15 minutes', notes: 'Zone 2 steady aerobic burn' },
    ];
  } else if (goal === 'Muscle Gain') {
    goalFocus = 'progressive overload, hypertrophy-specific volume, and optimal recovery';
    targetFrequency = '4 days per week (Upper/Lower Split)';
    mainExercises = [
      { name: 'Barbell or Dumbbell Squats', sets: '4', reps: '8-10', notes: 'Controlled eccentric 3-second descent' },
      { name: 'Dumbbell Bench Press or Floor Press', sets: '4', reps: '8-10', notes: 'Focus on full chest stretch and contraction' },
      { name: 'Romanian Deadlifts', sets: '3', reps: '8-10', notes: 'Hinge at hips, keep weight close to shins' },
      { name: 'Lat Pulldowns or Pull-ups', sets: '3', reps: '8-12', notes: 'Pull elbows downward into pockets' },
      { name: 'Dumbbell Overhead Shoulder Press', sets: '3', reps: '10-12', notes: 'Full extension without arching back' },
    ];
  } else if (goal === 'Weight Gain') {
    goalFocus = 'nutrient-dense caloric surplus, compound resistance training, and metabolic recovery';
    targetFrequency = '3 to 4 days per week';
  }

  return {
    summary: `Hello ${name}! Welcome to your customized FitBuddy-AI fitness blueprint. Tailored for your ${userData.gender.toLowerCase()} physiology (${userData.height} cm, ${userData.weight} kg) with an emphasis on ${goalFocus}. Considering your ${userData.activity.toLowerCase()} baseline activity and preference for ${workout_preference} routines, this plan balances sustainable momentum with safe progressive adaptation.`,
    workout_plan: {
      recommended_frequency: targetFrequency,
      warm_up: {
        title: 'Dynamic Warm-Up & Joint Mobilization',
        description: 'Prepare your cardiovascular system, synovial joints, and nervous system for exertion.',
        exercises: warmUpExercises,
      },
      main_workout: {
        title: `Targeted ${goal} Routine (${available_time} sessions)`,
        description: `Perform these key foundational movements with focus on strict form, intentional breathing, and controlled tempo.`,
        exercises: mainExercises,
      },
      cool_down: {
        title: 'Post-Workout Recovery & Flexibility',
        description: 'Lower heart rate gradually and initiate parasympathetic recovery.',
        exercises: coolDownExercises,
      },
    },
    nutrition_guidance: {
      general_advice: `Prioritize nutrient-dense whole foods aligning with your ${dietary_preference} preferences. Maintain regular meal cadences and ensure adequate micronutrient variety. Avoid crash dieting or excessive stimulants.`,
      protein_sources: [
        'Lean chicken breast, turkey, or lean cuts of beef',
        'Eggs and egg whites',
        'Greek yogurt, cottage cheese, or skyr',
        'Tofu, tempeh, edamame, and lentils',
        'Wild-caught fish (salmon, tuna, cod) or plant-based protein isolate',
      ],
      fruits_and_vegetables: [
        'Dark leafy greens (spinach, kale, arugula)',
        'Cruciferous vegetables (broccoli, cauliflower, Brussels sprouts)',
        'Antioxidant berries (blueberries, raspberries, strawberries)',
        'Complex carbs: sweet potatoes, squash, and bananas for pre/post workout energy',
      ],
      hydration: `Drink a minimum of 2.5 to 3.5 liters of clean water daily, increasing by 500ml on training days to replenish electrolyte and fluid losses.`,
      meal_suggestions: [
        {
          meal: 'Breakfast',
          suggestions: [
            'Rolled oats cooked with chia seeds, topped with berries and protein powder or Greek yogurt',
            '2-3 scrambled eggs with spinach and whole grain toasted sourdough',
          ],
        },
        {
          meal: 'Lunch',
          suggestions: [
            'Grilled herb chicken or crispy tofu quinoa bowl with steamed broccoli, avocado, and olive oil vinaigrette',
            'Hearty lentil and vegetable stew with a side mixed garden salad',
          ],
        },
        {
          meal: 'Dinner',
          suggestions: [
            'Baked salmon or seasoned tempeh fillet with roasted sweet potatoes and asparagus spears',
            'Lean stir-fry loaded with colorful bell peppers, snap peas, and brown rice',
          ],
        },
        {
          meal: 'Nutrient-Smart Snacks',
          suggestions: [
            'Handful of raw almonds or walnuts paired with an apple',
            'Carrot & cucumber sticks with homemade hummus',
            'Rice cake with natural peanut or almond butter',
          ],
        },
      ],
    },
    daily_activities: [
      'Target 7,000 to 10,000 daily steps across walking intervals and active transit.',
      'Take 2-minute posture standing breaks every 50 minutes of sitting.',
      'Engage in 5-10 minutes of gentle morning breathing and stretching.',
      'Aim for 7 to 8.5 hours of uninterrupted sleep in a cool, dark room for muscular and hormonal recovery.',
    ],
    weekly_schedule: [
      { day: 'Monday', focus: `${goal} Routine A`, activity: 'Full Body Compound Strength & Core', duration: available_time },
      { day: 'Tuesday', focus: 'Active Recovery', activity: 'Brisk 30-min Outdoor Walk & Mobility Stretches', duration: '30 mins' },
      { day: 'Wednesday', focus: `${goal} Routine B`, activity: 'Lower Body & Posterior Chain Resistance', duration: available_time },
      { day: 'Thursday', focus: 'Rest & Restoration', activity: 'Light Yoga or Relaxed Strolling', duration: '20 mins' },
      { day: 'Friday', focus: `${goal} Routine C`, activity: 'Upper Body Pull/Push & Conditioning', duration: available_time },
      { day: 'Saturday', focus: 'Recreational Cardio', activity: 'Cycling, Hiking, Swimming, or Favorite Sport', duration: '40-45 mins' },
      { day: 'Sunday', focus: 'Deep Recovery & Meal Prep', activity: 'Gentle Foam Rolling and Nutritional Planning', duration: '25 mins' },
    ],
    fitness_tips: [
      'Prioritize consistency over perfection: 3 decent workouts beat 1 extreme workout followed by burnout.',
      'Always focus on movement quality and joint alignment before increasing resistance.',
      'Listen to your body signals: distinguish between healthy muscular effort and acute joint discomfort.',
      'Hydrate 30 minutes before training to maintain cellular turgor and athletic output.',
    ],
    progress_tracking: [
      'Record weekly body weight under consistent morning conditions (fasted, post-bathroom).',
      'Take monthly front/side/back physique photos in consistent lighting.',
      'Log your workout weights, repetitions, and perceived exertion (RPE) in a training journal.',
      'Track non-scale victories: elevated daytime energy, improved sleep quality, and reduced stress levels.',
    ],
  };
}

// REST API Endpoints

// 1. Get All Users with optional search query
app.get('/api/users', (req: Request, res: Response) => {
  try {
    const q = ((req.query.q as string) || '').toLowerCase().trim();
    const users = loadUsers();

    if (!q) {
      return res.json(users);
    }

    const filtered = users.filter((u) => {
      return (
        u.name.toLowerCase().includes(q) ||
        u.goal.toLowerCase().includes(q) ||
        u.gender.toLowerCase().includes(q) ||
        u.activity.toLowerCase().includes(q)
      );
    });

    return res.json(filtered);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve users', message: error.message });
  }
});

// 2. Get Single User by ID
app.get('/api/users/:id', (req: Request, res: Response) => {
  try {
    const users = loadUsers();
    const user = users.find((u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch user', message: error.message });
  }
});

// 3. Delete User by ID
app.delete('/api/users/:id', (req: Request, res: Response) => {
  try {
    const users = loadUsers();
    const index = users.findIndex((u) => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
    const removed = users.splice(index, 1)[0];
    saveUsers(users);
    return res.json({ success: true, removedUser: removed });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to delete user', message: error.message });
  }
});

// 4. Dashboard Statistics
app.get('/api/dashboard/stats', (req: Request, res: Response) => {
  try {
    const users = loadUsers();
    const totalUsers = users.length;

    let weightLossCount = 0;
    let weightGainCount = 0;
    let muscleGainCount = 0;
    let generalFitnessCount = 0;

    let lowActivity = 0;
    let moderateActivity = 0;
    let highActivity = 0;

    let totalAge = 0;
    let totalBmi = 0;

    users.forEach((u) => {
      if (u.goal === 'Weight Loss') weightLossCount++;
      else if (u.goal === 'Weight Gain') weightGainCount++;
      else if (u.goal === 'Muscle Gain') muscleGainCount++;
      else generalFitnessCount++;

      if (u.activity === 'Low') lowActivity++;
      else if (u.activity === 'High') highActivity++;
      else moderateActivity++;

      totalAge += u.age || 0;
      if (u.height && u.weight) {
        const hM = u.height / 100;
        const bmi = u.weight / (hM * hM);
        totalBmi += bmi;
      }
    });

    const averageAge = totalUsers > 0 ? parseFloat((totalAge / totalUsers).toFixed(1)) : 0;
    const averageBmi = totalUsers > 0 ? parseFloat((totalBmi / totalUsers).toFixed(1)) : 0;

    // Get 5 most recent users
    const recentUsers = [...users]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return res.json({
      totalUsers,
      weightLossCount,
      weightGainCount,
      muscleGainCount,
      generalFitnessCount,
      averageAge,
      averageBmi,
      activityBreakdown: {
        low: lowActivity,
        moderate: moderateActivity,
        high: highActivity,
      },
      recentUsers,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to calculate stats', message: error.message });
  }
});

// 5. Generate Plan with Gemini AI and Save User
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  try {
    const {
      name,
      age,
      gender,
      height,
      weight,
      goal,
      activity,
      workout_preference,
      dietary_preference,
      available_time,
    } = req.body;

    // Strict validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const numAge = Number(age);
    if (!numAge || numAge <= 0 || numAge > 120) {
      return res.status(400).json({ error: 'Please enter a valid age between 1 and 120' });
    }
    if (!gender || !['Female', 'Male', 'Other'].includes(gender)) {
      return res.status(400).json({ error: 'Gender must be Female, Male, or Other' });
    }
    const numHeight = Number(height);
    if (!numHeight || numHeight < 40 || numHeight > 260) {
      return res.status(400).json({ error: 'Please enter a valid height between 40 and 260 cm' });
    }
    const numWeight = Number(weight);
    if (!numWeight || numWeight < 20 || numWeight > 350) {
      return res.status(400).json({ error: 'Please enter a valid weight between 20 and 350 kg' });
    }
    if (!goal) {
      return res.status(400).json({ error: 'Fitness goal is required' });
    }
    if (!activity) {
      return res.status(400).json({ error: 'Activity level is required' });
    }

    const userData = {
      name: name.trim(),
      age: numAge,
      gender,
      height: numHeight,
      weight: numWeight,
      goal,
      activity,
      workout_preference: workout_preference || 'Balanced Routine',
      dietary_preference: dietary_preference || 'Balanced Nutrition',
      available_time: available_time || '30-45 minutes',
    };

    let generatedPlan: any = null;
    let aiEngine = 'fallback';

    // Check if Gemini API key exists
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const prompt = `You are FitBuddy, an AI fitness planning assistant.

Create a simple, practical, and personalized general fitness plan based on the following user information:

Name: ${userData.name}
Age: ${userData.age}
Gender: ${userData.gender}
Height: ${userData.height} cm
Weight: ${userData.weight} kg
Fitness Goal: ${userData.goal}
Activity Level: ${userData.activity}
Workout Preference: ${userData.workout_preference}
Dietary Preference: ${userData.dietary_preference}
Available Workout Time: ${userData.available_time}

Provide:
1. Personalized Summary: An encouraging overview explaining the caloric, metabolic, and physical rationale for this custom plan.
2. Workout Plan:
   - recommended_frequency (e.g. "3-4 days/week")
   - warm_up (title, description, list of exercises with name, duration, notes)
   - main_workout (title, description, list of exercises with name, sets, reps, duration, notes)
   - cool_down (title, description, list of exercises with name, duration, notes)
3. Nutrition Guidance:
   - general_advice
   - protein_sources (list of 4-5 high quality sources)
   - fruits_and_vegetables (list of 4-5 beneficial choices)
   - hydration (daily target & tips)
   - meal_suggestions (breakfast, lunch, dinner, snacks with practical meal options)
4. Daily Activity Suggestions (list of 4 actionable daily non-exercise habits, e.g. steps, posture, sleep)
5. Weekly Schedule (7 entries from Monday through Sunday, each with day, focus, activity, duration)
6. General Fitness Tips (list of 4-5 practical tips for consistency, form, and recovery)
7. Progress Tracking Suggestions (list of 4 realistic ways to measure progress)

Use simple, encouraging language.
Do not diagnose medical conditions.
Do not claim to treat medical conditions.
Do not prescribe medication.
Do not recommend unsafe extreme diets or exercise.
Include a reminder that the information is general fitness guidance and not medical advice.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are FitBuddy, a certified expert fitness coach and nutritionist. Provide structured, accurate, encouraging, and safe fitness plans in strict JSON format.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: { type: Type.STRING },
                workout_plan: {
                  type: Type.OBJECT,
                  properties: {
                    recommended_frequency: { type: Type.STRING },
                    warm_up: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        exercises: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              duration: { type: Type.STRING },
                              notes: { type: Type.STRING },
                            },
                            required: ['name'],
                          },
                        },
                      },
                      required: ['title', 'exercises'],
                    },
                    main_workout: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        exercises: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              sets: { type: Type.STRING },
                              reps: { type: Type.STRING },
                              duration: { type: Type.STRING },
                              notes: { type: Type.STRING },
                            },
                            required: ['name'],
                          },
                        },
                      },
                      required: ['title', 'exercises'],
                    },
                    cool_down: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        exercises: {
                          type: Type.ARRAY,
                          items: {
                            type: Type.OBJECT,
                            properties: {
                              name: { type: Type.STRING },
                              duration: { type: Type.STRING },
                              notes: { type: Type.STRING },
                            },
                            required: ['name'],
                          },
                        },
                      },
                      required: ['title', 'exercises'],
                    },
                  },
                  required: ['recommended_frequency', 'warm_up', 'main_workout', 'cool_down'],
                },
                nutrition_guidance: {
                  type: Type.OBJECT,
                  properties: {
                    general_advice: { type: Type.STRING },
                    protein_sources: { type: Type.ARRAY, items: { type: Type.STRING } },
                    fruits_and_vegetables: { type: Type.ARRAY, items: { type: Type.STRING } },
                    hydration: { type: Type.STRING },
                    meal_suggestions: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          meal: { type: Type.STRING },
                          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                        required: ['meal', 'suggestions'],
                      },
                    },
                  },
                  required: ['general_advice', 'protein_sources', 'fruits_and_vegetables', 'hydration', 'meal_suggestions'],
                },
                daily_activities: { type: Type.ARRAY, items: { type: Type.STRING } },
                weekly_schedule: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      focus: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      duration: { type: Type.STRING },
                    },
                    required: ['day', 'focus', 'activity', 'duration'],
                  },
                },
                fitness_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
                progress_tracking: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'summary',
                'workout_plan',
                'nutrition_guidance',
                'daily_activities',
                'weekly_schedule',
                'fitness_tips',
                'progress_tracking',
              ],
            },
          },
        });

        if (response.text) {
          generatedPlan = JSON.parse(response.text);
          aiEngine = 'gemini-3.8-flash';
        }
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or busy, gracefully falling back:', geminiError.message);
        // Continue to fallback
      }
    }

    if (!generatedPlan) {
      generatedPlan = generateFallbackPlan(userData);
    }

    // Create user record
    const newUser: StoredUser = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      name: userData.name,
      age: userData.age,
      gender: userData.gender,
      height: userData.height,
      weight: userData.weight,
      goal: userData.goal,
      activity: userData.activity,
      workout_preference: userData.workout_preference,
      dietary_preference: userData.dietary_preference,
      available_time: userData.available_time,
      plan: generatedPlan,
      is_demo: false,
      created_at: new Date().toISOString(),
    };

    const users = loadUsers();
    users.unshift(newUser);
    saveUsers(users);

    return res.status(201).json({
      user: newUser,
      engine: aiEngine,
    });
  } catch (error: any) {
    console.error('Error generating plan:', error);
    return res.status(500).json({
      error: 'The AI service is temporarily busy. Please try again in a moment.',
      details: error.message,
    });
  }
});

// 6. Seed Demo Users
app.post('/api/seed-demo', (req: Request, res: Response) => {
  try {
    const users = loadUsers();

    // Check if demo users already exist
    const demoCount = users.filter((u) => u.is_demo).length;
    if (demoCount >= 4) {
      return res.json({ message: 'Demo users already populated', users });
    }

    const demoUsersData = [
      {
        name: 'Sarah Jenkins',
        age: 28,
        gender: 'Female',
        height: 168,
        weight: 68,
        goal: 'Weight Loss',
        activity: 'Moderate',
        workout_preference: 'Home Workout & HIIT',
        dietary_preference: 'Mediterranean & Low Sugar',
        available_time: '30-45 mins',
      },
      {
        name: 'Marcus Vance',
        age: 24,
        gender: 'Male',
        height: 182,
        weight: 74,
        goal: 'Muscle Gain',
        activity: 'High',
        workout_preference: 'Gym Free Weights & Hypertrophy',
        dietary_preference: 'High-Protein',
        available_time: '45-60 mins',
      },
      {
        name: 'Priya Sharma',
        age: 32,
        gender: 'Female',
        height: 162,
        weight: 56,
        goal: 'General Fitness',
        activity: 'Moderate',
        workout_preference: 'Yoga, Calisthenics & Cardio',
        dietary_preference: 'Vegetarian',
        available_time: '30 mins',
      },
      {
        name: 'David O’Connor',
        age: 21,
        gender: 'Male',
        height: 178,
        weight: 62,
        goal: 'Weight Gain',
        activity: 'Low',
        workout_preference: 'Beginner Strength Training',
        dietary_preference: 'Balanced Calorie Surplus',
        available_time: '30-45 mins',
      },
    ];

    const newDemoUsers: StoredUser[] = demoUsersData.map((d, index) => {
      const plan = generateFallbackPlan(d);
      return {
        id: 'demo_' + (index + 1) + '_' + Math.random().toString(36).substring(2, 5),
        name: d.name,
        age: d.age,
        gender: d.gender,
        height: d.height,
        weight: d.weight,
        goal: d.goal,
        activity: d.activity,
        workout_preference: d.workout_preference,
        dietary_preference: d.dietary_preference,
        available_time: d.available_time,
        plan,
        is_demo: true,
        created_at: new Date(Date.now() - (index + 1) * 3600 * 24 * 1000).toISOString(),
      };
    });

    const updatedUsers = [...newDemoUsers, ...users];
    saveUsers(updatedUsers);

    return res.status(201).json({
      message: 'Demo users seeded successfully',
      seededCount: newDemoUsers.length,
      users: updatedUsers,
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to seed demo users', message: error.message });
  }
});

// 7. Clear Demo Users
app.post('/api/clear-demo', (req: Request, res: Response) => {
  try {
    const users = loadUsers();
    const realUsersOnly = users.filter((u) => !u.is_demo);
    saveUsers(realUsersOnly);
    return res.json({ message: 'Demo users removed', remainingCount: realUsersOnly.length });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to clear demo data', message: error.message });
  }
});

// 8. Service Status Check
app.get('/api/status', (req: Request, res: Response) => {
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
  res.json({
    status: 'healthy',
    hasGeminiKey,
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'))) {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    // Vite middleware for dev
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitBuddy-AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
