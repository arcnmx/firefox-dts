namespace test_cc {
	const rawKeyData = "xxx";
	const factory: Ci.nsIKeyObjectFactory = Components.classes["@mozilla.org/security/keyobjectfactory;1"]
		.getService(Components.interfaces.nsIKeyObjectFactory);
	const keyObject = factory.keyFromString(Components.interfaces.nsIKeyObject.HMAC, rawKeyData);
	console.assert(keyObject.getType() == keyObject.HMAC);
}
