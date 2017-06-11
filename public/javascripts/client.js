$(document).ready(() => {
  // register
  $('#registerButton').click(() => {
    const login = $('#loginInput').val();
    const password = $('#passwordInput').val();

    $.ajax({
      url: '/register',
      method: 'POST',
      dataType: 'json',
      data: { login, password },
      success: () => {
        window.location.replace('/login');
      },
      error: () => {
        alert('registration error');
      },
    });
  });

  // login
  $('#loginButton').click(() => {
    const login = $('#loginInput').val();
    const password = $('#passwordInput').val();

    $.ajax({
      url: '/login',
      method: 'POST',
      dataType: 'json',
      data: { login, password },
      success: () => {
        window.location.replace('/');
      },
      error: () => {
        alert('login error');
      },
    });
  });


  // logout
  $('#logoutButton').click(() => {
    $.ajax({
      url: '/logout',
      method: 'POST',
      success: () => {
        window.location.replace('/login');
      },
      error: () => {
        alert('logout error');
      },
    });
  });

  // add movie
  $('#addMovieButton').click(() => {
    const title = $('#movieTitle').val();
    const rating = $('#movieRating').val();
    const director = $('#movieDirector').val();
    const actors = $('#movieActors').val();
    const category = $('#movieCategory').val();

    $.ajax({
      url: '/add-movie',
      method: 'POST',
      dataType: 'json',
      data: { title, rating, director, actors, category },
      success: (data, textStatus, jqXHR) => {
        window.location.replace('/');
      },
      error: (jqXHR, textStatus, errorThrown) => {
        alert('add movie error');
      },
    });
  });

  // add movie
  $('#updateMovieButton').click(() => {
    const title = $('#movieTitle').val();
    const rating = $('#movieRating').val();
    const director = $('#movieDirector').val();
    const actors = $('#movieActors').val();
    const category = $('#movieCategory').val();

    $.ajax({
      url: window.location.pathname,
      method: 'PATCH',
      dataType: 'json',
      data: { title, rating, director, actors, category },
      success: (data, textStatus, jqXHR) => {
        window.location.replace('/');
      },
      error: (jqXHR, textStatus, errorThrown) => {
        alert('update movie error');
      },
    });
  });

  // remove movie
  $('#removeMovieButton').click(() => {
    $.ajax({
      url: window.location.pathname,
      method: 'DELETE',
      dataType: 'json',
      success: (data, textStatus, jqXHR) => {
        window.location.replace('/');
      },
      error: (jqXHR, textStatus, errorThrown) => {
        alert('remove movie error');
      },
    });
  });
});
