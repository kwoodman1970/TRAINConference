/*********************************************************************************************/

function writeMenuItem
(
  pageName,  // the name of the HTML page (without the extension) to send the browser to
  label      // alternate text for images (human-readable)
)

/*
This function generates the HTML code for a single menu item.  Clicking on the menu item sends
the browser to the appropriate page.  HTML pages can have either ".html" or ".htm" as their
filename extensions.

If "pageName" is "home" then the browser will be sent to the default home or index page of the
directory.

ASSUMPTIONS:

* Images are 250x50 pixels in size.
* All pages and images are in the same directory.
* Pages and images have a common base name (e.g. "thing.html", "thing.gif", "thingSel,gif").
* The home page is called "home.html".

*/

{
  /*
  First, the current page's file name and its directory path must be determined from the
  window's location.  There will always be a path, but if there is no file name then that means
  that the current page is the home or index page.
  */

  var urlFormat     = /(.*)[\\\/]([\w]+)\.html?.*/;
  var searchResults = urlFormat.exec(window.location.pathname);
  var path;
  var currentPage;

  if (searchResults == null)
  {
    path        = window.location.pathname;
    currentPage = "home";
  }
  else
  {
    path        = searchResults[1];
    currentPage = searchResults[2];
  }

  /*
  Next, if this menu item is for the current page then there's no need to make a hyperlink of
  it or change the image when the mouse is over it.
  */

  if (pageName == currentPage)
  {
    document.writeln("<IMG NAME=\"" + pageName + "\" SRC=\"" + pageName +
      ".gif\" WIDTH=250 HEIGHT=50 ALT=\"" + label + "\"><BR>");
  }
  else
  {
    /*
    If the menu item is for the home page then the hyperlink should be set to the directory
    path -- thus hiding the actual file name!
    */

    var hyperlink;

    if (pageName == "home")
      hyperlink = path;
    else
      hyperlink = pageName + ".html";

    document.write("<A HREF=\"" + hyperlink + "\" onMouseOver=\"document.images." +
      pageName + ".src=\'" + pageName + "Sel.gif\'\" onMouseOut=\"document.images." +
      pageName + ".src=\'" + pageName + ".gif\'\">");
    document.write("<IMG NAME=\"" + pageName + "\" SRC=\"" + pageName +
      ".gif\" WIDTH=250 HEIGHT=50 ALT=\"" + label + "\" BORDER=0>");
    document.write("</A><BR>");
    document.writeln();
  }

  return;
}

/*********************************************************************************************/

function mailto
(
  name,    // the userID part of an e-mail address
  server,  // the domain part of an e-mail address
  text     // (optional) what the user will see and click on
)

/*
This function generate HTML code for a "mailto" hyperlink.  It's purpose is to hide e-mail
addresses from spiders bent on selling them to spammers.

Spiders search HTML pages for text of the format "name@domain".  They specificly look for the
"@", which is the distinguishing characteristic of an e-mail address.  No "@" means no e-mail
address. This function will take a userID and a domain and generate an HTML "mailto" hyperlink.
Since the source HTML page doesn't contain an "@", spiders won't see an e-mail address;
however, the browser will correctly render the address and the user remains unaware of any
trickery that's been going on.

If "text" is null then the e-mail address is displayed instead.

This function was inspired by a simpler script at www.a1javascripts.com.
*/

{
  var at = "&#0064;";  // character code for "@" (for even more protection)

  document.write("<A HREF='mailto:" + name + at + server + "'>");
  document.write((text == null) ? name + at + server : text);
  document.write("</A>");

  return;
}


