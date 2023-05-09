/* FETCHING IMAGES FROM GITHUB REPO */
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
  const slideShow = document.getElementById("slideShow");

  images.forEach((imageUrl, index) => {
    const slide = document.createElement("div");
    slide.classList.add("slide");
    slide.style.backgroundImage = `url(${imageUrl})`;

    // Create the overlay elements
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const overlayLine = document.createElement("div");
    overlayLine.classList.add("overlay-line");

    const overlayText = document.createElement("div");
    overlayText.classList.add("overlay-text");
    overlayText.innerHTML = `Project #${index + 1} <span>&#9654;</span> Capability #${index + 1}`; // Replace with the desired content

    // Append the overlay elements to the slide
    overlay.appendChild(overlayLine);
    overlay.appendChild(overlayText);
    slide.appendChild(overlay);

    slide.style.opacity = index === 0 ? 1 : 0; // Show the first slide
    slideShow.appendChild(slide);
    const slides = document.querySelectorAll(".slide");

for (let i = 0; i < slides.length; i++) {
  slides[i].addEventListener("mouseenter", function () {
    const overlay = slides[i].querySelector(".overlay");
    overlay.classList.add("visible-overlay");
    
  });

  slides[i].addEventListener("mouseleave", function () {
    const overlay = slides[i].querySelector(".overlay");
    overlay.classList.remove("visible-overlay");
    
  });
}
    
   
  });

  let currentIndex = 0;

  function updateBackgroundImage() {
    const previousIndex = (currentIndex - 1 + images.length) % images.length;
    slideShow.children[currentIndex].style.opacity = 1;
    slideShow.children[previousIndex].style.opacity = 0;
    currentIndex = (currentIndex + 1) % images.length;
  }

  setInterval(updateBackgroundImage, 3000); // Change image every 3 seconds
  return images;
}



function createGridItem(imageURL) {
  const gridItem = document.createElement("div");
  gridItem.className = "grid-item";
  const image = new Image();
  image.src = imageURL;
  image.onload = () => {
    gridItem.appendChild(image);

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

// Function to reshuffle the grid
function reshuffleGrid() {
  // Call the randomizeArray function to shuffle the grid items
  const gridItems = document.querySelectorAll('.grid-item');
  const randomizedItems = randomizeArray(Array.from(gridItems));
  
  // Remove existing grid items
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  
  // Append the shuffled grid items back to the grid
  randomizedItems.forEach((item) => {
    grid.appendChild(item);
  });
}

function toggleAbout() {
  const aboutBtn = document.querySelector('.about-btn');
  const motionBtn = document.querySelector('.motion-btn');
  const contactBtn = document.querySelector('.contact-btn');
  
  const aboutSection = document.getElementById('aboutSection');
  const contactSection = document.getElementById('contactSection');
  const slideShow = document.getElementById('slideShow');

  if (aboutSection.classList.contains('hidden')) {
    aboutSection.classList.remove('hidden');
    contactSection.classList.add('hidden');
    slideShow.classList.add('hidden');
    activateButton(aboutBtn);
    deactivateButtons([motionBtn, contactBtn]);
  } else {
    aboutSection.classList.add('hidden');
    slideShow.classList.remove('hidden');
    deactivateButtons([aboutBtn, motionBtn, contactBtn]);
  }
  scrollToTop();
  updateTopBoxHeight();
}

function toggleContact() {
  const aboutBtn = document.querySelector('.about-btn');
  const motionBtn = document.querySelector('.motion-btn');
  const contactBtn = document.querySelector('.contact-btn');
  
  const aboutSection = document.getElementById('aboutSection');
  const contactSection = document.getElementById('contactSection');
  const slideShow = document.getElementById('slideShow');

  if (contactSection.classList.contains('hidden')) {
    contactSection.classList.remove('hidden');
    aboutSection.classList.add('hidden');
    slideShow.classList.add('hidden');
    activateButton(contactBtn);
    deactivateButtons([aboutBtn, motionBtn]);
  } else {
    contactSection.classList.add('hidden');
    slideShow.classList.remove('hidden');
    deactivateButtons([aboutBtn, motionBtn, contactBtn]);
  }
  scrollToTop();
  updateTopBoxHeight();
}


function activateButton(button) {
  button.style.fontWeight = 'bold';
}

function deactivateButtons(buttons) {
  buttons.forEach((button) => {
    button.style.fontWeight = 'normal';
  });
}


function motionScroll() {
  const aboutBtn = document.querySelector('.about-btn');
  const motionBtn = document.querySelector('.motion-btn');
  const contactBtn = document.querySelector('.contact-btn');
  var navBar = document.querySelector(".nav-bar");
  
  contactSection.classList.add('hidden');
  aboutSection.classList.add('hidden');
  slideShow.classList.remove('hidden');
  activateButton(motionBtn);
  deactivateButtons([aboutBtn, contactBtn]);
  if(navBar.offsetTop === 0){
    scrollToTop();
    deactivateButtons([aboutBtn, motionBtn, contactBtn]);
  } else {
    document.querySelector(".video-image-box").scrollIntoView();
  }
}

/* NAVBAR FUNCTIONS */

function adjustNavBarOnScroll() {
  var navBar = document.querySelector(".nav-bar");
  var videoHeight = document.querySelector(".slide-show").offsetHeight;
  var topHeight = document.querySelector(".top-box").offsetHeight;
  //console.log('videoHeight:', videoHeight);
  //console.log('helloHeight:', helloHeight);
  let _maxHeight = videoHeight || topHeight;
  //console.log('_maxHeight:', _maxHeight);
  var scrollTop = window.scrollY;
  if (scrollTop <= _maxHeight - navBar.offsetHeight/2) {
    navBar.style.top = `${_maxHeight - scrollTop + navBar.offsetHeight/2}px`;
  } else {
    navBar.style.position = "fixed";
    navBar.style.top = "0";
    navBar.style.bottom = "";
  }
  const orangeTab = document.querySelector('.orange-tab');
  const horizontalTab = document.querySelector('.horizontal-tab');
  const scrollBottom = window.scrollY + window.innerHeight;

  if (scrollBottom >= document.body.scrollHeight) {
    orangeTab.style.opacity = '0';
    horizontalTab.style.opacity = '1';
  } else {
    orangeTab.style.opacity = '1';
    horizontalTab.style.opacity = '0';
  }
}

function adjustNavBarOnResize() {
  var navBar = document.querySelector(".nav-bar");
  var videoHeight = document.querySelector(".slide-show").offsetHeight;
  if (window.scrollY <= videoHeight - navBar.offsetHeight) {
    navBar.style.bottom = `30px`;
  }
  console.log('Window width:', window.innerWidth);
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
window.addEventListener('resize', updateTopBoxHeight);

function updateTopBoxHeight() {
  const windowHeight = window.innerHeight;
  const topBox = document.getElementById('topBox');
  topBox.style.height = (windowHeight - 120) + 'px';
}

/* SKULL AND LOGOTYPE FUNCTIONS */

// Add event listener to the logo element
document.getElementById('logo').addEventListener('click', skullFunc);



// Function to scroll to the top
function skullFunc(){
  const aboutBtn = document.querySelector('.about-btn');
  const motionBtn = document.querySelector('.motion-btn');
  const contactBtn = document.querySelector('.contact-btn');

  const aboutSection = document.getElementById('aboutSection');
  const contactSection = document.getElementById('contactSection');
  const slideShow = document.getElementById('slideShow');

  deactivateButtons([aboutBtn, motionBtn, contactBtn]);
  scrollToTop();
  slideShow.classList.remove('hidden');
  aboutSection.classList.add('hidden');
  contactSection.classList.add('hidden');


}
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
    
  });
 

}
//const skull = document.getElementById('skull');
const logo = document.getElementById('logo');

