document.addEventListener('DOMContentLoaded', () => {
  // LOGIN FORM
  const loginForm = document.querySelector('.form--login');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      login(email, password);
    });
  }

  // SIGNUP FORM
  const signupForm = document.querySelector('.form--signup');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      signup(name, email, password, passwordConfirm);
    });
  }

  // LOGOUT BUTTON
  const logoutBtn = document.querySelector('.nav__el--logout');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // USER DATA FORM
  const userDataForm = document.querySelector('.form-user-data');
  if (userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);
      updateSettings(form, 'data');
    });
  }

  // USER PASSWORD FORM
  const userPasswordForm = document.querySelector('.form-user-password');
  if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password',
      );
      document.querySelector('.btn--save-password').textContent =
        'SAVE PASSWORD';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });
  }

  // BOOK TOUR BUTTON
  const bookBtn = document.getElementById('book-tour');
  if (bookBtn) {
    bookBtn.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';
      const { tourId } = e.target.dataset;
      bookTour(tourId);
    });
  }

  // MAP
  const mapBox = document.getElementById('map');
  if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations);
    displayMap(locations);
  }

  // RECOMMENDATIONS
  if (
    document.querySelector('.overview') &&
    document.querySelector('.nav__user-img')
  ) {
    displayRecommendationsOnOverview();
  }
});
