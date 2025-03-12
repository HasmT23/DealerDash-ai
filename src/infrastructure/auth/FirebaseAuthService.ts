import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateProfile,
    User
  } from 'firebase/auth';
  import { auth, db } from '@/infrastructure/firebase/config';
  import { doc, setDoc, getDoc } from 'firebase/firestore';
  import { IAuthService } from '@/core/interfaces/IAuthService';
  
  export class FirebaseAuthService implements IAuthService {
    async signUp(email: string, password: string, userData: object): Promise<string> {
      try {
        // Create the user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Store additional user data in Firestore
        await setDoc(doc(db, 'dealerships', user.uid), {
          ...userData,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        
        // Send email verification
        await sendEmailVerification(user);
        
        return user.uid;
      } catch (error) {
        console.error('Error during sign up:', error);
        throw new Error('Failed to create account');
      }
    }
  
    async signIn(email: string, password: string): Promise<string> {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user.uid;
      } catch (error) {
        console.error('Error during sign in:', error);
        throw new Error('Invalid email or password');
      }
    }
  
    async signOut(): Promise<void> {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error during sign out:', error);
        throw new Error('Failed to sign out');
      }
    }
  
    async getCurrentUser(): Promise<object | null> {
      const user = auth.currentUser;
      if (!user) return null;
      
      try {
        // Get additional user data from Firestore
        const docRef = doc(db, 'dealerships', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          return {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            ...docSnap.data()
          };
        }
        
        return {
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified
        };
      } catch (error) {
        console.error('Error getting current user:', error);
        return null;
      }
    }
  
    async updateUserProfile(userId: string, data: Record<string, any>): Promise<boolean> {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user is signed in');
        
        // Update displayName and photoURL if provided
        if ('displayName' in data || 'photoURL' in data) {
          await updateProfile(user, {
            displayName: data.displayName || null,
            photoURL: data.photoURL || null
          });
        }
        
        // Update additional user data in Firestore
        const docRef = doc(db, 'dealerships', userId);
        await setDoc(docRef, {
          ...data,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        
        return true;
      } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Failed to update profile');
      }
    }
  
    async resetPassword(email: string): Promise<boolean> {
      try {
        await sendPasswordResetEmail(auth, email);
        return true;
      } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
      }
    }
  
    async verifyEmail(email: string): Promise<boolean> {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user is signed in');
        
        await sendEmailVerification(user);
        return true;
      } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
      }
    }
  }
  

  