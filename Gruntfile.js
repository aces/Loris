'use strict';
module.exports = function (grunt) {
	grunt.initConfig({
		babel: {
			compile: {
				options: {
					sourceMap: true,
					presets: ['es2015']
				},
				files: {
					'htdocs/js/components/PaginationLinks.js' : 'jsx/PaginationLinks.js'
				}
			}
		},
	});

	//grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-babel');
	//grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('jsx', ['babel']);
};
