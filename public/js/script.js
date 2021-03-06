class Modal {
    constructor() {
        const $this = this;
        this.screen_filter = document.getElementById('screen-filter');
        this.html_modal = document.getElementById('modal');
        this.btn_close = document.getElementById('modal__btn-close');
        this.btn_close.onclick = function () {
            $this.close();
        };
        this.screen_filter.onclick = this.btn_close.onclick;
    }
    open() {
        this.screen_filter.style.display = 'block';
        this.html_modal.style.display = 'block';
        this.screen_filter.style.opacity = 0;
        this.html_modal.style.opacity = 0;
        setTimeout(() => {
            this.screen_filter.style.opacity = 0.8;
            this.html_modal.style.opacity = 1;
        }, 200);
    }
    close() {
        this.screen_filter.style.display = 'none';
        this.html_modal.style.display = 'none';
    }
}

(function run() {
    const modal = new Modal();
    const scrollAmount = 262;

    let elt = document.getElementById('IMDB-best');
    callApiCategories(elt, 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score', init = true);

    elt = document.getElementById('Action');
    callApiCategories(elt, 'http://localhost:8000/api/v1/titles/?genre=Action&sort_by=-imdb_score');

    elt = document.getElementById('Comedy');
    callApiCategories(elt, 'http://localhost:8000/api/v1/titles/?genre=Comedy&sort_by=-imdb_score');

    elt = document.getElementById('Sci-Fi');
    callApiCategories(elt, 'http://localhost:8000/api/v1/titles/?genre=Sci-Fi&sort_by=-imdb_score');


    arrows_left = document.getElementsByClassName('arrow-left');
    for (const al of arrows_left) {
        al.addEventListener('click', contentScrollLeft);
    }

    arrows_right = document.getElementsByClassName('arrow-right');
    for (const ar of arrows_right) {
        ar.addEventListener('click', contentScrollRight);
    }

    function contentScrollLeft(e) {
        movies_container = e.srcElement.nextElementSibling;
        scroll(movies_container, -scrollAmount);
    }

    function contentScrollRight(e) {
        movies_container = e.srcElement.previousElementSibling;
        scroll(movies_container, scrollAmount);
    }

    function scroll(element, amount) {
        scrollBefore = element.scrollLeft
        element.scroll({ top: 0, left: element.scrollLeft + amount, behavior: 'smooth' });
        scrollAfter = 0;
        setTimeout(function () {
            scrollAfter = element.scrollLeft;
            if ((scrollAfter - scrollBefore) == 0) {
                element.scrollLeft = 0;
                if (amount > 0) {
                    if (element.dataset.next != 'null')
                        callApiCategories(element, element.dataset.next);
                } else {
                    if (element.dataset.prev != 'null')
                        callApiCategories(element, element.dataset.prev);
                }
            }
        }, 400);
    }

    function fill_modal(id) {
        fetch('http://localhost:8000/api/v1/titles/' + id)
            .then(function (res) {
                if (res.ok)
                    return res.json();
            })
            .then(function (value) {
                // console.log(value);
                movie_img = document.createElement('img');
                movie_img.setAttribute('src', value.image_url);
                document.getElementById('img').innerHTML = "";
                document.getElementById('img').appendChild(movie_img);

                elements = document.querySelectorAll('#modal td.info-data');
                for (const elt of elements) {
                    if (elt.id == 'img')
                        continue;
                    if (elt.id == 'title') {
                        document.getElementById(elt.id).innerText = value[elt.id].toUpperCase();
                        continue;
                    }
                    if (elt.id == 'actors') {
                        document.getElementById(elt.id).innerText = value[elt.id];
                        document.getElementById(elt.id).innerText = document.getElementById(elt.id).innerText.replaceAll(',', ', ');
                        continue;
                    }
                    document.getElementById(elt.id).innerText = value[elt.id];
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    function callApiCategories(elt, url, init = false) {
        elt.innerHTML = "";
        const img_loading = document.createElement('img');
        img_loading.setAttribute('src', 'public/img/loading.gif');
        img_loading.style.height = '100px';
        img_loading.style.marginTop = '100px';
        elt.appendChild(img_loading);
        fetch(url)
            .then(function (res) {
                if (res.ok) {
                    return res.json();
                }
            })
            .then(function (value) {
                elt.innerHTML = "";
                for (const item of value.results) {
                    let figure = document.createElement('figure');
                    figure.className = 'movie';
                    figure.dataset.id = item.id;
                    figure.dataset.title = item.title;
                    figure.onclick = function () {
                        fill_modal(item.id);
                        modal.open();
                    };
                    const figcaption = document.createElement('figcaption');
                    figcaption.innerText = item.title;
                    const img = document.createElement('img');
                    img.setAttribute('src', item.image_url);
                    figure.appendChild(img);
                    figure.appendChild(figcaption);
                    elt.appendChild(figure);
                }
                elt.dataset.prev = value.previous;
                elt.dataset.next = value.next;
                if (init) {
                    first_movie = elt.querySelector('figure');
                    best_title = document.getElementsByClassName('category__best__title')[0];
                    best_title.innerText = first_movie.dataset.title;
                    first_movie_img = first_movie.querySelector('img');
                    best_img = document.getElementsByClassName('category__best__img')[0];
                    best_img.style.backgroundImage = 'url("' + first_movie_img.getAttribute('src') + '")';
                    best_img.onclick = function () {
                        fill_modal(first_movie.dataset.id);
                        modal.open();
                    };
                    best_title.onclick = best_img.onclick;
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    };
})();


