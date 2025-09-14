import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { firestore } from '../firebase.config';
import { TouristRequest, SOSAlert } from '../types';

export class FirestoreService {
  // Listen to tourist requests in real-time
  static subscribeToRequests(callback: (requests: TouristRequest[]) => void) {
    const requestsRef = collection(firestore, 'requests');
    const q = query(
      requestsRef, 
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const requests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as TouristRequest[];
      callback(requests);
    });
  }

  // Listen to SOS alerts in real-time
  static subscribeToSOSAlerts(callback: (alerts: SOSAlert[]) => void) {
    const sosRef = collection(firestore, 'sosAlerts');
    const q = query(
      sosRef, 
      where('status', 'in', ['active', 'responding']),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as SOSAlert[];
      callback(alerts);
    });
  }

  // Accept a tourist request
  static async acceptRequest(requestId: string, guideId: string) {
    const requestRef = doc(firestore, 'requests', requestId);
    await updateDoc(requestRef, {
      status: 'accepted',
      guideId: guideId,
      acceptedAt: Timestamp.now()
    });
  }

  // Reject a tourist request
  static async rejectRequest(requestId: string, guideId: string) {
    const requestRef = doc(firestore, 'requests', requestId);
    await updateDoc(requestRef, {
      status: 'rejected',
      guideId: guideId,
      rejectedAt: Timestamp.now()
    });
  }

  // Respond to SOS alert (I'm Nearby/Helping)
  static async respondToSOS(alertId: string, guideId: string) {
    const sosRef = doc(firestore, 'sosAlerts', alertId);
    await updateDoc(sosRef, {
      status: 'responding',
      respondingGuideId: guideId,
      responseTime: Timestamp.now()
    });
  }

  // Mark SOS as resolved
  static async resolveSOS(alertId: string) {
    const sosRef = doc(firestore, 'sosAlerts', alertId);
    await updateDoc(sosRef, {
      status: 'resolved',
      resolvedAt: Timestamp.now()
    });
  }
}