async function fetchImageURLs() {
  const folderPath = 'images/images-grid';
  const repoName = 'ModernPeople-website';
  const userName = 'vanguard-mp';
  
  try {
    const response = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${folderPath}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching image URLs: ${response.statusText}`);
    }
  
    const data = await response.json();
    const imageURLs = data.map(file => file.download_url);
    return imageURLs;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

function adjustNavBarOnScroll() {
var navBar = document.querySelector('.nav-bar');
var videoHeight = document.querySelector('.image-box').offsetHeight;
var scrollTop = window.scrollY;

if (scrollTop <= videoHeight - navBar.offsetHeight) {
  navBar.style.top = `${videoHeight - scrollTop - navBar.offsetHeight}px`;
} else {
  navBar.style.top = '0';
}
}

function adjustNavBarOnResize() {
var navBar = document.querySelector('.nav-bar');
var videoHeight = document.querySelector('.image-box').offsetHeight;

if (window.scrollY <= videoHeight - navBar.offsetHeight) {
  navBar.style.top = `${videoHeight - window.scrollY - navBar.offsetHeight}px`;
}
}



function createGridItem(imageURL) {
  const gridItem = document.createElement('div');
  gridItem.className = 'grid-item';
  const image = new Image();
  image.src = imageURL;
  image.onload = () => {
    gridItem.style.backgroundImage = `url(${imageURL})`;
    gridItem.style.backgroundSize = 'cover';
    const aspectRatio = image.width / image.height;
    gridItem.style.height = `${gridItem.offsetWidth / aspectRatio}px`;
    gridItem.classList.add('loaded');
  };
  return gridItem;
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}



function randomizeArray(array) {
  return array.sort(() => Math.random() - 0.5);
}


function init() {
  fetchImageURLs().then(imageURLs => {
    const grid = document.getElementById('grid');
    const randomizedURLs = randomizeArray(imageURLs);
    randomizedURLs.forEach(imageURL => {
      const gridItem = createGridItem(imageURL);
      grid.appendChild(gridItem);
    });
  }).catch(error => {
    console.error('Error:', error);
  });
}

init();
window.addEventListener('scroll', adjustNavBarOnScroll);
window.addEventListener('resize', adjustNavBarOnResize);