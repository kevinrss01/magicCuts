import type { Context } from "hono";
import jwt from "jsonwebtoken";
import { getUserData, supabase } from "../services/supabaseService";
import { config } from "../config/config";
import { HTTPException } from "hono/http-exception";

/**
 * Endpoint to initiate Google OAuth login.
 * It generates a URL for Google OAuth via Supabase.
 */
export const googleLogin = async (c: Context) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.FRONTEND_URL}/login`,
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
    throw new HTTPException(401, {
      message: "Token payload is invalid",
    });
  }

  const userId = decodedUser.user.id;

  const userData = await getUserData(userId);

  const newToken = jwt.sign({ user: userData }, config.jwtSecret, {
    expiresIn: "1h",
  });

  return c.json({ accessToken: newToken, userData: userData });
};

export const authCallback = async (c: Context) => {
  try {
    const body = await c.req.json();

    console.log("Body", body);

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

    console.log("Access token provided", access_token);

    const { data: userData, error } = await supabase.auth.getUser(access_token);
    if (error || !userData) {
      console.error("Error fetching user data", error);
      throw new HTTPException(401, {
        message: "Unauthorized",
      });
    }

    const userInfo = {
      name: userData.user.user_metadata.name,
      email: userData.user.email,
      avatar: userData.user.user_metadata.avatar_url,
      id: userData.user.id,
    };

    const token = jwt.sign({ user: userInfo }, config.jwtSecret, {
      expiresIn: "24h",
    });

    return c.json({ accessToken: token, userInfo });
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
