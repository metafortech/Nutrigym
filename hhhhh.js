// app
// ├── models
// │   ├── club.js
// │   ├── clinic.js
// │   ├── restaurant.js
// │   ├── store.js
// │   └── user.js
// ├── views
// │   ├── club.ejs
// │   ├── clinic.ejs
// │   ├── restaurant.ejs
// │   ├── store.ejs
// │   └── user.ejs
// ├── controllers
// │   ├── clubController.js
// │   ├── clinicController.js
// │   ├── restaurantController.js
// │   ├── storeController.js
// │   └── userController.js
// ├── services
// │   ├── auth.js
// │   ├── payment.js
// │   ├── schedule.js
// │   └── calorie.js
// ├── routes
// │   ├── clubRoutes.js
// │   ├── clinicRoutes.js
// │   ├── restaurantRoutes.js
// │   ├── storeRoutes.js
// │   └── userRoutes.js
// ├── app.js
// └── package.json

// club.js

// Import mongoose library
const mongoose = require('mongoose');

// Define club schema
const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    governorate: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  products: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Export club model
module.exports = mongoose.model('Club', clubSchema);

// clinic.js

// Import mongoose library
const mongoose = require('mongoose');

// Define clinic schema
const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    governorate: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  services: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Export clinic model
module.exports = mongoose.model('Clinic', clinicSchema);

// schedule.js

// Import mongoose library
const mongoose = require('mongoose');

// Import models
const User = require('../models/user');
const Club = require('../models/club');
const Clinic = require('../models/clinic');

// Define schedule service object
const scheduleService = {};

