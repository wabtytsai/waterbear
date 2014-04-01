(function(global) {
    var currentUser;

    var signinLink = document.getElementById('signin');
    if (signinLink) {
        signinLink.onclick = function() {
            navigator.id.request();
        };
    }

    var signoutLink = document.getElementById('signout');
    if (signoutLink) {
        signoutLink.onclick = function() {
            navigator.id.logout();
            window.location.reload();
        };
    }

    function signinSentinel(xhr) {
        return function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    console.log('haha');
                    currentUser = xhr.response.currentUser;
                    console.log(currentUser);
                    window.location.reload();
                } else {
                    navigator.id.logout();
                }
            }
        }
    }

    function signoutSentinel(xhr) {
        return function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    window.location.reload();
                }
            }
        }
    }

    function verifyAssertion(assertion) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/auth/persona?assertion=" + assertion.toString(), true);
        //xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onreadystatechange = signinSentinel(xhr);
        xhr.send();
    }

    function signoutUser() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/logout", true);
        xhr.onreadystatechange = signoutSentinel(xhr);
        xhr.send();
    }

    navigator.id.watch({
        loggedInUser: currentUser,
        onlogin: verifyAssertion,
        onlogout: signoutUser
    });
})(this);