let list = document.querySelector('.slider .list');
let teampicture = document.querySelectorAll('.slider .list .teampicture');
let dots =document.querySelectorAll('.slider .dots li');
let prev = document.getElementById('prev');
let next = document.getElementById('next');

let active = 3;
let lengthItems = teampicture.length - 1;
reloadSlider();
next.onclick = function(){
    if(active + 1 > lengthItems){
        active = 0;
    }else{
        active = active + 1; 
    }
    reloadSlider();
}

prev.onclick = function(){
    if(active - 1 > lengthItems){
        active = lengthItems;
    }else{
        active = active - 1; 
    }
    reloadSlider();
}
function reloadSlider(){
    let checkLeft = teampicture[active].offsetLeft;
    list.style.left = -checkLeft + 'px';       

    let  lastActiveDot = document.querySelector('.slider .dots li.active');
    lastActiveDot.classList.remove('active');
    dots[active].classList.add('active');
}



