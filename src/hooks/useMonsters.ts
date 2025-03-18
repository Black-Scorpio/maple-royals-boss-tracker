import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Monster, Sighting } from "../interfaces";
import { deleteSighting } from "../services/firebaseService";

export const useMonsters = () => {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [sightings, setSightings] = useState<Sighting[]>([]);

  // Load monsters and sightings in real time
  useEffect(() => {
    // Listen for changes to the monsters collection
    const monstersQuery = collection(db, "monsters");
    const unsubscribeMonsters = onSnapshot(monstersQuery, (snapshot) => {
      const monstersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Monster[];
      setMonsters(monstersData);
    });

    // Listen for changes to the sightings collection
    const sightingsQuery = collection(db, "sightings");
    const unsubscribeSightings = onSnapshot(sightingsQuery, (snapshot) => {
      const sightingsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sighting[];

      // Filter out expired sightings
      const now = new Date();
      const validSightings = sightingsData.filter(
        (sighting) => sighting.respawnRange.latest.toDate() > now
      );

      // Delete expired sightings from Firestore
      const expiredSightings = sightingsData.filter(
        (sighting) => sighting.respawnRange.latest.toDate() <= now
      );
      for (const sighting of expiredSightings) {
        deleteSighting(sighting.id);
      }

      setSightings(validSightings);
    });

    // Clean up listeners when the component unmounts
    return () => {
      unsubscribeMonsters();
      unsubscribeSightings();
    };
  }, []);

  return { monsters, sightings };
};
