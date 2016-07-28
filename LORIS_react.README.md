#LORIS meets ReactJS

##1. Setting up Grunt

In order to run the grunt build step, you will have to install the following dependencies:

* NodeJS
* NPM

###1.1 Installing dependencies 

####1.1.1 NodeJS

To check whether or not NodeJS is installed on your machine, run the following:

```
node -v
```

If not installed, use one of the following steps to install for your OS:

#####Ubuntu

For this install you will need sudo rights

```
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y build-essential
```

#####CentOS

```
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
yum -y install nodejs
yum install gcc-c++ make
```

#####MacOS

Download the NodeJS package from [here](https://nodejs.org/en/)

####1.1.2 NPM

Once NodeJS is installed, use the following to install NPM

```
curl -L https://www.npmjs.com/install.sh | sudo sh
```

###1.2 Installing Grunt

Once NodeJS and NPM are installed, you are ready to install Grunt. First, ```cd``` into the LORIS home directory in your terminal. 
Then run the following command:

```
npm install --only=dev
```

Grunt should now be installed.

##2. Compiling JSX

###2.1 Using Grunt to compile all JSX

To compile all JSX files in LORIS, use the following command:

```
node_modules/.bin/grunt jsx
```

**NOTE:** If you create a new React file, ensure you add it to the ```Grunt.js``` file under the ```babel.compile.files``` object
with the following format:

```
'desc/file.js' : 'src/file.js'
```

###2.2 Using Babel to compile JSX

There are four major ways you can compile JSX with Babel. You can compile once or continuously a single or a directory. Using 
continuous compilation becomes useful when you are constantly making changes to the JSX file.

####2.2.1 Compile single file

To compile a single file use the following command:

```
./node_modules/.bin/babel src/file.js --out-file desc/file.js
```

####2.2.2 Compile a directory

To compile a directory use the following command:

```
./node_modules/.bin/babel src/ --out-dir desc/
```

####2.2.3 Continuously compile single file

To compile a single file continuously use the following command:

```
./node_modules/.bin/babel --watch src/file.js --out-file desc/file.js
```

####2.2.4 Continuously compile a directory

To compile a directory continuously use the following command:

```
./node_modules/.bin/babel --watch src/ --out-dir desc/
```

##3. LORIS JSX file structure

Within LORIS, we have two main ways of adding JSX and their compiled files. When creating a new JSX file **always** use the ```.js```
extension or the continuous compilation will not work as expected. The file name of the JSX and its compiled file should have the
same name. 

###3.1 Adding generic JSX files

Within LORIS we have many React components that can be used throughout the different modules. When adding a new generic file, the
JSX file should be placed in the ```jsx/``` directory and its compiled file in the ```htdocs/js/components``` directory.

###3.2 Adding module specific JSX files

In many cases, React components are designed for a specific LORIS module. In such cases the JSX file should be placed in the 
```module/$DESIRED_MODULE/jsx/``` and its compiled file in the ```module/$DESIRED_MODULE/js/``` directory.
