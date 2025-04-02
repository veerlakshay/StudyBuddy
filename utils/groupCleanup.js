import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import { Timestamp } from "firebase/firestore";

export const cleanupExpiredGroups = async () => {
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // Reset time part for date-only comparison
        const nowTimestamp = Timestamp.fromDate(now);
        
        const groupsRef = collection(db, "studyGroups");
        const q = query(groupsRef, where("dateTimestamp", "<", nowTimestamp));

        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(async (doc) => {
            // Delete the group document
            await deleteDoc(doc.ref);
            
            // Delete from all users' joinedGroups
            const usersRef = collection(db, "users");
            const usersSnapshot = await getDocs(usersRef);
            
            const userDeletePromises = usersSnapshot.docs.map(async (userDoc) => {
                const joinedGroupRef = doc(db, "users", userDoc.id, "joinedGroups", doc.id);
                await deleteDoc(joinedGroupRef);
            });
            
            await Promise.all(userDeletePromises);
        });

        await Promise.all(deletePromises);
        console.log("Expired groups cleaned up successfully");
    } catch (error) {
        console.error("Error cleaning up expired groups:", error);
    }
};

// Function to check if a group is expired
export const isGroupExpired = (dateTimestamp) => {
    if (!dateTimestamp) return true;
    
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset time part for date-only comparison
    
    const groupDate = dateTimestamp.toDate();
    groupDate.setHours(0, 0, 0, 0); // Reset time part for date-only comparison
    
    return groupDate < now;
}; 