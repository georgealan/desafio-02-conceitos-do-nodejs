const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

/**
 * 
 * POST /repositories: A rota deve receber title, url e techs dentro do corpo da requisição, sendo a URL o link para o 
 * github desse repositório. Ao cadastrar um novo projeto, ele deve ser armazenado dentro de um objeto no 
 * seguinte formato: { id: "uuid", title: 'Desafio Node.js', url: 'http://github.com/...', techs: ["Node.js", "..."], likes: 0 }; 
 * Certifique-se que o ID seja um UUID, e de sempre iniciar os likes como 0. 
 * 
 * GET /repositories: Rota que lista todos os repositórios;
 * PUT /repositories/:id: A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao 
 * id presente nos parâmetros da rota;
 * DELETE /repositories/:id: A rota deve deletar o repositório com o id presente nos parâmetros da rota;
 * POST /repositories/:id/like: A rota deve aumentar o número de likes do repositório específico escolhido através do id
 * presente nos parâmetros da rota, a cada chamada dessa rota, o número de likes deve ser aumentado em 1;
 * 
 * Dica: Acima utilizamos POST em uma rota, mesmo ela alterando o número de likes do repositório sem criar nada diretamente.
 * Se dividirmos semânticamente as responsabilidades da nossa aplicação em entidades, o like seria uma entidade, e 
 * repository seria outra entidade. 
 * Com essa separação, temos diferentes regras de negócio para cada entidade, assim, ao chamar a rota de like e 
 * adicionamos apenas um like, podemos interpretar que estamos criando um novo like, e não atualizando os likes.
 * Então por que não usar PUT no lugar de POST? Justamente por estarmos "criando" UM novo like, e não atualizando o 
 * número de likes para qualquer outro valor.
 * Talvez fique difícil enxergar por ser apenas um número, mas pense que cada like seja salvo em uma tabela no banco 
 * junto do usuário que realizou esse like. Agora fica mais claro que você está criando um novo like, certo?
 */


const repositories = [];

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (isUuid(id)) {
    return next();
  } return response.status(400).json({error: 'Invalid project ID.'}); 
}

app.use('/repositories/:id', validateProjectId);
// app.use('/repositories/:id/like', validateProjectId, incrementLikes);

app.get('/repositories', (request, response) => {
  const { title, techs } = request.query;

  const results = title || techs ? repositories.filter(
    repository => repository.title.includes(title) || repository.techs.includes(techs)) : repositories;

    return response.json(results);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' });
  }

  

});

module.exports = app;
