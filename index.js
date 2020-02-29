const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('listening on port ' + PORT));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

app.get('/generate', async (request, response) => {
  const rawdata = fs.readFileSync('friends.json');
  const all_friends = JSON.parse(rawdata);
  let friends;
  const numFriends = 24;
  if (all_friends.length > numFriends)
  {
    let used = [];
    for (let i=0; i<all_friends.length; i++)
      used[i] = false;

    friends = [];
    while (friends.length < numFriends)
    {
      const index = Math.floor(Math.random()*all_friends.length);
      if (!used[index]) {
        friends.push(all_friends[index]);
        used[index] = true;
      }
    }
  }
  else
  {
    friends = all_friends;
  }

  fs.writeFile('subset.json', JSON.stringify(friends), (err) => {
    if (err) throw err;
    console.log('File is created successfully.');
  }); 
});

app.get('/players', async (request, response) => {
  const rawdata = fs.readFileSync('subset.json');
  const subset = JSON.parse(rawdata);
  response.json(subset);
});
