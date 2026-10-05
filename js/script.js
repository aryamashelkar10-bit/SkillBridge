/* ===================================================
   SkillBridge – Main JavaScript File
   Description: All interactive functionality for SkillBridge
   =================================================== */

/* ============================================================
   1. MOBILE NAVIGATION TOGGLE
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Select the hamburger button and nav-links menu
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      // Toggle open class on both toggle button and menu
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close menu when any nav link is clicked (for mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ============================================================
     2. FIND TEAMMATES PAGE – Search and Filter
     ============================================================ */
  const studentsGrid  = document.getElementById('studentsGrid');

  if (studentsGrid) {
    const searchInput  = document.getElementById('searchInput');
    const filterBranch = document.getElementById('filterBranch');
    const filterYear   = document.getElementById('filterYear');
    const filterSkill  = document.getElementById('filterSkill');

    // Get all student cards as an array
    const allCards = Array.from(studentsGrid.querySelectorAll('.student-card'));

    // Run filter whenever any input changes
    function filterStudents() {
      const searchVal = searchInput ? searchInput.value.toLowerCase() : '';
      const branchVal = filterBranch ? filterBranch.value.toLowerCase() : '';
      const yearVal   = filterYear  ? filterYear.value.toLowerCase()   : '';
      const skillVal  = filterSkill ? filterSkill.value.toLowerCase()  : '';

      let visibleCount = 0;

      allCards.forEach(function (card) {
        // Read data attributes from each card
        const name     = (card.dataset.name   || '').toLowerCase();
        const branch   = (card.dataset.branch || '').toLowerCase();
        const year     = (card.dataset.year   || '').toLowerCase();
        const skills   = (card.dataset.skills || '').toLowerCase();
        const interests= (card.dataset.interests || '').toLowerCase();

        // Check all conditions
        const matchesSearch = !searchVal ||
          name.includes(searchVal) ||
          skills.includes(searchVal) ||
          interests.includes(searchVal);

        const matchesBranch = !branchVal || branch.includes(branchVal);
        const matchesYear   = !yearVal   || year.includes(yearVal);
        const matchesSkill  = !skillVal  || skills.includes(skillVal);

        // Show or hide card
        if (matchesSearch && matchesBranch && matchesYear && matchesSkill) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show "no results" message if nothing matches
      const noResults = document.getElementById('noResults');
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    // Attach event listeners
    if (searchInput)  searchInput.addEventListener('input', filterStudents);
    if (filterBranch) filterBranch.addEventListener('change', filterStudents);
    if (filterYear)   filterYear.addEventListener('change', filterStudents);
    if (filterSkill)  filterSkill.addEventListener('change', filterStudents);
  }

  /* ============================================================
     3. PROJECTS PAGE – Category Filter
     ============================================================ */
  const projectsGrid = document.getElementById('projectsGrid');

  if (projectsGrid) {
    const filterCategory = document.getElementById('filterCategory');
    const filterProjSkill= document.getElementById('filterProjSkill');
    const searchProjects = document.getElementById('searchProjects');

    const allProjectCards = Array.from(projectsGrid.querySelectorAll('.project-card'));

    function filterProjects() {
      const catVal    = filterCategory  ? filterCategory.value.toLowerCase()  : '';
      const skillVal  = filterProjSkill ? filterProjSkill.value.toLowerCase() : '';
      const searchVal = searchProjects  ? searchProjects.value.toLowerCase()  : '';

      let visibleCount = 0;

      allProjectCards.forEach(function (card) {
        const category = (card.dataset.category || '').toLowerCase();
        const skills   = (card.dataset.skills   || '').toLowerCase();
        const title    = (card.dataset.title    || '').toLowerCase();

        const matchesCat    = !catVal   || category.includes(catVal);
        const matchesSkill  = !skillVal || skills.includes(skillVal);
        const matchesSearch = !searchVal|| title.includes(searchVal) || skills.includes(searchVal);

        if (matchesCat && matchesSkill && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const noResultsProj = document.getElementById('noResultsProj');
      if (noResultsProj) {
        noResultsProj.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    if (filterCategory)  filterCategory.addEventListener('change', filterProjects);
    if (filterProjSkill) filterProjSkill.addEventListener('change', filterProjects);
    if (searchProjects)  searchProjects.addEventListener('input', filterProjects);
  }

  /* ============================================================
     4. CONNECT BUTTON INTERACTION (Find Teammates Page)
     ============================================================ */
  // Using event delegation on document body for all Connect buttons
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-connect')) {
      const btn = e.target;

      if (btn.classList.contains('connected')) {
        // Already connected – do nothing or show a message
        return;
      }

      // Toggle to connected state
      btn.textContent = '✓ Connected';
      btn.classList.add('connected');
      btn.style.background = '#16a34a';
      btn.style.borderColor = '#16a34a';
      btn.style.color = '#fff';

      // Small feedback to user
      showToast('Connection request sent!');
    }
  });

  /* ============================================================
     5. JOIN PROJECT BUTTON INTERACTION (Projects Page)
     ============================================================ */
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-join')) {
      const btn = e.target;

      if (btn.classList.contains('joined')) return;

      btn.textContent = '✓ Joined';
      btn.classList.add('joined');
      btn.style.background = '#16a34a';
      btn.style.color = '#fff';

      showToast('You have joined the project!');
    }
  });

  /* ============================================================
     6. POST PROJECT FORM VALIDATION
     ============================================================ */
  const postProjectForm = document.getElementById('postProjectForm');

  if (postProjectForm) {
    postProjectForm.addEventListener('submit', function (e) {
      e.preventDefault(); // Prevent actual form submission

      let isValid = true;

      // Helper: validate a single field
      function validateField(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const error = document.getElementById(errorId);
        if (!field || !error) return;

        if (field.value.trim() === '' || (field.tagName === 'SELECT' && field.value === '')) {
          field.classList.add('invalid');
          error.textContent = message;
          error.classList.add('visible');
          isValid = false;
        } else {
          field.classList.remove('invalid');
          error.classList.remove('visible');
        }
      }

      validateField('projTitle',    'errTitle',    'Please enter a project title.');
      validateField('projDesc',     'errDesc',     'Please enter a project description.');
      validateField('projCategory', 'errCategory', 'Please select a category.');
      validateField('projSkills',   'errSkills',   'Please enter required skills.');
      validateField('projTeamSize', 'errTeamSize', 'Please enter the team size.');

      // Extra check: team size must be at least 1
      const teamSizeField = document.getElementById('projTeamSize');
      const teamSizeErr   = document.getElementById('errTeamSize');
      if (teamSizeField && teamSizeErr && teamSizeField.value.trim() !== '' && parseInt(teamSizeField.value, 10) < 1) {
        teamSizeField.classList.add('invalid');
        teamSizeErr.textContent = 'Team size must be at least 1.';
        teamSizeErr.classList.add('visible');
        isValid = false;
      }

      if (isValid) {
        showToast('Project posted successfully! 🎉');
        postProjectForm.reset();
      }
    });

    // Remove invalid state on input/change (change needed for <select> elements)
    postProjectForm.querySelectorAll('input, textarea, select').forEach(function (el) {
      var evtType = el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evtType, function () {
        el.classList.remove('invalid');
        const errEl = document.getElementById('err' + el.dataset.err);
        if (errEl) errEl.classList.remove('visible');
      });
    });
  }

  /* ============================================================
     7. LOGIN FORM VALIDATION
     ============================================================ */
  const loginForm = document.getElementById('loginForm');

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const email    = document.getElementById('loginEmail');
      const password = document.getElementById('loginPassword');
      const emailErr = document.getElementById('loginEmailErr');
      const passErr  = document.getElementById('loginPassErr');
      let isValid    = true;

      // Validate email
      if (!email.value.trim() || !email.value.includes('@')) {
        email.classList.add('invalid');
        emailErr.textContent = 'Enter a valid college email address.';
        emailErr.classList.add('visible');
        isValid = false;
      } else {
        email.classList.remove('invalid');
        emailErr.classList.remove('visible');
      }

      // Validate password
      if (password.value.trim().length < 6) {
        password.classList.add('invalid');
        passErr.textContent = 'Password must be at least 6 characters.';
        passErr.classList.add('visible');
        isValid = false;
      } else {
        password.classList.remove('invalid');
        passErr.classList.remove('visible');
      }

      if (isValid) {
        showToast('Logging in... Welcome back!');
        // In a real app, this would submit to a backend
      }
    });
  }

  /* ============================================================
     8. SIGN UP FORM VALIDATION
     ============================================================ */
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;

      function check(id, errId, msg, extraCheck) {
        const el  = document.getElementById(id);
        const err = document.getElementById(errId);
        if (!el || !err) return;

        const fail = el.value.trim() === '' || (extraCheck && !extraCheck(el.value));
        if (fail) {
          el.classList.add('invalid');
          err.textContent = msg;
          err.classList.add('visible');
          isValid = false;
        } else {
          el.classList.remove('invalid');
          err.classList.remove('visible');
        }
      }

      check('signupName',   'errSignupName',   'Please enter your full name.');
      check('signupEmail',  'errSignupEmail',  'Enter a valid college email.',  function(v){ return v.includes('@'); });
      check('signupPass',   'errSignupPass',   'Password must be at least 6 characters.', function(v){ return v.length >= 6; });
      check('signupBranch', 'errSignupBranch', 'Please select your branch.');
      check('signupYear',   'errSignupYear',   'Please select your year.');

      if (isValid) {
        showToast('Account created! Welcome to SkillBridge 🎉');
        signupForm.reset();
      }
    });
  }

  /* ============================================================
     9. TOAST NOTIFICATION (reusable helper)
     ============================================================ */
  function showToast(message) {
    // Remove existing toast if any
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Style the toast with JavaScript (so no extra CSS class needed in style.css)
    Object.assign(toast.style, {
      position:     'fixed',
      bottom:       '28px',
      left:         '50%',
      transform:    'translateX(-50%)',
      background:   '#1e1e2e',
      color:        '#fff',
      padding:      '12px 24px',
      borderRadius: '8px',
      fontSize:     '0.9rem',
      zIndex:       '9999',
      opacity:      '0',
      transition:   'opacity 0.3s',
      whiteSpace:   'nowrap',
      boxShadow:    '0 4px 16px rgba(0,0,0,0.2)'
    });

    document.body.appendChild(toast);

    // Fade in
    setTimeout(function () { toast.style.opacity = '1'; }, 10);

    // Fade out and remove after 3 seconds
    setTimeout(function () {
      toast.style.opacity = '0';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

}); // End DOMContentLoaded
