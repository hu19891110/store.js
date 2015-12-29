#!/usr/local/bin/node

var port = 9574
var username = 'storejs'
var password = new Buffer('ZjhjMzUyNjgtNzc2ZC00ZjlkLWEwNWUtN2FkM2Q0ZDgyNzk5', 'base64').toString('utf8')


// TODO: Contribute to npm-saucelabs? Create new module?
var saucelabs = require('./util/saucelabs')
var compiler = require('./compile-lib')
var tunnel = require('./util/tunnel')

var platformSets = require('./util/saucelabs-platformSets')
log('Run node tests')
runNodeTests(function(err) {
	if (err) { return error(err) }
	log('Compile lib')
	compiler.run(function(err) {
		if (err) { return error(err) }
		log('Tunnel server')
		tunnel.setup(port, true, function(err, url) {
			saucelabs.setAuth(username, password)
			saucelabs.runTest(url, onDone
				// , saucelabs.platformSets.singleBrowserRun
				// , saucelabs.platformSets.allInternetExplorer
				// , saucelabs.platformSets.ie6
				// , saucelabs.platformSets.ie7
				// , saucelabs.platformSets.ie8
				// , saucelabs.platformSets.windows7Run
				// , saucelabs.platformSets.majorDesktopRun
				, saucelabs.platformSets.androidRun
				// , saucelabs.platformSets.iOSRun
				// , saucelabs.platformSets.OSXRun
				, saucelabs.platformSets.problematic
			)
			function onDone(err) {
				if (err) { return error(err) }
				log('Done!')
				process.exit(0)
			}			
		})
	})
})

function runNodeTests(callback) {
	var nodeTestRunner = require('../tests/node-test-runner')
	var store = require('../store.min')
	nodeTestRunner.run(store, function(err) {
		callback(err)
	})
}

function log() {
	console.log.apply(console, arguments)
}

function error(err) {
	throw new Error(err)
}