function escapeHtml(html)
{
    var text = document.createTextNode(html);
    var div = document.createElement('div');
    div.appendChild(text);
    return div.innerHTML.replace(new RegExp(" ", 'g'), "+");
}
function getCart()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://api-gtm.grubhub.com/carts/" + JSON.parse(window.localStorage["ngStorage-cartState"])["cartId"], false ); // false for synchronous request
    xmlHttp.setRequestHeader('Authorization', 'Bearer ' + JSON.parse(window.localStorage["ngStorage-oauthCredentials"])["session_handle"]["access_token"]);
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}
function charge(inpt) {
  var inner = "Charge " + inpt.value + " for one " + inpt.name;
  var href = "https://venmo.com/" + inpt.value + "?txn=charge&amount=" + inpt.getAttribute("price") + "&note=" + inpt.getAttribute("escaped");
  var a = inpt.parentNode.getElementsByTagName("a")[0];
  a.innerText = inner;
  a.setAttribute("href", href);
}
function venmoPopup(){
  var s = "<div>";
  getCart().charges.lines.line_items.forEach(
    function(item) {
      for (i = 0; i < item.quantity; i++) {
        s += "<div><p>One " + item.name + "</p><div><input onchange='charge(this)' value = 'venmo username'name='"+ item.name +"' escaped='"+ escapeHtml(item.name) +"' price='"+ item.price/100.00 +"'/><a target='_blank' href='#'></a></div></div>";
      }
    }
  )
  s += "</div>";
  return '<ngb-modal-backdrop class="modal-backdrop fade show"></ngb-modal-backdrop><ngb-modal-window role="dialog" style="display: block;" tabindex="-1" class="modal fade show s-modal"><div role="document" class="modal-dialog modal-lg"><div class="modal-content"><ghs-simple-modal-instance class="s-modal-content"><div class="s-modal-header"><!----><button class="s-modal-close s-btn" onclick="closeVenmo()"><span class="icon-close"></span></button></div><div class="s-modal-body"><div class="s-panel s-col-xs-12"><div class="s-panel-heading"><h1>Venmo Split</h1></div><div class="s-panel-body">'+s+'</div></div></div></ghs-simple-modal-instance></div></div></ngb-modal-window>'
}

function launchVenmoPopup() {
  var div = document.createElement('div');
  div.innerHTML = venmoPopup();
  var popup = div.childNodes;
  document.body.appendChild(popup[0]);
  var comment = "wtf is this wizardry";
  document.body.appendChild(popup[0]);
}
function closeVenmo() {
  document.getElementsByTagName("ngb-modal-window")[0].remove();
}

function setup() {
  var buttonRow = document.getElementsByClassName("paymentSelectButtons-selectors")[0];
  var div = document.createElement('div');
  div.innerHTML = '<button class="s-btn s-btn-secondary paymentSelectButtons-selector" type="button" id="venmo" onclick="launchVenmoPopup()">Venmo™ the peeps</button>';
  var venmoButton = div.childNodes[0];
  buttonRow.appendChild(venmoButton);
}

setup()
