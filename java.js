document.addEventListener('DOMContentLoaded', () => {
  // Toggle the menu icon and navbar on click
  let menuIcon = document.querySelector('#menu-icon');
  let navbar = document.querySelector('.navbar');

  menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
  };

  // Handle the Read More button functionality
  const readMoreBtn = document.getElementById('read-more-btn');
  const moreDetails = document.getElementById('more-details');

  readMoreBtn.addEventListener('click', () => {
    if (moreDetails.style.display === 'none' || moreDetails.style.display === '') {
      moreDetails.style.display = 'block';
      readMoreBtn.textContent = 'Read Less';
    } else {
      moreDetails.style.display = 'none';
      readMoreBtn.textContent = 'Read More';
    }
  });

  // Handle zoom effect on service boxes
  let serviceBoxes = document.querySelectorAll('.service-box');
  let lastClickedBox = null;

  serviceBoxes.forEach(box => {
    box.addEventListener('click', function() {
      if (lastClickedBox && lastClickedBox !== this) {
        lastClickedBox.classList.remove('zoomed');
      }
      this.classList.toggle('zoomed');
      lastClickedBox = this;
    });
  });

  // Use Intersection Observer to remove zoom effect when out of view
  const observerOptions = {
    root: null,
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        entry.target.classList.remove('zoomed');
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  serviceBoxes.forEach(box => {
    observer.observe(box);
  });

  // Handle the Hire Me modal functionality
  const hireBtn = document.getElementById('hire-btn');
  const hireModal = document.getElementById('hire-modal');
  const closeModal = document.querySelector('.modal .close');

  hireBtn.addEventListener('click', () => {
    hireModal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling when the modal is open
  });

  closeModal.addEventListener('click', () => {
    hireModal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling when the modal is closed
  });

  window.addEventListener('click', (event) => {
    if (event.target === hireModal) {
      hireModal.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling when the modal is closed
    }
  });

  // Handle form submission
  document.getElementById('hire-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      service: formData.get('service'),
      date: formData.get('appointment-date'),
      time: formData.get('appointment-time')
    };

    fetch(this.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        alert('Your request has been sent!');
        document.getElementById('hire-form').reset();
        hireModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling when the modal is closed
      } else {
        throw new Error('Network response was not ok.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was a problem with your request.');
    });
  });

  // Prevent default dragging behavior for images
  const track = document.getElementById("image-track");
  const images = track.getElementsByClassName("image");
  for (let img of images) {
    img.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // Prevent text selection during dragging
  window.onmousedown = e => {
    if (e.target.matches('input, textarea, select')) return; // Allow interaction with input fields
    e.preventDefault();
    track.dataset.mouseDownAt = e.clientX;
  };

  window.onmouseup = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage || "0";
  };

  window.onmousemove = e => {
    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX;
    const maxDelta = window.innerWidth / 2;

    let percentage = (mouseDelta / maxDelta) * -40;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    nextPercentage = Math.min(nextPercentage, 0);
    nextPercentage = Math.max(nextPercentage, -100);

    track.dataset.percentage = nextPercentage;

    track.animate({
      transform: `translate(${nextPercentage}%, -0%)`
    }, { duration: 1200, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 1200, fill: "forwards" });
    }
  };

  // Handle touch events for dragging
  function handleTouchMove(event) {
    event.preventDefault();

    const touch = event.touches[0];
    const touchX = touch.clientX;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - touchX;
    const maxDelta = window.innerWidth / 2;

    let percentage = (mouseDelta / maxDelta) * -20;
    let nextPercentage = parseFloat(track.dataset.prevPercentage) + percentage;

    nextPercentage = Math.min(nextPercentage, 0);
    nextPercentage = Math.max(nextPercentage, -100);

    track.dataset.percentage = nextPercentage;

    track.animate({
      transform: `translate(${nextPercentage}%, -0%)`
    }, { duration: 1200, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 1200, fill: "forwards" });
    }
  }

  function handleTouchStart(event) {
    const touch = event.touches[0];
    const touchX = touch.clientX;

    track.dataset.mouseDownAt = touchX;
  }

  function handleTouchEnd() {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage || "0";
  }

  track.addEventListener('touchstart', handleTouchStart);
  track.addEventListener('touchmove', handleTouchMove);
  track.addEventListener('touchend', handleTouchEnd);

  // Add Intersection Observer for animations
  const animationOptions = {
    root: null,
    threshold: 0.1
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const direction = entry.target.getAttribute('data-animation');
        entry.target.classList.add(`fade-in-${direction}`);
        animationObserver.unobserve(entry.target);
      }
    });
  }, animationOptions);

  const elementsToAnimate = document.querySelectorAll('[data-animation]');
  elementsToAnimate.forEach(element => {
    animationObserver.observe(element);
  });
});


//contact form
document.getElementById('contact-form').addEventListener('submit', function(event) {
  event.preventDefault(); 

  const formData = new FormData(this);

  fetch(this.action, {
    method: this.method,
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      this.reset();
      alert('Thank you for your message!');
    } else {
      alert('There was a problem with your submission. Please try again.');
    }
  }).catch(error => {
    console.error('Error:', error);
    alert('There was a problem with your submission. Please try again.');
  });
});
