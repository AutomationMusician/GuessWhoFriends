const express = require('express');
const fs = require('fs');
const datastore = require('nedb');

const games = new datastore('data/games.db');
games.loadDatabase();

const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('listening on port ' + PORT));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded( { extended: true } ));

app.get('/generateByList', async (request, response) => {
  const friends_list = request.query.friends_list;
  console.log("Friends list: "+ friends_list);
  const friends = genereteFriendsSubset(friends_list);

  if (!fs.existsSync("data/subsets/")) {
    fs.mkdirSync("data/subsets/");
  }

  games.insert( { friends_list: friends_list }, (err, data) => {
    if (err) throw err;
    const id = data._id;
    fs.writeFile('data/subsets/' + id + '.json', JSON.stringify(friends), (err) => {
      if (err) throw err;
      console.log('File is created successfully.');
    });
    response.redirect('/game.html?p=1&id=' + id);
  });
});

app.get('/generateById', async (request, response) => {
  const id = request.query.id;
  const player = request.query.p;
  games.findOne({ "_id": id }, (err, data) => {
    const friends_list = data.friends_list;
    const friends = genereteFriendsSubset(friends_list);
    fs.writeFile('data/subsets/' + id + '.json', JSON.stringify(friends), (err) => {
      if (err) throw err;
      console.log('File is created successfully.');
      response.redirect('/game.html?p=' + player + '&id=' + id);
    });
  });
});

app.get('/players', async (request, response) => {
  const id = request.query.id;
  const rawdata = fs.readFileSync('data/subsets/' + id + '.json');
  const subset = JSON.parse(rawdata);
  response.json(subset);
});

app.get('/friends-lists', async (request, response) => {
  fs.readdir('data/friends-lists', function (err, files) {
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 
    const friends_lists = [];
    files.forEach(function (file) {
      // add fireds-lists to matchups without the '.json'
      friends_lists.push(file.substring(0, file.length-5));
    });
    response.json(friends_lists);
  });
});

function genereteFriendsSubset(friends_list) {
  const rawdata = fs.readFileSync('data/friends-lists/' + friends_list + '.json');
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
    while (friends.length < numFriends) {
      friends.push({
        "name": "",
        "imgUrl": "#"
      });
    }
  }
  return friends;
}
