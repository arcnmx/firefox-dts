declare namespace Xp {
	interface Services {
	}

	interface Component {
	}
}

declare namespace Ci {
	interface nsISupports {
		QueryInterface<I extends nsIID>(int: I): Xp.InterfaceOf<I>
	}

	interface nsIInterfaceRequestor {
		getInterface<I extends nsIID>(int: I): Xp.InterfaceOf<I>
	}

	interface nsIXPCComponents_Classes {
		readonly [index: string]: nsCID
	}

	interface nsIXPCComponents_Interfaces {
		readonly [index: string]: nsIID
	}

	interface nsIXPCComponents_Utils {
	}

	// This is only forward-declared in the idl :<
	interface nsIScriptElement { }
}

declare interface ChromeUtils {
	import(url: string): any
}

declare var ChromeUtils: ChromeUtils
declare var Components: Ci.nsIXPCComponents
declare var Ci: typeof Components.interfaces
declare var Cc: typeof Components.classes
declare var Cu: typeof Components.utils

declare var EXPORTED_SYMBOLS: Array<string> | undefined
