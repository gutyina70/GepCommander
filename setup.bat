mkdir build
mkdir build\debug
mkdir build\release

copy "%WXWIN%\lib\wxbase315ud_gcc_custom.dll" build\debug
copy "%WXWIN%\lib\wxmsw315ud_core_gcc_custom.dll" build\debug

copy "%WXWIN%\lib\wxbase315u_gcc_custom.dll" build\release
copy "%WXWIN%\lib\wxmsw315u_core_gcc_custom.dll" build\release
