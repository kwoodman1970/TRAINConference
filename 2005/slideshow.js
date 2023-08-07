/*
This file contains functions for displaying a slideshow.  The user moves from one slide to
another by clicking on one of two navigation buttons that appear in each slide.  The slideshow
is designed so that if a user has a slow connection then they can at least read the captions
while they're waiting for the images to download.

To create the slideshow, call "writeSlideshow()" at the point in the HTML document where you'd
like the slideshow to appear.

There can be only one slideshow per HTML document.

The slides consist of a series of layers or divisions, all on top of each other and all
contained within a bounding layer or division.  Only one slide is ever visible at any given
time; the others are all hidden.

A cookie used to remember which slide is the current slide in case the user moves to another
document.  This cookie expires at the end of the session.
*/

if ((preloadedGraphics != null) && (preloadedGraphics.length != null))
{
  preloadedGraphics[preloadedGraphics.length]         = new Image();
  preloadedGraphics[preloadedGraphics.length - 1].src = "slideshow/prevDown.gif";

  preloadedGraphics[preloadedGraphics.length]         = new Image();
  preloadedGraphics[preloadedGraphics.length - 1].src = "slideshow/nextDown.gif";
}

var slideShowSupportImages = "slideshow/";          // directory with prev & next button images
var numSlides;                                      // the number of slides in the slideshow
var currentSlide;                                   // the slide currently being viewed

/*********************************************************************************************/

function setCurrentSlideVisible
(
  makeVisible                                          // make current slide visible? (boolean)
)

/*
This function sets the visibility of the current slide.

PRECONDITINS:

"currentSlide" must refer to an existing division or layer.

POSTCONDITIONS:

The current slide is either shown or hidden, depending on "makeValue".
*/

{
  /*
  The three DOM's supported by this function are the W3C Standard, Old (i.e. pre-standard)
  Internet Explorer and Old Netscape Navigator.
  */

  document.getElementById("Slide" + currentSlide).style.visibility =
    (makeVisible ? "visible" : "hidden");
  document.getElementById("SlideshowNavigationSelector" + currentSlide).style.backgroundColor =
    (makeVisible ? "magenta" : "black");

  return;
}

/*********************************************************************************************/

function prevDown(image)

/*
This function changes the image for the "previous slide button" on the current slide to so that
it appears to have been pressed.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer, but shouldn't refer to the first
one in the slideshow.

POSTCONDITIONS:

The image is changed accordingly.
*/

{
  if (image != null)
    image.src = slideShowSupportImages + "prevDown.gif";

  return;
}

/*********************************************************************************************/

function prevUp(image)

/*
This function changes the image for the "previous slide button" on the current slide to so that
it appears to have not been pressed.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer, but shouldn't refer to the first
one in the slideshow.

POSTCONDITIONS:

The image is changed accordingly.
*/

{
  if (image != null)
    image.src = slideShowSupportImages + "prevUp.gif";

  return;
}

/*********************************************************************************************/

function nextDown(image)

/*
This function changes the image for the "next slide button" on the current slide to so that it
appears to have been pressed.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer, but shouldn't refer to the last one
in the slideshow.

POSTCONDITIONS:

The image is changed accordingly.
*/

{
  if (image != null)
    image.src = slideShowSupportImages + "NextDown.gif";

  return;
}

/*********************************************************************************************/

function nextUp(image)

/*
This function changes the image for the "next slide button" on the current slide to so that it
appears to have been pressed.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer, but shouldn't refer to the last one
in the slideshow.

POSTCONDITIONS:

The image is changed accordingly.
*/

{
  if (image != null)
    image.src = slideShowSupportImages + "NextUp.gif";

  return;
}

/*********************************************************************************************/

function prev()

/*
This function changes the current slide to the previous slide.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer and not the first one in the
slideshow.

POSTCONDITIONS:

The current slide is changed from visible to hidden and the previous slide is changed from
hidden to visible.  "currentSlide" is decremented.  The document's "currentSlide" cookie is
updated to the new current slide.
*/

{
  if (currentSlide > 0)
  {
    setCurrentSlideVisible(false);
    --currentSlide;
    setCurrentSlideVisible(true);
    document.cookie = "currentSlide=" + currentSlide;
  }

  return;
}

/*********************************************************************************************/

function next()

/*
This function changes the current slide to the next slide.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer and not the last one in the
slideshow.

POSTCONDITIONS:

The current slide is changed from visible to hidden and the next slide is changed from
hidden to visible.  "currentSlide" is incremented.  The document's "currentSlide" cookie is
updated to the new current slide.
*/

{
  if ((currentSlide + 1) < numSlides)
  {
    setCurrentSlideVisible(false);
    ++currentSlide;
    setCurrentSlideVisible(true);
    document.cookie = "currentSlide=" + currentSlide;
  }

  return;
}

/*********************************************************************************************/

function selectSlide(slideNumber)

/*
This function changes the current slide to the next slide.

PRECONDITIONS:

"currentSlide" must refer to an existing division or layer and not the last one in the
slideshow.

POSTCONDITIONS:

The current slide is changed from visible to hidden and the next slide is changed from
hidden to visible.  "currentSlide" is incremented.  The document's "currentSlide" cookie is
updated to the new current slide.
*/

{
  setCurrentSlideVisible(false);
  currentSlide = slideNumber;
  setCurrentSlideVisible(true);
  document.cookie = "currentSlide=" + currentSlide;

  return;
}

/*********************************************************************************************/

function getLastSlideViewed()

