function isIpAddressValid(ipAddress)
{
  var isValid = true;
  var i       = 1;

  while ((i < ipAddress.length) && isValid)
  {
    isValid = (parseInt(ipAddress[i]) <= 255)
    i++;
  }

  return isValid;
}

function isDomainNameValid(domainName)
{
  var isValid = false;

  var validDomainNameChars = /^[\w\-.]+$/;
  var invalidDots      = /\.$|\.\.|^\./;

  if (validDomainNameChars.test(domainName) && !invalidDots.test(domainName))
  {
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

function validatePostalCode(inputField)
{
  var postalCodeFormat = /^$|^[A-Z]\d[A-Z] \d[A-Z]\d$/i;
  var isValid          = postalCodeFormat.test(inputField.value);

  if (isValid)
    inputField.value = inputField.value.toUpperCase();
  else
  {
    alert("That's not a postal code!");
    inputField.focus();
  }

  return;
}

function validatePhone(inputField)
{
  var phoneFormat = new Array;

  phoneFormat[0] = /^$/;
  phoneFormat[1] = /^(\d{3})-(\d{4})$/;
  phoneFormat[2] = /^\((\d{3})\) ?(\d{3})-(\d{4})$/;
  phoneFormat[3] = /^(\d{3})-(\d{3})-(\d{4})$/;

  var i          = 0;
  var phoneFound = false;

  while ((i < phoneFormat.length) && !phoneFound)
  {
    var matches = phoneFormat[i].exec(inputField.value);

    phoneFound = (matches != null);

    if (phoneFound)
    {
      var newValue = "";

      for (var j = 1; j < matches.length; j++)
      {
        if (matches[j] != "")
        {
          if (newValue != "")
            newValue = newValue + "-";

          newValue = newValue + matches[j];
        }
      }

      inputField.value = newValue;
    }

    i++;
  }

  if (!phoneFound)
  {
    alert("That's not a phone number!");
    inputField.focus();
  }

  return;
}

function validateEmail(inputField)
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

function validateWebsite(inputField)
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

function validateNumber(inputField)
{
  var NumberFormat = /^\d*$/;
  var isValid      = NumberFormat.test(inputField.value);

  if (!isValid)
  {
    alert("That's not a valid number!");
    inputField.focus();
  }
  
  return;
}

function isRqBrochuresValid(rqBrochuresForm)
{
  var submit = true;

  if (
    (rqBrochuresForm.ChurchName.value == "") ||
    (rqBrochuresForm.Address.value    == "") ||
    (rqBrochuresForm.City.value       == "") ||
    (rqBrochuresForm.PostalCode.value == ""))
  {
    alert("Please provide the church's complete mailing address.")
    submit = false;
  }

  if (
    (rqBrochuresForm.realname.value == "") ||
    (rqBrochuresForm.email.value    == ""))
  {
    alert("Please provide both a name and an e-mail address for the contact person.")
    submit = false;
  }

  if (
    (parseInt("0" + rqBrochuresForm.NumBrochuresRequested.value) == 0) &&
    (parseInt("0" + rqBrochuresForm.NumPostersRequested.value) == 0))
  {
    alert("You didn't request any brochures or posters!")
    submit = false;
  }

  return submit;
}

function isSuggestTopicValid(suggestTopicForm)
{
  var submit = true;

  if (
    (suggestTopicForm.realname.value == "") ||
    (suggestTopicForm.email.value    == ""))
  {
    alert("Please provide both your name and e-mail address.")
    submit = false;
  }

  if (suggestTopicForm.topic.value == "")
  {
    alert("You didn't suggest any discussion topics!")
    submit = false;
  }

  return submit;
}

