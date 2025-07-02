'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials/modal variables (keeping for compatibility but now used for resume downloads)
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (modalContainer && overlay) {
    modalContainer.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// add click event to all modal items (if they exist)
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    const avatar = this.querySelector("[data-testimonials-avatar]");
    const title = this.querySelector("[data-testimonials-title]");
    const text = this.querySelector("[data-testimonials-text]");

    if (avatar && title && text && modalImg && modalTitle && modalText) {
      modalImg.src = avatar.src;
      modalImg.alt = avatar.alt;
      modalTitle.innerHTML = title.innerHTML;
      modalText.innerHTML = text.innerHTML;
      testimonialsModalFunc();
    }
  });
}

// add click event to modal close button (if it exists)
if (modalCloseBtn) {
  modalCloseBtn.addEventListener("click", testimonialsModalFunc);
}
if (overlay) {
  overlay.addEventListener("click", testimonialsModalFunc);
}

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) {
  select.addEventListener("click", function () { elementToggleFunc(this); });
}

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    if (select) {
      elementToggleFunc(select);
    }
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) {
      selectValue.innerText = this.innerText;
    }
    filterFunc(selectedValue);

    if (lastClickedBtn) {
      lastClickedBtn.classList.remove("active");
    }
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form && form.checkValidity()) {
      if (formBtn) {
        formBtn.removeAttribute("disabled");
      }
    } else {
      if (formBtn) {
        formBtn.setAttribute("disabled", "");
      }
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Updated navigation mapping for new structure
const navigationMapping = {
  'about': 'about',
  'skills': 'skills',  // Previously 'resume'
  'certifications': 'certifications',
  'projects': 'projects',
  'contact': 'contact'
};

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const targetPageName = this.innerHTML.toLowerCase();
    const actualPageName = navigationMapping[targetPageName] || targetPageName;
    
    for (let j = 0; j < pages.length; j++) {
      if (actualPageName === pages[j].dataset.page) {
        pages[j].classList.add("active");
      } else {
        pages[j].classList.remove("active");
      }
    }
    
    for (let k = 0; k < navigationLinks.length; k++) {
      if (navigationLinks[k] === this) {
        navigationLinks[k].classList.add("active");
      } else {
        navigationLinks[k].classList.remove("active");
      }
    }
    
    window.scrollTo(0, 0);
  });
}

// Resume download functionality
// replace with drive link to ease work
async function downloadResume(type) {
  try {
    const filename = type === 'ats' ? 'Biswaketan_Resume_ATS.pdf' : 'Biswaketan_Resume_Visual.pdf';
    const filepath = `/assets/resume/${filename}`;//replace with drive link
    
    // Check if file exists using fetch with HEAD request
    const response = await fetch(filepath, { method: 'HEAD' });
    
    if (response.ok) {
      // Create download link
      const link = document.createElement('a');
      link.href = filepath;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      showNotification(`Downloading ${type === 'ats' ? 'ATS-friendly' : 'visual'} resume...`, 'success');
    } else {
      // File doesn't exist, show error
      showNotification('Resume file not found. Please try again later.', 'error');
      console.warn(`Resume file not found: ${filepath}`);
    }
  } catch (error) {
    console.error('Download error:', error);
    showNotification('Error downloading resume. Please try again.', 'error');
  }
}

