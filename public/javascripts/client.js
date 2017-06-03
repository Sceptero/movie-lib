$(document).ready(() => {
  // register
  $('#registerButton').click(() => {
    const login = $('#loginInput').val();
    const password = $('#passwordInput').val();
    
    $.ajax({
      url: '/api/users',
      method: 'POST',
      dataType: 'json',
      data: { login: login, password: password },
      success: (data, textStatus, jqXHR) => {
        alert('Registered');
        window.location.replace('/login');
      },
      error: (jqXHR, textStatus, errorThrown) => {
        alert(jqXHR.responseJSON.message);
      },
    });
  });

  // login
  $('#loginButton').click(() => {
    const login = $('#loginInput').val();
    const password = $('#passwordInput').val();

    $.ajax({
      url: '/api/auth',
      method: 'POST',
      dataType: 'json',
      data: { login: login, password: password },
      success: (data, textStatus, jqXHR) => {
        console.log('sending internal req');
        const recToken = data.token;
        const recId = data.id;
        const recLogin = data.login;

        $.ajax({
          url: '/login',
          method: 'POST',
          dataType: 'json',
          data: { token: recToken, id: recId, login: recLogin },
          success: () => {
            window.location.replace('/');
          },
        });
      },
      error: (jqXHR, textStatus, errorThrown) => {
        alert(jqXHR.responseJSON.message);
      },
    });
  });

  $('#logoutButton').click(() => {
    $.ajax({
      url: '/logout',
      method: 'POST',
      success: () => {
        window.location.replace('/login');
      },
    });
  });

});