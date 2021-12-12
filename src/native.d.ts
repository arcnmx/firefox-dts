declare namespace Xp {
	namespace Symbols {
		const Native: unique symbol
	}

	type Native<Token> = { readonly [Symbols.Native]: Token }

	type nsCString = string
	type nsString = string

	type LegacyArray<_Elem> = unknown
}
