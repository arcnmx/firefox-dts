declare namespace Xp {
	namespace Symbols {
		const Interface: unique symbol
	}

	// extract Interface from an nsIID
	type InterfaceOf<T extends InterfaceType> = T[typeof Symbols.Interface]
	interface InterfaceType {
		readonly [Symbols.Interface]: nsISupports
	}

	type Contract<I extends nsISupports> = nsCID<I>
}

declare type UUID = string

declare interface nsID {
	readonly number: UUID
	toString(): string
}

// InterfaceID
declare interface nsIID<Interface = nsISupports> extends nsID {
	readonly name: string
	hasInstance(obj: any): boolean

	readonly [Xp.Symbols.Interface]: Interface
}

// ContractID
declare interface nsCID<Interface extends nsISupports = nsISupports> extends nsID {
	readonly name: string
	getService(): Interface
	getService<I extends nsIID>(int: I): Xp.InterfaceOf<I>
	createInstance(): nsISupports
	createInstance<I extends nsIID>(int: I): Xp.InterfaceOf<I>
}

declare interface nsISupports {
	QueryInterface<I extends nsIID>(int: I): Xp.InterfaceOf<I>
}

declare interface nsIInterfaceRequestor {
	getInterface<I extends nsIID>(int: I): Xp.InterfaceOf<I>
}
