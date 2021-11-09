// http://man.hubwiz.com/docset/JavaScript.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Using.html

declare const XpidlNative: unique symbol;

declare type nsid = UUID | nsJSIID;

declare interface XpServices {
}

declare interface XpComponent {
}

declare type UUID = string;

declare interface nsJSIID {
	name: string;
	number: UUID;

	toString(): [this.name];
}

declare interface nsJSCID extends nsJSIID {
	getService(ci: nsJSIID): unknown;
}

declare namespace ChromeUtils {
	function import_(url: string): any
	function import_(url: 'resource://gre/modules/Services.jsm'): { Services: XpServices } // btw: Services = Cu.createServicesCache(); ( https://fossies.org/linux/firefox/toolkit/modules/Services.jsm }
	export { import_ as import }
}

declare interface nsJSCID<Interface> extends nsJSCID {
}

declare interface nsIXPCComponents_Classes {
	readonly [index: string]: nsJSCID;
}
declare interface nsIXPCComponents_Interfaces {
	readonly [index: string]: nsJSIID;
}

declare interface nsIXPCComponents_Utils {
}

declare var Components: nsIXPCComponents
declare var Ci: typeof Components.interfaces
declare var Cc: typeof Components.classes
declare var Cu: typeof Components.utils

// an example that should typecheck:
/*
var keyObject = Components.classes["@mozilla.org/security/keyobjectfactory;1"]
.getService(Components.interfaces.nsIKeyObjectFactory)
.keyFromString(Components.interfaces.nsIKeyObject.HMAC, rawKeyData);
*/
