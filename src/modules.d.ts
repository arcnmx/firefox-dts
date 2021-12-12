declare namespace Xp {
	namespace extensions {
		class Extension extends ExtensionData {
			constructor(addonData: unknown, startupReason: unknown)
		}

		class ExtensionAPI extends EventEmitter {
			readonly extension: Extension
			constructor(extension: Extension)
		}

		class ExtensionData {
			constructor(rootURI: string)
		}

		class DefaultWeakMap<K extends object, V> extends WeakMap<K, V> {
			constructor(defaultConstructor?: (key: K) => V, init?: Iterable<[K, V]>)

			get(key: K): V
		}

		class DefaultMap<K, V> extends Map<K, V> {
			constructor(defaultConstructor?: (key: K) => V, init?: Iterable<[K, V]>)

			get(key: K): V
		}

		class Management extends SchemaAPIManager {
			processType: "main"
			constructor()

			getModuleJSONURLs(): unknown[]
			lazyInit(): Promise<void>
			receiveMessage(arg: { target: unknown }): unknown
			_callHandlers(ids: unknown, event: unknown, method: unknown): void
		}

		interface APIModule {
			url: string
			schema: string
			scopes: string[]
			manifest: string[]
			events: Array<"startup">
			permissions: string[]
			paths: string[][]
		}

		class EventEmitter {
			constructor()

			has(event: string): boolean
			on(event: string, listener: EventEmitter.Listener): void
			off(event: string, listener: EventEmitter.Listener): void
			once(event: string, listener: EventEmitter.Listener): void
			emit(event: string, ...args: any[]): Promise<void> | undefined
		}
		namespace EventEmitter {
			interface Listener {
				(event: string, ...args: any[]): void
			}
		}

		class SchemaAPIManager extends EventEmitter {
			processType: "main" | "addon" | "content" | "devtools"
			protected global: null | unknown
			protected schema?: SchemaRoot
			protected modules: Map<unknown, unknown>
			protected modulePaths: { children: Map<unknown, unknown>, modules: Set<unknown> }
			protected manifestKeys: Map<unknown, unknown>
			protected eventModules: DefaultMap<unknown, unknown>
			protected settingsModules: Set<unknown>
			protected _modulesJSONLoaded: boolean
			protected schemaURLs: Map<unknown, unknown>
			protected apis: DefaultWeakMap<object, unknown>
			protected _scriptScopes: unknown[]

			constructor(processType: SchemaAPIManager['processType'], schema?: SchemaRoot)
			protected onStartup(extension: unknown): Promise<void>
			protected loadModuleJSON(urls: unknown[]): Promise<ReturnType<SchemaAPIManager['initModuleJSON']>>
			protected initModuleJSON(blobs: Iterable<unknown>): StructuredCloneHolder
			protected initModuleData(moduleData: unknown): void

			registerModules(obj: Record<string, APIModule>): void
			emitManifestEntry(extension: Extension, entry: string): any | undefined
			asyncEmitManifestEntry(extension: Extension, entry: string): Promise<undefined | any>
			getAPI(name: string, extension: Extension, scope?: string): ExtensionAPI | undefined
			asyncGetAPI(name: string, extension: Extension, scope?: string): Promise<ExtensionAPI | undefined>
			loadModule(name: string): object
			asyncLoadModule(name: string): Promise<object>
			protected asyncLoadSettingsModules(): Promise<void>
			protected getModule(name: string): unknown | undefined
			_checkGetAPI(name: string, extension: Extension, scope?: string): boolean
			protected _checkLoadModule(module: unknown, name: string): void
			_createExtGlobal(): object
			protected initGlobal(): void
			loadScript(scriptUrl: string): void
		}

		class LazyAPIManager extends SchemaAPIManager {
			protected schemaURLs: Map<unknown, unknown>

			constructor(processType: SchemaAPIManager['processType'], moduleData: unknown, schemaURLs: LazyAPIManager['schemaURLs'])
		}

		class MultiAPIManager extends SchemaAPIManager {
			children: unknown

			constructor(processType: SchemaAPIManager['processType'], children: MultiAPIManager['children'])

			lazyInit(): Promise<void>
		}

		class LocaleData {
			defaultLocale: LocaleData.LocaleName
			selectedLocale: LocaleData.LocaleName
			locales: Map<LocaleData.LocaleName, unknown>
			messages: Map<LocaleData.LocaleName, Map<LocaleData.MessageKey, string>>
			warnedMissingKeys: Set<unknown>

			constructor(data: unknown)

			serialize(): LocaleData.Serialized & {
				locales: NonNullable<LocaleData.Serialized['locales']>,
				messages: NonNullable<LocaleData.Serialized['locales']>
			}
			has(locale: string): boolean
			localizeMessage(message: string, substitutions?: string[], options?: { defaultValue?: string, cloneScope?: unknown, locale?: unknown }): string
			localize(str: string, locale?: LocaleData.LocaleName): string
			addLocale(locale: string, messages: Record<string, { message: string, placeholders?: Record<string, { replacement?: string }>, }>, extension: Extension): Map<LocaleData.MessageKey, string>

			readonly acceptLanguages: string[]
			readonly uiLocale: LocaleData.LocaleName
			readonly availableLocales: Set<LocaleData.LocaleName>
		}

		namespace LocaleData {
			type LocaleName = string
			/** case-insensitive
			 */
			type MessageKey = "@@ui_locale" | "@@bidi_dir" | "@@bidi_reversed_dir" | "@@bidi_start_edge" | "@@bidi_end_edge" | string

			interface Serialized {
				defaultLocale: LocaleName
				selectedLocale: LocaleName
				locales?: Map<LocaleName, unknown>
				messages?: Map<LocaleName, Map<MessageKey, string>>
			}
		}

		class EventManager {
			// https://searchfox.org/mozilla-central/source/toolkit/components/extensions/ExtensionCommon.jsm#2107
		}

		class BaseContext {
			constructor(envType: unknown, extension: unknown)
		}

		class CanOfAPIs {
			context: BaseContext
			apiManager: SchemaAPIManager
			root: object

			protected apis: Map<unknown, unknown>
			protected apiPaths: Map<unknown, unknown>

			constructor(context: BaseContext, apiManager: SchemaAPIManager, root: object)
		}

		interface ExtensionParent {
			readonly GlobalManager: unknown
			readonly HiddenExtensionPage: unknown
			readonly IconDetails: unknown
			readonly ParentAPIManager: unknown
			readonly StartupCache: unknown
			readonly WebExtensionPolicy: unknown
			readonly apiManager: Management
			readonly promiseExtensionViewLoaded: unknown
			readonly watchExtensionProxyContextLoad: unknown
			readonly watchExtensionWorkerContextLoaded: unknown
			readonly DebugUtils: unknown
		}

		interface ExtensionCommon {
			readonly BaseContext: typeof BaseContext
			readonly CanOfAPIs: typeof CanOfAPIs
			readonly EventManager: typeof EventManager
			readonly ExtensionAPI: unknown
			readonly EventEmitter: typeof EventEmitter
			readonly LocalAPIImplementation: unknown
			readonly LocaleData: unknown
			readonly NoCloneSpreadArgs: unknown
			readonly SchemaAPIInterface: unknown
			readonly SchemaAPIManager: typeof SchemaAPIManager
			readonly SpreadArgs: unknown
			readonly checkLoadURL: unknown
			readonly defineLazyGetter: unknown
			readonly getConsole: unknown
			readonly ignoreEvent: unknown
			readonly instanceOf: unknown
			readonly makeWidgetId: unknown
			readonly normalizeTime: unknown
			readonly runSafeSyncWithoutClone: unknown
			readonly stylesheetMap: unknown
			readonly withHandlingUserInput: unknown

			readonly MultiAPIManager: unknown
			readonly LazyAPIManager: typeof LazyAPIManager
		}

		interface ExtensionUtils {
			readonly DefaultMap: typeof DefaultMap
			readonly DefaultWeakMap: typeof DefaultWeakMap
			readonly ExtensionError: unknown
			readonly filterStack: unknown
			readonly getInnerWindowID: unknown
			readonly getUniqueId: unknown
			readonly promiseDocumentLoaded: unknown
			readonly promiseEvent: unknown
			readonly promiseObserved: unknown
		}

		interface Schemas {
			// https://searchfox.org/mozilla-central/source/toolkit/components/extensions/Schemas.jsm#3599
		}

		class Namespace extends Map {
		}

		class SchemaRoot extends Namespace {
		}
	}

	interface AppConstants {
		readonly BROWSER_CHROME_URL: string
		readonly DEBUG: boolean
		readonly DLL_PREFIX: string
		readonly DLL_SUFFIX: string
		readonly ENABLE_WEBDRIVER: boolean
		readonly HAVE_SHELL_SERVICE: boolean
		readonly IS_ESR: boolean
		readonly MENUBAR_CAN_AUTOHIDE: boolean
		readonly MOZILLA_OFFICIAL: boolean
		readonly MOZ_ALLOW_ADDON_SIDELOAD: boolean
		readonly MOZ_APP_BASENAME: string
		readonly MOZ_APP_NAME: string
		readonly MOZ_APP_VERSION: string
		readonly MOZ_APP_VERSION_DISPLAY: string
		readonly MOZ_BACKGROUNDTASKS: boolean
		readonly MOZ_BUILDID: string
		readonly MOZ_BUILD_APP: string
		readonly MOZ_OFFICIAL_BRANDING: boolean
		readonly MOZ_REQUIRE_SIGNING: boolean
		readonly MOZ_SANDBOX: boolean
		readonly NIGHTLY_BUILD: boolean
		readonly RELEASE_OR_BETA: boolean
		readonly SOURCE_REVISION_URL: string
		readonly XP_UNIX: boolean
		readonly platform: string
		readonly unixstyle: string
		isPlatformAndVersionAtLeast(platform: string, version: string): boolean
		isPlatformAndVersionAtMost(platform: string, version: string): boolean
	}
}

