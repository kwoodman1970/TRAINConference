function setCookie
(
  /* String  */ name,         // the cookie's name
  /* String  */ value,        // the value to set the cookie to
  /* String  */ domain,       // the root of all subdomains that can see this cookie (optional)
  /* String  */ path,         // the directories that can see this cookie (optional)
  /* Date    */ expiryDate,   // when the browser should delete the cookie (optional)
  /* boolean */ secure        // restrict transmission to secure connections?
)

/*
This function either creates a new cookie or changes an existing cookie.

If "domain" is specified then the cookie can be seen by all pages on that domain and all of its
subdomains.  For example, if "xyz.ca" is specified then the cookie can also be seen on pages at
"abc.xyz.ca", but if "abc.xyz.ca" is specified then it can't be seen on pages at "xyz.ca".  If
"domain" is not specified then the cookie defaults to the current page's domain.

If "path" is specified then the cookie can be seen only by pages in the directory paths that
begin with "path".  For example, if "/over" is specified then all pages in "/over", "/overcome"
and "/overtake" can see the cookie, but the ones in "/o" and "/under/over" can't.  If "path"
isn't specified then the cookie defaults to the current page's path.

If "expiryDate" is not specified then the cookie will be a session cookie and expire when the
user closes the browser.  If "expiryDate" is in the past then the cookie is deleted immediately
if it already exists or not created at all if it doesn't.
*/

{
  if ((name != null) && (value != null))
  {
    /*
    To create a cookie, a string must first be created in the following format:

      <name>=<value>[; domain=<domain>][; path=<path>][; expires=<GMT date>][; secure]

    Once such a string has been constructed, it's assigned to "document.cookie" -- which, in
    turn, makes a cookie out of it.
    */

    var cookie = name + "=" + escape(value);   // the cookie string to be converted to a cookie

    if (domain != null)
      cookie += "; domain=" + domain;

    if (path != null)
      cookie += "; path=" + escape(path);

    if (expiryDate != null)
      cookie += "; expires=" + expiryDate.toGMTString();

    if ((secure != null) && secure)
      cookie += "; secure";

    document.cookie = cookie;
  }

  return;
}

/*********************************************************************************************/

function getCookies
(
  /* String */ name                    // The name of the cookies whose values are being sought
)

/*
This function returns an array of all values associated with all cookies named "name".  If no
such cookies could be found then a zero-length array is returned.

Cookies are processed in order of most specific domains & paths to least specific ones, but
there's no way to determine which domaains & paths are associated with which cookies.
*/

{
  var values = new Array(0);                     // the array of values to return to the caller

  if (document.cookie != null)
  {
    /*
    The easiest way to find the values of all cookies named "name" is with a regular expression
    object that remembers the "value" part of each cookie it finds.  This expression must be
    invoked repeatedly until all such named cookies have been detected.
    */

    var cookieFinder  = new RegExp(name + "=([^;]*)", "g");  // search for name, remember value
    var searchResults = cookieFinder.exec(document.cookie);  // results of individual searches

    while (searchResults != null)
    {
      values[values.length] = unescape(searchResults[1]);
      searchResults         = cookieFinder.exec(document.cookie);
    }
  }

  return values;
}

/*********************************************************************************************/

function deleteCookie
(
  /* String */ name,          // the cookie's name
  /* String */ domain,        // the root of all subdomains that can see this cookie (optional)
  /* String */ path           // the directories that can see this cookie (optional)
)

/*
This function deletes a cookie.  "name", "domain" and "path" must match exactly, or no action
will be taken.
*/

{
  /*
  A cookie is deleted if its expiry date is set to the past.  Code re-use at its finest...
  */

  var deletionDate = new Date(0);                              // January 1, 1970, 00:00:00 GMT

  setCookie(name, "", domain, path, deletionDate);
  return;
}