import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  Timestamp,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Monster, Sighting } from "../interfaces";

// Fetch all monsters
export const fetchMonsters = async (): Promise<Monster[]> => {
  const querySnapshot = await getDocs(collection(db, "monsters"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Monster[];
};

// Fetch all sightings
export const fetchSightings = async (): Promise<Sighting[]> => {
  const querySnapshot = await getDocs(collection(db, "sightings"));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Sighting[];
};

// Add a new monster
export const addMonster = async (
  name: string,
  maps: string[],
  respawnTime: number
): Promise<void> => {
  await addDoc(collection(db, "monsters"), {
    name,
    maps,
    respawnTime,
  });
};

// Delete a monster
export const deleteMonster = async (monsterId: string): Promise<void> => {
  await deleteDoc(doc(db, "monsters", monsterId));
};

// Update a monster
export const updateMonster = async (
  monsterId: string,
  newData: Partial<Monster>
): Promise<void> => {
  await updateDoc(doc(db, "monsters", monsterId), newData);
};

const getExistingSighting = async (
  monsterId: string,
  map: string,
  channel: number
) => {
  const existingSightingQuery = query(
    collection(db, "sightings"),
    where("monsterId", "==", monsterId),
    where("map", "==", map),
    where("channel", "==", channel)
  );

  const snapshot = await getDocs(existingSightingQuery);
  return snapshot.empty ? null : snapshot.docs[0]; // Return first matching document if found
};

// Check for existing sighting and update it
export const saveSighting = async (
  monster: Monster,
  map: string,
  channel: number,
  foundAt: Date = new Date()
) => {
  const respawnTimeMs = monster.respawnTime * 60 * 60 * 1000; // Convert hours to ms
  const earliest = new Date(foundAt.getTime() + respawnTimeMs * 0.8);
  const latest = new Date(foundAt.getTime() + respawnTimeMs * 1.2);

  const sightingData = {
    monsterId: monster.id,
    monsterName: monster.name,
    map,
    channel,
    foundAt: Timestamp.fromDate(foundAt),
    respawnRange: {
      earliest: Timestamp.fromDate(earliest),
      latest: Timestamp.fromDate(latest),
    },
  };

  const existingSighting = await getExistingSighting(monster.id, map, channel);

  if (existingSighting) {
    await updateDoc(doc(db, "sightings", existingSighting.id), sightingData);
  } else {
    await addDoc(collection(db, "sightings"), sightingData);
  }
};

// Delete a sighting
export const deleteSighting = async (sightingId: string) => {
  await deleteDoc(doc(db, "sightings", sightingId));
};

// Update a sighting
export const updateSighting = async (
  sightingId: string,
  newData: Partial<Sighting>
) => {
  await updateDoc(doc(db, "sightings", sightingId), newData);
};

// Delete all sightings
export const clearAllSightings = async (): Promise<void> => {
  const querySnapshot = await getDocs(collection(db, "sightings"));
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};
