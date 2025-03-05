import { createClient } from "@supabase/supabase-js";
import { config } from "../config/config";
import type { UserData } from "../types/user";
import type { DetectedSegments } from "../types/openai";
import { HTTPException } from "hono/http-exception";

export const supabase = createClient(
  config.supabaseUrl,
  config.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  },
);

export const getUserData = async (userId: string) => {
  try {
    const { data: user, error } = await supabase.auth.admin.getUserById(userId);

    if (error) {
      console.error("Error fetching user data", error);
      throw error;
    }

    const userData: UserData = {
      name: user.user.user_metadata.name,
      email: user.user.email!,
      avatar: user.user.user_metadata.avatar_url,
      id: user.user.id,
    };

    return userData;
  } catch (error) {
    console.error("Error fetching user data", error);
    throw error;
  }
};

export const getAllUserData = async (userId: string) => {
  try {
    const userRelativeData = await getUserData(userId);
    const otherUserData = await getUserDocument(userRelativeData.email);

    const { data: userDocuments, error: userDocumentsError } = await supabase
      .from("project_documents")
      .select("*")
      .eq("user_id", userId);

    if (userDocumentsError) {
      console.error("Error fetching user documents", userDocumentsError);
      throw userDocumentsError;
    }

    return {
      userRelativeData: {
        ...userRelativeData,
        ...otherUserData,
      },
      userDocuments,
    };
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error("Error fetching all user data", error);
    throw new HTTPException(500, {
      message: "Error fetching all user data",
    });
  }
};

// Mise à jour de la fonction pour insérer un document dans la table :
// Ajoutez les paramètres userId, originalVideoUrl, et detectedSegments.
export const createProjectDocument = async ({
  userId,
  documentId,
  projectName,
}: {
  userId: string;
  documentId: string;
  projectName: string;
}) => {
  // Check if document already exists
  const { data: existingDocument, error: checkError } = await supabase
    .from("project_documents")
    .select()
    .eq("id", documentId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 means no rows returned, which is what we want
    console.error("Error checking for existing document", checkError);
    throw new HTTPException(500, {
      message: "Error checking for existing document",
    });
  }

  if (existingDocument) {
    throw new HTTPException(400, {
      message: "A document with this ID already exists",
    });
  }

  try {
    const { data, error } = await supabase.from("project_documents").insert([
      {
        id: documentId,
        user_id: userId,
        original_video_url: null,
        detected_segments: null,
        state: "pending",
        name: projectName,
        createdDate: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating project document", error);
      throw new HTTPException(500, {
        message: "Error creating project document",
      });
    }

    return data;
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error("Error creating project document", error);
    throw new HTTPException(500, {
      message: "Error creating project document",
    });
  }
};

// Fonction pour mettre à jour un document dans la table "project_documents"
export const updateProjectDocument = async ({
  documentId,
  detectedSegments,
  state,
}: {
  documentId: string;
  detectedSegments: DetectedSegments[];
  state: string;
}) => {
  const { data, error } = await supabase
    .from("project_documents")
    .update({
      detected_segments: detectedSegments,
      state: state,
    })
    .eq("id", documentId);

  if (error) {
    console.error("Error updating project document", error);
    throw error;
  }

  return data;
};

export const getProjectDocument = async (documentId: string) => {
  try {
    const { data, error } = await supabase
      .from("project_documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error) {
      console.error("Error fetching project document", error);
      throw new HTTPException(500, {
        message: "Error fetching project document",
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching project document", error);
    throw new HTTPException(500, {
      message: "Error fetching project document",
    });
  }
};

export const getProjectsByUserId = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("project_documents")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching projects by user id", error);
      throw new HTTPException(500, {
        message: "Error fetching projects by user id",
      });
    }

    return data;
  } catch (error) {
    console.error("Error fetching projects by user id", error);
    throw error;
  }
};

export const createUserDocument = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .insert([{ email, name, tokens: 1, is_premium: false }]);

    if (error) {
      console.error("Error creating user", error);
      throw new HTTPException(500, {
        message: "Error creating user",
      });
    }

    return data;
  } catch (error) {
    console.error("Error creating user", error);
    throw new HTTPException(500, {
      message: "Error creating user",
    });
  }
};

export const isUserDocumentExists = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error) {
      console.error("Error checking if user document exists", error);
      throw new HTTPException(500, {
        message: "Error checking if user document exists",
      });
    }

    return data.length > 0 ? true : false;
  } catch (error) {
    console.error("Error checking if user document exists", error);
    throw new HTTPException(500, {
      message: "Error checking if user document exists",
    });
  }
};

export const getUserDocument = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("tokens, is_premium")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user document", error);
      throw new HTTPException(500, {
        message: "Error fetching user document",
      });
    }

    return {
      tokens: data.tokens,
      is_premium: data.is_premium,
    };
  } catch (error) {
    console.error("Error fetching user tokens and premium status", error);
    throw new HTTPException(500, {
      message: "Error fetching user tokens and premium status",
    });
  }
};

/**
 * Updates a user's token count
 * @param email The user's email
 * @param tokensToDeduct Number of tokens to deduct (positive number)
 * @returns The updated user data
 */
export const updateUserTokens = async (
  email: string,
  tokensToDeduct: number,
) => {
  try {
    // First get current token count
    const { tokens } = await getUserDocument(email);

    // Check if user has enough tokens
    if (tokens < tokensToDeduct) {
      throw new HTTPException(403, {
        message: "Insufficient tokens. Please purchase more tokens.",
      });
    }

    // Update tokens
    const { data, error } = await supabase
      .from("users")
      .update({ tokens: tokens - tokensToDeduct })
      .eq("email", email)
      .select("tokens, is_premium");

    if (error) {
      console.error("Error updating user tokens", error);
      throw new HTTPException(500, {
        message: "Error updating user tokens",
      });
    }

    return {
      tokens: data[0].tokens,
      is_premium: data[0].is_premium,
    };
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error;
    }
    console.error("Error updating user tokens", error);
    throw new HTTPException(500, {
      message: "Error updating user tokens",
    });
  }
};
