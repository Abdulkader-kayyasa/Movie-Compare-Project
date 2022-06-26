const autoCompleteConfg = {
  renderOption(movie){
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})` ;
  },
  inputvalue(movie){
    return movie.Title;
  },
  async fetchData(searchTerm){
      const response = await axios.get('http://www.omdbapi.com/', {
        params: {
          apikey: 'd9835cc5',
          s: searchTerm
        }
      });
      if (response.data.Error) {
        return [];
      }
      return response.data.Search;
    }
};
creatAutoComplete({
  ...autoCompleteConfg ,
  root: document.querySelector('#right-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onSelectMovie(movie , document.querySelector('#right-summary') , 'right');
  }
});
creatAutoComplete({
  ...autoCompleteConfg ,
  root: document.querySelector('#left-autocomplete'),
  onOptionSelect(movie){
    document.querySelector('.tutorial').classList.add('is-hidden');
    onSelectMovie(movie, document.querySelector('#left-summary') , 'left');
  }
  });

let leftMovie ; 
let rightMovie;
const onSelectMovie = async (movie , summayElement ,side)=>{
  const response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i : movie.imdbID
    }
  });
  summayElement.innerHTML = movieTemplate(response.data);
  if(side === 'left'){
    leftMovie = response.data;
  }
  else{rightMovie = response.data;}

  if(leftMovie && rightMovie){
    runCompersion(); 
  }
  
};

const runCompersion =  ()=>{
  const leftSideStates= document.querySelectorAll('#left-summary .notification');
  const rightSideStates= document.querySelectorAll('#right-summary .notification');
  
  leftSideStates.forEach((leftStat,index) =>{
    const rightStat = rightSideStates[index];
    const leftSideValue = parseInt(leftStat.dataset.value);
    const rightSideValue = parseInt(rightStat.dataset.value);

    if(rightSideValue > leftSideValue){
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
    else{
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  })
}
const movieTemplate = movieDetials =>{
  const doller = parseInt(movieDetials.BoxOffice.replace(/\$/g,'').replace(/,/g , '')
  );
  const metascore = parseInt(movieDetials.Metascore);
  const imdbrating = parseFloat(movieDetials.imdbRating);
  const imdbvotes = parseInt(movieDetials.imdbVotes.replace(/,/g , ''));
  const award = movieDetials.Awards.split(' ').reduce((prev , word)=>{
    const value = parseInt(word);
    if(isNaN(value)){
      return prev ; 
    }
    else{
      return prev + value ; 
    }
  },0);
  console.log(award);
  return `
    <article class = "media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetials.Poster}">
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetials.Title}</h1>
          <h4>${movieDetials.Genre}</h4>
          <p>${movieDetials.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value="${doller}" class="notification is-primary">
      <p class="title">${movieDetials.BoxOffice}</p>
      <p class="subtitle">Box Office</p> 
    </article>

    <article data-value="${award}" class="notification is-primary">
      <p class="title">${movieDetials.Awards}</p>
      <p class="subtitle">Awards</p> 
    </article>
    
    <article data-value="${metascore}" class="notification is-primary">
      <p class="title">${movieDetials.Metascore}</p>
      <p class="subtitle">Metascore</p> 
    </article>
    
    <article data-value="${imdbrating}" class="notification is-primary">
      <p class="title">${movieDetials.imdbRating}</p>
      <p class="subtitle">imdb Rating</p> 
    </article>
    <article data-value="${imdbvotes}" class="notification is-primary">
      <p class="title">${movieDetials.imdbVotes}</p>
      <p class="subtitle">imdb Votes</p> 
    </article>
  `
};
