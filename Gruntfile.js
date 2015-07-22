module.exports = function(grunt) {
	grunt.initConfig({
		sass: {
			dist: {
				options: {
					sourcemap: 'none',
					loadPath: require('node-bourbon').includePaths
				},
				files: {
					'style.css': 'style.scss'
				}
			}
		},
		watch: {
			css: {
				files: ['*.scss'],
				tasks: ['sass']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default',[]);
}
