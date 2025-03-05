import type { Context } from "hono";
import jwt from "jsonwebtoken";
import {
  createUserDocument,
  getAllUserData,
  isUserDocumentExists,
  supabase,
} from "../services/supabaseService";
import { config } from "../config/config";
import { HTTPException } from "hono/http-exception";

/**
 * Endpoint to initiate Google OAuth login.
 * It generates a URL for Google OAuth via Supabase.
 */
export const googleLogin = async (c: Context) => {
  const redirectTo =
    process.env.NODE_ENV === "production"
      ? "https://app.magiccuts.pro"
      : process.env.FRONTEND_URL;

  console.log("redirectTo", redirectTo);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${redirectTo}/login`,
    },
  });

  if (error) {
    throw new HTTPException(500, {
      message: error.message,
    });
  }

  // The client should be redirected to the URL provided by Supabase.
  return c.json({ url: data.url });
};

export const signIn = async (c: Context) => {
  const { accessToken } = await c.req.json();
  if (!accessToken) {
    throw new HTTPException(400, {
      message: "Access token is required",
    });
  }

  let decodedUser: any;
  let tokenExpired = false;

  try {
    decodedUser = jwt.verify(accessToken, config.jwtSecret);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      tokenExpired = true;
      decodedUser = jwt.decode(accessToken);
    } else {
      throw new HTTPException(401, {
        message: "Invalid token",
      });
    }
  }

  // Ensure that the decoded payload contains a 'user' object with an 'id'
  if (
    !decodedUser ||
    typeof decodedUser !== "object" ||
    !decodedUser.user ||
    !decodedUser.user.id
  ) {
    console.error("token payload is invalid: ", decodedUser);
    throw new HTTPException(401, {
      message: "Token payload is invalid",
    });
  }

  const userId = decodedUser.user.id;

  const userData = await getAllUserData(userId);

  const { userRelativeData } = userData;

  const newToken = jwt.sign({ user: userRelativeData }, config.jwtSecret, {
    expiresIn: "1h",
  });

  return c.json({ accessToken: newToken, userData: userData });
};

export const authCallback = async (c: Context) => {
  console.log("authCallback");
  try {
    const body = await c.req.json();

    if (!body) {
      console.error("No body provided");
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const access_token = body.accessToken;

    if (!access_token) {
      console.error("No access token provided");
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const { data: userData, error } = await supabase.auth.getUser(access_token);
    if (error || !userData) {
      console.error("Error fetching user data", error);
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const userDocumentExists = await isUserDocumentExists(
      userData.user.email || "",
    );

    if (!userDocumentExists) {
      console.debug("User document does not exist, creating it");
      await createUserDocument({
        email: userData.user.email || "",
        name: userData.user.user_metadata.name || "",
      });
    } else {
      console.debug("User document already exists");
    }

    const userCompleteData = await getAllUserData(userData.user.id);

    const userInfo = {
      name: userData.user.user_metadata.name,
      email: userData.user.email,
      avatar: userData.user.user_metadata.avatar_url,
      id: userData.user.id,
    };

    const token = jwt.sign({ user: userInfo }, config.jwtSecret, {
      expiresIn: "24h",
    });

    return c.json({
      accessToken: token,
      userInfo: {
        userRelativeData: userCompleteData.userRelativeData,
        userDocuments: userCompleteData.userDocuments,
      },
    });
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error("Error in authCallback", error);
    throw new HTTPException(500, {
      message: "Internal server error",
    });
  }
};