/*
This function search's the document's cookies for the last slide that was viewed.

PRECONDITIONS:

None.

POSTCONDITIONS:

If the cookie had been set previously then the last value of "currentSlide" is returned;
otherwise, 0 is returned.
*/

{
  lastSlide = 0;

  if (document.cookie.length > 0)
  {
    searchResults = /currentSlide=(\d+)/.exec(document.cookie);

    if (searchResults.length > 1)
      lastSlide = new Number(searchResults[1]);
  }

  return lastSlide;
}

/*********************************************************************************************/

function writeSlideshow
(
  // imageURL0, caption0,
  // imageURL1, caption1,
  // ...
  // imageURLN, captionN                     // image files and slide captions (string, string)
)

/*
This function writes the slideshow's HTML code into the document's body.  "imageURLX" and
"captionX" must be all strings.  This function can only be called once per HTML document.

PRECONDITIONS:

None.

POSTCONDITIONS:

The HTML code for the slideshow is written into the document's body.  "numSlides" and
"currentSlide" are initialized.
*/

{
  if (arguments.length > 1)
  {
    numSlides    = Math.floor(arguments.length / 2);
    currentSlide = getLastSlideViewed();

    if (currentSlide >= numSlides)
      currentSlide = 0;

    /*
    First, the slideshow's bounding layer or division is created.

    Old (i.e. pre-standard) Netscape Navigator uses the <ILAYER> and <LAYER> tags to create
    layers; everything else uses the <DIV> tag.

    Although it makes sense to use a CSS file throughout this function, each element is given
    its own style attributes because Old Netscape Navigator doesn't support style attributes.
    Therefore, the style specifications for Old Netscape Navigator and everything else are kept
    close together for ease of maintenance.
    */

    document.writeln("<DIV CLASS=\"Slideshow\">");

    /*
    Next, each slide's layer or division is created.
    */

    for (i = 0; i < numSlides; i++)
    {
      imageURL = arguments[i * 2];
      caption  = arguments[i * 2 + 1];

      document.writeln("<DIV CLASS=\"SlideshowSlide\" ID=\"Slide" + i + "\">");

      /*
      The slide's image is created here.
      */

      document.writeln("<IMG CLASS=\"Slideshow\" SRC=\"" + imageURL + "\" ALT=\"\"><BR>");
      document.writeln("<BR>");

      /*
      The caption is created here and the slide's layer or division is closed off.
      */

      document.writeln(caption);
      document.writeln("</DIV>");
    }

    /*
    The last step is to close off the slideshow's bounding layer or division.
    */

    document.writeln("</DIV>");

    /*
    The navigation area (which includes buttons & slide counter) is created here.
    */

    document.writeln("<DIV CLASS=\"SlideshowNavigationBar\" ID=\"SlideshowNavigationBar\">");

    document.write("<IMG CLASS=\"SlideshowNavigationButton\" STYLE=\"float:left;\" " +
      "SRC=\"slideshow/prevUp.gif\" ALT=\"&lt;\" ONMOUSEDOWN=\"prevDown(this)\" " +
      "ONMOUSEUP=\"prevUp(this)\" ONMOUSEOUT=\"prevUp(this)\" ONCLICK=\"prev()\">");

    document.write("<IMG CLASS=\"SlideshowNavigationButton\" STYLE=\"float:right;\" " +
      "SRC=\"slideshow/nextUp.gif\" ALT=\"&gt;\" ONMOUSEDOWN=\"nextDown(this)\" " +
      "ONMOUSEUP=\"nextUp(this)\" ONMOUSEOUT=\"nextUp(this)\" ONCLICK=\"next()\">");

    document.writeln("<TABLE CLASS=\"SlideshowNavigationBar\">");
    document.writeln("<TR CLASS=\"SlideshowNavigationBar\">");

    /*document.write("<TD CLASS=\"SlideshowNavigationBar\" STYLE=\"width:32px;background:transparent;\">");
    document.writeln("</TD>");*/

    for (i = 0; i < numSlides; ++i)
    {
      document.write("<TD CLASS=\"SlideshowNavigationBar\" STYLE=\"width:10%;\" " +
        "ID=\"SlideshowNavigationSelector"+ i + "\" ONCLICK=\"selectSlide(" + i + ")\">");
      document.write(i + 1);
      document.writeln("</TD>");
    }

    /*document.write("<TD CLASS=\"SlideshowNavigationBar\" STYLE=\"width:32px;background:transparent;\">");
    document.writeln("</TD>");*/

    document.writeln("</TR>");
    document.writeln("</TABLE>");
    document.writeln("</DIV>");

    setCurrentSlideVisible(true);

  }

  return;
}

/*********************************************************************************************/

function slideshowMakePrinterFriendly()
{
  for (i = 0; i < numSlides; ++i)
  {
    var slideStyle = document.getElementById("Slide" + i).style;

    slideStyle.position = "relative";
    slideStyle.visibility = "visible";
  }

  document.getElementById("SlideshowNavigationBar").style.display = "none";
  document.getElementById("Contents").style.bottom = "18px";
  return;
}

/*********************************************************************************************/

function slideshowMakeScreenFriendly()
{
  for (i = 0; i < numSlides; ++i)
  {
    var slideStyle = document.getElementById("Slide" + i).style;

    slideStyle.position = "absolute";
    slideStyle.visibility = (i == currentSlide ? "visible" : "hidden");
  }

  document.getElementById("SlideshowNavigationBar").style.display = "inherit";
  document.getElementById("Contents").style.bottom = "52px";
  return;
}