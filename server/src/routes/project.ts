import { Hono } from "hono";
import { ProjectController } from "../controllers/projectController";
export const projectRoutes = new Hono();

projectRoutes.post("/createProject", async (c) => {
  console.debug("Starting createProject route...");
  const projectController = new ProjectController();
  const result = await projectController.createProject(c);
  console.debug("createProject route completed");
  return c.json(result);
});

projectRoutes.post("/getProject", async (c) => {
  const projectController = new ProjectController();
  const result = await projectController.getProject(c);
  return c.json(result);
});

projectRoutes.post("/getAllProjects", async (c) => {
  const projectController = new ProjectController();
  const result = await projectController.getAllProjects(c);
  return c.json(result);
});

projectRoutes.post("/addSubtitle", async (c) => {
  const projectController = new ProjectController();
  const result = await projectController.addSubtitle(c);
  // @ts-ignore
  return c.json(result);
});
