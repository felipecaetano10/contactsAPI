const express = require("express");
const server = express();
const router = express.Router();
const fs = require("fs");

server.use(express.json({ extended: true }));

//Lê o arquivo JSON
const readFile = () => {
  const content = fs.readFileSync("./data/items.json", "utf-8");
  return JSON.parse(content);
};

//Grava no arquivo JSON
const writeFile = (content) => {
  const updateFile = JSON.stringify(content);
  fs.writeFileSync("./data/items.json", updateFile, "utf-8");
};


//Verifica se o serviço está funcionando
router.get("/statuscheck", (req, res) => {
  res.send("Ok");
});

//Retorna todos empregados
router.get("/", (req, res) => {
  const content = readFile();
  res.send(content);
});

//Busca um empregado específico
router.get("/:id", (req, res) => {
    const { id } = req.params;
  
    const currentContent = readFile();
    const selectedItem = currentContent.findIndex((item) => item.id === id);    
    const contact = { id: cId, name: cName, email: cEmail, phone: cPhone, photo:cPhoto } = currentContent[
        selectedItem
      ];
    res.send(contact);
  });

//Cria um contato
router.post("/", (req, res) => {
  const { name, email, phone, photo } = req.body;
  const currentContent = readFile();
  const id = generateUUID();
  currentContent.push({ id, name, email, phone, photo  });
  writeFile(currentContent);
  res.send({ id, name, email, phone, photo });
});

//Altera um contato
router.put("/:id", (req, res) => {
  const { id } = req.params;

  const { name, email, phone, photo } = req.body;

  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);

  const { id: cId, name: cName, email: cEmail, phone: cPhone, photo:cPhoto } = currentContent[
    selectedItem
  ];

  const contact = {
    id: cId,
    name: name ? name : cName,
    email: email ? email : cEmail,
    phone: phone ? phone : cPhone,
    photo: photo? photo: cPhoto
  };

  currentContent[selectedItem] = contact;
  writeFile(currentContent);

  res.send(contact);
});

//Exclui um contato
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const currentContent = readFile();
  const selectedItem = currentContent.findIndex((item) => item.id === id);
  currentContent.splice(selectedItem, 1);
  writeFile(currentContent);
  res.send(true);
});

server.use(router);

//Gera UUID para o ID do usuário
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
  }

server.listen(3333, '0.0.0.0', function() {
  console.log("servidor iniciado");
});
