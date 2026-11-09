// Retourne la liste des utilisateurs
const getUsers = (req, res) => {
  const users = [
    {
      id: 1,
      name: "Alice",
    },
  ];

  res.status(200).json(users);
};

module.exports = {
  getUsers,
};
