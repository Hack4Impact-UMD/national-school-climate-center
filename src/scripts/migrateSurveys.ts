import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  setDoc
} from "firebase/firestore";

async function migrateSurveys() {
  try {
    const surveys2Snap = await getDocs(collection(db, "surveys2"));

    for (const surveyDoc of surveys2Snap.docs) {
      const surveyId = surveyDoc.id;
      const surveyData = surveyDoc.data();

      await setDoc(doc(db, "surveys", surveyId), surveyData);

      const responsesSnap = await getDocs(
        collection(db, "surveys2", surveyId, "responses2")
      );

      for (const responseDoc of responsesSnap.docs) {
        const responseData = responseDoc.data();

        await setDoc(
          doc(db, "surveys", surveyId, "responses", responseDoc.id),
          responseData
        );
      }
    }

    console.log("Migration complete");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrateSurveys();