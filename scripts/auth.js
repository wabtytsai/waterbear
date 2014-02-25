(function(global) {
    var currentUser = 'bob@example.com';

    navigator.id.watch({
        loggedInUser: currentUser,
        onlogin: verifyAssertion,
        onlogout: function() {}
    });

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
        };
    }

    function simpleXhrSentinel(xhr) {
        return function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    // reload page to reflect new login state
                    console.log('reloading');
                    window.location.reload();
                } else {
                    console.log('error validating');
                    navigator.id.logout();
                }
            }
        }
    }

    function verifyAssertion(assertion) {
        var xhr = new XMLHttpRequest();
        var params = "assertion=" + assertion;
        xhr.open("POST", "/auth/persona?assertion=" + assertion.toString(), true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("Content-length", params.length);
        xhr.onreadystatechange = simpleXhrSentinel(xhr);
        xhr.send();
    }

    function signoutUser() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/logout", true);
        xhr.onreadystatechange = simpleXhrSentinel(xhr);
        xhr.send(null);
    }
})(this);