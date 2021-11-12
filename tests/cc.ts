const rawKeyData = "xxx";
const keyObject = Components.classes["@mozilla.org/security/keyobjectfactory;1"]
	.getService(Components.interfaces.nsIKeyObjectFactory)
	.keyFromString(Components.interfaces.nsIKeyObject.HMAC, rawKeyData);
