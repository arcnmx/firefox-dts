file(GLOB sources CONFIGURE_DEPENDS *.ts)

set(PROJECT_DESCRIPTION "Firefox XPCOM utilities")
set(NODE_MODULE_NAME xpcom)

add_node_module(xpcom
	PACKAGE_JSON_PATH package.json
	SOURCES ${sources}
	MODULES firefox-dts
)

generate_node_modules(node_modules
	NAME xpcom
	MODULES firefox-dts
)
