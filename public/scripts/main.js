window.onload = () => {
  var deletebtn = document.querySelector(".del");
  deletebtn.addEventListener("click", executedelete);

};


//
const executedelete = () => {
  let id = deletebtn.dataset.index;
  fetch(`/blogs/posts/delete/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => (window.location.href = data.redirect))
    .catch((err) => console.log(err));
};


