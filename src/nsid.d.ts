declare namespace Xp {
	namespace Symbols {
		const Interface: unique symbol
	}

	// extract Interface from an nsIID
	type InterfaceOf<T extends InterfaceType> = T[typeof Symbols.Interface]
	interface InterfaceType {
		readonly [Symbols.Interface]: Ci.nsISupports
	}

	type Contract<I extends Ci.nsISupports> = nsCID<I>

	type UUID = string

	interface nsID {
		readonly number: UUID
		toString(): string
	}

	// InterfaceID
	interface nsIID<Interface = Ci.nsISupports> extends nsID {
		readonly name: string
		hasInstance(obj: any): boolean

		readonly [Xp.Symbols.Interface]: Interface
	}

	// ContractID
	interface nsCID<Interface extends Ci.nsISupports = Ci.nsISupports> extends nsID {
		readonly name: string
		getService(): Interface
		getService<I extends nsIID>(int: I): Xp.InterfaceOf<I>
		createInstance(): Ci.nsISupports
		createInstance<I extends nsIID>(int: I): Xp.InterfaceOf<I>
	}
}

declare namespace Ci {
	interface nsISupports {
		QueryInterface<I extends Xp.nsIID>(int: I): Xp.InterfaceOf<I>
	}

	interface nsIInterfaceRequestor {
		getInterface<I extends Xp.nsIID>(int: I): Xp.InterfaceOf<I>
	}

	interface nsIXPCComponents_Classes {
		readonly [index: string]: Xp.nsCID
	}

	interface nsIXPCComponents_Interfaces {
		readonly [index: string]: Xp.nsIID
	}
}
