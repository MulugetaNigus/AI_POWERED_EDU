import mongoose from 'mongoose';

// MongoDB connection URL - replace with your actual MongoDB URL
const MONGODB_URL = 'mongodb://localhost:27017/ai_edu';

// Connect to MongoDB
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// User Credits Schema
const creditSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  credits: {
    type: Number,
    default: 2
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'premium'],
      default: 'free'
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Payment History Schema
const paymentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  txRef: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'premium'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Models
export const Credit = mongoose.model('Credit', creditSchema);
export const Payment = mongoose.model('Payment', paymentSchema);

// Credit Management Functions
export async function initializeUserCredits(userId: string) {
  try {
    const existingCredits = await Credit.findOne({ userId });
    if (!existingCredits) {
      return await Credit.create({
        userId,
        credits: 2,
        subscription: {
          plan: 'free',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      });
    }
    return existingCredits;
  } catch (error) {
    console.error('Error initializing user credits:', error);
    throw error;
  }
}

export async function getUserCredits(userId: string) {
  try {
    const credits = await Credit.findOne({ userId });
    if (!credits) {
      return await initializeUserCredits(userId);
    }
    return credits;
  } catch (error) {
    console.error('Error getting user credits:', error);
    throw error;
  }
}

export async function updateUserCredits(userId: string, amount: number) {
  try {
    const credits = await Credit.findOneAndUpdate(
      { userId },
      { 
        $inc: { credits: amount },
        $set: { updatedAt: new Date() }
      },
      { new: true }
    );
    return credits;
  } catch (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}

export async function updateSubscription(userId: string, plan: 'basic' | 'premium', months: number = 1) {
  try {
    const bonusCredits = plan === 'basic' ? 100 : 500;
    const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

    const credits = await Credit.findOneAndUpdate(
      { userId },
      {
        $inc: { credits: bonusCredits },
        $set: {
          'subscription.plan': plan,
          'subscription.expiresAt': expiresAt,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    return credits;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

// Payment Functions
export async function createPayment(
  userId: string,
  txRef: string,
  amount: number,
  plan: 'basic' | 'premium'
) {
  try {
    return await Payment.create({
      userId,
      txRef,
      amount,
      plan,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
}

export async function updatePaymentStatus(txRef: string, status: 'success' | 'failed') {
  try {
    return await Payment.findOneAndUpdate(
      { txRef },
      {
        $set: {
          status,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}
