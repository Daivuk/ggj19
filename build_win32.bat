REM Clone onut
git submodule update --init

REM Create build dir
mkdir build

REM cd to build dir
cd build

REM We want to use hunter and we want to build the stand alone (onut.exe)
cmake -DONUT_USE_HUNTER=OFF -DONUT_BUILD_STANDALONE=ON -DCMAKE_BUILD_TYPE=Release ../onut/

REM Compile
MSBuild.exe libonut.sln /t:onut /p:Configuration=Release /p:Platform=Win32

REM Copy executable
cd JSStandAlone/Release
copy "onut.exe" "../../../game/ExecutableWin32.exe"

cd ../../..
