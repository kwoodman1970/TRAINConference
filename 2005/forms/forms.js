/*
This file contains almost everything needed to manage forms, including input field validation
functions and window management.

It doesn't contain form validation functions -- those should be coded in the same HTML file as
the forms themselves.
*/

forms = new Object;                                             // array of browser sub-windows
var badField = null;

/*********************************************************************************************/

function fixFocus(element)
{
  if (badField != null)
  {
    if (element.id == badField.id)
      badField = null;
    else
    {
      window.focus();
      badField.focus();
    }
  }

  return;
}

/*********************************************************************************************/

function isIpAddressValid
(
  ipAddress                                     // the IP address to examine (array of strings)
)

// --------------------------------------------------------------------------------------------

/*
This function determines whether or not the strings in the array "ipAddress" are valid IP
dotted address components.

PRECONDITIONS:
Each string in "ipAddress" must contain a positive integer.

POSTCONDITIONS:
If all of the strings in "ipAddress" are valid IP dotted address components then "true" is
returned; otherwise, "false" is returned.
*/

// --------------------------------------------------------------------------------------------

{
  /*
  A string in "ipAddress" is considered to be a valid IP dotted address component if it can be
  parsed into a number betwwen 0 and 255.  Therefore, each element of "ipAddress" is checked
  for this condition.
  */

  var isValid = true;
  var i       = 1;

  while ((i < ipAddress.length) && isValid)
  {
    isValid = (parseInt(ipAddress[i]) <= 255)
    i++;
  }

  return isValid;
}

/*********************************************************************************************/

function isDomainNameValid
(
  domainName                                             // the domain name to examine (string)
)

// --------------------------------------------------------------------------------------------

/*
This function performs an exhaustive analysis of "domainName" to determine whether or not it's
a valid Internet domain name.

PRECONDITIONS:

None.

POSTCONDITIONS:

"true" is returned if "domainName" is found to be a valid Internet domain name; otherwise,
"false" is returned.
*/

// --------------------------------------------------------------------------------------------

{
  var isValid = false;

  /*
  A domain name can consist of alphanumeric characters, underscores, hyphens and periods.  It
  can't begin with or end with a period, nor can there be two periods together.
  */

  var validDomainNameChars = /^[\w\-.]+$/;
  var invalidDots      = /\.$|\.\.|^\./;

  if (validDomainNameChars.test(domainName) && !invalidDots.test(domainName))
  {
    /*
    A domain name must end with a valid suffix (e.g. ".com", ".net", ".org"...).
    */

    var findDomainSuffix = /.+\.(.+)$/;
    var matches          = findDomainSuffix.exec(domainName);

    if (matches != null)
    {
      var domainSuffix        = matches[1];
      var validDomainSuffixes = new RegExp("^(ac|ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|" +
                                  "as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|" +
                                  "br|bs|bt|bv|bw|by|bz|ca|cc|cf|cg|ch|ci|ck|cl|cm|cn|co|" +
                                  "com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|" +
                                  "ee|eg|eh|er|es|et|fi|firm|fj|fk|fm|fo|fr|fx|ga|gb|gd|ge|" +
                                  "gf|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|" +
                                  "hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|" +
                                  "kgkh|ki|km|kn|kp|kr|kw|ky|kz|la||lc|li|lk|lr|ls|lt|lu|lv|" +
                                  "ly|ma|mc|md|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|" +
                                  "museum|mv|mw|mx|my|mz|na|nato|name|nc|ne|net|nf|ng|ni|nl|" +
                                  "no|nom|np|nr|nt|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|" +
                                  "pr|pro|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|" +
                                  "sj|sk|sl|sm|sn|so|sr|st|store|su|sv|sy|sz|tc|td|tf|tg|th|" +
                                  "tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|" +
                                  "vc|ve|vg|vi|vn|vu|web|wf|ws|ye|yt|yu|za|zm|zr|zw)$");

      isValid = validDomainSuffixes.test(domainSuffix);
    }
  }

  return isValid;
}

