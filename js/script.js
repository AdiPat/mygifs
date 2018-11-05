// KC1cJo3Uw8kk2GxYS1P9PJFsMIRrmfSK

class ImageObject {
    // TODO: Implement liked flag
    constructor(id, title, src, score, liked = false) {
        this.id = id; // TODO:
        this.title = parseTitle(title);
        this.score = Math.ceil(parseFloat(score));
        this.src = src;
        this.liked = liked;
    }
}
//
//https://api.datamuse.com/words?ml=batman&max=5

class RandomWordGenerator {
    constructor() {
        this.limit = 1000;
        this.numCalls = 0;
        this.words = [];
        this.theme = ['batman', 'surprise', 'fail', 'burn', 'cow', 'bored', 'fire', 'water', 'cool', 'bad'];
    }

    getRandomWords() {
        const word = this.theme[Math.floor(Math.random() * this.theme.length) + 1];

        axios.get(`https://api.datamuse.com/words?ml=${word}&max=${this.limit}`).then(res => {
            this.words = res.data;
            // console.log(res, this.words);
        });
    }

    randomWord() {
        return this.words[Math.floor(Math.random() * this.words.length) + 1];
    }
}

var state = {
    searchLimit: 12,
    searchResults: [],
    liked: [],
    randObj: new RandomWordGenerator()
};

let addLikedItem = (item) => {
    if (this.state.liked.indexOf(item) === -1) {
        item.liked = true;
        this.state.liked.push(item);
    } else
        console.log("Item exists.");

    // console.log(this.state.liked);
};

let removeLikedItem = (item) => {
    const index = this.state.liked.indexOf(item);
    if (index !== -1) {
        //console.log("Deleting: ", item.id);
        // unlike item
        this.state.searchResults.forEach((e, i, arr) => {
            if (e.id == item.id)
                e.liked = false;
        });
        // remove from likes
        this.state.liked.splice(index, index + 1);
    }
    //console.log(this.state.liked);
};

let findItemFromId = (id) => {
    return state.searchResults.find((e) => {
        if (e.id === id)
            return e;
    });
}

let parseTitle = (str) => {
    const stripIndex = str.length - 4;
    const newStr = str.substring(0, stripIndex);
    return newStr;
};

let copyToClipboard = (text) => {
    let txtArea = document.createElement('textarea');
    txtArea.value = text;
    //txtArea.style.visibility = 'hidden';
    document.body.appendChild(txtArea);
    txtArea.select();
    document.execCommand('Copy');
    txtArea.remove();
}

let getInput = () => {
    let elem = document.querySelector('.search-box--input');
    return elem.value;
};

let parseSearchQuery = (query) => {
    query = query.trim();
    const words = query.split(" ");
    let finalSearch = "";
    words.forEach((e, i, arr) => {
        finalSearch += e;
        if (i != arr.length - 1)
            finalSearch += "+";
    });
    return finalSearch;
}


let fetchSearchResults = async (searchText) => {
    const API_KEY = "KC1cJo3Uw8kk2GxYS1P9PJFsMIRrmfSK";
    const searchLimit = 12;
    // split array and 
    const parsedSearchText = parseSearchQuery(searchText);
    const queryURL = `http://api.giphy.com/v1/gifs/search?q=${parsedSearchText}&api_key=${API_KEY}&limit=${searchLimit}`;
    // console.log(queryURL);
    return await axios.get(queryURL);
}

let storeResults = (data) => {
    data.forEach(function (e) {
        const imgObj = new ImageObject(e.id, e.title, e.images.downsized.url, e._score);
        this.state.searchResults.push(imgObj);
    });
    //console.log(this.state);
}

let clearSearchResults = () => {
    document.querySelector('.results').innerHTML = "";
    this.state.searchResults.splice(0, this.state.searchLimit);
};

let renderResults = () => {
    //    const resPerLine = 3; // TODO: Flexible 
    //  let cur = 0;
    this.state.searchResults.forEach((e, i, arr) => {
        const markup = `<div class="results-list"></div>`;
        //        const cardMarkup = `<div class="results-box">
        //                                <div class="results__card" data-id="${e.id}">
        //                                    <h2 class="results__card-heading">${e.title}</h2>
        //                                    <span class="results__card-score">Score: ${e.score}</span>
        //                                    <img src="${e.src}" class="results__card-img"/>
        //                                    <div class="results__card-actions">
        //                                    <i class="icon ion-md-heart-empty icon-action"></i>
        //                                    <i class="icon ion-logo-facebook icon-action"></i>
        //                                    <i class="icon ion-md-download icon-action"></i>
        //                                    <i class="icon ion-md-clipboard icon-action"></i>
        //                                    </div>
        //                                </div>
        //                            </div>`;
        const cardMarkup = `<div class="results__card" data-id="${e.id}">
                                    <img src="${e.src}" class="results__card-img"/>
                                    <div class="results__card-actions">
                                    <i class="icon ion-md-heart-empty icon-action"></i>
                                    </div>
                                </div>
                            </div>`;
        //        if (cur === 0) {
        //            // render result-list
        //            document.querySelector('.results').insertAdjacentHTML('beforeend', markup);
        //        }
        let elem = document.querySelector('.results');
        //const target = elems[0];
        //console.log(target);
        elem.insertAdjacentHTML('beforeend', cardMarkup);
        //cur = (cur + 1) % (resPerLine);
    });
};

