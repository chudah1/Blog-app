
var deletebtn = document.querySelector(".del");
var likebutton = document.querySelector(".fas")
var comment = document.querySelector(".del")

window.onload = () => {
  deletebtn.addEventListener("click", executedelete);
  likebutton.addEventListener("click", executelike)
  comment.addEventListener("click", deletecomment)
};


//
const executedelete = () => {
  let id = deletebtn.dataset.index;
  fetch(`/blogs/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => (window.location.href = data.redirect))
    .catch((err) => console.log(err));
};

const executelike=async ()=>{
  let id = likebutton.dataset.like
  let likecount = document.querySelector(`.likes-count-${id}`)
  let data = await fetch(`/blogs/like${id}`, {
    method:"POST"
  })
  let result =await data.json()
  if (result["liked"]==true){
    likebutton.classList.add("fas fa thumbs-up")
  }
  else likebutton.classList.add("far fa thumbs-up")
  likecount.innerHTML = result["likes"]
}

const deletecomment = async () => {
  let id = deletebtn.dataset.delcomment;
  const res = await fetch(`/blogs/deletecomment/${id}`, {
    method: "DELETE",
  })
  const data =  await res.json()
  window.location.href = data.redirect
};


