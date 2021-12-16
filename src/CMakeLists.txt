set(COMBINE_IDL 0) # TODO: group more coarsely

file(GLOB sources CONFIGURE_DEPENDS *.d.ts)
file(GLOB_RECURSE idl_sources RELATIVE "${IDL_ROOT}/" "${IDL_ROOT}/*.idl")

# group idl_sources by their directory
foreach(f ${idl_sources})
	get_filename_component(idl_dir "${f}" DIRECTORY)
	list(APPEND idl_dirs "${idl_dir}")
	list(APPEND "idl_sources_${idl_dir}" "${IDL_ROOT}/${f}")
endforeach()
list(REMOVE_DUPLICATES idl_dirs)

function(idl_name var input)
	string(REPLACE "/" "_" out "${input}")
	set("${var}" "${out}" PARENT_SCOPE)
endfunction()

function(dts name)
	cmake_parse_arguments(
		PARSE_ARGV 1 _DTS
		"" "COMMAND" "ARGS"
	)
	if ("${_DTS_COMMAND}" STREQUAL "")
		set(_DTS_COMMAND "${name}")
	endif()
	add_custom_command(
		OUTPUT "${name}.d.ts"
		COMMAND "${DTS_PY}" "${_DTS_COMMAND}" "${name}.d.ts" ${_DTS_ARGS}
	)
	list(APPEND dts_generated "${CMAKE_CURRENT_BINARY_DIR}/${name}.d.ts")
	set(dts_generated "${dts_generated}" PARENT_SCOPE)
endfunction()

function(dts_combine var name)
	cmake_parse_arguments(
		PARSE_ARGV 2 _DTS
		"" "" "SOURCES"
	)
	set(out)
	foreach(file ${_DTS_SOURCES})
		get_filename_component(filename "${file}" NAME)
		list(APPEND out "/// <reference path=\"./${filename}\" />")
	endforeach()
	list(JOIN out "\n" out)

	file(GENERATE OUTPUT "${name}.d.ts" CONTENT "${out}")
	set(out "${CMAKE_CURRENT_BINARY_DIR}/${name}.d.ts")
	set("${var}" "${out}" PARENT_SCOPE)
endfunction()

dts(services ARGS "${XPCOM_ROOT}")
dts(components ARGS "${XPCOM_ROOT}")
if (COMBINE_IDL)
	list(TRANSFORM idl_sources PREPEND "${IDL_ROOT}/")
	dts(idl ARGS "${IDL_ROOT}" ${idl_sources})
else()
	foreach(dir ${idl_dirs})
		idl_name(name "${dir}")
		dts("${name}"
			COMMAND "idl"
			ARGS "${IDL_ROOT}" ${idl_sources_${dir}}
		)
	endforeach()
endif()

dts_combine(generated.d.ts generated SOURCES ${dts_generated})
dts_combine(index.d.ts index SOURCES ${sources} "${generated.d.ts}")

set(dts_includes ${sources} ${dts_generated} "${generated.d.ts}" "${index.d.ts}")

add_node_module(firefox-dts
	IMPORT_NAME @types/firefox-dts
	PACKAGE_JSON_PATH package.json
	INCLUDES ${dts_includes}
)

generate_node_modules(node_modules
	NAME firefox-dts
	SOURCES ${dts_generated}
)

#set(CPACK_SOURCE_GENERATOR "TGZ") # TODO
