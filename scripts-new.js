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
  var videoHeight = document.querySelector('video').offsetHeight;
  var scrollTop = window.scrollY;

  if (scrollTop <= videoHeight - navBar.offsetHeight) {
    navBar.style.top = `${videoHeight - scrollTop - navBar.offsetHeight}px`;
  } else {
    navBar.style.top = '0';
  }
}

function adjustNavBarOnResize() {
  var navBar = document.querySelector('.nav-bar');
  var videoHeight = document.querySelector('video').offsetHeight;

  if (window.scrollY <= videoHeight - navBar.offsetHeight) {
    navBar.style.top = `${videoHeight - window.scrollY - navBar.offsetHeight}px`;
  }
}

window.addEventListener('scroll', adjustNavBarOnScroll);
window.addEventListener('resize', adjustNavBarOnResize);

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

const videoPoster = document.querySelector('.video-poster');
const video = document.querySelector('video');
const posterLink = document.querySelector('.poster-link');

function adjustVideoPosterSize() {
  const videoHeight = video.offsetHeight;
  videoPoster.style.height = `${videoHeight}px`;
}

function adjustPosterLinkPosition() {
  const videoHeight = video.offsetHeight;
  const navBarHeight = document.querySelector('.nav-bar').offsetHeight;
  posterLink.style.top = `${videoHeight - navBarHeight - 80}px`;
}

window.addEventListener('resize', adjustVideoPosterSize);
window.addEventListener('resize', adjustPosterLinkPosition);
window.addEventListener('load', adjustVideoPosterSize);
window.addEventListener('load', adjustPosterLinkPosition);

adjustNavBarOnScroll();
adjustNavBarOnResize();

posterLink.addEventListener('click', (event) => {
  event.preventDefault();
  const videoSrc = '/images/video/Met-test.mp4';
  const videoPlayer = document.createElement('video');
  videoPlayer.src = videoSrc;
  videoPlayer.autoplay = true;
  videoPlayer.loop = true;
  videoPlayer.muted = true;
  videoPlayer.style.position = 'fixed';
  videoPlayer.style.top = '0';
  videoPlayer.style.left = '0';
  videoPlayer.style.minWidth = '100%';
  videoPlayer.style.minHeight = '100%';
  videoPlayer.style.zIndex = '-1';
  videoPlayer.addEventListener('loadedmetadata', () => {
    const videoAspectRatio = videoPlayer.videoWidth / videoPlayer.videoHeight;
    const windowAspectRatio = window.innerWidth / window.innerHeight;
    let scaleX = 1;
    let scaleY = 1;
    if (windowAspectRatio > videoAspectRatio) {
      scaleY = windowAspectRatio / videoAspectRatio;
    } else {
      scaleX = videoAspectRatio / windowAspectRatio;
    }
    videoPlayer.style.transform = `translate(-50%, -50%) scale(${scaleX}, ${scaleY})`;
  });
  document.body.appendChild(videoPlayer);
  document.body.style.overflow = 'hidden';
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.style.position = 'fixed';
  closeButton.style.top = '16px';
  closeButton.style.right = '16px';
  closeButton.style.zIndex = '9999';
  closeButton.addEventListener('click', () => {
    videoPlayer.pause();
    document.body.removeChild(videoPlayer);
    document.body.style.overflow = 'auto';
    document.body.removeChild(closeButton);
  });
  document.body.appendChild(closeButton);
});