// Create and save a food schedule for a user based on their preferences and goals
scheduleService.createFoodSchedule = async (userId) => {
  try {
    // Find the user by id
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has a nutrition clinic subscription
    if (!user.subscriptions.clinic) {
      throw new Error('User does not have a nutrition clinic subscription');
    }

    // Find the clinic by id
    const clinic = await Clinic.findById(user.subscriptions.clinic);

    // Check if the clinic exists
    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Generate a food schedule based on the user's preferences and goals
    // This is a simplified example, you can use more complex logic and data here
    const foodSchedule = {
      breakfast: {
        name: 'Oatmeal with fruits and nuts',
        description: 'A healthy and filling breakfast that provides fiber, protein and antioxidants',
        calories: 300,
      },
      lunch: {
        name: 'Grilled chicken salad with dressing',
        description: 'A balanced and satisfying lunch that provides lean protein, vegetables and healthy fats',
        calories: 400,
      },
      dinner: {
        name: 'Salmon with quinoa and broccoli',
        description: 'A nutritious and delicious dinner that provides omega-3 fatty acids, complex carbohydrates and vitamins',
        calories: 500,
      },
      snack: {
        name: 'Yogurt with berries and granola',
        description: 'A tasty and refreshing snack that provides calcium, probiotics and antioxidants',
        calories: 200,
      },
    };

    // Save the food schedule to the user's document
    user.foodSchedule = foodSchedule;
    await user.save();

    // Return the food schedule
    return foodSchedule;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

// Create and save an exercise schedule for a user based on their preferences and goals
scheduleService.createExerciseSchedule = async (userId) => {
  try {
    // Find the user by id
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user has a sports club subscription
    if (!user.subscriptions.club) {
      throw new Error('User does not have a sports club subscription');
    }

    // Find the club by id
    const club = await Club.findById(user.subscriptions.club);

    // Check if the club exists
    if (!club) {
      throw new Error('Club not found');
    }

    // Generate an exercise schedule based on the user's preferences and goals
    // This is a simplified example, you can use more complex logic and data here
    const exerciseSchedule = [
      {
        name: 'Push-ups',
        description: 'A classic exercise that works your chest, arms and core muscles',
        gif: 'https://media.giphy.com/media/3o7TKz2eMXx7dn95FS/giphy.gif',
        reps: 10,
        sets: 3,
      },
      {
        name: 'Squats',
        description: 'A fundamental exercise that works your legs, glutes and lower back muscles',
        gif: 'https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif',
        reps: 10,
        sets: 3,
      },
      {
        name: 'Plank',
        description: 'A simple but effective exercise that works your core, shoulders and back muscles',
        gif: 'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
        duration: 30,
        sets: 3,
      },
      {
        name: 'Jumping jacks',
        description: 'A fun and energetic exercise that works your whole body and cardiovascular system',
        gif: 'https://media.giphy.com/media/3o6ZsXc2rcwf8sy6JO/giphy.gif',
        reps: 20,
        sets: 3,
      },
      {
        name: 'Lunges',
        description: 'A challenging exercise that works your legs, glutes and balance',
        gif: 'https://media.giphy.com/media/l0MYNB04rBb51QNtC/giphy.gif',
        reps: 10,
        sets: 3,
      },
    ];

    // Save the exercise schedule to the user's document
    user.exerciseSchedule = exerciseSchedule;
    await user.save();

    // Return the exercise schedule
    return exerciseSchedule;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

// Export schedule service object
module.exports = scheduleService;

// calorie.js

// Import mongoose library
const mongoose = require('mongoose');

// Import models
const User = require('../models/user');
const Restaurant = require('../models/restaurant');
const Store = require('../models/store');

// Define calorie service object
const calorieService = {};

// Calculate and update the user's calorie intake based on their meals
calorieService.calculateCalorieIntake = async (userId) => {
  try {
    // Find the user by id
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Initialize the calorie intake object
    const calorieIntake = {
      total: 0,
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0,
    };

    // Loop through the user's food schedule and add the calories of each meal to the intake object
    for (const meal of ['breakfast', 'lunch', 'dinner', 'snack']) {
      if (user.foodSchedule[meal]) {
        calorieIntake[meal] = user.foodSchedule[meal].calories;
        calorieIntake.total += user.foodSchedule[meal].calories;
      }
    }

    // Loop through the user's orders and add the calories of each product to the intake object
    for (const order of user.orders) {
      // Find the store by id
      const store = await Store.findById(order.store);

      // Check if the store exists
      if (!store) {
        throw new Error('Store not found');
      }

      // Loop through the order's products and find the matching product in the store's products
      for (const orderProduct of order.products) {
        const storeProduct = store.products.find(
          (p) => p.name === orderProduct.name
        );

        // Check if the product exists and has a calorie value
        if (!storeProduct || !storeProduct.calories) {
          continue;
        }

        // Add the product's calories to the intake object based on the quantity ordered
        calorieIntake.total += storeProduct.calories * orderProduct.quantity;
      }
    }

    // Save the calorie intake to the user's document
    user.calorieIntake = calorieIntake;
    await user.save();

    // Return the calorie intake
    return calorieIntake;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

// Calculate and update the user's calorie expenditure based on their activities
calorieService.calculateCalorieExpenditure = async (userId) => {
  try {
    // Find the user by id
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      throw new Error('User not found');
    }

    // Initialize the calorie expenditure object
    const calorieExpenditure = {
      total: 0,
      exercises: 0,
      steps: 0,
    };

    // Loop through the user's exercise schedule and add the calories burned by each exercise to the expenditure object
    for (const exercise of user.exerciseSchedule) {
      // Calculate the calories burned by the exercise based on some factors such as duration, intensity, weight, etc.
      // This is a simplified example, you can use more complex logic and data here
      const caloriesBurned =
        exercise.duration * exercise.intensity * user.weight * 0.01;

      // Add the calories burned to the expenditure object based on the completion status of the exercise
      if (exercise.completed) {
        calorieExpenditure.exercises += caloriesBurned;
        calorieExpenditure.total += caloriesBurned;
      }
    }

    // Calculate the calories burned by walking based on the user's steps and weight
    // This is a simplified example, you can use more complex logic and data here
    const caloriesBurnedByWalking = (user.steps * user.weight * 0.0005) / 1000;

    // Add the calories burned by walking to the expenditure object
    calorieExpenditure.steps += caloriesBurnedByWalking;
    calorieExpenditure.total += caloriesBurnedByWalking;

    // Save the calorie expenditure to the user's document
    user.calorieExpenditure = calorieExpenditure;
    await user.save();

    // Return the calorie expenditure
    return calorieExpenditure;
  } catch (error) {
    // Handle any errors
    console.error(error);
    throw error;
  }
};

// Export calorie service object
module.exports = calorieService;

// club.js

// Import mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the club schema
const clubSchema = new Schema({
  name: { // The name of the club
    type: String,
    required: true,
    trim: true
  },
  description: { // The description of the club
    type: String,
    required: true,
    trim: true
  },
  governorate: { // The governorate where the club is located
    type: String,
    required: true,
    trim: true
  },
  street: { // The street where the club is located
    type: String,
    required: true,
    trim: true
  },
  rating: { // The star rating of the club
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  products: [{ // The products offered by the club
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  communication: { // The communication options for the club
    phone: { // The phone number of the club
      type: String,
      required: true,
      trim: true
    },
    email: { // The email address of the club
      type: String,
      required: true,
      trim: true
    },
    website: { // The website of the club
      type: String,
      trim: true
    }
  }
});

// Export the club model
module.exports = mongoose.model('Club', clubSchema);

// restaurant.js

// Import mongoose library
const mongoose = require('mongoose');

// Define restaurant schema
const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    governorate: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  menu: [
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      calories: {
        type: Number,
        required: true,
      },
    },
  ],
});

// Export restaurant model
module.exports = mongoose.model('Restaurant', restaurantSchema);

// user.js

// Import mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
const userSchema = new Schema({
  username: { // The username of the user
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: { // The password of the user
    type: String,
    required: true,
    trim: true
  },
  email: { // The email address of the user
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  photo: { // The photo of the user
    type: String,
    trim: true
  },
  subscriptions: [{ // The subscriptions of the user for clubs and clinics
    type: Schema.Types.ObjectId,
    ref: 'Subscription'
  }],
  orders: [{ // The orders of the user from stores
    type: Schema.Types.ObjectId,
    ref: 'Order'
  }],
  foodSchedule: { // The food schedule of the user
    type: Schema.Types.ObjectId,
    ref: 'FoodSchedule'
  },
  exerciseSchedule: { // The exercise schedule of the user
    type: Schema.Types.ObjectId,
    ref: 'ExerciseSchedule'
  },
  calorieCalculation: { // The calorie calculation of the user
    type: Schema.Types.ObjectId,
    ref: 'CalorieCalculation'
  }
});

// Export the user model
module.exports = mongoose.model('User', userSchema);

// store.js

// Import mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the store schema
const storeSchema = new Schema({
  name: { // The name of the store
    type: String,
    required: true,
    trim: true
  },
  description: { // The description of the store
    type: String,
    required: true,
    trim: true
  },
  governorate: { // The governorate where the store is located
    type: String,
    required: true,
    trim: true
  },
  region: { // The region where the store is located
    type: String,
    required: true,
    trim: true
  },
  rating: { // The star rating of the store
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  products: [{ // The products offered by the store
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  deliveryPrice: { // The delivery price for the store
    type: Number,
    required: true,
    min: 0
  },
  freeDeliveryThreshold: { // The minimum order amount for free delivery from the store
    type: Number,
    min: 0
  }
});

// Export the store model
module.exports = mongoose.model('Store', storeSchema);

// product.js

// Import mongoose and Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the product schema
const productSchema = new Schema({
  name: { // The name of the product
    type: String,
    required: true,
    trim: true
  },
  price: { // The price of the product
    type: Number,
    required: true,
    min: 0
  },
  calories: { // The calories of the product
    type: Number,
    min: 0
  },
  store: { // The store that offers the product
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  }
});

// // Export the product model
// module.exports = mongoose.model('Product', productSchema);


 // clubController.js

// Import the club model
const Club = require('../models/club');

// Define the club controller object
const clubController = {};

// Define the controller function for getting all clubs
clubController.getAllClubs = async (req, res) => {
  try {
    // Find all clubs from the database
    const clubs = await Club.find();

    // Render the clubs view with the clubs data
    res.render('clubs', {clubs});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for getting one club by id
clubController.getClubById = async (req, res) => {
  try {
    // Get the club id from the request parameters
    const clubId = req.params.id;

    // Find the club by id from the database
    const club = await Club.findById(clubId);

    // Check if the club exists
    if (!club) {
      // If not, send a 404 error
      return res.status(404).send('Club not found');
    }

    // Render the club view with the club data
    res.render('club', {club});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for creating a new club
clubController.createClub = async (req, res) => {
  try {
    // Get the club data from the request body
    const {name, description, governorate, street, rating, products, communication} = req.body;

    // Create a new club document with the data
    const club = new Club({
      name,
      description,
      governorate,
      street,
      rating,
      products,
      communication
    });

    // Save the club to the database
    await club.save();

    // Redirect to the club page with a success message
    res.redirect(`/clubs/${club._id}?success=Club created successfully`);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for updating an existing club by id
clubController.updateClubById = async (req, res) => {
  try {
    // Get the club id from the request parameters
    const clubId = req.params.id;

    // Get the updated club data from the request body
    const {name, description, governorate, street, rating, products, communication} = req.body;

    // Find and update the club by id from the database
    const club = await Club.findByIdAndUpdate(clubId, {
      name,
      description,
      governorate,
      street,
      rating,
      products,
      communication
    }, {new: true});

    // Check if the club exists
    if (!club) {
      // If not, send a 404 error
      return res.status(404).send('Club not found');
    }

    // Redirect to the club page with a success message
    res.redirect(`/clubs/${club._id}?success=Club updated successfully`);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for deleting an existing club by id
clubController.deleteClubById = async (req, res) => {
  try {
    // Get the club id from the request parameters
    const clubId = req.params.id;

    // Find and delete the club by id from the database
    const club = await Club.findByIdAndDelete(clubId);

     // Check if the club exists
     if (!club) {
      // If not, send a 404 error
      return res.status(404).send('Club not found');
     }

     // Redirect to the clubs page with a success message
     res.redirect(`/clubs?success=Club deleted successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Export the club controller object
module.exports = clubController;

 


  // clinicController.js

// Import the clinic model
const Clinic = require('../models/clinic');

// Define the clinic controller object
const clinicController = {};

// Define the controller function for getting all clinics
clinicController.getAllClinics = async (req, res) => {
  try {
    // Find all clinics from the database
    const clinics = await Clinic.find();

    // Render the clinics view with the clinics data
    res.render('clinics', {clinics});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for getting one clinic by id
clinicController.getClinicById = async (req, res) => {
  try {
    // Get the clinic id from the request parameters
    const clinicId = req.params.id;

    // Find the clinic by id from the database
    const clinic = await Clinic.findById(clinicId);

    // Check if the clinic exists
    if (!clinic) {
      // If not, send a 404 error
      return res.status(404).send('Clinic not found');
    }

    // Render the clinic view with the clinic data
    res.render('clinic', {clinic});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for creating a new clinic
clinicController.createClinic = async (req, res) => {
  try {
    // Get the clinic data from the request body
    const {name, description, governorate, street, rating, products, communication} = req.body;

    // Create a new clinic document with the data
    const clinic = new Clinic({
      name,
      description,
      governorate,
      street,
      rating,
      products,
      communication
    });

    // Save the clinic to the database
    await clinic.save();

    // Redirect to the clinic page with a success message
    res.redirect(`/clinics/${clinic._id}?success=Clinic created successfully`);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for updating an existing clinic by id
clinicController.updateClinicById = async (req, res) => {
  try {
    // Get the clinic id from the request parameters
    const clinicId = req.params.id;

    // Get the updated clinic data from the request body
    const {name, description, governorate, street, rating, products, communication} = req.body;

    // Find and update the clinic by id from the database
    const clinic = await Clinic.findByIdAndUpdate(clinicId, {
      name,
      description,
      governorate,
      street,
      rating,
      products,
      communication
    }, {new: true});

     // Check if the clinic exists
     if (!clinic) {
      // If not, send a 404 error
      return res.status(404).send('Clinic not found');
     }

     // Redirect to the clinic page with a success message
     res.redirect(`/clinics/${clinic._id}?success=Clinic updated successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Define the controller function for deleting an existing clinic by id
clinicController.deleteClinicById = async (req, res) => {
  try {
     // Get the clinic id from the request parameters
     const clinicId = req.params.id;

     // Find and delete the clinic by id from the database
     const clinic = await Clinic.findByIdAndDelete(clinicId);

     // Check if the clinic exists
     if (!clinic) {
       // If not, send a 404 error
       return res.status(404).send('Clinic not found');
     }

     // Redirect to the clinics page with a success message
     res.redirect(`/clinics?success=Clinic deleted successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Export the clinic controller object
module.exports = clinicController;

 


 // restaurantController.js

// Import the restaurant model
const Restaurant = require('../models/restaurant');

// Define the restaurant controller object
const restaurantController = {};

// Define the controller function for getting all restaurants
restaurantController.getAllRestaurants = async (req, res) => {
  try {
    // Find all restaurants from the database
    const restaurants = await Restaurant.find();

    // Render the restaurants view with the restaurants data
    res.render('restaurants', {restaurants});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for getting one restaurant by id
restaurantController.getRestaurantById = async (req, res) => {
  try {
    // Get the restaurant id from the request parameters
    const restaurantId = req.params.id;

    // Find the restaurant by id from the database
    const restaurant = await Restaurant.findById(restaurantId);

    // Check if the restaurant exists
    if (!restaurant) {
      // If not, send a 404 error
      return res.status(404).send('Restaurant not found');
    }

    // Render the restaurant view with the restaurant data
    res.render('restaurant', {restaurant});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for creating a new restaurant
restaurantController.createRestaurant = async (req, res) => {
  try {
    // Get the restaurant data from the request body
    const {name, description, governorate, street, rating, products, communication} = req.body;

    // Create a new restaurant document with the data
    const restaurant = new Restaurant({
      name,
      description,
      governorate,
      street,
      rating,
      products,
      communication
    });

    // Save the restaurant to the database
    await restaurant.save();

    // Redirect to the restaurant page with a success message
    res.redirect(`/restaurants/${restaurant._id}?success=Restaurant created successfully`);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for updating an existing restaurant by id
restaurantController.updateRestaurantById = async (req, res) => {
  try {
     // Get the restaurant id from the request parameters
     const restaurantId = req.params.id;

     // Get the updated restaurant data from the request body
     const {name, description, governorate, street, rating, products, communication} = req.body;

     // Find and update the restaurant by id from the database
     const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, {
       name,
       description,
       governorate,
       street,
       rating,
       products,
       communication
     }, {new: true});

     // Check if the restaurant exists
     if (!restaurant) {
       // If not, send a 404 error
       return res.status(404).send('Restaurant not found');
     }

     // Redirect to the restaurant page with a success message
     res.redirect(`/restaurants/${restaurant._id}?success=Restaurant updated successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Define the controller function for deleting an existing restaurant by id
restaurantController.deleteRestaurantById = async (req, res) => {
  try {
     // Get the restaurant id from the request parameters
     const restaurantId = req.params.id;

     // Find and delete the restaurant by id from the database
     const restaurant = await Restaurant.findByIdAndDelete(restaurantId);

     // Check if the restaurant exists
     if (!restaurant) {
       // If not, send a 404 error
       return res.status(404).send('Restaurant not found');
     }

     // Redirect to the restaurants page with a success message
     res.redirect(`/restaurants?success=Restaurant deleted successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Export the restaurant controller object
module.exports = restaurantController;


 // storeController.js

// Import the store model
const Store = require('../models/store');

// Define the store controller object
const storeController = {};

// Define the controller function for getting all stores
storeController.getAllStores = async (req, res) => {
  try {
    // Find all stores from the database
    const stores = await Store.find();

    // Render the stores view with the stores data
    res.render('stores', {stores});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for getting one store by id
storeController.getStoreById = async (req, res) => {
  try {
    // Get the store id from the request parameters
    const storeId = req.params.id;

    // Find the store by id from the database
    const store = await Store.findById(storeId);

    // Check if the store exists
    if (!store) {
      // If not, send a 404 error
      return res.status(404).send('Store not found');
    }

    // Render the store view with the store data
    res.render('store', {store});
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for creating a new store
storeController.createStore = async (req, res) => {
  try {
    // Get the store data from the request body
    const {name, description, governorate, region, rating, products, deliveryPrice, freeDeliveryThreshold} = req.body;

    // Create a new store document with the data
    const store = new Store({
      name,
      description,
      governorate,
      region,
      rating,
      products,
      deliveryPrice,
      freeDeliveryThreshold
    });

    // Save the store to the database
    await store.save();

    // Redirect to the store page with a success message
    res.redirect(`/stores/${store._id}?success=Store created successfully`);
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for updating an existing store by id
storeController.updateStoreById = async (req, res) => {
  try {
     // Get the store id from the request parameters
     const storeId = req.params.id;

     // Get the updated store data from the request body
     const {name, description, governorate, region, rating, products, deliveryPrice, freeDeliveryThreshold} = req.body;

     // Find and update the store by id from the database
     const store = await Store.findByIdAndUpdate(storeId, {
       name,
       description,
       governorate,
       region,
       rating,
       products,
       deliveryPrice,
       freeDeliveryThreshold
     }, {new: true});

     // Check if the store exists
     if (!store) {
       // If not, send a 404 error
       return res.status(404).send('Store not found');
     }

     // Redirect to the store page with a success message
     res.redirect(`/stores/${store._id}?success=Store updated successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Define the controller function for deleting an existing store by id
storeController.deleteStoreById = async (req, res) => {
  try {
     // Get the store id from the request parameters
     const storeId = req.params.id;

     // Find and delete the store by id from the database
     const store = await Store.findByIdAndDelete(storeId);

     // Check if the store exists
     if (!store) {
       // If not, send a 404 error
       return res.status(404).send('Store not found');
     }

     // Redirect to the stores page with a success message
     res.redirect(`/stores?success=Store deleted successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Export the store controller object
module.exports = storeController;

// userController.js

// Import the user model
const User = require('../models/user');

// Import the auth service
const auth = require('../services/auth');

// Define the user controller object
const userController = {};

// Define the controller function for getting the login page
userController.getLoginPage = (req, res) => {
  // Render the login view
  res.render('login');
};

// Define the controller function for logging in a user
userController.loginUser = async (req, res) => {
  try {
    // Get the username and password from the request body
    const {username, password} = req.body;

    // Use the auth service to verify the user credentials and generate a token
    const token = await auth.loginUser(username, password);

    // Set the token as a cookie in the response
    res.cookie('token', token);

    // Redirect to the home page with a success message
    res.redirect('/?success=Logged in successfully');
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for getting the register page
userController.getRegisterPage = (req, res) => {
  // Render the register view
  res.render('register');
};

// Define the controller function for registering a new user
userController.registerUser = async (req, res) => {
  try {
    // Get the user data from the request body
    const {username, password, email} = req.body;

    // Use the auth service to create a new user and generate a token
    const token = await auth.registerUser(username, password, email);

    // Set the token as a cookie in the response
    res.cookie('token', token);

    // Redirect to the home page with a success message
    res.redirect('/?success=Registered successfully');
  } catch (err) {
    // Handle any errors
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Define the controller function for logging out a user
userController.logoutUser = (req, res) => {
  // Clear the cookie from the response
  res.clearCookie('token');

  // Redirect to the home page with a success message
  res.redirect('/?success=Logged out successfully');
};

// Define the controller function for getting the profile page of a user
userController.getProfilePage = async (req, res) => {
  try {
    // Get the user id from the request parameters
    const userId = req.params.id;

    // Find the user by id from the database
    const user = await User.findById(userId)
      .populate('subscriptions')
      .populate('orders')
      .populate('foodSchedule')
      .populate('exerciseSchedule')
      .populate('calorieCalculation');

    // Check if the user exists
    if (!user) {
      // If not, send a 404 error
      return res.status(404).send('User not found');
    }

    // Render the profile view with the user data
    res.render('profile', {user});
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Define the controller function for updating an existing user by id
userController.updateUserById = async (req, res) => {
  try {
     // Get the user id from the request parameters
     const userId = req.params.id;

     // Get the updated user data from the request body
     const {username, email, photo} = req.body;

     // Find and update the user by id from the database
     const user = await User.findByIdAndUpdate(userId, {
       username,
       email,
       photo
     }, {new: true});

     // Check if the user exists
     if (!user) {
       // If not, send a 404 error
       return res.status(404).send('User not found');
     }

     // Redirect to the profile page with a success message
     res.redirect(`/users/${user._id}?success=User updated successfully`);
  } catch (err) {
     // Handle any errors
     console.error(err);
     res.status(500).send('Server error');
  }
};

// Define the controller function for deleting an existing user by id
userController.deleteUserById = async (req, res) => {
  try {
     // Get the user id from the request parameters
     const userId = req.params
 // payment.js

// Import request and dotenv
const request = require('request');
const dotenv = require('dotenv');

// Load the environment variables
dotenv.config();

// Define the payment service object
const payment = {};

// Define the service function for processing a payment using Paystack API
payment.processPayment = (req, res) => {
  // Get the amount and reference from the request body
  const {amount, reference} = req.body;

  // Define the options for the request to Paystack API
  const options = {
    url: 'https://api.paystack.co/transaction/initialize',
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache'
    },
    form: {
      amount,
      reference,
      email: req.user.email
    }
  };

  // Make the request to Paystack API
  request.post(options, (error, response, body) => {
    // Handle any errors
    if (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }

    // Parse the response body
    const data = JSON.parse(body);

    // Check if the response status is success
    if (data.status) {
      // Redirect to the authorization URL from Paystack
      res.redirect(data.data.authorization_url);
    } else {
      // Send a failure message
      res.send('Payment failed');
    }
  });
};

// Define the service function for verifying a payment using Paystack API
payment.verifyPayment = (req, res) => {
  // Get the reference from the request query
  const {reference} = req.query;

  // Define the options for the request to Paystack API
  const options = {
    url: `https://api.paystack.co/transaction/verify/${reference}`,
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'content-type': 'application/json',
      'cache-control': 'no-cache'
    }
  };

  // Make the request to Paystack API
  request.get(options, (error, response, body) => {
    // Handle any errors
    if (error) {
      console.error(error);
      return res.status(500).send('Server error');
    }

    // Parse the response body
    const data = JSON.parse(body);

    // Check if the response status is success and transaction status is success
    if (data.status && data.data.status === 'success') {
      // Send a success message with the transaction details
      res.send(`Payment successful. Transaction ID: ${data.data.id}`);
    } else {
      // Send a failure message with the transaction details
      res.send(`Payment failed. Transaction ID: ${data.data.id}`);
    }
  });
};

// Export the payment service object
module.exports = payment;

    

// Assuming you have the offer id and the user id as parameters
const offerId = req.params.offerId;
const userId = req.params.userId;

// Find the offer by id and populate the subscribes field
const offer = await clubModel.findOne({ "offers._id": offerId }).select("offers.$");

// Check if the offer exists
if (!offer) {
  return res.status(404).json({ message: "Offer not found" });
}

// Check if the user is already subscribed to the offer
if (offer.offers[0].subscribes.includes(userId)) {
  return res.status(400).json({ message: "User already subscribed to this offer" });
}

// Find the user by id and update the subscibtions field
const user = await userModel.findByIdAndUpdate(
  userId,
  { $push: { subscibtions: offerId } },
  { new: true }
);

// Check if the user exists
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// Update the offer's subscribes field
offer.offers[0].subscribes.push(userId);
await offer.save();

// Send a success response
res.status(200).json({ message: "User subscribed to the offer successfully" });

/////////////////////////////

I'll try to help you with that. Here is some code that might work:

// Assuming you have the offer id and the user id as parameters
const offerId = req.params.offerId;
const userId = req.params.userId;

// Find the offer by id and populate the subscribes field
const offer = await clubModel.findOne({ "offers._id": offerId }).select("offers.$");

// Check if the offer exists
if (!offer) {
  return res.status(404).json({ message: "Offer not found" });
}

// Check if the user is already subscribed to the offer
if (offer.offers[0].subscribes.includes(userId)) {
  return res.status(400).json({ message: "User already subscribed to this offer" });
}

// Find the user by id and update the subscibtions field
const user = await userModel.findByIdAndUpdate(
  userId,
  { $push: { subscibtions: offerId } },
  { new: true }
);

// Check if the user exists
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

// Update the offer's subscribes field
offer.offers[0].subscribes.push(userId);
await offer.save();

// Find all the offers that the user subscribed to and populate the club name and description
const myOffers = await clubModel.find({ "offers.subscribes": userId }).select("name description offers.$");

// Send a success response with the offers array
res.status(200).json({ message: "User subscribed to the offer successfully", data: myOffers });



/////////////////////////////////////
//Here is an example of using the zaincash package with your cart model:

// import the zaincash package
const ZC = require ('zaincash');

// create a route handler for checkout
app.post ('/checkout', async (req, res) => {
  // get the user and cart id from the request body
  const { userId, cartId } = req.body;

  // find the cart by id and populate the product details
  const cart = await cartModel.findById(cartId).populate('cartItems.product');

  // calculate the total price of the cart items
  let totalPrice = 0;
  for (let item of cart.cartItems) {
    totalPrice += item.price * item.quantaty;
  }

  // create a new instance of ZC with your payment data
  const paymentData = {
    amount: totalPrice, // the amount to be paid in IQD
    orderId: cartId, // your order id from your DB
    serviceType: 'E-commerce', // your service type
    redirectUrl: 'example.com/redirect', // your redirect url to handle payment result
    production: false, // your environment mode (test or live)
    msisdn: '964****', // your Zain Cash wallet number
    merchantId: '5a647d843321dcd9cbc771c', // your merchant id from Zain Cash
    secret: '$2y$10$9eaqimBisY15ZJZSSvC3Z.Ar1ET1.7Kgm8p7jysY1X.I8.RuwS.', // your secret from Zain Cash
    lang: 'ar' // your website language
  };
  let zc = new ZC (paymentData);

  // initialize the payment and get the transaction id
  zc.init ().then (transactionId => {
    // Save the transactionId in your DB
    console.log (transactionId);
    // redirect the user to Zain Cash payment page with the transaction id
    zc.pay (transactionId, res);
  }).catch (err => {
    res.status (400).send (err);
  });
});
