const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3001;
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
      if (!used[index])
        friends.push(all_friends[index]);
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


/*
app.get('/questions', async (request, response) => {
  let rawdata = fileSystem.readFileSync('friends.json');
  let questions = JSON.parse(rawdata);
  response.json(questions);
});

const answers = new datastore('answers2020.db');
answers.loadDatabase();
app.post('/answers', (request, response) => {
  answers.insert(request.body);
  response.send("<script>window.location.replace(\"/scoreboard/?success\");</script>");
});

app.get('/answers', (request, response) => {
  answers.find({}, (err, data) => {
    if (err) {
      console.log(err);
      response.send("An error in querying the answer database has occurred");
    } else {
      response.json(data);
    }
  });
});

app.post('/answer', (request, response) => {
  const userID = request.body._id;
  answers.findOne({_id: userID}, (err, data) => {
    if (err) {
      console.log(err);
      response.send("An error in querying the answer database has occurred");
    } else {
      response.json(data);
    }
  });
});
*/
