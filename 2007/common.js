/*
This file contains variables and functions that are common to most or all pages.
*/

var preloadedGraphics = new Array(1);

for (i = 0; i < preloadedGraphics.length; ++i)
  preloadedGraphics[i] = new Image();

preloadedGraphics[0].src = "menuItemBackgroundHover.gif";

/*********************************************************************************************/

function showMap()

/*
This function opens a new window in the middle of the screen (if possible) that shows a map
of the conference location.
*/

{
  width    = 740;
  height   = 570;
  leftPos  = screen.width ? (screen.width - width ) / 2 : 50;
  topPos   = screen.height ? (screen.height - height) / 2 : 50;
  settings = "width=" + width + ",height=" + height + ",top=" + topPos + ",left=" + leftPos +
             ",scrollbars=1,location=0,directories=0,status=0,menubar=0,toolbar=0,resizable=1";

  window.open("map.html", "", settings);
  return;
}

/*********************************************************************************************/

function mailto
(
  name,    // the userID part of an e-mail address
  domain,  // the domain part of an e-mail address
  text     // (optional) text that user will see and click on
)

/*
This function generates HTML code for a "mailto" hyperlink.  It's purpose is to hide e-mail
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

  document.write("<A HREF=\"mailto:" + name + at + domain + "\">");
  document.write((text == null) ? name + at + domain : text);
  document.write("<\/A>");

  return;
}

/*********************************************************************************************/

function PDFHandled()

/*
This function checks to see if a PDF file can be handled by the browser.  If it can't then it
generates HTML code for a message advising the user to install Adobe Reader.
*/

{
  var isHandled = false;

  if (navigator.mimeTypes.length && (navigator.mimeTypes.length > 0))
  {
    /*
    There's no "standard" way to check this.  Most browsers, though, store their handled MIME
    types in "navigator.mimeTypes", so Plan A is to check it to see if the PDF MIME type is
    listed there.
    */

    if (navigator.mimeTypes["application/pdf"] != null)
      isHandled = true;
  }
  else
  {
    /*
    Internet Explorer for Windows, in a move that can only be described as "annoying to
    website developers," defines "navigator.mimeTypes" but does not populate it!  IE for
    Macintosh populates it, but not IE for Windows!!!

    Plan B, therefore, is to try to instanciate an ActiveX control that can handle PDF files.
    Now, at first glance, one might try to instanciate "AcroExch.Document" (see
    HKEY_LOCAL_MACHINE\Software\Classes\.pdf" in the registry), but IE may pop up a warning to
    the user.  Therefore, this loop will try some non-in-your-face alternate ActiveX controls:
    "PDF.PdfCtrl.1" through "PDF.PdfCtrl.10".  As of this writing, the highest known control is
    "PDF.PdfCtrl.5" (for Adobe Reader 6.0), but there's little harm in planning ahead-- at
    least, not until "PDF.PdfCtrl.11" comes along...

    The instanciation code is put in an "eval()" function to keep every other browser from
    gagging on it.
    */

    var i = 1;

    while (!isHandled && (i <= 10))
    {
      var pdfControl;

      eval("try {pdfControl = new ActiveXObject(\"PDF.PdfCtrl.\" + i);} catch (exception) {}");

      if (pdfControl != null)
        isHandled = true;
      else
        ++i;
    }
  }

  return isHandled;
}

/*********************************************************************************************/

function checkForPDFHandler()

/*
This function checks to see if a PDF file can be handled by the browser.  If it can't then it
generates HTML code for a message advising the user to install Adobe Reader.
*/

{
  if (!PDFHandled())
  {
    document.write("If you are unable to view or print this page then you may need to " +
      "install <A HREF=\"http://www.adobe.com/products/acrobat/readstep2.html\">Adobe " +
      "Reader<\/A> on your computer.");
  }

  return;
}

/*********************************************************************************************/

var common_paneResizers = new Array();            // array of functions that resize panes in IE

function resizePanes()

/*
*** INTERNET EXPLORER HACK ***

This function is an event handler that resizes all of the panes in Internet Explorer.  The
functions that resize these panes must be listed in "common_paneResizers".

Because Internet Explorer 6 doesn't support the "position:fixed" style attribute, such panes
must be simulated with some CSS hacks.  One of the side effects of these hacks is that these
panes are of a fixed size -- which means that if the Internet Explorer window is resized then
the panes aren't.  The only workaround is to manually change their sizes with JavaScript
functions.

This function must attached to "window.onload" and "window.onresize".
*/

{
  if (navigator.appName == "Microsoft Internet Explorer")
  {
    for (i = 0; i < common_paneResizers.length; ++i)
      common_paneResizers[i]();
  }

  return;
}

window.onload = resizePanes;
window.onresize = resizePanes;

/*********************************************************************************************/

function resizeMenu()

/*
*** INTERNET EXPLORER HACK ***

This function resizes the menu pane whenever the Internet Explorer window is resized.  This
function must be listed in "common_paneResizers" in order to work.

Because Internet Explorer 6 doesn't support the "position:fixed" style attribute, such panes
must be simulated with some CSS hacks.  One of the side effects of these hacks is that these
panes are of a fixed size -- which means that if the Internet Explorer window is resized then
the panes aren't.  The only workaround is to manually change their sizes with JavaScript
functions.
*/

{
  if (navigator.appName == "Microsoft Internet Explorer")
  {
    var element = document.getElementById("Menu");

    if (element != null)
      element.style.height = document.body.clientHeight + "px";
  }

  return;
}

common_paneResizers[common_paneResizers.length] = resizeMenu;