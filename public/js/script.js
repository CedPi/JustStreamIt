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
    const movies = document.getElementsByClassName('movie');
    for (const movie of movies) {
        movie.onclick = function () {
            modal.open();
        };
    }

    const scrollAmount = 262;

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
        // console.log(scrollBefore);
        element.scroll({ top: 0, left: element.scrollLeft + amount, behavior: 'smooth' });
        scrollAfter = 0;
        setTimeout(function () {
            scrollAfter = element.scrollLeft;
            // console.log(scrollAfter);
            // console.log(scrollAfter - scrollBefore);
            if ((scrollAfter - scrollBefore) == 0) {
                if (amount > 0)
                    console.log("CALL API NEXT !!");
                else
                    console.log("CALL API PREV !!");
            }
        }, 400);
    }

    function callApiNext(category, direction) {     // direction = 'previous' | 'next'

    }
})();


