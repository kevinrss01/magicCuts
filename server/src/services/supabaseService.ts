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

// Mise à jour de la fonction pour insérer un document dans la table :
// Ajoutez les paramètres userId, originalVideoUrl, et detectedSegments.
export const createProjectDocument = async ({
  userId,
  documentId,
}: {
  userId: string;
  documentId: string;
}) => {
  try {
    const { data, error } = await supabase.from("project_documents").insert([
      {
        id: documentId,
        user_id: userId,
        original_video_url: null,
        detected_segments: null,
        state: "pending",
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
