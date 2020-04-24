const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

function repositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository doesn't exist" });
  }

  request.params.repositoryIndex = repositoryIndex;

  return next();
}

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", repositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const { repositoryIndex } = request.params;

  const oldRepository = repositories[repositoryIndex]

  const repository = {
    id,
    title,
    url,
    techs,
    likes: oldRepository.likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository)
});

app.delete("/repositories/:id", repositoryExists, (request, response) => {
  const { repositoryIndex } = request.params;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryExists, (request, response) => {
  const { repositoryIndex } = request.params;

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
