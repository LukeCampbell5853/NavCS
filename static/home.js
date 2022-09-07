let index = 0;

function nextSlide() {
  let slides = document.getElementsByClassName("slideBox");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  slides[index].style.display = "block";
  index++;
  if(index>=slides.length){
    index = 0
  }
}

nextSlide();
setInterval(nextSlide,2000);