/*********************************************************************************************/

function validatePostalCode
(
  inputField,               // the postal code to examine & reformat (<INPUT> document element)
  event
)

// --------------------------------------------------------------------------------------------

/*
This function checks to see if "inputField" contains a valid Canadian postal code.  It can be
used like this:

  <INPUT TYPE=TEXT onChange="validatePostalCode(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains an invalid Canadian postal code then an alert box
lets the user know.  Otherwise, all lowercase letters are converted to uppercase.
*/

// --------------------------------------------------------------------------------------------

{
  /*
  The format of a postal code is <letter><number><letter><space><number><letter><number>.
  Letters must be uppercase, but lowercase letters are technically valid.
  */

  var postalCodeFormat = /^$|^([A-Z]\d[A-Z]) *(\d[A-Z]\d)$/i;
  var matches          = postalCodeFormat.exec(inputField.value);

  if (matches != null)
  {
    inputField.value = matches[1].toUpperCase() + " " + matches[2].toUpperCase();
  }
  else
  {
    alert("That's not a postal code!");
    badField = inputField;
  }

  return;
}

/*********************************************************************************************/

function validatePhone
(
  inputField               // the phone number to examine & reformat (<INPUT> document element)
)

// --------------------------------------------------------------------------------------------

/*
This function checks to see if "inputField" contains a valid phone number.  It can be used like
this:

  <INPUT TYPE=TEXT onChange="validatePhone(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains a invalid phone number then an alert box lets the
user know.  Otherwise, the phone number is forced into a "###-####" or "###-###-####" format.
*/

// --------------------------------------------------------------------------------------------

{
  /*
  There are several formats that a phone number can be in:

    ###-####
    (###) ###-####
    ###-###-###

  These must all be checked.
  */

  var phoneFormat = /^\D*(\d\d\d)\D*(\d\d\d)\D*(\d\d\d\d)\D*$/;
  var matches = phoneFormat.exec(inputField.value);

  if (matches != null)
  {
    /*
    If a valid phone number is found then it's forced into a particular format.
    */

    inputField.value = "(" + matches[1] + ") " + matches[2] + "-" + matches[3];
  }
  else if (inputField.value != "")
  {
    alert("That's not a phone number!\n\nDid you forget to include the area code?");
    inputField.focus();
  }

  return;
}

/*********************************************************************************************/

function validateEmail
(
  inputField                        // the e-mail address to examine (<INPUT> document element)
)

// --------------------------------------------------------------------------------------------

/*
This function checks to see if "inputField" contains a valid e-mail address.  It can be used
like this:

  <INPUT TYPE=TEXT onChange="validateEmail(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains a invalid e-mail address then an alert box lets the
user know.
*/

// --------------------------------------------------------------------------------------------

{
 var isValid = false;

  if (inputField.value == "")
    isValid = true;
  else
  {
    var emailFormat = /^(.+)@(.+)$/;
    var matches     = emailFormat.exec(inputField.value);

    if (matches != null)
    {
      var userId           = matches[1];
      var domain           = matches[2];
      var quotedFormat     = /^"[^\x00-\x1f"\x7f-\xff]*"$/;
      var validUserIdChars = /^[^\x00-\x1f "\(\),:;<>@\[\\\]\x7f-\xff]+$/;

      if (quotedFormat.test(userId) || validUserIdChars.test(userId))
      {
        var dottedIpAddressFormat = /^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;

        matches = dottedIpAddressFormat.exec(domain)
        isValid = ((matches != null) ? isIpAddressValid(matches) : isDomainNameValid(domain));
      }
    }
  }

  if (!isValid)
  {
    alert("That's not an e-mail address!");
    inputField.focus();
  }

  return;
}

/*********************************************************************************************/

function validateWebsite
(
  inputField                       // the website address to examine (<INPUT> document element)
)

