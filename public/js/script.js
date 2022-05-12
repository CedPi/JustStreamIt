class Modal {
    constructor() {
        const $this = this;
        this.screen_filter = document.getElementById('screen-filter');
        this.html_modal = document.getElementById('modal');
        this.btn_close = document.getElementById("modal__btn-close");
        this.btn_close.onclick = function () {
            $this.close();
        };
        this.screen_filter.onclick = this.btn_close.onclick;
    }
    open() {
        this.screen_filter.style.display = 'block';
        this.html_modal.style.display = 'block';
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
    callApi(elt, 'http://localhost:8000/api/v1/titles/?imdb_score_min=9');

    elt = document.getElementById('Action');
    callApi(elt, 'http://localhost:8000/api/v1/titles/?genre=Action');

    elt = document.getElementById('Comedy');
    callApi(elt, 'http://localhost:8000/api/v1/titles/?genre=Comedy');

    elt = document.getElementById('Sci-Fi');
    callApi(elt, 'http://localhost:8000/api/v1/titles/?genre=Sci-Fi');


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
                        callApi(element, element.dataset.next);
                } else {
                    if (element.dataset.prev != 'null')
                        callApi(element, element.dataset.prev);
                }
            }
        }, 400);
    }

    function callApi(elt, url) {
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
                    figure.onclick = function () {
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
            })
            .catch(function (err) {
                console.log(err);
            });
    };
})();