let getResultCard = (elem) => {
    while (elem && !elem.classList.contains('results__card')) {
        elem = elem.parentNode;
    }
    return elem;
};

let toggleHeart = (elem, type) => {
    if (type == 'empty') {
        elem.classList.toggle('ion-md-heart');
        elem.classList.toggle('ion-md-heart-empty');
    }
    if (type == 'fill') {
        elem.classList.toggle('ion-md-heart-empty');
        elem.classList.toggle('ion-md-heart');
    }
}



let setupEventListeners = () => {

    document.addEventListener('keydown', async (e) => {
        if (e.keyCode === 13) {
            // console.log("Clicked");
            const searchQuery = getInput();
            if (searchQuery) {
                clearSearchResults();
                // console.log(searchQuery);
                let res = await fetchSearchResults(searchQuery);
                // this.state.searchResults = res.data.data;
                storeResults(res.data.data);
                renderResults();
                document.querySelector('.search-box--input').value = "";
            } else {
                console.log("Enter some text!");
            }
        }
    });

    document.querySelector('#btn-submit').addEventListener('click', async () => {
        // console.log("Clicked");
        const searchQuery = getInput();
        if (searchQuery) {
            clearSearchResults();
            //   console.log(searchQuery);
            let res = await fetchSearchResults(searchQuery);
            // this.state.searchResults = res.data.data;
            storeResults(res.data.data);
            renderResults();
            // clear search box
            document.querySelector('.search-box--input').value = "";
        } else {
            console.log("Enter some text!");
        }
    });

    document.querySelector('#btn-random').addEventListener('click', async () => {
        // console.log("Random clicked");
        const searchQuery = this.state.randObj.randomWord().word;
        //    console.log(searchQuery);
        if (searchQuery) {
            clearSearchResults();
            // console.log(searchQuery);
            let res = await fetchSearchResults(searchQuery);
            // this.state.searchResults = res.data.data;
            storeResults(res.data.data);
            renderResults();
            // clear search box
            document.querySelector('.search-box--input').value = "";
        } else {
            console.log("Enter some text!");
        }
    });

    document.querySelector('.results').addEventListener('click', (event) => {
        let elem = event.target;
        if (elem.classList.contains('icon-action')) {
            if (elem.classList.contains('ion-md-heart-empty')) {
                // add to liked 
                // fetch id 
                let card = getResultCard(elem);
                const item = findItemFromId(card.dataset.id);
                if (item.liked)
                    toggleHeart(elem, 'fill'); // TOOD: like
            }
            if (elem.classList.contains('ion-md-heart')) {
                let card = getResultCard(elem);
                const item = findItemFromId(card.dataset.id);
                if (item.liked)
                    removeLikedItem(item);
                else
                    addLikedItem(item);
                //toggleHeart(elem, 'empty'); // TODO: unlike
            } else if (elem.classList.contains('ion-logo-facebook')) {
                console.log("fb");
            } else if (elem.classList.contains('ion-md-download')) {
                const card = getResultCard(elem);
                const elemImg = card.querySelector('.results__card-img');
                const url = elemImg.getAttribute('src');
                // console.log(url);
                window.open(url, '_blank');
            } else if (elem.classList.contains('ion-md-clipboard')) {
                const card = getResultCard(elem);
                const url = card.querySelector('.results__card-img').getAttribute('src');
                copyToClipboard(url);
                // TODO: Show toast message
            }
        }
    });

    document.querySelector('.results').addEventListener('mouseover', (event) => {
        let elem = event.target;
        if (elem.classList.contains('ion-md-heart-empty')) {
            toggleHeart(elem, 'fill');
        } else if (elem.classList.contains('ion-md-heart')) {
            const card = getResultCard(elem);
            const item = findItemFromId(card.dataset.id);
            if (item.liked)
                toggleHeart(elem, 'empty');
        }
    });

    document.querySelector('.results').addEventListener('mouseout', (event) => {
        let elem = event.target;

        if (elem.classList.contains('ion-md-heart')) {
            const card = getResultCard(elem);
            const item = findItemFromId(card.dataset.id);
            if (!item.liked)
                toggleHeart(elem, 'empty');
        }
        if (elem.classList.contains('ion-md-heart-empty')) {
            const card = getResultCard(elem);
            const item = findItemFromId(card.dataset.id);
            if (item.liked)
                toggleHeart(elem, 'fill');
        }
    });

    document.querySelector('.header__likes-box--link').addEventListener('click', (e) => {
        // display likes
        e.preventDefault();
    });

};

let init = async () => {
    clearSearchResults();
    this.state.randObj.getRandomWords();
    setupEventListeners();

    $('.results').BlocksIt({
        numOfCol: 4,
        offsetX: 10,
        offsetY: 10,
        blockElement: '.results__card'
    });
};

init();