declare interface ChromeUtils {
	/**
	 * `Services = Cu.createServicesCache()`
	 * https://fossies.org/linux/firefox/toolkit/modules/Services.jsm
	 */
	import(url: 'resource://gre/modules/Services.jsm'): { Services: Xp.Services }
	import(url: 'resource://gre/modules/AppConstants.jsm'): { AppConstants: Xp.AppConstants }
	import(url: 'resource://gre/modules/ExtensionParent.jsm'): { ExtensionParent: Xp.extensions.ExtensionParent }
	import(url: 'resource://gre/modules/ExtensionCommon.jsm'): { ExtensionCommon: Xp.extensions.ExtensionCommon }
	import(url: 'resource://gre/modules/ExtensionUtils.jsm'): { ExtensionUtils: Xp.extensions.ExtensionUtils }
	import(url: 'resource://gre/modules/Schemas.jsm'): { Schemas: Xp.extensions.Schemas, SchemaRoot: Xp.extensions.SchemaRoot }
	import(url: 'resource://gre/modules/Extension.jsm'): {
		Extension: typeof Xp.extensions.Extension
		ExtensionData: typeof Xp.extensions.ExtensionData
		Dictionary: unknown
		Langpack: unknown
		Management: Xp.extensions.ExtensionParent['apiManager']
		ExtensionAddonObserver: unknown
	}
}