// Store the original image source URLs
//const skullSrc = skull.src;
const logoSrc = logo.src;

// Define the paths to the orange versions of the images
//const orangeSkullSrc = 'images/MP-Skull-orange.png'; // Replace with the path to the orange skull image
const orangeLogoSrc = 'images/MP-Logotype-Orange.png'; // Replace with the path to the orange logo image

// Swap the image source on hover



logo.addEventListener('mouseover', function() {
  //skull.src = orangeSkullSrc;
  logo.src = orangeLogoSrc;
});

logo.addEventListener('mouseout', function() {
  //skull.src = skullSrc;
  logo.src = logoSrc;
});



/* INITIALIZATION */
const chunkSize = 10;

async function init() {
  try {
    const [imageURLs, slideshowImageURLs] = await Promise.all([fetchImageURLs(), fetchSlideshowImageURLs()]);
    createSlideshow(slideshowImageURLs);
    const grid = document.getElementById("grid");
    const randomizedURLs = randomizeArray(imageURLs);

    let chunkSize = 5;
    let fetchCount = Math.ceil(randomizedURLs.length / chunkSize);
    for (let i = 0; i < fetchCount; i++) {
      console.log(`Fetching chunk ${i + 1} of ${fetchCount}`); // Add this line
      let newImgObjs = await fetchInChunks(i * chunkSize, chunkSize, randomizedURLs);
      console.log(`Fetched ${newImgObjs.length} images in chunk ${i + 1}`); // Add this line
      newImgObjs.forEach((imageURL) => {
        const gridItem = createGridItem(imageURL);
        grid.appendChild(gridItem);
      });
    }
    const msnry = new Masonry("#grid", {
      itemSelector: ".grid-item",
      gutter: 0, // Set the gutter width you desire
      percentPosition: true, // Use percentage-based widths
    });
    
    
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  init();
});


/* EVENT LISTENERS */

document.querySelector('.motion-btn').addEventListener('click', motionScroll);
document.querySelector('.contact-btn').addEventListener('click', toggleContact);

window.addEventListener("scroll", adjustNavBarOnScroll);
window.addEventListener("resize", adjustNavBarOnResize);

document.addEventListener('DOMContentLoaded', () => {
  updateTopBoxHeight();
  window.addEventListener('resize', updateTopBoxHeight);
});

document.querySelector('.about-btn').addEventListener('click', toggleAbout);
document.querySelector('.motion-btn').addEventListener('click', motionScroll);
document.querySelector('.contact-btn').addEventListener('click', toggleContact);