// --------------------------------------------------------------------------------------------

/*
This function checks to see if "inputField" contains a valid website address.  It can be used
like this:

  <INPUT TYPE=TEXT onChange="validateWebsite(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" isn't blank and contains a invalid website address then an alert box lets the
user know.
*/

// --------------------------------------------------------------------------------------------

{
  var isValid = false;

  if (inputField.value == "")
    isValid = true;
  else
  {
    var websiteFormat = /^([^\/]+)\/?(.*)$/;
    var matches       = websiteFormat.exec(inputField.value);

    if (matches != null)
    {
      var domain                = matches[1];
      var page                  = matches[2];
      var dottedIpAddressFormat = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

      matches = dottedIpAddressFormat.exec(domain)

      if ((matches != null) ? isIpAddressValid(matches) : isDomainNameValid(domain))
      {
        if (page == "")
          isValid = true;
        else
        {
          var pageFormat = /^([^.]*)\.?([^\.#]*)#?([^#]*)$/;

          match = pageFormat.exec(page);

          if (match != null)
          {
            var pathAndFilename     = match[1];
            var extension           = match[2];
            var anchor              = match[3];
            var validFilenameChars  = /^[\w\/]+$/;
            var invalidSlashes      = /\/\//;
            var validExtensionChars = /^[\w]*$/;
            var validAnchorChars    = /^[^\x00-\x1f \x7f-\xff]*$/;

            isValid = (validFilenameChars.test(pathAndFilename) &&
              !invalidSlashes.test(pathAndFilename) && validExtensionChars.test(extension) &&
              validAnchorChars.test(anchor));
          }
        }
      }
    }
  }

  if (!isValid)
  {
    alert("That's not a website address!");
    inputField.focus();
  }

  return;
}

/*********************************************************************************************/

function validateNumber
(
  inputField                                // the number to examine (<INPUT> document element)
)

// --------------------------------------------------------------------------------------------

/*
This function checks to see if "inputField" contains a valid positive integer.  It can be used
like this:

  <INPUT TYPE=TEXT onChange="validateNumber(this)">

PRECONDITIONS:
None.

POSTCONDITIONS:
Iff "inputField" contains an invalid positive integer then an alert box lets the user know.
*/

// --------------------------------------------------------------------------------------------

{
  var NumberFormat = /^\d*$/;
  var isValid      = NumberFormat.test(inputField.value);

  if (!isValid)
  {
    window.alert("That's not a valid number!");
    inputField.focus();
  }

  return;
}

/*********************************************************************************************/

function validateISBN
(
  inputField
)

{
  if (inputField.value != "")
  {
    var parsedField = inputField.value.replace(/\s|-/g, "").toUpperCase();

    var checksum = 0;
    var weight = 10;

    for (var i = 0; i < parsedField.length; ++i)
    {
      var digit = parseInt(parsedField.charAt(i));

      if (isNaN(digit) && (weight == 1) && (parsedField.charAt(i) == "X"))
        digit = 10;

      if (!isNaN(digit))
        checksum += digit * weight--;
    }

    if (weight != 0)
    {
      window.alert("That's not a valid ISBN number!");
      inputField.focus();
    }
    else if ((checksum % 11) != 0)
    {
      window.alert("The ISBN checksum fails, which means that you've probably mistyped a " +
        "digit.  Please try again.");
      inputField.focus();
    }
  }

  return;
}

/*
public static boolean check(String isbn)
{
  String NUMVALUES = "0123456789X-";
  char[] theChars  = isbn.toUpperCase().toCharArray();
  int    checksum  = 0;
  int    weight    = 10;

  //clean the string, compute checksum

  StringBuffer sb = new StringBuffer();
  int          i;

  for (i = 0; (i < theChars.length) && (weight > 0); ++i)
  {
    int val = NUMVALUES.indexOf(theChars[i]);
    if (val >=0)
    {
      //valid character

      if (val == 10 && weight != 1) return false;  //X in a bad place
      if (val < 11)
      {
        //not a dash

        checksum = checksum + weight * val;
        --weight;
      }
    }
    else
    {
      //invalid char

      return false;
    }
  }

  if (i < theChars.length) return false;  //string too long

  return ((checksum % 11) == 0);
}

*/

/*********************************************************************************************/

function showForm
(
  name,                                                // the name of the form to show (string)
  url
)

// --------------------------------------------------------------------------------------------

/*
This function makes the browser window for the form "name" appear, either by creating it or by
bringing it into focus.  It can be used like this:

  <A HREF="javascript:showForm('fillMeIn')">Click Here!</A>
  <INPUT TYPE=BUTTON VALUE="Click Here!" onClick="showForm('FillMeIn')">

PRECONDITIONS:
"name" must be a valid form name, and the file "name".html must exist.

POSTCONDITIONS:
The specified form is either displayed in a new window or brought into focus.
*/

// --------------------------------------------------------------------------------------------

{
  /*
  If the window "name" is in "forms" and isn't in a closed state then that means that it
  already exists and just needs to be brought into focus; otherwise, the window has to be
  (re-)created.
  */

  if (name && forms[name] && !forms[name].closed)
  {
    forms[name].focus();
  }
  else
  {
    /*
    "width" and "height" are arbitrary values for the size (in pixels) of the window.  From
    these values, though, the window is created in the centre of the screen.
    */

    var width    = 720;
    var height   = 480;
    var leftPos  = screen.width ? (screen.width - width ) / 2 : 50;
    var topPos   = screen.height ? (screen.height - height) / 2 : 50;
    var settings = "width=" + width + ",height=" + height + ",top=" + topPos + ",left=" +
                   leftPos + ",scrollbars=1,location=0,directories=0,status=0,menubar=0," +
                   "toolbar=0,resizable=1";

    if (!url && name)
      url = "forms/" + name + ".html";

    var form = window.open(url, name, settings);

    if (name)
      forms[name] = form;

    return;
  }
}

/*********************************************************************************************/

function showSPORGForm
(
  eventID                 // the event ID of the SPORG form to be displayed (string or integer)
)

// --------------------------------------------------------------------------------------------

/*
This function makes the browser window for a SPORG form appear.  It can be used like this:

  <A HREF="javascript:showSPORGForm(1234)">Click Here!</A>
  <INPUT TYPE=BUTTON VALUE="Click Here!" onClick="showSPORGForm('1234')">

PRECONDITIONS:
None.

POSTCONDITIONS:
The specified SPORG form is displayed in a new window.
*/

// --------------------------------------------------------------------------------------------

{
  /*
  "width" and "height" are arbitrary values for the size (in pixels) of the window.  From these
  values, though, the window is created in the centre of the screen.
  */

  var width    = 720;
  var height   = 480;
  var leftPos  = screen.width ? (screen.width - width ) / 2 : 50;
  var topPos   = screen.height ? (screen.height - height) / 2 : 50;
  var settings = "width=" + width + ",height=" + height + ",top=" + topPos + ",left=" +
                 leftPos + ",scrollbars=1,location=0,directories=0,status=0,menubar=0," +
                 "toolbar=0,resizable=1";

  var form = window.open("https://www.sporg.com/registration?link_type=reg_info&form_id=" +
               eventID + "&view_type=windowed", "spgwin", settings);

  return;
}

/*********************************************************************************************/

function closeAllForms()

// --------------------------------------------------------------------------------------------

/*
This function closes all open forms.  It can be used like this:

  <BODY onUnload="closeAllForms()">

PRECONDITIONS:

None.

POSTCONDITIONS:

All sub-windows in "forms" are closed.
*/

// --------------------------------------------------------------------------------------------

{
  for (var i in forms)
  {
    if (!forms[i].closed)
      forms[i].close();
  }

  return;
}
