function(regex_escape var input)
	string(REGEX REPLACE "([][+.*()^])" "\\\\\\1" out "${input}")
	set("${var}" "${out}" PARENT_DIRECTORY)
endfunction()
