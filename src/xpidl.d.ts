declare namespace Xp {
	interface Services {
	}

	interface Component {
	}
}

// This is only forward-declared in the idl :<
declare interface nsIScriptElement { }

declare interface nsISupports {
	QueryInterface<I extends nsIID>(int: I): Xp.InterfaceOf<I>
}

declare interface nsIInterfaceRequestor {
	getInterface<I extends nsIID>(int: I): Xp.InterfaceOf<I>
}

declare interface ChromeUtils {
	import(url: string): any
}

declare interface nsIXPCComponents_Classes {
	readonly [index: string]: nsCID
}

declare interface nsIXPCComponents_Interfaces {
	readonly [index: string]: nsIID
}

declare interface nsIXPCComponents_Utils {
}

declare var ChromeUtils: ChromeUtils
declare var Components: nsIXPCComponents
declare var Ci: typeof Components.interfaces
declare var Cc: typeof Components.classes
declare var Cu: typeof Components.utils

declare var EXPORTED_SYMBOLS: Array<string> | undefined