// Contact form functionality
function sendMessage() {
  const fullnameInput = document.querySelector('input[name="fullname"]');
  const emailInput = document.querySelector('input[name="email"]');
  const messageInput = document.querySelector('textarea[name="message"]');
  
  if (!fullnameInput || !emailInput || !messageInput) {
    showNotification('Form elements not found.', 'error');
    return;
  }

  const fullname = fullnameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (!fullname || !email || !message) {
    showNotification('Please fill in all fields.', 'error');
    return;
  }

  if (!isValidEmail(email)) {
    showNotification('Please enter a valid email address.', 'error');
    return;
  }

  // Create mailto link
  const subject = `Portfolio Contact from ${fullname}`;
  const body = `Name: ${fullname}\nEmail: ${email}\n\nMessage:\n${message}`;
  const mailtoLink = `mailto:opneonite@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  // Open email client
  window.location.href = mailtoLink;

  // Show success message
  showNotification('Message prepared! Your email client should open with the message ready to send.', 'success');
  
  // Clear form
  fullnameInput.value = '';
  emailInput.value = '';
  messageInput.value = '';
  
  // Disable button again
  if (formBtn) {
    formBtn.setAttribute("disabled", "");
  }
}

// Utility functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    notification.remove();
  });

  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    ${type === 'success' ? 'background: linear-gradient(135deg, #4CAF50, #45a049);' : 'background: linear-gradient(135deg, #f44336, #da190b);'}
  `;

  document.body.appendChild(notification);

  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Enhanced DOM ready functionality
document.addEventListener('DOMContentLoaded', function() {
  
  // Enhanced contact form functionality
  const contactForm = document.querySelector('[data-form]');
  if (contactForm) {
    // Remove any existing submit listeners and add new one
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      sendMessage();
    });
  }

  // Initialize skill bar animations
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    
    const skillObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetWidth = entry.target.style.width;
          entry.target.style.width = '0%';
          entry.target.style.transition = 'width 2s ease-in-out';
          
          setTimeout(() => {
            entry.target.style.width = targetWidth;
          }, 200);
        }
      });
    }, { 
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });
    
    skillBars.forEach(bar => {
      skillObserver.observe(bar);
    });
  }

  // Initialize smooth animations
  function initSmoothAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);
    
    // Elements to animate
    const elementsToAnimate = document.querySelectorAll(`
      .service-item, 
      .timeline-item, 
      .project-item, 
      .blog-post-item, 
      .resume-card,
      .cert-item
    `);
    
    elementsToAnimate.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  }

  // Initialize typing effect for name
  function initTypingEffect() {
    const nameElement = document.querySelector('.name');
    if (nameElement && nameElement.textContent.trim()) {
      const text = nameElement.textContent.trim();
      nameElement.textContent = '';
      nameElement.style.borderRight = '2px solid #ffb700';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          nameElement.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, 150);
        } else {
          // Remove cursor after typing is complete
          setTimeout(() => {
            nameElement.style.borderRight = 'none';
          }, 1000);
        }
      };
      
      setTimeout(typeWriter, 500);
    }
  }

  // Check for resume files on page load
  function checkResumeFiles() {
    const atsFile = './resume/Biswaketan_Resume_ATS.pdf';
    const visualFile = './resume/Biswaketan_Resume_Visual.pdf';
    
    // Check if files exist and update button states
    Promise.all([
      fetch(atsFile, { method: 'HEAD' }).then(r => r.ok).catch(() => false),
      fetch(visualFile, { method: 'HEAD' }).then(r => r.ok).catch(() => false)
    ]).then(([atsExists, visualExists]) => {
      const atsBtn = document.querySelector('button[onclick*="ats"]');
      const visualBtn = document.querySelector('button[onclick*="human"]');
      
      if (atsBtn && !atsExists) {
        atsBtn.style.opacity = '0.6';
        atsBtn.title = 'ATS resume file not found';
      }
      
      if (visualBtn && !visualExists) {
        visualBtn.style.opacity = '0.6';
        visualBtn.title = 'Visual resume file not found';
      }
      
      if (!atsExists && !visualExists) {
        console.warn('No resume files found in ./resume/ folder');
      }
    });
  }
  
  // Initialize all features
  initSkillBars();
  initSmoothAnimations();
  initTypingEffect();
  checkResumeFiles();
  
  // Add enhanced CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }

    .resume-download-btn {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .resume-download-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .resume-download-btn:active {
      transform: translateY(0);
    }

    .skill-progress-fill {
      transition: width 0.1s ease;
    }

    .timeline-item {
      transition: transform 0.3s ease;
    }

    .timeline-item:hover {
      transform: translateX(5px);
    }
  `;
  document.head.appendChild(style);
  
  console.log('Portfolio enhanced JavaScript loaded successfully!');
});

// Make functions globally available
window.downloadResume = downloadResume;
window.sendMessage = sendMessage;
