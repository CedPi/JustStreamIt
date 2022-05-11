const movies = document.getElementsByClassName('movie');

for (const movie of movies) {
    movie.onclick = function () {
        openModal();
    };
}

document.getElementById("modal__btn-close").onclick = () => closeModal();

function openModal() {
    document.getElementById('screen-filter').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('screen-filter').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
}

// FAIRE UNE CLASSE POUR LA MODALE ^^^^^^



arrows_left = document.getElementsByClassName('arrow-left');
for (const al of arrows_left) {
    al.addEventListener('click', scrollLeft);
}

arrows_right = document.getElementsByClassName('arrow-right');
for (const ar of arrows_right) {
    ar.addEventListener('click', scrollRight);
}

function scrollLeft(e) {
    movies_container = e.srcElement.nextElementSibling;
    // child = movies_container.children[0];
    // console.log(child.style)
    // scrollingAmout = child.style.width + child.style.marginLeft;
    movies_container.scroll({ top: 0, left: movies_container.scrollLeft - 330, behavior: 'smooth' });
}

function scrollRight(e) {
    movies_container = e.srcElement.previousElementSibling;
    movies_container.scroll({ top: 0, left: movies_container.scrollLeft + 330, behavior: 'smooth' });
}