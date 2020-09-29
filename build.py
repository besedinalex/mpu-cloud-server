from os import listdir, path, remove
from shutil import rmtree, copyfile
from argparse import ArgumentParser
from subprocess import call
from distutils.dir_util import copy_tree

# Build options to target specific OS
parser = ArgumentParser(description='Build options.')
parser.add_argument('-o', '--os', default='win')
parser.add_argument('-a', '--arch', default='x64')
args = vars(parser.parse_args())
os = args['os']
arch = args['arch']

# Checks arguments
if os != 'win' and os != 'macos' and os != 'linux':
    print('Supported systems are: win, macos, linux.')
    quit()
if arch != 'x86' and arch != 'x64':
    print('Supported architectures are: x86, x64')
    quit()

# Checks for mpu-cloud-client folder
if not path.isdir('./../mpu-cloud-client'):
    print('В папке с mpu-cloud-server должна лежать папка mpu-cloud-client')
    exit()

# Install dependencies
if not path.isdir('./node_modules'):
    call('npm i', shell=True)
if not path.isdir('./../mpu-cloud-client/node_modules'):
    call('npm i', shell=True, cwd='../mpu-cloud-client')

# Builds client
call('npm run build', shell=True, cwd='../mpu-cloud-client')

# Removes previous built client
for item in listdir('./public'):
    if item != 'draco':
        dir = './public/{}'.format(item)
        if path.isfile(dir) or path.islink(dir):
            remove(dir)
        elif path.isdir(dir):
            rmtree(dir)

# Copies built client to server
copy_tree('./../mpu-cloud-client/build', './public')

# Compiles proper sqlite3 for chosen OS and copies it to /build
command = './node_modules/.bin/node-pre-gyp install --directory=./node_modules/sqlite3'
sqlite3_path = './node_modules/sqlite3/lib/binding/node-v72'
if os == 'win':
    command += ' --target_platform=win32'
    sqlite3_path += '-win32'
elif os == 'macos':
    command += ' --target_platform=darwin'
    sqlite3_path += '-darwin'
elif os == 'linux':
    command += ' --target_platform=linux'
    sqlite3_path += '-linux'
if arch == 'x86':
    command += ' --target_arch=ia32'
    sqlite3_path += '-ia32'
elif arch == 'x64':
    command += ' --target_arch=x64'
    sqlite3_path += '-x64'
sqlite3_path += '/node_sqlite3.node'
call(command, shell=True)

# Compiles server
call('npm run build', shell=True)
command = 'pkg . --targets=node12-{}-{}'.format(os, arch)
call(command, shell=True)

# Copies sqlite3, exec and config to /build folder
if path.isdir('./build'):
    rmtree('./build')
call('mkdir build', shell=True)
copyfile(sqlite3_path, './build/node_sqlite3.node')
copyfile('./config.json', './build/config.json')
if os == 'win':
    copyfile('./mpu-cloud-server.exe', './build/MPUCloud.exe')
    remove('./mpu-cloud-server.exe')
else:
    print('\nWARNING: Copy mpu-cloud-server file to /build folder.')

print('\nBuilding is finished.\n')