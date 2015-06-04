# Animator
Animator is an ES6 animation utility belt that allows you to create and sequence CSS transitions and animations together easily from script.

## Features
* CSS transition / keyframe animation creator
* Promise based animation / transition sequencer
* Style class creator
* Prefix handler
* Pause / Play sequences
* Class / style manipulation

## Usage
To run the demo download the zip and run
```unix
npm install
```
Animator uses the CSSOM for some tasks which isn't supported from the file:/// protocol in Chrome, so be sure to run the files from a server. Once the modules are installed run
```unix
npm start
```
and go to <code>http://localhost:1337</code> to see the demo. To use Animator in your projects include Animator before the closing body tag.
```html
<script src="animator.min.js"></script>
```

