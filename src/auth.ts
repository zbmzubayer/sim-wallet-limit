import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/options";

/**
 * Get the server session
 * @returns {Promise<Session | null>} The session
 */
const auth = async () => getServerSession(authOptions);

export default auth;
