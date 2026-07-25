// Handle file upload for a project.
async function uploadProjectFile(req, res) {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.id;

    const project = await projectModel.getProjectById(projectId);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    if (project.user_id !== userId) {
      return res.status(403).send("Access denied");
    }

    if (!req.file) {
      return res.status(400).send("Please select a file.");
    }

    const result = await uploadFile(req.file, projectId);

    return res.json({
      message: "File uploaded successfully!",
      file: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Upload failed.");
  }
}
