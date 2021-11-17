// http://man.hubwiz.com/docset/JavaScript.docset/Contents/Resources/Documents/developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Using.html

declare const XpidlNative: unique symbol;

declare type XpNative<Token> = { readonly [XpidlNative]: Token }

declare type nsCString = string;
declare type nsString = string;

declare interface XpServices {
}

interface XpComponent {
}

declare type XpLegacyArray<Elem> = unknown

declare type UUID = string;

// This is only forward-declared in the idl :<
declare interface nsIScriptElement { }

declare interface nsID {
	readonly number: UUID;
	toString(): string;
}

declare const XpidlInterface: unique symbol;

// InterfaceID
declare interface nsIID<Interface = nsISupports> extends nsID {
	readonly name: string;
	hasInstance(obj: any): boolean;

	readonly [XpidlInterface]: Interface
}

// extract Interface from an nsIID
type XpInterfaceOf<T extends XpidlInterfaceType> = T[typeof XpidlInterface]
declare interface XpidlInterfaceType {
	readonly [XpidlInterface]: nsISupports
}

// ContractID
declare interface nsCID<Interface extends nsISupports = nsISupports> extends nsID {
	readonly name: string;
	getService(): Interface;
	getService<I extends nsIID>(int: I): XpInterfaceOf<I>;
	createInstance(): nsISupports;
	createInstance<I extends nsIID>(int: I): XpInterfaceOf<I>;
}

declare interface nsISupports {
	QueryInterface<I extends nsIID>(int: I): XpInterfaceOf<I>;
}

declare interface nsIInterfaceRequestor {
	getInterface<I extends nsIID>(int: I): XpInterfaceOf<I>;
}

declare interface ChromeUtils {
	import(url: string): any
	import(url: 'resource://gre/modules/Services.jsm'): { Services: XpServices } // btw: Services = Cu.createServicesCache(); ( https://fossies.org/linux/firefox/toolkit/modules/Services.jsm }
}

type XpContract<I extends nsISupports> = nsCID<I>;

declare interface nsIXPCComponents_Classes {
	readonly [index: string]: nsCID;
}

declare interface nsIXPCComponents_Interfaces {
	readonly [index: string]: nsIID;
}

declare interface nsIXPCComponents_Utils {
}

declare var ChromeUtils: ChromeUtils
declare var Components: nsIXPCComponents
declare var Ci: typeof Components.interfaces
declare var Cc: typeof Components.classes
declare var Cu: typeof Components.utils
