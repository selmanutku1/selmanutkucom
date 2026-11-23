import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDocFromServer, getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const CONTACT_MESSAGES_COLLECTION = 'contact_messages';
export const RESEARCH_ARTICLES_COLLECTION = 'research_articles';
export const ADMIN_EMAIL = 'selmanutkumarmara@gmail.com';

// Synchronized verbatim with firebase-blueprint.json & firestore.rules
export const CONTACT_LIMITS = {
  fullNameMin: 2,
  fullNameMax: 120,
  emailMin: 5,
  emailMax: 180,
  subjectMin: 3,
  subjectMax: 180,
  messageMin: 15,
  messageMax: 4000,
} as const;

export const RESEARCH_LIMITS = {
  slugMin: 3,
  slugMax: 120,
  titleMin: 3,
  titleMax: 200,
  excerptMin: 10,
  excerptMax: 600,
  takeawaysMaxCount: 8,
  takeawayMaxLength: 300,
  bodyMin: 20,
  bodyMax: 20000,
  readTimeMin: 1,
  readTimeMax: 60,
} as const;

export const CONTACT_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const RESEARCH_SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const RESEARCH_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

if (typeof window !== 'undefined') {
  void testConnection();
}
