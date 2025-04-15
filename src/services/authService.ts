
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/firebase/config';

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Convert Firebase User to our AuthUser type
export const formatUser = (user: User): AuthUser => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  };
};

// Register a new user
export const registerUser = async (
  email: string, 
  password: string, 
  displayName: string
): Promise<AuthUser> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update user profile with display name
  await updateProfile(userCredential.user, { displayName });
  
  return formatUser(userCredential.user);
};

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return formatUser(userCredential.user);
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

// Get current user
export const getCurrentUser = (): Promise<AuthUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      if (user) {
        resolve(formatUser(user));
      } else {
        resolve(null);
      }
    });
  });
};

// Subscribe to auth state changes
export const subscribeToAuthChanges = (callback: (user: AuthUser | null) => void): () => void => {
  return onAuthStateChanged(auth, (user) => {
    callback(user ? formatUser(user) : null);
  });
};
