var boxes = document.getElementsByClassName("_5qo4");

let people = [];

for (let i=0; i<boxes.length; i++)
{
  const box = boxes[i];
  let nameDiv = box.querySelector('.fsl');
  let name = nameDiv.children[0].textContent;
  let img = box.querySelector('._4ooo');
  let imgUrl = img.src;
  people.push({name, imgUrl});
}

console.log(JSON.stringify(people));
