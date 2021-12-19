file(GLOB sources CONFIGURE_DEPENDS *.ts)
set(modules firefox-dts xpcom)

add_node_module(tests
	SOURCES ${sources}
	MODULES ${modules}
)

generate_node_modules(node_modules
	NAME tests
	MODULES ${modules}
)

if (CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME AND BUILD_TESTING)
	message(WARNING "TODO: tests")
endif()
