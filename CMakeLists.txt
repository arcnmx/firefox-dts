cmake_minimum_required(VERSION 3.12)
project(firefox-dts
	VERSION 0.1.0
	DESCRIPTION "firefox.d.ts"
	HOMEPAGE_URL "https://github.com/arcnmx/firefox-dts"
	LANGUAGES
)
set(PROJECT_EXTRA_AUTHOR arc)
set(PROJECT_EXTRA_REPO github:arcnmx/firefox-dts)
set(PROJECT_LICENSE MIT)

include(./cmake/git.cmake)
git_tag(PROJECT_EXTRA_GIT PREFIX v CHECK)
if (PROJECT_EXTRA_GIT AND PROJECT_EXTRA_GIT_PRERELEASE)
	set(PROJECT_EXTRA_VERSION "-${PROJECT_EXTRA_GIT_PRERELEASE}")
endif()
git_hash(PROJECT_EXTRA_GIT_HASH SHORT)
if (PROJECT_EXTRA_GIT_HASH)
	string(APPEND PROJECT_EXTRA_VERSION "+git-${PROJECT_EXTRA_GIT_HASH}")
endif()

set(TESTS TRUE CACHE BOOL "enable tests")
set(FIREFOX_IDL_ROOT "$ENV{FIREFOX_IDL_ROOT}" CACHE PATH "firefox-idl")
set(DTS_PY "$ENV{DTS_PY}" CACHE STRING "xpidl-dts")

if (CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME AND TESTS)
	include(CTest)
endif()

include(./cmake/nix.cmake)
include(./cmake/node.cmake)
include(./cmake/gen.cmake)
include(./cmake/ts.cmake)

enable_language(TypeScript)

if (NOT DTS_PY)
	set(DTS_PY "dts.py")
endif()

if (NOT IS_ABSOLUTE "${DTS_PY}")
	find_program(DTS_PY NAMES "${DTS_PY}")
	if (DTS_PY)
		set(DTS_PY "${DTS_PY}" CACHE STRING "xpidl-dts")
	else()
		nix_build_exec(DTS_PY xpidl-dts BINARY dts.py CACHE "xpidl-dts")
	endif()
endif()

if ("${FIREFOX_IDL_ROOT}" STREQUAL "")
	nix_build_exec(FIREFOX_IDL_ROOT firefox-idl CACHE "firefox-idl")
endif()
set(IDL_ROOT "${FIREFOX_IDL_ROOT}/xpidl")
set(XPCOM_ROOT "${FIREFOX_IDL_ROOT}/xpcom")

add_subdirectory(./src)
add_subdirectory(./xpcom)
add_subdirectory(./tests)
