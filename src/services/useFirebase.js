import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

async function getCitiesData() {
  try {
    const querySnapshot = await getDocs(collection(db, "cities"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error getting cities data:", error);
  }
}

const UseFirebase = () => {
  getCitiesData();
  return (
    <>
      <div>this is use firebase </div>
    </>
  );
};
export default UseFirebase;
