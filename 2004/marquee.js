/*
This file contains functions for displaying and shifting a moving marquee (composed of a
graphic image tiled horizontally across a document, division, table cell, etc.).

To create the marquee, call "writeMarqueeCode()" from a script block in the body of an HTML
document.  The actual placement of the marquee depends on "marquee.css" (and "marqueeIE6.css",
if Internet Explorer is being used).

The marquee itself consists of two layers:  a bounding layer and a moving layer.  The
appearance of scrolling is acheived by shifting the moving layer to the left at regular
intervals.  The bounding layer clips the moving layer.
*/

/*********************************************************************************************/

function scrollMarquee
(
  imageWidth,              // the width of a single image in the marquee (int)
  shiftAmount,             // the number of pixels to shift the marquee to the left by (int)
  period                   // the number of milliseconds to wait between shift operations (int)
)

/*
This function performs the shift operation required to scroll the marquee.  It then waits for
"period" milliseconds before performing the next shift operation.

PRECONDITIONS:
The marquee must exist.  "imageWidth", "shiftAmount" and "period" must be greater than zero.
To prevent the occassional jarring effect, "imageWidth" should be a multiple of "shiftAmount".

POSTCONDITIONS:
The marquee appears to have been shifted to the left by "shiftAmount" pixels.
*/

{
  /*
  The current left position of the moving layer is found in that layer's style information.
  */

  if (document.getElementById != null)
  {
    style = document.getElementById("Marquee").style;

    if (style != null)
    {
      var leftPosition = 0;

      if (style.left != "")
        leftPosition = parseInt(style.left);

      /*
      To avoid overloading the browser, the left edge of the layer is kept within the range of
      [-imageWidth, 0).  Such normalization is unnoticeable because the images are "tiled."  If
      "imageWidth" is not a multiple of "shiftAmount" then there will be a jarring effect when
      normalization is performed.
      */

      if (leftPosition <= -imageWidth)
        leftPosition = 0;

      style.left = (leftPosition - shiftAmount) + "px";

      /*
      The last step is to call this routine again after "period" milliseconds have elapsed.
      */

      setTimeout("scrollMarquee(" + imageWidth + ", " + shiftAmount + ", " + period + ")",
        period);
    }
  }

  return;
}

/*********************************************************************************************/

function writeMarqueeCode
(
  shiftAmount,    // the number of pixels to shift the marquee to the left by each period (int)
  period,         // the number of milliseconds between shift operations (int)
  imageURL,       // the URL of the image file to put in the marquee (string)
  imageWidth,     // the width of the image in pixels (int)
  imageHeight     // the height of the image in pixels (int)
)

/*
This routine generates the HTML code for a tiled-image scrolling marquee.

Call this routine from a script block in the body of the document.

For smoothest scrolling, set "shiftAmount" to 1.  If the image has dot-matrix-style text then
you can get an LED-marquee-like effect by setting "shiftAmount" to the distance between the
dots.

If "imageWidth" is not a multiple of "shiftAmount" then there will be a jarring effect at
regular intervals.

PRECONDITIONS:

"period", "imageWidth" and "imageHeight" must be greater than zero.  "shiftAmount" must be
non-zero.

POSTCONDITIONS:

A tiled-image side-scrolling marquee is created.  Scrolling is started automatically.
*/

{
  /*
  First, the HTML code for the two layers is generated.

  The moving layer consists of enough images to fill the screen's width.  Because the bounding
  layer clips the moving layer, the extraneous images (if any) are never seen.
  */

  var numImages = Math.ceil(screen.width / imageWidth) + 1;

  document.writeln("<DIV ID=\"MarqueeViewport\" STYLE=\"height:" + imageHeight + "px;\">");
  document.writeln("<DIV ID=\"Marquee\" STYLE=\"width:" + (numImages * imageWidth) +
    "px;height:" + imageHeight + "px;\">");

  for (var i = 0; i < numImages; ++i)
  {
    document.write("<IMG SRC=\"" + imageURL + "\" ALT=\"\">");
  }

  document.writeln();
  document.writeln("</DIV>");
  document.writeln("</DIV>");

  /*
  Next, the scrolling operation is initiated.
  */

  scrollMarquee(imageWidth, shiftAmount, period);

  return;
}

/*********************************************************************************************/

function resizeMarquee()

/*
*** INTERNET EXPLORER HACK ***

This function is an event handler that resizes the "Marquee" layer to fit the width of the
content window in Internet Explorer.  There is a flaw in IE that would cause the marquee to
obscure the rightmost scrollbar -- this function manually adjusts the width of the marquee so
that it doesn't.

PRECONDITIONS:

This function must be listed in "common_paneResizers" (defined in "common.js") in order to
work.

POSTCONDITIONS:

The marquee fits in IE's content window.
*/

{
  if (navigator.appName == "Microsoft Internet Explorer")
  {
    var element = document.getElementById("MarqueeViewport");

    if (element != null)
      element.style.width = document.body.clientWidth + "px";
  }

  return;
}

common_paneResizers[common_paneResizers.length] = resizeMarquee;               // see common.js