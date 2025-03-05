import { Hono } from "hono";
import { ProjectController } from "../controllers/projectController";
export const projectRoutes = new Hono();

projectRoutes.post("/createProject", async (c) => {
  const projectController = new ProjectController();
  const result = await projectController.createProject(c);
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
  return c.json(result);
});
