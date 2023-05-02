/* FETCHING IMAGES FROM GITHUB REPO */

async function fetchImageURLs() {
  const folderPath = "images/images-grid";
  const repoName = "ModernPeople-website";
  const userName = "vanguard-mp";

  try {
    const response = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${folderPath}`);

    if (!response.ok) {
      throw new Error(`Error fetching image URLs: ${response.statusText}`);
    }

    const data = await response.json();
    const imageURLs = data.map((file) => file.download_url);
    return imageURLs;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

async function fetchSlideshowImageURLs() {
  const folderPath = "images/images-slideshow";
  const repoName = "ModernPeople-website";
  const userName = "vanguard-mp";

  try {
    const response = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${folderPath}`);

    if (!response.ok) {
      throw new Error(`Error fetching image URLs: ${response.statusText}`);
    }

    const data = await response.json();
    const imageURLs = data.map((file) => file.download_url);
    return imageURLs;
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

/* Fetch with chunks */
async function fetchInChunks(startIndex, chunkSize, urls) {
  let imgObjs = [];
  for (let i = startIndex; i < startIndex + chunkSize; i++) {
    url = urls[i];
    let imgObj = await fetchImg(url);
    imgObjs.push(imgObj);
  }
  return imgObjs;
}
async function fetchImg(url) {
  // const image = await fetchBlob(url);
  const options = {
    method: "GET",
  };
  let response = await fetch(url, options);
  if (response.status === 200) {
    const imageBlob = await response.blob();
    return URL.createObjectURL(imageBlob);
  }
}

/* CREATING THE GRID AND SLIDESHOW */

function createSlideshow(images) {
  if (images.length === 0) {
    return [];
  }
  const imageBox = document.querySelector(".slide-show");
  let currentIndex = 0;

  function updateBackgroundImage() {
    const imageUrl = images[currentIndex];
    imageBox.style.backgroundImage = `url(${imageUrl})`;
    currentIndex = (currentIndex + 1) % images.length;
  }

  updateBackgroundImage();
  setInterval(updateBackgroundImage, 3000); // Change image every 3 seconds
  return images;
}

function createGridItem(imageURL) {
  const gridItem = document.createElement("div");
  gridItem.className = "grid-item";
  const image = new Image();
  image.src = imageURL;
  image.onload = () => {
    gridItem.style.backgroundImage = `url(${imageURL})`;
    gridItem.style.backgroundSize = "cover";
    const aspectRatio = image.width / image.height;
    gridItem.style.height = `${gridItem.offsetWidth / aspectRatio}px`;
    gridItem.classList.add("loaded");
  };
  return gridItem;
}

/* HELPER FUNCTIONS */
function randomizeArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function toggleImageBox() {
  var x = document.getElementById("helloBox");
  var y = document.getElementById("slideShow");
  x.classList.toggle("show"); /* Toggle the .show class on and off */
  if (y.style.display === "none") {
    y.style.display = "block";
  } else {
    y.style.display = "none";
  }
  document.querySelector(".hello-box").scrollIntoView();
}


function toggleContact() {
  let helloText, contactForm;
  helloText = document.querySelector(".hello-text");
  contactForm = document.querySelector(".contact-form");
  helloText.classList.add("move-up");
  let helloform = document.querySelector(".hello-form");
  helloform.style.display = "block";
}
function moveParts() {
  document.querySelector(".video-image-box").scrollIntoView();
}

/* NAVBAR FUNCTIONS */

function adjustNavBarOnScroll() {
  var navBar = document.querySelector(".nav-bar");
  var videoHeight = document.querySelector(".slide-show").offsetHeight;
  var helloHeight = document.querySelector(".hello-box").offsetHeight;
  let _maxHeight = videoHeight || helloHeight;
  var scrollTop = window.scrollY;
  if (scrollTop <= _maxHeight - navBar.offsetHeight + 90) {
    navBar.style.top = `${_maxHeight - scrollTop - navBar.offsetHeight}px`;
  } else {
    navBar.style.position = "fixed";
    navBar.style.top = "0";
    navBar.style.bottom = "";
  }
}

function adjustNavBarOnResize() {
  var navBar = document.querySelector(".nav-bar");
  var videoHeight = document.querySelector(".slide-show").offsetHeight;
  if (window.scrollY <= videoHeight - navBar.offsetHeight) {
    navBar.style.bottom = `30px`;
  }
}

/* SCROLLING FUNCTIONS */

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/* INITIALIZATION */
const chunkSize = 10;

async function init() {
  try {
    const [imageURLs, slideshowImageURLs] = await Promise.all([fetchImageURLs(), fetchSlideshowImageURLs()]);

    const grid = document.getElementById("grid");
    const randomizedURLs = randomizeArray(imageURLs);

    let chunkSize = 5;
    let fetchCount = Math.ceil(randomizedURLs.length / chunkSize);
    for (let i = 0; i < fetchCount; i++) {
      let newImgObjs = await fetchInChunks(i * chunkSize, chunkSize, randomizedURLs);
      newImgObjs.forEach((imageURL) => {
        const gridItem = createGridItem(imageURL);
        grid.appendChild(gridItem);
      });
    }

    createSlideshow(slideshowImageURLs);
  } catch (error) {
    console.error("Error:", error);
  }
}

init();

/* EVENT LISTENERS */

const movingParts = document.querySelector(".parts-btn");
const infoBtn = document.querySelector(".info-btn");

infoBtn.addEventListener("click", toggleContact);
movingParts.addEventListener("click", moveParts);

window.addEventListener("scroll", adjustNavBarOnScroll);
window.addEventListener("resize", adjustNavBarOnResize);
