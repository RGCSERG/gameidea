import { config } from "dotenv";
config();

import postgres from "postgres";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`;

const sql = postgres(URL, { ssl: "require" });

export async function insertMessage(roomName, senderId, message) {
  try {
    const insertQuery = sql`
      INSERT INTO messages (room_name, sender_id, message)
      VALUES (${roomName}, ${senderId}, ${message})
      RETURNING *
    `;

    // Execute the query and store the result in the 'result' variable
    const result = await insertQuery;

    // Log the inserted data (optional)
    console.log(`Message inserted into room ${roomName}:`, result);

    // Return the inserted data
    return result;
  } catch (error) {
    console.error("Error inserting message:", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}
