// src/services/db.js
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export const DB = {
  // CONFIG
  async getConfig() {
    try {
      const docRef = doc(db, 'config', 'settings');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return { initialized: false };
      }
    } catch (error) {
      console.error('Erreur getConfig:', error);
      return { initialized: false };
    }
  },

  async setConfig(config) {
    try {
      const docRef = doc(db, 'config', 'settings');
      await setDoc(docRef, config, { merge: true });
    } catch (error) {
      console.error('Erreur setConfig:', error);
      throw error;
    }
  },

  // USERS
  async getUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erreur getUsers:', error);
      return [];
    }
  },

  async addUser(user) {
    try {
      const docRef = await addDoc(collection(db, 'users'), {
        ...user,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...user };
    } catch (error) {
      console.error('Erreur addUser:', error);
      throw error;
    }
  },

  async updateUser(userId, updates) {
    try {
      const docRef = doc(db, 'users', userId);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Erreur updateUser:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (error) {
      console.error('Erreur deleteUser:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const q = query(collection(db, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error('Erreur getUserByEmail:', error);
      return null;
    }
  },

  // CAMIONS
  async getCamions() {
    try {
      const querySnapshot = await getDocs(collection(db, 'camions'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erreur getCamions:', error);
      return [];
    }
  },

  async addCamion(camion) {
    try {
      const docRef = await addDoc(collection(db, 'camions'), {
        ...camion,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...camion };
    } catch (error) {
      console.error('Erreur addCamion:', error);
      throw error;
    }
  },

  async updateCamion(id, updates) {
    try {
      const docRef = doc(db, 'camions', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Erreur updateCamion:', error);
      throw error;
    }
  },

  async deleteCamion(id) {
    try {
      // Supprimer le camion
      await deleteDoc(doc(db, 'camions', id));
      
      // Supprimer tous les équipements associés
      const q = query(collection(db, 'equipements'), where('camionId', '==', id));
      const querySnapshot = await getDocs(q);
      
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error('Erreur deleteCamion:', error);
      throw error;
    }
  },

  // EQUIPEMENTS
  async getEquipements() {
    try {
      const querySnapshot = await getDocs(collection(db, 'equipements'));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erreur getEquipements:', error);
      return [];
    }
  },

  async getEquipementsByCamion(camionId) {
    try {
      const q = query(
        collection(db, 'equipements'), 
        where('camionId', '==', camionId),
        orderBy('ordre')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Erreur getEquipementsByCamion:', error);
      return [];
    }
  },

  async addEquipement(equipement) {
    try {
      // Calculer l'ordre
      const q = query(
        collection(db, 'equipements'), 
        where('camionId', '==', equipement.camionId)
      );
      const querySnapshot = await getDocs(q);
      const ordre = querySnapshot.size;

      const docRef = await addDoc(collection(db, 'equipements'), {
        ...equipement,
        ordre,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...equipement, ordre };
    } catch (error) {
      console.error('Erreur addEquipement:', error);
      throw error;
    }
  },

  async deleteEquipement(id) {
    try {
      await deleteDoc(doc(db, 'equipements', id));
    } catch (error) {
      console.error('Erreur deleteEquipement:', error);
      throw error;
    }
  }
};