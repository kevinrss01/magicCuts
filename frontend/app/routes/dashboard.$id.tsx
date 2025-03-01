import { Spinner } from "@heroui/react";
import { useParams } from "@remix-run/react";
import { VideoSegmentCard } from "components/dashboard/VideoSegmentCard";
import { useState } from "react";
import { useEffect } from "react";
import { ProjectDocument } from "~/types/supabase";
import { ProjectAPI } from "~/utils/services/api/ProjectApi";
import { toastMsg } from "~/utils/toasts";

const DashboardItem = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [projectDocument, setProjectDocument] =
    useState<ProjectDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  const getProjectData = async (id: string) => {
    try {
      if (!id) {
        throw new Error("No id provided");
      }
      const projectDocument = await ProjectAPI.getProject(id);
      setProjectDocument(projectDocument);
    } catch (error) {
      toastMsg.error("Erreur lors de la récupération du projet");
      console.error(error);
      setError("Erreur lors de la récupération du projet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      getProjectData(params.id);
    } else {
      setError("No project ID provided");
      setLoading(false);
    }
  }, [params.id]);

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spinner />
        </div>
      ) : (
        <>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-6">Top 10 Viral Moments</h1>
              <div className="flex flex-col gap-4">
                {projectDocument?.detected_segments
                  .sort((a, b) => a.rank - b.rank)
                  .map((segment) => (
                    <VideoSegmentCard key={segment.rank} segment={segment} />
                  ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardItem;
